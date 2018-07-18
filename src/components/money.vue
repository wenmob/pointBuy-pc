<template>
	<div class="moneyContainer">
		<top ref="top"></top>
		<div class="min-height">
			<div class="contWidth">
				<div class="conter_left">
					<ul class="nav-noail" role="tablist">
						<!--支付宝支付1-->
						<li v-show="typeSupport.UseAlipay" @click="changeType" role="presentation" class="border_dot" :class="tabActive==0?'active':''">
							<a href="#Alipay" aria-controls="Alipay" role="tab" data-toggle="tab">支付宝转账</a>
						</li>
						<!--支付宝支付2-->
						<li v-show="typeSupport.UseCodeAlipay" @click="changeType" role="presentation" class="border_dot" :class="tabActive==1?'active':''">
							<a href="#CodeAlipay" aria-controls="CodeAlipay" role="tab" data-toggle="tab">支付宝转账</a>
						</li>
						<!--微信支付-->
						<li v-show="typeSupport.UseWechat" @click="changeType" role="presentation" class="border_dot" :class="tabActive==2?'active':''">
							<a href="#WX" aria-controls="WX" role="tab" data-toggle="tab">微信转账</a>
						</li>
						<!--银联支付-->
						<li v-show="typeSupport.UseNetBank" @click="changeType" role="presentation" class="border_dot" :class="tabActive==3?'active':''">
							<a href="#NetBank" aria-controls="NetBank" role="tab" data-toggle="tab">银联转账</a>
						</li>
						<!--未来优势转账(银联转账2)-->
						<li v-show="typeSupport.UseWlyxNetBank" @click="changeType" role="presentation" class="border_dot" :class="tabActive==4?'active':''">
							<a href="#WlyxNetBank" aria-controls="WlyxNetBank" role="tab" data-toggle="tab">未来优势转账</a>
						</li>
						<!--银行卡转账-->
						<li v-show="typeSupport.UseOff" @click="changeType" role="presentation" class="border_dot" :class="tabActive==5?'active':''">
							<a href="#BankPay" aria-controls="BankPay" role="tab" data-toggle="tab">银行卡转账</a>
						</li>
						<!--提现-->
						<li @click="changeType" role="presentation" :class="tabActive==6?'active':''">
							<a href="#Cash" aria-controls="Cash" role="tab" data-toggle="tab">提&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现</a>
						</li>
					</ul>
				</div>
				<div class="conter_right tab-content">
					<!--支付宝转账1-->
					<div role="tabpanel" class="tab-pane" id="Alipay" :class="tabActive==0?'active':''">
						<alipayPay ref="alipayPay"></alipayPay>
					</div>
					<!--支付宝转账2-->
					<div role="tabpanel" class="tab-pane" id="CodeAlipay" :class="tabActive==1?'active':''">
						<codeAlipayPay ref="codeAlipayPay"></codeAlipayPay>
					</div>
					<!--微信转账-->
					<div role="tabpanel" class="tab-pane" id="WX" :class="tabActive==2?'active':''">
						<weChantPay ref="weChantPay"></weChantPay>
					</div>
					<!--银联转账-->
					<div role="tabpanel" class="tab-pane" id="NetBank" :class="tabActive==3?'active':''">
						<netBankPay ref="netBankPay"></netBankPay>
					</div>
					<!--未来优势转账(银联转账2)-->
					<div role="tabpanel" class="tab-pane" id="WlyxNetBank" :class="tabActive==4?'active':''">
						<wlyxBankPay ref="wlyxBankPay"></wlyxBankPay>
					</div>
					<!--银行卡转账-->
					<div role="tabpanel" class="tab-pane" id="BankPay" :class="tabActive==5?'active':''">
						<bankPay ref="bankPay"></bankPay>
					</div>
					<!--提现-->
					<div role="tabpanel" class="tab-pane" id="Cash" :class="tabActive==6?'active':''">
						<cash ref="cash"></cash>
					</div>
				</div>
			</div>
		</div>
		<fot ref="fot"></fot>
	</div>
</template>

