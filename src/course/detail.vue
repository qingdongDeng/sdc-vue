<template>
  <div class="details" v-if="show">
    <div class="details-body">
      <div class="course-name">{{item.teaCourse.courseName}}</div>
      <div class="course-label">课程信息</div>
      <div class="infos">
        <div class="course-teaName">授课老师：{{item.teaBase.teaName}}</div>
        <div class="course-teaName">老师科目：{{item.teaBase.teaSubject}}</div>
        <div class="course-date">上课日期：{{item.teaCourse.courseDate.split(' ')[0]}}</div>
        <div class="course-time">上课时间：{{item.teaCourse.time}}</div>
        <div class="course-type">上课方式：{{item.teaCourse.courseInteractive === 0 ? '线上' : '线下'}}</div>
        <div class="course-type" v-if="item.teaCourse.courseInteractive === 1">上课地点：{{item.teaCourse.courseLocation || '暂无'}}</div>
      </div>

      <div class="book-now" v-if="needBook && item.status === '可预约'">
        <div class="book-btn" @click="book(item)">马上预约</div>
        <div class="book-tips" v-if="item.teaCourse.courseStatus === 301">已有学生预约</div>

      </div>

      <!-- <div class="course-label" v-if="item.status !== '可预约' && item.feedBack !== null">课程反馈</div>
      <div class="infos" v-if="item.status !== '可预约' && item.feedBack !== null">
        <div class="course-feedback">
          <div class="feedback-item stu-feed">学生：{{item.feedBack.stuFeedback}}</div>
          <div class="feedback-item tea-feed">老师：{{item.feedBack.teaFeedback}}</div>
        </div>
      </div> -->
    </div>
    <div class="overlay" @click="hideBox"></div>
  </div>
</template>
<script>
  import request from '../utils/request'
  import { msg, errorMsg } from '../utils/common'
  import { mapState } from 'vuex'
  export default {
    name: 'detail',
    data () {
      return {
        show: false
      }
    },
    computed: {
      ...mapState({
        isRegAuth: state => state.user.isRegAuth,
        isReg: state => state.user.isReg,
        openid: state => state.user.openid,
        userType: state => state.user.userType
      }),
      needBook () {
        if (this.isRegAuth && this.isReg) {
          if (this.userType === 'student') {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      }
    },
    props: {
      item: Object
    },
    methods: {
      showBox () {
        this.show = true
      },
      hideBox () {
        this.show = false
      },
      book (item) {
        if (!this.isRegAuth) {
          // 没授权过
          this.$router.push({ name: 'selRegType' })
        } else if (!this.isReg) {
          // 没注册过
          this.$router.push({ name: 'register' })
        } else {
          // 信息都全，往下
          this._book(item)
        }
      },
      _book (item) {
        request({
          url: 'http://www.zhiheyikaoqin.cn/sdc/stu/order?stuOpenid=' + this.openid + '&courserId=' + item.teaCourse.courseId,
          method: 'get'
        }).then(res => {
          if (res.data.code !== 0) {
            errorMsg(this, res.data.msg)
          } else {
            msg(this, '请等待预约结果', '220px')
          }
          this.hideBox()
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '../styles/color.scss';

  .details {
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    .details-body {
      position: fixed;
      top: 80px;
      background: hsla(0, 0%, 100%, 0.9);
      width: 80%;
      margin: 0 10%;
      height: 400px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      .infos {
        padding: 0 20px;
        margin-bottom: 20px;
        & > div:not(.course-name) {
          font-size: 15px;
          margin-bottom: 5px;
        }
      }
    }
    .course-label {
      background: $green;
      color: #fff;
      display: inline-block;
      padding: 3px 20px 3px 10px;
      margin-bottom: 10px;
      border-radius: 0 20px 20px 0;
    }
    .course-feedback {
    }
    .course-name {
      font-size: 16px;
      border-bottom: 1px solid $border;
      margin-bottom: 20px;
      padding: 20px 20px 10px 20px;
      font-weight: bold;
    }
    .overlay {
      background: rgba(0, 0, 0, 0.4);
      width: 100%;
      height: 100%;
    }
    .book-now {
      padding: 20px;
    }
    .book-btn {
      background: $green;
      color: #fff;
      width: 200px;
      border-radius: 3px;
      padding: 6px 10px;
      text-align: center;
      font-size: 15px;
      margin: 0 auto;
    }
  }
  .book-tips {
    text-align: center;
    margin-top: 10px;
  }
</style>