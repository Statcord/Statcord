import { eventHandler, getQuery } from "h3"
if (import.meta.env) {
    var {default: db} = await import("~/utils/postgres.mjs")
}

export default eventHandler(
    async a => {
        return db`SELECT username, avatar, botid, nsfw FROM bots WHERE public = true LIMIT 30 OFFSET 30*${Number(getQuery(a).page ?? 0)}`.catch(() => {})
    }
)
export const file = "bots/list.mjs"
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
