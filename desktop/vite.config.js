import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import unocss from 'unocss/vite';

export default defineConfig({
  plugins: [
    svelte(),
    unocss(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});