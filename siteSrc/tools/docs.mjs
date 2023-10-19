import { readdir, writeFile } from 'fs/promises'
import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'


const API = fastify();
API.register(fastifySwagger, {

}).after(async () => {
  const routeCatagorys = await readdir("./server/api/")
  await Promise.all(routeCatagorys.map(async routeCatagory => {
    const endpoints = await readdir(`./modules/api/${routeCatagory}`)
    await Promise.all(endpoints.map(async endpoint => {
      const { schema } = await import(`../modules/api/${routeCatagory}/${endpoint}`)
      API.route({ ...schema, handler: () => { } })
    }))
  }))
})


API.listen({ port: 8090, host: "0.0.0.0" }, async err => {
  if (err) throw err
  await writeFile('./swaggerRoutes.mjs', `export default ${JSON.stringify(API.swagger())}`)
  console.log(`Routes saved`)
  API.close()
});