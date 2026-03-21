// https://nuxt.com/docs/api/configuration/nuxt-config
import settings from "./config/settings.mjs"

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],

  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

   vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },

  umami: {
    id: 'f1a7b62f-bcde-4dbf-9fbc-b04b1af2fb48',
    host: 'https://insights.numselli.xyz/',
    useDirective: true,
    customEndpoint: '/',
    ignoreLocalhost: true
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

  modules: ['@nuxt/ui', "@nuxtjs/seo", "@nuxtjs/sitemap", "@nuxt/image", "nuxt-umami"],

  site: {
    url: 'https://statcord.com',
    trailingSlash: true,
    indexable: true
  },

  sitemap: {
    sitemaps: {
      bots:{
        sitemapName: "bots",
        sources:[
          `${settings.domain}/api/sitemap/bots`
        ]
      },
      users:{
        sitemapName: "users",
        sources:[
          `${settings.domain}/api/sitemap/users`
        ]
      },
      default:{
        sitemapName: "default",
        "includeAppSources": true
      }
    }
  },

  robots: {
    "disallow": [
      '/webfonts/'
    ]
  },

  "seo": {
    "redirectToCanonicalSiteUrl": true
  },
  
  routeRules: {
    '/support': {
      redirect: {
        to: `https://discord.gg/4rBwqK5pUU`,
        statusCode: 308
      }
    }
  },

  "dev": true,

  devServer: {
    "https": false,
    "host": "0.0.0.0"
  },

  compatibilityDate: "2025-02-10"
})