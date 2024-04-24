<template>
  <div class="container">
    <div class="section">
      <div class="center-align">
        <h2>How to setup statistics tracking</h2>
      </div>
      <div class="divider"></div>


      <p class="flow-text">
        While we are still in development you can already post your data. You can either implement the endpoints yourself using our 
        <router-link to="/docs" class="blue-text text-darken-2 underline">API documentation</router-link> or you use one of our API wrappers.
        <br>
        You should post your bots general data at most once a minute.
        <br>
        Commands, events etc. may be posted when they occur or combined with the general bot data posting.
      </p>


      <div class="divider"></div>
      <div class="section">
        <h3>API wrappers</h3>
        <ul class="flow-text">
          <li><b>Node.js</b>: <NuxtLink to="https://www.npmjs.com/package/disstat" target="_blank" rel="noopener" class="blue-text text-darken-2 underline">disstat</NuxtLink> by TomatoCake</li>
          <li><b>Node.js</b>: <NuxtLink to="https://www.npmjs.com/package/statcord-npm" target="_blank" rel="noopener" class="blue-text text-darken-2 underline">statcord-npm</NuxtLink> by numselli</li>
          <li><b>Python</b>: <NuxtLink to="https://pypi.org/project/disstat/" class="blue-text text-darken-2 underline">disstat</NuxtLink> by The Untraceable</li>
        </ul>
      </div>

      <div class="divider"></div>
      <div class="section">
        <h3>Importing data from Statcord</h3>
        <p class="flow-text">
          We're already tracking Statcord data from a few bots, but yours might not be included in that list. You can import your bots data from Statcord when setting it up.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  themeColor: "#0080F0",
  title: 'Statcord - Setup guide',
  description: "Read Statcord's bot statistics tracking setup guide.",
  ogTitle: 'Statcord - Setup guide',
  ogDescription: "Read Statcord's bot statistics tracking setup guide.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://statcord.com',
  twitterTitle: 'Statcord - Setup guide',
  twitterDescription: "Read Statcord's bot statistics tracking setup guide.",
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
export default {
  name: 'guide'
}
</script>
