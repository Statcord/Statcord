import { updateBot } from "../../utils/postgres.mjs"

export const route = {
	method: 'POST',
	url: '/api/bots',
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
		if (!request.headers.Authorization) return reply.status(401).send({message: "You need to be logged in to add a bot!"})
		if (!tokens.has(request.headers.Authorization)) return reply.status(401).send({message: "Your token is invalid!"})

		if (!request.body.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		if (disstat.has(request.body.id)) return reply.status(409).send({message: "The bot with the specified ID already exists!"})

		const botres = await fetch("https://discord.com/api/v10/applications/" + request.body.id + "/rpc", {headers: {"Authorization": "Bot " + token}})
		if (!botres.ok) return reply.status(400).send({message: "The bot with the specified ID does not exist!"})
		reply.status(201).send({success: true, message: "The bot has been added to the database!"})

		const json = await botres.json()

		updateBot(json.id, {
			id: json.id,
			name: json.name,
			avatar: json.icon,
			owner: tokens.get(request.headers.Authorization).id,
			public: json.bot_public,
			verified: (json.flags & 65536) == 65536,
			added: Date.now(),
			lastConnect: 0,
			cmds: 0,
			raw: {}, // Entry for every day, which includes the guild count, shard count etc
			pending: [], // List of pending entries for raw, which will be added to raw on midnight
			pendingCmd: []
		})
	}
}
