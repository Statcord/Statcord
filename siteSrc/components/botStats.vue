<template>
    <div class="row">
        <div class="col s12 m2">
            <div>
                <select ref="allTimeOrDateRange" @change="dateOrAllTimeChanged">
                    <option value="allTime" selected>All Time</option>
                    <option value="dateRange">Date Range</option>
                </select>
                <label>Select date range</label>
            </div>

            <div>
                <select ref="groupBySelector" @change="groupBySelectorChanged">
                    <option value="d" selected>Day</option>
                    <option value="mo">Month</option>
                    <option value="y">Year</option>
                </select>
                <label>Select group by range</label>
            </div>

            <div v-if="showDateRange">
                <label>Start date:</label>
                <input type="date" @change="updateStartDate" :min="datePickerMin" :max="datePickerMax" :value="datePickerMin">

                <label>End date:</label>
                <input type="date" @change="updateEndDate" :min="datePickerMin" :max="datePickerMax" :value="datePickerMax">
            </div>
        </div>


        <div class="col s12 m10">
            <div v-if="stats.length>0" class="row">
                <div v-for="card in cards" :class="'col s'+12/cards.length+' l4'">
                    <h5 class="center-align">{{ card.name }}</h5>
                    <h6 class="center-align">{{ card.value.toLocaleString() }}</h6>
                </div>
            </div>

            <div v-if="stats.length>0" class="row">
                <div v-for="stat in stats" :key="stat.id" class="col s12 l4">
                    <h1>{{ stat.name }}</h1>
                    <lineChart :chartData="stat.data" :chartType="stat.type"></lineChart>
                </div>
                
                <div v-for="stat in commandStats" :key="stat.id" class="col s12 l4">
                    <h1>{{ stat.name }}</h1>
                    <lineChart :chartData="stat.data" :chartType="stat.type"></lineChart>
                </div>

                <div v-for="stat in customStats" :key="stat.id" class="col s12 l4">
                    <h1>{{ stat.name }}</h1>
                    <lineChart :chartData="stat.data" :chartType="stat.type"></lineChart>
                </div>
            </div>
            <div v-else>
                <div class="container">
                    <h3 class="center-align">No chart data has been found for this time period.</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import lineChart from './lineChart.vue'
// import { set } from '@vueuse/shared'

