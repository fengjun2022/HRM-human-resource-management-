import store from '@/store'
import router from '@/router'
import nProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
router.beforeEach(async(to, from, next) => {
  nProgress.start() // 开启进度条
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  nProgress.done()
})

router.afterEach(() => {
// 关闭进度条
  nProgress.done()
})

