import { defineEventHandler, createError, getRouterParams } from "h3"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) throw createError({
		statusCode: 404
	})
	const bot = await event.context.pgPool`SELECT addedon, bots.username, bots.avatar, nsfw, bots.public, bots.ownerid AS ownerid, owners.username AS ownername FROM bots JOIN owners ON bots.ownerid = owners.ownerid WHERE botid = ${path.botID}`.catch(() => {})
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

export const schema = {
	responses: {
		404: {
			description: "Bot not found"
		},
		401: {
			description: "You do not have permission to access this bot"
		},
		200: {
			// type: "object",
			// properties: {
			// 	botid: {
			// 		type: "string",
			// 		// example: "685166801394335819"
			// 	},
			// 	username: {
			// 		type: "string",
			// 		// example: "TomatenKuchen"
			// 	},
			// 	avatar: { type: "string" },
			// 	username: {
			// 		type: "string",
			// 		// example: "TomatoCake"
			// 	},
			// 	ownerid: {
			// 		type: "string",
			// 		// example: "581146486646243339"
			// 	},
			// 	public: {
			// 		type: "boolean",
			// 		default: true
			// 	},
			// 	nsfw: {
			// 		type: "boolean",
			// 		default: false
			// 	},
			// 	isOwner: { type: "boolean" },
			// 	addedon: { type: "string" }
			// }
		}
	}
}