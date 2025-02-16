<template>
  <UContainer>
    <div>
      <h1 class="mt-2 text-3xl font-medium tracking-tight">How to setup statistics tracking</h1>
      <UDivider/>

      <p class="flow-text">
        While we are still in development you can already post your data. You can either implement the endpoints yourself using our 
        <router-link to="/docs" class="blue-text text-darken-2 underline">API documentation</router-link> or you use one of our API wrappers.
        Your bot should post all data you wish to track once a minute at the most.
      </p>
    </div>

    <UDivider class="pt-6 pb-4"/>

    <div>
      <h1 class="mt-2 text-3xl font-medium tracking-tight">API wrappers</h1>
      <UDivider/>
      <ul class="list-disc list-inside">
        <li><b>Node.js</b>: <NuxtLink to="https://www.npmjs.com/package/disstat" target="_blank" rel="noopener" class="blue-text text-darken-2 underline">disstat</NuxtLink> by TomatoCake</li>
        <li><b>Node.js</b>: <NuxtLink to="https://www.npmjs.com/package/statcord-npm" target="_blank" rel="noopener" class="blue-text text-darken-2 underline">statcord-npm</NuxtLink> by numselli</li>
        <li><b>Python</b>: <NuxtLink to="https://pypi.org/project/disstat/" class="blue-text text-darken-2 underline">disstat</NuxtLink> by The Untraceable</li>
      </ul>
    </div>
  </UContainer>
</template>

<script setup>
useSeoMeta({
  themeColor: "#0080F0",
  title: 'Setup guide',
  description: "Read Statcord's bot statistics tracking setup guide.",
  ogTitle: 'Setup guide',
  ogDescription: "Read Statcord's bot statistics tracking setup guide.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://statcord.com',
  twitterTitle: 'Setup guide',
  twitterDescription: "Read Statcord's bot statistics tracking setup guide.",
  twitterImage: '/img/icon.png',
  twitterCard: 'summary'
})
</script>
<script>
export default {
  name: 'guide'
}
</script>
