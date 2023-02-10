<template>
  <div>
    <el-row>
      <el-select v-model="currentYear" size="small" style="120px" @change="dataChange">
        <el-option v-for="item in year" :key="item" size="small" style="120px" :label="item" :value="item" />

      </el-select>
      <el-select v-model="currentMonth" @change="dataChange">
        <el-option v-for="item in 12" :key="item" size="small" style="120px" :label="item" :value="item" />
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{ date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(Value) {
      const day = Value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },

  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      year: [],
      currentYear: null,
      currentMonth: null,
      currentDate: null

    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear()
    this.year = Array.from(Array(10), (v, i) => this.currentYear + i - 5)
    this.currentMonth = this.startDate.getMonth() + 1
    this.dataChange()
  },
  methods: {
    dataChange() {
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
    },
    isWeek(data) {
      return data.getDay() === 0
    }

  }
}
</script>

<style scoped>
  /deep/  .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
