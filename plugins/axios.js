import axios from 'axios'
import Vue from 'vue'
import qs from 'qs'

let options = {
  transformRequest: [function (data) {
    return qs.stringify(data)
  }]
}
if (process.browser) {
  options.baseURL = location.protocol + '//' + location.host
} else {
  options.baseURL = process.env.CORE_URL || process.env.coreUrl
}
const instance = axios.create(options)
Vue.prototype.$http = instance
export default instance
