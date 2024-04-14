import zod from 'zod';
import { IRequest } from 'itty-router';
import { drizzle } from 'drizzle-orm/d1';
import { eq, inArray } from 'drizzle-orm';

import { Env } from '../types';
import { Logger } from 'shared/logging';
import { Chat, ChatCitation, House, HouseImage, Session } from '../db/schema';

const CreateRequest = zod.object({
	title: zod.string(),
});

const GetRequest = zod.object({
	id: zod.string().uuid(),
});

type GetResponseDTO = {
	id: string;
	role: string;
	content: string;
	createdAt: string;
	imageUrl: string | null;
	houses: {
		id: string;
		price: number;
		address: string;
		content: string;
		images: string[];
	}[];
};

export class SessionModule {
	private _env: Env;
	private _logger: Logger;

	constructor(env: Env) {
		this._env = env;
		this._logger = new Logger('SessionModule');
	}

	async create(req: IRequest) {
		// create logger
		const logger = this._logger.scoped('create');

		// parse request body
		const body = CreateRequest.safeParse(await req.json());
		if (!body.success) {
			logger.error('Invalid request body', { body: body.error });
			return Response.json({ errors: body.error }, { status: 400 });
		}

		// save to DB
		const db = drizzle(this._env.DB);
		const row = await db
			.insert(Session)
			.values({
				id: crypto.randomUUID(),
				title: body.data.title,
			})
			.returning();

		return Response.json(row[0]);
	}

	async get(req: IRequest) {
		// create logger
		const logger = this._logger.scoped('get');

		// parse request body
		const body = GetRequest.safeParse({ ...req.params });
		if (!body.success) {
			logger.error('Invalid request body', { body: body.error });
			return Response.json({ errors: body.error }, { status: 400 });
		}

		// find from DB
		const db = drizzle(this._env.DB);
		const chats = await db
			.select()
			.from(Chat)
			.where(eq(Chat.session_id, body.data.id));

		const houses = await db
			.select()
			.from(House)
			.leftJoin(ChatCitation, eq(ChatCitation.house_id, House.id))
			.where(inArray(ChatCitation.chat_id, chats.map(x => x.id)));

		const images = await db
			.select()
			.from(HouseImage)
			.where(inArray(HouseImage.house_id, houses.map(x => x.houses.id)));

		// project data
		const dto: GetResponseDTO[] = [];
		for (const chat of chats) {
			dto.push({
				id: chat.id,
				role: chat.role!,
				content: chat.content!,
				createdAt: chat.createdAt!,
				imageUrl: chat.imageUrl,
				houses: houses.filter(x => x.chat_citations?.chat_id === chat.id).map(x => ({
					id: x.houses.id,
					price: x.houses.price,
					address: x.houses.address,
					content: x.houses.content,
					images: images.filter(y => y.house_id === x.houses.id).map(y => y.url)
				}))
			})
		}

		return Response.json(dto);
	}
}
