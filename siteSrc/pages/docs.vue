<template>
   <div id="test"></div>
</template>
  
<script setup>
  useSeoMeta({
    themeColor: "#0080F0",
    description: "Read Statcord's API Docs.",
    ogDescription: "Read Statcord's API Docs.",
    ogImage: '/img/icon.png',
    ogUrl: 'https://statcord.com',
    twitterDescription: "Read Statcord's API Docs.",
    twitterImage: '/img/icon.png',
    twitterCard: 'summary'
  })
</script> 
<script>
  import { SwaggerUIBundle } from "swagger-ui-dist"

  export default {
    name: 'docs',
    async mounted(){
        const apiDefinition = await $fetch('/api/docs/json')

        SwaggerUIBundle({
            "dom_id": "#test",
            spec: apiDefinition
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