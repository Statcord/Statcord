import sql from '../../../utils/postgres.mjs'

export const route = {
	method: 'DELETE',
	url: '/api/bots/:id',
	schema: {
        response: {
			401: {
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
            201: {}
        }
	},
	handler: async (request, reply) => {
		if (!request.headers.Authorization) return reply.status(401).send({message: "You need to be logged in to add a bot!"})
		if (!tokens.has(request.headers.Authorization)) return reply.status(401).send({message: "Your token is invalid!"})

		await sql`DELETE FROM bots WHERE id = ${request.params.id}`
		reply.status(201).end()
	}
}
