<template>
  <div class="viewstu-block">
    <div class="viewstu__header">
      <span class="viewstu__label">课程名称：</span>
      <span> {{courseName}}</span>
    </div>
    <div class="viewstu__body">
      <span class="viewstu__label">学生列表：</span>
      <panel v-if="!loading && stuList.length !==0" :list="stuList" :type="'5'" @on-click-item="selStu">
        <template slot="flag" slot-scope="item" >
          <div class="sel-stu" v-if="item.item.selTrue">已选中</div>
          <div class="sel-stu sel-fail" v-if="item.item.selFail">预约失败</div>
        </template>
      </panel>
      <no-data v-if="!loading && stuList.length ===0" :text="'暂无学生'"></no-data>
    </div>
    <template v-if="loading">
      <loading></loading>
    </template>
  </div>
</template>
<script>
import request from '../utils/request'
import { msg, errorMsg } from '../utils/common'

import { mapState } from 'vuex'
import { Panel } from 'vux'
import noData from '../components/noData'
import loading from '../components/loading'

export default {
  name: 'viewstu',
  components: {
    Panel,
    noData,
    loading
  },
  data () {
    return {
      loading: false,
      stuList: [],
      hasSel: false,
      selStuId: '',
      panelList: [{
        title: '钉钉',
        desc: '是打发斯蒂芬',
        src: 'https://static.byr.cn',
        fallbackSrc: 'https://static.byr.cn/img/logo_footer.gif'
        // meta:{source,date,other}
      }]
    }
  },
  computed: {
    ...mapState({
      courseId: state => state.course.courseId,
      courseName: state => state.course.courseName,
      teaOpenid: state => state.user.infoObj.teaOpenid
    })
  },
  mounted () {
    this.loading = false
    this._getStu()
  },
  methods: {
    _getStu () {
      this.hasSel = false
      this.selStuId = ''
      request({
        url: 'http://www.zhiheyikaoqin.cn/sdc/tea/findCandidatesByCourseId?courseId=' + this.courseId + '&teaOpenid=' + this.teaOpenid,
        method: 'get'
      }).then(res => {
        this.loading = false
        if (res.data.code !== 0) {
          this.stuList = []
          return
        }
        this.stuList = res.data.data.filter(item => {
          return item.stuBase !== null
        }).map(item => {
          if (item.subStatus === 401) {
            this.selStuId = item.stuBase.stuOpenid
          }
          this.hasSel = this.hasSel || (item.subStatus === 401)
          return {
            selTrue: item.subStatus === 401,
            selFail: item.subStatus === 402,
            stuOpenid: item.stuBase.stuOpenid,
            stuCode: item.stuBase.stuCode,
            title: item.stuBase.stuName,
            desc: item.stuBase.stuLevel + ' ' + item.stuBase.stuGrade + ' ' + item.stuBase.stuClass,
            src: 'df',
            fallbackSrc: item.stuBase.stuHeadimgurl || 'http://img4.imgtn.bdimg.com/it/u=5933999,1764766349&fm=27&gp=0.jpg',
            meta: {
              source: '信用得分',
              // date: 'dfadsf',
              other: item.stuBase.creditScore !== null ? item.stuBase.creditScore + '分' : '暂无'
            }
          }
        })
      })
    },
    selStu (item) {
      const _this = this
      console.log(item)
      if (this.selStuId === item.stuOpenid) {
        return
      }
      if (item.selFail) {
        errorMsg(this, '不能选择预约失败的学生')
        return
      }
      if (this.selStuId === '') {
        this._selAPI(item)
        return
      }
      this.$vux.confirm.show({
        content: '是否确定重选学生',
        // 组件除show外的属性
        onCancel () {
        },
        onConfirm () {
          _this._selAPI(item)
        }
      })
    },
    _selAPI (item) {
      request({
        url: 'http://www.zhiheyikaoqin.cn/sdc/tea/saveSelectedStu',
        method: 'post',
        data: {
          courseId: this.courseId,
          stuOpenid: item.stuOpenid
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.stuList.map(item => {
            item.selected = false
          })
          this.selStuId = item.stuOpenid
          this.$set(item, 'selected', true)
          msg(this, '选中成功')
          this._getStu()
        } else {
          errorMsg(this, res.data.msg)
        }
      }, 20)
    }
  }
}
</script>
<style lang="scss" scoped="">
@import '../styles/color.scss';
.viewstu__header {
  background: #fff;
  padding: 0 15px;
  height: 30px;
  line-height: 30px;
  margin-bottom: 5px;

}
.viewstu__body {
  padding: 10px 15px;
  .viewstu__label {
    display: block;
    margin: 0 0 10px 0;
  }
  textarea {
    border: 1px solid $border;
    width: 100%;
    height: 200px;
  }
}
.viewstu__btn {
  margin: 30px;
  height: 30px;
  background: $green;
  color: #fff;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  font-size: 13px;
}
.sel-stu {
  position: absolute;
  right: 10px;
  background: $green;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 13px;
  &.sel-fail {
    background: $fontGray;
  }
}
</style>
