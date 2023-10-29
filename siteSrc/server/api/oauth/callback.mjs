import { defineEventHandler, sendNoContent, getCookie, setCookie, sendRedirect, getQuery } from "h3"

if (import.meta.env) {
    var {default: sessionIdGen} = await import("~/utils/sessionIdGen.mjs")
}

export default defineEventHandler(
    async a => {
        const { code } = getQuery(a);
        if (!code) return sendNoContent(400)

        const tokens = await event.context.oauth.tokenRequest({
            code,
            redirectUri: process.env.domain + "/api/discordOauth/callback"
        });

        if (!tokens.access_token) return sendNoContent(400)

		const sessionID = getCookie(a, "sessionId")?.split(".")[0] ?? sessionIdGen()

        event.context.redis.set(`sess:${sessionID}`, JSON.stringify({
            discordAccessToken: tokens.access_token,
            discordUserInfo: await event.context.oauth.getDiscordUser(tokens.access_token)
        }), "EX", 604800)

        const expires = new Date()
        expires.setSeconds(expires.getSeconds()+604800)
        setCookie(a, "sessionId", sessionID, {
            "expires": expires
        })
   
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
