<template>
  <div class="register-form stu">
    <group>
      <x-input
        :readonly="type!=='reg'"
        :disabled="type!=='reg'"
        title="姓名"
        v-model="form.stuName"></x-input>
      <x-input
        :readonly="type!=='reg'"
        title="学号"
        v-model="form.stuCode"></x-input>
      <popup-picker
        :readonly="type!=='reg'"
        :disabled="type!=='reg'"
        title="年级"
        :value="[form.stuLevel]"
        :data="levels"
        :columns="1"
        :value-text-align="'left'"
        @on-change="selLevel"></popup-picker>
      <popup-picker
        :readonly="type!=='reg'"
        :disabled="type!=='reg'"
        title="分段"
        :value="[form.stuGrade]"
        :data="grades"
        :columns="1"
        :value-text-align="'left'"
        @on-change="selGrade"></popup-picker>
      <popup-picker
        :readonly="type!=='reg'"
        :disabled="type!=='reg'"
        title="班级"
        :value="[form.stuClass]"
        :data="classes"
        :columns="1"
        :value-text-align="'left'"
        @on-change="selClass"></popup-picker>
    </group>
    <group>
      <div class="password-control vux-cell-box" v-if="type==='reg'">
        <x-input v-if="!pwdVis" title="密码" type="password" v-model="form.stuPasswd"></x-input>
        <x-input v-if="pwdVis" title="密码" type="text" v-model="form.stuPasswd"></x-input>
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
  name: 'stuReg',
  mixins: [formMixin],
  data () {
    return {
      form: {
        stuCode: '', // 是 string  学籍号必填
        stuName: '', // 是 string  学生姓名必填
        stuLevel: '', //  是 string  学生年级必填
        stuGrade: '', //  是 string  中学分段必填
        stuClass: '', //  是 string  班级必填
        stuPasswd: '' // 是 string  密码必填
      },
      grades: ['高中', '初中'],
      levels: ['2016级', '2017级', '2018级', '2019级'],
      classes: ['1班', '2班', '3班', '4班', '5班', '6班', '7班', '8班', '9班', '10班', '11班', '12班', '13班', '14班', '15班', '16班', '17班', '18班', '19班']
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
      this.form.stuCode = this.info.stuCode || ''
      this.form.stuName = this.info.stuName || ''
      this.form.stuLevel = this.info.stuLevel || ''
      this.form.stuGrade = this.info.stuGrade || ''
      this.form.stuClass = this.info.stuClass || ''
    }
  },
  methods: {
    selGrade (item) {
      this.form.stuGrade = item[0]
    },
    selLevel (item) {
      console.log(item)
      this.form.stuLevel = item[0]
    },
    selClass (item) {
      console.log(item)
      this.form.stuClass = item[0]
    },
    reg () {
      this.isValid = false
      this.checkValid('stuCode')
      this.checkValid('stuName')
      this.checkValid('stuLevel')
      this.checkValid('stuGrade')
      this.checkValid('stuClass')
      this.checkValid('stuPasswd')
      if (this.isValid) {
        this.$vux.toast.show({
          text: '信息不能为空',
          type: 'cancel',
          width: '140px'
        })
        return
      }
      request({
        url: 'user/registerStuBaseByOpenid',
        method: 'post',
        data: {
          stuOpenid: this.openid,
          stuCode: this.form.stuCode, // 是 string  学籍号必填
          stuName: this.form.stuName, // 是 string  学生姓名必填
          stuLevel: this.form.stuLevel, //  是 string  学生年级必填
          stuGrade: this.form.stuGrade, //  是 string  中学分段必填
          stuClass: this.form.stuClass, //  是 string  班级必填
          stuPasswd: this.form.stuPasswd // 是 string  密码必填
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
<style lang="scss">
  .register-form {
    .weui-label {
      width: 3em !important;
    }
    .vux-x-input.disabled .weui-input {
      text-fill-color: #373d41;
      -webkit-text-fill-color: #373d41;
    }
  }
</style>
