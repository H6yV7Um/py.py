<template>
	<el-row>
	<!--左侧编辑区域begin-->
	  <el-col :span="12">
	  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
	    <el-form-item label="标题" prop="title">
	      <el-input v-model="ruleForm.title"></el-input>
	    </el-form-item>
	    <el-form-item label="描述" prop="desc">
	      <el-input type="textarea" v-model="ruleForm.desc"></el-input>
	    </el-form-item>

        <el-form-item label="宽度" prop="width">
	      <el-slider
	           v-model="ruleForm.width"
	           show-input>
	      </el-slider>
	    </el-form-item>
	     <el-form-item label="高度" prop="height">
	       <el-slider
	           v-model="ruleForm.height"
	           show-input>
	      </el-slider>
	    </el-form-item>


	    <el-form-item label="尺寸类型" prop="SizeInfo">
	      <el-radio-group v-model="ruleForm.SizeInfo">
	        <el-radio label="无"></el-radio>
	        <el-radio label="像素"></el-radio>
	        <el-radio label="比例"></el-radio>
	        <el-radio label="自适应宽度,通栏"></el-radio>
	        <el-radio label="全屏,开屏类"></el-radio>
	      </el-radio-group>
	    </el-form-item>

	    <el-form-item>
	      <el-button type="primary" @click="submitForm('ruleForm')">预览</el-button>
	      <el-button @click="resetForm('ruleForm')">重置</el-button>
	    </el-form-item>
	  </el-form>
	  </el-col>
	  <!--左侧编辑区域end-->
	  <!--右侧展示区域begin-->
	  <el-col :span="12">
		  <div class="radio-wrapper">
		  		<el-radio v-model="radio" label="wap">wap</el-radio>
		  	    <el-radio v-model="radio" label="pc">pc</el-radio>
		  </div>
	  	  
        <div class="unit-preview">
        	<div class="p-content">
        		<iframe src="../../static/html/test.html" id="ad-container">
        			<!-- <img src="">
        			<div class="title" v-model="adTitle">标题</div>
        			<div class="desc" v-model="adDesc">描述</div> -->

        		</iframe>
        	</div>
  	
        </div>
      </el-col>
      <!--右侧展示区域end-->
    </el-row>
</template>
<script>
// import test from 'static/html/test.html'
export default {
  data: function() {
  	return {
  		radio:'wap',
  		adTitle:'',
  		adDesc:'',
  		ruleForm: {
  			    width: 0,
  			    height:0,
  		        title: '',
  		        delivery: false,
  		        type: [],
  		        SizeInfo: '',
  		        desc: ''
  		      },
  		      rules: {
  		        title: [
  		          { required: true, message: '请输入标题', trigger: 'blur' }
  		        ],
  		        desc: [
  		          { required: true, message: '请填写描述', trigger: 'blur' }
  		        ]
  		      }

  	}
  },
mounted: function() {


},
  methods: {
  	submitForm(formName) {
  	       this.$refs[formName].validate((valid) => {
  	         if (valid) {
  	           alert('submit!');
  	         } else {
  	           console.log('error submit!!');
  	           return false;
  	         }
  	       });
  	     },
  	     resetForm(formName) {
  	       this.$refs[formName].resetFields();
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
</style>