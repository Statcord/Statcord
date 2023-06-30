<template></template>

<script setup>
  useFetch("/siteApi/discordOauth/logout").then(()=>{})
  await navigateTo("/")
</script>
