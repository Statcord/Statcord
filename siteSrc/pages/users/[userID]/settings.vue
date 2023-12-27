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
        <input type="url" placeholder="https://yourDomain.tld" @change="updateSettingsValue" name="website" ref="settings:website">
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

<script>
export default {
  name: 'userSettings',
  data() {
    return {
      profileInfo: {}
    };
  },
  methods: {
    async confirmedDelete() {
      const { error } = await useFetch(() => `/api/oauth/user/delete`, {
        method: 'delete',
      })
      if (!error.value) {
        await navigateTo("/")
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
        body: JSON.stringify(outOBJ),
        headers: {'Content-Type': 'application/json'}
      })

      this.$M.toast({text: error.value ? 'Error saving' : 'Saved'})
      console.log(outOBJ)
    }
  },
  async mounted() {
    // if (!this.$auth.isLoggedIn()) await navigateTo("/login");
    // if (this.$auth.getUser()?.id === this.$route.params.userID) await navigateTo("/login");

    const {data: user} = await useFetch(`/api/user/${this.$route.params.userID}`)
    this.profileInfo = user.value

    this.$M.Modal.init(this.$refs.modal, {
      onOpenStart: ()=> this.$refs.modal.classList.remove("hide")
    })
  }
}
</script>
