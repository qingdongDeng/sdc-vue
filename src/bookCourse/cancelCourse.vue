<template>
  <div class="cancel-block">
    <div class="cancel__header">
      <span class="cancel__label">课程名称：</span>
      <span> {{courseName}}</span>
    </div>
    <div class="cancel__body">
      <span class="cancel__label">取消原因：</span>
      <textarea v-model="cancelText"></textarea>
    </div>
    <div class="btn send-btn" @click="cancelCourse">确认取消</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { msg, errorMsg } from '../utils/common'
import request from '../utils/request'
export default {
  name: 'cancel',
  data () {
    return {
      cancelText: ''
    }
  },
  computed: {
    ...mapState({
      courseId: state => state.course.courseId,
      subId: state => state.course.subId,
      courseName: state => state.course.courseName,
      userType: state => state.user.userType,
      teaOpenid: state => state.user.infoObj.teaOpenid,
      stuOpenid: state => state.user.infoObj.stuOpenid
    })
  },
  mounted () {
    this.$store.commit('SET_RETURN_TEXT', '课程列表')
  },
  methods: {
    cancelCourse (item) {
      if (this.cancelText === '') {
        errorMsg(this, '原因不能为空', '120px')
        return
      }
      let url = ''
      let req = {}
      if (this.userType === 'teacher') {
        url = 'tea/cancelCourse'
        req = {
          cancelReason: this.cancelText,
          courseId: this.courseId,
          teaOpenid: this.teaOpenid
        }
      } else {
        url = 'stu/cancelOrder'
        req = {
          cause: this.cancelText,
          courserId: this.courseId,
          stuOpenid: this.stuOpenid,
          subId: this.subId
        }
      }
      console.log(url, req)
      request({
        url: url,
        method: 'post',
        data: req
      }).then(res => {
        console.log(res)
        if (Number(res.data.code) === 0) {
          msg(this, '取消成功')
          setTimeout(() => {
            if (this.userType === 'teacher') {
              this.$router.push({ path: '/bookCourse/fail' })
            } else {
              this.$router.push({ path: '/bookCourse/end' })
            }
          }, 500)
        } else {
          errorMsg(this, res.msg, '160px')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped="">
@import '../styles/color.scss';
.cancel__header {
  background: #fff;
  padding: 0 15px;
  height: 30px;
  line-height: 30px;
  margin-bottom: 5px;

}
.cancel__body {
  height: 230px;
  background: #fff;
  padding: 10px 15px 20px 15px;
  .cancel__label {
    display: block;
    margin: 0 0 10px 0;
  }
  textarea {
    border: 1px solid $border;
    width: 100%;
    height: 200px;
  }
}
.cancel__btn {
  margin: 30px;
  height: 30px;
  background: $green;
  color: #fff;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  font-size: 13px;
}
</style>
