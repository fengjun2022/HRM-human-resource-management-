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
        const { roles } = await store.dispatch('user/getUserInfo')

        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        router.addRoutes([...routes, { path: '/404', component: () => import('@/views/error-page/404'), hidden: true }])

        next(to.path)
      } else {
        next()
      }
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

