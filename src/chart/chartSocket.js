import { mapState } from 'vuex'
import request from '../utils/request'
import { errorMsg } from '../utils/common'
export default {
  name: 'chartMixin',
  data () {
    return {
      ws: null,
      otherImg: '',
      selfImg: '',
      nowStuCode: '',
      nowTeaCode: '',
      stuIsInGroup: false,
      teaIsInGroup: false
    }
  },
  computed: {
    ...mapState({
      userType: state => state.user.userType,
      openid: state => state.user.openid
      // selfImg: state => state.user.infoObj.teaHeadimgurl || state.user.infoObj.stuHeadimgurl
      // courseId: state => state.course.courseId
    })
  },
  mounted () {
    this.getOpenid()
    // this.initWebsocket()
  },
  watch: {
    courseId () {
      this.getOpenid()
      // this.initWebsocket()
    }
  },
  methods: {
    getOpenid () {
      if (this.courseId === undefined || this.courseId === '') {
        return
      }
      request({
        url: 'course/getOnClassUserOpenid?courseId=' + this.courseId,
        method: 'get',
        data: {
          artId: this.$route.params.id,
          openid: this.$store.state.user.openid
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.nowTeaCode = res.data.data.teaOpenid
          this.nowStuCode = res.data.data.stuOpenid

          request({
            url: 'user/queryUserInfo?openid=' + this.nowTeaCode,
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
              url: 'user/queryUserInfo?openid=' + this.nowStuCode,
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
      if (this.ws === null && this.courseId !== '') {
        const url = 'ws://47.93.225.12:8082/socketServer/' + this.openid
        this.ws = new WebSocket(url)

        this.ws.onopen = this.websocketonopen
        this.ws.onmessage = this.websocketonmessage
        this.ws.onerror = this.websocketonerror
        this.ws.onclose = this.websocketclose
      }
    },
    websocketonopen () {
      this.checkIsIn()
    },
    websocketonmessage (res) {
      const resData = JSON.parse(res.data)
      this.recSocketMsg(resData)
    },
    websocketonerror () {
      this.initWebSocket()
    },
    websocketsend (req) {
      this.ws.send(JSON.stringify(req))
    },
    websocketclose (e) {
      console.log('断开连接', e)
    },
    checkIsIn () {
      const req = {
        groupname: this.courseId,
        opttype: 'GetChatGroupUserList',
        username: this.openid
      }
      this.websocketsend(req)
    },
    // 老师群组，如果老师不在就创建，并把学生加进来，在就获取历史记录
    teaJoinGroup () {
      const req = {
        addusername: this.nowStuCode, // "stuopenid"
        groupname: this.courseId, // "courseid"
        opttype: 'CreateChatGroup',
        username: this.openid // "teaopenid"
      }
      this.websocketsend(req)
      this.loading = false
    },
    // 学生群组，如果不在就提示退出等，在就获取历史记录
    // 获取聊天记录
    getHis () {
      const req = {
        groupname: this.courseId, // "courseid"
        opttype: 'GetChatGroupChatRecordList',
        username: this.openid // "stuopenid"
      }
      this.websocketsend(req)
    },
    // socket发送消息
    sendSocketMsg (msg) {
      const req = {
        content: msg,
        groupname: this.courseId, // "courseid"
        opttype: 'SendToChatGroup',
        username: this.openid
      }
      this.websocketsend(req)
    },
    // socket接收消息
    recSocketMsg (data) {
      if (data.opttype === 'GetChatGroupUserList') {
        // 判断是否在群里
        if (data.errno !== 0) {
          // 该用户不在群里
          if (this.userType === 'teacher') {
            this.teaJoinGroup()
          } else {
            errorMsg(this, '请退出,等待老师开课')
          }
        } else {
          // 在群里，获取历史
          this.loading = false
          this.getHis()
        }
      } else if (data.opttype === 'GetChatGroupChatRecordList') {
        this.loading = false
        // 获取历史记录
        if (data.errno === 0) {
          this.renderHis(data.list)
        } else {
          errorMsg(this, data.errmsg)
        }
        this.$nextTick(() => {
          this.loading = false
        })
      } else if (data.opttype === 'SendToChatGroup') {
        // 渲染聊天消息
        // if (data.errno === 0) {
        this.renderChart(data)
        // } else {
        //   errorMsg(this, data.errmsg)
        // }
      }
    },
    renderHis (list) {
      console.log('list', list)
      list = list.sort((a, b) => {
        return Number(a.inserttime) - Number(b.inserttime)
      })
      list.map(item => {
        const tmp = JSON.parse(item.content)
        tmp.time = new Date(item.inserttime)
        this.renderChart(tmp)
      })
    },
    renderChart (data) {
      const type = (data.username === this.openid) ? 'self' : 'other'
      console.log('re', this[type + 'Img'])
      if (this[type + 'Img'] === '') {
        new Promise((resolve) => {
          this.getInfo(data.username, type, resolve)
        }).then(() => {
          this.sendMsgFn(type, data.content, data.time)
        })
      } else {
        this.sendMsgFn(type, data.content, data.time)
      }
    },
    getInfo (openid, type, resolve) {
      if (type === 'self' && this['selfImg'] === '') {
        this._getImg(openid, 'self', resolve)
      }
      if (type === 'other' && this['otherImg'] === '') {
        this._getImg(openid, 'other', resolve)
      }
    },
    _getImg (openid, type, resolve) {
      request({
        url: 'user/queryUserInfo?openid=' + openid,
        method: 'get'
      }).then(res => {
        resolve()
        if (Number(res.data.code) === 0) {
          const obj = res.data.data
          this[type + 'Img'] = obj.stuHeadimgurl || obj.teaHeadimgurl
        }
      }, 20)
    }
  }
}
