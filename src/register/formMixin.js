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
      if (!this.isValid) {
        this.isValid = this.isValid || (this.form[type].trim() !== '')
      }
    }
  }
}
