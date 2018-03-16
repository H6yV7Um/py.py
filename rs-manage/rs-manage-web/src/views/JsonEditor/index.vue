<template>
  <div class="components-container" style='height:100vh'>
  
    <div class="editor-container">
      <json-editor ref="jsonEditor" v-model="value"></json-editor>
    </div>
  </div>
</template>

<script>
import jsonEditor from '@/components/jsonEditor'
const jsonData = '{"mainCreatives":[{"creativeTemplateId":111,"deviceType":2,"creativeType":0,"creativeTypeMessageName":"text","creativeTypeMessageClass":"TextCreative","text":{"material":{"creativeName":"text_with_icon_material","creativeTitle":"记录儿时成长的点点滴滴记录儿时成长的点点滴滴","creativeDesc1":"用动态影像给我们留下美好的回忆,把您孩子 儿时稚嫩的声音与天真无邪的笑","creativeDesc2":""},"action":{"actionType":4,"actionTypeMessageName":"forward","actionTypeMessageClass":"ForwardAction","forward":{"mobileClickLink":"www.mobile.baidu.com","targetPage":"www.baidu.com","monitorLinks":["www.winnotice.baidu.com","www.baidu.com"],"clickLink":{"clickLink":"http://www.baidu.com/cpro.php?","antiCheating":123456}}},"additionalAction":[{"actionType":6,"actionTypeMessageName":"phone","actionTypeMessageClass":"PhoneAction","phone":{"phoneNumber":"400-123-456","traceUrl":"http://www.hao123.com"}}]}},{"creativeTemplateId":111,"deviceType":2,"creativeType":0,"creativeTypeMessageName":"text","creativeTypeMessageClass":"TextCreative","text":{"material":{"creativeName":"text_with_icon_material","creativeTitle":"记录儿时成长的点点滴滴记录儿时成长的点点滴滴","creativeDesc1":"用动态影像给我们留下美好的回忆,把您孩子 儿时稚嫩的声音与天真无邪的笑","creativeDesc2":""},"action":{"actionType":4,"actionTypeMessageName":"forward","actionTypeMessageClass":"ForwardAction","forward":{"mobileClickLink":"www.mobile.baidu.com","targetPage":"www.baidu.com","monitorLinks":["www.winnotice.baidu.com","www.baidu.com"],"clickLink":{"clickLink":"http://www.baidu.com/cpro.php?","antiCheating":123456}}},"additionalAction":[{"actionType":4,"actionTypeMessageName":"forward","actionTypeMessageClass":"ForwardAction","forward":{"mobileClickLink":"www.mobile.baidu.com","targetPage":"www.baidu.com","monitorLinks":["www.winnotice.baidu.com","www.baidu.com"],"clickLink":{"clickLink":"http://www.baidu.com/cpro.php?","antiCheating":123456}}}]}}]}'

export default {
  components: { jsonEditor },
  data() {
    return {
      value: JSON.parse(jsonData)
    }
  }
}
</script>

<style scoped>
.editor-container{
  position: relative;
  height: 100%;
}
.editor-container .CodeMirror {
  height: 100%!important;
}

code {
  background: #eef1f6;
  padding: 15px 10px;
  margin-bottom: 20px;
  display: block;
  line-height: 36px;
  a {
    color: #337ab7;
    cursor: pointer;
    &:hover {
      color: rgb(32, 160, 255);
    }
  }
}

</style>

