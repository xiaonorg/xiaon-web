<template>
  <div class="container panel">
    <div class="row">
      <div class="col-12 col-sm-8 col-md-7 col-lg-4 m-auto">
        <div class="login-msg">{{message}}</div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input type="text" v-model="name" class="form-control" id="email" placeholder="请输入邮箱" @keyup.enter="handleSubmit">
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input type="password" v-model="password" class="form-control" id="password" placeholder="请输入密码" @keyup.enter="handleSubmit">
          </div>
          <button class="btn btn-primary btn-block" @click="handleSubmit">登 录</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .panel {
    margin: 0.5em 0;
    padding: 0.5em;
  }

  .login-msg {
    color: red;
    text-align: center;
    font-size: 0.9em;
    margin-bottom: 1em;
  }
</style>
<script>
  export default {
    head: {
      title: '登录-' + process.env.appName
    },
    data () {
      return {
        name: '',
        password: '',
        message: ''
      }
    },
    created  () {
      if (process.browser) { // 如果是在浏览器上运行
        if (this.$store.state.user.isLogin) { //  如果已经登录
          this.$router.push('/admin')
        } else {
          this.$http.get('/v1/user/me')
            .then(res => {
              const result = res.data.result
              if (result !== 'noLogin') {
                this.$store.commit('login', result)
                this.$router.push('/admin')
              }
            })
        }
      }
    },
    methods: {
      handleSubmit () {
        if (this.name.length === 0) {
          this.message = '邮箱不能为空'
          return
        }
        if (this.password.length === 0) {
          this.message = '密码不能为空'
          return
        }
        this.message = ''
        this.$http.post('/v1/user/login', {
          name: this.name,
          password: this.password
        }).then(response => {
          this.$store.commit('login', response.data)
          this.$router.push('/admin')
        }).catch(data => {
          let response = data.response
          if (response.data && response.data.message) {
            this.message = response.data.message
          } else {
            this.message = '登录失败,请稍后重试'
          }
        })
      }
    }
  }
</script>
