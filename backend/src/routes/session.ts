import zod from 'zod';
import { IRequest } from 'itty-router';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';

import { Env } from '../types';
import { Logger } from 'shared/logging';
import { Chat, ChatCitation, House, HouseImage, Session } from '../db/schema';

const CreateRequest = zod.object({
	title: zod.string(),
});

const GetRequest = zod.object({
	id: zod.string().uuid(),
});

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
		const rows = await db
			.select()
			.from(Chat)
			.leftJoin(ChatCitation, eq(Chat.id, ChatCitation.chat_id))
			.leftJoin(House, eq(House.id, ChatCitation.house_id))
			.leftJoin(HouseImage, eq(HouseImage.house_id, House.id))
			.where(eq(Chat.session_id, body.data.id));

		return Response.json(rows);
	}
}
