<template>
  <div class="container">
    <h1>DisStat - Track statistics of your Discord bot</h1>

    <p>
      This site allows tracking of Discord bot statistics, like guild, user and shard count, and used commands. It's a
      fully
      <a href="https://github.com/DisStat/DisStat" target="_blank" rel="noopener"> open source</a> alternative to
      <a href="https://statcord.com" target="_blank" rel="noopener"> Statcord</a>, which went offline recently and didn't
      receive any public updates in a long time.
    </p>
    <router-link to="/login">Add your bot now!</router-link>
    <h2>All currently tracked, public bots</h2>

    <botlist botListRoute="/siteApi/bots"></botlist>
  </div>
</template>

<script>
import botlist from '../components/botlist.vue'

export default {
  name: 'home',
  components: {
    botlist
  }
}
useSeoMeta({
  title: 'My Amazing Site',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>
