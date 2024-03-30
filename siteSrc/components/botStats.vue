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
                    <h6 class="center-align">{{ parseInt(card.value).toLocaleString() }}</h6>
                </div>
            </div>

            <div v-if="stats.length>0" class="row">
                <div v-for="stat in stats" :key="stat.id" class="col s12 l4">
                    <h1>{{ stat.name }}</h1>
                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </div>
                
                <div v-for="stat in commandStats" :key="stat.id" class="col s12 l4">
                    <h1>{{ stat.name }}</h1>
                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </div>

                <div v-for="stat in customStats" :key="stat.id" class="col s12 l4">
                    <h1>{{ stat.name }}</h1>
                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
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
import chart from './chart.vue'

export default {
    name: 'bot',
    components: {
        chart
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
        async getData() {
            const defaultStatsJson = await $fetch(`/api/bots/${this.botid}/stats?groupBy=1${this.groupByTimeFrame}${this.startDate && this.endDate ? `&start=${this.startDate}&end=${this.endDate}` : ''}`)

            this.stats = defaultStatsJson.mainStats.stats.map(t=>{
                t.data.labels = defaultStatsJson.mainStats.labels.map(d=>this.formatDate(d))
                switch(t.name){
                    case "CPU Usage":{
                        t.options = {
                            	scales: {
									y: {
										ticks: {
											callback: value => `${value}%` 
										},
										beginAtZero: true
									}
								},
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: context => `${context.dataset.label} ${context.parsed.y}%`
                                    }
                                }
                            }
                        }
                    }break;
                    case "Ram Usage":{
                        t.options={
                            scales: {
                                y: {
                                    ticks: {
                                        callback: value => this.bytesToSize(value) 
                                    }
                                }
                            },
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        // if (context.parsed.y !== null) {

                                        label: context => `${context.dataset.label}: ${this.bytesToSize(context.parsed.y)}`
                                    }
                                }
                            }
                        }
                    }break;
                }
                return t
            })

            this.commandStats = defaultStatsJson.commands.map(t=>{
                if (t.name==="Command usage over time") t.data.labels = t.labels.map(d=>this.formatDate(d))
                return t
            })
            this.customStats = defaultStatsJson.custom?.map(t=>{
                if (t.type === "line") t.data.labels = defaultStatsJson.mainStats.labels.map(d=>this.formatDate(d))
                return t
            })

            this.cards = defaultStatsJson.cards
        },
        getLastStat(mainStats, stat){
            const dataSet = mainStats[mainStats.findIndex(a=>a.name===stat)].data.datasets[0].data
            return dataSet[dataSet.length-1]
        },
        bytesToSize(bytes) {
            const units = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte"];
            const unit = Math.floor(Math.log(bytes) / Math.log(1024));
            return new Intl.NumberFormat("en", {style: "unit", unit: units[unit]}).format(bytes / 1024 ** unit);
        }
    }
}
</script>