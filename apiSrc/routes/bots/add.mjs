import db from "../../utils/postgres.mjs"
import {getBot} from '../../utils/oauth2/oauth.mjs'
import genKey from '../../utils/genKey.mjs'

export const route = {
	method: 'POST',
	url: '/api/bots/add',
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
					message: { type: 'string', default: 'The bot has been added to the database!' }
				}
			}
		}
	},
	handler: async (request, reply) => {
		if (!request.session.discordAccessToken) return reply.code(401).send({error: true, message: "You need to be logged in to add a bot!"});

		if (!request.body.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		const botExisits = await db`SELECT botid from botlist WHERE botid = ${request.body.id}`.catch(err=>{})
		if (botExisits[0]) return reply.status(409).send({message: "The bot with the specified ID already exists!"})

		const bot = await getBot(request.body.id)
		console.log(bot)

		db`INSERT INTO botlist(botid, ownerid) VALUES (${request.body.id}, ${request.session.discordUserInfo.id})`.catch(err=>{})
		db`INSERT INTO owners(username, ownerid) VALUES (${request.session.discordUserInfo.username}, ${request.session.discordUserInfo.id})`.catch(err=>{})
		db`INSERT INTO bots(botid, username, avatar, token) VALUES (${request.body.id}, ${bot.username}, ${bot.avatar}, ${genKey()})`.catch(err=>{})

		reply.status(201).send({success: true, message: "The bot has been added to the database!"})
	}
}
