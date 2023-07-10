<template>
  <div class="container">
    <!-- Privacy Policy -->
    <div class="section">
      <div class="center-align">
        <h2>Privacy Policy</h2>
      </div>

      <p>
        We only store data you (the user) provide to us, for example by logging in, adding your bot(s) or posting data from your bots.
        <br>
        You are free to delete this data at any time by visiting <router-link to="/me/settings">your user settings</router-link> and clicking "Delete all data".
        <br>
        We do not track you or sell or otherwise use your data, the data is only stored for the purpose it's intended for and deleted after that.
        You can have a look at our GitHub repository to check for yourself.
      </p>
    </div>

    <!-- Terms of Service -->
    <div class="divider"></div>
    <div class="section">
      <div class="center-align">
        <h2>Terms of Service</h2>
      </div>

      <p>You <b>must</b>:</p>
      <ol>
        <li>Mark bots as NSFW if they have a NSFW avatar</li>
      </ol>

      <p>You <b>must not</b>:</p>
      <ol>
        <li>Spam our API with unnecessary/garbage data</li>
      </ol>

      <p>You <b>should not</b>:</p>
      <ol>
        <li>Post your bot general stats more than once a minute, you might get ratelimited otherwise</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'DisStat - Privacy',
  description: "Read DisStat's privacy policy and terms of service.",
  ogTitle: 'DisStat - Privacy',
  ogDescription: "Read DisStat's privacy policy and terms of service.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://disstat.numselli.xyz',
  twitterTitle: 'DisStat - Privacy',
  twitterDescription: "Read DisStat's privacy policy and terms of service.",
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
