export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()
    nuxtApp.provide('genOauthUrl', (path) => `https://discord.com/api/oauth2/authorize?client_id=${config.public.botID}&response_type=code&scope=identify+applications.builds.read&prompt=none&state=${encodeURIComponent(path.split("?")[0].split("#")[0])}&redirect_uri=${encodeURIComponent(config.public.domain + "/api/oauth/callback")}`)
})