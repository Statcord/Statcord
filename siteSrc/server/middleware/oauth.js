import {Client} from 'oceanic.js'
import { useRuntimeConfig } from '#imports';

const {configFile} = useRuntimeConfig()

const client = new Client({
    auth: configFile.discord.botToken
});

const allowedRotes = [
    "/api/oauth/callback",
    '/api/bots/add',
    "/settings/sync"
]

export default defineEventHandler((event) => {
    console.log(event.path)
    if (!allowedRotes.some(a=>event.path.includes(a))) return;

    event.context.oauth = {
        ...client,
        async exchangeCode(options){
            const tokens = await client.rest.oauth.exchangeCode({
                code: options.code,
                clientSecret: configFile.discord.clientSecret,
                clientID: configFile.discord.botID,
                redirectURI: configFile.domain + "/api/oauth/callback"
            }).catch(e => console.log(e));

            return {
                redirect: configFile.domain,
                tokens
            }
        }
    }
})