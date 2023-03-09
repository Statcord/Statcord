import { genKey, updateUser } from '../../utils/postgres.mjs'

export const route = {
	method: 'POST',
	url: '/api/key',
	schema: {
		header: {
			type: 'object',
			properties: {
				Authorization: { type: 'string' }
			}
		},
        response: {
			401: {
				type: 'object',
				properties: {
					message: { type: 'string', default: 'You need to be logged in!' }
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
	handler: (request, reply) => {
		if (!request.session.discordAccessToken) return reply.code(401).send({error: true, message: "You need to be logged in to add a bot!"});
		if (!tokens.has(request.headers.Authorization)) return reply.status(401).send({message: "Your token is invalid!"})

		const newkey = "DS-" + genKey()
		reply.send({key: newkey})
		updateUser(tokens.get(request.headers.Authorization).id, {apikey: newkey})
	}
}
