const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  token: state => state.user.token, // 建立对于token的快捷访问
  name: state => state.user.userInfo.username, // 快捷访问用户id
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
  companyId: state => state.user.userInfo.companyId
}
export default getters
