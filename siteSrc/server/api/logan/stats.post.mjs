import { defineEventHandler, createError, sendError } from "h3"

export default defineEventHandler(async event => {
	sendError(event, createError({statusCode: 500, statusMessage: `/logan/stats endpoint has been EOL since 2021. Switching to the slightly newer, (but EOL) /v3/stats would require no code changes. Switching to the currently supported route /api/bots/{botID}/stats would be preferred but would require code changes.`}))
})

export const schema = {
	"hidden": true
}
