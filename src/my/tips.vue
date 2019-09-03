<template>
  <div class="feed-course">
    <div class="tips-text">

      <div class="fankui_Container">
        <div class="fankui">
          <span class="span_class1" @click="tofeedback">我要反馈&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="span_class2" @click="userManual"> &nbsp;&nbsp;&nbsp;&nbsp;使用手册</span>
        </div>
      </div>

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
      tofeedback () {
        this.$router.push({ path: '/tofeedback' })
      },
      userManual () {
        this.$router.push({ path: '/userManual' })
      },
      // gotoDoing () {
      //   if (this.hasInfo) {
      //     this.$store.commit('SET_RETURN_TEXT', '反馈')
      //     /**this.$store.commit('SET_RETURN_URL', this.$route.path)
      //     this.$router.push({ name: 'chart' })*/
      //   } /**else {
      //     this.gotoReg()
      //   }*/
      // },
      gotoReg () {
        this.$router.push({ name: 'register' })
      }
    }
  }
</script>
<style lang="scss">
  .tips-text {
    height: 140px;
    line-height: 40px;
    /*margin: 10px 0;*/
    align-content: center;
    /*background: #fff;*/
    padding: 0 10px 0 20px;
    * {
      vertical-align: bottom;
      padding-right: 5px;
    }
    .iconfont {
      float: right;
      padding-right: 0;
    }
    .table-style {
      float: right;
      padding-right: 0;
      text-align: center;
    }
    /*.fankui_Container{*/
    /*  text-align: center;*/
    /*  padding-bottom: 2%;*/
    /*  margin-bottom: 2%;*/
    /*}*/
    .fankui{
      text-align: center;
    }
  }
  .feed-course{
    margin-top: 40%;
    position: relative;
  }
</style>
