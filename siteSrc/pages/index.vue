<template>
  <UContainer>
    <h1>Statcord - Track statistics of your Discord bot</h1>

    <p class="flow-text">
      This site allows tracking of Discord bot statistics like: guild, user, member counts, and command usage. It's a fully
      <NuxtLink to="https://github.com/statcord/DisStat" target="_blank" rel="noopener" class="blue-text text-darken-2 underline">open source</NuxtLink>.
    </p>

    <p class="flow-text">
      <router-link to="/bots/add" class="blue-text text-darken-2 underline">Add your bot now</router-link> or <router-link to="/bots/685166801394335819" class="blue-text text-darken-2 underline">View a demo</router-link>!
    </p>
   
    <h2>All currently tracked, public bots</h2>
    <botlist botListRoute="/api/bots"></botlist>
  </UContainer>
</template>

<script setup>
useSeoMeta({
  themeColor: "#0080F0",
  description: "Track your Discord bot's statistics using Statcord.",
  ogDescription: "Track your Discord bot's statistics using Statcord.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://statcord.com',
  twitterDescription: "Track your Discord bot's statistics using Statcord.",
  twitterImage: '/img/icon.png',
  twitterCard: 'summary'
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
