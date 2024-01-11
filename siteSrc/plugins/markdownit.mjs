import MarkdownIt from 'markdown-it'

// based off of https://github.com/nuxt-alt/markdown-it/blob/cf823470b1fe0b371761a75913574b3540ce3684/src/module.ts
export default defineNuxtPlugin(nuxtApp => {
    const md = new MarkdownIt("default", {
        runtime: true,
        linkify: true,
        breaks: true
    })

    nuxtApp.provide('md', md);
})