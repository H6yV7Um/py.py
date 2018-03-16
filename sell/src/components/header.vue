<template>
  <div style="postion:relative">
    <div class="header">
      <img class="shop-img" :src=avatar alt="">
      <div class="shop-info">
        <div class="shop-title">
          <div class="brand"></div>
          <div class="title">{{shopName}}</div>
          
        </div>
        <div class="shop-peisong">{{description}} /38分钟到达</div>
        <div class="icon" :class="description_icon" ></div>
        <div class="shop-manjian">{{supports_description}}</div><span class="icon-keyboard_arrow_right" v-on:click="showMask"></span>
      </div>
    </div>
    <div class="bar"><div class="gonggao"></div><div class="bulletin">{{bulletin}}</div></div>
    <div class="bg" v-bind:style="{background:'url('+avatar+')'}"></div>
    <v-mask :supports-info="infos" :shop-name="name" :score-fs='score' :bulletin='bulletin' v-show="displayMask"></v-mask>
  </div>

</template>

<script>
import mask from './mask/mask'
export default {
  name: 'header',
  components: {
    'v-mask': mask
  },
  data: function () {
    return {
      name: '粥品香坊（ss大运村)',
      avatar: '',
      description: 'XXX',
      bulletin: '###',
      supports: 'XX',
      score: '',
      displayMask: false
    }
  },
  props: ['supportsInfo', 'shopName', 'scoreFs', 'bulletin'],
  computed: {
    supports_description: function () {
      return this.supports[0].description
    },
    description_icon: function () {
      var type = this.supports[0].type
      return 'icon_' + type
    },
    infos: function () {
      var classMap = {
        icon_0: 'icon_0',
        icon_1: 'icon_1',
        icon_2: 'icon_2',
        icon_3: 'icon_3',
        icon_4: 'icon_4'
      }
      var arr = []     
      for (var i in this.supports) {
        var obj = {}
        var type = this.supports[i].type
        obj.className = classMap['icon_' + type]
        obj.desc = this.supports[i].description
        arr.push(obj)
      }
      return arr
    }
  },
  created: function () {
    this.$http.get('/api/seller').then(response => {
      var _data = response.data.data
      this.name = _data.name
      this.avatar = _data.avatar
      this.description = _data.description
      this.bulletin = _data.bulletin
      this.supports = _data.supports
      this.score = _data.score
    }, response => {
      console.log(response)
      // error callback
    })
  },
  methods: {
    showMask: function () {
      this.displayMask = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon_0{
  background: url('../resource/img/decrease_1@2x.png') no-repeat;
}
.icon_1{
  background: url('../resource/img/discount_2@2x.png') no-repeat;
}
.icon_2{
  background: url('../resource/img/guarantee_2@2x.png') no-repeat;
}
.icon_3{
  background: url('../resource/img/invoice_2@2x.png') no-repeat;
}
.icon_4{
  background: url('../resource/img/special_2@2x.png') no-repeat;
}
.icon-keyboard_arrow_right:before {
  content: "\e905";
}
.header{
  padding: 24px 12px 18px 24px;
  background-size: 100% 100%;
  background-color: rgba(7,17,27,0.5); 
/*  filter: blur(10px);
  z-index: -1;
  -webkit-filter: blur(10px);*/
  color: #fff;

}
.bg{
    height: 126px;
    width: 100%;
    /*background-size: 100% 100%;*/
    /*background-color: rgba(7,17,27,0.5); */
    filter: blur(10px);
    z-index: -1;
    -webkit-filter: blur(10px);
    position: absolute;
    top: 0;
    left: 0;
}
.brand{
  width: 30px;
  height: 18px;
  background: url('../resource/img/brand@2x.png') no-repeat;
  display: inline-block;
  background-size: 100% 100%;
  vertical-align: bottom; 
}
.title{
      display: inline-block;
      margin-left: 6px;
      font-size: 16px;
      line-height: 18px;
      font-weight: bold;
}
.shop-img{
  border-radius: 2px;
  height: 64px;
  width: 64px;
  float: left;
  margin-right: 16px;
}
.icon{
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  background-size: 12px 12px;
  background-repeat: no-repeat;
  vertical-align: bottom;
}
.gonggao{
  display: inline-block;
  width: 22px;
  height: 12px;
  background: url('../resource/img/bulletin@2x.png');
  background-size: 22px 12px;
  background-repeat: no-repeat;
  vertical-align: top;
  margin-top: 7px;
}
.shop-manjian{
  display: inline-block;
  font-size: 10px;
  line-height: 12px;
  font-weight: 200;
}
.shop-peisong{
  font-weight: 200 ;
  line-height: 12px;
  font-size: 12px;
  margin: 8px 0 10px 0;
}
.bar{
  /*box-sizing: border-box;*/
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
  color: #fff;
  background-color: rgba(7,17,27,0.2);
}
.bulletin{
  display: inline-block;
  margin: 0 4px;
  width: 80%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
    font-weight: 200;
  font-size: 10px;
  line-height: 28px;
}
</style>
