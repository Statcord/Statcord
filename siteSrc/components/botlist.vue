<template>
    <div class="row" style="gap: 1rem;">
        <router-link class="col s12 m2" :to="'/bots/' + bot.botid" v-for="bot in bots" v-bind:key="bot.id">
            <div class="card">
                <div class="card-image no-overflow">
                    <object
                        :data="'https://cdn.discordapp.com/avatars/' + bot.botid + '/' + bot.avatar + '.png?size=512'"
                        type="image/png"
                        aria-label="aaa"
                        loading="lazy"
                        :class="bot.nsfw? 'blur':''"
                        :alt="bot.username+`'s profile picture`"
                        style="max-width: 100%; border-radius: 12px 12px 0 0 ;"
                        >
                        <img :src="'https://cdn.discordapp.com/embed/avatars/'+(bot.botid >>> 22) % 5+'.png?size=512'" alt="Defualt Bot icon" style="border-radius: 12px 12px 0 0 " />
                    </object>
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <p class="flow-text blue-text text-darken-2">{{ bot.username }}</p>
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
            page: 0,
            lastPageWithData: false
        }
    },
    props: {
        botListRoute: String,
    },
    mounted() {
        this.load()
    },
    unmounted(){
        window.onscroll = null
    },
    methods: {
        async load() {
            const fetchData = await useFetch(() => `${this.$props.botListRoute}?page=${this.page}`)
            if (fetchData.data._rawValue.length === 0) return this.lastPageWithData = true
            this.bots = this.bots.concat(fetchData.data._rawValue)
            if (this.page === 0) this.loadNext()
        },
        loadNext() {
            window.onscroll = () => {
                // if (!this.lastPageWithData)
                if (!this.lastPageWithData && document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight) {
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
