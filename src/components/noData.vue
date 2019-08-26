<template>
  <div class="no-data">
    <i class="iconfont icon-wujiedu"></i>
    <div>{{text}}</div>
  </div>
</template>
<script>
  export default {
    name: 'no-data',
    props: {
      text: {
        type: String,
        default: '暂无内容'
      }
    }
  }
</script>
<style lang="scss" scoped="">
  @import '../styles/color.scss';
  .no-data {
    height: 160px;
    text-align: center;
    padding: 20px 0;
    opacity: 0.5;
    .iconfont {
      font-size: 80px;
      color: $green;
    }
  }
</style>
