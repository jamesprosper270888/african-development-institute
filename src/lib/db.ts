import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL as string;

if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
