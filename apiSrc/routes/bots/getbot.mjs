import db from '../../utils/postgres.mjs'

export const route = {
	method: 'GET',
	url: '/api/bots/:id',
	schema: {
        response: {
			404: {
				type: 'object',
				properties: {
					message: { type: 'string', default: 'The bot with the specified ID does not exist!' }
				}
			},
            401: {
				type: 'object',
				properties: {
					message: { type: 'string', default: "You do not have permission to see this bot" }
				}
			},
            200: {
                type: 'array',
                items: {
					type: 'object',
					properties: {
						username: { type: 'string' },
						avatar: { type: 'string' },
                        ownername: { type: 'string' },
                        ownerid: { type: 'string' },
                        public: {type: "boolean"}
					}
				}
            }
        }
	},
	handler: async (request, reply) => {
        const bot = await db`SELECT bots.username, avatar, public, bots.ownerid, owners.username AS ownername FROM bots JOIN owners ON bots.ownerid = owners.ownerid WHERE botid = ${request.params.id}`.catch(err=>{})

        if (!bot[0]) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})
        if (bot[0].public && bot[0].ownerid !== request.session.discordUserInfo?.id) return reply.status(401).send({message: "You do not have permission to see this bot"})

		reply.send(bot)
	}
}