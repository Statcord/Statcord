class auth{
  #session
  constructor(sessionData){
    this.#session = sessionData
  }

  async canSeeBot(botid, privileged) {
    const {data: rawBotuseFetch} = await useFetch(() => `/api/bots/${botid}`)

    const isOwner = this.isLoggedIn() && rawBotuseFetch.value.ownerid === this.#session.id
    const isPublic = rawBotuseFetch.value.public

    return ((!!privileged || !isPublic) && isOwner) || (isPublic && this.isLoggedIn())
  }

  isLoggedIn(){
    return this.#session !== null
  }

  getUser() {
    return this.#session
  }
}

export default defineNuxtPlugin(async nuxtApp => {
  const {data: user} = await useFetch(() => `/api/discordOauth/user`)
  nuxtApp.provide('auth', new auth(user.value))
})
