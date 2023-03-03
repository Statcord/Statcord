const { oauth2 } = await import(process.env.NODE_ENV === "production" ? '/config/config.mjs' : '../../../config/config.mjs');

export const route = {
    method: 'GET',
    url: '/api/discordOauth/login',
    schema: {
        querystring: {
            redirect_to: { type: 'string' },
        },
        response: {
        }
    },
    handler: (request, reply) => {
        const { redirect_to } = request.query;

        const discordAuthURIBase = `https://discordapp.com/api/oauth2/authorize?client_id=${oauth2.clientID}&response_type=code&redirect_uri=${encodeURIComponent(oauth2.apihost + "/discordOauth/callback?redirect_to=" + redirect_to)}&scope=identify&prompt=consent`;
        reply.redirect(302, discordAuthURIBase)
    }
}