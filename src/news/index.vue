<template>
  <div class="news-all">
    <ul class="news-menu">
      <li class="news-menu-item"
        :style="{'font-weight': item.text === label ? 'bold' : 'normal'}"
        v-for="item in menuNav"
        @click="changeLabel(item)">{{item.text}}</li>
    </ul>
    <div class="news-list" :ref="'newsWrapper'">
      <div  class="news-list-wrapper">
        <div class="news-item" :class="{'news-img': item.img && item.img !== ''}"
          v-for="item in newsList"
          @click.stop="jumpToDetail(item.artId)">
          <div class="title">{{item.title}}</div>
          <div class="author">{{item.articleSource}}</div>
          <div class="time">{{item.articleDate}}</div>
          <div class="img" v-if="item.img && item.img !== ''">
            <img :src="item.img">
          </div>
        </div>
      </div>
      <template v-if="loading">
        <loading></loading>
      </template>
      <div class="no-course" v-if="!loading && noNews">
        <no-data :text="'当前没有技术资讯'"></no-data>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'

import request from '../utils/request'

import noData from '../components/noData'
import loading from '../components/loading'
export default {
  name: 'news',
  components: { noData, loading },
  data () {
    return {
      newsScroll: null,
      loading: false,
      newsList: [],
      page: 0,
      label: '',
      menuNav: [{
        text: '推荐', id: '0'
      }, {
        text: '高考', id: '1'
      }, {
        text: '志愿', id: '2'
      }, {
        text: '心理', id: '3'
      }]
    }
  },
  computed: {
    noNews () {
      return this.newsList.length === 0
    },
    teaOpenid () {
      return this.$store.state.user.infoObj.teaOpenid || ''
    },
    stuOpenid () {
      return this.$store.state.user.infoObj.stuOpenid || ''
    },
    openid () {
      return this.teaOpenid || this.stuOpenid
    }
  },
  mounted () {
    this.page = 0
    this.label = this.menuNav[0].text
    this.getList()
  },
  methods: {
    _initScroll () {
      this.newsScroll = new BScroll(this.$refs.newsWrapper, {
        click: true,
        pullDownRefresh: {
          threshold: 50,
          stop: 40
        },
        pullUpLoad: {
          threshold: 50,
          moreTxt: '加载中',
          noMoreTxt: '没有更多数据了'
        }
      })
      this.newsScroll.on('pullingUp', () => {
        console.log('finishPullUp')
        this.page++
        new Promise((resolve) => {
          this.getList(resolve)
        }).then((newData) => {
          this.newsScroll.finishPullUp()
        })
      })
      this.newsScroll.on('pullingDown', () => {
        this.page = 0
        console.log('pullingDown')
        new Promise((resolve) => {
          this.getList(resolve)
        }).then((newData) => {
          this.newsScroll.finishPullDown()
        })
      })
    },
    changeLabel (item) {
      this.label = item.text
      this.page = 0
      this.newsScroll.scrollTo(0, 0, 500)
      this.newsList = []
      this.getList()
    },
    getList (resolve) {
      if (this.page === 0) {
        this.loading = true
      }
      request({
        url: 'http://www.zhiheyikaoqin.cn/sdc/article/getArticleList',
        method: 'post',
        data: {
          openid: this.openid,
          page: this.page,
          pageSize: 10,
          label: this.label
        }
      }).then(res => {
        if (resolve !== undefined) {
          resolve()
        }
        if (this.newsList.length === 0) {
          this.newsList = res.data.data.map(item => {
            return item
          })
        } else {
          this.newsList = this.newsList.concat(res.data.data.map(item => {
            return item
          }))
        }
        this.loading = false
        this.$nextTick(() => {
          this._initScroll()
        })
      })
    },
    jumpToDetail (id) {
      this.$router.push({ path: '/news/' + id })
    }
  }
}
</script>
<style lang="scss" scoped="">
.news-all {
  height: 100%;
}
.news-list {
  margin-top: 50px;
  height: calc(90%);
  height: calc(100% - 50px);
  .no-data {
    padding-top: 200px;
  }
}
.news-menu {
  position: absolute;
  top: 0;    
  width: 100%;
  background: #fff;
  z-index: 4;
  padding: 0 10px;    
  border-bottom: 2px solid #fbf9fe;
  .news-menu-item {
    list-style: none;
    display: inline-block;
    line-height: 40px;
    padding: 0 10px;
    font-size: 16px;
  }
}
.news-item {
  background: #fff;
  margin-bottom: 5px;
  padding: 20px 16px;
  position: relative;
  min-height: 60px;
  padding-right: 20px;
  &.news-img {
    min-height: 80px;
    padding-right: 120px;
    .img {
      position: absolute; 
      width: 80px;
      height: 80px;
      right: 20px;
      top: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .title {
    font-size: 16px;
    color: #373d41;
  }
  .author,
  .time {
    color: #aaa;
  }
}  
</style>
