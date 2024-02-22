<template>
</template>

<script setup>
    import { useRoute } from 'vue-router';
    const route = useRoute()
    const { data: botFetch} = await useAsyncData(async () => {
        const [bot] = await Promise.all([
            $fetch(`/api/bots/${route.params.id}`)
        ])
        return bot
    })

    const bot = botFetch.value

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


export default {
    name: 'bot',
    data() {
        return {
            botid: this.$route.params.id,
        }
    },
    async mounted() {
        return await navigateTo(`/bots/${this.$route.params.id}`, {
            redirectCode: 301
        })

    }
}
</script>