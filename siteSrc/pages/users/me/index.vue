<template>
  <div class="waves-effect waves-light btn-large modal-trigger" data-target="modal1"><i class="material-icons left">add</i>Add your bot</div>
  <router-link class="waves-effect waves-light btn-large" to="/users/me/settings"><i class="material-icons left">settings</i>User Settings</router-link>
  <h1>Your bots</h1>
  <botlist botListRoute="/siteApi/mybots"></botlist>

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
    };
  },
  methods: {
    async submitBot() {
      const {error} = await useFetch(() => `/siteApi/bots/add`, {
        method: 'post',
        body: JSON.stringify({id:this.$refs.botid.value}),
        headers: {'Content-Type': 'application/json'}
      })
      if (!error.value) await navigateTo(`/bots/${this.$refs.botid.value}`);
      else this.$M.toast({text: "error adding bot"})
    }
  },
  async mounted() {
    if (!this.$auth.isLoggedIn()) await navigateTo("/login");
    this.$M.Modal.init(this.$refs.modal, {
      onOpenStart: ()=> this.$refs.modal.classList.remove("hide")
    })
  }
}
</script>
