import { getBot, updateBot } from '../../utils/postgres.mjs'

export const route = {
	method: 'POST',
	url: '/bot/:id/cmd',
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
		body: {
			type: 'object',
			properties: {
				cmd: { type: 'string' }
			}
		},
        response: {
            204: {
				type: 'object',
				properties: {
					key: { type: 'string' }
				}
            }
        }
	},
	handler: (request, reply) => {
		if (!request.params.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		const auth = request.headers.Authorization || request.query.apikey
		if (!auth) return reply.status(401).send({message: "You must send an API key in the Authorization header or as \"apikey\" query parameter!"})

		const bot = getBot(request.params.id)
		if (!bot || (!bot.public && !request.headers.Authorization)) return reply.status(404).send({message: "The bot with the specified ID does not exist!"}) // TODO: If the bot isnt public, check if the auth matches it's api key
		reply.status(204).end()

		bot.lastConnect = Date.now()
		bot.pendingCmd.push(request.body.cmd)
		bot.cmds = (bot.cmds || 0) + 1
		updateBot(request.params.id, bot)
	}
}
