<template>
  <UApp>
    <navbar/>
    <NuxtPage/>
    <footerbar/>
  </UApp>
</template>

<script setup>  
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