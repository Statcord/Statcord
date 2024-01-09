import {Client} from 'oceanic.js'
const client = new Client({
    auth: "Bot OTYxNDMzMjOykpKutVrH8"
});

export default defineEventHandler((event) => {
    event.context.oauth = client
})