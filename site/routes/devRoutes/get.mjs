import { getBot } from '../../../utils/postgres.mjs'

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
	handler: async (request, reply) => {
		if (!request.params.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		const bot = await getBot(request.params.id)
		if (!bot || (!bot.public && !request.headers.Authorization)) return reply.status(404).send({message: "The bot with the specified ID does not exist!"}) // TODO: If the bot isnt public, check if the auth matches it's api key

		delete bot.raw
		delete bot.pending
		reply.send(bot)
	}
}
