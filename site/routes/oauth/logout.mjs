export const route = {
	method: 'GET',
	url: '/api/discordOauth/logout',
	schema: {
		response: {
		}
	},
	handler: (request, reply) => {
		if (request.session.discordAccessToken) {
			request.session.destroy((err) => {
				if (err) reply.status(500).send('Internal Server Error')
				else reply.redirect('/')
			})
		} else reply.redirect('/')
	}
}
