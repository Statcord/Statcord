import sql from '../../utils/postgres.mjs'

export const route = {
	method: 'GET',
	url: '/api/mybots',
	schema: {
        hide: true,
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
        if (!request.session.discordAccessToken) return reply.send([]);

		reply.send(await sql`SELECT username, avatar, bots.botid FROM bots WHERE ownerid = ${request.session.discordUserInfo.id} LIMIT 30 OFFSET 30*${request.query.page ?? 0}`.catch(err=>{}))
	}
}
