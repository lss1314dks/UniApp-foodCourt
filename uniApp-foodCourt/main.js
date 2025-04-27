import App from './App'
import  * as Pinia from 'pinia';
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import './interceptor.js'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  // app.use(Pinia.createPinia());
  // app.use(ElementPlus, { locale })
  return {
    app
  }
}
// #endif