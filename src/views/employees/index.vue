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
          <el-table-column label="头像" align="center">
            <template v-slot="{row}">
              <img
                slot="reference"
                ref="ca"
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrcode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="employeeEnum" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">

            <template v-slot="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="+row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id }`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" :current-page="page.page" :page-size="page.size" :total="page.total" @current-change="changePage" />
        </el-row>
      </el-card>
      <el-dialog title="二维码" :visible.sync="showCode">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>

    </div>
    <Employees :show-dialog.sync="showDialog" />
    <assign-role ref="assignRole" :show-role-dialog.sync="assign.showRoleDialog" :user-id="assign.userId" />
  </div>
</template>

<script>
import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import Employees from './components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'

export default {
  components: {
    Employees,
    AssignRole
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
      showDialog: false,
      showCode: false,
      assign: { // 角色的状态管理
        showRoleDialog: false,
        userId: null
      }
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
      import('@/vendor/Export2Excel').then(async excel => {
        const headers = {
          '手机号': 'mobile',
          '姓名': 'username',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工工资表'
          // [{},{},{}] => [[],[],[]]
        })
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => {
      // item是一个对象  { mobile: 132111,username: '张三'  }
      // ["手机号", "姓名", "入职日期" 。。]
        return Object.keys(headers).map(key => {
        // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
          // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      // ["132", '张三’， ‘’，‘’，‘’d]
      })
    },
    showQrcode(url) {
      this.$refs.ca.onerror()
      if (url) {
        this.showCode = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole(id) {
      this.assign.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.assign.showRoleDialog = true
    }

  }

}
</script>

<style>

</style>
