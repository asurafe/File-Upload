import Vue from 'vue'
import App from './App.vue'
// 引入iconfont图标
import "@/assets/icon/iconfont.css"
// 引入初始化项目css
import './assets/reset.css'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
