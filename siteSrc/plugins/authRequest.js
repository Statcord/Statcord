export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('authRequest', async (url)=>{
    //   const headers = useRequestHeaders(['cookie'])
    //   return await useFetch(url, {headers})
      const headers = useRequestHeaders(['cookie'])
      return new Promise(async (resolve, reject)=>{
          const data = await $fetch(url, {headers}).catch(e=>{
            if (e.message.includes("404")) return "404"
            if (e.message.includes("401")) return "401"
            // console.log(e.message)
          })
        //   console.log(data)
          if (data) resolve(data)
      })
    })
  })