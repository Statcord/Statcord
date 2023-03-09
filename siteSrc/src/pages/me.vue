<template>
  <main>
    <br>
    <div class="waves-effect waves-light btn-large" @click="showAddModal"><i class="material-icons right">add</i>Add your
      bot</div>
    <div class="waves-effect waves-light btn-large" @click="showKeyModal"><i class="material-icons right">vpn_key</i>View
      API key</div>

    <!-- <h1>Your bots</h1> -->
    <!-- <div id="bots"></div> -->
  </main>

  <modal v-show="isAddModalVisible" header="Add your bot" @close="closeAddModal">
    <label for="botid">Enter the Bot ID</label>
    <input type="text" id="botid" pattern="[0-9]{17,21}" oninput="getAvatar(this.value)" placeholder="685166801394335819">
    <br>
    <br>
    <button type="button" id="addbotbutton" onclick="addBot(document.getElementById('botid').value)">Add bot</button>
  </modal>

  <modal v-show="isKeyModalVisible" header="VIEW YOUR API KEY" @close="closeKeyModal">

    <label for="botid">View your API key</label>
    <input type="text" id="botapikey" size="25" disabled>
    <button type="button" onclick="copyKey()">Copy key</button>

    <br>
    <br>
    <button type="button" class="danger" onclick="regenKey()">Regenerate key</button>

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
      isAddModalVisible: false,
      isKeyModalVisible: false,
    };
  },
  methods: {
    showAddModal() {
      this.isAddModalVisible = true;
    },
    closeAddModal() {
      this.isAddModalVisible = false;
    },
    showKeyModal() {
      this.isKeyModalVisible = true;
    },
    closeKeyModal() {
      this.isKeyModalVisible = false;
    }
  },
}
</script>