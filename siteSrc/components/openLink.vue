<template>
    <UModal v-if="props.url" v-model:open="isOpen" title="Leaving Statcord">
        <UButton :icon="`i-heroicons-${props.icon}`" :label="props.name" />

        <template #body>
            <h6>This link will take you to the following website:</h6>
            <div class="p-4 font-medium">
                <p class="break-all">https://<b>{{ displayURL[0] }}</b>{{ displayURL.join("/").replace(displayURL[0], "") }}</p>
            </div>
        </template>
        <template #footer>
            <UButton label="Visit Site" @click="visit" />
        </template>
    </UModal>
</template>

<script setup>
const isOpen = ref(false)

const props = defineProps({
    icon: String,
    name: String,
    url: String
})

const displayURL = props.url?.replace("https://","").split("/")

async function visit() {
    navigateTo(props.url, {
        external: true,
        open: {
            target: "_blank"
        }
    })
}
</script>