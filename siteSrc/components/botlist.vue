<template>
    <div class="grid md:grid-cols-6 sm:grid-cols-1 gap-4" style="gap: 1rem;">
        <router-link :to="'/bots/' + bot.botid" v-for="bot in bots" v-bind:key="bot.id">
            <div class="max-w-sm overflow-hidden shadow-md rounded-xl">
                <nuxt-img :class="bot.nsfw? 'blur-lg w-full':'w-full'" :alt="bot.username+`'s profile picture`" :src="'https://cdn.discordapp.com/avatars/' + bot.botid + '/' + bot.avatar + (bot.avatar?.startsWith('a_')?'.gif':'.png')+'?size=512'" :placeholder="'https://cdn.discordapp.com/embed/avatars/'+(bot.botid >>> 22) % 5+'.png?size=512'" />
                <div class="px-4 py-4">
                    <div class="text-2xl">{{ bot.username }}</div>
                </div>
            </div>
        </router-link>
    </div>
    <div class="fixed-action-btn">
    <button v-if="page>0" class="btn-floating btn-large waves-effect deep-purple darken-2 place-content-center" @click="scrollToTop">
      <UIcon class="large" name="i-heroicons-chevron-up" />
    </button>
  </div>
</template>

<script>
export default {
    name: 'botlist',
    data() {
        return {
            bots: this.$props.botsProvided ?? [],
            page: 0,
            lastPageWithData: false
        }
    },
    props: {
        botListRoute: String,
        botsProvided: Array
    },
    mounted() {
        if (!this.$props.botsProvided) this.load()
        this.loadNext()
    },
    unmounted(){
        window.onscroll = null
    },
    methods: {
        async load() {
            const fetchData = await $fetch(`${this.$props.botListRoute}?page=${this.page}`)
            if (fetchData.length === 0) return this.lastPageWithData = true
            this.bots = this.bots.concat(fetchData)
        },
        loadNext() {
            window.onscroll = () => {

                console.log("s")
                if (!this.lastPageWithData && Number((document.documentElement.scrollTop + window.innerHeight).toFixed(0)) === document.documentElement.offsetHeight) {
                    this.page++
                    this.load()
                }
            }
        },
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
};
</script>
