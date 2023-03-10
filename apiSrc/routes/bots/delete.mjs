import db from "../../utils/postgres.mjs"

export const route = {
	method: 'DELETE',
	url: '/api/bots/delete',
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
            404: {
                type: 'object',
                properties: {
                    message: { type: 'string', default: 'The bot with the specified ID does not exist!' }
                }
            },
			201: {
				type: 'object',
				properties: {
					success: { type: 'boolean', default: true },
					message: { type: 'string', default: 'The bot has been deleted' }
				}
			}
		}
	},
	handler: async (request, reply) => {
		if (!request.session.discordAccessToken) return reply.code(401).send({error: true, message: "You need to be logged in to add a bot!"});

		if (!request.body.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		const botExisits = await db`SELECT botid from bots WHERE botid = ${request.body.id}`.catch(err=>{})
		if (!botExisits[0]) return reply.status(409).send({message: "The bot with the specified ID does not exist!"})

		db`DELETE FROM bots WHERE botid = ${request.body.id}`.catch(err=>{})

		reply.status(201).send({success: true, message: "The bot has been deleted"})
	}
}
