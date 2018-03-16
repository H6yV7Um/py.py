<template>
<div class="tab" id="tab">
	<div class="tab-item">
		<router-link :to="{ path: '/goods' }" >商品</router-link>
	</div>
	<div class="tab-item">评价</div>
	<div class="tab-item">商家</div>
	<router-view></router-view>
</div>

</template>


<script>
export default {
  name: 'tab'
}
</script>


<style>
	.tab{
		display:flex;
		height: 40px;
		width: 100%;
		line-height: 40px;
	}
	.tab-item{
		flex:1;
		text-align: center;
		font-size: 14px;
		color: rgb(77,85,93);
		border-bottom: 1px solid rgba(7,17,27,0.1);
	}
</style>