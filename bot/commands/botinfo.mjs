import { flux, fluxDuration, InfluxDB } from "@influxdata/influxdb-client"
import configFile from '../config/settings.mjs'
const influx = new InfluxDB(configFile.influx)

const influxRun = class{
	#queryApi
	#botID
	constructor(botID){
		this.#queryApi = influx.getQueryApi("disstat")
		this.#botID = botID
	}
	async runQuery(measurement){
		const fluxQuery = flux`import "experimental/date/boundaries"
		day = boundaries.yesterday()
		from(bucket:"defaultBucket")		
		|> range(start: day.start, stop: today())
		|> filter(fn: (r) => r["botid"] == ${this.#botID})
		|> filter(fn: (r) => r._measurement == ${measurement})
		|> aggregateWindow(every: ${fluxDuration('1d')}, fn: mean, createEmpty: false)
		|> yield(name: "mean")`

		const tableObjects = []
		for await (const { values, tableMeta } of this.#queryApi.iterateRows(fluxQuery)) {
			tableObjects.push(tableMeta.toObject(values))
		}
		
		return tableObjects
	}
	async getData (){
		return Promise.allSettled([
			// this.runQuery("customCharts"),
			this.runQuery("botStats"),
			// this.runQuery("topCommands")
		])
	}
}

const getLastStat = (mainStats, stat) => {
	const relatedStats = mainStats.filter(stats=>stats._field===stat)
	return relatedStats[relatedStats.length-1]?._value
}
export default {
	name: "botinfo",
	commandLogic: async (interaction, client) => {
		if (interaction.data.options.raw.length === 0) return interaction.createFollowup({
			flags: 64,
			embeds: [
				{
					title: "Error",
					description: "No bot supplied. Either mention a bot or include an id.",
					color: 0x97c227
				}
			]
		}).catch(e=>{
			console.log(e)
		})

		if (interaction.data.options.raw.length === 2) return interaction.createFollowup({
			flags: 64,
			embeds: [
				{
					title: "Error",
					description: "Either mention a bot **OR** include an id.",
					color: 0x97c227
				}
			]
		}).catch(e=>{
			console.log(e)
		})

		const botID = interaction.data.options.raw[0].value

		const bot = await client.pgPool`SELECT username, public FROM bots WHERE botid = ${botID}`.catch(() => {})
		if (bot.length === 0) return interaction.createFollowup({
			flags: 64,
			embeds: [
				{
					title: "Error",
					description: "Bot not found.",
					color: 0x97c227
				}
			]
		}).catch(e=>{
			console.log(e)
		})
		if (!bot[0].public) return interaction.createFollowup({
			flags: 64,
			embeds: [
				{
					title: "Error",
					description: "Bot is marked as private.",
					color: 0x97c227
				}
			]
		}).catch(e=>{
			console.log(e)
		})

		const runInfluxQuery = new influxRun(botID)
		const returnedData = await runInfluxQuery.getData()


		if (returnedData[0].value.length === 0) return interaction.createFollowup({
			flags: 64,
			embeds: [
				{
					title: "Error",
					description: "No stats posted in the last 48 hours.",
					color: 0x97c227
				}
			]
		}).catch(e=>{
			console.log(e)
		})

		interaction.createFollowup({
			embeds: [
				{
					title: `Bot Info for ${bot[0].username}`,
					description: `[View ${bot[0].username} on Statcord](https://statcord.com/bots/${botID})`,
					"fields": [
						{
						  "name": "Guilds",
						  "value": getLastStat(returnedData[0].value, "guildCount").toLocaleString().split(".")[0],
						  inline: true
						},
						{
							"name": "Members",
							"value": getLastStat(returnedData[0].value, "members").toLocaleString().split(".")[0],
							inline: true
						},
						{
							"name": "Users",
							"value": getLastStat(returnedData[0].value, "userCount").toLocaleString().split(".")[0],
							inline: true
						}
					],
					color: 0x97c227
				}
			]
		}).catch(e=>{
			console.log(e)
		})
	},
	description: "Get info about a specific bot",
	options: [
		{
			name: "id",
			description: "The ID of the bot",
			type: 3,
			required: false
		},
		{
			name: "mention",
			description: "Mention the bot",
			type: 6,
			required: false
		}
	]
};