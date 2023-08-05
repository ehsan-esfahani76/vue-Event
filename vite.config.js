import { fileURLToPath, URL } from "node:url";
import svgLoader from "vite-svg-loader";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port:5179
  },
  plugins: [
    vue(),
    svgLoader()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});