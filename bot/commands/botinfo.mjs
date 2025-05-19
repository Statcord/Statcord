import genBotStat from '../utils/genBotStat.mjs'

export default {
	name: "botinfo",
	commandLogic: async interaction => {
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

		const data = await genBotStat(botID).catch(err => {
			interaction.createFollowup({
				flags: 64,
				embeds: [
					{
						title: "Error",
						description: err,
						color: 0x97c227
					}
				]
			}).catch(console.log)
		})
		if (!data) return;

		interaction.createFollowup({
			embeds: [
				{
					title: `Bot Info for ${data.username}`,
					description: `[View ${data.username} on Statcord](https://statcord.com/bots/${botID})`,
					"fields": [
						{
						  "name": "Guilds",
						  "value": data.guilds,
						  inline: true
						},
						{
							"name": "Members",
							"value": data.members,
							inline: true
						},
						{
							"name": "Users",
							"value": data.users,
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