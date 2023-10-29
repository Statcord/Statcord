<template></template>

<script setup>
// const {
//   session,
//   refresh,
//   remove,
//   reset,
//   update,
//   overwrite
// } = await useSession()

// await remove()

  // useFetch("/api/discordOauth/logout").then(()=>{})
  // await navigateTo("/")

  useSeoMeta({
    title: 'DisStat - Logout',
    description: "Track your Discord bot's statistics using DisStat.",
    ogTitle: 'DisStat - Logout',
    ogDescription: "Track your Discord bot's statistics using DisStat.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://disstat.numselli.xyz',
    twitterTitle: 'DisStat - Logout',
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