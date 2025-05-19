<template>
    <div v-if="bot.nsfw && !nsfwConcent" class="hs-overlay h-full w-full fixed mb-4 z-10 backdrop-blur-lg">
        <div class="place-self-center text-center top-2">
            <h1 class="mt-2 text-5xl font-medium tracking-tight pb-6">This bot has been marked as NSFW.</h1>
            <UButton @click="dismissNSFW" size="xl">I understand</UButton>
        </div>
    </div>

    <UContainer>
        <div class="grid grid-cols-6 md:gap-4 sm:gap-2">
            <div class="md:col-span-1 sm:md:col-span-2 col-start-1">
                <div class="text-center w-32" :class="bot.nsfw && !nsfwConcent? 'blur-lg' : ''" >
                    <nuxt-img class="h-32 w-32 rounded-full" :alt="bot.username+`'s profile picture`" :src="'https://cdn.discordapp.com/avatars/' + route.params.id + '/' + bot.avatar + (bot.avatar?.startsWith('a_')?'.gif':'.webp')+'?size=128'" :placeholder="'https://cdn.discordapp.com/embed/avatars/'+(route.params.id >>> 22) % 5+'.png?size=512'" />
                </div>
            </div>
            <div class="col-start-3 sm:col-span-5 col-end-7">
                <h3 class="truncate">{{ bot.username }}</h3>
                <h5>Made by: <router-link :to="'/users/' + bot.ownerid+'/'" class="blue-text text-darken-2">{{ bot.ownername }}</router-link></h5>
                <UButton v-if="bot.isOwner" label="Manage bot" :to="'/bots/' + route.params.id + '/manage/'" icon="i-heroicons-wrench"/>
                <USeparator class="pt-3 pb-2"/>
                <p class="inline-block align-bottom">{{ bot.shortdesc }}</p>
            </div>
        </div>
        <USeparator class="pt-3 pb-2"/>

        <openLink v-if="bot.invite" icon="plus" name="Invite" :url="bot.invite"></openLink>
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