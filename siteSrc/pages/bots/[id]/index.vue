<template>
    <div v-if="bot.nsfw && !nsfwConcent" class="hs-overlay h-full w-full fixed mb-4 z-10 backdrop-blur-lg">
        <div class="place-self-center text-center top-2">
            <h1 class="mt-2 text-5xl font-medium tracking-tight pb-6">This bot has been marked as NSFW.</h1>
            <UButton @click="dismissNSFW" size="xl">I understand</UButton>
        </div>
    </div>

    <UContainer>
        <UUser :name="bot.username" :description="bot.shortdesc" orientation="horizontal" :avatar="{src: `https://cdn.discordapp.com/avatars/${route.params.id}/${bot.avatar}.${bot.avatar?.startsWith('a_')?'gif':'webp'}?size=128`, ui:{image:bot.nsfw?'blur':''}}" size="3xl">
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

        <openLink v-if="bot.invite" icon="plus" name="Invite" :url="bot.invite"></openLink>
        <UButton v-if="bot.isOwner" label="Manage bot" :to="'/bots/' + route.params.id + '/manage/'" icon="i-heroicons-wrench"/>
    </UContainer>

    <div v-if="Object.keys(bot)[1]" class="col s12">
        <botStats class="pt-6" :botJson="bot"></botStats>
    </div>
</template>

<script setup>
    const { $authRequest } = useNuxtApp()
    const route = useRoute()

    const nsfwConcent = ref(false)
    function dismissNSFW(){
        nsfwConcent.value = true
    }

    const bot = await $authRequest(`/api/bots/${route.params.id}/`)
    if (bot === "404") throw createError({
        statusCode: 404,
        message: 'Bot not found'
    })
    if (bot === "401") throw createError({
        statusCode: 401,
        message: 'You do not have permission to access this bot'
    })

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