import pg from "../utils/pg.mjs";

export default {
	name: "botinfo",
	commandLogic: async interaction => {
		if (interaction.data.options.raw.length === 0) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "No bot supplied. Either mention a bot or include an id.", color: 0x97c227}]}).catch(e=>console.log(e))
		if (interaction.data.options.raw.length === 2) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "Either mention a bot **OR** include an id.", color: 0x97c227}]}).catch(e=>console.log(e))

		const botID = interaction.data.options.raw[0].value

		const bot = await pg`SELECT username, public FROM bots WHERE botid = ${botID}`.catch(() => {})
		if (bot.length === 0) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "Bot does not exist.", color: 0x97c227}]}).catch(e=>console.log(e))
		if (!bot[0].public) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "Bot is not public.", color: 0x97c227}]}).catch(e=>console.log(e))

		const botStats = (await pg`SELECT guildcount, usercount, members FROM mainstats WHERE botid = ${botID} ORDER by timestamp desc limit 1`.catch(() => {}))
		if (!botStats[0]) return interaction.createFollowup({flags: 64, embeds: [{title: "Error", description: "No statistics available for this bot.", color: 0x97c227}]}).catch(e=>console.log(e))

		interaction.createFollowup({
			embeds: [
				{
					title: `Bot Info for ${bot[0].username}`,
					description: `[View ${bot[0].username} on Statcord](https://statcord.com/bots/${botID}/)`,
					"fields": [
						{
						  "name": "Guilds",
						  "value": botStats[0].guildcount,
						  inline: true
						},
						{
							"name": "Members",
							"value": botStats[0].members,
							inline: true
						},
						{
							"name": "Users",
							"value": botStats[0].usercount,
							inline: true
						},
						{
							"name": "Last Seen",
							"value": `<t:${(new Date(bot[0].lastact).getTime()/1000).toFixed()}:R>`,
							inline: true
						}
					],
					color: 0x97c227
				}
			]
		}).catch(e=>console.log(e))
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