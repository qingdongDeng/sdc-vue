<template>
  <div class="my">
    <user-info></user-info>
    <create-course v-if="userType === 'teacher'"></create-course>
    <book-menu></book-menu>
    <!-- 反馈 -->
    <div class="feedback__header" v-tap="[gotoAll]">
      <div class="feedback__title">已结束的课程</div>
      <div class="feedback__all">
        <span>全部</span>
        <i class="iconfont icon-iconfontjiantou5"></i>
      </div>
    </div>
    <doing></doing>
    
  </div>
</template>
<script>
import { mapState } from 'vuex'
import createCourse from './createCourse'
import userInfo from './info'
import bookMenu from './bookMenu'
import feedback from './feedback'
import doing from './doing'
export default {
  name: 'my',
  components: { createCourse, userInfo, bookMenu, feedback, doing },
  data () {
    return {
      a: 's'
    }
  },
  computed: {
    ...mapState({
      isRegAuth: state => state.user.isRegAuth,
      isReg: state => state.user.isReg,
      hasInfo: state => state.user.hasInfo,
      teaOpenid: state => state.user.infoObj.teaOpenid,
      teaCode: state => state.user.infoObj.teaCode,
      userType: state => state.user.userType
    })
  },
  mounted () {
    if (!this.isReg) {
      this.$router.push({ name: 'selRegType' })
    }
  },
  watch: {
    isReg () {
      if (!this.isReg) {
        this.$router.push({ name: 'selRegType' })
      }
    }
  },
  methods: {
    gotoAll () {
      if (this.hasInfo) {
        this.$store.commit('SET_RETURN_TEXT', '已结束课程')
        this.$store.commit('SET_RETURN_URL', '/my')
        this.$router.push({ path: '/feedback' })
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
  .feedback__header {
    line-height: 20px;
    padding: 10px 10px 10px 20px;
    position: relative;
    background: #fff;
  }
  .feedback__all {
    position: absolute;
    right: 10px;
    top: 10px;
    .iconfont {
      vertical-align: bottom;
      display: inline-block;
    }
  }
</style>
