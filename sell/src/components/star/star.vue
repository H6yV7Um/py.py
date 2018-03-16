<template>
	<div class="star">
                <div :class="itemClass" v-for="itemClass in itemClasses" ></div>
                {{score}}
    </div>
</template>
<style>
.star{
    margin-top: 16px;
    margin-bottom: 28px;
    height: 24px;
    margin: 0 auto;
    width: 160px;
    position: relative;
}
.star-img-off{
    background: url('../../resource/img/star24_off@2x.png') no-repeat;
    height: 24px;
    width: 24px;
    display: inline-block;
    
}
.star-on-wrap{
    position: absolute;
    top: 0;
}
.star-img-half{
   background: url('../../resource/img/star24_half@2x.png') no-repeat;
   height: 24px;
   width: 24px;
   display: inline-block; 
}
.star-img-on{
    background: url('../../resource/img/star24_on@2x.png') no-repeat;
    height: 24px;
    width: 24px;
    display: inline-block;
   
}	


</style>
<script>
const CLASS_ON = 'star-img-on'
const CLASS_HALF = 'star-img-half'
const CLASS_OFF = 'star-img-off'
const num = 5
export default{
	props: ['score'],
	computed: {
	   itemClasses: function () {
	       var result = []
	       var interger = Math.floor(this.score)
	       var hasDecimal = this.scoreFs % 1 !==0
	       for (var i = 0 ; i < interger; i++) {
	           result.push(CLASS_ON);
	       }
	       if (hasDecimal) {
	           result.push(CLASS_HALF)
	       }
	       while (result.length<num) {
	           result.push(CLASS_OFF)
	       }
	       return result
	   }
	 }
}
	


</script>