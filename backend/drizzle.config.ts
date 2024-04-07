import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'd1',
  dbCredentials: {
    dbName: process.env.DB_NAME!,
    wranglerConfigPath: "wrangler.toml"
  },
} satisfies Config;
