<template>
   <div id="test"></div>
</template>
  
  <script setup>
    // import { SwaggerUIBundle } from "swagger-ui-dist"

//   useSeoMeta({
//     title: 'DisStat - Setup guide',
//     description: "Read DisStat's bot statistics tracking setup guide.",
//     ogTitle: 'DisStat - Setup guide',
//     ogDescription: "Read DisStat's bot statistics tracking setup guide.",
//     ogImage: '/img/icon.png',
//     ogUrl: 'https://disstat.numselli.xyz',
//     twitterTitle: 'DisStat - Setup guide',
//     twitterDescription: "Read DisStat's bot statistics tracking setup guide.",
//     twitterImage: '/img/icon.png',
//     twitterCard: 'summary'
//   })
  
//   useHead({
//     htmlAttrs: {
//       lang: 'en'
//     },
//     link: [
//       {
//         rel: 'icon',
//         type: 'image/png',
//         href: '/img/favicon.ico'
//       }
//     ]
//   })
</script> 
  <script>
    import { SwaggerUIBundle } from "swagger-ui-dist"

  export default {
    name: 'docs',
    async mounted(){
        const apiDefinition = await useFetch('/api/docs/json')

        console.log(apiDefinition.data.value)


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
</style>