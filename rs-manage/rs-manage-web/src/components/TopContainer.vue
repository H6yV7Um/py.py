<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="模板列表" name="first">
      <Templatelists></Templatelists>
    </el-tab-pane>
    <el-tab-pane label="点击量" name="second">
      <clickRate></clickRate>
    </el-tab-pane>
    <el-tab-pane label="性能指标" name="third">
      <TemplatePerformance></TemplatePerformance>
   </el-tab-pane>
  </el-tabs>
</template>
<script>
import Templatelists from '@/components/Templatelists'
import TemplatePerformance from '@/components/TemplatePerformance'
import clickRate from '@/components/clickRate'
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    components: {
      Templatelists,
      clickRate,
      TemplatePerformance
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>