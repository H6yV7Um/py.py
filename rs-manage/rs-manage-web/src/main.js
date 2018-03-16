/**
 * @fileOverview main.js
 * @description  入口文件
 * @author [author]liuboying@baidu.com
 */
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router';
import routes from './router'
Vue.use(ElementUI);
Vue.use(VueRouter);
// 通过 router 配置参数注入路由
const router = new VueRouter({
    routes
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});
