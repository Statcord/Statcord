import { InfluxDB, FieldType } from 'influx'

const { influxConfig } = await import(process.env.NODE_ENV === "production" ? '/config/config.mjs' : '../config/config.mjs')

export default new InfluxDB({
    ...influxConfig,
    schema: [
        {
            measurement: 'botStats',
            fields: {
                guildCount: FieldType.INTEGER,
                shardCount: FieldType.INTEGER,
                userCount: FieldType.INTEGER,
                commandsRun: FieldType.INTEGER,
                ramUsage: FieldType.FLOAT,
                totalRam: FieldType.FLOAT,
                cpuUsage: FieldType.FLOAT,
                members: FieldType.INTEGER,
                // topCommands: {
                //     type: 'array',
                //     items: {
                //         type: 'object',
                //         properties: {
                //             name: FieldType.STRING,
                //             count: FieldType.INTEGER
                //         }
                //     }
                // },
                // customCharts: {
                // 	type: 'array',
                // 	items: {
                // 		type: 'object',
                // 		properties: {
                // 			count: { type: 'number' FieldType.FLOAT/FieldType.INTEGER}
                // 		}
                // 	}
                // }
            },
            tags: [
                'botid'
            ]
        }
    ]
})