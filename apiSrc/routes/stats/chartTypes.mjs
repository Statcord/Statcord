import db from '../../utils/postgres.mjs'

export const route = {
	method: 'GET',
	url: '/api/stats/types/:id',
	schema: {
        hide: true,
		path: {
			id: { type: 'string' }
		},
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
				type: "array",
				contains: { type: "object" }
            }
        }
	},
	handler: async (request, reply) => {
		const bot = await db`SELECT public, ownerid FROM bots WHERE botid = ${request.params.id}`.catch(() => {})
        if (!bot[0]) return reply.status(404).send({message: "The bot with the specified ID does not exist!"})
        if (!bot[0].public && bot[0].ownerid !== request.session.discordUserInfo?.id) return reply.status(401).send({message: "You do not have permission to see this bot"})

		const settings = await db`SELECT chartid, enabled, name, label, type FROM chartsettings WHERE botid = ${request.params.id}`.catch(() => {})

		reply.send(settings)
	}
}
