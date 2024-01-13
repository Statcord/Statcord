import { defineEventHandler, createError, getRouterParams, readBody, sendError } from "h3"

const requiredBodyKeys = [
    "public",
    "nsfw",
    "longDesc",
    "shortDesc"
]

export default defineEventHandler(async event => {
    const body = await readBody(event)
    const path = getRouterParams(event)

    if (!path.botID) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
    if (!event.context.session.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const botExisits = await event.context.pgPool`SELECT ownerid, longDesc, shortDesc from bots WHERE botid = ${path.botID}`.catch(() => {})
    if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
    if (botExisits[0].ownerid !== event.context.session.userInfo.id) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))
    
    const bodyKeys = Object.keys(body)
    if (!bodyKeys.every(bodyKey=>requiredBodyKeys.includes(bodyKey))) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))   

    const saveObject = {
        public: body.public,
        nsfw: body.nsfw,
        longdesc: body.longDesc === "" ? botExisits[0].longdesc : body.longDesc,
        shortdesc: body.shortDesc === "" ? botExisits[0].shortdesc : body.shortDesc
    }

    event.context.pgPool`UPDATE bots SET public = ${saveObject.public}, nsfw = ${saveObject.nsfw}, longdesc = ${saveObject.longdesc}, shortdesc = ${saveObject.shortdesc} WHERE botid = ${path.botID}`.catch(() => {})
})

export const schema = {
    hidden: true,
	tags: [
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
        400: {
            description: "Bad request"
        },
        401: {
			description: "You do not have permission to access this bot"
		},
        404: {
			description: "Bot not found"
		},
        200: {}
    }
}
