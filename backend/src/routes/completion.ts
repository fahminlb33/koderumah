import zod from "zod";
import { IRequest } from "itty-router";
import { drizzle } from 'drizzle-orm/d1';
import { eq } from "drizzle-orm";

import { Env } from "../types";
import { Logger } from "shared/logging";
import { Chat, ChatCitation, House, HouseImage, Session } from "../db/schema";

const TextCompletionRequest = zod.object({
    sessionId: zod.string(),
    prompt: zod.string(),
})

const ImageCompletionRequest = zod.object({
    sessionId: zod.string(),
    imageData: zod.any(),
})


export class CompletionModule {

    private _env: Env
    private _logger: Logger;

    constructor(env: Env) {
        this._env = env
        this._logger = new Logger("HousesModule");
    }

    async textCompletion(req: IRequest) {
        // create logger
        const logger = this._logger.scoped("textCompletion");

        // parse request body
        const body = TextCompletionRequest.safeParse({...req.params, ...((await req.json()) as any)});
        if (!body.success) {
            logger.error("Invalid request body", { body: body.error });
            return Response.json({ errors: body.error }, { status: 400 });
        }
    }
    
    async imageCompletion(req: IRequest) {
        // create logger
        const logger = this._logger.scoped("imageCompletion");

        // parse request body
        const body = ImageCompletionRequest.safeParse(req.body);
        if (!body.success) {
            logger.error("Invalid request body", { body: body.error });
            return Response.json({ errors: body.error }, { status: 400 });
        }
    }
}