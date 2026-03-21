<template>
    <div v-if="bot.nsfw && !nsfwConcent" class="hs-overlay h-full w-full fixed mb-4 z-10 backdrop-blur-lg">
        <div class="place-self-center text-center top-2">
            <h1 class="mt-2 text-5xl font-medium tracking-tight pb-6">This bot has been marked as NSFW.</h1>
            <UButton @click="dismissNSFW" size="xl">I understand</UButton>
        </div>
    </div>

    <UContainer>
        <UUser :name="bot.username" :description="bot.shortdesc" orientation="horizontal" :avatar="{src: `https://cdn.discordapp.com/avatars/${route.params.id}/${bot.avatar}.webp?size=128${bot.avatar?.startsWith('a_')?'&animated=true':''}`, ui:{image:bot.nsfw?'blur':''}}" size="3xl">
            <template #description>
                <div>
                    {{ bot.shortdesc }}
                </div>
                <div>
                    Made by: <NuxtLink :to="`/users/${bot.ownerid}/`" class="underline">{{bot.ownername}}</NuxtLink> 
                </div>
            </template>
        </UUser>

        <USeparator class="pt-3 pb-2"/>

        <div class="grid grid-cols-3 gap-2">
            <openLink v-if="bot.invite" icon="plus" name="Invite" :url="bot.invite"></openLink>
            <UButton v-if="bot.isOwner" label="Manage" :to="'/bots/' + route.params.id + '/manage/'" icon="i-heroicons-wrench"/>
            <USelect v-model="timeChoiceSelection" :items="timeChoices" @change="getData"/>
        </div>
    </UContainer>

    <div v-if="Object.keys(bot)[1]" class="col s12 ml-3 mr-3">
        <div class="pt-8 pb-8">
            <div v-if="cards" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UCard v-for="card in cards" class="text-center">
                    <template #header>
                        <span class="h-1 align-middle">{{ card.name }}</span>
                    </template>

                    <span class="h-1 align-middle">{{ parseInt(card.value).toLocaleString() }}</span>
                </UCard>
            </div>
        </div>

        <div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UCard v-if="stats" v-for="stat in stats" :key="refreshKeyDef">
                    <template #header>
                        <h1>{{ stat.name }}</h1>
                    </template>

                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </UCard>

                <UCard v-if="commandStats" v-for="stat in commandStats" :key="refreshKeyCmd">
                    <template #header>
                        <h1>{{ stat.name }}</h1>
                    </template>

                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </UCard>


                <UCard v-if="customStats" v-for="stat in customStats" :key="refreshKeyCus">
                    <template #header>
                        <h1>{{ stat.name }}</h1>
                    </template>

                    <chart :chartData="stat.data" :chartType="stat.type" :chartOptions="stat.options"></chart>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup>
    const { $authRequest } = useNuxtApp()
    const route = useRoute()

    const nsfwConcent = ref(false)
    function dismissNSFW(){
        nsfwConcent.value = true
    }

    const genRand = ()=> (Math.random() + 1).toString(36).substring(7)

    const bot = await $authRequest(`/api/bots/${route.params.id}/`)
    if (bot === "404") throw createError({
        statusCode: 404,
        message: 'Bot not found'
    })
    if (bot === "401") throw createError({
        statusCode: 401,
        message: 'You do not have permission to access this bot'
    })


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

    const stats = ref()
    const commandStats = ref()
    const customStats = ref()
    const cards = ref()

    let refreshKeyDef = genRand();
    let refreshKeyCmd = genRand();
    let refreshKeyCus = genRand();
    
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
        refreshKeyDef = genRand();

        const commandStatsJson = await $fetch(`/api/bots/${route.params.id}/stats/commands?t=${timeChoiceSelection.value}`)
        commandStats.value = commandStatsJson?.map(t=>{
            if (t.name==="Command usage over time") t.data.labels = t.labels.map(d=>formatDate(d))
            return t
        })
        refreshKeyCmd = genRand();

        const customStatsJson = await $fetch(`/api/bots/${route.params.id}/stats/custom?t=${timeChoiceSelection.value}`)
        customStats.value = customStatsJson?.map(t=>{
            t.data.labels = t.labels.map(d=>formatDate(d))
            return t
        })
        refreshKeyCus = genRand();
    }

    getData()

    useSeoMeta({
        themeColor: "#0080F0",
        title: () => bot?.username,
        ogTitle: () => bot?.username,
        description:  () => `View ${bot?.username}'s stats on Statcord.`,
        ogDescription:  () => `View ${bot?.username}'s stats on Statcord.`,
        ogImage: () =>`https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        twitterImage:() => `https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        twitterCard: 'summary',
        ogUrl: () => `https://statcord.com/bots/${route.params.id}`,
        twitterTitle: () => bot?.username,
        twitterDescription:  () => `View ${bot?.username}'s stats on Statcord.`,
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