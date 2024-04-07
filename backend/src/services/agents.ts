import { Ai } from "@cloudflare/ai";

import { Env } from "../types";
import { Logger } from "shared/logging";

export class QueryAgent {
    private _ai: Ai;
    private _logger: Logger;

    constructor(env: Env) {
        this._ai = new Ai(env.AI);
        this._logger = new Logger("QueryAgent");
    }

    async enrich(question: string, history: string[]): Promise<string> {
        // create scoped logger
        const logger = this._logger.scoped("enrich");

        // create messages
        const messages = [
            {
                role: "system",
                content: "Context:\n" + history.join("\n\n")
            },
            {
                role: "system",
                content: "Act as an assistant to reformulate the user question into a reformed user question to make it explicit, concise, complete," +
                    " detailed and self-contained based on the previous conversation shown in the following chat history (if exists)," +
                    " else return the user question as is." +
                    " If the user question does not need any modification, return the user question as is." +
                    " The reformed user question must be explicit, concise, complete, detailed and self-contained to be used for a document retrieval process." +
                    " Only return the reformed user question in a single line."
            },
            {
                role: "user",
                content: question
            }
        ];

        logger.info("Enriching query with history...", { messages });
        const result = await this._ai.run("@cf/meta/llama-2-7b-chat-int8", { messages, stream: false });

        // @ts-expect-error
        return result.response;
    }
}

export class AnswerAgent {
    private _ai: Ai;
    private _logger: Logger;

    constructor(env: Env) {
        this._ai = new Ai(env.AI);
        this._logger = new Logger("AnswerAgent");
    }

    async answerText(question: string, contents: string[]): Promise<string> {
        // create scoped logger
        const logger = this._logger.scoped("answerText");

        // create messages
        const messages = [
            {
                role: "system",
                content: "Context:\n" + contents.join("\n\n")
            },
            {
                role: "system",
                content: "Act as an assistant to for question-answering tasks." +
                    " Use only the information provided as CONTEXT to return an ANSWER to the REQUEST." +
                    " The ANSWER must only contain information from the CONTEXT." +
                    " If the CONTEXT does not contain the necessary information to ANSWER the REQUEST, your ANSWER must be: Sorry, I don't know." +
                    " The ANSWER must be as detailed and long as possible, including all related additional information."
            },
            {
                role: "user",
                content: question
            }
        ];

        logger.info("Generating answer for text prompt...", { messages });
        const result = await this._ai.run("@cf/meta/llama-2-7b-chat-int8", { messages, stream: true });

        // @ts-expect-error
        return result.response;
    }

    async answerImage(caption: string, contents: string[]): Promise<string> {
        // create scoped logger
        const logger = this._logger.scoped("answerText");

        // create messages
        const messages = [
            {
                role: "system",
                content: "Context:\n" + contents.join("\n\n")
            },
            {
                role: "system",
                content: "Act as an assistant to for summarization tasks." +
                    " Use only the information provided as CONTEXT to return an ANSWER to the REQUEST." +
                    " The ANSWER must only contain information from the CONTEXT." +
                    " The ANSWER must be as detailed and long as possible, including all related additional information from the context and caption."
            },
            {
                role: "user",
                content: "Caption: " + caption
            }
        ];

        logger.info("Generating answer for image prompt...", { messages });
        const result = await this._ai.run("@cf/meta/llama-2-7b-chat-int8", { messages, stream: true });

        // @ts-expect-error
        return result.response;
    }
}

export class HouseAgent {
    private _ai: Ai;
    private _logger: Logger;

    constructor(env: Env) {
        this._ai = new Ai(env.AI);
        this._logger = new Logger("HouseAgent");
    }

    async embed(content: string): Promise<number[]> {
        // create scoped logger
        const logger = this._logger.scoped("embed");

        // create embeddings
        logger.info("Embedding content...", { content });
        const embedding = await this._ai.run("@cf/baai/bge-large-en-v1.5", {text: [content]});
        
        return embedding.data[0]
    }
}

export class ImageAgent {
    private _ai: Ai;
    private _vectorStore: VectorizeIndex;
    private _logger: Logger;
    private _embeddingWorker: Fetcher;
    private _embeddingEndpoint: string;

    constructor(env: Env) {
        this._ai = new Ai(env.AI);
        this._vectorStore = env.VECTORIZE_IMAGE_INDEX;
        this._embeddingWorker = env.EMBEDDING_WORKER;
        this._embeddingEndpoint = env.IMAGE_EMBEDDING_ENDPOINT;
        this._logger = new Logger("ImageAgent");
    }

    async describe(url: string): Promise<string> {
        const logger = this._logger.scoped("describe");

        logger.info("Downloading image...", { url });
        const res = await fetch(url);
        const blob = await res.arrayBuffer();

        logger.info("Running image captioning inference...");
        const result = await this._ai.run("@cf/unum/uform-gen2-qwen-500m", { image: [...new Uint8Array(blob)] });

        logger.info("Image caption", { caption: result.description })
        return result.description;
    }

    async search(url: string, topk: number = 5): Promise<string[]> {
        const logger = this._logger.scoped("describe");

        const embedding = await this.embed(url);

        logger.info("Running image search...", { topk });
        const result = await this._vectorStore.query(embedding, { topK: topk });

        const SIMILARITY_CUTOFF = 0.75
        const ids = result.matches.filter(x => x.score > SIMILARITY_CUTOFF).map(x => x.id);

        logger.info("Image search results", { ids });
        return ids;
    }

    async embed(url: string): Promise<number[]> {
        const logger = this._logger.scoped("describe");

        logger.info("Running image embedding...", { url });
        const res = await this._embeddingWorker.fetch(this._embeddingEndpoint, {
            method: "POST",
            body: JSON.stringify({ imageUrl: url }),
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        })

        const body = await res.json();
        return body as number[];
    }
}
