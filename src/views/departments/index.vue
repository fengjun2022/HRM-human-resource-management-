<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <Structure
          :tree-node="company"
          :is-root="true"
          style="margin-bottom: 40px;"
          @AddPop="AddPop"
        ><h3>{{ company.name }}</h3></Structure>
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <Structure slot-scope="{ data }" :tree-node="data" @AddPop="AddPop" @delDepts="delDepts" />
        </el-tree>
      </el-card>
    </div>
    <treePop ref="treePop" :show-dialog.sync="showDialog" :tree-node="node" @unpopover="unpopover" @addDepts="getDepartments" />

  </div>
</template>

<script>
import Structure from './commponents/tree-structure.vue'
import treePop from './commponents/tree-pop.vue'
import { getDepartments } from '@/api/departments'
import { transFormTreeStructure } from '@/utils/index'

export default {
  components: {

    Structure,
    treePop
  },
  data() {
    return {
      company: { },
      departs: [],
      defaultProps: {
        label: 'name'
      },
      showDialog: false,
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = transFormTreeStructure(result.depts, '')
      // console.log(this.departs)
    },
    AddPop(node, flag = false) {
      this.showDialog = true
      this.node = node
      if (flag) {
        this.$refs.treePop.getDepartDetail(node.id)
      }
    },
    unpopover() {
      this.showDialog = false
    },
    delDepts() {
      this.getDepartments()
    }

  }
}
</script>

<style>
.tree-card{
padding: 30px 140px;
font-size: 14px;
}

</style>
