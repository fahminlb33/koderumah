import { AutoRouter } from 'itty-router';

import { Env } from './types';
import { HousesModule } from "./routes/house";
import { SessionModule } from "./routes/session";
import { CompletionModule } from "./routes/completion";

const router = AutoRouter()
    // House Data Management
    .post("/houses/:id/images", (req, env: Env) => new HousesModule(env).addImage(req))
    .get("/houses/:id", (req, env: Env) => new HousesModule(env).get(req))
    .post("/houses", (req, env: Env) => new HousesModule(env).create(req))
    
    // Session Management
    .get("/chat/sessions/:id", (req, env: Env) => new SessionModule(env).get(req))
    .post("/chat/sessions", (req, env: Env) => new SessionModule(env).create(req))

    // Chat Completion
    .post("/chat/completion/:sessionId/text", (req, env: Env) => new CompletionModule(env).textCompletion(req))
    .post("/chat/completion/:sessionId/image", (req, env: Env) => new CompletionModule(env).imageCompletion(req))


export default { ...router };
