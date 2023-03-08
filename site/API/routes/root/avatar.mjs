const avatarCache = {}

export const route = {
    method: 'GET',
    url: '/api/avatar/:id',
    schema: {
        response: {
			400: {
				type: 'object',
				properties: {
					message: { type: 'string', default: 'Please specify the bot ID as a parameter!' }
				}
			},
            200: {
                type: 'object',
                properties: {
                    a: { type: 'string' },
					b: { type: 'boolean' }
                }
            }
        }
    },
    handler: async (request, reply) => {
        if (!request.params.id) return reply.status(400).send({message: "Please specify the bot ID as a parameter!"})
		if (!/^[0-9]{17,21}$/.test(request.params.id)) return reply.status(400).send({message: "Please enter a valid bot ID!"})
		if (avatarCache[request.params.id]) return reply.send(avatarCache[request.params.id])

		const botres = await fetch("https://discord.com/api/v10/users/" + request.params.id, {headers: {"Authorization": "Bot " + token}})
		const json = await botres.json()
		const result = {a: json.avatar, b: json.bot}
		avatarCache[request.params.id] = result
		setTimeout(() => delete avatarCache[request.params.id], 10 * 60 * 1000)
		reply.send(result)
    }
}
