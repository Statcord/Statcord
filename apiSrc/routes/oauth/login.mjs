const { oauth2 } = await import(process.env.NODE_ENV === "production" ? '/config/config.mjs' : '../../config/config.mjs');

export const route = {
    method: 'GET',
    url: '/api/discordOauth/login',
	schema: {
        hide: true,
        querystring: {
            redirect_to: { type: 'string' }
        },
        response: {
            302: {}
        }
    },
    handler: (request, reply) => {
        const discordAuthURIBase = `https://discord.com/api/oauth2/authorize?client_id=${oauth2.clientID}&response_type=code&redirect_uri=${encodeURIComponent(oauth2.apihost + "/discordOauth/callback")}&scope=identify&prompt=none`;
        reply.redirect(302, discordAuthURIBase)
    }
}
