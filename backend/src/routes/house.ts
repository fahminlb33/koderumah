import zod from "zod";
import { IRequest } from "itty-router";
import { drizzle } from 'drizzle-orm/d1';
import { and, eq } from "drizzle-orm";

import { Env } from "../types";
import { Logger } from "shared/logging";
import { HouseAgent, ImageAgent } from "../services/agents";
import { House, HouseImage } from "../db/schema";

const CreateRequest = zod.object({
    price: zod.number().min(1),
    address: zod.string(),
    content: zod.string(),
    url: zod.string().url(),
})

const GetRequest = zod.object({
    id: zod.string().uuid(),
})

const AddImageRequest = zod.object({
    id: zod.string().uuid(),
    image: zod.any(),
})

export class HousesModule {

    private _env: Env
    private _logger: Logger;

    constructor(env: Env) {
        this._env = env
        this._logger = new Logger("HousesModule");
    }

    async create(req: IRequest) {
        // create logger
        const logger = this._logger.scoped("create");

        // parse request body
        const body = CreateRequest.safeParse(await req.json());
        if (!body.success) {
            logger.error("Invalid request body", { body: body.error });
            return Response.json({ errors: body.error }, { status: 400 });
        }

        logger.info("Inserting text embedding to index...");

        // get text embedding
        const houseAgent = new HouseAgent(this._env);
        const embeddings = await houseAgent.embed(body.data.content);

        // save to SQL DB
        const db = drizzle(this._env.DB);
        const row = await db.insert(House).values({
            id: crypto.randomUUID(),
            price: body.data.price,
            address: body.data.address,
            content: body.data.content,
            url: body.data.url
        }).returning();

        // save to vector DB
        const entry = { id: crypto.randomUUID(), values: embeddings, metadata: { house_id: row[0].id } };
        await this._env.VECTORIZE_TEXT_INDEX.insert([entry]);

        return Response.json(row[0]);
    }

    async get(req: IRequest) {
        // create logger
        const logger = this._logger.scoped("get");

        // parse request body
        const body = GetRequest.safeParse({ ...req.params });
        if (!body.success) {
            logger.error("Invalid request body", { body: body.error });
            return Response.json({ errors: body.error }, { status: 400 });
        }

        // save to SQL DB
        const db = drizzle(this._env.DB);
        const houses = await db.select().from(House).where(eq(House.id, body.data.id)).limit(1);
        if (houses.length === 0) {
            return Response.json(null, { status: 404 });
        }

        const house = houses[0];
        const images = await db.select().from(HouseImage).where(eq(HouseImage.house_id, house.id));

        Object.assign(house, { images: images });

        return Response.json(house);
    }

    async addImage(req: IRequest) {
        // create logger
        const logger = this._logger.scoped("addImage");

        // parse request body
        console.log(req)
        const body = AddImageRequest.safeParse({ ...req.params, image: req.body });
        if (!body.success) {
            logger.error("Invalid request body", { body: body.error });
            return Response.json({ errors: body.error }, { status: 400 });
        }

        // upload to R2
        const id = crypto.randomUUID();
        const url = new URL(id + ".jpg", this._env.IMAGE_BUCKET_PUBLIC_ENDPOINT).toString();
        await this._env.IMAGE_BUCKET.put(id + ".jpg", body.data.image);

        // get image embedding
        const imageAgent = new ImageAgent(this._env);
        const embeddings = await imageAgent.embed(id + ".jpg");

        logger.info("Inserting image embedding to index...");

        // save to SQL DB
        const db = drizzle(this._env.DB);
        const row = await db.insert(HouseImage).values({
            id: id,
            house_id: body.data.id,
            url: url
        }).returning();

        // save to vector DB
        const entry = { id: id, values: embeddings, metadata: { house_id: body.data.id } };
        await this._env.VECTORIZE_IMAGE_INDEX.insert([entry]);

        return Response.json(row[0]);
    }
}
