import { db } from "@repo/data";
import { usersModel, usersTable } from "@repo/data/schemas";
import { UserService } from "@repo/data/services";
import Elysia, { t } from "elysia";
import { crudPlugin } from "../plugin/crud.plugin";

const hashPassword = async (password: string): Promise<string> => {
  return await Bun.password.hash(password);
};

export const userController = new Elysia({
  tags: ["Users"],
}).group("/users", (app) =>
  app.decorate("userService", new UserService()).use(
    crudPlugin(
      new UserService(),
      {
        create: t.Omit(usersModel, ["id"]),
        edit: t.Partial(t.Omit(usersModel, ["id"])),
        get: t.Omit(usersModel, ["password"]),
      },
      { prefix: "users" }
    )
  )
);
