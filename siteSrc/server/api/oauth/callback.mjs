import { defineEventHandler, sendRedirect, getQuery, createError } from "h3"

export default defineEventHandler(async event => {
    const { code } = getQuery(event);
    if (!code) throw createError({
        statusCode: 400
    })

    const tokens = await event.context.oauth.tokenRequest({
        code,
        redirectUri: process.env.domain + "/api/discordOauth/callback"
    });

    if (!tokens.access_token) throw createError({
        statusCode: 400
    })

    event.context.session.accessToken = tokens.access_token,
    event.context.session.userInfo = await event.context.oauth.getDiscordUser(tokens.access_token)

    return sendRedirect(event, process.env.domain, 302)
})

export const schema = {
    method: "GET",
    url: "/api/discordOauth/callback",
	schema: {
        hide: true,
        querystring: {
            code: { type: "string" }
        },
        response: {
            302: {}
        }
    }
}