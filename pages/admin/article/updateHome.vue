<template>
  <div>
    <Button @click="updateHome">更新首页</Button>
    <p>
      说明：每次访问网站首页时，如果页面的内容都是动态生成，这样的效率会比较低，所以可以使用点击“更新首页”按钮将首页静态化,
      当有文章发布时，首页会自动更新
    </p>
    <p>
      最后更新时间：<span>{{lastUpdateTime}}</span>
    </p>
  </div>
</template>
<style scoped>
  p{
    margin-top: 1em;
    font-size: 15px;
  }
</style>
<script>
  import axios from '~/plugins/axios'

  export default {
    layout: 'admin',
    asyncData () {
      return axios.get('/v1/app/home/lastUpdateTime').then(res => {
        const data = res.data
        if (data === '0') {
          return {lastUpdateTime: '从未更新'}
        } else {
          return {lastUpdateTime: data}
        }
      }).catch(res => {
        return {lastUpdateTime: '获取数据出错'}
      })
    },
    methods: {
      updateHome () {
        this.$http.post('/v1/app/home').then(res => {
          this.$Message.success('更新成功')
        }).catch(res => {
          this.$Message.success('更新失败')
        })
      }
    }
  }
</script>