export default {
    name: 'bot',
    components: {
        lineChart
    },
    props: {
        botJson: Object
    },
    data() {
        return {
            botid: "",
            datePickerMin: new Date(0).toISOString().substring(0, 10),
            datePickerMax: new Date().toISOString().substring(0, 10),
            stats: [],
            commandStats:[],
            customStats: [],
            cards: [],
            showDateRange: false,
            startDate: null,
            endDate: Date.now(),
            groupByTimeFrame: 'd',
        }
    },
    async mounted() {
        this.botid = this.$route.params.id

        this.$M.FormSelect.init(this.$refs.allTimeOrDateRange)
        this.$M.FormSelect.init(this.$refs.groupBySelector)

        this.datePickerMin = new Date(this.$props.botJson.addedon).toISOString().substring(0, 10)

        this.getData()
    },
    methods:{
        dateOrAllTimeChanged(event) {
            this.showDateRange = event.target.value === "dateRange"
            if (event.target.value === "allTime") {
                this.startDate = null
                this.endDate = null
            }
            this.getData()
        },
        updateStartDate(event) {
            this.startDate = new Date(event.target.value).getTime()
            this.getData()
        },
        updateEndDate(event) {
            this.endDate = new Date(event.target.value).getTime()
            this.getData()
        },
        formatDate(timeStamp) {
            const date = new Date(timeStamp)
            return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        },
        groupBySelectorChanged(event){
            this.groupByTimeFrame=event.target.value
            this.getData()
        },

        createLineChart(chartData, chartSettings){
            const timeStamp = new Date().getTime()

            const data = []
            const labels = []
            chartData.forEach(row => {
                labels.push(this.formatDate(row.time))
                const keys = Object.keys(row)
                keys.shift()
                keys.forEach(key => {
                    const indexTwo = chartSettings.findIndex(a=>a.chartid===key)
                    const thisChartSettings = chartSettings[indexTwo]
                    if (thisChartSettings.enabled) {
                        const idkIndex = data.findIndex((a)=>a.name===thisChartSettings.name)
                        if (idkIndex === -1) data.push({
                            name: thisChartSettings.name,
                            type: thisChartSettings.type,
                            data: {
                                datasets: [
                                    {
                                        label: thisChartSettings.label,
                                        data: [row[key]]
                                    }
                                ]
                            }
                        })
                        else data[idkIndex].data.datasets[0].data.push(row[key])
                    }
                })
            })

            data.forEach((item, index) => {
                item.id = timeStamp
                item.data.labels = labels

                // set(this.stats, index, item)
            })

            return data
        },
        createPieChart(chartData, chartSettings){
            const timeStamp = new Date().getTime()

            const holder = {};
            chartData.forEach(d => {
                Object.keys(d).forEach(key => {
                    if (key === "time") return
                    if (holder[key]) holder[key]+= d[key]
                    else holder[key] = d[key]
                })
            })
    
            return [
                {
                    id: timeStamp,
                    name: "Command usage over time",
                    type: "line",
                    data: {
                        labels: chartData.flatMap(i => this.formatDate(i.time)),
                        datasets: [
                            {
                                label: "This week",
                                data: chartData.flatMap(i => {
                                    delete i.time;
                                    return Object.values(i).reduce((a,b) => a + b, 0)
                                })
                            }
                        ]
                    }
                },
                {
                    id: timeStamp,
                    name: "Top commands",
                    type: "pie",
                    data: {
                        labels: Object.keys(holder),
                        datasets: [
                            {
                                data: Object.values(holder)
                            }
                        ]
                    }
                }
            ]
        },
        createCustomChart(chartData, chartSettings){
            const customData = []
            const customLabels = []
            chartData.forEach(row => {
            	customLabels.push(this.formatDate(row.time))
                const keys = Object.keys(row)
                const id = row.customChartID
                keys.shift()
                keys.shift()
            	keys.forEach(key => {
                    const indexTwo = chartSettings.findIndex(a=>a.chartid===id)
                    const thisChartSettings = chartSettings[indexTwo]
                    if (thisChartSettings.enabled) {
                        const idkIndex = customData.findIndex((a)=>a.name===thisChartSettings.name)
                        if (idkIndex=== -1) customData.push({
                            name: thisChartSettings.name,
                            type: thisChartSettings.type,
                            data: {
                                datasets: [
                                    {
                                        label: thisChartSettings.label,
                                        data: [row[key]]
                                    }
                                ]
                            }
                        })
                        else customData[idkIndex].data.datasets[0].data.push(row[key])
                    }
            	})
            })

            customData.forEach((item, index) => {
                itethis.$M.id = timeStamp
                itethis.$M.data.labels = customLabels

                // set(this.customStats, index, item)
            })

            return customData
        },
        async getData() {
            const {data: rawDefaultStatsFetch} = await useFetch(() => `/api/bots/${this.botid}/stats?groupBy=1${this.groupByTimeFrame}${this.startDate && this.endDate ? `&start=${this.startDate}&end=${this.endDate}` : ''}`)
            const defaultStatsJson = rawDefaultStatsFetch.value

            const chartSettings = defaultStatsJson.types

            this.stats = this.createLineChart(defaultStatsJson.mainStats, chartSettings)

            if (defaultStatsJson.commands.length > 0) this.commandStats = this.createPieChart(defaultStatsJson.commands, chartSettings)

            this.customStats = this.createCustomChart(defaultStatsJson.custom, chartSettings)

            const lastPost = defaultStatsJson.mainStats[defaultStatsJson.mainStats.length-1]
            this.cards = [
                {
                    name: "Guilds",
                    value: lastPost?.guildCount
                },
                {
                    name: "Members",
                    value: lastPost?.members
                },
                {
                    name: "Users",
                    value: lastPost?.userCount
                }
            ]
        },

    }
}
</script>