<template>
  <div class="bookmenu">
    <div class="bookmenu__body">
      <div class="bookmenu__item"
        :class="{'active': item.link === pageType}"
        v-for="item in menu"
        :key="item.name"
        v-tap="[goto, item.link]">
        <p class="bookmenu__item__text">{{item.name}}</p>
      </div>
    </div>
    <div class="bookcourse-content">
      <div class="course-item"
        v-for="(item, index) in allCourse"
        :key="index">
        <div class="course__name"><span>{{item.teaCourse.courseName}}</span></div>
        <div class="course__type">{{Number(item.teaCourse.courseInteractive) === 1 ? '线下' : '线上'}}</div>
        <div class="book-courseinfo">
          <div class="course__teacher">
            <i class="iconfont icon-course"></i>
            <template v-if="userType === 'teacher'">{{item.teaBase.teaName}}</template>
            <template v-else>{{item.teaName}}</template>
          </div>
          <div class="course__place">
            <template v-if="Number(item.teaCourse.courseInteractive) === 1">
              <i class="iconfont icon-weizhibiaoji"></i>
              {{item.courseLocation || '暂无'}}
            </template>
            <template v-else>
              <i class="iconfont icon-yunzhuji"></i>
              线上
            </template>
          </div>
          <div class="course__start">
            <i class="iconfont icon-shijian1"></i>
            开始时间:
            {{item.teaCourse.courseStartTime}}
          </div>
          <div class="course__end">
            <i class="iconfont icon-shijian1"></i>
            结束时间:
            {{item.teaCourse.courseEndTime}}
          </div>
        </div>
        <div class="course__operate" v-if="userType === 'teacher' && item.teaCourse.courseStatus !== 304">
          <div class="course__stu" v-if="userType === 'teacher' && ([301, 302, 303].indexOf(item.teaCourse.courseStatus) !== -1)"
            v-tap="[viewStu, item]">
            <span>查看学生</span>
          </div>
          <div class="course__cancel" v-if="userType === 'teacher' && ([300, 301].indexOf(item.teaCourse.courseStatus) !== -1)" v-tap="[cancelCourse, item]"><span>取消课程</span></div>
        </div>
        <div class="course__operate" v-if="userType === 'student' && [400, 401].indexOf(item.subStatus) !== -1">
          <div class="course__cancel" v-tap="[cancelCourse, item]"><span>取消课程</span></div>
        </div>
      </div>
    </div>
    <div class="course-end" v-if="!loading && allCourse.length !== 0">我是有底线的</div>
    <div class="" v-if="!loading && allCourse.length === 0">
      <no-data></no-data>
    </div>
    <template v-if="loading">
      <loading></loading>
    </template>
  </div>
</template>
<script>
import request from '../utils/request'
import noData from '../components/noData'
import loading from '../components/loading'

