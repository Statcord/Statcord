<template>
    <div class="row">
        <router-link class="col s12 m2" :to="'/bots/' + bot.botid" v-for="bot in bots">
            <div class="card">
                <div class="card-image">
                    <img :src="'https://cdn.discordapp.com/avatars/' + bot.botid + '/' + bot.avatar + '.webp?size=1024'" alt="">
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
    <button v-if="paage>0" class="btn-floating btn-large waves-effect deep-purple darken-2" @click="scrollToTop">
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
    mounted(){
        this.load()
    },
    methods: {
        async load() {
            const rawBots = await fetch(`${this.$props.botListRoute}?page=${this.page}`)
            if (!rawBots.ok) return;
            this.bots = await rawBots.json()

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
