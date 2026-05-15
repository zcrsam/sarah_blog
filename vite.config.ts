import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(__dirname),
  assetsInclude: ["**/*.JPG", "**/*.JPEG", "**/*.PNG", "**/*.HEIC", "**/*.MOV", "**/*.mov"],
  server: {
    port: 5173,
    host: "0.0.0.0",
    open: true,
  },
});
