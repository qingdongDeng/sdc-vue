<template>
  <div class="bookmenu">
    <div class="bookmenu__header" v-tap="[gotoAll]">
      <div class="bookmenu__title">{{showText}}</div>
      <div class="bookmenu__all">
        <span>全部</span>
        <i class="iconfont icon-iconfontjiantou5"></i>
      </div>
    </div>
    <div class="bookmenu__body">
      <div class="bookmenu__item"
        v-for="item in menu"
        :key="item.name"
        v-tap="[goto, item.link]">
        <i :class="['iconfont', item.icon]"></i>
        <p class="bookmenu__item__text">{{item.name}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import userInfo from './info'
// import { deepClone } from '../utils/common'
export default {
  name: 'bookMenu',
  components: { userInfo },
  data () {
    return {
      stuMenu: [{
        name: '待审核',
        link: '/bookCourse/booking',
        icon: 'icon-dengdai2'
      }, {
        name: '预约成功',
        link: '/bookCourse/success',
        icon: 'icon-chenggong'
      }, {
        name: '预约失败',
        link: '/bookCourse/fail',
        icon: 'icon-shibai'
      }, {
        name: '预约取消',
        link: '/bookCourse/end',
        icon: 'icon-quxiao2'
      }],
      teaMenu: [{
        name: '待预约',
        link: '/bookCourse/booking',
        icon: 'icon-dengdai2'
      }, {
        name: '已预约',
        link: '/bookCourse/success',
        icon: 'icon-chenggong'
      }, {
        name: '已失效',
        link: '/bookCourse/fail',
        icon: 'icon-shibai'
      }, {
        name: '已结束',
        link: '/bookCourse/end',
        icon: 'icon-quxiao'
      }],
      menu: []
    }
  },
  computed: {
    hasInfo () {
      return this.$store.state.user.hasInfo
    },
    showText () {
      if (this.$store.state.user.userType === 'student') {
        return '我的预约'
      } else {
        return '我的课程'
      }
    },
    userType () {
      return this.$store.state.user.userType
    }
  },
  mounted () {
    this.initIcon()
  },
  watch: {
    userType () {
      this.initIcon()
    }
  },
  methods: {
    initIcon () {
      if (this.$store.state.user.userType === 'student') {
        this.menu = this.stuMenu
      } else {
        this.menu = this.teaMenu
      }
    },
    goto (url) {
      if (this.hasInfo) {
        this.$router.push({ path: url })
      } else {
        this.gotoReg()
      }
    },
    gotoAll () {
      if (this.hasInfo) {
        this.$router.push({ path: '/bookCourse/all' })
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
<style lang="scss" scoped>
  @import '../styles/color.scss';
  .bookmenu {
    background: #fff;
    margin-bottom: 10px;
  }
  .bookmenu__header {
    line-height: 20px;
    padding: 10px 10px 8px 20px;
    border-bottom: 1px solid $border;
    position: relative;
  }
  .bookmenu__all {
    position: absolute;
    right: 10px;
    top: 12px;
    .iconfont {
      vertical-align: bottom;
      display: inline-block;
    }
  }
  .bookmenu__item {
    display: inline-block;
    width: 25%;
    text-align: center;
    padding: 20px 0 12px 0;
    .iconfont {
      display: block;
      margin-bottom: 8px;
      font-size: 24px;
      color: $green;
    }
  }
</style>
