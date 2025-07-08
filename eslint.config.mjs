// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    'vue/no-v-text-v-html-on-component': 'warn',
    'vue/no-unused-properties': 'error',
    'vue/html-closing-bracket-newline': 'warn',
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'any',
          normal: 'always',
          component: 'always'
        }
      }
    ]
  }
});
