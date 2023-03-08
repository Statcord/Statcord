import { updateBot } from '../../../utils/postgres.mjs'

export const route = {
	method: 'POST',
	url: '/api/bots/:id/edit',
	schema: {
		querystring: {
			locale: { type: 'string', default: 'en-US' },
			timezone: { type: 'string', default: 'UTC' }
		},
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
						id: { type: 'string' },
						name: { type: 'string' },
						avatar: { type: 'string' }
					}
				}
            }
        }
	},
	handler: async (request, reply) => {
		if (!request.headers.Authorization) return reply.status(401).send({message: "You need to be logged in to add a bot!"})
		if (!tokens.has(request.headers.Authorization)) return reply.status(401).send({message: "Your token is invalid!"})

		updateBot(request.params.id, {
			public: request.body.public
		})
	}
}