<script>
	import Header from '@/components/common/Header';
	import Fot from '@/components/common/Footer';
	import alipayPay from '@/components/money/AlipayPay';
	import codeAlipayPay from '@/components/money/CodeAlipayPay';
	import weChantPay from '@/components/money/WeChantPay';
	import netBankPay from '@/components/money/NetBankPay';
	import wlyxBankPay from '@/components/money/WlyxBankPay';
	import bankPay from '@/components/money/BankPay';
	import cash from '@/components/money/Cash';
	import Icon from 'vue-svg-icon/Icon.vue';
	import { APIS } from '../utils/apis.js';
	let vm;
	export default {
		data() {
			return {
				userMoney:{},
				typeSupport:{
					UseNetBank:false,
					UseAlipay:false,
					UseOff:false,
					UseWechat:false,
					UseCodeAlipay:false,
					UseWlyxNetBank:false,
					NetBankFee:0,
					AlipayFee:0,
					OffFee:0,
					WechatFee:0,
					CodeAlipayFee:0,
					WlyxNetBankFee:0
				},
				tabActive:0
			}
		},
		components: {
			"top": Header,
			'fot': Fot,
			alipayPay,
			codeAlipayPay,
			weChantPay,
			netBankPay,
			wlyxBankPay,
			bankPay,
			cash,
			Icon
		},
		mounted(){
			vm = this;
			
			vm.userMoneyInfo()
			vm.getPayType()
		},
		methods:{
			changeType(){
				vm.$refs.codeAlipayPay.codeShow = false
				vm.$refs.codeAlipayPay.alipayAmount = ""
				vm.$refs.weChantPay.codeShow = false
				vm.$refs.weChantPay.wechatAmount = ""
				vm.$refs.netBankPay.amount = ""
				vm.$refs.wlyxBankPay.amount = ""
				vm.$refs.cash.cashMoney = ""
				vm.$refs.cash.cashPaw = ""
			},
			//查看资产
			userMoneyInfo(){
				APIS.userMoneyInfo(function(res){
					if(res.code == 0){
						vm.userMoney = res.data
						vm.userMoney.balance = vm.userMoney.balance.toFixed(2)
					}
				})
			},
			//系统支持的支付方式
		    getPayType(){
		      	APIS.getPayType(function(res){
//		    		console.log(res)
	      			if(res.code == 0){
	      				/*获取系统支持的支付方式*/
//	      				vm.typeSupport = resa.data
	      				vm.typeSupport.UseNetBank = res.data.canPayUseNetBank//银联
	      				vm.typeSupport.UseAlipay = res.data.canPayUseAlipay//支付宝
	      				vm.typeSupport.UseOff = res.data.canPayUseOff//银行卡
	      				vm.typeSupport.UseWechat = res.data.canPayUseWechat//微信
	      				vm.typeSupport.UseCodeAlipay = res.data.canPayUseCodeAlipay//支付宝2
	      				vm.typeSupport.UseWlyxNetBank = res.data.canPayUseWlyxNetBank//未来优势支付
	      				/*获取支付手续费*/
	      				vm.typeSupport.NetBankFee = res.data.canPayUseNetBankFee//银联
	      				vm.typeSupport.AlipayFee = res.data.canPayUseAlipayFee//支付宝
	      				vm.typeSupport.OffFee = res.data.canPayUseOffFee//银行卡
	      				vm.typeSupport.WechatFee = res.data.canPayUseWechatFee//微信
	      				vm.typeSupport.CodeAlipayFee = res.data.canPayUseCodeAlipayFee//支付宝2
	      				vm.typeSupport.WlyxNetBankFee = res.data.canPayUseWlyxNetBankFee//未来优势支付
	      				//选项卡高亮
	      				if(vm.$route.query.type){
	      					vm.tabActive = vm.$route.query.type
	      					return
						}
	      				if(vm.typeSupport.UseAlipay){
	      					vm.tabActive = 0
	      					return
						}
	      				if(!typeSupport.UseAlipay&&typeSupport.UseCodeAlipay){
	      					vm.tabActive = 1
	      					return
						}
	      				if(!typeSupport.UseAlipay&&!typeSupport.UseCodeAlipay&&typeSupport.UseWechat){
	      					vm.tabActive = 2
	      					return
						}
	      				if(!typeSupport.UseAlipay&&!typeSupport.UseCodeAlipay&&!typeSupport.UseWechat&&typeSupport.UseNetBank){
	      					vm.tabActive = 3
	      					return
						}
	      				if(!typeSupport.UseAlipay&&!typeSupport.UseCodeAlipay&&!typeSupport.UseWechat&&!typeSupport.UseNetBank&&typeSupport.UseWlyxNetBank){
	      					vm.tabActive = 4
	      					return
						}
	      				if(!typeSupport.UseAlipay&&!typeSupport.UseCodeAlipay&&!typeSupport.UseWechat&&!typeSupport.UseNetBank&&!typeSupport.UseWlyxNetBank&&typeSupport.UseOff){
	      					vm.tabActive = 5
	      					return
						}
	      			}
		      	})
		    },
		},

	}
</script>

<style scoped>
	.clear{
		clear: both;
	}
	
	.red{
		color: #ff5d5e;
	}
	
	.green{
		color: #76cf75;
	}
	
	a{
		color: #282828;
		text-decoration: none;
	}
	.contWidth{
		margin: 0 auto;
		display: block;
		min-width: 1200px;
		width: 66%;
		position: relative;
	}
	.min-height{
		display: block;
		width: 100%;
		height: 100%;
		min-height: 660px;
		background: #f1f1f1;
		padding-bottom: 30px;
	}
	.conter_left{
		position: absolute;
		top: 30px;
		left: 0;
		width: 220px;
		min-height: 120px;
		background: #fff;
		border-radius: 10px;
		text-align:center;
	}
	.border_dot{
		border-bottom: dotted 1px #ddd;
	}
	.nav-noail{
		padding: 0;
		margin: 0 20px;
	}
	.nav-noail li{
		display: block;
		width: 180px;
		line-height: 60px;
		font-size: 16px;
	}
	.nav-noail li a:hover,.active>a{
		color: #ff5d5e;
	}
	.conter_right{
		position: relative;
		top: 30px;
		left: 240px;
		width: calc(100% - 240px);
		min-height: 600px;
		background: #fff;
		border-radius: 10px;
		margin-bottom: 30px;
	}
</style>