import { db } from "@repo/data";
import { usersModel, usersTable } from "@repo/data/schemas";
import { userService } from "@repo/data/services";
import Elysia, { t } from "elysia";

const hashPassword = async (password: string): Promise<string> => {
  return await Bun.password.hash(password);
};

export const userController = new Elysia({
  tags: ["Users"],
}).group("/users", (app) =>
  app
    .get(
      "/",
      async () => {
        return { users: await userService.getUsers() };
      },
      {
        response: t.Object({
          users: t.Array(t.Omit(usersModel, ["password"])),
        }),
      }
    )
    .post(
      "/",
      async ({ body }) => {
        body.password = await hashPassword(body.password);
        return await userService.createUser(body);
      },
      {
        body: t.Omit(usersModel, ["id"]),
        response: t.Omit(usersModel, ["password"]),
      }
    )
    .get(
      "/:id",
      async ({ params, status }) => {
        const user = await userService.getUserById(Number(params.id));
        if (!user) {
          return status(404, { message: "User not found" });
        }
        return user;
      },
      {
        params: t.Object({ id: t.Number() }),
        response: {
          200: t.Omit(usersModel, ["password"]),
          404: t.Object({ message: t.String() }),
        },
      }
    )
    .put(
      "/:id",
      async ({ params, body }) => {
        if (body.password) {
          body.password = await hashPassword(body.password);
        }
        return await userService.updateUser(Number(params.id), body);
      },
      {
        params: t.Object({ id: t.Number() }),
        body: t.Partial(t.Omit(usersModel, ["id"])),
        response: usersModel,
      }
    )
    .delete(
      "/:id",
      async ({ params, status }) => {
        const user = await userService.deleteUser(Number(params.id));
        if (!user) {
          return status(404, { message: "User not found" });
        }
        return user;
      },
      {
        params: t.Object({ id: t.Number() }),
        response: {
          200: usersModel,
          404: t.Object({ message: t.String() }),
        },
      }
    )
);
