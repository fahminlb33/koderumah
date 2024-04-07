export interface Env {
	IMAGE_EMBEDDING_ENDPOINT: string;
	IMAGE_BUCKET_PUBLIC_ENDPOINT: string;

	AI: any;
	
	DB: D1Database;

	IMAGE_BUCKET: R2Bucket;

	EMBEDDING_WORKER: Fetcher;

	VECTORIZE_IMAGE_INDEX: VectorizeIndex;
	VECTORIZE_TEXT_INDEX: VectorizeIndex;
}
