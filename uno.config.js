import {defineConfig, presetTypography, presetUno} from 'unocss';

export default defineConfig({
  content: {
    filesystem: [
      '**/*.{html,js,svelte}',
    ],
  },
  presets: [
    presetUno(), presetTypography()
  ],
})