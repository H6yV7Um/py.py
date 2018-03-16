// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import Goods from './components/goods/good'

/* eslint-disable no-new */
Vue.use(VueRouter)
var VueResource = require('vue-resource')
Vue.use(VueResource)

const router = new VueRouter({
  routes: [
    {
      path: '/goods', component: Goods
    }]
})
new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
