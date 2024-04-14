import { Ai } from '@cloudflare/ai';

import { Env } from '../types';
import { Logger } from 'shared/logging';

const MODEL_REGISTRY = {
	TEXT_GENERATION: '@cf/meta/llama-2-7b-chat-int8',
	TEXT_EMBEDDING: '@cf/baai/bge-large-en-v1.5',
	IMAGE_TO_TEXT: '@cf/unum/uform-gen2-qwen-500m',
	TEXT_SUMMARIZATION: '@cf/facebook/bart-large-cnn'
} as const;

export class HouseAgent {
	private _ai: Ai;
	private _logger: Logger;

	constructor(env: Env) {
		this._ai = new Ai(env.AI);
		this._logger = new Logger('HouseAgent');
	}

	async embed(content: string): Promise<number[]> {
		// create scoped logger
		const logger = this._logger.scoped('embed');

		// create embeddings
		logger.debug('Embedding content...', { content });
		const embedding = await this._ai.run(MODEL_REGISTRY.TEXT_EMBEDDING, { text: [content] });

		return embedding.data[0];
	}
}

export class QueryAgent {
	private _ai: Ai;
	private _logger: Logger;

	constructor(env: Env) {
		this._ai = new Ai(env.AI);
		this._logger = new Logger('QueryAgent');
	}

	async enrich(question: string, history: string[]): Promise<string> {
		// create scoped logger
		const logger = this._logger.scoped('enrich');

		// create messages
		const messages = [
			{
				role: 'assistant',
				content: 'Context:\n' + history.join('\n\n'),
			},
			{
				role: 'system',
				content:
					'Act as an assistant to reformulate the user question to make it explicit, concise, complete, ' +
					'detailed and self-contained based on the previous conversation shown in the context. ' +
					'Only return the reformulated question in a single line and do not include other text.',
			},
			{
				role: 'user',
				content: question,
			},
		];

		// call the AI model
		const result = await this._ai.run(MODEL_REGISTRY.TEXT_GENERATION, { messages, stream: false });
		// @ts-expect-error
		const response = result.response;

		logger.debug('Enriched query', { messages, result });
		return response;
	}
}

export class AnswerAgent {
	private _ai: Ai;
	private _logger: Logger;

	constructor(env: Env) {
		this._ai = new Ai(env.AI);
		this._logger = new Logger('AnswerAgent');
	}

	async answerContents(question: string, contents: string[]): Promise<string> {
		// create scoped logger
		const logger = this._logger.scoped('answerText');

		// create messages
		const messages = [
			{
				role: 'assistant',
				content: 'Context:\n' + contents.map(x => '- ' + x).join('\n'),
			},
			{
				role: 'system',
				content:
					'Act as an assistant to for question-answering tasks. ' +
					"Answer in a concise and detailed manner, no longer than 300 words. " +
					"Use only the information provided in the context to answer the user's question, " +
					"if the context does not contain the necessary information, return: Sorry, I don't know.",
			},
			{
				role: 'user',
				content: question,
			},
		];

		// call the AI model
		const result = await this._ai.run(MODEL_REGISTRY.TEXT_GENERATION, { messages, stream: false });
		// @ts-expect-error
		const response = result.response;

		logger.debug('Generated answer for text prompt', { messages, response });
		return response;
	}

	async summarizeContents(contents: string[]): Promise<string> {
		// create scoped logger
		const logger = this._logger.scoped('answerText');

		// create messages
		const messages = [
			{
				role: 'system',
				content:
					'Act as an assistant to for summarization tasks. ' +
					"Answer in a concise and detailed manner, no longer than 300 words. " +
					"Use only the information provided in the context to summarize the context."
			},
			{
				role: 'user',
				content: 'Context:\n' + contents.map(x => '- ' + x).join('\n'),
			},
		];

		// call the AI model
		const result = await this._ai.run(MODEL_REGISTRY.TEXT_GENERATION, { messages, stream: false });
		// @ts-expect-error
		const response = result.response;

		logger.debug('Generated answer for image prompt', { messages, response });
		return response;
	}
}

export class ImageAgent {
	private _ai: Ai;
	private _logger: Logger;
	private _embeddingWorker: Fetcher;
	private _embeddingEndpoint: string;
	private _bucket: R2Bucket;

	constructor(env: Env) {
		this._ai = new Ai(env.AI);
		this._embeddingWorker = env.EMBEDDING_WORKER;
		this._embeddingEndpoint = env.IMAGE_EMBEDDING_ENDPOINT;
		this._bucket = env.IMAGE_BUCKET;
		this._logger = new Logger('ImageAgent');
	}

	async describe(objectKey: string): Promise<string> {
		const logger = this._logger.scoped('describe');

		logger.debug('Downloading image...', { objectKey });
		const res = await this._bucket.get(objectKey);
		const blob = (await res?.arrayBuffer())!;

		logger.debug('Running image captioning inference...');
		const result = await this._ai.run(MODEL_REGISTRY.IMAGE_TO_TEXT, { image: [...new Uint8Array(blob)] });

		logger.debug('Summarize image caption', { caption: result.description });
		const summarized = await this._ai.run(MODEL_REGISTRY.TEXT_SUMMARIZATION, {
			input_text: result.description,
		})

		logger.debug('Image caption', { caption: summarized.summary });
		return summarized.summary;
	}

	async embed(objectKey: string): Promise<number[]> {
		const logger = this._logger.scoped('embed');

		logger.debug('Running image embedding...', { objectKey });
		const res = await this._embeddingWorker.fetch(this._embeddingEndpoint, {
			method: 'POST',
			body: JSON.stringify({ objectKey: objectKey }),
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		});

		const body = await res.json();
		return body as number[];
	}
}
