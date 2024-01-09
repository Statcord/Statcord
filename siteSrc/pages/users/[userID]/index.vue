<template>
  <router-link v-if="isProfileOwner" class="waves-effect waves-light btn-large" to="/bots/add"><i class="material-icons left">add</i>Add your bot</router-link>
  <router-link v-if="isProfileOwner" class="waves-effect waves-light btn-large" :to="'/users/'+this.$route.params.userID+'/settings'"><i class="material-icons left">settings</i>User Settings</router-link>

  <div>
    <h1>{{profileInfo.username}}</h1>
    <h4>{{ profileInfo.aboutme }}</h4>

    <div v-if="profileInfo.website">
      <a :href="profileInfo.website" target="_blank" rel="noopener noreferrer"><i class="material-icons">link</i></a>
    </div>
  </div>

  <h1>Bots</h1>
  <botlist :botListRoute="'/api/user/'+this.$route.params.userID+'/bots/'"></botlist>

  <div id="modal1" ref="modal" class="modal hide">
    <div class="modal-content">
      <h4>Add your bot</h4>
      <label for="botid">Enter the Bot ID</label>
      <input type="text" ref="botid" pattern="[0-9]{17,21}" placeholder="685166801394335819">
    </div>
    <div class="modal-footer">
      <div>
        <div class="modal-close waves-effect waves-light btn left">Cancel</div>
        <div class="modal-close waves-effect waves-light btn right" @click="submitBot">Add bot</div>
      </div>
    </div>
  </div>
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

export default {
  name: 'me',
  components: {
    botlist
  },
  data() {
    return {
      isProfileOwner: false,
      profileInfo: {}
    };
  },
  methods: {
    async submitBot() {
      const {error} = await useFetch(() => `/api/bots/add`, {
        method: 'post',
        body: JSON.stringify({id:this.$refs.botid.value}),
        headers: {'Content-Type': 'application/json'}
      })
      if (!error.value) await navigateTo(`/bots/${this.$refs.botid.value}`);
      else this.$M.toast({text: "error adding bot"})
    }
  },
  async mounted() {
    this.isProfileOwner = this.$auth.getUser()?.id === this.$route.params.userID

    const {data: user} = await useFetch(`/api/user/${this.$route.params.userID}`)
    // if (!user.value.public) await navigateTo("/login");
    this.profileInfo = user.value
    
    this.$M.Modal.init(this.$refs.modal, {
      onOpenStart: ()=> this.$refs.modal.classList.remove("hide")
    })
  }
}
</script>