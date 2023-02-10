import Layout from '@/layout'
export default {
  path: '/permissions',
  name: 'permissions',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/permission'),
    meta: { title: '权限管理', icon: 'nested', affix: true }
  }]

}
