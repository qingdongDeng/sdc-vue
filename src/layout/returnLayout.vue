<template>
  <div class="app-main">
    <div class="return-block">
      <i class="iconfont icon-jiantou2" v-tap="[returnBack]"></i>
      <span style="font-size:15px;margin-left: -4px;padding-left: 4px;" v-tap="[returnBack]">{{returnText}}</span>
    </div>
    <router-view class="return-body"></router-view>
  </div>
</template>

<script>
export default {
  computed: {
    returnText () {
      return this.$store.state.user.returnText
    },
    toUrl () {
      return this.$store.state.user.returnUrl
    }
  },
  methods: {
    returnBack () {
      if (this.toUrl !== '') {
        this.$router.push({ path: this.toUrl })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  html, body,
  #app,
  .app-main {
    height: 100%;
    margin: 0;
  }
  .return-block {
    background: #fff;
    margin-bottom: 10px;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    position: absolute;
    z-index: 500;
    top: 0;
    width: 100%;
    * {
      vertical-align: middle;
    }
  }
  .return-body {
    box-sizing: border-box;
    height: 100%;
    padding-top: 60px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
