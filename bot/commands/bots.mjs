export default {
	name: "bots",
	commandLogic: async (interaction, client) => {
		if (interaction.data.options.raw.length === 0) return interaction.createFollowup({
			flags: 64,
			embeds: [
				{
					title: "Error",
					description: "No user supplied. Either mention a user or include an id.",
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
					description: "Either mention a user **OR** include an id.",
					color: 0x97c227
				}
			]
		}).catch(e=>{
			console.log(e)
		})

		const userID = interaction.data.options.raw[0].value
        const userFromDB = await client.pgPool`SELECT avatar, username, public FROM owners WHERE ownerid = ${userID}`.catch(() => {})
		if (userFromDB.length === 0) return interaction.createFollowup({
			flags: 64,
			embeds: [
				{
					title: "Error",
					description: "User not found.",
					color: 0x97c227
				}
			]
		}).catch(e=>{
			console.log(e)
		})
		if (!userFromDB[0].public) return interaction.createFollowup({
			flags: 64,
			embeds: [
				{
					title: "Error",
					description: "User is marked as private.",
					color: 0x97c227
				}
			]
		}).catch(e=>{
			console.log(e)
		})

		const bots = await client.pgPool`SELECT username, botid FROM bots WHERE ownerid = ${userID} AND public = true`.catch(() => {})
		if (bots.length === 0) return interaction.createFollowup({
			flags: 64,
			embeds: [
				{
					title: "Error",
					description: "User has no public bots.",
					color: 0x97c227
				}
			]
		}).catch(e=>{
			console.log(e)
		})

		const finalMessage = {
			embeds: [
				{
					title: `${userFromDB[0].username}'s Bots`,
					description: `[View ${userFromDB[0].username} on Statcord](https://statcord.com/users/${userID})`,
					"fields": bots.map(bot => {
						return {
							"name": bot.username,
							"value": `[View Here](https://statcord.com/bots/${bot.botid})`,
							inline: true
						}
					}),
					color: 0x97c227
				}
			]
		}

		interaction.createFollowup(finalMessage).catch(e=>{
			console.log(e)
		})
	},
	description: "Get the bots owned by a specific user",
	options: [
		{
			name: "id",
			description: "The ID of the user",
			type: 3,
			required: false
		},
		{
			name: "mention",
			description: "Mention the user",
			type: 6,
			required: false
		}
	]
};