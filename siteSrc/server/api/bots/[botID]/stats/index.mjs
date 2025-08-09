import { defineEventHandler, getQuery, createError, getRouterParams, sendError, appendCorsPreflightHeaders } from "h3"

export default defineEventHandler(async event => {
	const path = getRouterParams(event)

	if (!path.botID) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	const bot = await event.context.pgPool`SELECT public, ownerid FROM bots WHERE botid = ${path.botID}`.catch(() => {})
	if (!bot[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	const isOwner = !!event.context.session?.accessToken && bot[0].ownerid === event.context.session?.userInfo.id
	if ((!bot[0].public && !isOwner)) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

	const query = getQuery(event)
	if (!query.t) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	if (!event.context.validateTimes(query.t)) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const timeFormated = event.context.formatTime(query.t);

	const sdafsdf = await event.context.pgPool`SELECT chartid, enabled, name, label, type, category FROM chartsettings WHERE botid = ${path.botID} AND enabled = true`.catch(() => {})
	
	const tempOBJ = {}

	for (const type of sdafsdf){
		if (!tempOBJ[type.category]) tempOBJ[type.category] = []
		switch (type.category){
			case "default": {
				const botStats = await event.context.pgPool`SELECT avg(${event.context.pgPool(type.chartid.toLowerCase())}), DATE_TRUNC(${timeFormated.groupBy}, timestamp)::date AS t FROM mainstats WHERE botid = ${path.botID} and timestamp > ${timeFormated.start} group by t`.catch(a=>console.log(a))
				tempOBJ[type.category].push({
					name: type.name,
					type: type.type,
					labels: botStats.map(a=>a.t),
					data: {
						datasets: [
							{
								label: type.label,
								data: botStats.map(a=>Number(a.avg.toFixed(0)))
							}
						]
					}
				})
			}
			break;
			case "custom":{
				const customcharts = await event.context.pgPool`select avg(value), DATE_TRUNC(${timeFormated.groupBy}, timestamp)::date AS t from customcharts where botid = ${path.botID} and chartid = ${type.chartid} and timestamp > ${timeFormated.start} group by t`
				tempOBJ[type.category].push({
					name: type.name,
					type: type.type,
					labels: customcharts.map(a=>a.t),
					data: {
						datasets: [
							{
								label: type.label,
								data: customcharts.map(a=>Number(a.avg.toFixed(2)))
							}
						]
					}
				})
			}
			break;
			case "commands": {
				const chartOBJ = {
					name: type.name,
					type: type.type,
					data: {
						datasets: [
							{
								label: type.label
							}
						]
					}
				}
				if (type.chartid === "cmdTotalUse"){
					const cmdData = await event.context.pgPool`select sum(amount), DATE_TRUNC(${timeFormated.groupBy}, timestamp)::date AS t from commandsrun where botid = ${path.botID} and timestamp > ${timeFormated.start} group by t`
					chartOBJ.data.datasets[0].data = cmdData.map(a=>a.sum)
					chartOBJ.labels = cmdData.map(i => i.t)
				} else if (type.chartid === "topCmds"){
					const topCommands = await event.context.pgPool`select command, sum(amount) from commandsrun where botid = ${path.botID} and timestamp > ${timeFormated.start} group by command`.catch(() => {})
					chartOBJ.data.labels = topCommands.map(a=>a.command)
					chartOBJ.data.datasets[0].data = topCommands.map(a=>a.sum)
				}
				tempOBJ[type.category].push(chartOBJ)
			}
			break;
		}
	}
	
	if (sdafsdf.filter(t=>t.name.toLowerCase().includes("ram")).length === 2) delete tempOBJ.default[tempOBJ.default.findIndex(a=>a.name==="Total Ram")]

	return {
		mainStats: tempOBJ.default.filter(a=>a !== void 0),
		custom: tempOBJ.custom,
		commands: tempOBJ.commands ?? []
	}
})

export const schema = {
	hidden: true,
	parameters: [
		{
			name: 'botID',
			in: 'path',
			required: true,
			content: { media: 'application/json' }
		},
		{
			name: "t",
			in: "query",
			required: false,
			"schema": {
				"type": "string",
				example: "7d",
				default: "7d"
			},
			"description": "The timespan to show for. (day, month year)"
		}
	],
	tags: [
		"Bot Stats"
	],
	responses: {
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
		404: {
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
			"content": {
				"application/json": {
					"schema": {
						type: "object",
						properties: {
							mainStats: {
								type: "array",
								contains: { type: "object" }
							},
							commands: {
								type: "array",
								contains: { type: "object" }
							},
							custom: {
								type: "array",
								contains: { type: "object" }
							}
						}
					}
				}
			}
		}
	}
}