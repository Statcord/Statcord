<template>
    <div class="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
        <router-link :to="'/bots/' + bot.botid+'/'" v-for="bot in bots" v-bind:key="bot.botid">
            <UCard >
                <UUser :name="bot.username" :description="bot.shortdesc" orientation="horizontal" :avatar="{src: `https://cdn.discordapp.com/avatars/${bot.botid}/${bot.avatar}.${bot.avatar?.startsWith('a_')?'gif':'webp'}?size=512`, chip: {color: bot.lat ? 'primary': 'error'}, ui:{image:bot.nsfw?'blur':''}}" size="3xl">
                    <template #description>
                        <div>
                            {{ bot.shortdesc }}
                        </div>
                        <div class="text-right">
                            {{ bot.gl?.toLocaleString()??"Unknowen"}} Guilds
                        </div>
                    </template>
                </UUser>
            </UCard>
        </router-link>
    </div>

    <UButton class="fixed z-90 bottom-10 right-8 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:drop-shadow-2xl"v-if="page>0" icon="i-heroicons-chevron-up" :ui="{ rounded: 'rounded-full' }" size="xl" @click="scrollToTop" />
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
