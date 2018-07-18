<template>
  <div class='footContainer'>
  	<div class="contWidth">
  		<div class="footer_left">
    		<dl>
    			<router-link to="serve?type=1" tag="dd">新手指引</router-link>
    			<router-link to="serve?type=0" tag="dd">常见问题</router-link>
    			<router-link to="serve?type=4" tag="dd">平台公告</router-link>
    			<router-link to="serve?type=2" tag="dd">安全保障</router-link>
    			<router-link to="money" tag="dd">充值中心</router-link>
    			<router-link to="serve?type=3" tag="dd">相关协议</router-link>
    		</dl>
    		<p v-html="commonInfo.bottomContent">
    		</p>
    	</div>
    	<div class="footer_right">
    		<p>服务热线</p>
    		<p><strong>{{commonInfo.tel}}</strong></p>
    	</div>
  	</div>
  </div>
</template>

<script>
	import { APIS } from '../../utils/apis.js';
	let vm;
	
 	export default{
		data(){
			return{
				commonInfo:{}
			}
		},
		mounted(){
			vm = this;
			this.getCommon()
		},
		methods:{
			// 获取网站公共信息接口
			getCommon() {
				APIS.getCommon(function(res){
					if(res.code ==0){
						vm.commonInfo = res.data
					}
				})
			},
		}
	}
</script>

<style scoped>
	.contWidth{
		margin: 0 auto;
		display: block;
		min-width: 1200px;
		width: 66%;
	}

	.footContainer{
		display: block;
		width: 100%;
		height: 360px;
		background: #3b3b3b;
		padding-top: 40px;
		color: #fff;
	}
	.footer_left{
		float: left;
	}
	.footer_right{
		float: right;
	}
	.footer_left dl{
		display: block;
		height: 40px;
	}
	.footer_left dl dd{
		float: left;
		font-size: 14px;
		margin-right: 20px;
		padding-bottom: 4px;
		cursor: pointer;
	}
	.footer_left dl dd:hover{
		border-bottom: 1px solid #fff;
	}
	.footer_left p{
		font-size: 14px;
		line-height: 24px;
		text-align: left;
	}
	.footer_right p{
		text-align: right;
		font-size: 16px;
	}
	.footer_right p strong{
		font-size: 24px;
	}
</style>
