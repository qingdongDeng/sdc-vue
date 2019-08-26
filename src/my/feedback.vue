<template>
  <div class="feedback">
    <div class="feedback__body">
      <div class="feedback__item" v-for="item in feedbackList" :key="item.name">
        <div class="feedback__course">{{item.teaCourse.courseName}}</div>
        <div class="view-his" @click="toggleHis(true, item)"><i class="iconfont icon-liaotian"></i> 聊天记录</div>
        <div class="courseinfo">
          <div class="feedback__teacher">{{item.teaName || item.teaBase.teaName || ''}}</div>
          <div class="feedback__date">{{item.teaCourse.courseDate.split(' ')[0]}}</div>
          <div class="feedback__time">{{item.teaCourse.time}}</div>
        </div>
        <div class="feedback__box">
          <div class="feedback_item student">
            <div class="feedback__label">学生反馈：</div>
            <div class="feedback__text open-feed green"
              v-if="userType === 'student' && (item.feedBack === null || item.feedBack.stuFeedback === null)"
              @click="openFeed(item)">点我反馈</div>
            <div class="feedback__text open-feed"
              v-if="userType !== 'student' && (item.feedBack === null || item.feedBack.stuScore === null)">暂无反馈</div>
            <div class="feedback__star" v-if="item.feedBack !== null &&  item.feedBack.stuScore !== null">
              <div class="feedback__text">{{item.feedBack.stuFeedback}}</div>
              <star :length=" 5" :value="item.feedBack.stuScore" :isreadonly="true"></star>
            </div>
          </div>
          <div class="feedback_item teacher">
            <div class="feedback__label">老师反馈：</div>
            <div class="feedback__text open-feed green"
              v-if="userType === 'teacher' && (item.feedBack === null || item.feedBack.teaScore === null)"
              @click="openFeed(item)"
            >点我反馈</div>
            <div class="feedback__text open-feed" v-if="userType !== 'teacher' && (item.feedBack === null || item.feedBack.teaScore === null)">暂无反馈</div>
            <div class="feedback__star" v-if="item.feedBack !== null && item.feedBack.teaScore !== null">
              <div class="feedback__text">{{item.feedBack.teaFeedback}}</div>
              <star :length=" 5" :value="item.feedBack.teaScore" :isreadonly="true"></star>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="course-end" v-if="!loading && feedbackList.length !== 0">我是有底线的</div>
    <div class="" v-if="!loading && feedbackList.length === 0">
      <no-data></no-data>
    </div>
    <template v-if="loading">
      <loading></loading>
    </template>
    <x-dialog v-if="showHis" v-model="showHis" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '100%', 'background-color': '#fff', display: 'block'}" class="his-diag">
      <div class="his-header">
        <div class="his_course"><i class="iconfont icon-liaotian"></i> {{curCourse.teaCourse.courseName}}</div>
      </div>
      <div class="his-content">
        <div class="chart-list" v-for="item in hisList" v-if="hisList.length !== 0">
          <div class="msg-self msg-item" v-if="item.type === 'self'">
            <img class="user-icon" :src="item.img">
            <div class="msg-content">
              <div class="msg-text">{{item.text}}</div>
              <div class="msg-time">{{item.time}}</div>
            </div>
          </div>
          <div class="msg-other msg-item" v-if="item.type === 'other'">
            <img class="user-icon" :src="item.img">
            <div class="msg-content">
              <div class="msg-text">{{item.text}}</div>
              <div class="msg-time">{{item.time}}</div>
            </div>
          </div>
        </div>
        <div class="chart-list chart-empty" v-if="hisList.length === 0">
          暂无聊天记录
        </div>
      </div>
      <div class="his-close" @click="toggleHis(false)">
        <i class="iconfont icon-guanbi1"></i>
      </div>
    </x-dialog>
    <div class="feedback__diag">
      <feed-diag
        :show="feedDiag"
        :item="feedItem"
        :userType="userType"
        @updateFeed="updateFeed"
        @closeFeed="closeFeed"></feed-diag>
    </div>
  </div>
</template>
<script>
// import { errorMsg } from '../utils/common'
import request from '../utils/request'

