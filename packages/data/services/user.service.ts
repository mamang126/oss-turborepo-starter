import { eq } from "drizzle-orm";
import { db } from "..";
import { usersModel, usersTable } from "../schemas";

export const userService = {
  getUsers: () => {
    return db.select().from(usersTable).all();
  },
  getUserById: (id: number) => {
    return db.select().from(usersTable).where(eq(usersTable.id, id)).get();
  },
  createUser: (user: typeof usersModel.static) => {
    return db.insert(usersTable).values(user).returning().get();
  },
  updateUser: (id: number, user: Partial<typeof usersModel.static>) => {
    return db
      .update(usersTable)
      .set(user)
      .where(eq(usersTable.id, id))
      .returning()
      .get();
  },
  deleteUser: (id: number) => {
    return db.delete(usersTable).where(eq(usersTable.id, id)).returning().get();
  },
};
