<template>
  <div class="container">
    <botlist botListRoute="/api/bots"></botlist>  

  </div>
</template>
  <script setup>
  useSeoMeta({
    themeColor: "#0080F0",
    title: 'Statcord - Bots',
    description: "View bots listed on Statcord.",
    ogTitle: 'Statcord - Bots',
    ogDescription: "View bots listed on Statcord.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://statcord.com',
    twitterTitle: 'Statcord - Bots',
    twitterDescription: "View bots listed on Statcord.",
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
    name: 'bots',
    components: {
      botlist
    },
    data() {
      return {
      };
    }
  }
  </script>