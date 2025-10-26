import { eq } from "drizzle-orm";
import { db } from "..";
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";

export class ServiceParent {
  schema: SQLiteTableWithColumns<any>;
  constructor(schema: SQLiteTableWithColumns<any>) {
    this.schema = schema;
  }

  async getAll(
    page: number,
    pageSize: number
  ): Promise<(typeof this.schema.$inferSelect)[]> {
    return db
      .select()
      .from(this.schema)
      .limit(pageSize)
      .offset(page * pageSize)
      .all();
  }

  async getById(
    id: number
  ): Promise<typeof this.schema.$inferSelect | undefined> {
    return db.select().from(this.schema).where(eq(this.schema.id, id)).get();
  }

  async create(
    data: typeof this.schema.$inferInsert
  ): Promise<typeof this.schema.$inferSelect> {
    return db.insert(this.schema).values(data).returning().get();
  }

  async update(
    id: number,
    data: typeof this.schema.$inferInsert
  ): Promise<typeof this.schema.$inferSelect | undefined> {
    return db
      .update(this.schema)
      .set(data)
      .where(eq(this.schema.id, id))
      .returning()
      .get();
  }

  async delete(
    id: number
  ): Promise<typeof this.schema.$inferSelect | undefined> {
    return db
      .delete(this.schema)
      .where(eq(this.schema.id, id))
      .returning()
      .get();
  }
}
