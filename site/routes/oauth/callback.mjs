import { tokenRequest, getDiscordUser } from '../../../utils/oauth2/oauth.mjs'
import { genKey, updateUser } from '../../../utils/postgres.mjs';

export const route = {
    method: 'GET',
    url: '/api/discordOauth/callback',
    schema: {
        querystring: {
            code: { type: 'string' },
            redirect_to: { type: 'string' }
        },
        response: {
            302: {}
        }
    },
    handler: async (request, reply) => {
        const { code, redirect_to } = request.query;

        const tokens = await tokenRequest({
            code,
            redirectURI: oauth2.apihost + "/discordOauth/callback?redirect_to=" + redirect_to
        });
        request.session.discordAccessToken = tokens.access_token;
        request.session.discordUserInfo = await getDiscordUser(tokens.access_token);

        reply.redirect(302, oauth2.redirectUri + redirect_to)

        updateUser(request.session.discordUserInfo.id, {
            id: request.session.discordUserInfo.id,
            username: request.session.discordUserInfo.username,
            discriminator: request.session.discordUserInfo.discriminator,
            avatar: request.session.discordUserInfo.avatar,
            apikey: genKey()
        })
    }
}
