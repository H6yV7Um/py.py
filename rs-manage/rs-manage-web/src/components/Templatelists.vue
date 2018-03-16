<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
  <el-form-item label="">
    <el-input v-model="templateID" placeholder="请输入模板ID"></el-input>
  </el-form-item>
  <el-form-item label="">
    <el-select v-model="dspType" placeholder="dsp类别">
      <el-option label="百意" value="1"></el-option>
      <el-option label="线索通" value="2"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="">
    <el-select v-model="flowType" placeholder="流量类型">
      <el-option label="pc" value="pc"></el-option>
      <el-option label="wap" value="wap"></el-option>
      <el-option label="app" value="app"></el-option>
    </el-select>
  </el-form-item>
 <el-form-item label="">
    <el-select v-model="creativeType" placeholder="创意类型">
      <el-option label="文本" value="text"></el-option>
      <el-option label="图文" value="pictext"></el-option>
      <el-option label="图片" value="pic"></el-option>
      <el-option label="video" value="video"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="">
  <el-checkbox v-model="checked">信息流模板</el-checkbox>
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="onSubmit">查询</el-button>
  </el-form-item>
</el-form>

  <el-table
  class = "table"
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="样式ID"
      width="100">
    </el-table-column>

    <el-table-column
      prop="name"
      label="模板描述"
      width="220">
    </el-table-column>
 
    <el-table-column
      label="查看详情"
      width="120">
      <template scope="scope">
        <el-popover
          ref="popover"
          placement="right"
          width="400"
          trigger="click">
          <div v-model='requestInfo'>{{requestInfo}}</div>
        </el-popover>

        <!-- <el-button type="text"  v-popover:popover @click="requestInfo33" size="small">查看</el-button> -->
        <el-button type="text" size="small"><router-link to="/preview">预览</router-link></el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="dsp类别"
      prop="dspId"
      width="120">
    </el-table-column>
   <el-table-column
      label="流量类型"
      prop="flowType"
      width="120">
    </el-table-column>
    <el-table-column
      label="创意类型"
      prop="creativeType"
      width="120">
    </el-table-column>
    <el-table-column
      label="信息流模板"
      prop="isFeed"
      width="120">
    </el-table-column>
    <el-table-column
      prop="updatetime"
      label="更新时间"
      width="120">
    </el-table-column>
     <el-table-column
     prop="author"
      label="操作人"
      width="100">
    </el-table-column>
  </el-table>

  <el-footer class="block">
  <span class="demonstration"></span>
  <el-pagination
    layout="prev, pager, next"
    :page-size="filter.pageSize"
    :current-page="filter.currentPage"
    :total="total"
    @current-change="pageChange" 
    >
  </el-pagination>
  </el-footer>
</div>
</template>

<script>
import axios from 'axios';
import api from '@/api/api'
  export default {
    data: function(){
      return {
        dspType: '',
        flowType: '',
        creativeType:'',
        checked: false,
        templateID: '', //模板ID
        requestInfo: '',
        totalData:[],//总数据缓存列表
        tableData: [], // 当前展示数据
        total: 0, // 数据总长度
        filter: {
          pageSize:10, // 页大小
          currentPage: 1, // 当前页
        }
      }
    },
    mounted: function(){
      this.getData(); 
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      // 搜索
      handleIconClick() {
        let len = this.totalData.length;
        for (let i = 0 ; i < len; i++) {
          let  _id = this.totalData[i].id;

          if(this.templateID === _id) {
            let index = i;
             this.tableData = this.totalData.slice(i, i+1);
             this.total = 1
          }
          if(this.templateID === ''){
            this.getData()

          }

        }

      },
      // 获取当前页数据
      getData() {
        let self = this;
        axios.get(api.stylelist).then(function(response) {
            // 接口返回的全部数据       
            self.totalData = response.data;
            // 数据长度
            self.total = self.totalData.data.length;
            // 当前页展示数据
            self.tableData = self.totalData.data.slice(0, self.filter.pageSize);
                // return response
         });
      },
      // 翻页触发
      pageChange(val) {
        // 传入参数为当前页码
        this.filter.currentPage = val;
        // 数据开始索引
        let FromIndex = this.filter.pageSize * (val - 1);
        // 结束索引
        let EndIdex = FromIndex + this.filter.pageSize;
        // 页面展示数据      
        this.tableData = this.totalData.data.slice(FromIndex, EndIdex);

      },
      // 预览
      // priview() {
      //   window.open('http://' + location.hostname + ':8123/api/8?mockFile=%2FUsers%2Fliuboying%2Frs%2Fcache%2Ftemplate%2F10001%2Frequest%2F10001.js')
      // },
      // 查看请求接口
      // requestInfo33() {
      //   let self = this;
      //   let id = 10001;
      //   axios.get('http://' + location.hostname + ':3000/requestInfo?id=10001').then(function(response){
      //     console.log('requestInfo====' + response.data);
      //     self.requestInfo = response.data;
      //   })
      // }
    }
  }
</script>
<style type="text/css">
.search{
  width: 300px;
  margin: 20px 20px;
  float: left;
}
  .block{
    margin: 20px 0;
    text-align: center;
  }
</style>