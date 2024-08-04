import path from "path";

import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "@server": path.resolve(__dirname, "./server"),
      "@client": path.resolve(__dirname, "./client"),
    },
  },
});
