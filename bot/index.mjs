import { Client } from "oceanic.js"
import postgres from "postgres";
import { schedule } from 'node-cron';

import commandsList from "./commands/commandsList.mjs";
import config from './config/settings.mjs'

// create the discord client
const client = new Client({
    auth: config.discord.botToken,
    collectionLimits: {
        auditLogEntries: 0,
        members: 0,
        messages: 0,
        users: 0
    }
});

const commandMap = new Map()

client.pgPool = postgres({
    ...config.postgres,
    types: {
        // bigint: postgres.BigInt,
        rect: {
            to: 1700,
            from: [1700],
            serialize: x => '' + x,
            parse: parseFloat
        }
    },
    // debug: function(connection, query, params, types){
        // console.log(connection)
    //     console.log(query)
    //     console.log(params)
    // }
})

// every time the bot turns ready
client.on("ready", () => {
    client.editStatus("dnd");
});
// the first time the bot is ready
client.once("ready", async() => {
    // create commands
    client.application.bulkEditGlobalCommands(Array.from(commandsList, ([key, {name, description, category, options}]) => {return {name, description, category, options}}))
});

client.on("interactionCreate", async (interaction) => {
    await interaction.defer()
    commandsList.get(interaction.data.name).commandLogic(interaction, client)

    const currentCommandCount = commandMap.get(interaction.data.name) ?? 0
    commandMap.set(interaction.data.name, (currentCommandCount+1))
})

// An error handler
client.on("error", (error) => {
    console.error("Something went wrong:", error);
});

// connect the discord client
client.connect()


if (config.statKey !== ""){
    schedule('* * * * *', async () => {
        const req = await fetch(`https://statcord.com/api/bots/961433265879801936/stats`, {
            method: "post",
            body: JSON.stringify({
                "guildCount": client.guilds.size
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': config.statKey,
            }
        })

        commandMap.clear()
        console.log(`Stats post with response ${req.status}`)
    })
}