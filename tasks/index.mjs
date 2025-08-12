import { Client } from "oceanic.js"
import { schedule } from 'node-cron';
import postgres from "postgres";
import Redis from "ioredis";
import config from './config/settings.mjs'

const redis = new Redis(config.redisURL);

const redisDelKeys = ['legacyRouteTracking', 'botPostingIntervals', 'botDubbleNotifCheck']

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

// create the database client
const pgPool = postgres({
    ...config.postgres,
    types: {
        // bigint: postgres.BigInt,
        rect: {
            to: 1700,
            from: [1700],
            serialize: x => '' + x,
            parse: parseFloat
        }
    }
})



// Every sunday at midnight get sync username and avatar from Discord. If the bot or user has been deleted from Discord it gets marked for deletion from our service 
schedule('0 0 * * Sun', async () => {
    const allBots = await pgPool`SELECT * FROM bots WHERE flags != 1`
    
    allBots.forEach(async bot => {
        const discordBotUser = await client.rest.users.get(bot.botid)
        
        if (discordBotUser.username.startsWith("deleted_user_")) {
            await pgPool`UPDATE bots SET flags = 1 WHERE botid = ${bot.botid}`.catch(e=>{});
            return;
        }
        
        if (bot.username === discordBotUser.username && bot.avatar === discordBotUser.avatar) return;
        
        await pgPool`UPDATE bots SET username = ${discordBotUser.username}, avatar = ${discordBotUser.avatar} WHERE botid = ${bot.botid}`.catch(e=>{});
    })

    const allUsers = await pgPool`SELECT * FROM owners WHERE flags != 1`
    
    allUsers.forEach(async user => {
        const discordUser = await client.rest.users.get(user.ownerid)
        
        if (discordUser.username.startsWith("deleted_user_")) {
            await pgPool`UPDATE bots SET flags = 1 WHERE ownerid = ${user.ownerid}`.catch(e=>{});
            await pgPool`UPDATE owners SET flags = 1 WHERE ownerid = ${user.ownerid}`.catch(e=>{});
            return;
        }
        
        if (user.username === discordUser.username && user.avatar === discordUser.avatar) return;
        
        await pgPool`UPDATE bots SET username = ${discordUser.username}, avatar = ${discordUser.avatar} WHERE botid = ${user.ownerid}`.catch(e=>{});
    })
})

// On the first of each month go though all bots marked for deletion and delete all data from our service
schedule("0 0 1 * *", async () => {
    const allBots = await pgPool`SELECT botid FROM bots WHERE flags = 1`

    allBots.forEach(async bot => {
        pgPool`DELETE FROM chartsettings WHERE botid = ${bot.botid}`.catch(() => {})
        pgPool`DELETE FROM botlinks WHERE botid = ${bot.botid}`.catch(() => {})
        pgPool`DELETE FROM bots WHERE botid = ${bot.botid}`.catch(() => {})
        pgPool`DELETE FROM newst WHERE botid = ${bot.botid}`.catch(() => {})

        pgPool`DELETE FROM mainstats WHERE botid = ${bot.botid}`.catch(() => {})
        pgPool`DELETE FROM customcharts WHERE botid = ${bot.botid}`.catch(() => {})
        pgPool`DELETE FROM commandsrun WHERE botid = ${bot.botid}`.catch(() => {})

        redisDelKeys.forEach(e=>redis.del(`${e}:${bot.botid}`))
    })
})