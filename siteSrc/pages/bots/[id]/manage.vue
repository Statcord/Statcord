<template>
    <div class="navbar-fixed  red accent-1">
        <div class="nav-wrapper">
            <h4 class="center-align">Not all Settings are supported at this time.</h4>
        </div>
    </div>

    <div class="container">
        <!-- <div class="divider"></div>
        <div class="section">
            <h5>Access</h5>
            <div>
                <label>
                    <input type="checkbox" class="filled-in" disabled checked="checked" />
                    <span>Public</span>
                </label>
            </div>
            <div class="input-field inline">
                <input disabled type="email" class="validate">
                <label for="email_inline">Custom url</label>
            </div>
        </div>
        <div class="divider"></div>
        <div class="section">
            <div>
                <h5>Chart Settings</h5>
                <div>
                    <span>Chart name here</span>
                    <div>
                        <label>
                            <input type="checkbox" class="filled-in" disabled checked="checked" />
                            <span>Enabled</span>
                        </label>
                    </div>
                </div>
                <div>
                    <span>Chart name here</span>
                    <div>
                        <label>
                            <input type="checkbox" class="filled-in" disabled checked="checked" />
                            <span>Enabled</span>
                        </label>
                    </div>
                </div>
                <div>
                    <span>Chart name here</span>
                    <div>
                        <label>
                            <input type="checkbox" class="filled-in" disabled checked="checked" />
                            <span>Enabled</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>


 -->



        <!-- <div class="divider"></div>
        <div class="section">
            <div>
                <h5>Custom Chart Settings</h5>
                <div>
                    <span>Chart name here</span>
                    <div>
                        <label>
                            <input type="checkbox" class="filled-in" disabled checked="checked" />
                            <span>Enabled</span>
                        </label>
                    </div>
                    <div class="input-field inline">
                        <input disabled type="email" class="validate">
                        <label for="email_inline">Name</label>
                    </div>
                    <div class="input-field inline">
                        <input disabled type="email" class="validate">
                        <label for="email_inline">label</label>
                    </div>
                    <div class="input-field">
                        <select disabled>
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>
                        <label>Type</label>
                    </div>
                </div>

                <div>
                    <span>Chart name here</span>
                    <div>
                        <label>
                            <input type="checkbox" class="filled-in" disabled checked="checked" />
                            <span>Enabled</span>
                        </label>
                    </div>
                    <div class="input-field inline">
                        <input disabled type="email" class="validate">
                        <label for="email_inline">Name</label>
                    </div>
                    <div class="input-field inline">
                        <input disabled type="email" class="validate">
                        <label for="email_inline">label</label>
                    </div>
                    <div class="input-field">
                        <select disabled>
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>
                        <label>Type</label>
                    </div>
                </div> -->

                <!-- <div>
                    <span>Chart name here</span>
                    <div>
                        <label>
                            <input type="checkbox" class="filled-in" disabled checked="checked" />
                            <span>Enabled</span>
                        </label>
                    </div>
                    <div class="input-field inline">
                        <input disabled type="email" class="validate">
                        <label for="email_inline">Name</label>
                    </div>
                    <div class="input-field inline">
                        <input disabled type="email" class="validate">
                        <label for="email_inline">label</label>
                    </div>
                    <div class="input-field">
                        <select disabled>
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>
                        <label>Type</label>
                    </div>
                </div> -->

                <!-- <div>
                    <span>Chart name here</span>
                    <div>
                        <label>
                            <input type="checkbox" class="filled-in" disabled checked="checked" />
                            <span>Enabled</span>
                        </label>
                    </div>
                    <div class="input-field inline">
                        <input disabled type="email" class="validate">
                        <label for="email_inline">Name</label>
                    </div>
                    <div class="input-field inline">
                        <input disabled type="email" class="validate">
                        <label for="email_inline">label</label>
                    </div>
                    <div class="input-field">
                        <select disabled>
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>
                        <label>Type</label>
                    </div>
                </div> -->
            <!-- </div> -->
        <!-- </div> -->

        <!-- <div class="divider"></div> -->
        <div class="section">
            <div class="waves-effect waves-light btn  modal-trigger" data-target="keyModal1"><i class="material-icons left">keygen</i>API key</div>            
            <div class="waves-effect waves-light btn" @click="sync">Sync<i class="material-icons left">autorenew</i></div>
            <div class="waves-effect waves-light btn disabled" @click="sync">Save<i class="material-icons left">save</i></div>
            <div class="waves-effect waves-light btn red modal-trigger" data-target="delModal1"><i class="material-icons left">delete_forever</i>Delete all data</div>
        </div>
    </div>


    <div id="keyModal1" ref="keyModal1" class="modal hide">
        <div class="modal-content">
            <h4>API key</h4>
           
            <div v-if="apiKey">
                <input type="text" disabled :value="apiKey">
                <div class="waves-effect waves-light btn" @click="copyKey">copy<i class="material-icons left">content_copy</i></div>
            </div>
        </div>
        <div class="modal-footer">
            <div>
                <div class="modal-close waves-effect waves-light btn left">Close</div>
                <div class="waves-effect waves-light btn" @click="reGenKey">Regenerate API key<i class="material-icons left">autorenew</i></div>
            </div>
        </div>
    </div>

    <div id="delModal1" ref="delModal1" class="modal hide">
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