export default {
  name: 'bookCourse',
  components: { noData, loading },
  data () {
    return {
      loading: false,
      allCourse: [],
      menu: [],
      stuMenu: [{
        name: '全部',
        link: 'all',
        filter: [400, 401, 402, 403, 404]
      }, {
        name: '待审核',
        link: 'booking',
        icon: 'icon-kexuejishu-',
        filter: [400]
      }, {
        name: '已成功',
        link: 'success',
        icon: 'icon-kexuejishu-',
        filter: [401]
      }, {
        name: '已失败',
        link: 'fail',
        icon: 'icon-kexuejishu-',
        filter: [402]
      }, {
        name: '已取消',
        link: 'end',
        icon: 'icon-kexuejishu-',
        filter: [403, 404]
      }],
      teaMenu: [{
        name: '全部',
        link: 'all',
        filter: [300, 301, 302, 303, 304]
        // 300 待预约
        // 301 已被预约
        // 302 课程正在进行
        // 303 课程正常结束
        // 304 课程失效
      }, {
        name: '待预约',
        link: 'booking',
        icon: 'icon-kexuejishu-',
        filter: [300]
      }, {
        name: '已预约',
        link: 'success',
        icon: 'icon-kexuejishu-',
        filter: [301]
      }, {
        name: '已失效',
        link: 'fail',
        icon: 'icon-kexuejishu-',
        filter: [304]
      }, {
        name: '已结束',
        link: 'end',
        icon: 'icon-kexuejishu-',
        filter: [302, 303]
      }]
    }
  },
  computed: {
    userType () {
      return this.$store.state.user.userType
    },
    teaOpenid () {
      return this.$store.state.user.infoObj.teaOpenid || ''
    },
    stuOpenid () {
      return this.$store.state.user.infoObj.stuOpenid || ''
    },
    pageType () {
      return this.$route.fullPath.replace('/bookCourse/', '')
    },
    filterCode () {
      const userType = this.$store.state.user.userType
      const pageType = this.$route.params.type
      let code = []
      if (userType === 'teacher') {
        this.teaMenu.map(item => {
          console.log(item.link, 'dd', pageType, 'xx')
          if (item.link === pageType) {
            code = item.filter
          }
        })
      } else if (userType === 'student') {
        this.stuMenu.map(item => {
          if (item.link === pageType) {
            code = item.filter
          }
        })
      }
      return code
    }
  },
  beforeCreate () {
    this.$store.commit('SET_RETURN_TEXT', '我的课程')
    this.$store.commit('SET_RETURN_URL', '/my')
  },
  mounted () {
    this.loading = true
    this.getInit()
    console.log(this.$route)
  },
  watch: {
    '$route' (to) {
      console.log('d')
      this.getCourse()
    },
    userType () {
      this.getInit()
    }
  },
  methods: {
    getInit () {
      this.getCourse()
      if (this.userType === 'student') {
        this.menu = this.stuMenu
      } else if (this.userType === 'teacher') {
        this.menu = this.teaMenu
      }
    },
    goto (url) {
      this.$router.push({ path: url })
    },
    gotoAll () {
      this.$router.push({ path: '/bookCourse/all' })
    },
    getCourse () {
      if (this.userType === '') {
        return
      }
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
          this.allCourse = res.data.data.filter(item => {
            if (this.userType === 'teacher') {
              return this.filterCode.indexOf(item.teaCourse.courseStatus) !== -1
            } else if (this.userType === 'student') {
              return this.filterCode.indexOf(item.subStatus) !== -1
            }
          })
        }
      })
    },
    cancelCourse (item) {
      this.$store.commit('SET_COURSE_NAME', item.teaCourse.courseName)
      this.$store.commit('SET_COURSE_ID', item.teaCourse.courseId)
      if (this.userType === 'student') {
        this.$store.commit('SET_ORDER_ID', item.subId)
      }

      this.$store.commit('SET_RETURN_TEXT', '返回课程列表')
      this.$store.commit('SET_RETURN_URL', this.$route.path)

      this.$router.push({ name: 'cancelCourse' })
    },
    viewStu (item) {
      this.$store.commit('SET_COURSE_NAME', item.teaCourse.courseName)
      this.$store.commit('SET_COURSE_ID', item.teaCourse.courseId)

      this.$store.commit('SET_RETURN_TEXT', '返回课程列表')
      this.$store.commit('SET_RETURN_URL', this.$route.path)

      this.$router.push({ name: 'viewCourseStu' })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../styles/color.scss';
  .bookmenu {
    margin-bottom: 10px;
  }
  .bookmenu__body {
    background: #fff;
    &, .bookcourse-content {
      margin-bottom: 5px;
    }
  }
  .bookmenu__item {
    display: inline-block;
    width: 20%;
    text-align: center;
    padding: 20px 0 12px 0;
    position: relative;
    &.active:after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 30px;
      height: 2px;
      background: $green;
      left: 50%;
      margin-left: -15px;
    }
    .iconfont {
      display: block;
      margin-bottom: 8px;
    }
  }
  .course-item {
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
    min-height: 80px;
    position: relative;
    &:not(:last-child) {
      border-bottom: 1px solid $border;
    }
  }
  .book-courseinfo {
    position: relative;
    padding: 0 10px 0 130px;
    & > div {
      margin-bottom: 5px;
    }
    & .iconfont {
      color: $fontGray;
    }
  }
  .course__name {
    position: absolute;
    width: 110px;
    padding: 35px 5px;
    height: 30px;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    line-height: 1.5;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
  }
  .course__type {
    position: absolute;
    top: 10px;
    right: 10px;
    background: $green;
    color: #fff;
    padding: 2px 8px;
    border-radius: 10px;
  }
  .course__operate {
    border-top: 1px solid $border;
    margin-top: 10px;
    padding-top: 10px;
    text-align: right;
  }
  .course__cancel,
  .course__stu {
    margin-left: 10px;
    display: inline-block;
    span {
      border: 1px solid $green;
      color: $green;
      padding: 0 5px;
      border-radius: 3px;
    }
  }
</style>
