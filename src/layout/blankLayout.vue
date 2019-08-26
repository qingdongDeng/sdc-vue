<template>
  <div class="app-main">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted () {
    this.$store.commit('SET_RETURN_TEXT', '')
    this.$store.commit('SET_RETURN_URL', '')
  }
}
</script>

<style type="text/css">
  html, body,
  #app,
  .app-main {
    height: 100%;
    margin: 0;
  }
</style>
