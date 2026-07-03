import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://prisme:prisme@localhost:5432/prisme";

/**
 * Én pool pr. proces — genbruges på tværs af HMR-reloads i dev,
 * så vi ikke lækker forbindelser.
 */
const globalForDb = globalThis as unknown as { __prismePool?: Pool };

const pool =
  globalForDb.__prismePool ??
  new Pool({ connectionString, max: 10 });

if (process.env.NODE_ENV !== "production") globalForDb.__prismePool = pool;

export const db = drizzle(pool, { schema });
export type Db = typeof db;
export * as tables from "./schema";
