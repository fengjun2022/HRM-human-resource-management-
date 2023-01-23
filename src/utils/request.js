import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(config => {
  // config是请求的配置信息
// 注入token
  if (store.getters.token) {
    // 主动检测 判断token是否过期过期-现在大于1小时则过期
    if ((+new Date() - getTimeStamp()) / 1000 > 3600) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('登录超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // 必须要返回的
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
    Promise.reject(new Error('登录超时'))
  } else {
    Message.error(error.message) // 提示错误消息
    return Promise.reject(error) // 返回执行错误，让当前执行链跳出成功进入catch
  }
})

export default service
