<template>
  <UContainer>
    <!-- Privacy Policy -->
    <div>
      <h1 class="mt-2 text-3xl font-medium tracking-tight">Privacy Policy</h1>

      <p class="flow-text">
        We only store data you (the user) provide to us, for example by logging in, adding your bot(s) or posting data from your bots.
        You are free to delete this data at any time by visiting your user settings and clicking "Delete all data".
        We do not track you or sell or otherwise use your data, the data is only stored for the purpose it's intended for and deleted after that.
        All of the code is open source in our <NuxtLink to="https://github.com/statcord/statcord">GitHub repository</NuxtLink> if you would like look at how the data is used.
      </p>
    </div>

    <!-- Terms of Service -->
    <UDivider class="pt-6 pb-4"/>

    <div>
      <h1 class="mt-2 text-3xl font-medium tracking-tight">Terms of Service</h1>

      <span class="mt-2 text-xl font-medium tracking-tight">You </span>
      <span class="mt-2 text-xl font-bold tracking-tight"><b>MUST</b></span>
      <span class="mt-2 text-xl font-medium tracking-tight">:</span>

      <!-- <span class="list-dissc">Mark bots as NSFW if they have a NSFW avatar</span> -->
      <ol class="list-disc list-inside">
        <li>Mark bots as NSFW if they have a NSFW avatar</li>
      </ol>

      <span class="mt-2 text-xl font-medium tracking-tight">You </span>
      <span class="mt-2 text-xl font-bold tracking-tight"><b>MUST NOT</b></span>
      <span class="mt-2 text-xl font-medium tracking-tight">:</span>
      <ol class="list-disc list-inside">
        <li>Spam our API with unnecessary/garbage data</li>
        <li>Post your bot stats more than once per minute, you might get ratelimited or temporarily banned otherwise</li>
      </ol>
    </div>
  </UContainer>
</template>

<script setup>
  useSeoMeta({
    themeColor: "#0080F0",
    description: "Read Statcord's privacy policy and terms of service.",
    ogDescription: "Read Statcord's privacy policy and terms of service.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://statcord.com',
    twitterDescription: "Read Statcord's privacy policy and terms of service.",
    twitterImage: '/img/icon.png',
    twitterCard: 'summary'
  })
</script>
<script>
  export default {
    name: 'privacy'
  }
</script>
