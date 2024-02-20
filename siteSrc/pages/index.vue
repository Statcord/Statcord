<template>
  <div class="container">
    <h1>Statcord - Track statistics of your Discord bot</h1>

    <p class="flow-text">
      This site allows tracking of Discord bot statistics like: guild, user, member counts, and command usage. It's a fully
      <a href="https://github.com/statcord/DisStat" target="_blank" rel="noopener" class="blue-text text-darken-2">open source</a>.
    </p>

    <p class="flow-text">
      <router-link to="/bots/add" class="blue-text text-darken-2">Add your bot now</router-link> or <router-link to="/bots/685166801394335819" class="blue-text text-darken-2">View a demo</router-link>!
    </p>
   
    <h2>All currently tracked, public bots</h2>
    <botlist botListRoute="/api/bots"></botlist>
  </div>
</template>

<script setup>
useSeoMeta({
  themeColor: "#0080F0",
  title: 'Statcord',
  description: "Track your Discord bot's statistics using Statcord.",
  ogTitle: 'Statcord',
  ogDescription: "Track your Discord bot's statistics using Statcord.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://statcord.com',
  twitterTitle: 'Statcord',
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
import botlist from '../components/botlist.vue'

export default {
  name: 'home',
  components: {
    botlist
  }
}
</script>
