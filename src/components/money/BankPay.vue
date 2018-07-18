<template>
	<div class="bankPay">
		<div class='text-left'>
			你可以通过网上银行、银行柜台、ATM等方式向
			<span>{{rechargePay.account}}</span>转账!
			<p style='display:inline-block;'><!--TODO-->
				(需 <span style='color:#d8101f;font-weight:900;'>{{$parent.typeSupport.OffFee}}%</span> 手续费)
			</p>
		</div>
		<dl class="clearfix">
			<dd v-for="item in bankList">
				<div>
					<h4>{{item.bankName}}</h4>
					<p>{{item.account}}</p>
					<p>{{item.account}}</p>
					<p>{{item.branch}}</p>
				</div>
			</dd>
		</dl>
		<p>转账完成，您可拨打客服热线<span>{{commonInfo.tel}}</span>确认到账进度</p>
    </div>
</template>

<script>
	import { APIS } from '../../utils/apis.js';
	let vm;
	
	export default{
		data(){
			return{
				rechargePay:{},
				commonInfo:{},
				bankList:[]
				
			}
		},
		mounted(){
			vm = this;
			vm.rechargeOffMerchantSet()
			vm.getCommon()
			vm.rechargeSetAlipay()
		},
		methods:{
			//前端获取代理商线下转账账号维护
		    rechargeOffMerchantSet(){
		    	APIS.rechargeOffMerchantSet(function(res){
//		    		console.log(res)
		    		if(res.code == 0){
		    			vm.bankList = res.data
		    		}
		    	})
		    },
		    //获取头部,电话,logo接口
		  	getCommon(){
			  	APIS.getCommon(function(res){
//			  		console.log(res)
			  		if(res.code == 0){
			  			vm.commonInfo = res.data
			  		}
			  	})
			},
			//支付宝转账信息
			rechargeSetAlipay(){
				APIS.rechargeSetAlipay(function(res){
//					console.log(res)
					if(res.code == 0){
						vm.rechargePay = res.data
					}
				})
			},
		}
	}
</script>

<style scoped>
	.bankPay{
		padding:40px;
	}
	.bankPay > dl{
		padding: 10px 0;
		display: block;
		margin-bottom: 0;
		justify-content: space-around;
	}
	.bankPay > dl > dd{
		width: 220px;
		float: left;
		padding: 15px;
		
	}
	.bankPay > dl > dd > div{
		padding: 15px;
		border: 1px solid #d9dee4;
		background-color: #f6f6f6;
		border-radius: 10px;
		text-align: center;
	}
	.bankPay > p > span,.bankPay > dl > dd > div > h4{
		color: #d8101f;
		font-weight: 600;
	}
	.bankPay > dl > dd > div > p{
		line-height: 24px;
		text-align:center;
	}
</style>