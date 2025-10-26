import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database("../../" + Bun.env.DB_FILE_NAME!);
const db = drizzle({ client: sqlite });

export { db };
