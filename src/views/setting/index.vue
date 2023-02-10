<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog=!showDialog"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="compile(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>

            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabledstyle="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabledstyle="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
      <el-dialog
        title="编辑"
        :visible="showDialog"
        style="margin-top:60px"
        :show-close="false"
      >
        <el-form ref="roleForm" label-width="120px" style="height:200px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" style="width:800px" />
          </el-form-item>
          <el-form-item label="角色描述" prop="roleForm.description">
            <el-input v-model="roleForm.description" style="width:800px" />
          </el-form-item>
          <el-row type="flex" justify="center" style="margin-top:30px">
            <el-col :span="6">
              <el-button @click=" btnCance">取消</el-button>
              <el-button type="primary" @click="btnCancel">立即创建</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
    <el-dialog title="分配权限" :visible="showprDialog" @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { transFormTreeStructure } from '@/utils'
import { getPermissionList } from '@/api/permission'
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      formData: {},
      showprDialog: false,
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名字不能为空', trigger: 'blur' }]

      },
      permData: [],
      defaultProps: {
        label: 'name'
      },

      roleId: null,
      selectCheck: []
    }
  },
  computed: {
    ...mapGetters([['companyId']])

  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },

  methods: {
    async  getRoleList() {
      console.log(this.page.page)
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      this.page.page = newPage
      // console.log(newPage)
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除改角色吗')
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除成功')
      } catch (err) {
        return
      }
    },
    async compile(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true // 为了不出现闪烁的问题 先获取数据 再弹出层
    },
    async btnCancel() {
      try {
        await this.$refs.roleForm.validate()
        await this.$confirm('确认提交？')

        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('提交成功')
        this.showDialog = false
      } catch (err) {
        this.$message.error('提交失败')
      }
    },
    btnCance() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async assignPerm(id) {
      this.roleId = id
      this.permData = transFormTreeStructure(await getPermissionList(), '0')
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds
      this.showprDialog = true
    },
    async btnPermOK() {
    // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showprDialog = false
    },
    btnPermCancel() {
      this.reset(this.selectCheck)
      this.showprDialog = false
    }
  }

}
</script>

<style>

</style>
