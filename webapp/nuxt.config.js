function getAnalytics() {
  if (!process.env.ANALYTICS_ENABLED || !process.env.ANALYTICS_DOMAIN_URL || !process.env.ANALYTICS_URL) {
    return;
  }

  return {
    script: [
      {
        type: 'text/javascript',
        src: process.env.ANALYTICS_URL,
        async: true,
        defer: true,
        'data-domain': process.env.ANALYTICS_DOMAIN_URL,
      },
    ],
  };
}

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  server: {
    port: process.env.PORT || 5000,
  },

  publicRuntimeConfig: {
    apiUrl: process.env.API_URL || 'http://localhost:3000',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Comptrain WODs History',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Find all comptrain workouts (WODs) history' },
      { property: 'og:title', content: 'Comptrain WODs History' },
      { property: 'og:url', content: 'https://wods.vincenthardouin.dev/' },
      {
        property: 'og:image',
        content:
          'https://images.unsplash.com/photo-1603233720024-4ee0592a58f9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80',
      },
      { property: 'og:description', content: 'Find all comptrain workouts (WODs) history' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],

    ...getAnalytics(),
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
