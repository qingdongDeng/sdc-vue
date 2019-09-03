<template>
  <div class="register-form tea">
    <group>
      <x-input
        :show-clear="type==='reg'"
        :readonly="type!=='reg'"
        :disabled="type!=='reg'"
        title="姓名"
        v-model="form.teaName"></x-input>
      <x-input
        :show-clear="type==='reg'"
        :readonly="type!=='reg'"
        :disabled="type!=='reg'"
        title="工号"
        v-model="form.teaCode"></x-input>
      <x-input
        :show-clear="type==='reg'"
        :readonly="type!=='reg'"
        :disabled="type!=='reg'"
        title="科目"
        v-model="form.teaSubject"></x-input>
    </group>
    <group>
      <div class="password-control vux-cell-box" v-if="type==='reg'">
        <x-input v-if="!pwdVis"
          :show-clear="type==='reg'"
          :readonly="type!=='reg'"
          :disabled="type!=='reg'"
          title="密码"
          type="password"
          v-model="form.teaPasswd"></x-input>
        <x-input v-if="pwdVis"
          :show-clear="type==='reg'"
          :readonly="type!=='reg'"
          :disabled="type!=='reg'"
          title="密码"
          type="text"
          v-model="form.teaPasswd"></x-input>
        <i v-if="!pwdVis" class="iconfont icon-mimakejian" @click="pwdVisible(true)"></i>
        <i v-if="pwdVis" class="iconfont icon-bukejian" @click="pwdVisible(false)"></i>
      </div>
    </group>
    <div class="btn send-btn" v-if="type==='reg'" @click="reg">提交</div>
  </div>
</template>

<script>

import request from '../utils/request'
import { msg } from '../utils/common'
import formMixin from './formMixin.js'

export default {
  name: 'teaReg',
  mixins: [formMixin],
  data () {
    return {
      form: {
        teaCode: '', // 是 string  教师工号
        teaName: '', // 是 string  教师姓名
        teaSubject: '', //  是 string  教师科目
        teaPasswd: ''
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'reg'
    },
    info: Object
  },
  mounted () {
    if (this.type !== 'reg' && this.info !== undefined) {
      this.form.teaCode = this.info.teaCode || ''
      this.form.teaName = this.info.teaName || ''
      this.form.teaSubject = this.info.teaSubject || ''
    }
  },
  methods: {
    reg () {
      this.isValid = false
      this.checkValid('teaCode')
      this.checkValid('teaName')
      this.checkValid('teaSubject')
      this.checkValid('teaPasswd')
      if (this.isValid) {
        this.$vux.toast.show({
          text: '信息不能为空',
          type: 'cancel',
          width: '140px'
        })
        return
      }
      request({
        url: 'user/registerTeaBaseByOpenid',
        method: 'post',
        data: {
          teaOpenid: this.openid,
          teaCode: this.form.teaCode,
          teaName: this.form.teaName,
          teaSubject: this.form.teaSubject,
          teaPasswd: this.form.teaPasswd
        }
      }).then(res => {
        if (res.data.code !== 0) {
          msg(this, res.data.msg, '120px')
        } else {
          msg(this, '提交成功')
          this.$store.commit('SET_INFO_OBJ', res.data.data)
          this.$store.commit('SET_REG_STATUS', true)
          setTimeout(() => {
            this.$store.dispatch('getInfo')
            this.$router.push({ name: 'course' })
          }, 500)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped="">
  .password-control {
    position: relative;
    padding-right: 40px;
    .iconfont {
      position: absolute;
      right: 0;
      top: 0;
      height: 22px;
      padding: 7px 12px;
    }
  }
</style>
