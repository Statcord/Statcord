export const route = {
	method: 'GET',
	url: '/api/stats/getDefault/:id',
	schema: {
        response: {
			404: {
				type: 'object',
				properties: {
					message: { type: 'string', default: 'The bot with the specified ID does not exist!' }
				}
			},
            401: {
				type: 'object',
				properties: {
					message: { type: 'string', default: "You do not have permission to see this bot" }
				}
			},
            200: {
				type: 'object',
				properties: {
					labels: {type: "array"},
					data: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								name: { type: 'string' },
								type: { type: 'string' },
								data: { type: 'array' }
							}
						}
					}
				}
            }
        }
	},
	handler: async (request, reply) => {
		reply.send({
			labels: ['12', '19', "10", "17", "6", "3", "7"],
			data: [
				{
					name: "guilds",
					type: "line",
					data: {
						datasets: [
							{
								label: "This week",
								data: [12, 19, 10, 17, 6, 3, 7],
								backgroundColor: "rgba(224, 248, 255, 0.4)",
								borderColor: "#5cddff",
								lineTension: 0,
								pointBackgroundColor: "#5cddff",
							}
						]
					}
				},
				{
					name: "users",
					type: "line",
					data: {
						datasets: [
							{
								label: "This week",
								data: [12, 19, 10, 17, 6, 3, 7],
								backgroundColor: "rgba(224, 248, 255, 0.4)",
								borderColor: "#5cddff",
								lineTension: 0,
								pointBackgroundColor: "#5cddff",
							}
						]
					}
				},
				{
					name: "members",
					type: "line",
					data: {
						datasets: [
							{
								label: "This week",
								data: [12, 19, 10, 17, 6, 3, 7],
								backgroundColor: "rgba(224, 248, 255, 0.4)",
								borderColor: "#5cddff",
								lineTension: 0,
								pointBackgroundColor: "#5cddff",
							}
						]
					}
				},
				{
					name: "shards",
					type: "line",
					data: {
						datasets: [
							{
								label: "This week",
								data: [12, 19, 10, 17, 6, 3, 7],
								backgroundColor: "rgba(224, 248, 255, 0.4)",
								borderColor: "#5cddff",
								lineTension: 0,
								pointBackgroundColor: "#5cddff",
							}
						]
					}
				},
				{
					name: "topCommands(pie chart)",
					type: "line",
					data: {
						datasets: [
							{
								label: "This week",
								data: [12, 19, 10, 17, 6, 3, 7],
								backgroundColor: "rgba(224, 248, 255, 0.4)",
								borderColor: "#5cddff",
								lineTension: 0,
								pointBackgroundColor: "#5cddff",
							}
						]
					}
				},
				{
					name: "ram",
					type: "line",
					data: {
						datasets: [
							{
								label: "This week",
								data: [12, 19, 10, 17, 6, 3, 7],
								backgroundColor: "rgba(224, 248, 255, 0.4)",
								borderColor: "#5cddff",
								lineTension: 0,
								pointBackgroundColor: "#5cddff",
							}
						]
					}
				},
				{
					name: "cpu",
					type: "line",
					data: {
						datasets: [
							{
								label: "This week",
								data: [12, 19, 10, 17, 6, 3, 7],
								backgroundColor: "rgba(224, 248, 255, 0.4)",
								borderColor: "#5cddff",
								lineTension: 0,
								pointBackgroundColor: "#5cddff",
							}
						]
					}
				}
			]
		})
	}
}
