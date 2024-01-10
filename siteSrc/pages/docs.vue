<template>
   <div id="test"></div>
</template>
  
  <script setup>
  useSeoMeta({
    title: 'DisStat - Docs',
    description: "Read DisStat's API Docs.",
    ogTitle: 'DisStat - Docs',
    ogDescription: "Read DisStat's API Docs.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://disstat.numselli.xyz',
    twitterTitle: 'DisStat - Docs',
    twitterDescription: "Read DisStat's API Docs.",
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
    import { SwaggerUIBundle } from "swagger-ui-dist"

  export default {
    name: 'docs',
    async mounted(){
        const apiDefinition = await useFetch('/api/docs/json')

        SwaggerUIBundle({
            "dom_id": "#test",
            spec: apiDefinition.data.value
        })
    }
  }
  </script>
  
<style>
@import url(https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui.css);
/* @import "swagger-ui-dist/swagger-ui.css"; */
select {
  opacity: 1;
  color: var(--font-color-main);
}
</style>