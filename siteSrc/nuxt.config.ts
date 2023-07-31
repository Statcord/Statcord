// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true
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
  routeRules:{
    '/login': {
      redirect: {
        to:`https://discord.com/api/oauth2/authorize?client_id=${process.env.discordBotID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.domain + "/api/discordOauth/callback")}&scope=identify&prompt=none`,
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