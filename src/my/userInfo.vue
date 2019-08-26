<template>
  <div class="user-info">
    <div class="user-info-we">
      <div class="we-img">
        <img :src="weImg">
      </div>
      <div class="we-name">微信昵称： {{weName}}</div>
    </div>
    <stu-reg :info="infoObj" :type="'info'" v-if="type === 'student'"></stu-reg>
    <tea-reg :info="infoObj" :type="'info'" v-if="type === 'teacher'"></tea-reg>
    <div class="btn send-btn del-user" @click="delUser">注销用户</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import stuReg from '../register/stuReg'
import teaReg from '../register/teaReg'
import request from '../utils/request'
import { msg, errorMsg } from '../utils/common'

export default {
  name: 'userInfo',
  components: {
    stuReg,
    teaReg
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      stuOpenid: state => state.user.infoObj.stuOpenid,
      teaOpenid: state => state.user.infoObj.teaOpenid,
      infoObj: state => state.user.infoObj,
      userType: state => state.user.userType
    }),
    weName () {
      return this.$store.state.user.infoObj.stuNickname || this.$store.state.user.infoObj.teaNickname
    },
    weImg () {
      return this.$store.state.user.infoObj.stuHeadimgurl || this.$store.state.user.infoObj.teaHeadimgurl
    },
    type () {
      const tmp = this.$store.state.user.userType
      this.$store.commit('SET_RETURN_TEXT', '我的信息')
      return tmp
    }
  },
  mounted () {
  },
  methods: {
    delUser () {
      const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
      this.$vux.confirm.show({
        content: '是否注销用户',
        // 组件除show外的属性
        onCancel () {
          console.log(this) // 非当前 vm
          console.log(_this) // 当前 vm
        },
        onConfirm () {
          _this._delAPI()
        }
      })
    },
    _delAPI () {
      let url = ''
      let req = {}
      if (this.userType === 'teacher') {
        url = 'http://www.zhiheyikaoqin.cn/sdc/user/deleteTeaByOpenid?teaOpenid=' + this.teaOpenid
      } else {
        url = 'http://www.zhiheyikaoqin.cn/sdc/user/deleteStuByOpenid?stuOpenid=' + this.stuOpenid
      }
      console.log(url, req)
      request({
        url: url,
        method: 'get'
      }).then(res => {
        if (res.data.code === 0) {
          msg(this, '注销成功')
          delete localStorage.openid
          setTimeout(() => {
            this.$router.push({ name: 'selRegType' })
          }, 500)
        } else {
          errorMsg(this, res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/color.scss';
  .user-info-we {
    padding: 30px 0 0 0;
    text-align: center;
  }
  .we-img {
    width: 80px;
    height: 80px;
    display: inline-block;
    img {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      border: 3px solid $green;
    }
  }
  .we-name {
    padding: 10px 40px;
  }
</style>
