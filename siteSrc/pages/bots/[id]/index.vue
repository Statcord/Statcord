<template>
    <div class="px-6">
        <div v-if="bot.nsfw" ref="nsfwBTN">
            <h3 class="center-align">This bot has been marked as NSFW.
                <br>
                <div class="btn" @click="dismissNSFW">I understand</div>
            </h3>
        </div>
        <div class="row" ref="nsfwBotInfoContent" :class="bot.nsfw ? 'blur' : ''">
            <div class="col s12 m2 container">
                <div class="row">
                    <div class="col s6 m12">
                        <object
                            :data="'https://cdn.discordapp.com/avatars/' + botid + '/' + bot.avatar + (bot.avatar.startsWith('a_')?'.gif':'.png')+'?size=128'"
                            :type="bot.avatar.startsWith('a_')?'image/gif':'image/png'"
                            aria-label="aaa"
                            loading="lazy"
                            class="circle"
                            :alt="bot.username + `'s profile picture`"
                        >
                            <img :src="'https://cdn.discordapp.com/embed/avatars/' + (botid >>> 22) % 5 + '.png?size=128'" alt="Defualt Bot icon" class="circle" />
                        </object>
                    </div>
                    <div class="col s6 m12">
                        <h3 class="truncate">{{ bot.username }}</h3>
                        <h5>Made by: <router-link :to="'/users/' + bot.ownerid" class="blue-text text-darken-2">{{ bot.ownername }}</router-link></h5>
                    </div>
                </div>
            
                <router-link v-if="bot.isOwner" :to="'/bots/' + botid + '/manage'" class="waves-effect waves-light btn"><i class="material-icons left">build</i>Manage bot</router-link>
            </div>
        </div>

        <div ref="nsfwBotContent" :class="bot.nsfw ? 'blur' : ''">
            <div class="row">
                <div class="col s12">
                    <ul class="tabs" ref="tabs">
                        <li class="tab col s3"><NuxtLink to="#overview" replace>Overview</NuxtLink></li>
                        <li class="tab col s3"><NuxtLink class="active" to="#stats" replace>Stats</NuxtLink></li>
                        <!-- <li class="tab col s3 disabled"><a href="#reviews">Reviews</a></li>
                        <li class="tab col s3 disabled"><a href="#updates">Updates</a></li> -->
                    </ul>
                </div>
                <div id="overview" class="col s12">
                    <botLongListing v-if="Object.keys(bot)[1]" :botJson="bot"></botLongListing>
                </div>
                <div id="stats" class="col s12">
                    <botStats v-if="Object.keys(bot)[1]" :botJson="bot"></botStats>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from 'vue-router';
    const { $authRequest } = useNuxtApp()
    const route = useRoute()

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
        title: () =>`Statcord - ${bot?.username}`,
        ogTitle: () => `Statcord - ${bot?.username}`,
        description:  () => `View ${bot?.username}'s stats on Statcord.`,
        ogDescription:  () => `View ${bot?.username}'s stats on Statcord.`,
        ogImage: () =>`https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        twitterImage:() => `https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        // twitterCard: 'summary_large_image',
        ogUrl: () => `https://statcord.com/bots/${route.params.id}`,
        twitterTitle: () =>`Statcord - ${bot?.username}`,
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
            botid: this.$route.params.id,
        }
    },
    async mounted() {
        this.$M.Tabs.init(this.$refs.tabs, {
            onShow: (a)=>{
                // console.log(a)
            }
        });
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