import { createResolver, defineNuxtModule, addServerHandler } from 'nuxt/kit'

import routeList from './routes/list.mjs'


export default defineNuxtModule({
  meta: {
    name: 'api'
  },
  async setup () {
    const { resolve } = createResolver(import.meta.url)

    routeList.map(async route=>{
      addServerHandler({
        route: route.sc.url,
        method: route.sc.method.toLowerCase(),
        handler:       resolve(`./routes/${route.file}`)  
      })
    })
  }
  
})