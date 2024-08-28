import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import unocss from 'unocss/vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [
    svelte(),
    unocss(),
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    host: host || false,
    strictPort: true,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  // 4. make use of `TAURI_DEBUG` and other env variables
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});