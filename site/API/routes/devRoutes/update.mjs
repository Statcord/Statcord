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
				users: { type: 'number' },
				shards: { type: 'number' },
				cmds: { type: 'array', items: { type: 'string' } }
			}
		},
        response: {
            200: {
				type: 'object',
				properties: {
					key: { type: 'string' }
				}
            }
        }
	},
	handler: (request, reply) => {
		if (!request.params.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		if (!disstat.has(request.params.id) || !disstat.get(request.params.id, "public")) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})

		const auth = request.headers.Authorization || request.query.apikey
		if (!auth) return reply.status(401).send({message: "You must send an API key in the Authorization header or as \"apikey\" query parameter!"})

		if (!request.body.guilds) return reply.status(400).send({message: "Please specify at least the guild count as a body parameter!", docs: "https://app.swaggerhub.com/apis-docs/DisStat/DisStat/1.0.0"})

		const bot = disstat.get(request.params.id)
		bot.lastConnect = Date.now()
		bot.raw.push({
			date: Date.now(),
			guilds: request.body.guilds,
			users: request.body.users || 0,
			shards: request.body.shards || 1
		})
		if (request.body.cmds) {
			request.body.cmds.forEach(cmd => {
				bot.pendingCmd.push(request.body.cmd)
			})
			bot.cmds = (bot.cmds || 0) + request.body.cmds.length
		}

		disstat.set(request.params.id, bot)
		delete bot.raw
		delete bot.pending
		if (request.query.stats && request.query.stats != "false") reply.send(bot)
		else reply.status(204).end()
	}
}
