<template>
  <navbar/>
  <NuxtPage/>
  <footerbar/>
</template>

<script>
import navbar from './components/nav.vue'
import footerbar from './components/footer.vue'

export default {
  name: 'App',
  components: {
    navbar,
    footerbar
  }
}
</script>

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