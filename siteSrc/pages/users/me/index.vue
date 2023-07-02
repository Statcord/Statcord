<template>
  <div class="waves-effect waves-light btn-large" @click="showAddModal"><i class="material-icons left">add</i>Add your bot</div>
  <router-link class="waves-effect waves-light btn-large" to="/users/me/settings"><i class="material-icons left">settings</i>User Settings</router-link>
  <h1>Your bots</h1>
  <botlist botListRoute="/siteApi/mybots"></botlist>

  <modal v-show="isAddModalVisible" mHeader="Add your bot" @close="closeAddModal">
    <label for="botid">Enter the Bot ID</label>
    <input type="text" ref="botid" pattern="[0-9]{17,21}" placeholder="685166801394335819">
    <button @click="submitBot" type="button">Add bot</button>
  </modal>
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
import modal from '../../../components/modal.vue';
import botlist from '../../../components/botlist.vue'

export default {
  name: 'me',
  components: {
    modal,
    botlist
  },
  data() {
    return {
      isAddModalVisible: false
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
    },
    showAddModal() {
      this.isAddModalVisible = true;
    },
    closeAddModal() {
      this.isAddModalVisible = false;
    }
  },
  async mounted() {
    if (!this.$auth.isLoggedIn()) await navigateTo("/login");
  },
}
</script>
