import { tokenRequest, getUser } from '../../../utils/oauth2/oauth.mjs'

export const route = {
    method: 'GET',
    url: '/api/discordOauth/callback',
    schema: {
        querystring: {
            state: { type: 'string' },
            code: { type: 'string' },
            redirect_to: { type: 'string' }
        },
        response: {
        }
    },
    handler: async (request, reply) => {
        const { state, code, redirect_to } = request.query;
    
        const tokens = await tokenRequest({
            code,
            redirectURI: oauth2.apihost + "/discordOauth/callback?redirect_to=" + redirect_to
        });
        request.session.discordAccessToken = tokens.access_token;
        request.session.discordUserInfo = await getUser(tokens.access_token);;
    
        reply.redirect(302, oauth2.redirectUri + redirect_to)
    }
}