<template>
    <div>
        <div>
            <div>
                <USelect v-model="allTimeOrDateRangeSelection" name="allTimeOrDateRangeSelection" :options="allTimeOrDateRange" @change="dateOrAllTimeChanged"/>
                <label for="allTimeOrDateRangeSelection">Select date range</label>
            </div>

            <div>
                <USelect v-model="groupBySelection" name="groupBySelection" :options="groupBySelections"  @change="groupBySelectorChanged"/>
                <label for=groupBySelection>Select group by range</label>
            </div>

            <div v-if="showDateRange">
                <label>Start date:</label>
                <input type="date" @change="updateStartDate" :min="datePickerMin.toISOString().substring(0, 10)" :max="datePickerMax.toISOString().substring(0, 10)" :value="startDate.toISOString().substring(0, 10)">

                <label>End date:</label>
                <input type="date" @change="updateEndDate" :min="datePickerMin.toISOString().substring(0, 10)" :max="datePickerMax.toISOString().substring(0, 10)" :value="endDate.toISOString().substring(0, 10)">
            </div>
        </div>

        <div class="pt-8 pb-8">
            <div v-if="stats" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UCard v-for="card in cards" class="text-center">
                    <template #header>
                        <span class="h-1 align-middle text-gray-300">{{ card.name }}</span>
                    </template>

                    <span class="h-1 align-middle text-gray-300">{{ parseInt(card.value).toLocaleString() }}</span>
                </UCard>
            </div>
        </div>

        <div>
            <div v-if="stats" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="stat in stats" :key="refreshKey">
                    <h1>{{ stat.name }}</h1>
                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </div>
                
                <div v-for="stat in commandStats" :key="refreshKey">
                    <h1>{{ stat.name }}</h1>
                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </div>

                <div v-for="stat in customStats" :key="refreshKey">
                    <h1>{{ stat.name }}</h1>
                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import chart from './chart.vue'

    import { useRoute } from 'vue-router';
    const route = useRoute()
    const props = defineProps({botJson: Object})


    const allTimeOrDateRange = ['All Time', 'Date Range']
    const allTimeOrDateRangeSelection = ref(allTimeOrDateRange[0])

    const groupBySelections = ['Day', 'Month', 'Year']
    const groupBySelection = ref(groupBySelections[0])

    const stats = ref()
    const commandStats = ref()
    const customStats = ref()
    const cards = ref()

    const datePickerMin = new Date(props.botJson.addedon);
    const datePickerMax = new Date();

    let showDateRange = false;
    let startDate = datePickerMin;
    let endDate = datePickerMax;
    let groupByTimeFrame = 'd';
    let refreshKey = datePickerMax;

    
    const formatDate = (timeStamp) => {
        const date = new Date(timeStamp)
        return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    const bytesToSize = (bytes) => {
        const units = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte"];
        const unit = Math.floor(Math.log(bytes) / Math.log(1024));
        return new Intl.NumberFormat("en", {style: "unit", unit: units[unit]}).format(bytes / 1024 ** unit);
    }


    const getData = async(firstLoad) =>{
        const defaultStatsJson = await $fetch(`/api/bots/${route.params.id}/stats?groupBy=1${groupByTimeFrame}${firstLoad ? '': `&start=${startDate.getTime()}&end=${endDate.getTime()}`}`)

        stats.value = defaultStatsJson.mainStats.stats.map(t=>{
            t.data.labels = defaultStatsJson.mainStats.labels.map(d=>formatDate(d))
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
                                    callback: value => bytesToSize(value) 
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: context => `${context.dataset.label}: ${bytesToSize(context.parsed.y)}`
                                }
                            }
                        }
                    }
                }break;
            }
            return t
        })

        commandStats.value = defaultStatsJson.commands.map(t=>{
            if (t.name==="Command usage over time") t.data.labels = t.labels.map(d=>formatDate(d))
            return t
        })

        customStats.value = defaultStatsJson.custom?.map(t=>{
            if (t.type === "line") t.data.labels = defaultStatsJson.mainStats.labels.map(d=>formatDate(d))
            return t
        })

        cards.value = defaultStatsJson.cards;
        refreshKey = new Date()
    }
    
    const dateOrAllTimeChanged = (event) => {
        showDateRange = event === "Date Range"
        if (event === "All Time") {
            startDate = null
            endDate = null
        }
        getData()
    }
    const updateStartDate = (event) => {
        startDate = new Date(event.target.value)
        getData()
    }
    const updateEndDate = (event) => {
        endDate = new Date(event.target.value)
        getData()
    }

    const groupBySelectorChanged = (event) => {
        groupByTimeFrame=event.target.value
        getData()
    }

    getData(true)
</script>