import { getBot, updateBot } from '../../utils/postgres.mjs'

export const route = {
	method: 'POST',
	url: '/bot/:id',
	schema: {
		querystring: {
			apikey: { type: 'string' },
			stats: { type: 'string' }
		},
		header: {
			type: 'object',
			properties: {
				Authorization: { type: 'string' }
			}
		},
		body: {
			type: 'object',
			properties: {
				guilds: { type: 'number' },
				users: { type: 'number', default: 0 },
				shards: { type: 'number', default: 1 },
				cmds: { type: 'array', items: { type: 'string' } }
			}
		},
        response: {
            200: {
				type: 'object',
				properties: {
					key: { type: 'string' }
				}
            },
            204: {}
        }
	},
	handler: async (request, reply) => {
		if (!request.params.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		const auth = request.headers.Authorization || request.query.apikey
		if (!auth) return reply.status(401).send({message: "You must send an API key in the Authorization header or as \"apikey\" query parameter!"})

		const bot = await getBot(request.params.id)
		if (!bot || (!bot.public && !request.headers.Authorization)) return reply.status(404).send({message: "The bot with the specified ID does not exist!"}) // TODO: If the bot isnt public, check if the auth matches it's api key

		if (!request.body.guilds) return reply.status(400).send({message: "Please specify at least the guild count as a body parameter!", docs: "https://app.swaggerhub.com/apis-docs/DisStat/DisStat/1.0.0"})
		if (request.body.guilds < 0) return reply.status(400).send({message: "The guild count must be a positive number!"})
		if (request.body.users < 0) return reply.status(400).send({message: "The user count must be a positive number!"})
		if (request.body.shards < 0) return reply.status(400).send({message: "The shard count must be a positive number!"})

		bot.lastConnect = Date.now()
		bot.raw.push({
			date: Date.now(),
			guilds: request.body.guilds,
			users: request.body.users || 0,
			shards: request.body.shards || 1
		})
		if (request.body.cmds) {
			request.body.cmds.forEach(cmd => {
				bot.pendingCmd.push(cmd)
			})
			bot.cmds = (bot.cmds || 0) + request.body.cmds.length
		}

		updateBot(request.params.id, bot)
		delete bot.raw
		delete bot.pending
		if (request.query.stats && request.query.stats != "false") reply.send(bot)
		else reply.status(204).end()
	}
}
