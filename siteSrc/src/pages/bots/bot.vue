<template>
    <div class="row">
        <div class="col s12 m2">
            <div class="row">
                <div class="col s6 m12">
                    <img v-if="avatar !== ''" class="circle" :src="'https://cdn.discordapp.com/avatars/' + botid + '/' + avatar + '.webp?size=128'" :alt="botName+'\'s icon'">
                </div>
                <div class="col s6 m12">
                    <h3>{{ botName }}</h3>
                    <h5>Made by: {{ owner }}</h5>
                </div>
            </div>

            <router-link v-if="isOwner" :to="'/bots/' + botid + '/manage'" class="waves-effect waves-light btn">Manage bot <i class="material-icons left">build</i></router-link>

            <div>
                <select ref="allTimeOrDateRange" :onchange="dateOrAllTimeChanged">
                    <option value="allTime" selected>All Time</option>
                    <option value="dateRange">Date Range</option>
                </select>
                <label>Select date range</label>
            </div>

            <div v-if="showDateRange">
                <label>Start date:</label>
                <input type="date" :onChange="updateStartDate" :min="datePickerMin" :max="datePickerMax" :value="datePickerMin">

                <label>End date:</label>
                <input type="date" :onChange="updateEndDate" :min="datePickerMin" :max="datePickerMax" :value="datePickerMax">
            </div>
        </div>

        <div class="col s12 m10">
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
import lineChart from '../../components/lineChart.vue'
import { set } from '@vueuse/shared'

export default {
    name: 'bot',
    components: {
        lineChart
    },
    data() {
        return {
            botid: "",
            botName: "",
            avatar: "",
            owner: "",
            public: false,
            isOwner: false,
            addedOn: 0,
            datePickerMin: new Date(0).toISOString().substring(0, 10),
            datePickerMax: new Date().toISOString().substring(0, 10),
            stats: [],
            commandStats:[],
            customStats: [],
            showDateRange: false,
            startDate: null,
            endDate: Date.now(),
            groupBy: '1d'
        }
    },
    async mounted() {
        this.botid = this.$route.params.botid

        M.FormSelect.init(this.$refs.allTimeOrDateRange)
        this.getData()
        const rawBotFetch = await fetch(`/api/bots/${this.botid}`)
        if (rawBotFetch.status === 401) return window.location.href = `/`
        if (rawBotFetch.status === 404) return window.location.href = `/error/404`
        const botJson = await rawBotFetch.json()

        this.botName = botJson.username
        this.avatar = botJson.avatar
        this.owner = botJson.ownername
        this.public = botJson.public
        this.isOwner = botJson.isOwner
        this.addedOn = botJson.addedon

        this.datePickerMin = new Date(botJson.addedon).toISOString().substring(0, 10)
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
        async getData() {
            const rawDefaultStatsFetch = await fetch(`/api/stats/getDefault/${this.botid}?groupBy=${this.groupBy}${this.startDate && this.endDate ? `&start=${this.startDate}&end=${this.endDate}` : ''}`)
            if (!rawDefaultStatsFetch.ok) return;
            const defaultStatsJson = await rawDefaultStatsFetch.json()

            const rawChartSettings = await fetch(`/api/stats/types/${this.botid}`)
            const chartSettings = await rawChartSettings.json()

            const timeStamp = new Date().getTime()

            const data = []
            const labels = []
            defaultStatsJson.mainStats.map(row => {
            	labels.push(this.formatDate(row.time))
                const keys = Object.keys(row)
                keys.shift()
            	keys.map(key => {
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

                set(this.stats, index, item)
            })

            const holder = {};
            defaultStatsJson.commands.map(d => {
                Object.keys(d).map(key => {
                    if (key === "time") return
                    if (holder[key]) holder[key]+= d[key]
                    else holder[key] = d[key]
                })
            })

            this.commandStats = [
                {
                    id: timeStamp,
                    name: "Command usage over time",
                    type: "line",
                    data: {
                        labels: defaultStatsJson.commands.flatMap(i => this.formatDate(i.time)),
                        datasets: [
                            {
                                label: "This week",
                                data: defaultStatsJson.commands.flatMap(i => {
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


            const customData = []
            const customLabels = []
            defaultStatsJson.custom.map(row => {
            	customLabels.push(this.formatDate(row.time))
                const keys = Object.keys(row)
                const id = row.customChartID
                keys.shift()
                keys.shift()
                console.log(keys)
            	keys.map(key => {
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
                item.id = timeStamp
                item.data.labels = customLabels

                set(this.customStats, index, item)
            })
        }
    }
}
</script>
