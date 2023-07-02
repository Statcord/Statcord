<template>
  <div class="container">
    <!-- Privacy Policy -->
    <div class="section">
      <div class="center-align">
        <h2>Privacy Policy</h2>
      </div>
    </div>

    <!-- Terms of Service -->
    <div class="divider"></div>
    <div class="section">
      <div class="center-align">
        <h2>Terms of Service</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'DisStat - Privacy',
  description: "Read DisStat's privacy policy.",
  ogTitle: 'DisStat - Privacy',
  ogDescription: "Read DisStat's privacy policy.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://disstat.numselli.xyz',
  twitterTitle: 'DisStat - Privacy',
  twitterDescription: "Read DisStat's privacy policy.",
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