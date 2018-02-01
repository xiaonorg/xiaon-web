<template>
  <div class="article-list container">
    <div v-for="row in rows" :key="row.articleId" class="article-row">
      <h5 class="article-title">
        <span class="article-type">{{getTypeName(row.type)}}</span>
        <a :href="getUrl(row.type,row.articleId, row.url)">{{row.title}}</a>
      </h5>
      <p>{{row.intro}}</p>
      <p>{{row.creatorName}} 创建于 {{row.createDate.substring(0,16)}}</p>
    </div>
  </div>
</template>
<style src="~/assets/css/article-list.css"></style>
<script>
  import axios from '~/plugins/axios'

  export default {
    head () {
      return {
        title: '文章列表-' + process.env.appName
      }
    },
    asyncData () {
      return axios.get('/v1/article', {params: {
        field: 'articleId,intro,creatorName,createDate,title,type,url,seriesId',
        search: 'status=RELEASE and type=ARTICLE',
        sort: 'createDate desc'
      }}).then(res => {
        return {
          total: res.data.total,
          rows: res.data.rows
        }
      }).catch(res => {
        return {
          total: 1,
          rows: [{
            articleId: '-1',
            type: '-1',
            title: '暂无数据',
            intro: '暂无数据',
            creatorName: '小恩',
            createDate: '2018-01-31 15:00:00'
          }]
        }
      })
    },
    methods: {
      getTypeName (type) {
        let name = ''
        switch (type) {
          case 'ARTICLE':
            name = '文章'
            break
          case 'INFO':
            name = '介绍'
            break
          case 'SOURCE':
            name = '源码'
            break
          default:
            name = '应用'
        }
        return name
      },
      getUrl (type, articleId, url) {
        if (url) {
          return url
        }
        let url2 = ''
        switch (type) {
          case 'ARTICLE':
            url2 = '/article/' + articleId
            break
          case 'INFO':
            url2 = '/intro/' + articleId
            break
          case 'SOURCE':
            url2 = '/source/' + articleId
            break
          case 'APP':
            url2 = '/app/' + articleId
            break
          default:
            url2 = '/'
        }
        return url2
      }
    }
  }
</script>
