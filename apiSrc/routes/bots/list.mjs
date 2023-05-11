import sql from '../../utils/postgres.mjs'

export const route = {
	method: 'GET',
	url: '/api/bots',
	schema: {
        querystring: {
			page: { type: 'number', default: 0 }
        },
        response: {
            200: {
                type: 'array',
                items: {
					type: 'object',
					properties: {
						botid: { type: 'string' },
						username: { type: 'string' },
						avatar: { type: 'string' }
					}
				}
            }
        }
	},
	handler: async (request, reply) => {
		reply.send(await sql`SELECT username, avatar, botid FROM bots WHERE public = true LIMIT 30 OFFSET 30*${request.query.page ?? 0}`.catch(err=>{}))
	}
}
