import influxRun from "./influx.mjs";
import pg from './pg.mjs'

const getLastStat = (mainStats, stat) => {
	const relatedStats = mainStats.filter(stats=>stats._field===stat)
	return relatedStats[relatedStats.length-1]?._value
}

export default async (botID) => {
    const bot = await pg`SELECT username, public FROM bots WHERE botid = ${botID}`.catch(() => {})
    if (bot.length === 0) throw "Bot not found."
    if (!bot[0].public) throw "Bot is marked as private."

    const runInfluxQuery = new influxRun(botID)
    const returnedData = await runInfluxQuery.getData()

    if (returnedData[0].value.length === 0) throw "No stats posted in the last 48 hours."

    return {
        username: bot[0].username,
        guilds: getLastStat(returnedData[0].value, "guildCount").toLocaleString().split(".")[0],
        members: getLastStat(returnedData[0].value, "members").toLocaleString().split(".")[0],
        users: getLastStat(returnedData[0].value, "userCount").toLocaleString().split(".")[0]
    }
};