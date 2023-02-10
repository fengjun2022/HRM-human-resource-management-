import request from '@/utils/request'

export const getRoleList = data => request('/sys/role', { params: { data }})

export const getCompanyInfo = companyId => request(`/company/${companyId}`)

export const deleteRole = id => request.delete(`/sys/role/${id}`)

export const updateRole = data => request.put(`/sys/role/${data.id}`, data)

export const getRoleDetail = id => request(`/sys/role/${id}`)

export const addRole = data => request.post('/sys/role', data)

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
