import { defineEventHandler, sendNoContent, readBody, createError, sendError } from "h3"
import { Point } from "@influxdata/influxdb-client"

const mainStats = {
    "servers": "intField",

	// "shardCount": "intField",
	// "userCount": "intField",
	// "members": "intField",
	// "ramUsage": "floatField",
	// "totalRam": "floatField",
	// "cpuUsage": "floatField"
}
const mainStatsKeys = Object.keys(mainStats)

export default defineEventHandler(async event => {
	const body = await readBody(event)
	if (!body.id) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	if (!body.key) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const botExisits = await event.context.pgPool`SELECT token, maxcustomcharts from bots WHERE botid = ${body.id}`.catch(() => {})
	if (!botExisits[0]) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))
	if (body.key !== botExisits[0].token) return sendError(event, createError({statusCode: 401, statusMessage: 'Unauthorized'}))

    const statsPostBodyKeys = Object.keys(body)
    const hasMainStats = mainStatsKeys.some(key=>statsPostBodyKeys.includes(key))
    if (!hasMainStats) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	if (statsPostBodyKeys.filter(k=>k.toLowerCase().includes("mem")).length === 1) return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))

	const writeClient = event.context.influx.influxClient.getWriteApi("disstat", "defaultBucket")

	// if (body.custom1 || body.custom2){
	// 	const customCharts = []
	// 	if (body.custom1) customCharts.push({id: "custom1", data: {"itemOne": body.custom1}})
	// 	if (body.custom2) customCharts.push({id: "custom2", data: {"itemOne": body.custom2}})

	// 	const existingCustomCharts = await event.context.pgPool`SELECT chartid AS id from chartsettings WHERE botid = ${body.id} AND custom = true`.catch(() => {})
	// 	if ([...existingCustomCharts, ...customCharts].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).length > botExisits[0].maxcustomcharts) {
	// 		writeClient.flush()
	// 		return sendError(event, createError({statusCode: 400, statusMessage: 'Bad Request'}))
	// 	}
		
	// 	body.customCharts.map(customChart => {
	// 		event.context.pgPool`INSERT INTO chartsettings(botid, chartid, name, label, type, custom) VALUES (${body.id}, ${customChart.id}, ${`placeholder for ${customChart.id}`}, ${`placeholder for ${customChart.id}`}, 'line', true) ON CONFLICT (botid, chartid) DO NOTHING`.catch(() => {})

	// 		const customChartsPoint = new Point("customCharts")
	// 			.tag("botid",  body.id)
	// 			.tag("customChartID",  customChart.id)

	// 		Object.keys(customChart.data).forEach(key => {
	// 			const value = customChart.data[key]
	// 			if (value.toString().includes(".")) customChartsPoint.floatField(key, value)
	// 			else customChartsPoint.intField(key, value)
	// 		})

	// 		writeClient.writePoint(customChartsPoint)
	// 	})
	// }

	// const dataObject = {}

    // if (hasMainStats){
    //     const mainStatsPoint = new Point("botStats")
    //     .tag("botid",  body.id)

    //     mainStatsKeys.forEach(key=>{
    //         if (statsPostBodyKeys.includes(key)) mainStatsPoint[mainStats[key]](key, body[key])
    //     })
    //     writeClient.writePoint(mainStatsPoint)
    // }

	// if (body.topCommands) {
	// 	const topCommandsPoint = new Point("topCommands")
	// 		.tag("botid",  body.id)

	// 	body.topCommands.map(item => {
	// 		topCommandsPoint.intField(item.name, item.count)
	// 	})

	// 	writeClient.writePoint(topCommandsPoint)
	// }

	writeClient.flush()

	sendNoContent(event, 200)
})

export const schema = {
	deprecated: true,
	"tags": [
		"Bot Stats"
	],
    parameters: [
		{
			name: 'key',
			in: 'body',
			required: true,
			content: { media: 'application/json' }
		}
    ],
	"security": {
		"key": [{}]
	},
	"requestBody": {
		"description": "[NOT IMPLEMENTED YET] Post a bots stats (Statcord compatable). Both memactive and memload are REQUIRED if posting your ram usage.",
		"content": {
			"application/json": {
				"schema": {
					"type": "object",
					"properties": {
						"id":  {
							type: "string",
							example: "961433265879801936",
							"description": "Your Bot's Discord ID.",
							required: true
						},
						"key":  {
							type: "string",
							example: "statcord.com-0123456789abcdefghij",
							"description": "Your Statcord Key",
							required: true
						},
						"servers": {
							type: "integer",
							"format": "int32",
							example: 22000,
							"description": "The amount of servers your bot is in",
							required: true
						},
						"users": {
							type: "integer",
							"format": "int32",
							example: 366051,
							"description": "The amount of users your bot is servicing",
							required: true
						},
						// active
						// commands
						// popular
						// memactive
						// memload
						// cpuload
						// bandwidth
						"custom1": {
							type: "integer",
							"format": "int32",
							example: 14,
							"description": "The value for custom graph 1",
							required: false
						},
						"custom2": {
							type: "integer",
							"format": "int32",
							example: 14,
							"description": "The value for custom graph 2",
							required: false
						},


						// "members": {
						// 	type: "integer",
						// 	"format": "int32",
						// 	example: 7687071,
						// 	"description": "The total member count",
						// 	required: false
						// },
						// "ramUsage": {
						// 	type: "integer",
						// 	"format": "float",
						// 	example: 50.6,
						// 	required: false,
						// 	"description": "The amount of RAM the bot's process is using currently in bytes"
						// },
						// "totalRam": {
						// 	type: "integer",
						// 	"format": "float",
						// 	"description": "The total amount of RAM available to the bot in bytes",
						// 	required: false
						// },
						// "cpuUsage": {
						// 	type: "integer",
						// 	"format": "float",
						// 	"description": "The CPU usage of the bot or host",
						// 	example: 10.1,
						// 	required: false
						// },
						// "topCommands": {
						// 	required: false,
						// 	type: "array",
						// 	"description": "An array of the commands run since the last post",
						// 	example: [
						// 		{
						// 			name: "help",
						// 			count: 10
						// 		}
						// 	],
						// 	"items": {
						// 		type: "object",
						// 		"properties": {
						// 			name: {
						// 				type: "string",
						// 				example: "help",
						// 				"description": "The name of the command",
						// 				required: true
						// 			},
						// 			count: {
						// 				type: "integer",
						// 				"format": "int32",
						// 				example: 10,
						// 				"description": "The amount the command has been run",
						// 				required: true
						// 			}
						// 		}
						// 	}
						// }
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

// let requestBody = {
//     active: this.activeUsers, // Users that have run commands since the last post
//     commands: this.commandsRun.toString(), // The how many commands have been run total
//     popular, // the top 5 commands run and how many times they have been run
//     memactive: memactive.toString(), // Actively used memory
//     memload: memload.toString(), // Active memory load in %
//     cpuload: cpuload.toString(), // CPU load in %
//     bandwidth: bandwidth.toString(), // Used bandwidth in bytes