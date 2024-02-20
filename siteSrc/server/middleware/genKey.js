export default defineEventHandler((event) => {
    if (!event.node.req.url || !(event.node.req.url.startsWith('/api/bots/') && event.node.req.url.endsWith('/genKey'))) return;

    event.context.genKey = () => {
        return "SC-xxxxxxxxxxxx4xxxyxxxxxxxx".replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }
})