updateFeed<template>
  <div class="feed-diag" v-if="show">
    <div class="feed-diag-overlay" @click="closeFeed"></div>
    <div class="feed-diag-block">
      <div class="feed-diag__header">
        <span class="feed-diag__label">课程名称：</span>
        <span> {{item.teaCourse.courseName || ''}}</span>
      </div>
      <div class="feed-diag__body">
        <span class="feed-diag__label">我的反馈：</span>
        <div class="star-block">
          <star :length="5" :value="score" @updateScore="updateScore"></star>
        </div>
        <textarea v-model="feedText"></textarea>
      </div>
      <div class="btn send-btn" @click="sendFeed">提交反馈</div>
    </div>
  </div>
</template>
<script>
  import request from '../utils/request'
  import star from '../components/star'
  import { msg, errorMsg } from '../utils/common'
  export default {
    name: 'feedbackDiag',
    components: { star },
    data () {
      return {
        score: 0,
        feedText: ''
      }
    },
    props: {
      show: Boolean,
      item: Object,
      userType: String
    },
    computed: {
      teaOpenid () {
        return this.$store.state.user.infoObj.teaOpenid || ''
      },
      stuOpenid () {
        return this.$store.state.user.infoObj.stuOpenid || ''
      }
    },
    methods: {
      updateScore (score, item) {
        this.score = score
        console.log('sate', score, item)
      },
      sendFeed () {
        if (this.feedText === '') {
          errorMsg(this, '请填写反馈')
          return
        }
        let url = ''
        let req = {}
        if (this.userType === 'teacher') {
          url = 'http://www.zhiheyikaoqin.cn/sdc/tea/createFeedBack'
          req = {
            subId: this.item.feedBack.subId, // 是 int 预约编号
            teaFeedBack: this.feedText, // 是 string  反馈内容
            score: this.score, // 是 int 教师给学生的打分
            teaOpenid: this.teaOpenid
          }
        } else {
          url = 'http://www.zhiheyikaoqin.cn/sdc/stu/feedback'
          req = {
            courserId: this.item.courseId, // 是 int 课程id
            message: this.feedText, // 是 string  反馈信息
            score: this.score, // 是 int 评分
            subId: this.item.subId // 是 int 预约表id
          }
        }
        console.log(url, req)
        request({
          url: url,
          method: 'post',
          data: req
        }).then(res => {
          if (Number(res.data.code) === 0) {
            msg(this, '反馈成功')
            this.$emit('updateFeed', this.item, this.score, this.feedText)
          } else {
            errorMsg(this, res.data.msg)
          }
        })
      },
      closeFeed () {
        console.log('diagclo')
        this.feedText = ''
        this.score = 0
        this.$emit('closeFeed')
      }
    }
  }
</script>
<style lang="scss" scoped="">
  @import '../styles/color.scss';

  .feed-diag-overlay {
    background: $overlay;
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
  }
  .feed-diag-block {
    position: absolute;
    top: 50%;
    margin-top: -180px;
    background: #fff;
    width: 260px;
    height: 360px;
    margin-left: -150px;
    left: 50%;
    padding: 20px;
    font-size: 16px;
    textarea {
      width: 260px;
      height: 150px;
    }
  }
  .feed-diag__header {
    margin-bottom: 20px;
  }
  .star-block {
    margin: 10px 0;
  }
</style>
