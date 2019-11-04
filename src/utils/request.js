import axios from 'axios'
import qs from 'qs'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://www.zxsdc.top/sdc/sdc/', // api的base_url
  // baseURL: 'http://localhost:8086/sdc/', // api的base_url
  // port: 80,
  // withCredentials: true,
  timeout: 50000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(config => {
  config['headers']['Content-Type'] = 'application/x-www-form-urlencoded'
  if (config.method === 'POST' || config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, error => {
  Promise.reject(error)
  console.log(error)
})
//
// // respone拦截器
// service.interceptors.response.use(
//   response => {
//     return response
//   },
//   error => {
//     console.log(error)
//     return Promise.reject(error)
//   })

export default service
