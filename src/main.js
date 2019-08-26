// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import store from './store'
import App from './App'
import vueTap from 'vue-js-tap'
import { ToastPlugin, ConfirmPlugin, LoadingPlugin, Confirm } from 'vux'

Vue.use(VueRouter)
Vue.use(vueTap)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(Confirm)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
