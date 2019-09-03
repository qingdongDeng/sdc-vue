<template>
  <div class="doing-course">
    <div class="no-course" v-if="!loading && noCourse">
      <no-data :text="'当前没有正在上的课'"></no-data>
    </div>
    <div v-if="!loading && !noCourse" class="course-info">
      <div class="course-name">
        <label>课程名称：</label>
        <span>{{courseName}}</span>
      </div>
      <div class="course-time">
        <label>课程时间：</label>
        <span>{{courseTime}}</span>
      </div>
      <div class="course-time">
        <label>老师姓名：</label>
        <span>{{teaName}}</span>
      </div>
    </div>
    <div v-if="!loading && !noCourse" class="chart-box">
      <div class="chart-list-scroll">
        <div class="chart-list" v-for="item in chartList" v-if="chartList.length !== 0">
          <div class="msg-self msg-item" v-if="item.role === 'self'">
            <img class="user-icon" :src="selfImg">
            <div class="msg-content">
              <div class="msg-text">{{item.text}}</div>
              <div class="msg-time">{{item.time}}</div>
            </div>
          </div>
          <div class="msg-other msg-item" v-if="item.role === 'other'">
            <img class="user-icon" :src="otherImg">
            <div class="msg-content">
              <div class="msg-text">{{item.text}}</div>
              <div class="msg-time">{{item.time}}</div>
            </div>
          </div>
        </div>
        <div class="chart-list chart-empty" v-if="chartList.length === 0">
          暂无聊天记录
        </div>
      </div>
    </div>
    <div v-if="!loading && !noCourse" class="send-msg">
      <div class="send-box">
        <input type="text" :disabled="isEnd" v-model="sendMsg" @keyup.enter="clickSend" />
        <div class="send-btn" @click.stop="clickSend" :class="{'btn-disabled': isEnd || btnDisabled}">发送</div>
      </div>
    </div>
    <template v-if="loading">
      <loading></loading>
    </template>
  </div>
</template>

<script>
import request from '../utils/request'
import chartSocket from './chartSocket.js'
import { msg, errorMsg } from '../utils/common'
import noData from '../components/noData'
import loading from '../components/loading'

