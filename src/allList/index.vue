<template>
  <div class="all-course">
  </div>
</template>
<script>
// import request from '../utils/request'
export default {
  data () {
    return {
      all: []
    }
  },
  mounted () {
    this.getAll()
  },
  methods: {
    deepClone (original) {
      return JSON.parse(JSON.stringify(original))
    },
    getAll () {
      request({
        // url: 'http://58.119.112.12:8086/stu/findAllCourse',
        url: 'stu/findAllCourse',
        data: {
          page: 1,
          size: 10
        },
        method: 'post'
      }).then(res => {
        if (Number(res.data.errno) !== 0) {
        } else {
          console.log('2')
        }
      })
    }
  }
}
</script>
<style>
.all-score {
  height: 100%;
  overflow: hidden;
  background: #fff url('../assets/img/green-bac.png') no-repeat;
  background-size: cover;
  color: #555;
}
.scroll-title {
  margin: 30px auto;
}
.all-score-tips {
  position: absolute;
  right: 50px;
  top: 105px;
  font-size: 12px;
  color: #737373;
}
.all-score-block {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0px 25px rgba(0,0,0,0.5);
  padding: 40px;
  margin: 30px 40px;
  text-align: left;
  height: 100%;
  height: calc(100% - 240px);
  overflow: hidden;
}
.all-score-list {
  border-top: 1px solid #ddd;
  /*margin-bottom: -1px;*/
  height: 100%;
  height: calc(100% - 130px);
  overflow: hidden;
}
.all-score-scroll {
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-duration: 600ms;
  transform: translateY(0);
}
.all-score-item {
  font-size: 13px;
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
  display: inline-block;
  width: 45%;
  width: calc(46% - 2px);
  padding-left: 4%;
  border: 1px solid #ddd;
  border-top: 0;
}
/*.all-score-item:last-child {
  border-bottom: 1px solid #ddd;
}*/
.all-score-item:nth-child(odd) {
  border-right: 0;
}
.score-item-id {
  position: absolute;
  width: 20px;
  left: 5%;
  top: 10px;
  text-align: center;
}
.score-class {
  padding-left: 25px;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
}
.score-total {
  position: absolute;
  right: 0;
  top: 12px;
  width: 120px;
}
.score-art,
.score-tec,
.score-pe {
  display: inline-block;
  padding-left: 25px;
}
.top3-block {
  text-align: center;
}
.top-item {
  width: 26%;
  max-width: 250px;
  padding: 0 4% 0 0;
  display: inline-block;
  margin-bottom: 30px;
  position: relative;
}
.top-item-0 .top-award-img {
  background: url('../assets/img/award1.png') no-repeat;
  background-size: contain;
}
.top-item-1 .top-award-img {
  background: url('../assets/img/award2.png') no-repeat;
  background-size: contain;
}
.top-item-2 .top-award-img {
  background: url('../assets/img/award3.png') no-repeat;
  background-size: contain;
}
.top-award-img {
  position: absolute;
  left: 10px;
  top: 0;
  width: 55px;
  height: 80px;
  display: inline-block;
}
.top-award-info {
  width: 100%;
  height: 60px;
  border: 1px solid rgba(88, 144, 194, 0.15);
  border-radius: 10px 10px 30px 10px;
  margin-top: 40px;
  background: rgba(88, 144, 194, 0.15);
}
.top-award-class {
  display: block;
  padding: 5px 0 0 70px;
  text-align: left;
  font-weight: bold;
}
.top-award-value {
  display: block;
  padding: 0 30px 5px 70px;
  text-align: left;
  font-size: 16px;
}
</style>
