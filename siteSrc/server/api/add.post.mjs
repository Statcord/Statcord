import { defineEventHandler, readBody, sendNoContent, sendError, createError } from "h3"

const defaultChartSettings = [
	{
		id: "guildCount",
		name: "Guild Growth",
		type: "line",
		label: "This Week",
		category: "default"
	},
	{
		id: "shardCount",
		name: "Shards",
		type: "line",
		label: "This Week",
		category: "default"
	},
	{
		id: "members",
		name: "Members",
		type: "line",
		label: "This Week",
		category: "default"
	},
	{
		id: "userCount",
		name: "User Count",
		type: "line",
		label: "This Week",
		category: "default"
	},
	{
		id: "cpuUsage",
		name: "CPU Usage",
		type: "line",
		label: "This Week",
		category: "default"
	},
	{
		id: "ramUsage",
		name: "Ram Usage",
		type: "line",
		label: "This Week",
		category: "default"
	},
	{
		id: "totalRam",
		name: "Total Ram",
		type: "line",
		label: "This Week",
		category: "default"
	},	
	{
		id: "topCmds",
		name: "Popular Commands",
		type: 'pie',
		label: 'Fully Rounded',
		category: "commands"
	},
	{
		id: "cmdTotalUse",
		name: "Command usage over time",
		type: "line",
		label: "This week",
		category: "commands"
	}
]

export default defineEventHandler(async event => {
	const body = await readBody(event)

	const botExisits = await event.context.pgPool`SELECT ownerid from bots WHERE botid = ${body.botid}`.catch(() => {})
	if (botExisits[0]) return event.context.pgPool`UPDATE bots SET token = ${body.apikey} WHERE botid = ${body.botid}`.catch(() => {})

	const bot = await event.context.oauth.rest.users.get(body.botid).catch(e=>{})
	if (!bot) return sendError(event, createError({statusCode: 404, statusMessage: 'Bot not found'}))

	const topggBotRaw = await fetch("https://top.gg/api/bots/817865561652199424", {
		"headers": {
			"accept": "*/*",
			"accept-language": "en-US,en;q=0.9",
			"cache-control": "no-cache",
			"pragma": "no-cache",
			"sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Brave\";v=\"122\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-model": "\"\"",
			"sec-ch-ua-platform": "\"Linux\"",
			"sec-ch-ua-platform-version": "\"6.6.20\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"sec-gpc": "1",
			"cookie": "mode=dark; country=CA; device=desktop; __cf_bm=aqimUG6frvdEE.I3kM8Q26LYIcMQiMfYqRawdoiTc1A-1710106721-1.0.1.1-hOFxGuT6p0lo_ucMIvIyhsGdk8YUsNLZWD0KpM8x2AuJHlGDYdfBNkRznqlk0dZ91OxyoQhuKOn.NbLN97hPfQ; theme=red; maintenanceBannerIsClosed=true; cf_clearance=VCiH0tgQu5g3r4CM.yKU5y8Ug6q3wT6.qODdyA2HdkE-1710106722-1.0.1.1-UZ..k43uXeukh4__oG4exjoy27mGVS34z_9Akj9YxrzJATKghEvmze33FkZQ_j1DgOtRm039drH3MNxBtxJ82w; connect.sid=s%3APw0Z8FvKosu5SJwo0dI73kcgqDXKDvoh.Bow65lgyJv5jY6G2uHbru8BQN0AoqgpuJGpBWTynRBg; DO-LB=\"ChAxMC4xMzEuMzMuMTU4OjgwEMLBmgI=\"; amp_4180d2=hRAQKI4fPm0nOi8LwWZsmV...1hol4rfov.1hol59g0l.2.6.8; amp_4180d2_top.gg=hRAQKI4fPm0nOi8LwWZsmV.ODEyNDA0MzIzMDkwNDUxNjYwOA==..1hol4rg05.1hol59gap.6.7.d",
			"Referer": "https://top.gg/bot/817865561652199424",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		},
		"body": null,
		"method": "GET"
	});

	const topggBotJSON = await topggBotRaw.json()

	const owner = await event.context.oauth.rest.users.get(topggBotJSON.owners[0]).catch(e=>{})
	const dbOwner = await event.context.pgPool`SELECT username FROM owners WHERE ownerid = ${topggBotJSON.owners[0]}`.catch(() => {})
	if (!dbOwner[0]) event.context.pgPool`INSERT INTO owners(username, avatar, ownerid) VALUES (${owner.username}, ${owner.avatar}, ${topggBotJSON.owners[0]})`.catch((e) => {
		console.log(e)
	})

	event.context.pgPool`INSERT INTO bots(botid, username, avatar, token, ownerid, addedon, public, nsfw, invite, shortdesc, longdesc) VALUES (${body.botid}, ${bot.username}, ${bot.avatar}, ${body.token}, ${topggBotJSON.owners[0]}, now(), true, false, ${topggBotJSON.invite}, ${topggBotJSON.shortdesc}, ${topggBotJSON.longdesc})`.catch((e) => {
		console.log(e)
	})

	defaultChartSettings.forEach(chart => {
		event.context.pgPool`INSERT INTO chartsettings(botid, chartid, name, label, type, category) VALUES (${body.botid}, ${chart.id}, ${chart.name}, ${chart.label}, ${chart.type}, ${chart.category})`.catch((e) => {
			console.log(e)
		})
	})

	const botLinks = [
		// {
		// 	name: "github",
		// 	url: '',
		// 	icon: "link"
		// },
		// {
		// 	name: "website",
		// 	url: "",
		// 	icon: "link"
		// },
		{
			name: "supportserver",
			url: `https://discord.gg/${topggBotJSON.support}`,
			icon: "link"
		},
		// {
		// 	name: "donations",
		// 	url: '',
		// 	icon: "link"
		// }
	].map(async link => {
		event.context.pgPool`INSERT INTO botlinks(botid, name, url, icon) VALUES (${body.botid}, ${link.name}, ${link.url}, ${link.icon})`.catch((e) => {
			console.log(e)
		})
	})
	
	sendNoContent(event, 200)
})

export const schema = {
	"hidden": true,
	"tags": [
		"Internal"
	],
	"requestBody": {
		"description": "Add a bot to Statcord",
		"content": {
			"application/json": {
				"schema": {
					"type": "object",
					"properties": {
						"botId": {
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