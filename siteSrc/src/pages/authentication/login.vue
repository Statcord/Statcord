<template></template>

<script>
export default {
  name: 'login',
  props: ["pageOrgin"],
  created() {
    window.location.href = `/api/discordOauth/login?redirect_to=${this.$route.params.pageOrgin ?? " "}`;
  },
  setup() {
  }
}
</script>