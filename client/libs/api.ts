import { hc } from "hono/client";

import type { App } from "@server/index";

const client = hc<App>("/");

export const api = client.api.v1;
