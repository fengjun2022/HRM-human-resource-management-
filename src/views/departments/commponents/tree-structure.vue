<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <slot>{{ treeNode.name }}</slot>
    </el-col>

    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="EditorialDepartment">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delDepartments">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>

  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {

  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    // delDepartments(id) {
    //   this.$emit('delDepartments', id)
    // }
    async   handleCommand(type) {
      if (type === 'EditorialDepartment') {
      // 编辑部门
        const flag = true
        this.$emit('AddPop', this.treeNode, flag)
      } else if (type === 'delDepartments') {
        // 删除部门
        await this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('delDepts')
        })
      } else {
      // 添加部门
        this.$emit('AddPop', this.treeNode)
      }
    }

  }

}
</script>

<style >

</style>
