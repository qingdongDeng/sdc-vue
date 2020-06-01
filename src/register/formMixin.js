import { Group, XInput, PopupPicker } from 'vux'
export default {
  components: {
    Group,
    XInput,
    PopupPicker
  },
  data () {
    return {
      pwdVis: true,
      isValid: false
    }
  },
  computed: {
    openid () {
      return this.$store.state.user.openid
    }
  },
  methods: {
    pwdVisible (flag) {
      this.pwdVis = flag
    },
    checkValid (type) {
      // console.log(type, '为空：', this.form[type].trim() === '')
      // console.log('验证：', this.isValid)
      if (this.isValid) {
        this.isValid = this.isValid && (this.form[type].trim() !== '')
      }
    }
  }
}
