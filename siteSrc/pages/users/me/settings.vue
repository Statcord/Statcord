<template>
    <main>
      <br>
      <div class="waves-effect waves-light btn-large red" @click="showDeleteAllModal"><i class="material-icons left">delete_forever</i>Delete all data</div>
    </main>

    <modal v-show="isDeleteAllModalVisible" header="Confirm data deletion" @close="closeDeleteAllModal">
      <div @click="closeDeleteAllModal" class="waves-effect waves-light btn" type="button">Cancel</div>
      <div class="waves-effect waves-light btn red accent-3" @click="confirmedDelete">Delete forever (really!)<i class="material-icons left">delete_forever</i></div>
    </modal>
  </template>

  <script>
  import modal from '../../../components/modal.vue';

  export default {
    name: 'userSettings',
    components: {
      modal
    },
    data() {
      return {
        isDeleteAllModalVisible: false
      };
    },
    methods: {
      async confirmedDelete() {
        const ajaxdata = await useFetch(() => `/siteApi/discordOauth/user/delete`, {
            method: 'delete',
        }).catch(err => console.error);
        if (ajaxdata.status === 201) {
            return window.location.href = `/`
        }
      },
      showDeleteAllModal() {
        this.isDeleteAllModalVisible = true;
      },
      closeDeleteAllModal() {
        this.isDeleteAllModalVisible = false;
      }
    },
    async mounted() {
      if (!this.$auth.isLoggedIn()) return window.location.href = `/siteApi/discordOauth/login`;
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
