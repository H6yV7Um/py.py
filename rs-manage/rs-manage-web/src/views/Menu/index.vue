<template>
    <el-container>
       <div class="content">
         <el-aside class="left-aside bg-purple" style="width:15%;" >
          <div class="title"><i class="el-icon-menu"></i>&nbsp;网盟广告模板系统</div>
             <el-menu default-active="baiyiStyle" theme="" unique-opened router  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
              <el-menu-item index="baiyiStyle"><i class="el-icon-document"></i>样式管理</el-menu-item>
              <el-menu-item index="404"><i class="el-icon-news"></i>实验管理</el-menu-item>
              <el-menu-item index="401"><i class="el-icon-picture"></i>监控数据</el-menu-item>
              <el-menu-item index="401"><i class="el-icon-setting"></i>用户管理</el-menu-item>
              <el-menu-item index="404"><i class="el-icon-edit-outline"></i>意见反馈</el-menu-item>
             </el-menu>
         </el-aside>
         <!--右侧展示区begin-->
         <el-container style="width:85%;">
         <div class="right-content bg-purple-light">
          <el-header class="bg-purple">
            <div class="user">userName <i class="el-icon-more"></i></div>
          </el-header>
          <el-main>
            <router-view></router-view>
          </el-main>
         </div>
       </el-container>
         <!--右侧展示区end-->
       </div>
    </el-container>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
}
</script>

<style scoped>
.title{
  font-size: 16px;
  color: #fff;
  font-weight: 700;
  width: 100%;
  height: 100px;
  line-height: 100px
}
header{
  height: 60px;
  padding-right:20px;

}
.user{
  height: 100%;
  line-height: 60px;
  float: right;
}
.bg-purple-dark {
  height: 100px;
  background: #99a9bf;
  
}
 .bg-purple{
    background-color: rgba(46, 62, 78, 0.98);
    color: #fff;
  }
.content{
/*  position: absolute;*/
  width: 100%;
  height:100%;
  display: flex;

}
.left-aside{
  width: 15%;
  height: 100%;
}
.right-content{
  flex:1;
  width:85%;
}
</style>
