<template>
  <main>
    <br>
    <div class="waves-effect waves-light btn-large" @click="showAddModal"><i class="material-icons left">add</i>Add your bot</div>
    <router-link class="waves-effect waves-light btn-large" to="/users/me/settings"><i class="material-icons left">settings</i>User Settings</router-link>
    <h1>Your bots</h1>
    <botlist botListRoute="/siteApi/mybots"></botlist>
  </main>

  <modal v-show="isAddModalVisible" header="Add your bot" @close="closeAddModal">
    <label for="botid">Enter the Bot ID</label>
    <input type="text" ref="botid" pattern="[0-9]{17,21}" placeholder="685166801394335819">
    <br>
    <br>
    <button @click="submitBot" type="button" id="addbotbutton">Add bot</button>
  </modal>
</template>

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
      else this.$M.toast({html: "error adding bot"})
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
useSeoMeta({
  title: 'My Amazing Site',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>
