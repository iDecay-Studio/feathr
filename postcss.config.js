import UnoCSS from '@unocss/postcss'
import atImport from 'postcss-import';
import cssnano from 'cssnano';

const dev = process.env.NODE_ENV !== 'production'

export default {
  plugins: [
    UnoCSS(),
    atImport,
    !dev && cssnano({
      preset: 'default'
    })
  ]
}