<template>
  <router-link v-if="user.isProfileOwner" class="waves-effect waves-light btn-large" to="/bots/add"><i class="material-icons left">add</i>Add your bot</router-link>
  <router-link v-if="user.isProfileOwner" class="waves-effect waves-light btn-large" :to="'/users/'+userID+'/settings'"><i class="material-icons left">settings</i>User Settings</router-link>

  <div>
    <div class="row">
      <img :src="user.avatarURL" alt="" class="circle">
      <h1>{{user.username}}</h1>

    </div>
    <h4>{{ user.aboutme }}</h4>

    <div v-if="user.website">
      <safeLinkPopUp icon="link" name="Website" :url="user.website"></safeLinkPopUp>
    </div>
  </div>

  <h1>Bots</h1>
  <botlist :botListRoute="'/api/user/'+userID+'/bots/'"></botlist>
</template>
<script setup>
  import { useRoute } from 'vue-router';

  const route = useRoute()
  const headers = useRequestHeaders(['cookie'])

  const { data: userFetch, status } = await useAsyncData(async () => {
    const [bot] = await Promise.all([
      $fetch(`/api/user/${route.params.userID}`, { headers })
    ])
    return bot
  })

  if (status.value === "error") {
    userFetch.value = {
      username: "Private user",
      aboutme: '',
      website: ""
    }
    await navigateTo("/");
  }
  
  const user = {
    ...userFetch.value,
    avatarURL: `https://cdn.discordapp.com/avatars/${userFetch.value.avatar ? `${route.params.userID}/${userFetch.value.avatar}.${userFetch.value.avatar.startsWith("_a") ? '.gif' : 'webp'}`: `${(route.params.userID >>> 22) % 5}.png`}`
  }


useSeoMeta({
  themeColor: "#0080F0",
  title: 'Statcord - My bots',
  description: "Track your Discord bot's statistics using Statcord.",
  ogTitle: 'Statcord - My bots',
  ogDescription: "Track your Discord bot's statistics using Statcord.",
  ogImage: '/img/icon.png',
  ogUrl: 'https://statcord.com',
  twitterTitle: 'Statcord - My bots',
  twitterDescription: "Track your Discord bot's statistics using Statcord.",
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
      userID: this.$route.params.userID
    };
  }
}
</script>