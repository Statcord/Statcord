import M from 'materialize-css'
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('M', M)
})