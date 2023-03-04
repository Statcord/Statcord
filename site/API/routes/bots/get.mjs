export const route = {
	method: 'GET',
	url: '/api/bots/:id',
	schema: {
		querystring: {
			locale: { type: 'string' },
			timezone: { type: 'string' }
		},
        response: {
			400: {
				type: 'object',
				properties: {
					message: { type: 'string', default: 'Please specify the bot ID as a parameter!' }
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
						id: { type: 'string' },
						name: { type: 'string' },
						avatar: { type: 'string' }
					}
				}
            }
        }
	},
	handler: (request, reply) => {
		if (!request.params.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		if (!disstat.has(request.params.id)) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})

		const bot = disstat.get(request.params.id)
		bot.charts = [{
			name: "Guild count",
			type: "line",
			data: Object.entries(bot.raw).map(([date, data]) => [new Date(date).getTime(), data.guilds]),
			labels: Object.entries(bot.raw).map(([date, data]) => new Date(date).toLocaleDateString(request.query.locale || "en-US", {timeZone: request.query.timezone || "UTC"})),
			borderColor: "rgb(255, 99, 132)"
		},{
			name: "Command usage",
			type: "line",
			data: Object.entries(bot.raw).map(([date, data]) => [new Date(date).getTime(), data.cmds]),
			labels: Object.entries(bot.raw).map(([date, data]) => new Date(date).toLocaleDateString(request.query.locale || "en-US", {timeZone: request.query.timezone || "UTC"})),
			borderColor: "rgb(255, 99, 132)"
		}]
		bot.cards = {
			Users: bot.raw[bot.raw.length - 1]?.users || "?",
			"All-time commands": bot.cmds || 0
		}
		delete bot.cmds
		delete bot.raw
		delete bot.pending
		reply.send(bot)
	}
}