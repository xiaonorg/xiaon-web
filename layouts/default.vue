<template>
  <div class="xy-container">
    <header class="xy-container-header">
      <nav class="xy-nav container">
        <a href="/">{{this.$store.state.env.appName}}</a>
        <button class="xy-nav-button" @click="expandMenu"><i class="fa fa-bars" aria-hidden="true"></i></button>
        <div v-bind:class="{'xy-nav-wrapper':hasWrapperClass}">
          <div class="xy-nav-mask" @click="hiddenMenu">
            <div class="xy-nav-panel">
              <ul class="xy-nav-ul">
                <li>
                  <router-link to="/intro">介绍</router-link>
                </li>
                <li>
                  <router-link to="/article">文章</router-link>
                </li>
                <li>
                  <router-link to="/app">应用</router-link>
                </li>
                <li>
                  <router-link to="/other/source">源码</router-link>
                </li>
                <li v-if="this.$store.state.user.isLogin">
                  <router-link to="/admin">管理</router-link>
                </li>
                <li v-else>
                  <router-link to="/other/login">登录</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <div class="xy-container-content">
      <nuxt/>
    </div>
  </div>
</template>
<style>
  body {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, \\5FAE\8F6F\96C5\9ED1, Arial, sans-serif;
    color: #495060;
  }

  .xy-container {
    min-height: 100vh;
  }

  .xy-container-header {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3.5em;
    border-bottom: 1px solid #dddee1;
    background-color: #fff;
    z-index: 800;
  }

  .xy-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    margin: 0 auto;
  }

  .xy-nav > a {
    font-size: 1.5em;
    color: #555;
  }

  .xy-nav a {
    text-decoration: none;
  }

  .xy-nav-button {
    border: none;
    background-color: #fff;
    display: block;
    width: 2em;
  }

  .xy-nav-button > i {
    font-size: 1.5em;
    color: #666;
  }

  .xy-nav-wrapper {
    display: none;
  }

  .xy-nav-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(55, 55, 55, .6);
    height: 100%;
    z-index: 1000;
  }

  .xy-nav-panel {
    width: 60%;
    height: 100%;
    background-color: #fff;
    position: fixed;
    right: 0;
    max-width: 18em;
  }

  .xy-nav-ul {
    margin: 1em;
    padding: 0;
    list-style: none;
  }

  .xy-nav-ul li {
    height: 2.5em;
    line-height: 2.5em;
  }

  .xy-nav-ul a {
    color: #495060;
    display: block;
  }

  .xy-container-content {
    flex: 1;
    margin-top: 3.5em;
    display: flex;
    justify-content: center;
  }

  /*  防止在ie中不居中*/
  .xy-container-content > .container {
    margin-left: 0;
    margin-right: 0;
  }

  /*  在大屏幕上的样式*/
  @media (min-width: 768px) {
    .xy-nav-button {
      display: none;
    }

    .xy-nav-wrapper {
      display: block;
    }

    .xy-nav-mask {
      position: inherit;
      background-color: #fff;
      z-index: auto;
    }

    .xy-nav-panel {
      position: inherit;
      width: auto;
      max-width: 100%;
    }

    .xy-nav-ul {
      display: flex;
      margin: 0;
    }

    .xy-nav-ul li {
      margin: 0 0.6em;
      padding: 0 0.3em;
      font-size: 0.9em;
    }
  }

  @media (min-width: 576px) {
    body {
      background-color: #f8f8f9 !important;
    }

    /*  小屏幕上加上这句会导致页面缩小，不知道为什么 */
    .xy-container {
      display: flex;
    }
  }
</style>
<script>
  export default {
    data () {
      return {
        hasWrapperClass: true
      }
    },
    methods: {
      expandMenu () { // 控制是否显示导航菜单
        this.hasWrapperClass = !this.hasWrapperClass
      },
      hiddenMenu (event) { // 手机上点击时隐藏导航菜单
        const c = event.target.getAttribute('class')
        if (!this.hasWrapperClass && c && c.indexOf('xy-nav-mask') > -1) {
          this.hasWrapperClass = true
        }
      }
    },
    head: {
      link: [
        {hid: 'basecss', rel: 'stylesheet', href: '/static/plugins/bootstrap/css/bootstrap-4.0.0.min.css'}
      ]
    }
  }
</script>
