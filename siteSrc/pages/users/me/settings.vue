<template>
  <div class="waves-effect waves-light btn-large red modal-trigger" data-target="modal1"><i class="material-icons left">delete_forever</i>Delete all data</div>

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
    };
  },
  methods: {
    async confirmedDelete() {
      const { error } = await useFetch(() => `/siteApi/discordOauth/user/delete`, {
        method: 'delete',
      })
      if (!error.value) {
        await navigateTo("/")
      }
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