<script setup>
 import { useRoute } from 'vue-router';
    const route = useRoute()
    // const id = ref(route.params.id)
    const bot = await $fetch(`/siteApi/bots/${route.params.id}`)
    // console.log(route)
    useSeoMeta({
        title: () =>`DisStat - ${bot?.username}`,
        ogTitle: () => `DisStat - ${bot?.username}`,
        description:  () => `Manage ${bot?.username} on DisStat.`,
        ogDescription:  () => `Manage ${bot?.username} on DisStat.`,
        ogImage: () =>`https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        twitterImage:() => `https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
        // twitterCard: 'summary_large_image',
        ogUrl: () => `https://disstat.numselli.xyz/bots/${route.params.id}/manage`,
        twitterTitle: () =>`DisStat - ${bot?.username}`,
        twitterDescription:  () => `Manage ${bot?.username} on DisStat.`,
})
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: `https://cdn.discordapp.com/avatars/${route.params.id}/${bot?.avatar}.png`,
    }
  ]
})
</script>

<script>
export default {
    name: 'server',
    data() {
        return {
            botid: "",
            apiKey: undefined
        }
    },
    async mounted() {
        if (!await this.$auth.canSeeBot(this.$route.params.id, true)) return await navigateTo(this.$route.fullPath.substring(0, this.$route.fullPath.lastIndexOf('/')))

        this.botid = this.$route.params.id

        this.$M.FormSelect.init(document.querySelectorAll('select'));
        this.$M.Modal.init(this.$refs.keyModal1, {
            onOpenStart: ()=> this.$refs.keyModal1.classList.remove("hide")
        })
        this.$M.Modal.init(this.$refs.delModal1, {
            onOpenStart: ()=> this.$refs.delModal1.classList.remove("hide")
        })
    },
    methods: {
        async reGenKey() {
            const {data} = await useFetch(() => `/siteApi/bots/genKey`, {
                method: 'post',
                body: JSON.stringify({id: this.botid}),
                headers: {'Content-Type': 'application/json'}
            })
            if (data.value?.key) {
                this.apiKey = data.value.key
            }
        },
        copyKey() {
            navigator.clipboard.writeText(this.apiKey)
        },
        async sync() {
            this.$M.toast({text: 'bot is syncing'})
            const ajaxdata = await $fetch(`/siteApi/bots/sync`, {
                method: 'post',
                body: JSON.stringify({id:this.botid}),
                headers: {'Content-Type': 'application/json'}
            }).catch(console.error);
            if (ajaxdata) this.$M.toast({text: 'bot has synced'})
            else this.$M.toast({text: 'An error has occurred'})
        },
        async confirmedDelete() {
            const {error} = await useFetch(() => `/siteApi/bots/delete`, {
                method: 'delete',
                body: JSON.stringify({id:this.botid}),
                headers: {'Content-Type': 'application/json'}
            })
            if (!error.value) {
                await navigateTo("/users/me")
            }
        }
    }
}
</script>
