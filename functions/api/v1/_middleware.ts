import { handleMiddleware } from "hono/cloudflare-pages";

export const onRequest: PagesFunction = handleMiddleware(async (c, next) => {
  await next();
});
