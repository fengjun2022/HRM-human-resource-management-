<template>
  <div>
    <el-dialog :title="showTitle" :before-close="unpopover" :visible="showDialog" :destroy-on-close="true" :close-on-click-modal="false">
      <el-form ref="depForm" :model="formData" label-width="120px" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" autocomplete="off" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" autocomplete="off" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="formData.manager" placeholder="请选择" style="width:80%" @focus=" getEmployeeSimple">
            <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />

          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" autocomplete="off" style="width:80%" placeholder="20-300个字符" :rows="3" type="textarea" resize="none" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unpopover">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addDepartments, getDepartDetail, getDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      require: true,
      type: Boolean
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = () => {
      // 新增部门
      return async(rule, value, callback) => {
        const { depts } = await getDepartments()
        let isRepeat = false
        if (this.formData.id) {
        // 编辑需求同级部门中不能有同名
        // 编辑部门
          isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.formData.id).some(item => item.name === value)
        } else {
          isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
        }
        isRepeat ? callback(new Error(`同级部门下已经存在该${value}部门`)) : callback()
      }
    }
    const checkCodeRepeat = () => {
      return async(rule, value, callback) => {
        const { depts } = await getDepartments()
        let isRepeat = false
        if (this.formData.id) {
        // 需求 当前除了自己以外不能有相同的编码
        // 编辑编码
          isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
        } else {
          isRepeat = depts.some(item => item.code === value && value)
        }
        isRepeat ? callback(`组织架构中已经有部门使用${value}编码`) : callback('')
      }
    }
    return {
      formData: {
        name: '', // 部门名称taoz
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },

      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }, { min: 1, max: 50, message: '请输入1-50个字符' }, {
          trigger: 'blur',
          validator: checkNameRepeat()
        }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }, { min: 1, max: 50, message: '请输入1-50个字符' }, {
          trigger: 'blur',
          validator: checkCodeRepeat()
        }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, { min: 5, max: 300, message: '请输入20-300个字符' }]

      },
      peoples: []

    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },

  methods: {
    unpopover() {
      this.$emit('update:showDialog', false)
      this.formData = {
        name: '', // 部门名称taoz
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$refs.depForm.resetFields()
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    btnOk() {
      this.$refs.depForm.validate(async isOk => {
        if (isOk) {
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
          this.$emit('addDepts')
          this.unpopover()
        }
      })
    },
    async  getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }

  }
}
</script>

<style>

</style>
