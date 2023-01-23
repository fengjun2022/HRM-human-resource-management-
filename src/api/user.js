import request from '@/utils/request'
// login登录
export const login = data => {
  return request.post('/sys/login', data)
}

export const getUserInfo = () => {
  return request.post('/sys/profile')
}
export const getUserDetailById = id => {
  return request.get(`/sys/user/${id}`)
}
export function logout() {

}
