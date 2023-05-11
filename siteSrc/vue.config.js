const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  "devServer": {
    client: {
      webSocketURL: 'wss://local.numselli.xyz/ws'
    },
    allowedHosts: 'all'
  },
  configureWebpack: {
    experiments: {
      topLevelAwait: true
    }
  }
})