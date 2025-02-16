// https://nuxt.com/docs/api/configuration/nuxt-config
import settings from "./config/settings.mjs"

export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
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
        // includeAppSources: true,
        // filter the URLs to only include pages
        // include: ['/bots/**'],
        sources:[
          '/api/sitemap/bots'
        ]
      },
      users:{
        sitemapName: "users",
        // includeAppSources: true,
        // filter the URLs to only include pages
        // include: ['/users/**'],
        sources:[
          '/api/sitemap/users'
        ]
      },
      default:{
        sitemapName: "default",
        "includeAppSources": true,
      }
    },
    sources:[
      '/api/sitemap/bots',
      '/api/sitemap/users'
    ]
  },
  // old working version     "@nuxtjs/sitemap": "^5.3.5",


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

  compatibilityDate: "2025-02-10"
})