import { constantRoutes, asyncRoutes } from '@/router'

export default {
  namespaced: true,
  state: {
    routes: constantRoutes
  },
  mutations: {
    setRoutes(state, newRoutes) {
      console.log(11)
      state.routes = [...constantRoutes, ...newRoutes]
    }
  },
  actions: {
    filterRoutes(context, menus) {
      const routes = []
      menus.forEach(key => {
        routes.push(...asyncRoutes.filter(item => item.name === key))
        context.commit('setRoutes', routes)
      })
      return routes
    }
  }

}
