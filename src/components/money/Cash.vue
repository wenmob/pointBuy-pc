<template>
	<div class="moneyContent cashContent">
		<div class="inputMoney">
			<div class="moneyTit">
				<p>账户余额</p>
				<strong>{{$parent.userMoney.balance}}</strong>
			</div>
			<div class="inputCenter">
				<p>充值金额</p>
				<p><input v-model='cashMoney'/></p>
				<p>
					<span>银行卡</span>
					<em v-if='!userInfo.bankNumber' style="float:left;line-height:48px;padding-left:20px;">{{userInfo.bankNumber}}</em>
					<span v-if='userInfo.bankNumber' @click="$router.push('user?index=2&type=bank')" class="pointer red">绑定银行卡</span>
				</p>
				<p>
					<input type="password" v-model='cashPaw' placeholder="交易密码"/>
				</p>
				<p>
					<span></span>
					<span @click="$router.push('user?index=2&type=cashPaw')" class="pointer red">忘记密码</span>
				</p>
				<p><button @click="userCashWithdrawApply">确认充值</button></p>
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
				cashMoney:"",
				cashPaw:"",
				userInfo:{}
			}
		},
		mounted(){
			vm = this;
			vm.getBaseUserInfo()
		},
		methods:{
			getAlipayCode(){
				vm.codeShow = true
			},
			//用户具体信息
      		getBaseUserInfo(){
      			APIS.getBaseUserInfo(function(res){
//    				console.log(res)
      				if(res.code == 0){
      					vm.userInfo = res.data
      				}
      			})
      		},
      		//确认提现
  			userCashWithdrawApply(){
  				if(vm.cashMoney < 100){
		     		layer.msg('提现金额不能小于100元')
		     		return
		     	}
	     		APIS.userCashWithdrawApply(vm.cashMoney,vm.cashPaw,function(res){
//		   			console.log(res)
	     			if(res.code == 0){
	     				layer.msg('提现成功',function(){
	     					vm.$router.push({path:'/user',query:{type:0}})
	     				});
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
	.cashContent .inputMoney .inputCenter p{
		width:360px;
		height:48px;
		margin:0 auto;
	}
	.cashContent .inputMoney .inputCenter p span{
		line-height:48px;
		padding:0 10px;
	}
	.cashContent .inputMoney .inputCenter p span:first-child{
		float:left;
	}
	.cashContent .inputMoney .inputCenter p span:last-child{
		float:right;
	}
</style>