<template>
    <article class="xy-article container">
      <section class="xy-article-content">
        <div class="md-h1">
          <fieldset>
            <legend>前端项目:xiaoyun-web</legend>
          </fieldset>
        </div>
        <p>项目地址:<a href="http://git.oschina.net/xiaoyun_studio/xiaoyun-web" target="_blank">http://git.oschina.net/xiaoyun_studio/xiaoyun-web</a>
        </p>
        <p>前端项目负责网页呈现，和用户交互</p>
        <p>主要技术: html,javascript,css,vue,iview</p>
        <div class="md-h1">
          <fieldset>
            <legend>后端项目:xiaoyun-core</legend>
          </fieldset>
        </div>
        <p>项目地址:<a href="http://git.oschina.net/xiaoyun_studio/xiaoyun-core" target="_blank">http://git.oschina.net/xiaoyun_studio/xiaoyun-core</a>
        </p>
        <p>后端项目负责业务逻辑处理，数据存储，提供rest api给前端项目调用</p>
        <p>主要技术: java,spring-boot,spring-mvc,hibernate</p>
      </section>
    </article>
</template>
<style src="~/assets/css/article.css"></style>
<script>
  export default {
    head: {
      title: '网站源码-' + process.env.appName
    }
  }
</script>
