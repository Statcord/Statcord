<template>
  <div class="container">
    <div>
      <label>
        <input type="checkbox" :checked="profileInfo.public" @change="updateSettingsValue" name="public" ref="settings:public">
        <span>Public</span>
      </label>
      <label>
        <input type="text" :placeholder="profileInfo.aboutme" @change="updateSettingsValue" name="aboutme" ref="settings:aboutme">
        <span>About Me</span>
      </label>
      <label>
        <input type="url" :placeholder="profileInfo.website" @change="updateSettingsValue" name="website" ref="settings:website">
        <span>Website</span>
      </label>
    </div>
  
  
  
    <div class="waves-effect waves-light btn-large red modal-trigger" data-target="modal1"><i class="material-icons left">delete_forever</i>Delete all data</div>
    <div class="waves-effect waves-light btn-large" @click="saveSettings"><i class="material-icons left">save</i>Save</div>
  
    <div id="modal1" ref="modal" class="modal hide">
      <div class="modal-content">
        <h4>Confirm data deletion</h4>
      </div>
      <div class="modal-footer">
        <div>
          <div class="modal-close waves-effect waves-light btn left">Cancel</div>
          <div class="modal-close waves-effect waves-light btn red accent-3 right" @click="confirmedDelete">Delete forever (really!)<i class="material-icons left">delete_forever</i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRoute } from 'vue-router';
  const { $authRequest, $genOauthUrl } = useNuxtApp()
  const route = useRoute()
  const oauthUrl = $genOauthUrl(route.fullPath)

  const {accessToken} = await $authRequest("/api/session")
  if (!accessToken) await navigateTo(oauthUrl, {external: true});

  const profileInfo = await $authRequest(`/api/user/${route.params.userID}`)
  if (profileInfo === "404") throw createError({
    statusCode: 404,
    message: 'User not found'
  })
  if (profileInfo === "401") throw createError({
    statusCode: 401,
    message: 'You do not have permission to veiw this user'
  })
  
  
useSeoMeta({
  themeColor: "#0080F0",
  title: 'Statcord - User settings',
  description: "Manage your user settings on Statcord.",
  ogTitle: 'Statcord - User settings',
  ogDescription: "Manage your user settings on Statcord.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://statcord.com',
  twitterTitle: 'Statcord - User settings',
  twitterDescription: "Manage your user settings on Statcord.",
  twitterImage: '/img/icon.png',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/img/favicon.ico'
    }
  ]
})
</script>

<script>
export default {
  name: 'userSettings',
  data() {
    return {
    };
  },
  methods: {
    async confirmedDelete() {
      const { error } = await useFetch(() => `/api/oauth/user/delete`, {
        method: 'delete',
      })
      if (!error.value) {
        this.$authRequest('/api/session', {
          method: "DELETE"
        })
        await navigateTo("/", {"external": true})
      }
    },
    updateSettingsValue(a){
      if (a.target.type === "checkbox") return a.target.newValue=a.target.checked
      a.target.newValue=a.target.value
    },
    async saveSettings(){
      const outOBJ = {}
      Object.keys(this.$refs).filter(ref=>ref.startsWith("settings:")).forEach(ref=>outOBJ[ref.replace("settings:", '')] = this.$refs[ref].newValue)

      const {error} = await useFetch(() => `/api/user/${this.$route.params.userID}/settings/set`, {
        method: 'post',
        body: outOBJ
      })

      this.$M.toast({text: error.value ? 'Error saving' : 'Saved'})
      console.log(outOBJ)
    }
  },
  async mounted() {
    this.$M.Modal.init(this.$refs.modal, {
      onOpenStart: ()=> this.$refs.modal.classList.remove("hide")
    })
  }
}
</script>
