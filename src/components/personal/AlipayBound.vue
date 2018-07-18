<template>
	<div class="personPop">
		<!--绑定的支付宝信息-->
		<div class="popcontent">
			<div class="title">
				<span>
					<icon name="ZFB" scale="6"></icon>
				</span>
				<em>绑定支付宝</em>
				<i @click="closePop">&times;</i>
			</div>
			<div v-show="!alipayCodeShow" @keyup.enter="goAlipayBound" class="center">
				<p>收款人支付宝账号：<span class="red">{{alipayData.account}}</span></p>
				<p>公司名称：<span class="red">{{alipayData.name}}</span></p>
				<p>&nbsp;</p>
				<p style="font-weight:900;">绑定您的支付宝账号：</p>
				<p>充值金额：<span class="red">{{randomMoney}}</span></p>
				<div>
					<label for="mobile">支付宝姓名</label>
					<i></i>
					<input v-model="alipayName" />
				</div>
				<div>
					<label for="mobile">支付宝账号</label>
					<i></i>
					<input v-model="alipayNum" />
				</div>
				<button @click="goAlipayBound">下一步</button>
			</div>
			<!--付款码-->
			<div v-show="alipayCodeShow">
				<div id='qrCodeDiv'>
				</div>
				<p style="text-align:center;padding-top:20px;">请扫以上二维码 , 完成转账<span class='red' style='font-weight:900;'> {{randomMoney}} </span>元 , 用于绑定</p>
			</div>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue';
	import { APIS } from '../../utils/apis.js';
	import QRCode from 'qrcodejs2';
	let vm;
	
	export default {
		data() {
			return {
				alipayCodeShow:false,
				randomMoney:"",
				alipayData:{},
				alipayName:"",
				alipayNum:"",
				spreadUrl:"",
				
			}
		},
		components: {
			Icon
		},
		mounted() {
			vm = this;
			
		},
		methods: {
			//获取随机充值金额
			getRandomMoney(){
				let random = Math.random().toFixed(2);
	    		if(random.lastIndexOf('0') == 3){
	    			vm.getRandomMoney()
	    		}else{
	    			vm.randomMoney = random
	    		}
			},
			//支付宝信息
			rechargeSetAlipay(){
				APIS.rechargeSetAlipay(function(res){
//					console.log(res)
					if(res.code == 0){
						vm.alipayData = res.data
					}
				})
			},
			//去绑定支付宝
  			goAlipayBound(){
  				APIS.goAlipayBound(vm.randomMoney,vm.alipayName,vm.alipayNum,function(res){
//					console.log(res)
  					if(res.code == 0){
  						vm.alipayCodeShow = true
  						vm.alipayBoundCode()
      				}else if(res.code == 600){
      					layer.msg('请完善转账信息')
      				} else {
      					layer.msg(res.msg)
      				}
  				})
  			},
  			//获取付款码
  			alipayBoundCode(){
				APIS.alipayBoundCode('pay',function(res){
//		    		console.log(res)
		    		if(res.code != 0){
		    			layer.msg('当前排队人数较多,请稍候绑定',function(){
		    				vm.qrcodeShow = false
		    			})
		    			return
		    		}
		    		vm.spreadUrl = res.data
		    		vm.getQart()
		      	})
			},
	  		//生成二维码
		    getQart() {
//		    	console.log($("#qrCodeDiv")[0])
		        let qrcode = new QRCode($("#qrCodeDiv")[0], {
		            width : 200,//设置宽高
		            height : 200
		        });
		        qrcode.makeCode(vm.spreadUrl);
		    },
		    //关闭弹框
			closePop(){
				vm.$parent.popType = ""
				vm.alipayCodeShow=false;
				vm.randomMoney="";
				vm.alipayData={};
				vm.alipayName="";
				vm.alipayNum="";
				vm.spreadUrl="";
			},
		},
	}
	
</script>
<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/personPop.css";
	.popcontent .center div label{
		width:110px;
	}
	.popcontent .center div input{
		width:calc(100% - 115px);
	}
	#qrCodeDiv{
		width:200px;
		height:200px;
		margin:40px auto;
	}
</style>