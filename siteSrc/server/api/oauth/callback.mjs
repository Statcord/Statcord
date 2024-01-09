import { defineEventHandler, sendRedirect, getQuery, createError } from "h3"

export default defineEventHandler(async event => {
    const { code } = getQuery(event);
    if (!code) throw createError({
        statusCode: 400
    })

    const tokens = await event.context.oauth.tokenRequest({
        code,
        redirectUri: "http://localhost:3000" + "/api/oauth/callback"
    });

    if (!tokens.access_token) throw createError({
        statusCode: 400
    })

    const userInfo = await event.context.oauth.getDiscordUser(tokens.access_token)

    event.context.session.accessToken = tokens.access_token,
    event.context.session.userInfo = userInfo

    event.context.pgPool`INSERT INTO owners(username, ownerid, avatar) VALUES (${userInfo.username}, ${userInfo.id}, ${userInfo.avatar}) ON CONFLICT (ownerid) DO UPDATE SET username = ${userInfo.username}, avatar = ${userInfo.avatar}`.catch(() => {})

    return sendRedirect(event, "http://localhost:3000", 302)
})

export const schema = {
    // querystring: {
    //     code: { type: "string" }
    // },
    hidden: true,
	tags: [
		"Internal"
	],
    responses: {
        302: {}
    }
}