import zod from 'zod';
import { IRequest } from 'itty-router';
import { drizzle } from 'drizzle-orm/d1';
import { and, count, eq, inArray } from 'drizzle-orm';

import { Env } from '../types';
import { Logger } from 'shared/logging';
import { generateObjectKey, getObjectKeyFromUrl } from 'shared/helper';
import { Chat, ChatCitation, House, HouseImage, Session } from '../db/schema';
import { QueryAgent, AnswerAgent, HouseAgent, ImageAgent } from '../services/agents';

const TextCompletionRequest = zod.object({
	sessionId: zod.string(),
	prompt: zod.string(),
});

const ImageCompletionRequest = zod.object({
	sessionId: zod.string(),
	image: zod.any(),
});

const TOPK = 3;
const SIMILARITY_CUTOFF = 0.10;

export class CompletionModule {
	private _env: Env;
	private _logger: Logger;

	constructor(env: Env) {
		this._env = env;
		this._logger = new Logger('CompletionModule');
	}

	async textCompletion(req: IRequest) {
		// create logger
		const logger = this._logger.scoped('textCompletion');

		// parse request body
		const body = TextCompletionRequest.safeParse({ ...req.params, ...((await req.json()) as any) });
		if (!body.success) {
			logger.error('Invalid request body', { body: body.error });
			return Response.json({ errors: body.error }, { status: 400 });
		}

		// create agents
		const db = drizzle(this._env.DB, { logger: true });
		const queryAgent = new QueryAgent(this._env);
		const houseAgent = new HouseAgent(this._env);
		const answerAgent = new AnswerAgent(this._env);

		// get chat session
		const sessionExists = await db.select({ count: count(Chat.id) }).from(Session).where(eq(Session.id, body.data.sessionId));
		if (sessionExists[0].count === 0) {
			return Response.json({ message: 'Session not found.' }, { status: 404 });
		}

		// get chat history
		const chats = await db.select().from(Chat).where(eq(Chat.session_id, body.data.sessionId));

		// refine query
		let refinedQuery: string;
		if (chats.length === 0) {
			refinedQuery = body.data.prompt;
		} else {
			refinedQuery = await queryAgent.enrich(
				body.data.prompt,
				chats.map((chat) => chat.content || ''),
			);
		}

		// create embedding
		const embedding = await houseAgent.embed(refinedQuery);

		// search vector DB
		logger.info('Running text search...');
		const result = await this._env.VECTORIZE_TEXT_INDEX.query(embedding, { topK: TOPK, returnMetadata: true });
		const houseIds = result.matches.filter((x) => x.score > SIMILARITY_CUTOFF).map((x) => String(x.metadata!.house_id!) || "");

		// check if we have matching house
		logger.info('Semantic text search results', { ids: houseIds });
		if (houseIds.length === 0) {
			return Response.json({ message: 'No matching house image are found.' }, { status: 400 });
		}

		// find house data
		const houses = await db.select().from(House).where(inArray(House.id, houseIds));
		if (houses.length === 0) {
			return Response.json({ message: 'No matching house image are found.' }, { status: 400 });
		}

		// generate qna answer
		const answer = await answerAgent.answerContents(
			refinedQuery,
			houses.map((house) => house.content || ''),
		);

		// save chat history
		const chatRows = await db.insert(Chat).values([
			{
				id: crypto.randomUUID(),
				session_id: body.data.sessionId,
				role: 'user',
				content: refinedQuery,
			},
			{
				id: crypto.randomUUID(),
				session_id: body.data.sessionId,
				role: 'assistant',
				content: answer,
			},
		]).returning({ id: Chat.id });

		// save citations
		await db.insert(ChatCitation).values(
			houses.map((x) => ({
				id: crypto.randomUUID(),
				chat_id: chatRows[1].id,
				house_id: x.id,
			})),
		)

		return Response.json({ answer, houses });
	}

	async imageCompletion(req: IRequest) {
		// create logger
		const logger = this._logger.scoped('imageCompletion');

		// parse request body
		const body = ImageCompletionRequest.safeParse({ ...req.params, image: req.body });
		if (!body.success) {
			logger.error('Invalid request body', { body: body.error });
			return Response.json({ errors: body.error }, { status: 400 });
		}

		// create services
		const db = drizzle(this._env.DB);
		const imageAgent = new ImageAgent(this._env);
		const answerAgent = new AnswerAgent(this._env);

		// get chat session
		const sessionExists = await db.select({ count: count(Chat.id) }).from(Session).where(eq(Session.id, body.data.sessionId));
		if (sessionExists[0].count === 0) {
			return Response.json({ message: 'Session not found.' }, { status: 404 });
		}

		// upload to R2
		const uploadedObjectKey = generateObjectKey();
		const uploadedImageUrl = new URL(uploadedObjectKey.objectKey, this._env.IMAGE_BUCKET_PUBLIC_ENDPOINT).toString();
		await this._env.IMAGE_BUCKET.put(uploadedObjectKey.objectKey, body.data.image);

		// create embedding
		const embedding = await imageAgent.embed(uploadedObjectKey.objectKey);

		// search vector DB
		logger.info('Running image search...');
		const result = await this._env.VECTORIZE_IMAGE_INDEX.query(embedding, { topK: TOPK, returnMetadata: true });
		const imageIds = result.matches.filter((x) => x.score > SIMILARITY_CUTOFF).map((x) => String(x.metadata!.house_id!) || "");

		// check if we have matching house
		logger.info('Image search results', { ids: imageIds });
		if (imageIds.length === 0) {
			return Response.json({ message: 'No matching house image are found.' }, { status: 400 });
		}

		// find house data
		const houses = await db
			.select()
			.from(House)
			.where(inArray(House.id, imageIds));
		if (houses.length === 0) {
			return Response.json({ message: 'No matching house image are found.' }, { status: 400 });
		}

		// describe image
		const caption = await imageAgent.describe(uploadedObjectKey.objectKey);

		// generate summarize answer
		const answer = await answerAgent.summarizeContents(
			houses.map((x) => x.content),
		);

		// save chat history
		const chatRows = await db.insert(Chat).values([
			{
				id: crypto.randomUUID(),
				session_id: body.data.sessionId,
				role: 'user',
				imageUrl: uploadedImageUrl,
				content: caption,
			},
			{
				id: crypto.randomUUID(),
				session_id: body.data.sessionId,
				role: 'assistant',
				content: answer,
			},
		]).returning({ id: Chat.id });

		// save citations
		await db.insert(ChatCitation).values(
			houses.map((x) => ({
				id: crypto.randomUUID(),
				chat_id: chatRows[1].id,
				house_id: x.id,
			})),
		);

		return Response.json({ answer, imageUrl: uploadedImageUrl, houses });
	}
}
