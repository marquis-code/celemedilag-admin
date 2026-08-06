// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'CELEMEDILAG Admin',
      link: [
        { rel: 'stylesheet', href: 'https://api.fontshare.com/v2/css?f[]=clash-display@200,400,700,500,600,300&f[]=satoshi@900,700,500,300,400&display=swap' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api'
    }
  },
  devServer: {
    port: 3002
  }
})
