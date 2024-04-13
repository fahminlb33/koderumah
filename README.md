# House Recommendation RAG

House recommendation on CloudFlare AI.

## Requirements

- Node v20.12.0
- npm v10.5.0
- Wrangler v3.0.0 or newer

You'll need CloudFlare Worker Pro Plan to be able to use Vectorize service which currently are in Beta.

## Tech Stack

- Vite
- React
- Radix UI
- Tailwind CSS
- zod
- itty-router
- jpeg-js
- @tensorflow/tfjs
- drizzle-orm
- CloudFlare services used: Pages, Workers, Workers AI, Vectorize, D1, R2

## Deployment

Step 1: Clone this repo, install the npm packages, and create the necessary databases, buckets, and indexes.

```bash
# clone the repo
git clone https://github.com/fahminlb33/koderumah.git

# install npm packages
npm install

# create D1 databases
npx wrangler d1 create rumah-db
npx wrangler d1 execute rumah-db --remote --file=./backend/drizzle/0000_lame_ezekiel.sql

npx wrangler d1 create rumah-db-preview
npx wrangler d1 execute rumah-db-preview --remote --file=./backend/drizzle/0000_lame_ezekiel.sql

# create R2 buckets
# make sure to allow public access and copy the URL to the wrangler.toml
npx wrangler r2 bucket create rumah-images 
npx wrangler r2 bucket create rumah-images-preview

# create Vectorize indexes
npx wrangler vectorize create rumah-text-index --metric=cosine --dimensions=1024
npx wrangler vectorize create rumah-image-index --metric=cosine --dimensions=1280
```

Step 2: Copy the IDs to `wrangler.toml` in the `backend`, `frontend`, and `embedding` directory.

Step 3: Deploy the apps.

```bash
# deploy the embedding worker first
npm run deploy -w embedding

# copy the worker URL to backend/wrangler.toml in the service binding
# deploy the backend
npm run deploy -w backend

# deploy the frontend
npm run deploy -w frontend
```

Step 4: Import the dataset by editing the `API_HOST` in the `shared/cli/import.ts` file. Point it to your backend URL.

```bash
# run import using the data from shared/data/houses.json
npm run run:import -w shared
```

You can now access your frontend app and try it!
