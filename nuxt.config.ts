import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  alias: {
    '@components': fileURLToPath(new URL('./components', import.meta.url)),
    '@composables': fileURLToPath(new URL('./composables', import.meta.url)),
    '@services': fileURLToPath(new URL('./services', import.meta.url)),
    '@typings': fileURLToPath(new URL('./typings', import.meta.url)),
    '@utils': fileURLToPath(new URL('./utils', import.meta.url))
  },
  compatibilityDate: '2025-05-15',
  css: ['~/assets/scss/main.scss', '~/assets/css/tailwind.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss']
});
