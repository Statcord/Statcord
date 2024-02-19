import { readdir, writeFile } from 'fs/promises'
import config from './config/settings.mjs'

const openapiJSON = {
    openapi: "3.0.0",
    info: {
        title: "Statcord API Routes",
        version: config.version
    },
    schemes: ["https"],
    paths: {}
}

const apiDir = await readdir("./server/api", { recursive: true, "withFileTypes": true })
for (const file of apiDir) {
    if (!file.isFile()) continue;
    
    const {schema} = await import(`./${file.path}/${file.name}`);
    
    const fileName = `${file.path}/${file.name}`.replace(".mjs", "").split("server").pop().split(".")
    const method = fileName[1] ?? "get"
    
    let routeString = fileName[0].replace(".post", "").replace(".delete", "").replace('[', "{").replace(']', "}")
    if (routeString.endsWith("/index")) routeString = routeString.split("/index").shift()
    if (routeString === "") routeString = '/'
    
    if (schema.hidden) continue;
    
    if (typeof openapiJSON.paths[routeString] === "undefined") {
        openapiJSON.paths[routeString] = {
            [method]: schema
        };
    } else {
        Object.assign(openapiJSON.paths[routeString], {
            [method]: schema
        });
    }
}

writeFile('swaggerRoutes.mjs', `export default ${JSON.stringify(openapiJSON)}`);
// console.log(openapiJSON)