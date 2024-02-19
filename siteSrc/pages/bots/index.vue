<template>
  <div class="container">
    <botlist botListRoute="/api/bots"></botlist>  

  </div>
</template>
  <script setup>
  useSeoMeta({
    themeColor: "#0080F0",
    title: 'Statcord - My bots',
    description: "Track your Discord bot's statistics using Statcord.",
    ogTitle: 'Statcord - My bots',
    ogDescription: "Track your Discord bot's statistics using Statcord.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://statcord.com',
    twitterTitle: 'Statcord - My bots',
    twitterDescription: "Track your Discord bot's statistics using Statcord.",
    twitterImage: '/img/icon.png',
    twitterCard: 'summary'
  })
  
  useHead({
    htmlAttrs: {
      lang: 'en'
    },
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/img/favicon.ico'
      }
    ]
  })
  </script>
  <script>
  import botlist from '../../../components/botlist.vue'
  
  export default {
    name: 'me',
    components: {
      botlist
    },
    data() {
      return {
      };
    }
  }
  </script>