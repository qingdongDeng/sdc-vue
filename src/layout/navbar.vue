<template>
  <div class="navbar weui-tabbar">
    <div v-for="item in menu" v-tap="[changeMenu, item.link]" :key="item.value" :class="[{'active': item.value === curMenu}, 'weui-tabbar__item']">
      <i :class="['iconfont', item.icon, 'weui-tabbar__icon']"></i>
      <p class="weui-tabbar__label">{{item.name}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: [{
        link: 'course',
        value: 'course',
        name: '找课程',
        icon: 'icon-fs-course'
      }, {
        link: 'tech',
        value: 'tech',
        name: '看新闻',
        icon: 'icon-xinwen'
      }, {
        link: 'my',
        value: 'my',
        name: '我的',
        icon: 'icon-wode'
      }]
    }
  },
  computed: {
    // 当前tab
    curMenu () {
      return this.$route.name
    },
    infoObj () {
      return this.$store.state.user.infoObj
    }
  },
  methods: {
    changeMenu (link) {
      console.log('link', link)
      if (link === 'my') {
        if (this.infoObj === null || (this.infoObj.teaOpenid === undefined && this.infoObj.stuOpenid === undefined) || this.$store.state.user.openid === '') {
          // 从来没有创建过信息
          this.$router.push({ path: './selRegType' })
          return
        }
      }
      this.$router.push({ path: './' + link })
    }
  }
}
</script>
<style lang="scss">
@import '../styles/color.scss';

.weui-tabbar {
  background-color: #fff;
}
.active {
  .weui-tabbar__icon {
    color: $green;
  }
}
.weui-tabbar__item {
  padding-top: 0;
}
.weui-tabbar__label {
  line-height: 2.2;
}
</style>
