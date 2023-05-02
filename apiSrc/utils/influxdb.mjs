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
                ramUsage: FieldType.FLOAT,
                totalRam: FieldType.FLOAT,
                cpuUsage: FieldType.FLOAT,
                members: FieldType.INTEGER,
            },
            tags: [
                'botid'
            ]
        },
        {
            measurement: 'topCommands',
            fields: {
                name: FieldType.STRING,
                count: FieldType.INTEGER
            },
            tags: [
                'botid'
            ]
        },
        // {
        //     measurement: 'customCharts',
        //     fields: {
        //         // customCharts: {
        //         // 	type: 'array',
        //         // 	items: {
        //         // 		type: 'object',
        //         // 		properties: {
        //         // 			count: { type: 'number' FieldType.FLOAT/FieldType.INTEGER}
        //         // 		}
        //         // 	}
        //         // }
        //     },
        //     tags: [
        //         'botid'
        //     ]
        // }
    ]
})