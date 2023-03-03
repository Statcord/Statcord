const { oauth2 } = await import(process.env.NODE_ENV === "production" ? '/config/config.mjs' : '../../../config/config.mjs')
import { oauthClient } from '../../utils/oauth.mjs'

async function fetchDiscordUserInfo(data) {
    return {
        ...data,
        avatarURL: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discriminator, 10) % 5}.png`,
    };
}

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
    
        const tokens = await oauthClient.exchangeCode({
            code: code,
            clientSecret: oauth2.clientSecret,
            clientID: oauth2.clientID,
            redirectURI: oauth2.apihost + "/discordOauth/callback?redirect_to=" + redirect_to
        });
        const OAuthHelper = oauthClient.getHelper(`Bearer ${tokens.accessToken}`)
        request.session.discordAccessToken = tokens.accessToken;
        request.session.discordTokenExpiresAt = tokens.expiresIn;
        request.session.discordUserInfo = await fetchDiscordUserInfo((await OAuthHelper.getCurrentAuthorizationInformation()).user);;
    
        reply.redirect(302, oauth2.redirectUri + redirect_to)
    }
}