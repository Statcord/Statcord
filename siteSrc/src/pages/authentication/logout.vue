<template></template>

<script>
export default {
  name: 'logout',
  created() {
    fetch("/api/discordOauth/logout").then(() => {
      window.location.pathname = "/"
    })
  },
  setup() {
  }
}
</script>
