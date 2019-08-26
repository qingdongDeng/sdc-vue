<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  watch: {
    '$route' (to, from) {
      let openid = ''
      if (from.name === null) {
        if (this.$route.query.id === undefined && localStorage.openid !== undefined) {
          openid = localStorage.openid
        } else if (this.$route.query.id !== undefined) {
          openid = this.$route.query.id
          localStorage.setItem('openid', this.$route.query.id)
        }
        this.$store.commit('SET_OPENID', openid)
        this.$store.dispatch('getInfo')
      }
      console.log('this.', from, to)
    }
  }
}
</script>

<style lang="scss">
@import './styles/index.scss'; // 全局自定义样式

body {
  background-color: #fbf9fe;
}

html, body,
#app,
.app-main {
  height: 100%;
  margin: 0;
}
</style>
