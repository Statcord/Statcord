import { M } from "@materializecss/materialize/dist/js/materialize.js";

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('M', M)
})