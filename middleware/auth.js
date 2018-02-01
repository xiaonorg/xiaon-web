import axios from '~/plugins/axios'

export default function ({ req, store, redirect }) {
  // 如果用户没有登陆，则跳转到首页
  if (!store.state.user.isLogin) {
    return axios.get('/v1/user/me', {
      // 设置cookie
      headers: {'cookie': req.headers.cookie || 'a=no'}
    })
      .then(function (response) {
        const result = response.data.result
        if (result === 'noLogin') {
          return redirect('/')
        }
      }).catch(res => {
        return redirect('/')
      })
  }
}
