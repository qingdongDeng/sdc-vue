<template>
  <div class="register">
    <stu-reg v-if="type === 'student'"></stu-reg>
    <tea-reg v-if="type === 'teacher'"></tea-reg>
  </div>
</template>

<script>
import stuReg from './stuReg'
import teaReg from './teaReg'
export default {
  name: 'register',
  components: {
    stuReg,
    teaReg
  },
  data () {
    return {
    }
  },
  computed: {
    type () {
      const tmp = this.$store.state.user.userType
      const typeText = tmp === 'teacher' ? ' - 老师' : (tmp === 'student' ? ' - 学生' : '')
      this.$store.commit('SET_RETURN_TEXT', '补充信息' + typeText)
      return tmp
    }
  },
  mounted () {
    this.$store.commit('SET_RETURN_URL', '/my')
  },
  methods: {
  }
}
</script>

<style lang="scss">
.register-form {
  .weui-label {
    width: 70px !important;
  }
}
</style>
