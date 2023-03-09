<template>
  <main>
    <br>
    <div class="waves-effect waves-light btn-large" @click="showAddModal"><i class="material-icons right">add</i>Add your bot</div>
    <h1>Your bots</h1>
    <div>
      <div v-for="bot in botList">
        <span>{{ bot.username }}</span>
        <span>{{bot.botid}}</span>
        <img :src="'https://cdn.discordapp.com/avatars/'+bot.botid+'/'+bot.avatar+'.png'" alt="">
      </div>
    </div>
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
import modal from '../components/modal.vue';

export default {
  name: 'me',
  components: {
    modal,
  },
  data() {
    return {
      botList:[],
      isAddModalVisible: false
    };
  },
  methods: {
    async submitBot(){
      const ajaxdata = await fetch(`/api/bots/add`, {
        method: 'post',
        body: JSON.stringify({id:this.$refs.botid.value}),
        headers: {'Content-Type': 'application/json'}
      }).catch(err => console.error);
      console.log(ajaxdata)
      if (ajaxdata.status === 201) return window.location.href = `/bots/${this.$refs.botid.value}`;
      else alert("error adding bot")
    },
    showAddModal() {
      this.isAddModalVisible = true;
    },
    closeAddModal() {
      this.isAddModalVisible = false;
    }
  },
  async mounted() {
    const ajaxdata = await fetch(`/api/discordOauth/user`).catch(err => console.error);
    if (ajaxdata.status === 401) return window.location.href = `/api/discordOauth/login`;

    const rawBots = await fetch("/api/mybots")
    this.botList = await rawBots.json()
  },
}
</script>