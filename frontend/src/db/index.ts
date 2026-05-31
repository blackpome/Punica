import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const rawUrl =
  process.env.DATABASE_URL ?? "postgres://localhost:5432/__placeholder__";

// Configure SSL explicitly instead of via the `sslmode` query param. This
// avoids the pg-connection-string deprecation warning about 'require' being
// an alias for 'verify-full', while keeping certificate verification on for
// hosted databases.
const url = new URL(rawUrl);
const sslmode = url.searchParams.get("sslmode");
url.searchParams.delete("sslmode");

const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
const sslDisabled = sslmode === "disable" || isLocal;

const pool = new Pool({
  connectionString: url.toString(),
  ssl: sslDisabled ? undefined : { rejectUnauthorized: true },
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;
