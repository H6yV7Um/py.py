<template>
	<el-row>
	<!--左侧编辑区域begin-->
	  <el-col :span="12">

    <!--模板列表begin-->
     <el-row>
       <el-col :span="8" v-for="(o, index) in totalData" :key="o" :offset="index > 0 ? 2 : 0">
         <el-card :body-style="{ padding: '0px' }">
           <img src="http://element.eleme.io/2.0/static/hamburger.50e4091.png" class="image">
           <div style="padding: 14px;">
             <span>{{ o.id }}模板</span>
             <div class="bottom clearfix">
               <time class="time">{{ o.updatetime }}</time>
               <el-button type="text" class="button" @click="dialogFormVisible = true">编辑请求串</el-button>
             <el-dialog title="请求串mock数据" :visible.sync="dialogFormVisible">
               <el-form :model="form">
                 <jsonEditor></jsonEditor>
               </el-form>
               <div slot="footer" class="dialog-footer">
                 <el-button @click="dialogFormVisible = false">取 消</el-button>
                 <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
               </div>
             </el-dialog>
             </div>
           </div>
         </el-card>
       </el-col>
       </el-row>
     <!--模板列表end-->
     <!--模板详情begin-->
    <el-table
       :data="totalData"
       style="width: 100%">
       <el-table-column type="expand">
         <template scope="props">
           <el-form label-position="left" inline class="demo-table-expand">
             <el-form-item label="样式ID">
               <span>{{ props.row.styleId }}</span>
             </el-form-item>
             <el-form-item label="模板名称">
               <span>{{ props.row.name }}</span>
             </el-form-item>
             <el-form-item label="sizeType">
               <span>{{ props.row.sizeType }}</span>
             </el-form-item>
             <el-form-item label="valueType">
               <span>{{ props.row.valueType }}</span>
             </el-form-item>
             <el-form-item label="width">
               <span>{{ props.row.width }}</span>
             </el-form-item>
             <el-form-item label="widthEnd">
               <span>{{ props.row.widthEnd }}</span>
             </el-form-item>
             <el-form-item label="height">
               <span>{{ props.row.height }}</span>
             </el-form-item>
             <el-form-item label="heightEnd">
               <span>{{ props.row.heightEnd }}</span>
             </el-form-item>
             <el-form-item label="scale">
               <span>{{ props.row.scale }}</span>
             </el-form-item>
             <el-form-item label="scaleEnd">
               <span>{{ props.row.scaleEnd }}</span>
             </el-form-item>
           </el-form>
         </template>
       </el-table-column>
       <el-table-column
         label="模板 ID"
         prop="id">
       </el-table-column>
       <el-table-column
         label="模板名称"
         prop="name">
       </el-table-column>
     </el-table>
       <!--模板详情end-->
       <!---->
       

	  </el-col>
	  <!--左侧编辑区域end-->
	  <!--右侧展示区域begin-->
	  <el-col :span="12">	  
        <div class="unit-preview">
        	<div class="p-content">
        		<iframe src="../../static/html/test.html" id="ad-container">
        		</iframe>
        	</div>
  	
        </div>
      </el-col>
      <!--右侧展示区域end-->
    </el-row>
</template>
<script>
import axios from 'axios';
import api from '@/api/api';
import jsonEditor from '@/components/JsonEditor';
export default {
  data: function() {
  	return {
      totalData: [],
      tplNum: 0,
  		radio: 'wap',
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px'
  	}
  },
  components: {
     jsonEditor
  },
  mounted: function() {
    //  获取模板详情
     this.getData();
  },
  methods: {
    getData() {
      let self = this;
      axios.get(api.templatelist).then(function(response) {
          // 接口返回的全部数据       
          self.totalData = response.data.data;
          // 数据长度
          self.tplNum = self.totalData.length;
       });

    },
  	editJson() {

  	     
  	}
  }
}
</script>
<style type="scss">
.el-input{
	width: 100%;
}
.radio-wrapper{
	width: 299px;
    margin: 0 auto 15px auto;
}
.unit-preview {
    width: 299px;
    height: 445px;
    margin: 0 auto 15px auto;
    background: url(../assets/phone_bg.png) no-repeat;
    background-size: 100% 100%;
    padding: 70px 15px 81px 22px; 
}
.p-content {
	height: 100%;
	min-width: 100%;
	overflow: hidden;
	position: relative;
}
.ad-container{
	position: relative;
	overflow: hidden;
	height: 154px;
	width: 100%;
	.title{
		font-size: 14px;
	}

}
/*模板卡片样式*/
.time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  /**/
    .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>