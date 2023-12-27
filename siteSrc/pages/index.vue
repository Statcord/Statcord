<template>
  <div class="container">
    <h1>DisStat - Track statistics of your Discord bot</h1>

    <p>
      This site allows tracking of Discord bot statistics, like guild, user and shard count, and used commands. It's a fully
      <a href="https://github.com/DisStat/DisStat" target="_blank" rel="noopener">open source</a> alternative to
      <a href="https://statcord.com" target="_blank" rel="noopener">Statcord</a> which went offline recently and didn't
      receive any public updates in a long time.
      <br>
      <router-link to="/bots/685166801394335819">View a demo</router-link>
    </p>
    <!-- <router-link to="/user/me">Add your bot now!</router-link> -->
    <h2>All currently tracked, public bots</h2>

    <botlist botListRoute="/api/bots"></botlist>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'DisStat',
  description: "Track your Discord bot's statistics using DisStat.",
  ogTitle: 'DisStat',
  ogDescription: "Track your Discord bot's statistics using DisStat.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://disstat.numselli.xyz',
  twitterTitle: 'DisStat',
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
import botlist from '../components/botlist.vue'

export default {
  name: 'home',
  components: {
    botlist
  }
}
</script>
