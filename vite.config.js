import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import unocss from 'unocss/vite';
import {fileURLToPath, URL} from "node:url";

export default defineConfig({
  plugins: [
    svelte(),
    unocss(),
  ],
  resolve: {
    alias: [
      {find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url))},
    ],
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});