<template>
    <div class="px-6">
        <div v-if="botJsonLoaded">
            <div v-if="botNSFW">
                <h3 class="center-align">this bot has been marked NSFW
                    <br>
                    <div class="btn" @click="dismissNSFW">I understand</div>
                </h3>
            </div>
            <div class="row" :class="botNSFW ? 'blur' : ''">
                <div class="col s12 m2 container">
                    <div class="row">
                        <div class="col s6 m12">
                            <object
                                :data="'https://cdn.discordapp.com/avatars/' + botid + '/' + bot.avatar + (bot.avatar.startsWith('a_')?'.gif':'.png')+'?size=512'"
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
                            <h3>{{ bot.username }}</h3>
                            <h5>Made by: <router-link :to="'/users/' + ownerID" class="blue-text text-darken-2">{{ bot.ownername }}</router-link></h5>
                        </div>
                    </div>
                
                    <router-link v-if="isOwner" :to="'/bots/' + botid + '/manage'" class="waves-effect waves-light btn">Manage bot <i class="material-icons left">build</i></router-link>
                </div>
            </div>
    
            <div :class="botNSFW ? 'blur' : ''">
                <div class="row">
                    <div class="col s12">
                        <ul class="tabs" ref="tabs">
                            <li class="tab col s3"><a class="active" href="#overview">Overview</a></li>
                            <li class="tab col s3"><a href="#stats">Stats</a></li>
                            <li class="tab col s3 disabled"><a href="#reviews">Reviews</a></li>
                            <li class="tab col s3 disabled"><a href="#updates">Updates</a></li>
                        </ul>
                    </div>
                    <div id="overview" class="col s12">
                        <botLongListing v-if="Object.keys(botJson)[1]" :botJson="botJson"></botLongListing>
                    </div>
                    <div id="stats" class="col s12">
                        <botStats v-if="Object.keys(botJson)[1]" :botJson="botJson"></botStats>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <spinner></spinner>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from 'vue-router';
    const route = useRoute()
    const bot = await $fetch(`/api/bots/${route.params.id}`)
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
            public: false,
            isOwner: false,
            botNSFW: true,
            ownerID: "",
            botJson: {},
            botJsonLoaded: false
        }
    },
    async mounted() {
        const {data: botJson} = await useFetch(`/api/bots/${this.botid}`)
        this.botJsonLoaded = true
        this.botJson = botJson.value

        this.botNSFW = botJson.value.nsfw
        this.public = botJson.value.public
        this.isOwner = botJson.value.isOwner
        this.ownerID = botJson.value.ownerid

        await this.sleep(100);

        this.$M.Tabs.init(this.$refs.tabs, {
            onShow: (a)=>{
                // console.log(a)
            }
        });
    },
    methods:{
        dismissNSFW(){
            this.botNSFW = false
        },
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
        }
    }
}
</script>