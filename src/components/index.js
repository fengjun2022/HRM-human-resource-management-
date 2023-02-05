import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
// import Vue from 'vue'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
