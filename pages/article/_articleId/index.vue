<template>
  <article class="xy-article container">
    <header class="xy-article-title">
      <h1>{{article.title}}</h1>
      <small class="text-muted">作者: {{article.creatorName}} 时间: <time :datetime="article.updateDate.replace(' ','T')">{{article.updateDate.substring(0,16)}}</time></small>
    </header>
    <section class="xy-article-content" v-html="article.formatText">
    </section>
  </article>
</template>
<style src="~/assets/css/article.css"></style>
<script>
  import axios from '~/plugins/axios'

  export default {
    head () {
      return {
        title: this.article.title + '-' + process.env.appName
      }
    },
    async asyncData ({params}) {
      let {data} = await axios.get(`/v1/article/${params.articleId}`, {
        params: {
          field: 'articleId,updateDate,title,formatText,creatorName'
        }
      })
      return {article: data}
    }
  }
</script>
