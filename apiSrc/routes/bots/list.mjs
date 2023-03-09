import sql from '../../utils/postgres.mjs'

export const route = {
	method: 'GET',
	url: '/api/bots',
	schema: {
        querystring: {
            user: { type: 'string' },
			page: { type: 'number', default: 1 }
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
	handler: async (request, reply) => {
		let result = []
		if (request.query.user) result = await sql`SELECT * FROM bots WHERE public = true AND owner = ${request.query.user} LIMIT 30 OFFSET ${request.query.page * 30 - 30}`
		else result = await sql`SELECT * FROM bots WHERE public = true LIMIT 30 OFFSET ${request.query.page * 30 - 30}`

		reply.send(result)
	}
}
