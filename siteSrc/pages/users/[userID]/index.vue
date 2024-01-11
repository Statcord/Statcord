<template>
  <router-link v-if="isProfileOwner" class="waves-effect waves-light btn-large" to="/bots/add"><i class="material-icons left">add</i>Add your bot</router-link>
  <router-link v-if="isProfileOwner" class="waves-effect waves-light btn-large" :to="'/users/'+this.$route.params.userID+'/settings'"><i class="material-icons left">settings</i>User Settings</router-link>

  <div>
    <div class="row">
      <img :src="userAvatar" alt="" class="circle">
      <h1>{{profileInfo.username}}</h1>

    </div>
    <h4>{{ profileInfo.aboutme }}</h4>

    <div v-if="profileInfo.website">
      <safeLinkPopUp icon="link" name="Website" :url="profileInfo.website"></safeLinkPopUp>
      <!-- <span class=""><i class="material-icons">link</i>Website</span>
      <a :href="profileInfo.website" target="_blank" rel="noopener noreferrer"><i class="material-icons">link</i>Website</a> -->
    </div>
  </div>

  <h1>Bots</h1>
  <botlist :botListRoute="'/api/user/'+this.$route.params.userID+'/bots/'"></botlist>
</template>
<script setup>
useSeoMeta({
  title: 'DisStat - My bots',
  description: "Track your Discord bot's statistics using DisStat.",
  ogTitle: 'DisStat - My bots',
  ogDescription: "Track your Discord bot's statistics using DisStat.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://disstat.numselli.xyz',
  twitterTitle: 'DisStat - My bots',
  twitterDescription: "Track your Discord bot's statistics using DisStat.",
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
import botlist from '../../../components/botlist.vue'
import safeLinkPopUp from '../../../components/openLink.vue'

export default {
  name: 'me',
  components: {
    botlist,
    safeLinkPopUp
  },
  data() {
    return {
      isProfileOwner: false,
      profileInfo: {},
      userAvatar:""
    };
  },
  async mounted() {
    this.isProfileOwner = this.$auth.getUser()?.id === this.$route.params.userID

    const {data: user, error} = await useFetch(`/api/user/${this.$route.params.userID}`)
    if (!this.isProfileOwner && error.value) return await navigateTo("/");

    this.profileInfo = user.value
    this.userAvatar = `https://cdn.discordapp.com/avatars/${user.value.avatar ? `${this.$route.params.userID}/${user.value.avatar}.webp`: `${(this.$route.params.userID >>> 22) % 5}.png`}`
  }
}
</script>