<template>
    <div class="detail">
        <div class="datail-wrap" >
            <div class="title">{{shopName}}</div>
            <v-star :score="scoreFs"></v-star>
            <div class="marginTop">
                <hr class="line_m_left"></hr>优惠信息<hr class="line_m_right"></hr>
            </div>
            
            <div class="support">
                <div class="support-item" v-for="iconClass in supportsInfo">
                    <span class="icon" :class="iconClass.className" ></span><span class="text">{{iconClass.desc}}</span>
                </div>
            </div>
            <div class="marginTop">
                <hr class="line_m_left"></hr>商家公告<hr class="line_m_right"></hr>
            </div>
            <div class="bulletin">{{bulletin}}</div>
        </div>
        <div class="detail-close icon-close"></div>
    </div>
</template>
<script type="text/javascript">
import star from '../star/star'

export default{
  data: function () {
    return {
    }
  },
  props: ['supportsInfo', 'shopName', 'scoreFs', 'bulletin'],
  components: {
    'v-star': star
  },
  computed: {
  }

}
</script>
<style type="text/css" scoped>
.bulletin{
    font-weight: 200px;
    font-size: 12px;
    color: #fff;
    line-height: 24px;
}
.marginTop{
    margin-top: 28px;
}
.support-item{
    margin-bottom: 12px;
}
.icon_0{
    background: url('../../resource/img/decrease_1@2x.png') no-repeat;
    background-size: 100% 100%;
}
.icon_1{
    background: url('../../resource/img/discount_1@2x.png') no-repeat;
    background-size: 100% 100%;
}
.icon_2{
    background: url('../../resource/img/guarantee_1@2x.png') no-repeat;
    background-size: 100% 100%; 
}
.icon_3{
    background: url('../../resource/img/invoice_1@2x.png') no-repeat;
    background-size: 100% 100%; 
}
.icon_4{
    background: url('../../resource/img/special_1@2x.png') no-repeat;
    background-size: 100% 100%; 
}
span.icon{
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 6px;
    vertical-align: bottom;
}
span.text{
    display: inline-block;
}
.support{
    margin-top: 24px;
    margin-bottom: 28px;
    margin-left: 36px;
    margin-right: 12px;
    color: #fff;
    font-size: 12px;
    font-weight: 200px;
    line-height: 12px;
}
.datail-wrap{
  min-height: 80%;
  padding-bottom: 64px;
}
/*.datail-wrap:after{
    content: '';
    display: table;
    clear: both;
}*/
.detail-close{
  /*clear: both;*/
  margin: -64px auto 0 auto;
 /* position: relative;*/
  height: 32px;
  width: 32px;
  color: rgba(255,255,255,0.5);
}
.title{
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    line-height: 16px;
    margin: 64px auto 16px;
    width: 160px;
}

.line_m_left{
    width: 122px;
    display: inline-block;
    margin-left: 36px;
    margin-right: 12px;
    vertical-align: bottom
}
.line_m_right{
    width: 122px;
    display: inline-block;
    margin-left: 12px;
    margin-right: 36px;
    vertical-align: bottom
}
.detail{
    color: #fff;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(7,17,27,0.8);

}

</style>