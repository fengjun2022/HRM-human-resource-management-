import store from '@/store'
export default {

  // data() {
  //   let showDialog = false
  //   function openDialog(d) {
  //     showDialog = d
  //   }
  //   const cancelDialog = () => {
  //     showDialog = false
  //   }
  //   return {
  //     openDialog,
  //     cancelDialog
  //   }
  // },
  methods: {
    reset(data) {
      if (data.constructor === Object) {
        Object.keys(data).forEach(item => { data[item] = '' })
      } else if (data.constructor === Array) {
        return []
      } else if (data.constructor === String) {
        return ''
      }
    },

    checkRermission(key) {
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }

  }

}
