import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as services from "./services/index";
import * as schemas from "./schemas/index";
import { ServiceParent } from "./parents/service.parent";

const sqlite = new Database("../../" + Bun.env.DB_FILE_NAME!);
const db = drizzle({ client: sqlite });

export { db, services, ServiceParent, schemas };
