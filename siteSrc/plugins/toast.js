export default defineNuxtPlugin(nuxtApp => {
  const toast = useToast()
  nuxtApp.provide('toast', toast)
})