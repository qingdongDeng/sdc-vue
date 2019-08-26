<template>
  <div class="article-block">
    <div class="art-header">
      <div class="title">{{title}}</div>
      <div class="author"><span></span> {{author}}</div>
      <div class="time"><span>{{time}}</span></div>
      <div class="tag">
        <span v-if="articleLabel1 !== undefined && articleLabel1 !== ''">{{articleLabel1}}</span>
        <span v-if="articleLabel2 !== undefined && articleLabel2 !== ''">{{articleLabel2}}</span>
      </div>
    </div>
    <div class="art-body">
      <img v-if="img !== undefined && img !== ''" :src="img">
      <template v-for="item in content">
        <h4 v-if="item.type === 'title'">{{item.text}}</h4>
        <p v-else-if="item.type === 'text'">{{item.text}}</p>
        <img v-else="item.type === 'img'" :src="item.text" />
      </template>
      <div class="rank">
        <div class="rank-label">评价新闻：</div>
        <div class="rank-content">
          <star :length="5" :value="score" :disabled="isUnReg" :isreadonly="hasScored" @updateScore="updateScore"></star>
        </div>
      </div>
      <div class="art-org">
        <a :href="orgUrl">原文出处</a>
      </div>
    </div>
  </div>
</template>
<script>
import request from '../utils/request'
import { msg, errorMsg } from '@/utils/common'
import star from '../components/star'

export default {
  components: { star },
  data () {
    return {
      loading: false,
      title: '',
      author: '',
      img: '',
      time: '',
      content: [],
      orgUrl: '',
      score: 0,
      hasScored: false,
      articleLabel1: '',
      articleLabel2: ''
    }
  },
  computed: {
    isUnReg () {
      return this.$store.state.user.openid === undefined || this.$store.state.user.openid === ''
    }
  },
  mounted () {
    console.log(this.$store.state.user.openid)
    this.$store.commit('SET_RETURN_TEXT', '看新闻')
    this.$store.commit('SET_RETURN_URL', '/tech')
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.loading = true
      request({
        url: 'http://www.zhiheyikaoqin.cn/sdc/article/getArticleContent',
        method: 'post',
        data: {
          artId: this.$route.params.id,
          openid: this.$store.state.user.openid
        }
      }).then(res => {
        this.loading = false
        this.title = res.data.data.title
        this.author = res.data.data.articleSource
        this.img = res.data.data.articleImg
        this.time = res.data.data.articleDate
        this.orgUrl = res.data.data.articleUrl
        this.articleLabel1 = res.data.data.articleLabel1 || '高考'
        this.articleLabel2 = res.data.data.articleLabel2 || '观看更多'
        if (res.data.data.articleContent.indexOf('<p>') !== -1) {
          this.content = res.data.data.articleContent.replace(/<p>/g, '').split('</p>').map(item => {
            return {
              type: 'text',
              text: item
            }
          })
        } else {
          this.content = res.data.data.articleContent
        }
        this.initScore()
      })
    },
    initScore () {
      request({
        url: 'http://www.zhiheyikaoqin.cn/sdc/article/getArticleScore?openid=' + this.$store.state.user.openid + '&artId=' + this.$route.params.id,
        method: 'get'
      }).then(res => {
        if (res.data.data !== undefined && res.data.data !== null && res.data.data.scoreId !== undefined) {
          this.hasScored = true
          this.score = res.data.data.score
        } else {
          this.hasScored = false
        }
      })
    },
    updateScore (score, item) {
      // console.log('s', this.isUnReg)
      if (this.isUnReg) {
        errorMsg(this, '没注册不允许评论')
        return
      }
      if (this.hasScored) {
        errorMsg(this, '已评价过')
        return
      }
      this.score = score
      console.log('sate', score, item)
      request({
        url: 'http://www.zhiheyikaoqin.cn/sdc/article/putScore?openid=' + this.$store.state.user.openid + '&artId=' + this.$route.params.id + '&score=' + score,
        method: 'get'
      }).then(res => {
        if (res.data.code === 0) {
          this.hasScored = true
        }
        msg(this, res.data.msg)
      })
    }
  }
}
</script>
<style lang="scss" scoped="">
  .article-block {
    background: #fff;
    padding: 80px 20px 20px 20px;
  }
  .art-header {
    margin-bottom: 20px;
    .title {
      font-size: 17px;
      line-height: 1.4;
      margin-bottom: 4px;
      color: #333;
    }
    .author,
    .time {
      display: inline-block;
      margin-right: 10px;
      color: #576b95;
      span {
        color: rgba(0,0,0,0.3);
      }
    }
    .tag {
      display: inline-block;
      color: #aaa;
      span {
        display: inline-block;
        background: #ababab;
        color: #fff;
        padding: 0 6px;
        border-radius: 6px;
      }
    }
  }
  .art-body {
    color: #333;
    text-align: justify;
    h4 {
      font-size: 16px;
      color: #576b95;
    }
    p {
      line-height: 2;
      font-size: 16px;
    }
    img {
      width: 100%;
    }
  }
  .art-org {
    margin: 20px 0;
    a {
      color: #576b95;
    }
  }
  .rank {
    margin-top: 40px;
    .rank-label {
      color: #576b95;
      line-height: 34px;
      vertical-align: bottom;
    }
    .rank-label, .rank-content {
      display: inline-block;
    }
  }
</style>
<style lang="scss">
  .rank-content {
    .iconfont {
      font-size: 24px;
    }
  }
</style>