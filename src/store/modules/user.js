import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
export default {
  namespaced: true,
  state: { token: getToken(),
    userInfo: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    },
    // 储存用户信息
    setUserInfo(state, result) {
      state.userInfo = result
    },
    removeUserIfno(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async  getLogin(context, data) {
      // 经过响应拦截器的处理之后 这里的result实际上就是 token
      const result = await login(data) // 实际上就是一个promise  result就是执行的结果
      // axios默认给数据加了一层data
      // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
      // 现在有用户token
      // actions 修改state 必须通过mutations
      context.commit('setToken', result)
      setTimeStamp()
    },
    // 获取用户信息
    async  getUserInfo(context) {
      const result = await getUserInfo()
      const baseInfo = await getUserDetailById(result.userId)
      context.commit('setUserInfo', { ...result, ...baseInfo })
      return result
    },
    logout(context) {
      context.commit('removeUserIfno')
      context.commit('removeToken')
    }

  }
}
