<template>
  <div style="height: 100%;width: 100%;display:flex;flex-direction: column;">
    <div class="serviceInfo" ref="serviceInfo">
      <div>
        <div class="one-title">
          <span class="one-title__icon"></span>
          <span>课程预约系统使用手册</span>
          <span class="one-title__bacicon iconfont icon-jiantou">手册</span>
        </div>
        <div class="one-item">
          <p class="one__p">为进一步优化教育方式、加强师生交流，特地借助互联网构建教师和学生学习和沟通的在线平台。该平台弥补了传统学校集体式授课、教师和学生低效沟通、时间地点太过局限的缺点。
            根据教师针对课程特点和个人时间、地点的不同，选择既有线下面对面或者线上一对一预约沟通。<strong>注意：使用该系统前请关注“中关村中学学生发展指导中心”微信公众号,以供系统为您发送预约状态消息</strong></p>
        </div>

        <div class="one-item">
          <div class="one-item__header">使用流程</div>
          <div class="one-step">
            <div class="one-step__item" >
              <span>1.教师进入"我的"模块，选择创建课程，预设课程基本信息，其中包涵上课方式线上或线下。创建成功后等待学生预约</span>
            </div>
            <div class="one-step__item">
              <span >2.学生进入“找课程”模块，预约目标课程</span>
            </div>
            <div class="one-step__item">
              <span>3.教师可在"我的"模块中“已预约”选项查看所有选择当前课程的学生，并选择一个学生作为成功预约候选人。教师可根据情况选择另一名预约候选人替换当前预约课程成功的学生。此外，特殊情况下教师和学生可以取消课程预约，并注明取消原因。注: 取消课程会影响信誉得分</span>
            </div>
            <div class="one-step__item">
              <span>4.若上课方式为在线，师生双方等待课程开始后，一并进入聊天课堂进行交流；若上课方式为线下，则在教师事先约定地点交流</span>
            </div>
            <div class="one-step__item">
              <span >5.课程结束后在“我的”模块中"已结束的课程",师生双方可进行相互打分评价，并可以查看在线课堂的聊天记录</span>
            </div>
          </div>
        </div>

        <div class="one-item">
          <div class="one-item__header">声明</div>
          <div class="one-kefu">
            <span>本系统会对用户信息进行加密存储，并且保证不会主动外泄用户私人信息</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  export default {
    data () {
      return {
        serviceScroll: null,
        show: 0
      }
    },
    computed: {
      openid () {
        return this.$store.state.user.openid
      }
    },
    mounted () {
      this.init()
      this.getStatus()
    },
    methods: {
      init () {
        this.$nextTick(() => {
          this.serviceScroll = new BScroll(this.$refs.serviceInfo, {
            click: true
          })
        })
      },
      gotoPage (name) {
        this.$router.push({name: name})
      }
    }
  }
</script>
<style lang="scss" scoped>

  .oto-wrapper {
    background: #647cfb;
    background: linear-gradient(to right, #4a8ef9 0%, #5292f7 15%, #347ff4 70%, #0c5ddc 100%);;
    flex: none;
    z-index: 1;
    height: 56px;
  }
  .returnicon{
    position: relative;
    left: 15px;
    top: 6px;
    z-index: 9;
    padding: 8px 6px;
    color: #fff;
  }
  .serviceInfo {
    height: calc(100% - 60px);
    overflow: hidden;
  }
  .one-title {
    padding-top: 20px;
    text-align: center;
    position: relative;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: bold;
  }
  .one-title__subtitle {
    position: absolute;
    left: 50%;
    font-size: 13px;
    bottom: -24px;
    opacity: 0.3;
    font-weight: 400;
  }
  .one-title__icon {
    /*background: url('../assets/img/woshou.png') no-repeat;*/
    width: 40px;
    height: 40px;
    display: block;
    background-size: contain;
    position: absolute;
    left: 50%;
    margin-left: -140px;
  }
  .one-title__bacicon {
    position: absolute;
    right: 0;
    font-size: 60px;
    opacity: 0.2;
    top: 34px;
    color: #a3d4ff;
  }
  .one-item{
    background: #fff;
    padding: 16px;
    margin: 20px 20px 16px;
    box-shadow: 0 6px 6px rgba(75, 92, 178, 0.1);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }
  .one-step {
    margin-bottom: 20px;
  }
  .one__fee {
    margin-top: 10px;
  }
  .one__p--top {
    padding-left: 50px;
    line-height: 40px;
    position: relative;
    &:before {
      content: "\e66b";
      font-family: "iconfont" !important;
      font-size: 16px;
      font-style: normal;
      opacity: 0.2;
      padding-right: 10px;
      position: absolute;
      left: 24px;
      top: -10px;
    }
  }
  .one__p {
    display: block;
    line-height: 1.5;
  }
  .one-item__header {
    font-size: 15px;
    font-weight: bold;
  }
  .iconfont{
    margin: 0 10px;
  }
  .one-step__item {
    text-align: left;
    padding-top: 10px;
  }
  .one-step__item {
    position: relative;
    span {
      background: #fff;
      padding: 2px 6px;
      border-radius: 6px;
    }

  }
  .one-item__btn {
    width: 100%;
    text-align: center;
    border-radius: 4px;
    margin: 16px 0;
    background: rgba(52, 127, 244, 0.8);
    color: #fff;
    padding: 4px 0;
  }
  .one-item__ok {
    border-radius: 18px;
    background: #7cbb5a;
    color: #fff;
    font-size: 12px;
    width: 18px;
    height: 18px;
    display: inline-block;
    text-align: center;
    line-height: 18px;
  }
  .one-kefu {
    margin: 10px auto;
    text-align: left;
    display: block;
    & > div {
      display: inline-block;
      width: 240px;
      text-align: left;
      margin-bottom: 10px;
    }
  }

</style>
