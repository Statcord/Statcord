<template>
    <div>
        <div>
            <USelect v-model="timeChoiceSelection" class="w-48" :items="timeChoices" @change="timeChoiceUpdate"/>
        </div>

        <div class="pt-8 pb-8">
            <div v-if="cards" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UCard v-for="card in cards" class="text-center">
                    <template #header>
                        <span class="h-1 align-middle text-gray-300">{{ card.name }}</span>
                    </template>

                    <span class="h-1 align-middle text-gray-300">{{ parseInt(card.value).toLocaleString() }}</span>
                </UCard>
            </div>
        </div>

        <div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-if="stats" v-for="stat in stats" :key="refreshKey">
                    <h1>{{ stat.name }}</h1>
                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </div>
                
                <div v-if="commandStats" v-for="stat in commandStats" :key="refreshKey">
                    <h1>{{ stat.name }}</h1>
                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </div>

                <div v-if="customStats" v-for="stat in customStats" :key="refreshKey">
                    <h1>{{ stat.name }}</h1>
                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const route = useRoute()
    const props = defineProps({botJson: Object})

    const timeChoices = [
        // '6H',
        // '12H',
        '1D',
        '3D',
        '7D',
        '1MO',
        '3MO',
        '6MO',
        '9MO',
        '1Y',
        '3Y',
        '5Y',
        'All Time' 
    ]
    // const timeChoiceSelection = ref(timeChoices[4])
    const timeChoiceSelection = ref(timeChoices[2])

    const timeChoiceUpdate = ()=>{
        getData()
    }

    const stats = ref()
    const commandStats = ref()
    const customStats = ref()
    const cards = ref()

    let refreshKey = new Date();

    
    const formatDate = (timeStamp) => new Date(timeStamp).toLocaleDateString();
    const units = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte"];
    const bytesToSize = (bytes) => {
        const unit = Math.floor(Math.log(bytes) / Math.log(1024));
        if (unit < 0) return bytes
        return new Intl.NumberFormat("en", {style: "unit", unit: units[unit]}).format(bytes / 1024 ** unit);
    }


    const getData = async() =>{
        const cardsFetch = await $fetch(`/api/bots/${route.params.id}/stats/cards?t=${timeChoiceSelection.value}`)
        cards.value = cardsFetch;

        const defaultStatsJson = await $fetch(`/api/bots/${route.params.id}/stats/default?t=${timeChoiceSelection.value}`)
        stats.value = defaultStatsJson.map(t=>{
            t.data.labels = t.labels.map(d=>formatDate(d))
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
                                },
                                beginAtZero: true
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

        const commandStatsJson = await $fetch(`/api/bots/${route.params.id}/stats/commands?t=${timeChoiceSelection.value}`)
        commandStats.value = commandStatsJson?.map(t=>{
            if (t.name==="Command usage over time") t.data.labels = t.labels.map(d=>formatDate(d))
            return t
        })

        const customStatsJson = await $fetch(`/api/bots/${route.params.id}/stats/custom?t=${timeChoiceSelection.value}`)
        customStats.value = customStatsJson?.map(t=>{
            t.data.labels = t.labels.map(d=>formatDate(d))
            return t
        })

        refreshKey = new Date()
    }

    getData()
</script>