export default {
  name: 'chart',
  components: { noData, loading },
  mixins: [chartSocket],
  data () {
    return {
      loading: true,
      noCourse: false,
      courseName: '',
      teaName: '',
      courseTime: '',
      chartList: [],
      sendMsg: '',
      courseId: '',
      doingList: [],
      count: 0,
      isEnd: false
    }
  },
  computed: {
    btnDisabled () {
      return this.sendMsg === ''
    },
    teaOpenid () {
      return this.$store.state.user.infoObj.teaOpenid || ''
    },
    stuOpenid () {
      return this.$store.state.user.infoObj.stuOpenid || ''
    },
    userType () {
      return this.$store.state.user.userType
    }
  },
  mounted () {
    this.$store.commit('SET_RETURN_TEXT', '在线交流')
    this.$store.commit('SET_RETURN_URL', '/my')
    this.getDoingList()
  },
  watch: {
    userType () {
      this.getDoingList()
    }
  },
  methods: {
    getCourseCount () {
      request({
        url: 'course/getCountDown?courseId=' + this.courseId,
        method: 'get'
      }).then(res => {
        if (res.data.code === 0) {
          if (res.data.data === 'end') {
            this.showEnd()
          } else {
            this.count = Number(res.data.data)
            this.startCount()
          }
        }
      })
    },
    checkEnd () {
      request({
        url: 'course/onCourseEnd?courseId=' + this.courseId,
        method: 'get'
      }).then(res => {
        if (res.data.code === 0) {
          res.data.data = true
          this.isEnd = res.data.data
          if (!res.data.data) {
            this.startCount()
          } else {
            this.showEnd()
          }
        }
      })
    },
    startCount () {
      setTimeout(() => {
        this.checkEnd()
      }, this.count * 1000)
    },
    showEnd () {
      this.isEnd = true
      msg(this, '课程已结束')
    },
    clickSend () {
      if (this.isEnd) {
        return
      }
      this.sendSocketMsg(this.sendMsg)
      this.sendMsgFn('self', this.sendMsg)
    },
    sendMsgFn (type, msg, time) {
      // console.log('dd', type, msg)
      if (msg === '') {
        return
      }
      let msgTime = time || new Date()
      msgTime = msgTime.toTimeString().split(' ')[0]
      this.chartList.push({
        time: msgTime,
        role: type,
        text: msg
      })
      this.$nextTick(() => {
        document.querySelector('.chart-list-scroll').scrollTop = 999999
      })
      if (type === 'self') {
        this.sendMsg = ''
      }
    },
    getTime (str) {
      const hour = str.split(' ')[1].split(':')[0]
      const min = str.split(' ')[1].split(':')[1]
      return hour + ':' + min
    },
    getDoingList () {
      this.loading = true
      let url = ''
      if (this.userType === 'teacher') {
        url = 'tea/findTeaHistoryCourse'
        url += '?teaOpenid=' + this.teaOpenid + '&page=1&pageSize=1000'
      } else if (this.userType === 'student') {
        url = 'stu/lookHistory'
        url += '?stuOpenid=' + this.stuOpenid + '&page=1&pageSize=1000'
      }
      request({
        url: url,
        method: 'get'
      }).then(res => {
        this.loading = false

        if (res.data.code === 0 && res.data.data !== undefined) {
          this.doingList = res.data.data.filter(item => {
            if (this.userType === 'teacher') {
              return item.teaCourse.courseStatus === 302
            } else {
              return item.teaCourse.courseStatus === 302 && item.subStatus === 401
            }
          }).map(item => {
            item.teaCourse.courseTime = item.teaCourse.courseDate.split(' ')[0] + ' ' + this.getTime(item.teaCourse.courseStartTime) + ' - ' + this.getTime(item.teaCourse.courseEndTime)
            return item
          })
          if (this.doingList.length === 0) {
            this.noCourse = true
            errorMsg(this, '请退出等待开课')
          } else {
            this.courseId = this.doingList[0].teaCourse.courseId
            this.courseName = this.doingList[0].teaCourse.courseName
            this.courseTime = this.doingList[0].teaCourse.courseTime
            if (this.userType === 'student') {
              this.teaName = this.doingList[0].teaName
            } else {
              this.teaName = this.doingList[0].teaBase.teaName
            }
            this.noCourse = false
            this.getCourseCount()
          }
        } else {
          this.noCourse = true
          errorMsg(this, '请退出等待开课')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../styles/color.scss';
  .doing-course {
    padding-bottom: 50px;
    margin-bottom: 10px;
  }
  .course-info {
    line-height: 2;
    margin: 10px 0;
    background: #fff;
    padding: 10px 20px;
  }
  .chart-box {
    height: calc(100% - 140px);
    overflow: hidden;
    line-height: 2;
    margin: 10px 0 0 0;
    padding: 10px 0 0 0;
  }
  .chart-list-scroll {
    padding: 0 20px;
    height: 100%;
    overflow: auto;
  }
  .chart-empty {
    color: $fontGray;
    padding: 80px 0;
    text-align: center;
  }
  .msg-item {
    position: relative;
    margin-bottom: 14px;
    .user-icon {
      position: absolute;
      width: 30px;
      height: 30px;
      border: 2px solid $green;
      border-radius: 40px;
    }
    .msg-time {
      line-height: 1.3;
      color: $fontGray;
    }
    .msg-text {
      min-height: 26px;
      display: inline-block;
      background: #fff;
      border: 1px solid $green;
      border-radius: 5px;
      padding: 0 20px;
      max-width: 100%;
      word-break: break-all;
      text-align: left;
    }
    &.msg-self {
      .user-icon {
        right: 0;
      }
      .msg-content {
        padding-right: 50px;
        text-align: right;
      }
    }
    &.msg-other {
      .user-icon {
        left: 0;
      }
      .msg-content {
        padding-left: 50px;
      }
    }
  }
  .send-msg {
    position: fixed;
    bottom: 0;
    width: 100%;
    line-height: 2;
    background: #fbf9fe;
    padding: 0 0 6px 0;
    .send-box {
      border: 1px solid $border;
      border-width: 1px 0;
      background: #fff;
      height: 40px;
      position: relative;
    }
    input {
      height: 40px;
      width: calc(100% - 80px);
      font-size: 16px;
      padding: 0 70px 0 10px;
      outline: 0;
      border: 0;
    }
    .send-btn {
      background: $green;
      position: absolute;
      top: 0;
      right: 10px;
      color: #fff;
      padding: 0px 10px;
      margin: 8px 0;
      border-radius: 5px;
      &.btn-disabled {
        background: $gray;
        color: $fontGray;
      }
    }
  }
</style>
