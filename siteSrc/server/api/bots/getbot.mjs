import { defineEventHandler, createError } from "h3"

export default defineEventHandler(async event => {
	if (!a.context.params.id) throw createError({
		statusCode: 404
	})
	const bot = await event.context.pgPool`SELECT addedon, bots.username, avatar, nsfw, public, bots.ownerid AS ownerid, owners.username AS ownername FROM bots JOIN owners ON bots.ownerid = owners.ownerid WHERE botid = ${a.context.params.id}`.catch(() => {})
	if (!bot[0]) throw createError({
		statusCode: 404
	})

	const isOwner = !!event.context.session.accessToken && bot[0].ownerid === event.context.session.userInfo.id
	const isPublic = bot[0].public

	if ((!isPublic && !isOwner)) throw createError({
		statusCode: 401
	})

	return {...bot[0], isOwner}
})

export const file = "bots/getbot.mjs"
export const schema = {
	method: "GET",
	url: "/api/bots/:id",
	schema: {
		params: {
			type: "object",
			properties: {
				id: {
					type: "string",
					// example: "685166801394335819"
				}
			}
        },
        response: {
			404: {},
            401: {},
            200: {
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
					avatar: { type: "string" },
					username: {
						type: "string",
						// example: "TomatoCake"
					},
					ownerid: {
						type: "string",
						// example: "581146486646243339"
					},
					public: {
						type: "boolean",
						default: true
					},
					nsfw: {
						type: "boolean",
						default: false
					},
					isOwner: { type: "boolean" },
					addedon: { type: "string" }
				}
            }
        }
	}
}
