import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async event => {
    return event.context.pgPool`SELECT username, avatar, botid, nsfw FROM bots WHERE public = true LIMIT 30 OFFSET 30*${Number(getQuery(event).page ?? 0)}`.catch(() => {})
})

export const schema = {
    method: "GET",
	url: "/api/bots",
	schema: {
        querystring: {
			page: { type: "number", default: 0 }
        },
        response: {
            200: {
                type: "array",
                items: {
					type: "object",
					properties: {
                        botid: {
                            type: "string",
                            // example: "685166801394335819"
                        },
                        username: {
                            type: "string",
                            // example: "TomatenKuchen"
                        },
						avatar: { type: "string" }
					}
				}
            }
        }
	}
}
