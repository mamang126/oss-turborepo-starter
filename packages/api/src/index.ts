import { Elysia, ValidationError } from "elysia";
import { userController } from "./controller/user.controller";
import openapi from "@elysiajs/openapi";
import { auth, OpenAPI } from "@repo/data";
import { authPlugin } from "./plugin/auth.plugin";

const api = new Elysia({
  prefix: "/api",
})
  .use(
    openapi({
      path: "/docs",
      documentation: {
        info: {
          title: "API Documentation",
          description: "API documentation for the Elysia application",
          version: "1.0.0",
        },
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .onError((error) => {
    if (error.error instanceof ValidationError) {
      return {
        message: JSON.parse(error.error.message).summary,
        name: "ValidationError",
      };
    }
    if (error.error instanceof Error) {
      console.error(`[${error.error.name}]`, error.error);
      return { message: error.error, name: error.error.name };
    }
    return { error: "An error occurred", detail: "Internal Server Error" };
  })
  .mount(auth.handler)
  .use(authPlugin)
  .use(userController);

export { api };
