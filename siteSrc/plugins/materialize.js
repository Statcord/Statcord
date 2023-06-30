import M from '@materializecss/materialize'
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('M', M)
})