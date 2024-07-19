// https://nuxt.com/docs/api/configuration/nuxt-config
import settings from "./config/settings.mjs"

export default defineNuxtConfig({
  extends: ['nuxt-umami'],

  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  appConfig: {
    umami: {
      id: 'f1a7b62f-bcde-4dbf-9fbc-b04b1af2fb48',
      host: 'https://insights.numselli.xyz/',
      version: 2,
      ignoreDnt: true,
      useDirective: true,
      customEndpoint: '/',
      ignoreLocalhost: true
    }
  },

  runtimeConfig: {
    public: {
      version: settings.version,
      botID: settings.discord.botID,
      domain: settings.domain
    },
    session: {
      ttl: 604800,
      redisURL: settings.redisURL,
      session: {
        idLength: 64
      }
    },
    configFile: settings
  },

  css: [
    '@materializecss/materialize/dist/css/materialize.min.css'
  ],

  modules: ['@nuxt/ui', "@nuxtjs/seo", "@nuxt/image"],

  site: {
    url: 'https://statcord.com',
  },

  sitemap: {
    sources: [
      '/api/sitemap/bots',
      '/api/sitemap/users',
    ],
  },

  robots: {
    "disallow": [
      '/webfonts/'
    ]
  },

  "seo": {
    "redirectToCanonicalSiteUrl": true
  },

  ui: {
    "disableGlobalStyles": true
  },

  routeRules: {
    '/support': {
      redirect: {
        to: `https://discord.gg/qsHxVUnXqr`,
        statusCode: 308
      }
    }
  },

  "dev": true,

  devServer: {
    "https": false,
    "host": "0.0.0.0"
  },

  compatibilityDate: '2024-07-18'
})