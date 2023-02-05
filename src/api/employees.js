import request from '@/utils/request'

export const getEmployeeSimple = () => request('/sys/user/simple')

export const getEmployeeList = params => request('/sys/user/', { params })

export const delEmployee = id => request.delete(`/sys/user/${id}`)

export const addEmployee = data => request.post('/sys/user', data)

export const importEmployee = data => request.post('/sys/user/batch', data)

