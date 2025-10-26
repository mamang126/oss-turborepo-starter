import { ServiceParent } from "@repo/data";
import Elysia, { t, type TSchema } from "elysia";

export const crudPlugin = (
  service: ServiceParent,
  model: {
    create: TSchema;
    edit?: TSchema;
    get: TSchema;
  },
  config: { prefix: string }
) =>
  new Elysia({
    name: "crud-plugin",
    seed: config,
  })
    .get(
      `/`,
      async ({ query }) => {
        return {
          [config.prefix]: await service.getAll(
            Number(query.page),
            Number(query.pageSize)
          ),
        };
      },
      {
        query: t.Object({
          page: t.Optional(
            t.Number({
              default: 0,
            })
          ),
          pageSize: t.Optional(
            t.Number({
              default: 10,
            })
          ),
        }),
        response: t.Object({
          [config.prefix]: t.Array(model.get || model),
        }),
      }
    )
    .post(
      "/",
      async ({ body }) => {
        return await service.create(body as typeof service.schema.$inferInsert);
      },
      {
        body: model.create || model,
        response: model.get || model,
      }
    )
    .get(
      "/:id",
      async ({ params, status }) => {
        const entity = await service.getById(Number(params.id));
        if (!entity) {
          return status(404, { message: "Entity not found" });
        }
        return entity;
      },
      {
        params: t.Object({ id: t.Number() }),
        response: {
          200: model.get || model,
          404: t.Object({ message: t.String() }),
        },
      }
    )
    .put(
      "/:id",
      async ({ params, body }) => {
        return await service.update(
          Number(params.id),
          body as typeof service.schema.$inferInsert
        );
      },
      {
        params: t.Object({ id: t.Number() }),
        body: model.edit || model.create || model,
        response: model.get || model,
      }
    )
    .delete(
      "/:id",
      async ({ params, status }) => {
        const entity = await service.delete(Number(params.id));
        if (!entity) {
          return status(404, { message: "Entity not found" });
        }
        return entity;
      },
      {
        params: t.Object({ id: t.Number() }),
        response: {
          200: model.get || model,
          404: t.Object({ message: t.String() }),
        },
      }
    );
