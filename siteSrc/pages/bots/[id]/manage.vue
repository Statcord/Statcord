<template>
    <div class="navbar-fixed  red accent-1">
        <div class="nav-wrapper">
            <h4 class="center-align">Not all Settings are supported at this time.</h4>
        </div>
    </div>

    <div class="container">
        <div class="divider"></div>
        <div class="section">
            <h5>Access</h5>
            <div>
                <label>
                    <input type="checkbox" class="filled-in" disabled checked="checked" />
                    <span>Public</span>
                </label>
            </div>
            <div class="input-field inline">
                <input id="email_inline" disabled type="email" class="validate">
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






        <div class="divider"></div>
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
                        <input id="email_inline" disabled type="email" class="validate">
                        <label for="email_inline">Name</label>
                    </div>
                    <div class="input-field inline">
                        <input id="email_inline" disabled type="email" class="validate">
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
                        <input id="email_inline" disabled type="email" class="validate">
                        <label for="email_inline">Name</label>
                    </div>
                    <div class="input-field inline">
                        <input id="email_inline" disabled type="email" class="validate">
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
                        <input id="email_inline" disabled type="email" class="validate">
                        <label for="email_inline">Name</label>
                    </div>
                    <div class="input-field inline">
                        <input id="email_inline" disabled type="email" class="validate">
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
                        <input id="email_inline" disabled type="email" class="validate">
                        <label for="email_inline">Name</label>
                    </div>
                    <div class="input-field inline">
                        <input id="email_inline" disabled type="email" class="validate">
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
            </div>
        </div>

        <div class="divider"></div>
        <div class="section">
            <div class="waves-effect waves-light btn" @click="showAPIkeyModel">API key<i class="material-icons left">keygen</i></div>
            <div class="waves-effect waves-light btn" @click="sync">Sync<i class="material-icons left">autorenew</i></div>
            <div class="waves-effect waves-light btn disabled" @click="sync">Save<i class="material-icons left">save</i></div>
            <div class="waves-effect waves-light btn red accent-3" @click="showDeleteModel">Delete<i class="material-icons left">delete_forever</i></div>
        </div>
    </div>

    <modal v-show="APIkeyModelVisible" header="API key" @close="closeAPIkeyModel">
        <div class="waves-effect waves-light btn" @click="reGenKey">Regenerate API key<i class="material-icons left">autorenew</i></div>
        <div v-if="apiKey">
            <div class="waves-effect waves-light btn" @click="copyKey">copy<i class="material-icons left">content_copy</i></div>
            <input type="text" disabled :value="apiKey">
        </div>
    </modal>

    <modal v-show="deleteModelVisible" header="Are you sure?" @close="closeDeleteModel">
        <div @click="closeDeleteModel" class="waves-effect waves-light btn " type="button">Cancel</div>
        <div class="waves-effect waves-light btn red accent-3" @click="confirmedDelete">Delete Forever<i class="material-icons left">delete_forever</i></div>
    </modal>
</template>

<script>
import modal from '../../../components/modal.vue';

export default {
    name: 'server',
    components: {
        modal
    },
    data() {
        return {
            botid: "",
            APIkeyModelVisible: false,
            deleteModelVisible: false,
            apiKey: undefined
        }
    },
    async mounted() {
        if (!await this.$auth.canSeeBot(this.$route.params.id, true)) return window.location.href = this.$route.fullPath.substring(0, this.$route.fullPath.lastIndexOf('/'));
        
        this.botid = this.$route.params.botid

        this.$M.FormSelect.init(document.querySelectorAll('select'));
    },
    methods: {
        showAPIkeyModel() {
            this.APIkeyModelVisible = true
        },
        showDeleteModel() {
            this.deleteModelVisible = true
        },
        closeAPIkeyModel() {
            this.APIkeyModelVisible = false
        },
        closeDeleteModel() {
            this.deleteModelVisible = false
        },
        async reGenKey() {
            const ajaxdata = await useFetch(() => `/siteApi/bots/genKey`, {
                method: 'post',
                body: JSON.stringify({id: this.botid}),
                headers: {'Content-Type': 'application/json'}
            }).catch(console.error)
            if (ajaxdata.status === 201) {
                const keyJson = await ajaxdata.json()
                this.apiKey = keyJson.key
            }
        },
        copyKey() {
            navigator.clipboard.writeText(this.apiKey)
        },
        async sync() {
            this.$M.toast({html: 'bot is syncing'})
            const ajaxdata = await useFetch(() => `/siteApi/bots/sync`, {
                method: 'post',
                body: JSON.stringify({id:this.botid}),
                headers: {'Content-Type': 'application/json'}
            }).catch(console.error);
            if (ajaxdata.status === 201) {
                this.$M.toast({html: 'bot has synced'})
            }
        },
        async confirmedDelete() {
            const ajaxdata = await useFetch(() => `/siteApi/bots/delete`, {
                method: 'delete',
                body: JSON.stringify({id:this.botid}),
                headers: {'Content-Type': 'application/json'}
            }).catch(console.error);
            if (ajaxdata.status === 201) {
                return window.location.href = `/me`
            }
        }
    }
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
