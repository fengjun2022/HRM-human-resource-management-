import request from '@/utils/request'

export const getDepartments = () => request('/company/department')

export const delDepartments = id => request.delete(`/company/department/${id}`)

export const addDepartments = data => request.post('/company/department', data)

export const getDepartDetail = id => request(`/company/department/${id}`)
