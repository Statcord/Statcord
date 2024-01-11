import { defineEventHandler, readBody, sendNoContent, sendError, createError } from "h3"

export default defineEventHandler(async event => {
	if (!event.context.session.accessToken) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const body = await readBody(event)

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${body.botid}`.catch(() => {})
	if (botExisits[0]) return sendError(event, createError({statusCode: 409, statusMessage: 'Bot already exists'}))

	const bot = await event.context.oauth.rest.users.get(body.botid).catch(e=>{})
	if (!bot) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	event.context.pgPool`INSERT INTO bots(botid, username, avatar, token, ownerid, addedon, public, nsfw, invite, shortdesc, longdesc) VALUES (${body.botid}, ${bot.username}, ${bot.avatar}, ${event.context.utils.genKey()}, ${event.context.session.userInfo.id}, now(), ${body.public}, ${body.nsfw}, ${body.invite}, ${body.shortDesc}, ${body.longDesc})`.catch(() => {})

	Object.keys(event.context.utils.defaultChartSettings).forEach(chartID => {
		const chart = event.context.utils.defaultChartSettings[chartID]
		event.context.pgPool`INSERT INTO chartsettings(botid, chartid, name, label, type) VALUES (${body.botid}, ${chartID}, ${chart.name}, ${chart.label}, ${chart.type})`.catch(() => {})
	})

	sendNoContent(event, 200)
})

export const schema = {
	"hidden": true,
	"tags": [
		"Internal"
	],
	"requestBody": {
		"description": "Add a bot to DisStat",
		"content": {
			"application/json": {
				"schema": {
					"type": "object",
					"properties": {
						"botid": {
							"type": "string"
						},
						"invite": {
							"type": "string",
						},
						"public": {
							"type": "boolean"
						},
						"nsfw": {
							"type": "boolean"
						},
						"customurl": {
							"type": "string"
						},
						"shortDesc": {
							"type": "string"
						},
						"longDesc": {
							"type": "string"
						},
						"github": {
							"type": "string",
						},
						"website": {
							"type": "string"
						},
						"supportserver": {
							"type": "string"
						},
						"donations": {
							"type": "string",
						}
					}
				}
			}
		}
	},
	"responses": {
		401: {
			"description": "You do not have permission to access this bot.",
			"content": {
				"application/json": {
					"schema": {
						"type": "object",
						"properties": {
							"statusCode": {
								"type": "number"
							},
							"statusMessage": {
								"type": "string"
							}
						}
					},
					"examples": [
						{
							"statusCode": 401,
							"statusMessage": "Unauthorized"
						}
					]
				}
			}
		},
		400: {
			"description": "Bad request. One or more Key-value pairs are either missing or have unsupported data",
			"content": {
				"application/json": {
					"schema": {
						"type": "object",
						"properties": {
							"statusCode": {
								"type": "number"
							},
							"statusMessage": {
								"type": "string"
							}
						}
					},
					"examples": [
						{
							"statusCode": 400,
							"statusMessage": "Bad Request"
						}
					]
				}
			}
        },
		409:{
			"description": "Bot already exists",
			"content": {
				"application/json": {
					"schema": {
						"type": "object",
						"properties": {
							"statusCode": {
								"type": "number"
							},
							"statusMessage": {
								"type": "string"
							}
						}
					},
					"examples": [
						{
							"statusCode": 409,
							"statusMessage": "Bot already exists"
						}
					]
				}
			}
		},
		404:{
			"description": "Bot not found",
			"content": {
				"application/json": {
					"schema": {
						"type": "object",
						"properties": {
							"statusCode": {
								"type": "number"
							},
							"statusMessage": {
								"type": "string"
							}
						}
					},
					"examples": [
						{
							"statusCode": 409,
							"statusMessage": "Bot does not exist"
						}
					]
				}
			}
		},
		200: {
			"description": "Bot added successfully",
		}
	}
}
