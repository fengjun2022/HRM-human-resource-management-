<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :she-before="true">
        <template #before>
          <span>{{ page.total }}条数据</span>
        </template>
        <template #after>
          <el-button type="success" @click="$router.push('/import')">
            excel导入
          </el-button>
          <el-button type="danger" @click="exportData">
            excel导出
          </el-button>
          <el-button type="primary" @click="showDialog=true">
            新增员工
          </el-button>
        </template>
      </PageTools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="employeeEnum" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">

            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="+row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" :current-page="page.page" :page-size="page.size" :total="page.total" @current-change="changePage" />
        </el-row>
      </el-card>

    </div>
    <Employees :show-dialog.sync="showDialog" />

  </div>
</template>

<script>
import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import Employees from './components/add-employee.vue'

export default {
  components: {
    Employees
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false

    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    employeeEnum(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === +cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      console.log(id)
      try {
        await this.$confirm('确定删除吗')
        await delEmployee(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (err) { return err }
    },
    exportData() {
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: ['姓名', '工资'],
          data: [],
          filename: '员工工资表'

        }
        )
      })
    }
  }

}
</script>

<style>

</style>
