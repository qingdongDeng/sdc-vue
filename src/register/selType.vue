<template>
  <div class="sel-type">
    <div class="sel-overlay"></div>
    <div class="sel-body">
      <div class="sel-header">我是：</div>
      <div class="sel-box student" @click="setType('teacher')">
        <div class="sel-box-content">
          <i class="iconfont icon-laoshi"></i>
          <div class="sel-box-text">老师</div>
        </div>
      </div>
      <div class="sel-box teacher" @click="setType('student')">
        <div class="sel-box-content">
          <i class="iconfont icon-nanxuesheng"></i>
          <div class="sel-box-text">学生</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      isRegAuth: state => state.user.isRegAuth,
      isReg: state => state.user.isReg
    })
  },
  methods: {
    setType (type) {
      this.$store.commit('SET_REG_TYPE', type)

      const role = (type === 'student') ? '1' : '2' // 角色 ，学生为1，教师为2
      // this.$router.push({ name: 'register' })
      location.href = 'http://www.zxsdc.top/show/sdc/sdc/wechat/authorize?returnUrl=index.html&role=' + role + '&path=register'
      // location.href = 'http://localhost:8086/sdc/sdc/wechat/authorize?returnUrl=sdc/index.html&role=' + role + '&path=register'
    }
  }
}
</script>
<style lang="scss">
  @import '../styles/color.scss';

  .sel-type {
    width: 100%;
    height: 100%;
  }
  .sel-overlay {
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,0.4);
  }
  .sel-body {
    position: fixed;
    height: 200px;
    top: 50%;
    margin: -100px 0 0 0;
    width: 100%;
  }
  .sel-header {
    color: #fff;
    position: absolute;
    top: -40px;
    font-size: 16px;
    margin: 0 40px;
  }
  .sel-box {
    width: 49%;
    display: inline-block;
    text-align: center;
    height: 150px;
  }
  .sel-box-content {
    margin: 0 20px 0 40px;
    background: #fff;
    height: 70px;
    padding: 20px 30px 30px;
    border-radius: 10px;
    .sel-box:last-child & {
      margin-left: 20px;
      margin-right: 40px;
    }
    .iconfont {
      font-size: 40px;
      color: $green;
    }
  }
</style>
