<template>
	<div class="moneyContent">
		<div class="inputMoney">
			<div class="moneyTit">
				<p>账户余额</p>
				<strong>{{$parent.userMoney.balance}}</strong>
			</div>
			<div class="inputCenter">
				<p>充值金额</p>
				<p><input v-model="amount" /></p>
				<p>
					<select v-model='bankCode'>
						<option v-for='item in wlyxNetBankList' :value='item.bankCode'>{{item.name}}</option>
					</select>
				</p>
				<p v-if='$parent.typeSupport.WlyxNetBankFee != 0' style="width:360px;height:48px;line-height:48px;margin:auto;text-align:left;padding-left:20px;">
					需手续费
					<span class='red' style='font-weight:900'>{{$parent.typeSupport.WlyxNetBankFee}}%</span>
				</p>
				<p><button @click="gatewayPayWlyx">确认充值</button></p>
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
				bankCode:"01020000",
				wlyxNetBankList:[
					{bankCode:'01020000',name:'工商银行'},
					{bankCode:'01050000',name:'建设银行'},
					{bankCode:'01030000',name:'农业银行'},
					{bankCode:'03080000',name:'招商银行'},
					{bankCode:'03010000',name:'交通银行'},
					{bankCode:'01040000',name:'中国银行'},
					{bankCode:'03030000',name:'光大银行'},
					{bankCode:'03050000',name:'民生银行'},
					{bankCode:'03090000',name:'兴业银行'},
					{bankCode:'03020000',name:'中信银行'},
					{bankCode:'03060000',name:'广发银行'},
					{bankCode:'03100000',name:'浦发银行'},
					{bankCode:'03070000',name:'平安银行'},
					{bankCode:'01000000',name:'中国邮储银行'},
					{bankCode:'04012900',name:'上海银行'},
					{bankCode:'14181000',name:'北京农村商业银行'},
					{bankCode:'03040000',name:'华夏银行'},
					{bankCode:'04031000',name:'北京银行'}
				],
				
			}
		},
		mounted(){
			vm = this;
		},
		methods:{
			//未来优势支付
			gatewayPayWlyx(){
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
				APIS.gatewayPayWlyx(amount,vm.bankCode,function(res){
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