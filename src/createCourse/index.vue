<template>
  <div class="create-course-form">
    <group>
      <x-input :title="'课程名称'"
        v-model="formObj.courseName"
      ></x-input>
      <popup-picker
        title="课程类型"
        :value="[formObj.courseType]"
        :data="types"
        :columns="1"
        :value-text-align="'right'"
        @on-change="selType"></popup-picker>
      <datetime :title="'课程日期'"
        v-model="formObj.course_date"
        :min-year="2019"
      ></datetime>
      <datetime :title="'开始时间'"
        v-model="formObj.courseStartTime"
        :min-year="2019"
        :format="'HH:mm'"
      ></datetime>
      <datetime :title="'结束时间'"
        v-model="formObj.courseEndTime"
        :min-year="2019"
        :format="'HH:mm'"
      ></datetime>
      <x-switch :title="'是否在线'"
        v-model="formObj.courseInteractive"
        :switch-height="'10px'"
      ></x-switch>
      <x-input :title="'互动地点'"
        v-if="!formObj.courseInteractive"
        v-model="formObj.courseLocation"
      ></x-input>
    </group>
    <div class="create__footer">
      <x-button @click.native="createCourse" type="primary"
        @button-global-font-size="'12px'">创建课程</x-button>
    </div>
  </div>
</template>
<script>
import { Group, XInput, Datetime, XSwitch, XButton, PopupPicker } from 'vux'
import request from '../utils/request'
import { msg, errorMsg } from '../utils/common'
import { mapState } from 'vuex'
export default {
  name: 'create',
  components: {
    Group,
    XInput,
    Datetime,
    XSwitch,
    XButton,
    PopupPicker
  },
  data () {
    return {
      formObj: {
        courseName: '', // 课程名称
        courseType: '', // 课程类型
        course_date: '', // 课程日期
        courseStartTime: '', // 课程开始时间
        courseEndTime: '', // 课程结束时间
        courseInteractive: false, // 是否在线互动：0为线上互动，1为线下互动
        courseLocation: ''// 取决于是否在线 string  如果教师选择线下互动（courseInteractive=1），那么需要填上线下互动地点，否则可以不填该项
      },
      types: ['心理相关', '专业相关', '志愿相关', '其他']
    }
  },
  beforeCreate () {
    this.$store.commit('SET_RETURN_TEXT', '新建课程')
    this.$store.commit('SET_RETURN_URL', '/my')
  },
  computed: {
    ...mapState({
      teaOpenid: state => state.user.infoObj.teaOpenid,
      teaCode: state => state.user.infoObj.teaCode
    })
  },
  methods: {
    selType (item) {
      this.formObj.courseType = item[0]
    },
    createCourse () {
      const tmpDate = this.formObj.course_date // + ' 00:00:00'
      const tmpStart = this.formObj.course_date + ' ' + this.formObj.courseStartTime + ':00'
      const tmpEnd = this.formObj.course_date + ' ' + this.formObj.courseEndTime + ':00'
      const tmpInt = this.formObj.courseInteractive ? 0 : 1
      request({
        url: 'http://www.zhiheyikaoqin.cn/sdc/tea/createCourse',
        method: 'post',
        data: {
          teaCode: this.teaCode, // 是 string  教师编号
          teaOpenid: this.teaOpenid, // 是 string  教师微信编号
          courseType: this.formObj.courseType, // 课程类型
          courseName: this.formObj.courseName, //  是 string  课程名称
          courseDate: tmpDate, // 是 date  课程日期
          courseStartTime: tmpStart, // 是 date  课程开始时间
          courseEndTime: tmpEnd, // 是 date  课程结束时间
          courseInteractive: tmpInt, // 是 int 是否在线互动：0为线上互动，1为线下互动
          courseLocation: this.formObj.courseLocation // 取决于是否在线 string 如果教师选择线下互动（courseInteractive=1），那么需要填上线下互动地点，否则可以不填该项
        }
      }).then(res => {
        if (res.data.code !== 0) {
          errorMsg(this, res.data.msg, '120px')
        } else {
          msg(this, '新建成功')
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        }
      })
    },
    selDate () {
      console.log('selDate')
      // ;
    }
  }
}
</script>
<style lang="scss">
@import '../styles/color.scss';
.create__body {
  background: #fff;
}
.form-item {
  position: relative;
  padding: 10px 15px 10px 0;
  margin-left: 15px;
  border-bottom: 1px solid $border;
}
.form-item__label {
  position: absolute;
  top: 16px;
}
.form-item__input {
  display: inline-block;
  width: 100%;
  input {
    width: calc(100% - 80px);
    height: 25px;
    border: 0;
    padding-left: 80px;
  }
}
.create__btn {
  margin: 30px;
  height: 30px;
  background: $green;
  color: #fff;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  font-size: 13px;
}
.create__footer {
  padding: 30px 40px;
}
.create-course-form {
  .weui-label,
  .vux-datetime p {
    width: 7em !important;
  }
  .vux-popup-picker-select-box .vux-popup-picker-select,
  .weui-cell__ft {
    text-align: left !important;
  }
  .weui-cell_switch .weui-cell__ft {
    width: 24px;
    position: absolute;
    left: 98px;
  }
  .vux-datetime,
  .weui-cell_access {
    padding-right: 24px;
  }
  .vux-x-switch {
    position: relative;
  }
}
</style>
