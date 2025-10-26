import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./schemas/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "../../" + Bun.env.DB_FILE_NAME!,
  },
});
