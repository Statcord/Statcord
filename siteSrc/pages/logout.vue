<template></template>

<script>
export default {
  name: 'logout',
  created() {
    useFetch("/siteApi/discordOauth/logout").then(() => {
      window.location.pathname = "/"
    })
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
