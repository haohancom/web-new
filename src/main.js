import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.css'
import ElementUI from 'element-ui';
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
console.log('999');
Vue.use(VXETable)

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
