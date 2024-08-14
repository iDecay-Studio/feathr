import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import unocss from 'unocss/vite';

export default defineConfig({
  plugins: [
    svelte(),
    unocss(),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});