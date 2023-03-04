export const route = {
	method: 'GET',
	url: '/bot/:id',
	schema: {
		querystring: {
			apikey: { type: 'string' }
		},
		header: {
			type: 'object',
			properties: {
				Authorization: { type: 'string' }
			}
		},
        response: {
			400: {
				type: 'object',
				properties: {
					message: { type: 'string' }
				}
			},
			404: {
				type: 'object',
				properties: {
					message: { type: 'string' }
				}
			},
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

		const bot = disstat.get(request.params.id)
		delete bot.raw
		delete bot.pending
		reply.send(bot)
	}
}
