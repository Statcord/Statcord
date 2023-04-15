export default class {
    #customCharts
    #topCommands
    #mainStats
    constructor (postBody){
        this.#customCharts = postBody.customCharts
        this.#topCommands = postBody.topCommands
        this.#mainStats = {
            guildCount: postBody.guildCount,
            shardCount: postBody.shardCount,
            userCount: postBody.userCount,
            commandsRun: postBody.commandsRun,
            ramUsage: postBody.ramUsage,
            totalRam: postBody.totalRam,
            cpuUsage: postBody.cpuUsage,
            members: postBody.members
        }
    }
    getMainStats(){
        return this.#mainStats
    }
    getCustomCharts(){
        return this.#customCharts
    }
    getTopCommands(){
        return this.#topCommands
    }
}