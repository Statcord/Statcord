import {Client} from 'oceanic.js'
import { useRuntimeConfig } from '#imports';

const {configFile} = useRuntimeConfig()

const client = new Client({
    auth: configFile.discord.botToken
});

const oauth = {
    ...client,
    exchangeCode,
    getHelper: client.rest.oauth.getHelper,
    getUser: client.rest.users.get
}

async function exchangeCode(options){
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

export default defineEventHandler((event) => {
    event.context.oauth = oauth
})