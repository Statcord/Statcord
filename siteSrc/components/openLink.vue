<template>
    <div v-if="url">
        <UButton :icon="`i-heroicons-${icon}`" :label="name" @click="isOpen = true" />

        <UModal v-model="isOpen">
            <div class="p-4 bg-gray-800 text-gray-300 font-medium">
                <div class="">
                    <h4>Leaving Statcord</h4>
                    <h6>This link will take you to the following website</h6>
                        
                    <div>
                        <p class="break-all">https://<b>{{ displayURL[0] }}</b>{{ displayURL.join("/").replace(displayURL[0], "") }}</p>
                    </div>
                </div>

                <div>
                    <div class="grid grid-cols-6 gap-4">
                        <div class="col-start-1 col-end-3">
                            <UButton label="Go back" @click="isOpen = false" />
                        </div>
                        <div class="col-end-7 col-span-2">
                            <UButton label="Visit Site" @click="visit" />
                        </div>
                    </div>
                </div>
            </div>
        </UModal>
    </div>
</template>

<script setup>
const isOpen = ref(false)


</script>

<script>
export default {
    name: 'openlink',
    data() {
        const {icon, url, name} = this.$props
        const displayURL = url?.replace("https://","").split("/")
        return {
            displayURL,
            // uuid: `${url}:${name}:${icon}`
        }
    },
    props: {
        icon: String,
        name: String,
        url: String
    },
    methods: {
        async visit() {
            navigateTo(this.url, {
                external: true,
                open: {
                    target: "_blank",
                },
            });
            // this.isOpen = false;
        }
    }
}
</script>