<template>
  <div class="container">
    <botlist botListRoute="/api/bots"></botlist>  

  </div>
</template>
  <script setup>
  useSeoMeta({
    themeColor: "#0080F0",
    description: "View bots listed on Statcord.",
    ogDescription: "View bots listed on Statcord.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://statcord.com',
    twitterDescription: "View bots listed on Statcord.",
    twitterImage: '/img/icon.png',
    twitterCard: 'summary'
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