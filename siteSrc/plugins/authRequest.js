export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('authRequest', async (url, prams)=>{
    const headers = useRequestHeaders(['cookie'])
      return new Promise(async (resolve, reject)=>{
        const data = await $fetch(url, {...prams, headers}).catch(e=>{
        if (e.message.includes("404")) return "404"
        if (e.message.includes("401")) return "401"
      })
      if (data) resolve(data)
    })
  })
})