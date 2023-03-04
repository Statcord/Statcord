export const route = {
	method: 'GET',
	url: '/api/bots',
	schema: {
        querystring: {
            user: { type: 'string' },
        },
        response: {
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
		if (request.query.user) reply.send(disstat.array().filter(bot => bot.owner == request.query.user)).map(bot => ({
			id: bot.id,
			name: bot.name,
			avatar: bot.avatar
		}))
		else reply.send(disstat.array().map(bot => ({
			id: bot.id,
			name: bot.name,
			avatar: bot.avatar
		})))
	}
}