import chartHisMixin from './chartHisMixin'
import star from '../components/star'
import userInfo from './info'
import feedDiag from './feedDiag'
import noData from '../components/noData'
import loading from '../components/loading'
export default {
  name: 'feedback',
  components: { star, userInfo, feedDiag, noData, loading },
  mixins: [chartHisMixin],
  data () {
    return {
      loading: false,
      feedbackList: [],
      menu: [],
      feedDiag: false,
      feedItem: {}
    }
  },
  computed: {
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
    this.loading = true
    this.getFeedList()
    if (this.userType === 'student') {
      this.menu = this.stuMenu
    } else {
      this.menu = this.teaMenu
    }
  },
  methods: {
    updateScore (score, item) {
      // console.log(score, item)
      item.score = score
    },
    getFeedList () {
      let url = ''
      if (this.userType === 'teacher') {
        url = 'http://www.zhiheyikaoqin.cn/sdc/tea/findTeaHistoryCourse'
        url += '?teaOpenid=' + this.teaOpenid + '&page=1&pageSize=1000'
      } else if (this.userType === 'student') {
        url = 'http://www.zhiheyikaoqin.cn/sdc/stu/lookHistory'
        url += '?stuOpenid=' + this.stuOpenid + '&page=1&pageSize=1000'
      }
      request({
        url: url,
        method: 'get'
      }).then(res => {
        this.loading = false
        if (res.data.code === 0 && res.data.data !== undefined) {
          if (this.userType === 'teacher') {
            this.feedbackList = res.data.data.filter(item => {
              return item.teaCourse.courseStatus === 303
            }).map(item => {
              item.teaCourse.time = this.getTime(item.teaCourse.courseStartTime) + ' - ' + this.getTime(item.teaCourse.courseEndTime)
              return item
            })
          } else {
            this.feedbackList = res.data.data.filter(item => {
              return item.subStatus === 401 && item.teaCourse.courseStatus === 303
            }).map(item => {
              item.teaCourse.time = this.getTime(item.teaCourse.courseStartTime) + ' - ' + this.getTime(item.teaCourse.courseEndTime)
              return item
            })
          }
        }
      })
    },
    getTime (str) {
      const hour = str.split(' ')[1].split(':')[0]
      const min = str.split(' ')[1].split(':')[1]
      return hour + ':' + min
    },
    updateFeed (item, score, feedText) {
      if (this.userType === 'student') {
        if (item.feedBack === undefined || item.feedBack === null) {
          item.feedBack = {
            stuScore: score,
            stuFeedback: feedText,
            teaFeedback: null,
            teaScore: null
          }
        }
        item.feedBack.stuScore = score
        item.feedBack.stuFeedback = feedText
      } else {
        item.feedBack.teaScore = score
        item.feedBack.teaFeedback = feedText
      }
      this.closeFeed()
      console.log('updateFeed', item, score, feedText)
    },
    openFeed (item) {
      this.feedItem = item
      this.feedDiag = true
    },
    closeFeed () {
      this.feedItem = {}
      this.feedDiag = false
    }
  }
}
</script>
<style lang="scss">
  @import '../styles/color.scss';
  .his-diag {
    position: relative;
  }
  .his-close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .his-header {
      padding: 20px 50px;
  }
  .feedback {
    margin-bottom: 10px;
  }
  .feedback__item {
    background: #fff;
    margin-bottom: 5px;
    position: relative;
    overflow: hidden;
  }
  .feedback__course {
    padding: 10px 90px 10px 20px;
    border-bottom: 1px solid #eaeaea;
    word-break: break-word;
  }
  .view-his {
    position: absolute;
    right: 10px;
    top: 14px;
    font-size: 12px;
  }
  .courseinfo {
    height: 120px;
    padding: 20px 0 10px 10px;
    position: absolute;
    left: 0;
    width: 100px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    & > div {
      margin-bottom: 6px;
    }
    .feedback__teacher,
    .feedback__date,
    .feedback__time {
      font-size: 13px;
      height: 13px;
      line-height: 1;
    }
    .feedback__teacher {
      margin-bottom: 18px;
    }
    .feedback__date,
    .feedback__time {
      color: #bbb;
    }
  }
  .feedback__label {
    font-size: 13px;
    color: #bbb;
  }
  .feedback_item {
    padding: 10px 20px 0 5px;
  }
  .feedback__box {
    padding-left: 120px;
    padding-bottom: 10px;
    .text {
      height: 50px;
      padding: 3px 45px 3px 0;
    }
    textarea {
      border: 0;
      outline: 0;
      width: 100%;
      height: 100%;
    }
    .btn {
      position: absolute;
      right: 5px;
      top: 33px;
      height: 100%;
      width: 40px;
      .send-btn {
        float: right;
        margin: 20px 0;
        height: 40px;
        width: 36px;
        background: $gray;
        color: #fff;
        border-radius: 5px;
        line-height: 40px;
        text-align: center;
        font-weight: bold;
        &.active {
          background: $green;
        }
      }
    }
  }
  .his-content {
    padding: 0 30px;
    height: 90%;
    overflow: auto;
    height: calc(100% - 64px);
  }
  .msg-item {
    position: relative;
    margin-bottom: 14px;
    .user-icon {
      position: absolute;
      width: 30px;
      height: 30px;
      border: 2px solid #03b349;
      border-radius: 40px;
    }
    .msg-text {
      min-height: 26px;
      display: inline-block;
      background: #fff;
      border: 1px solid #03b349;
      border-radius: 5px;
      padding: 0 20px;
      max-width: 100%;
      word-break: break-all;
      text-align: left;
    }
    .msg-time {
      line-height: 1.3;
      color: #aaa;
      font-size: 13px;
    }
    &.msg-other {
      .user-icon {
        left: 0;
      }
      .msg-content {
        padding-left: 50px;
        text-align: left;
      }
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
  }
</style>
