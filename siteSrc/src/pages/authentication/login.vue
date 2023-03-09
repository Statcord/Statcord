<template></template>

<script>
export default {
  name: 'login',
  created() {
    window.location.href = '/api/discordOauth/login';
  }
}
</script>