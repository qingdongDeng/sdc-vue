<template>
  <div class="all-course">
    <div class="banner">
      <div class="banner-img"></div>
      <div class="banner-text">课程预约</div>
    </div>
    <div class="list">
      <div class="list-header">课程列表</div>
      <template v-if="!loading && all.length !== 0">
        <div class="course-item" v-for="(item, index) in all" @click="openDetail(item)">
          <div class="course-detail">
            <div class="course-header">
              <i class="iconfont icon-kecheng"></i>
              <div class="course-name">{{item.teaCourse.courseName}}</div>
            </div>
            <div class="course-body">
              <div class="course-teaName">
                <i class="iconfont icon-course"></i>
                {{item.teaBase.teaName}}
              </div>
              <div class="course-date">
                <i class="iconfont icon-calendar"></i>
                {{item.teaCourse.courseDate.split(' ')[0]}}
              </div>
              <div class="course-time">
                <i class="iconfont icon-shijian1"></i>
                {{item.teaCourse.time}}
              </div>
              <div class="course-time">
                <template v-if="Number(item.teaCourse.courseInteractive) === 0">
                  <i class="iconfont icon-yunzhuji"></i>
                  线上
                </template>
                <template v-else>
                  <i class="iconfont icon-loufang101"></i>
                  {{item.teaCourse.courseLocation}}
                </template>
              </div>
            </div>
            <div class="course-flag" :class="{'end': item.status !== '可预约'}">{{item.status}}</div>
          </div>
        </div>
      </template>
      <template v-if="!loading && all.length === 0">
        <no-data></no-data>
      </template>
    </div>
    <template v-if="loading">
      <loading></loading>
    </template>
    <div class="course-detail-box">
      <course-detail ref="detail" :item="detailItem"></course-detail>
    </div>
  </div>
</template>
<script>
import request from '../utils/request'
import courseDetail from './detail'
import noData from '../components/noData'
import loading from '../components/loading'
export default {
  name: 'course',
  components: { courseDetail, noData, loading },
  data () {
    return {
      loading: false,
      all: [],
      detailItem: {}
    }
  },
  mounted () {
    this.loading = true
    this.getAll()
  },
  methods: {
    deepClone (original) {
      return JSON.parse(JSON.stringify(original))
    },
    getAll () {
      request({
        url: 'http://www.zhiheyikaoqin.cn/sdc/stu/findAllCourse?page=1&size=100',
        method: 'GET'
      }).then(res => {
        this.loading = false
        if (Number(res.data.code) !== 0) {
          this.all = []
        } else {
          const data = res.data.data
          console.log(data)
          this.all = data.map(item => {
            item.teaCourse.time = this.getTime(item.teaCourse.courseStartTime) + ' - ' + this.getTime(item.teaCourse.courseEndTime)
            item.status = this.getStatus(Number(item.teaCourse.courseStatus))
            return item
          })
        }
      // }, 0)
      })
    },
    openDetail (item) {
      this.detailItem = this.deepClone(item)
      this.$nextTick(() => {
        this.$refs.detail.showBox()
      })
    },
    getTime (str) {
      const hour = str.split(' ')[1].split(':')[0]
      const min = str.split(' ')[1].split(':')[1]
      return hour + ':' + min
    },
    getStatus (flag) {
      switch (flag) {
        // case 300:
        //   return '待预约'
        // case 301:
        //   return '已预约'
        case 302:
          return '上课中'
        case 303:
          return '已结束'
        case 304:
          return '已失效'
        default:
          return '可预约'
      }
    }
  }
}
</script>
<style lang="scss">
  @import '../styles/color.scss';
  .banner {
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
    position: relative;
    .banner-img {
      background: url('../assets/img/banner.jpg') no-repeat;
      width: 100%;
      height: 100%;
      background-size: 100% 100%;
    }
    .banner-text {
      position: absolute;
      top: 70px;
      width: 100%;
      font-size: 30px;
      text-align: center;
      color: #5faf3c;
    }
  }
  .list-header {
    padding: 0 10px;
  }
  .list {
    background: #fff;
    padding: 20px 10px;
    margin-bottom: 20px;
    .course-item {
      display: inline-block;
      width: 50%;
    }
    .course-detail {
      border: 1px solid $border;
      margin: 10px;
      position: relative;
      border-radius: 2px;
    }
    .course-header {
      padding: 10px;
      position: relative;
      .iconfont {
        color: #67c338;
        text-align: center;
        font-size: 20px;
        padding: 0 10px 0 0;
        position: absolute;
        top: 5px;
      }
      .course-name {
        font-size: 16px;
        padding-left: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .course-body {
      margin: 0 10px 10px;
      border-top: 1px solid #f1f1f1;
      padding-top: 5px;
    }
    .course-flag {
      border: 1px solid $green;
      color: $green;
      border-radius: 3px;
      padding: 0 5px;
      display: inline-block;
      margin: 0 10px 10px 10px;
      &.end {
        color: $border;
        border-color: $border;
      }
    }
  }
</style>
