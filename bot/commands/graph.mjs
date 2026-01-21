import pg from "../utils/pg.mjs";
import { formatTime, validateTimes } from "../utils/times.mjs"
import makeChart from '../utils/genChart.mjs'
import formatDate from '../utils/formatDate.mjs'

export default {
    name: "graph",
    commandLogic: async interaction => {
        const botID = interaction.data.options.raw.find(a=>a.name=="id"||a.name=='mention')?.value
        if (!botID) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "No user supplied. Either mention a user or include an id.", color: 0x97c227}]}).catch(e=>console.log(e))

        const bot = await pg`SELECT username, public FROM bots WHERE botid = ${botID}`.catch(() => {})
        if (bot.length === 0) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "Bot does not exist.", color: 0x97c227}]}).catch(e=>console.log(e))
        if (!bot[0].public) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "Bot is not public.", color: 0x97c227}]}).catch(e=>console.log(e))

        const chartID = interaction.data.options.raw.find(a=>a.name=="chart").value

        const chartsettings = await pg`SELECT * FROM chartsettings WHERE botid = ${botID} and chartid = ${chartID}`.catch(() => {})
        if (!chartsettings[0]) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "Error loading chart settings.", color: 0x97c227}]}).catch(e=>console.log(e))
        if (!chartsettings[0].enabled) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "Chart is not enabled.", color: 0x97c227}]}).catch(e=>console.log(e))

        const time = interaction.data.options.raw.find(a=>a.name=="time")?.value ?? "7D"
        if (!validateTimes(time)) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "Invalid time range.", color: 0x97c227}]}).catch(e=>console.log(e))
        const timeFormated = formatTime(time);

        let data = []
        let chartTime = []
        switch(chartsettings[0].category){
            case "commands": {
                const dOut = await pg`select sum(amount), ${chartID === "cmdTotalUse" ? pg`DATE_TRUNC(${timeFormated.groupBy}, ${pg('timestamp')})::date` : pg('command')} AS t from commandsrun where botid = ${botID} and timestamp > ${timeFormated.start} group by t`
                console.log(dOut)
                chartTime=dOut.map(a=>chartID === "cmdTotalUse"?formatDate(a.t) : a.t)
                data = dOut.map(a=>a.sum)
            }
            break;
            case "default": {
                const dOut = await pg`SELECT avg(${pg(chartID.toLowerCase())}), DATE_TRUNC(${timeFormated.groupBy}, timestamp)::date AS t FROM mainstats WHERE botid = ${botID} and timestamp > ${timeFormated.start} group by t`.catch(a=>console.log(a))
                chartTime=dOut.map(a=>formatDate(a.t))
                data = dOut.map(a=>Number(a.avg.toFixed(0)))
            }
            break;
        }

        if (data.length === 0) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "No data to display.", color: 0x97c227}]}).catch(e=>console.log(e))
        
        const buffer = makeChart({
            option: {
                title: {
                    text: chartID,
                },
                legend: {
                    data: [chartID],
                },
                xAxis: {
                    data: chartTime
                },
                yAxis: {
                    scale: true
                },
                series: [{
                    name: chartID,
                    type: chartsettings[0].type,
                    data,
                }]
            }
        });
        
        interaction.createFollowup({
            embeds: [
                {
                    title: `${chartID} for ${bot[0].username}`,
                    description: `[View ${bot[0].username} on Statcord](https://statcord.com/bots/${botID}/)`,
                    image: {url: `attachment://${botID}.png`},
                    color: 0x97c227
                }
            ],
            files: [{name: `${botID}.png`, contents: buffer}]
        }).catch(e=>{
            console.log(e)
        })
    },
    description: "View specific stats on a chart for a bot.",
    options: [
        {
            name: "chart",
            description: "The chart to view",
            type: 3,
            choices: [
                {
                    "name": "commands",
                    "value": "cmdTotalUse"
                },
                {
                    "name": "top commands",
                    "value": "topCmds"
                },
                {
                    "name": "shards",
                    "value": "shardCount"
                },
                {
                    "name": "members",
                    "value": "members"
                },
                {
                    "name": "ram",
                    "value": "ramUsage"
                },
                {
                    "name": "users",
                    "value": "userCount"
                },
                {
                    "name": "cpu",
                    "value": "cpuUsage"
                },
                {
                    "name": "servers",
                    "value": "guildCount"
                }
                
            ],
            required: true
        },
        {
            name: "time",
            description: "Timeframe for charts. Default 7D.",
            type: 3,
            choices: [
                // {
                //     "name": "6H",
                //     "value": "6H"
                // },
                // {
                //     "name": "12H",
                //     "value": "12H"
                // },
                {
                    "name": "1D",
                    "value": "1D"
                },
                {
                    "name": "3D",
                    "value": "3D"
                },
                {
                    "name": "7D",
                    "value": "7D"
                },
                {
                    "name": "1MO",
                    "value": "1MO"
                },
                {
                    "name": "3MO",
                    "value": "3MO"
                },
                {
                    "name": "6MO",
                    "value": "6MO"
                },
                {
                    "name": "9MO",
                    "value": "9MO"
                },
                {
                    "name": "1Y",
                    "value": "1Y"
                },
                {
                    "name": "3Y",
                    "value": "3Y"
                },
                {
                    "name": "5Y",
                    "value": "5Y"
                },
                {
                    "name": "All Time",
                    "value": "AllTime"
                }
            ],
            required: false
        },
        {
            name: "id",
            description: "The ID of the bot",
            type: 3,
            required: false
        },
        {
            name: "mention",
            description: "Mention the bot",
            type: 6,
            required: false
        }
    ]
};