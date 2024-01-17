import { defineEventHandler, createError, getRouterParams, sendError } from "h3"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	
	const bot = await event.context.pgPool`SELECT addedon, bots.username, bots.avatar, nsfw, bots.public, bots.ownerid AS ownerid, owners.username AS ownername, shortdesc, longdesc, invite FROM bots JOIN owners ON bots.ownerid = owners.ownerid WHERE botid = ${path.botID}`.catch(() => {})

	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	const isOwner = !!event.context.session.accessToken && bot[0].ownerid === event.context.session.userInfo.id
	const isPublic = bot[0].public

	if ((!isPublic && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const links = await event.context.pgPool`SELECT icon, name, url from botlinks WHERE botid = ${path.botID}`.catch(() => {})

	return {...bot[0], isOwner, links}
})

export const schema = {
	"hidden": true,
	"tags": [
		"Internal"
	],
	parameters: [
		{
		  name: 'botID',
		  in: 'path',
		  required: true,
		  content: { media: 'application/json' }
		}
	],
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