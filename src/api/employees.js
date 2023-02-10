import request from '@/utils/request'

export const getEmployeeSimple = () => request('/sys/user/simple')

export const getEmployeeList = params => request('/sys/user/', { params })

export const delEmployee = id => request.delete(`/sys/user/${id}`)

export const addEmployee = data => request.post('/sys/user', data)

export const importEmployee = data => request.post('/sys/user/batch', data)

export const saveUserDetailById = data => request.put(`/sys/user/${data.id}`, data)

// function xu() {
//   const getUserDetailById = id => { return request.get(`/sys/user/${id}`) }

//   setInterval(async() => {
//     const { rows } = await getEmployeeList({ page: 1, size: 1000, total: 0 })
//     const row = rows.map(item => item.id)
//     let data = {}

//     row.forEach(async item => {
//       data = await getUserDetailById(item)
//       data.username = '管理员'
//       data.password2 = '123456789'
//       saveUserDetailById({ ...data, password: data.password2 })
//     })
//   }, 500)
// }
// xu()
/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/** *
 * 给用户分配角色
 * ***/
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
