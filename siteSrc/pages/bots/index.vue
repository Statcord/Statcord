<template>
  <div class="container">
    <botlist botListRoute="/api/bots"></botlist>  

  </div>
</template>
  <script setup>
  useSeoMeta({
    title: 'DisStat - My bots',
    description: "Track your Discord bot's statistics using DisStat.",
    ogTitle: 'DisStat - My bots',
    ogDescription: "Track your Discord bot's statistics using DisStat.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://disstat.numselli.xyz',
    twitterTitle: 'DisStat - My bots',
    twitterDescription: "Track your Discord bot's statistics using DisStat.",
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