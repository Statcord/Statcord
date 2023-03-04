export const route = {
    method: 'GET',
    url: '/api/discordOauth/user',
    schema: {
        response: {
            401: {
                type: 'object',
                properties: {
                    error: { type: 'boolean' }
                }
            },
            200: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    username: { type: 'string' },
                    avatar: { type: 'string' },
                    discriminator: { type: 'string' },
                    locale: { type: 'string' }
                }
            }
        }
    },
    handler: async (request, reply) => {
        if (request.session.discordAccessToken) {
            reply.send(request.session.discordUserInfo);
        } else {
            reply.code(401).send({error: true});
        }
    }
}
