import fs from "fs/promises";
import zod from "zod";

const HouseSchema = zod.object({
    id: zod.string(),
    price: zod.number(),
    address: zod.string(),
    url: zod.string().url(),
    image_url: zod.string().url(),
    content: zod.string(),
}).array();

const CreateHouseResponseSchema = zod.object({
    id: zod.string(),
    price: zod.number(),
    address: zod.string(),
    url: zod.string().url(),
    content: zod.string(),
    createdAt: zod.string(),
});

const API_HOST = "https://rumah-backend.fahminlb338482.workers.dev"

async function main() {
    // read the dataset
    const dataset = JSON.parse(await fs.readFile("data/houses.json", "utf-8"));

    // parse
    const houses = HouseSchema.parse(dataset);

    // process all
    for (const house of houses) {
        console.log("Processing: " + house.id);

        // download the image
        const image = await fetch(house.image_url);
        const imageBuffer = await image.arrayBuffer();

        // create the house
        const createHouseResponse = await fetch(`${API_HOST}/houses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                price: house.price,
                address: house.address,
                url: house.url,
                content: house.content
            })
        });

        // check if the request was successful
        if (!createHouseResponse.ok) {
            console.error(`Failed to create house! HTTP ${createHouseResponse.statusText} for ID ${house.id}`);
            continue;
        }

        // get the house ID
        const createHouseBody = CreateHouseResponseSchema.parse(await createHouseResponse.json());

        // add image to house
        const addImageResponse = await fetch(`${API_HOST}/houses/${createHouseBody.id}/images`, {
            method: "POST",
            body: imageBuffer
        });

         // check if the request was successful
         if (!addImageResponse.ok) {
            console.error(`Failed to add image to house! HTTP ${addImageResponse.statusText} for ID ${house.id} and ${createHouseBody.id}`);
            continue;
        }
    }
}

main().catch(err => console.error(err));
