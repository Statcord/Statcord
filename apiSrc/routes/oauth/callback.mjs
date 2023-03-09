import { tokenRequest, getDiscordUser } from '../../utils/oauth2/oauth.mjs'
import { genKey, updateUser } from '../../utils/postgres.mjs';

const { oauth2 } = await import(process.env.NODE_ENV === "production" ? '/config/config.mjs' : '../../config/config.mjs');

export const route = {
    method: 'GET',
    url: '/api/discordOauth/callback',
    schema: {
        querystring: {
            code: { type: 'string' }
        },
        response: {
            302: {}
        }
    },
    handler: async (request, reply) => {
        const { code } = request.query;

        const tokens = await tokenRequest({
            code,
            redirectURI: oauth2.apihost + "/discordOauth/callback"
        });
        request.session.discordAccessToken = tokens.access_token;
        request.session.discordUserInfo = await getDiscordUser(tokens.access_token);

        reply.redirect(302, oauth2.redirectUri)

        updateUser(request.session.discordUserInfo.id, {
            id: request.session.discordUserInfo.id,
            username: request.session.discordUserInfo.username,
            discriminator: request.session.discordUserInfo.discriminator,
            avatar: request.session.discordUserInfo.avatar,
            apikey: genKey()
        })
    }
}
