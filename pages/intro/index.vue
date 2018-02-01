<template>
  <article class="xy-article container">
    <section class="xy-article-content">
      <div class="md-h1">
        <fieldset>
          <legend>介绍</legend>
        </fieldset>
      </div>
      <p>本人网名小恩，在2016年5月19日建立了这个网站，计划在开发、部署、运营、推广网站的过程中锻炼自己的能力，很高兴能将自己的经验分享出来。</p>
    </section>
  </article>
</template>
<style src="~/assets/css/article.css"></style>
<script>
  export default {
    head: {
      title: '网站介绍-' + process.env.appName
    }
  }
</script>
