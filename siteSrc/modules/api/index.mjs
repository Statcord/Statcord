import { createResolver, defineNuxtModule, addServerHandler } from 'nuxt/kit'
import fs from 'fs/promises'

export default defineNuxtModule({
  meta: {
    name: 'api'
  },
  async setup() {
    const { resolve } = createResolver(import.meta.url)

    const routeCatagorys = await fs.readdir("./modules/api/routes")
    Promise.all(routeCatagorys.map(async routeCatagory => {
      const endpoints = await fs.readdir(`./modules/api/routes/${routeCatagory}`)
      Promise.all(endpoints.map(async endpoint => {
        const { schema } = await import(`./routes/${routeCatagory}/${endpoint}`)
        addServerHandler({
          route: schema.url,
          method: schema.method.toLowerCase(),
          handler: resolve(`./routes/${routeCatagory}/${endpoint}`)
        })
      }))
    }))
  }
})