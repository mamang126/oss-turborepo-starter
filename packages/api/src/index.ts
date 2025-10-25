import { Elysia } from "elysia";

const api = new Elysia({
    prefix: "/api"
}).get("/", () => "Hello Elysia")

export { api };


