<template>
    <div v-if="botNSFW">
        <h3 class="center-align">this bot has been marked NSFW
            <br>
            <div class="btn" @click="dismissNSFW">I understand</div>
        </h3>
    </div>
    <div class="row" :class="botNSFW ? 'blur':''">
        <div class="col s12 m2">
            <div class="row">
                <div class="col s6 m12">
                    <img v-if="bot.avatar !== ''" class="circle" :src="'https://cdn.discordapp.com/avatars/' + botid + '/' + bot.avatar + '.webp?size=128'" :alt="bot.username+'\'s icon'">
                </div>
                <div class="col s6 m12">
                    <h3>{{ bot.username }}</h3>
                    <h5>Made by: <router-link :to="'/users/'+ ownerID">{{ bot.ownername }}</router-link></h5>
                </div>
            </div>
            
            <router-link v-if="isOwner" :to="'/bots/' + botid + '/manage'" class="waves-effect waves-light btn">Manage bot <i class="material-icons left">build</i></router-link>
        </div>
    </div>

    <div>
        <div class="row">
            <div class="col s12">
                <ul class="tabs" ref="tabs">
                    <li class="tab col s3"><a class="active" href="#overview">Overview</a></li>
                    <li class="tab col s3"><a href="#stats">stats</a></li>
                </ul>
            </div>
            <div id="overview" class="col s12">Overview</div>
            <div id="stats" class="col s12">
                <botStats></botStats>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from 'vue-router';
    const route = useRoute()
    const bot = await $fetch(`/api/bots/${route.params.id}`)
    useSeoMeta({
        title: () =>`DisStat - ${bot?.username}`,
        ogTitle: () => `DisStat - ${bot?.username}`,
        description:  () => `View ${bot?.username}'s stats on DisStat.`,
        ogDescription:  () => `View ${bot?.username}'s stats on DisStat.`,
        ogImage: () =>`https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        twitterImage:() => `https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        // twitterCard: 'summary_large_image',
        ogUrl: () => `https://disstat.numselli.xyz/bots/${route.params.id}`,
        twitterTitle: () =>`DisStat - ${bot?.username}`,
        twitterDescription:  () => `View ${bot?.username}'s stats on DisStat.`,
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

export default {
    name: 'bot',
    components: {
        botStats
    },
    data() {
        return {
            botid: "",
            public: false,
            isOwner: false,
            botNSFW: true,
            ownerID: "",
        }
    },
    async mounted() {
        this.botid = this.$route.params.id

        this.$M.FormSelect.init(this.$refs.allTimeOrDateRange)
        this.$M.FormSelect.init(this.$refs.groupBySelector)
        this.$M.Tabs.init(this.$refs.tabs, {
            onShow: (a)=>{
                console.log(a)
            }
        });


        const {data: botJson} = await useFetch(`/api/bots/${this.botid}`)

        this.botNSFW = botJson.value.nsfw
        this.public = botJson.value.public
        this.isOwner = botJson.value.isOwner
        // this.addedOn = botJson.value.addedon
        this.ownerID = botJson.value.ownerid
    },
    methods:{
        dismissNSFW(){
            this.botNSFW = false
        }
    }
}
</script>