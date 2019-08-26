<template>
  <div id="toast" v-if="show">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
        <i v-if="msgType===''" class="weui-icon-success-no-circle weui-icon_toast"></i>
        <i v-else-if="msgType==='error'" class="weui-icon-cancel weui-icon_toast"></i>
        <p class="weui-toast__content">{{msg}}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  // props: ['msg', 'msgType'],
  // data () {
  //   return {
  //     show: false
  //   }
  // },
  computed: {
    ...mapState({
      show: state => state.user.showMsg,
      msg: state => state.user.msg,
      msgType: state => state.user.msgType
    })
  },
  watch: {
    show () {
      this.hide()
    }
  },
  methods: {
    hide () {
      setTimeout(() => {
        this.$store.commit('HIDE_TOAST')
      }, 1000)
    }
  }
}
</script>
<style>
  .weui-icon-cancel {
    margin: 15px auto;
    font-size: 40px;
    color: #fff;
  }
</style>
