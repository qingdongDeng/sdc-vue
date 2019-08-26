import { XDialog } from 'vux'
import { deepClone } from '@/utils/common'
import request from '../utils/request'

export default {
  components: { XDialog },
  data () {
    return {
      hisLoading: false,
      hisList: [],
      ws: null,
      showHis: false,
      curCourse: {},
      nowTeaCode: '',
      nowStuCode: '',
      otherImg: '',
      selfImg: ''
    }
  },
  computed: {
    openid () {
      return this.$store.state.user.openid
    },
    courseId () {
      return this.curCourse.courseId
    }
  },
  watch: {
    courseId () {
      if (this.ws !== null) {
        this.sendReq()
      }
    }
  },
  methods: {
    toggleHis (flag, item) {
      console.log('f', flag)
      this.showHis = flag
      if (flag) {
        this.hisLoading = true
        this.curCourse = deepClone(item)
        this.curCourse.courseId = this.curCourse.courseId || this.curCourse.teaCourse.courseId
        this.getOpenid()
      } else {
        if (this.ws !== null) {
          // this.ws.close()
        }
      }
    },
    getOpenid () {
      if (this.curCourse.courseId === undefined || this.curCourse.courseId === '') {
        return
      }
      request({
        url: 'http://www.zhiheyikaoqin.cn/sdc/course/getOnClassUserOpenid?courseId=' + this.curCourse.courseId,
        method: 'get'
      }).then(res => {
        if (res.data.code === 0) {
          this.nowTeaCode = res.data.data.teaOpenid
          this.nowStuCode = res.data.data.stuOpenid

          request({
            url: 'http://www.zhiheyikaoqin.cn/sdc/user/queryUserInfo?openid=' + this.nowTeaCode,
            method: 'get'
          }).then(res => {
            // 获取自己头像
            const type = (this.nowTeaCode === this.openid) ? 'self' : 'other'
            if (Number(res.data.code) === 0) {
              const obj = res.data.data
              this[type + 'Img'] = obj.stuHeadimgurl || obj.teaHeadimgurl
            }
            // 获取对方头像
            request({
              url: 'http://www.zhiheyikaoqin.cn/sdc/user/queryUserInfo?openid=' + this.nowStuCode,
              method: 'get'
            }).then(res => {
              const type = (this.nowTeaCode !== this.openid) ? 'self' : 'other'
              // 获取之后才建立连接
              this.initWebsocket()
              if (Number(res.data.code) === 0) {
                const obj = res.data.data
                this[type + 'Img'] = obj.stuHeadimgurl || obj.teaHeadimgurl
              }
            })
          })
        }
      })
    },
    initWebsocket () {
      if (this.ws === null && this.curCourse.courseId !== '') {
        const url = 'ws://47.93.225.12:8082/socketServer/' + this.openid
        this.ws = new WebSocket(url)

        this.ws.onopen = this.websocketonopen
        this.ws.onmessage = this.websocketonmessage
        this.ws.onerror = this.websocketonerror
        this.ws.onclose = this.websocketclose
      }
    },
    websocketonopen () {
      this.sendReq()
    },
    sendReq () {
      console.log('re')
      const req = {
        groupname: this.curCourse.courseId,
        opttype: 'GetChatGroupChatRecordList',
        username: this.openid
      }
      this.websocketsend(req)
    },
    websocketonmessage (res) {
      const data = JSON.parse(res.data)
      if (data.opttype === 'GetChatGroupChatRecordList') {
        this.hisLoading = false
        // 获取历史记录
        if (data.errno === 0) {
          this.renderHis(data.list)
        } else {
          this.hisList = []
          // errorMsg(this, data.errmsg)
        }
      }
    },
    websocketonerror () {
      this.initWebSocket()
    },
    websocketsend (req) {
      if (this.ws !== null) {
        this.ws.send(JSON.stringify(req))
      }
    },
    websocketclose (e) {
      console.log('断开连接', e)
    },
    renderHis (list) {
      console.log('l', list)
      this.hisList = list.map(item => {
        const content = JSON.parse(item.content)
        let type = 'other'
        if (item.username === this.openid) {
          type = 'self'
        }
        const tmp = {
          time: (new Date(item.inserttime)).toJSON().replace('T', ' ').split('.')[0],
          type: type,
          img: this[type + 'Img'],
          text: content.content
        }
        return tmp
      })
      this.hisList = this.hisList
    }
  }
}
