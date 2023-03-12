import db from "../../utils/postgres.mjs"
import {getBot} from '../../utils/oauth2/oauth.mjs'

export const route = {
	method: 'POST',
	url: '/api/bots/sync',
	schema: {
        body: {
			type: 'object',
			properties: {
				id: { type: 'string' }
			}
        },
		response: {
            401: {
                type: 'object',
                properties: {
                    message: { type: 'string', default: 'You need to be logged in!' }
                }
            },
            409: {
                type: 'object',
                properties: {
                    message: { type: 'string', default: 'The bot with the specified ID already exists!' }
                }
            },
			201: {
				type: 'object',
				properties: {
					success: { type: 'boolean', default: true },
					message: { type: 'string', default: 'The bot has been synced!' }
				}
			}
		}
	},
	handler: async (request, reply) => {
        if (!request.session.discordAccessToken) return reply.code(401).send({error: true, message: "You need to be logged in to add a bot!"});

		if (!request.body.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		const botExisits = await db`SELECT ownerid from bots WHERE botid = ${request.body.id}`.catch(err=>{})
		if (!botExisits[0]) return reply.status(409).send({message: "The bot with the specified ID does not exist!"})
		if (botExisits[0].ownerid !== request.session.discordUserInfo.id)return reply.status(401).send({message: "You do not have permission to delete this bot"})

		const bot = await getBot(request.body.id)

		db`UPDATE bots SETnusername =${bot.username}, avatar = ${bot.avatar} WHERE botid = ${request.body.id}`.catch(err=>{})

		reply.status(201).send({success: true, message: "The bot has been synced!"})
	}
}
