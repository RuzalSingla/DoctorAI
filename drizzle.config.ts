import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Point to the generated Drizzle schema that defines reminders & appointments
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
