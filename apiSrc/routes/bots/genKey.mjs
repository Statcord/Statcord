import db from "../../utils/postgres.mjs"
import genKey from '../../utils/genKey.mjs'

export const route = {
	method: 'POST',
	url: '/api/bots/genKey',
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
                    message: { type: 'string', default: 'The bot with the specified ID does not exist!' }
                }
            },
			201: {
				type: 'object',
				properties: {
					key: { type: 'string'}
				}
			}
		}
	},
	handler: async (request, reply) => {
		if (!request.session.discordAccessToken) return reply.code(401).send({error: true, message: "You need to be logged in to add a bot!"});

		if (!request.body.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		const botExisits = await db`SELECT ownerid from bots WHERE botid = ${request.body.id}`.catch(err=>{})
		if (!botExisits[0]) return reply.status(409).send({message: "The bot with the specified ID does not exist!"})
		if (botExisits[0].ownerid !== request.session.discordUserInfo.id)return reply.status(401).send({message: "You do not have permission to do this"})

        const key = genKey()

		db`UPDATE bots SET token = ${key} WHERE botid = ${request.body.id}`.catch(err=>{})

		reply.status(201).send({key})
	}
}
