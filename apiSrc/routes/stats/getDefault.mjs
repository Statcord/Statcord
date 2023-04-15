import influx from '../../utils/influxdb.mjs'

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
								data: {
									type: 'object',
									properties: {
										datasets: { type: 'array' },
									}		
								}
							}
						}
					}
				}
            }
        }
	},
	handler: async (request, reply) => {

		const aaaa = await influx.query(`
		SELECT commandsRun, cpuUsage, guildCount, members, ramUsage, shardCount, totalRam, userCount FROM botStats WHERE botid = $botid
		ORDER BY time DESC
	  `, {
		  placeholders: {
			  botid: request.params.id
		  }
	  })
		// console.log(aaaa.groupRows[0].rows)

		const asdf = []
		const labels = []
		aaaa.groupRows[0].rows.map(row=>{
			labels.push(row.time._nanoISO)
			const keys = Object.keys(row)
			keys.shift()
			keys.map(key=>{
				const idkIndex = asdf.findIndex((a)=>a.name===key)
				if (idkIndex=== -1) asdf.push({
					name: key,
					type: "line",
					data: {
						datasets: [
							{
								label: "This week",
								data: [row[key]],
								backgroundColor: "rgba(224, 248, 255, 0.4)",
								borderColor: "#5cddff",
								lineTension: 0,
								pointBackgroundColor: "#5cddff",
							}
						]
					}
				})
				else asdf[idkIndex].data.datasets[0].data.push(row[key])
				// console.log(row[key])
			})
			// console.log(keys)
		})
		console.log(JSON.stringify(asdf, 0, 4))
		reply.send({
			labels,
			data: asdf
			// data: [
			// 	{
			// 		name: "guilds",
			// 		type: "line",
			// 		data: {
			// 			datasets: [
			// 				{
			// 					label: "This week",
			// 					data: [12, 19, 10, 17, 6, 3, 7],
			// 					backgroundColor: "rgba(224, 248, 255, 0.4)",
			// 					borderColor: "#5cddff",
			// 					lineTension: 0,
			// 					pointBackgroundColor: "#5cddff",
			// 				}
			// 			]
			// 		}
			// 	},
			// 	{
			// 		name: "users",
			// 		type: "line",
			// 		data: {
			// 			datasets: [
			// 				{
			// 					label: "This week",
			// 					data: [12, 19, 10, 17, 6, 3, 7],
			// 					backgroundColor: "rgba(224, 248, 255, 0.4)",
			// 					borderColor: "#5cddff",
			// 					lineTension: 0,
			// 					pointBackgroundColor: "#5cddff",
			// 				}
			// 			]
			// 		}
			// 	},
			// 	{
			// 		name: "members",
			// 		type: "line",
			// 		data: {
			// 			datasets: [
			// 				{
			// 					label: "This week",
			// 					data: [12, 19, 10, 17, 6, 3, 7],
			// 					backgroundColor: "rgba(224, 248, 255, 0.4)",
			// 					borderColor: "#5cddff",
			// 					lineTension: 0,
			// 					pointBackgroundColor: "#5cddff",
			// 				}
			// 			]
			// 		}
			// 	},
			// 	{
			// 		name: "shards",
			// 		type: "line",
			// 		data: {
			// 			datasets: [
			// 				{
			// 					label: "This week",
			// 					data: [12, 19, 10, 17, 6, 3, 7],
			// 					backgroundColor: "rgba(224, 248, 255, 0.4)",
			// 					borderColor: "#5cddff",
			// 					lineTension: 0,
			// 					pointBackgroundColor: "#5cddff",
			// 				}
			// 			]
			// 		}
			// 	},
			// 	{
			// 		name: "topCommands(pie chart)",
			// 		type: "line",
			// 		data: {
			// 			datasets: [
			// 				{
			// 					label: "This week",
			// 					data: [12, 19, 10, 17, 6, 3, 7],
			// 					backgroundColor: "rgba(224, 248, 255, 0.4)",
			// 					borderColor: "#5cddff",
			// 					lineTension: 0,
			// 					pointBackgroundColor: "#5cddff",
			// 				}
			// 			]
			// 		}
			// 	},
			// 	{
			// 		name: "ram",
			// 		type: "line",
			// 		data: {
			// 			datasets: [
			// 				{
			// 					label: "This week",
			// 					data: [12, 19, 10, 17, 6, 3, 7],
			// 					backgroundColor: "rgba(224, 248, 255, 0.4)",
			// 					borderColor: "#5cddff",
			// 					lineTension: 0,
			// 					pointBackgroundColor: "#5cddff",
			// 				}
			// 			]
			// 		}
			// 	},
			// 	{
			// 		name: "cpu",
			// 		type: "line",
			// 		data: {
			// 			datasets: [
			// 				{
			// 					label: "This week",
			// 					data: [12, 19, 10, 17, 6, 3, 7],
			// 					backgroundColor: "rgba(224, 248, 255, 0.4)",
			// 					borderColor: "#5cddff",
			// 					lineTension: 0,
			// 					pointBackgroundColor: "#5cddff",
			// 				}
			// 			]
			// 		}
			// 	}
			// ]
		})
	}
}
