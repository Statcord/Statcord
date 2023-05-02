<template>
    <div class="row">
        <div class="col s3">
            <div class="container">
                <div>
                    <img class="circle" :src="'https://cdn.discordapp.com/avatars/' + botid + '/' + avatar + '.png'" alt="">
                    <h3>{{ botName }}</h3>
                </div>

                <h5>Made by: {{ owner }}</h5>

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
                    <input type="date" :onChange="updateStartDate">

                    <label>End date:</label>
                    <input type="date" :onChange="updateEndDate">
                </div>
            </div>
        </div>

        <div class="col s9">
            <div v-if="stats.length>0" class="row">
                <div v-for="stat in stats" :key="stat.id" class="col s12 l4">
                    <h1>{{ stat.name }}</h1>
                    <lineChart :chartData="stat.data" :chartType="stat.type"></lineChart>
                </div>
            </div>
            <div v-else>
                <span>no data</span>
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
            stats: [],
            customStats: [],
            showDateRange: false,
            startDate: null,
            endDate: null,
        }
    },
    async mounted() {
        this.botid = this.$route.params.botid

        M.FormSelect.init(this.$refs.allTimeOrDateRange);
        this.getData()
        const rawBotFetch = await fetch(`/api/bots/${ this.botid}`)
        if (rawBotFetch.status === 401) return window.location.href = `/`;
        if (!rawBotFetch.ok) return alert("error")
        const botJson = await rawBotFetch.json()

        this.botName = botJson.username
        this.avatar = botJson.avatar
        this.owner = botJson.ownername
        this.public = botJson.public
        this.isOwner = botJson.isOwner
    },
    methods:{
        dateOrAllTimeChanged(event){
            this.showDateRange = event.target.value === "dateRange"
            if (event.target.value === "allTime") {
                this.startDate = null
                this.endDate = null
            }
            this.getData()
        },
        updateStartDate(event){
            this.startDate = new Date(event.target.value).getTime()
            this.getData()
        },
        updateEndDate(event){
            this.endDate = new Date(event.target.value).getTime()
            this.getData()
        },
        async getData(){
            const rawDefualtStatsFetch = await fetch(`/api/stats/getDefault/${this.botid}${this.startDate && this.endDate ? `?start=${this.startDate}&end=${this.endDate}` : ''}`)
            const defaultStatsJson = await rawDefualtStatsFetch.json()

            const data = []
            const labels = []
            defaultStatsJson.map(row=>{
            	labels.push(new Date(row.time).toLocaleString())
                const keys = Object.keys(row)
                keys.shift()
            	keys.map(key=>{
            		const idkIndex = data.findIndex((a)=>a.name===key)
            		if (idkIndex=== -1) data.push({
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
            		else data[idkIndex].data.datasets[0].data.push(row[key])
            	})
            })

            data.map((item, index)=>{
                item.id = new Date().getTime()
                item.data.labels=labels
                
                set(this.stats, index, item)
            })

            this.customStats = [
            ]
        }
    }
}
</script>