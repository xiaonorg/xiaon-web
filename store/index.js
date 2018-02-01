import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    user: {
      isLogin: false,
      userId: '',
      name: ''
    },
    env: {
      appName: process.env.appName
    }
  },
  mutations: {
    login (state, param) {
      state.user.isLogin = true
      state.user.userId = param.userId
      state.user.name = param.name
    },
    logout (state) {
      state.user.isLogin = false
      state.user.userId = ''
      state.user.name = ''
    }
  }
})

export default store
