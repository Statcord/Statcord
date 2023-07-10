<template>
  <div class="container">
    <div class="section">
      <div class="center-align">
        <h2>How to setup statistics tracking</h2>
      </div>

      <p>
        While we are still in development you can already post your data. You can either implement the endpoints yourself using our <a href="./docs">API documentation</a> or you use one of our API wrappers.
        <br>
        You should post your bots general data at most once a minute.
        <br>
        Commands, events etc. may be posted when they occur or combined with the general bot data posting.
      </p>

      <h3>API wrappers</h3>
      <ul>
        <li><b>Node.js</b>: <a href="https://www.npmjs.com/package/disstat" target="_blank" rel="noopener">disstat</a> by TomatoCake</li>
      </ul>

      <h3>Importing data from Statcord</h3>
      <p>
        We're already tracking Statcord data from a few bots, but yours might not be included in that list. You can import your bots data from Statcord when setting it up.
      </p>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'DisStat - Setup guide',
  description: "Read DisStat's bot statistics tracking setup guide.",
  ogTitle: 'DisStat - Setup guide',
  ogDescription: "Read DisStat's bot statistics tracking setup guide.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://disstat.numselli.xyz',
  twitterTitle: 'DisStat - Setup guide',
  twitterDescription: "Read DisStat's bot statistics tracking setup guide.",
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
  name: 'privacy'
}
</script>
