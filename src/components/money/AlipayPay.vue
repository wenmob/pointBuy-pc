<template>
	<div class="aliayPay">
		<div class="myaccount_bar">
			<p>收款人支付宝账号：<span>{{rechargePay.account}}</span></p>
			<p>公司名称：<span>{{rechargePay.name}}</span></p>
		</div>
		<div class="myaccount_bar2">
			<p>
				手机支付宝扫一扫，快速转账，
				<span>{{$parent.typeSupport.AlipayFee}}{{$parent.typeSupport.AlipayFee == 0 ? '' : '%'}}</span><!--TODO-->
				手续费
			</p>
			<div class="boundDiv">
				<!--已绑定支付宝-->
				<div v-if="hasBound" id="boundCode"></div>
				<!--未绑定支付宝-->
				<router-link v-if="!hasBound" to="user?index=2&type=alipay" tag="button" class="btn btn-default btn-lg">您还未绑定支付宝,请点击绑定</router-link>
			</div>
			<p>如果您的资金没有到账，打开支付宝，复制您的转账记录里的订单号，<span @click="orderSchedule">点击查询</span>确认您的转账进度 以上都无法完成转账，您可拨打客服热线，<b>544</b> 确认您的转账进度</p>
		</div>
	</div>
</template>



<script>
	import { APIS } from '../../utils/apis.js';
	import QRCode from 'qrcodejs2';
	let vm;
	export default{
		data(){
			return{
				hasBound:false,
				rechargePay:{},
				aliPayUnfo:{},
				payType:'pay',
			}
		},
		mounted(){
			vm = this;
			vm.rechargeSetAlipay()
			vm.checkAlipayBound()
		},
		methods:{
			//支付宝转账信息
			rechargeSetAlipay(){
				APIS.rechargeSetAlipay(function(res){
//					console.log(res)
					if(res.code == 0){
						vm.rechargePay = res.data
					}
				})
			},
			//判断是否绑定支付宝
  			checkAlipayBound(){
  				APIS.checkAlipayBound(function(res){
//					console.log(res)
					if(res.code == 700){
						vm.hasBound = false
		      		}else{
		      			vm.aliPayUnfo = res.data
		      			vm.hasBound = true
		      			vm.alipayBoundCode()
		      		}
				})
  			},
  			//获取付款码
 			alipayBoundCode(){
 				APIS.alipayBoundCode(vm.payType,function(res) {
// 					console.log(res)
 					if(res.code == 0){
// 						vm.spreadUrl = res.data
 						vm._getQart(res.data,"boundCode")
 					}
 				})
 			},
 			//生成二维码
		    _getQart(spreadUrl,dom) {
		        let qrcode = new QRCode(document.getElementById(dom), {
		            width : 200,//设置宽高
		            height : 200
		        });
		        qrcode.makeCode(spreadUrl);
		    },
		    //点击查询转账进度
  			orderSchedule(){
  				layer.prompt(
  					{title:'请输入您要查询的订单号 '},
  					function(val, index){
  						/*判断支付宝订单号不为空才可以关闭*/
  						for(var item of val){
  							if(item == ' '){
  								val = val.replace(item,'')
  							}
  						}
  						if(val.length > 0){
  							APIS.checkAlipayNofee(val,function(res){
  								if(res.code == 0){
  									layer.close(index);
									layer.msg('充值已到账',function(){
										vm.$router.push('user')
									})
								}else if(res.code == 600){
									layer.msg('请输入您要查询的订单号')
								}else{
									layer.close(index);
									layer.msg(res.msg)
								}
  							})
  						}
				});
  			},
		}
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/money.css";
	.aliayPay{
		padding:40px 20px;
	}
	
	.aliayPay .myaccount_bar{
		padding: 20px;
		border: 1px solid #d9dee4;
		text-align: left;
		background-color: rgba(18,18,18,0.05);
	}
	.aliayPay .myaccount_bar > p{
		line-height: 24px;
	}
	.aliayPay .myaccount_bar > p > span{
		color: #d8101f;
		font-weight: 600;
	}
	.aliayPay .myaccount_bar2{
		padding: 20px 0;
	}
	.aliayPay .myaccount_bar2 span{
		color: #d8101f;
		font-weight: 600;
		cursor:pointer;
	}
	.aliayPay .myaccount_bar2 b{
		color: #d8101f;
    	font-weight: 600;
	}
	.aliayPay .boundDiv{
		position:relative;
		height:250px;
	}
	.aliayPay #boundCode{
		position:absolute;
		top:20px;
		bottom:0;
		left:0;
		right:0;
		margin:0 auto;
		width:200px;
	}
	.aliayPay .boundDiv{
		text-align:center;
	}
	.aliayPay .boundDiv button{
		margin-top:90px;
		cursor:pointer;
		outline:0;
	}
	.btn-default {
	    color: #333;
	    background-color: #fff;
	    border-color: #ccc;
    }
</style>