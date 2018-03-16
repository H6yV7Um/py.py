/**
 * @fileOverview
 * @description  路由配置文件
 * @author liuboying@baidu.com 
 */
import Menu from '@/views/Menu'
import Templatelists from '@/components/Templatelists'
import jsonEditor from '@/views/JsonEditor'
import errorPage404 from '@/views/errorPage/404.vue'
import errorPage401 from '@/views/errorPage/401.vue'
import preview from '@/components/Preview'

const routes = [
    {
      path: '/',
      name: 'Menu',
      redirect: '/baiyiStyle',
      component: Menu,
      children: [
        { path: 'baiyiStyle', component: Templatelists},
        { path: '404', component: errorPage404},
        { path: '401', component: errorPage401}
      ]
    }
];
export default routes;
