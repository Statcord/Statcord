import {Client} from 'oceanic.js'

const {configFile} = useRuntimeConfig()

const client = new Client({
    auth: configFile.discord.botToken
});

export default defineEventHandler((event) => {
    event.context.oauth = {
        ...client,
        async exchangeCode(options){
            const tokens = await client.rest.oauth.exchangeCode({
                code: options.code,
                clientSecret: configFile.discord.clientSecret,
                clientID: configFile.discord.botID,
                redirectURI: configFile.domain + "/api/oauth/callback"
            }).catch(e=> console.log(e));
            console.log(tokens)


            
            return {
                redirect: configFile.domain,
                tokens
            }
        }
    }
})