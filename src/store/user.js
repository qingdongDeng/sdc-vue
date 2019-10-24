import request from '../utils/request'
// import $ from 'jquery'

const user = {
  state: {
    userType: '',
    showMsg: false,
    msgType: '',
    msg: '',
    returnText: '',
    returnUrl: '',
    baseUrl: 'http://www.zxsdc.top/show/sdc/sdc/',
    // baseUrl: 'http://localhost:8086/sdc/',
    openid: '',
    isRegAuth: false, // 是否授权过，用来控制注册时的跳转
    isReg: false, // 用来控制是否要调注册,
    hasInfo: false,
    infoObj: {}
  },
  mutations: {
    SET_OPENID: (state, id) => {
      console.log('dd', id)
      state.openid = id
    },
    SHOW_TOAST: (state, msg) => {
      state.msg = msg
      state.msgType = ''
      state.showMsg = true
    },
    SHOW_ERROR_TOAST: (state, msg) => {
      state.msg = msg
      state.msgType = 'error'
      state.showMsg = true
    },
    HIDE_TOAST: (state) => {
      state.msg = ''
      state.msgType = ''
      state.showMsg = false
    },
    SET_RETURN_TEXT: (state, text) => {
      state.returnText = text
    },
    SET_RETURN_URL: (state, url) => {
      state.returnUrl = url
    },
    SET_USR_TYPE: (state, type) => {
      state.userType = type
    },
    // 是否授权过创建openid
    SET_REG_AUTH: (state, flag) => {
      state.isRegAuth = flag
    },
    // 是否注册过
    SET_REG_STATUS: (state, flag) => {
      state.isReg = flag
    },
    // 是否注册过
    SET_REG_INFO: (state, flag) => {
      state.hasInfo = flag
    },
    SET_INFO_OBJ: (state, infoObj) => {
      state.infoObj = infoObj
    }
  },
  actions: {
    getInfo ({ commit }) {
      request({
        url: 'user/queryUserInfo?openid=' + this.state.user.openid,
        method: 'get'
      }).then(res => {
        console.log(res.data.code)
        if (Number(res.data.code) === 0) {
          console.log('res.dat', res.data.data)
          commit('SET_INFO_OBJ', res.data.data)
          const obj = res.data.data
          if (this.state.user.openid === undefined) {
            commit('SET_OPENID', obj.teaOpenid || obj.stuOpenid)
          }
          if (obj === null || obj.createTime === undefined || obj.createTime === null || obj.createTime === '') {
            // 彻底没授权过
            commit('SET_REG_AUTH', false)
          } else {
            // 有过头像，获取过授权
            commit('SET_REG_AUTH', true)

            if (obj.stuCode !== undefined && obj.stuCode !== null && obj.stuCode !== '' && obj.stuCode.length !== 28) {
              // 注册过
              commit('SET_REG_STATUS', true)
              if (obj.stuName !== null && obj.stuName !== '') {
                commit('SET_REG_INFO', true)
              } else {
                commit('SET_REG_INFO', false)
              }
            } else if (obj.teaCode !== undefined && obj.teaCode !== null && obj.stuCode !== '' && obj.stuCode.length !== 28) {
              // 注册过
              commit('SET_REG_STATUS', true)
              if (obj.teaName !== null && obj.teaName !== '') {
                commit('SET_REG_INFO', true)
              } else {
                commit('SET_REG_INFO', false)
              }
            } else {
              // 没注册过
              commit('SET_REG_STATUS', false)
            }
            // 根据信息判断老师还是学生
            if (obj.stuCode !== undefined) {
              commit('SET_USR_TYPE', 'student')
            } else if (obj.teaCode !== undefined) {
              commit('SET_USR_TYPE', 'teacher')
            }
          }
        }
      }, 20)
    }
  }
}

export default user
