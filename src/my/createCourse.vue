<template>
  <div class="create-course" v-tap="[gotoCreate]">
    <div class="create-text">
      <i class="iconfont icon-jiahao1"></i>
      创建课程
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
    gotoCreate () {
      if (this.hasInfo) {
        this.$store.commit('SET_RETURN_TEXT', '新建课程')
        this.$store.commit('SET_RETURN_URL', this.$route.path)
        this.$router.push({ path: '/createCourse' })
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
  .create-text {
    height: 40px;
    line-height: 40px;
    margin: 0 0 10px 0;
    background: #fff;
    padding: 0 20px;
    * {
      vertical-align: bottom;
      padding-right: 5px;
    }
  }
</style>
