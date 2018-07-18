<template>
	<div class="moneyContent">
		<div class="inputMoney">
			<div class="moneyTit">
				<p>账户余额</p>
				<strong>{{$parent.userMoney.balance}}</strong>
			</div>
			<div class="inputCenter">
				<p>充值金额</p>
				<p><input v-model='amount'/></p>
				<p>
					<select v-model='bankCode'>
						<option v-for='item in bankList' :value='item.bankCode'>{{item.name}}</option>
					</select>
				</p>
				<p v-if='$parent.typeSupport.NetBankFee != 0' style="width:360px;height:48px;line-height:48px;margin:auto;text-align:left;padding-left:20px;">
					需手续费
					<span class='red' style='font-weight:900'>{{$parent.typeSupport.NetBankFee}}%</span>
				</p>
				<p><button @click="gatewayPay">确认充值</button></p>
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
				amount:"",
				bankCode:'ICBC',
				bankList:[],
				
			}
		},
		mounted(){
			vm = this;
			vm.sysBankListWithdraw()
		},
		methods:{
			//获取系统支持银行
  			sysBankListWithdraw(){
  				APIS.sysBankListWithdraw(function(res){
//					console.log(res)
  					if(res.code != 0){
  						layer.msg(res.msg)
  						return
  					}
  					res.data.forEach(function(item){
  						if(item.supportGateway){
  							vm.bankList.push(item)
  						}
  					})
  				})
  			},
  			//银联(网关)支付
			gatewayPay(){
				let amount = vm.amount*100
				if(amount <= 0){
					layer.msg('请填写有效的充值金额')
					return
				}
				if(amount%1 != 0){
					layer.msg('充值金额最多两位小数')
					return
				}
				if(amount.lenght > 8){
					layer.msg('充值金额过大')
					return
				}
				APIS.gatewayPay(amount,vm.bankCode,function(res){
//			  		console.log(res)
			  		if(res.code == 0){
			  			window.location.href = res.data
			  		}else{
			  			layer.msg(res.msg)
			  		}
			  	})
			},
		}
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/money.css";
	
</style>