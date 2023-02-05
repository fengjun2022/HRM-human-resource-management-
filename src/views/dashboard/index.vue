<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->

    <PageTools>
      <template #after>
        <el-button type="primary">1111</el-button>

      </template>
      <template #before>
        <span>2222</span>

      </template>
    </PageTools>
    <UploadExcel />
  </div></template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'

export default {
  name: 'Dashboard',

  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  }
}
</script>
