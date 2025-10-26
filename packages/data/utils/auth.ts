import { betterAuth, type Path } from "better-auth";
import { db } from "../index";
import { openAPI } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../schemas";

export const authBasePath = "/api/auth";

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  authBasePath,
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());
const avoidPaths = [
  "/sign-in/social",
  "/forget-password",
  "/reset-password",
  "/verify-email",
  "/send-verification-email",
  "/change-email",
  "/change-password",
  "/reset-password/{token}",
  "/request-password-reset",
  "/link-social",
  "/delete-user/callback",
  "/unlink-account",
  "/ok",
  "/error",
];

export const OpenAPI = {
  getPaths: (prefix = authBasePath) =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        if (!paths[path] || avoidPaths.includes(path)) continue;
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method];

          operation.tags = ["Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;

export { auth };
