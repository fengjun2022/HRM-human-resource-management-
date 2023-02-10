import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/employees'),
    meta: { title: '员工管理', icon: 'dashboard', affix: true }
  },
  { path: 'detail/:id', component: () => import('@/views/employees/datail.vue'), hidden: true, meta: { title: '员工详细' }},
  { path: 'print/:id', component: () => import('@/views/employees/print.vue'), hidden: true, meta: { title: '员工打印' }}
  ]
}
