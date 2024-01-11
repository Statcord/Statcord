export default defineEventHandler((event) => {
    if (!event.node.req.url || !(event.node.req.url === "/api/bots/genKey" || event.node.req.url === "/api/bots/add")) return;

    event.context.utils = {
        genKey: () => {
            return "DS-xxxxxxxxxxxx4xxxyxxxxxxxx".replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8)
                return v.toString(16)
            })
        },
        defaultChartSettings: {
            guildCount: {
                name: "Guild Growth",
                type: "line",
                label: "This Week"
            },
            shardCount: {
                name: "Shards",
                type: "line",
                label: "This Week"
            },
            members: {
                name: "Members",
                type: "line",
                label: "This Week"
            },
            userCount: {
                name: "User Count",
                type: "line",
                label: "This Week"
            },
            cpuUsage: {
                name: "CPU Usage",
                type: "line",
                label: "This Week"
            },
            ramUsage: {
                name: "Ram Usage",
                type: "line",
                label: "This Week"
            },
            totalRam: {
                name: "Total Ram",
                type: "line",
                label: "This Week"
            }
        }
    }
})