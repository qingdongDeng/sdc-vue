<template>
  <div class="doing-course" v-tap="[gotoDoing]">
    <div class="doing-text">
      我在上的课
      <i class="iconfont icon-iconfontjiantou5"></i>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    hasInfo () {
      return this.$store.state.user.hasInfo
    }
  },
  methods: {
    gotoDoing () {
      if (this.hasInfo) {
        this.$store.commit('SET_RETURN_TEXT', '在线交流')
        this.$store.commit('SET_RETURN_URL', this.$route.path)
        this.$router.push({ name: 'chart' })
      } else {
        this.gotoReg()
      }
    },
    gotoReg () {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
<style lang="scss">
  .doing-text {
    height: 40px;
    line-height: 40px;
    margin: 10px 0;
    background: #fff;
    padding: 0 10px 0 20px;
    * {
      vertical-align: bottom;
      padding-right: 5px;
    }
    .iconfont {
      float: right;
      padding-right: 0;
    }
  }
</style>
