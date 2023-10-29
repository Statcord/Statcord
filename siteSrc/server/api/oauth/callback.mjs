import { defineEventHandler, sendNoContent, sendRedirect, getQuery } from "h3"

export default defineEventHandler(
    async a => {
        const { code } = getQuery(a);
        if (!code) return sendNoContent(400)

        const tokens = await event.context.oauth.tokenRequest({
            code,
            redirectUri: process.env.domain + "/api/discordOauth/callback"
        });

        if (!tokens.access_token) return sendNoContent(400)

        event.context.session.accessToken = tokens.access_token,
        event.context.session.userInfo = await event.context.oauth.getDiscordUser(tokens.access_token)
   
        return sendRedirect(a, process.env.domain, 302)
    }
)
export const file = "oauth/callback.mjs"
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
