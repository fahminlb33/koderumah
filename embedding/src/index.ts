import zod from "zod";
import * as jpeg from "jpeg-js";
import * as tf from '@tensorflow/tfjs';

import { getLogger } from "shared/logging"

export interface Env {
	SERVICE_NAME: string;
	EMBEDDING_MODEL_URL: string;
}

// set backend to CPU
await tf.setBackend("cpu");

function preprocess(imageTensor: tf.Tensor<tf.Rank>) {
	// calculate aspect ratio
	const widthToHeight = imageTensor.shape[1]! / imageTensor.shape[0];

	// calculate crop dimensions
	let squareCrop;
	if (widthToHeight > 1) {
		const heightToWidth = imageTensor.shape[0] / imageTensor.shape[1]!;
		const cropTop = (1 - heightToWidth) / 2;
		const cropBottom = 1 - cropTop;
		squareCrop = [[cropTop, 0, cropBottom, 1]];
	} else {
		const cropLeft = (1 - widthToHeight) / 2;
		const cropRight = 1 - cropLeft;
		squareCrop = [[0, cropLeft, 1, cropRight]];
	}

	// expand image input dimensions to add a batch dimension of size 1
	const imgExpanded = tf.expandDims(imageTensor) as unknown as tf.TensorLike

	// ctop and resize
	const crop = tf.image.cropAndResize(imgExpanded, squareCrop, [0], [224, 224]);

	// normalize to [0, 1]
	return crop.div(255);
}

const requestSchema = zod.object({
	imageUrl: zod.string().url(),
})

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const logger = getLogger(env.SERVICE_NAME, "fetch");

		// check request
		const reqBody = requestSchema.safeParse(await request.json());
		if (!reqBody.success) {
			logger.error(reqBody.error);
			return new Response(reqBody.error.message, { status: 400 });
		}

		// load model
		logger.info("Downloading model...")
		const model = await tf.loadGraphModel(env.EMBEDDING_MODEL_URL, { fromTFHub: true });

		// download image
		logger.info("Downloading image...")
		const imgRes = await fetch(reqBody.data.imageUrl);
		const img = await imgRes.arrayBuffer();

		// decode image
		logger.info("Decoding image...")
		const imgDecoded = jpeg.decode(img, { useTArray: true, formatAsRGBA: false, maxMemoryUsageInMB: 50 });

		// preprocess image
		logger.info("Preprocessing image...")
		const imgTensor = tf.tensor3d(imgDecoded.data, [imgDecoded.height, imgDecoded.width, 3]);
		const preprocessed = preprocess(imgTensor);

		// execute model
		logger.info("Executing model...")
		const features = model.execute(preprocessed) as unknown as tf.Tensor2D;
		const embedding = features.as1D().arraySync();

		return Response.json(embedding);
	},
};
