<template>
    <div class="row">
        <div class="col s12 m2">
            <div class="row">
                <div class="col s6 m12">
                    <img v-if="bot.avatar !== ''" class="circle" :src="'https://cdn.discordapp.com/avatars/' + botid + '/' + bot.avatar + '.webp?size=128'" :alt="bot.username+'\'s icon'">
                </div>
                <div class="col s6 m12">
                    <h3>{{ bot.username }}</h3>
                    <h5>Made by: {{ bot.ownername }}</h5>
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

            <div>
                <select ref="groupBySelector" :onchange="groupBySelectorChanged">
                    <option value="d" selected>Day</option>
                    <option value="mo">Month</option>
                    <option value="y">Year</option>
                </select>
                <label>Select group by range</label>
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

<script setup>
    import { useRoute } from 'vue-router';
    const route = useRoute()
    // const id = ref(route.params.id)
    const bot = await $fetch(`/siteApi/bots/${route.params.id}`)
    // console.log(route)
    useSeoMeta({
        title: () =>`DisStat - ${bot?.username}`,
        ogTitle: () => `DisStat - ${bot?.username}`,
        description:  () => `View ${bot?.username}'s stats on DisStat.`,
        ogDescription:  () => `View ${bot?.username}'s stats on DisStat.`,
        ogImage: () =>`https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        twitterImage:() => `https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        // twitterCard: 'summary_large_image',
        ogUrl: () => `https://disstat.numselli.xyz/bots/${route.params.id}`,
        twitterTitle: () =>`DisStat - ${bot?.username}`,
        twitterDescription:  () => `View ${bot?.username}'s stats on DisStat.`,
    })
    useHead({
        htmlAttrs: {
            lang: 'en'
        },
        link: [
            {
                rel: 'icon',
                type: 'image/png',
                href: `https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
            }
        ]
    })
</script>

<script>
import lineChart from '../../../components/lineChart.vue'
import { set } from '@vueuse/shared'

export default {
    name: 'bot',
    components: {
        lineChart
    },
    data() {
        return {
            botid: "",
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
            groupByTimeFrame: 'd'
        }
    },
    async mounted() {
        this.botid = this.$route.params.id

        this.$M.FormSelect.init(this.$refs.allTimeOrDateRange)
        this.$M.FormSelect.init(this.$refs.groupBySelector)
        const {data: botJson} = await useFetch(`/siteApi/bots/${this.botid}`, {
            server: false
        })

        this.public = botJson.value.public
        this.isOwner = botJson.value.isOwner
        this.addedOn = botJson.value.addedon
        this.datePickerMin = new Date(botJson.value.addedon).toISOString().substring(0, 10)

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
        async getData() {
            const {data: rawDefaultStatsFetch} = await useFetch(() => `/siteApi/stats/getDefault/${this.botid}?groupBy=1${this.groupByTimeFrame}${this.startDate && this.endDate ? `&start=${this.startDate}&end=${this.endDate}` : ''}`)
            // if (!rawDefaultStatsFetch.ok) return;
            const defaultStatsJson = rawDefaultStatsFetch.value

            const {data: rawChartSettings} = await useFetch(() => `/siteApi/stats/types/${this.botid}`)
            const chartSettings = rawChartSettings.value

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

            if (defaultStatsJson.commands.length>0){
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
            }


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
                itethis.$M.id = timeStamp
                itethis.$M.data.labels = customLabels

                set(this.customStats, index, item)
            })
        }
    }
}
</script>