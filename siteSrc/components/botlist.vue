<template>
    <div class="row" style="gap: 1rem;">
        <router-link class="col s12 m2" :to="'/bots/' + bot.botid" v-for="bot in bots" v-bind:key="bot.id">
            <div class="card">
                <div class="card-image no-overflow">
                    <img :src="'https://cdn.discordapp.com/avatars/' + bot.botid + '/' + bot.avatar + '.webp?size=256'" :alt="bot.username+`'s profile picture`" :class="bot.nsfw? 'blur':''">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <p>{{ bot.username }}</p>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
    <div class="fixed-action-btn">
    <button v-if="page>0" class="btn-floating btn-large waves-effect deep-purple darken-2" @click="scrollToTop">
      <i class="large material-icons">expand_less</i>
    </button>
  </div>
</template>

<script>
export default {
    name: 'botlist',
    data() {
        return {
            bots: [],
            page: 0
        }
    },
    props: {
        botListRoute: String,
    },
    mounted() {
        this.load()
    },
    methods: {
        async load() {
            const fetchData = await useFetch(() => `${this.$props.botListRoute}?page=${this.page}`)
            this.bots = this.bots.concat(fetchData.data._rawValue)
            if (this.page === 0) this.loadNext()
        },
        loadNext() {
            window.onscroll = () => {
                if (document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight) {
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
