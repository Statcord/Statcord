import { updateBot } from '../../../utils/postgres.mjs'

export const route = {
	method: 'POST',
	url: '/api/bots/:id/update',
	schema: {
        response: {
			401: {
				type: 'object',
				properties: {
					message: { type: 'string', default: "You're not authorized to edit this bot!" }
				}
			},
			404: {
				type: 'object',
				properties: {
					message: { type: 'string', default: 'The bot with the specified ID does not exist!' }
				}
			},
            200: {
                type: 'array',
                items: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						avatar: { type: 'string' },
						verified: { type: 'boolean' }
					}
				}
            }
        }
	},
	handler: async (request, reply) => {
		if (!request.headers.Authorization) return reply.status(401).send({message: "You need to be logged in to update a bots data!"})
		if (!tokens.has(request.headers.Authorization)) return reply.status(401).send({message: "Your token is invalid!"})

		if (!request.body.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		if (!disstat.has(request.body.id)) return reply.status(404).send({message: "The bot with the specified ID doesn't exist!"})

		const botres = await fetch("https://discord.com/api/v10/applications/" + request.body.id + "/rpc", {headers: {"Authorization": "Bot " + token}})
		if (!botres.ok) return reply.status(400).send({message: "The bot with the specified ID does not exist!"})

		const json = await botres.json()
		reply.status(200).send({name: json.name, avatar: json.icon, verified: (json.flags & 65536) == 65536})

		updateBot(json.id, {
			name: json.name,
			avatar: json.icon,
			verified: (json.flags & 65536) == 65536
		})
	}
}
