const {configFile} = useRuntimeConfig()

export default defineEventHandler((event) => {
    const url = event.node.req.url.split("?")[0]

    switch (url){
        case "/api/v3/stats": {
            event.context.newstwebhook = configFile.webhooks.newSt
        }
        break;
    }
})