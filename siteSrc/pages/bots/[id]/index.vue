<template>
    <div class="px-6">
        <div v-if="bot.nsfw" ref="nsfwBTN">
            <h3 class="center-align">This bot has been marked as NSFW.
                <br>
                <div class="btn" @click="dismissNSFW">I understand</div>
            </h3>
        </div>
        <div class="row" ref="nsfwBotInfoContent" :class="bot.nsfw ? 'blur-lg' : ''">
            <UContainer class="col s12 m2">
                <div class="row">
                    <div class="col s6 m12">
                        <nuxt-img class="h-32 w-32 rounded-full" :alt="bot.username+`'s profile picture`" :src="'https://cdn.discordapp.com/avatars/' + route.params.id + '/' + bot.avatar + (bot.avatar?.startsWith('a_')?'.gif':'.png')+'?size=128'" :placeholder="'https://cdn.discordapp.com/embed/avatars/'+(route.params.id >>> 22) % 5+'.png?size=512'" />
                    </div>
                    <div class="col s6 m12">
                        <h3 class="truncate">{{ bot.username }}</h3>
                        <h5>Made by: <router-link :to="'/users/' + bot.ownerid" class="blue-text text-darken-2">{{ bot.ownername }}</router-link></h5>
                    </div>
                </div>

                <UButton v-if="bot.isOwner" label="Manage bot" :to="'/bots/' + route.params.id + '/manage'" icon="i-heroicons-wrench"/>
            </UContainer>
        </div>

        <div ref="nsfwBotContent" :class="bot.nsfw ? 'blur-lg' : ''">
            <div class="row">
                <div class="col s12">
                    <UTabs :items="tabItems" :default-index="1" @change="tabChanged" />
                </div>
                <div v-if="Object.keys(bot)[1]" class="col s12">
                    <botLongListing v-if="currentTab === 'overview'" :botJson="bot"></botLongListing>
                    <botStats v-else-if="currentTab === 'stats'" :botJson="bot"></botStats>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from 'vue-router';
    const { $authRequest } = useNuxtApp()
    const route = useRoute()
    let currentTab = ref("stats")


    const tabItems = [
        {
            label: 'Overview'
        },
        {
            label: 'Stats',
            
        }
        // Reviews
        // Updates
    ];

    const bot = await $authRequest(`/api/bots/${route.params.id}`)
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

    const tabChanged = (index)=>{
        currentTab.value = tabItems[index].label.toLowerCase()
    }
</script>

<script>
import botStats from '~/components/botStats.vue';
import botLongListing from '~/components/botLongListing.vue';
import spinner from '~/components/spinner.vue';

export default {
    name: 'bot',
    components: {
        botStats,
        botLongListing,
        spinner
    },
    data() {
        return {
        }
    },
    methods:{
        dismissNSFW(){
            this.$refs.nsfwBTN.classList="hide"
            this.$refs.nsfwBotInfoContent.classList=""
            this.$refs.nsfwBotContent.classList=""
        }
    }
}
</script>