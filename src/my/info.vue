<template>
  <div class="my-info">
    <div class="user-back" :style="{'background-image': backUrl}"></div>
    <img v-tap="[gotoInfo]" class="user-logo" :src="img" />
  </div>
</template>
<script>
export default {
  name: 'user-info',
  data () {
    return {}
  },
  computed: {
    backUrl () {
      return 'url(' + this.img + ')'
    },
    img () {
      return this.$store.state.user.infoObj.stuHeadimgurl || this.$store.state.user.infoObj.teaHeadimgurl
    },
    hasInfo () {
      return this.$store.state.user.hasInfo
    }
  },
  methods: {
    gotoInfo () {
      if (this.hasInfo) {
        this.$router.push({ name: 'userInfo' })
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
.my-info {
  position: relative;
}
.user-back {
  height: 200px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  opacity: 0.4;
  &:after {
    content: "";
    width: 100%;
    height: 200px;
    position: absolute;
    left:0;
    top:0;
    background: inherit;
    filter: blur(20px);
    z-index: 2;
  }
}
.user-logo {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  border-radius: 50px;
  border: 1px solid #fff;
}
</style>
