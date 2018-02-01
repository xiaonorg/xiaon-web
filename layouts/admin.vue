<template>
  <div class="layout">
    <header class="layout-header">
      <div id="header-left">
        <router-link to="/">{{this.$store.state.env.appName}}</router-link>
      </div>
      <div id="header-right"><a>{{this.$store.state.user.name}}</a><a @click="logout">注销</a></div>
    </header>
    <nav class="layout-content">
      <div class="layout-content-left">
        <Menu width="auto" :accordion="true" @on-select="selectMenu" ref="navMenu" >
          <Submenu name="message">
            <template slot="title">
              <i class="fa fa-comments"></i>
              消息
            </template>
            <Menu-item name="/admin/message/feedbackManage">用户留言</Menu-item>
          </Submenu>
          <Submenu name="article">
            <template slot="title">
              <i class="fa fa-file-text"></i>
              文章
            </template>
            <Menu-item name="/admin/article/updateHome">更新首页</Menu-item>
            <Menu-item name="/admin/article/articleManage">文章管理</Menu-item>
            <Menu-item name="/admin/article/editArticle">编辑文章</Menu-item>
            <Menu-item name="/admin/article/seriesManage">文章系列</Menu-item>
          </Submenu>
          <Submenu name="security">
            <template slot="title">
              <i class="fa fa-lock"></i>
              安全
            </template>
            <Menu-item name="/admin/security/userManage">用户管理</Menu-item>
            <Menu-item name="/admin/security/roleManage">角色管理</Menu-item>
            <Menu-item name="/admin/security/authManage">权限列表</Menu-item>
            <Menu-item name="/admin/security/roleAuth">角色权限</Menu-item>
            <Menu-item name="/admin/security/userRole">用户角色</Menu-item>
          </Submenu>
        </Menu>
      </div>
      <div class="layout-content-right">
        <nuxt/>
      </div>
    </nav>
    <div class="layout-footer">
      &copy; 小云工作室
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import iView from 'iview'
  import XyModal from '../components/xy-modal'
  import XyTable from '../components/xy-table'
  Vue.use(iView)
  Vue.use(XyModal)
  Vue.use(XyTable)

  export default {
    middleware: 'auth',
    created () {
      if (process.browser) { // 如果是在浏览器上运行
        if (!this.$store.state.user.isLogin) {
          return this.$http.get('/v1/user/me')
            .then(res => {
              const result = res.data.result
              if (result !== 'noLogin') {
                this.$store.commit('login', result)
              } else {
                this.$router.push('/')
              }
            })
        }
      }
    },
    methods: {
      selectMenu (name) { // 点击菜单
        this.$router.push(name)
      },
      logout () { // 注销
        this.$http.get('/v1/user/logout').then(response => {
          this.$store.commit('logout')
          this.$router.push('/')
        }).catch(response => {
          this.$Message.error('注销失败')
        })
      }
    },
    head: {
      link: [
        {hid: 'basecss', rel: 'stylesheet', href: '/static/plugins/iview/iview-2.7.0.css'}
      ]
    }
  }
</script>
<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f8f8f9;
  }

  .layout-header {
    height: 60px;
    line-height: 60px;
    background-color: #495060;
  }

  #header-left {
    float: left;
    font-size: 20px;
    margin-left: 30px;
  }

  #header-left a {
    color: hsla(0, 0%, 100%, .7);
  }

  #header-right {
    float: right;
    font-size: 15px;
  }

  #header-right a {
    display: inline-block;
    width: 60px;
    color: hsla(0, 0%, 100%, .7);
  }

  .layout-content {
    flex: 1;
    margin: 10px 10px 0 10px;
    border-radius: 10px;
    background-color: #fff;
    display: flex;
  }

  .layout-content-left {
    width: 320px;
  }

  .layout-content-right {
    flex: 1;
    padding:15px;
  }

  .layout-footer {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }

  .ivu-btn>span>i {
    margin-right: 4px;
  }
</style>
