import { readdir } from 'fs/promises'
import { handlersMeta } from "#internal/nitro/virtual/server-handlers";

const files = new Map()
readdir("./server/api", { recursive: true, "withFileTypes":true, })
.then(async foundFiles => {    
    foundFiles.forEach(async file => {
        if (!file.isFile()) return;

        const {schema} = await import(`../../${file.path}/${file.name}`);

        let routeString = `${file.path}/${file.name}`.replace(".mjs", "").split("server").pop().replace(".post", "").replace(".delete", "").replace('[', ":").replace(']', "")
        if (routeString.endsWith("/index")) routeString = routeString.split("/index").shift()
        if (routeString === "") routeString = '/'        

        files.set(routeString, schema)
    })
})



export default defineEventHandler((event) => {
    if (!event.node.req.url || event.node.req.url !== "/api/docs/json") return;
    // if (event.context.openapiJSON) return

    const config = useRuntimeConfig(event)

    event.context.openapiJSON = {
        openapi: "3.0.0",
        info: {
            title: "DisStat API Routes",
            version: config.public.version,
        },
        schemes: ["https"],
        paths: getPaths(),
    };
})


function getPaths() {
    const paths = {};

    for (const h of handlersMeta) {
        if (h.route .startsWith("/_"))  break;

        const { route, parameters } = normalizeRoute(h.route);
        const method = (h.method || "get").toLowerCase();

        const rawPathSchema = files.get(h.route)
        
        const item = {
            [method]: {
                parameters: rawPathSchema.parameters ?  [...parameters, ...rawPathSchema.parameters] : parameters,
                ...rawPathSchema
            },
        };

        if (paths[route] === undefined) {
            paths[route] = item;
        } else {
            Object.assign(paths[route], item);
        }
    }

    return paths;
}

function normalizeRoute(_route) {
    const parameters = [];

    let anonymousCtr = 0;
    const route = _route
        .replace(/:(\w+)/g, (_, name) => `{${name}}`)
        .replace(/\/(\*)\//g, () => `/{param${++anonymousCtr}}/`)
        .replace(/\*\*{/, "{")
        .replace(/\/(\*\*)$/g, () => `/{*param${++anonymousCtr}}`);

    const paramMatches = route.matchAll(/{(\*?\w+)}/g);
    for (const match of paramMatches) {
        const name = match[1];
        if (!parameters.some((p) => p.name === name)) {
            parameters.push({ name, in: "path", required: true, content: {
                media: "application/json"
            } });
        }
    }

    return {
        route,
        parameters,
    };
}