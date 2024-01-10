// https://nuxt.com/docs/api/configuration/nuxt-config
import settings from "./config/settings.mjs"

export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  runtimeConfig:{
    public: {
      version: "1.0.0"
    },
    configFile: settings
  },

  css: [
    '@materializecss/materialize/dist/css/materialize.min.css'
  ],

  plugins: [
    {
      src: '~/plugins/materialize.js',
      mode: 'client' },
    {
      src: '~/plugins/auth.js',
      mode: 'client'
    }
  ],

  modules: [
    '@sidebase/nuxt-session'
  ],

   session: {
     session: {
       "expiryInSeconds": 604800,
      storageOptions: {
        driver: 'redis',
        options: {
          base: "sessions",
          url: 'redis://192.168.0.23:6379',
          ttl: 604800
        }
      }
    }
  },

  routeRules:{
    '/login': {
      redirect: {
        to:`https://discord.com/api/oauth2/authorize?client_id=${settings.discord.botID}&response_type=code&redirect_uri=${encodeURIComponent(settings.domain + "/api/oauth/callback")}&scope=identify+applications.builds.read&prompt=none`,
        statusCode: 308
      }
    },
    '/support': {
      redirect: {
        to:`https://discord.gg/qsHxVUnXqr`,
        statusCode: 308
      }
    }
  },
  
  "dev": true,
  devServer: {
    "https": false,
    "host": "0.0.0.0"
  }
})