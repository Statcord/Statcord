export const route = {
	method: 'GET',
	url: '/api/key',
	schema: {
		header: {
			type: 'object',
			properties: {
				Authorization: { type: 'string' }
			}
		},
        response: {
            200: {
				type: 'object',
				properties: {
					key: { type: 'string' }
				}
            }
        }
	},
	handler: (request, reply) => {
		if (!request.headers.Authorization) return reply.status(401).send({message: "You need to be logged in to add a bot!"})
		if (!tokens.has(request.headers.Authorization)) return reply.status(401).send({message: "Your token is invalid!"})

		reply.send({key: disstatUser.get(tokens.get(request.headers.Authorization).id).apikey})
	}
}
