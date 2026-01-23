<template>
    <UModal v-model:open="isOpen" title="Confirm deletion">
        <UButton label="Delete chart" color="error" icon="i-heroicons-trash"/>

        <template #footer>
            <UButton label="Delete forever (really!)" color="error" icon="i-heroicons-trash" @click="confirmedCustomDelete" />
        </template>
    </UModal>
</template>

<script setup>
const isOpen = ref(false)

const toast = useToast()
const route = useRoute()

const props = defineProps({
    chartid: String,
    chartName: String
})

async function confirmedCustomDelete() {
    const {error} = await useFetch(() => `/api/bots/${route.params.id}/settings/deleteCustomChart/`, {
        method: 'delete',
        body: {
            chartid: props.chartid
        }
    });

    toast.add({title: error.value? 'Error deleting' : 'Deleted'})
}
</script>