<template>
	<div id="User_back">
		<div class="contWidth">
			<dl class="Personal_list">
				<dd>
					<div class="list_Alone">
						<div class="Alone_top">
							<span><icon name="handset" scale="6"></icon></span>
							<p>{{userInfo.mobile}}</p>
						</div>
						<div class="Alone_but">
							<button @click="personPop('mobile')">修改手机</button>
						</div>
					</div>
				</dd>
				<dd>
					<!--未实名认证-->
					<div v-if='!userInfo.idcard' class="list_Alone">
						<div class="Alone_top">
							<span><icon name="Realname" scale="6"></icon></span>
							<p>实名认证</p>
						</div>
						<div class="Alone_but">
							<button @click="personPop('idCard')">立即认证</button>
						</div>
					</div>
					<!--已实名认证-->
					<div class="list_Alone" v-if='userInfo.idcard'>
						<div class="Alone_top">
							<span><icon name="Realname" scale="6"></icon></span>
							<p>{{userInfo.name}}</p>
							<em style="display:inline-block;margin-top:10px;">{{userInfo.idcard}}</em>
						</div>
					</div>
				</dd>
				<dd>
					<div v-if='!userInfo.bankNumber' class="list_Alone">
						<div class="Alone_top">
							<span><icon name="Bankcard" scale="6"></icon></span>
							<p>绑定银行卡</p>
						</div>
						<div class="Alone_but">
							<button @click="personPop('bank')">立即绑定</button>
						</div>
					</div>
					<div v-if='userInfo.bankNumber' class="list_Alone">
						<div class="Alone_top">
							<span><icon name="Bankcard" scale="6"></icon></span>
							<p>{{userInfo.bankName}}</p>
							<em style="display:inline-block;margin-top:10px;">{{userInfo.bankNumber}}</em>
						</div>
					</div>
				</dd>
				<dd>
					<div class="list_Alone">
						<div class="Alone_top">
							<span><icon name="ZFB" scale="6"></icon></span>
							<p>绑定支付宝</p>
						</div>
						<div class="Alone_but">
							<button @click="personPop('alipay')">立即绑定</button>
						</div>
					</div>
				</dd>
				<dd>
					<div class="list_Alone">
						<div class="Alone_top">
							<span><icon name="Loginpassword" scale="6"></icon></span>
							<p>登录密码</p>
						</div>
						<div class="Alone_but">
							<button @click="personPop('loginPaw')">修改密码</button>
						</div>
					</div>
				</dd>
				<dd>
					<div class="list_Alone">
						<div class="Alone_top">
							<span><icon name="Transactionpassword" scale="6"></icon></span>
							<p>提现密码</p>
						</div>
						<div class="Alone_but">
							<button v-if="!userInfo.hasPayPassword" @click="personPop('cashPaw')">设置密码</button>
							<button v-if="userInfo.hasPayPassword" @click="personPop('cashPaw')">修改密码</button>
						</div>
					</div>
				</dd>
				<div class="clear"></div>
			</dl>
		</div>
		<changemobile v-show="popType == 'mobile'" ref="changemobile"></changemobile>
		<setIdCard v-show="popType == 'idCard'" ref="setIdCard"></setIdCard>
		<bankBound v-show="popType == 'bank'" ref="bankBound"></bankBound>
		<alipayBound v-show="popType == 'alipay'" ref="alipayBound"></alipayBound>
		<changeLoginPaw v-show="popType == 'loginPaw'" ref="changeLoginPaw"></changeLoginPaw>
		<changeCashPaw v-show="popType == 'cashPaw'" ref="changeCashPaw"></changeCashPaw>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue';
	import changemobile from "../personal/Changemobile"
	import setIdCard from "../personal/SetIdCard"
	import bankBound from "../personal/BankBound"
	import alipayBound from "../personal/AlipayBound"
	import changeLoginPaw from "../personal/ChangeLoginPaw"
	import changeCashPaw from "../personal/ChangeCashPaw"
	import { APIS } from '../../utils/apis.js';
	let vm;
	
	export default {
		data() {
			return {
				popType:'',
				userInfo:{}
			}
		},
		components: {
			Icon,
			changemobile,
			setIdCard,
			bankBound,
			alipayBound,
			changeLoginPaw,
			changeCashPaw
		},
		mounted() {
			vm = this;
			if(vm.$route.query.type){
				vm.personPop(vm.$route.query.type)
			}
			
		},
		methods: {
			personPop(type) {
				vm.popType = type
				if(type == "mobile"){
					vm.$refs.changemobile.tel = vm.userInfo.mobile
				}else if(type == "bank"){
					vm.$refs.bankBound.userInfo = vm.userInfo
				}else if(type == "alipay"){
					vm.$refs.alipayBound.getRandomMoney()
					vm.$refs.alipayBound.rechargeSetAlipay()
				}
			},
			// 获取用户基本信息
			getBaseUserInfo() {
				APIS.getBaseUserInfo(function(res){
					if(res.code == 0){
						vm.userInfo = res.data
						//判断:如果未绑定银行卡再获取所支持的银行信息
						if(!vm.userInfo.bankNumber) {
							vm.$refs.bankBound.sysBankListWithdraw()
							vm.$refs.bankBound.getprovince()//首次加载北京市
						}
					}
				})
			},
		},
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	.clear {
		clear: both;
	}
	
	.red {
		color: #ff5d5e;
	}
	
	.green {
		color: #76cf75;
	}
	
	.back-red {
		background: #ff5d5e!important;
		color: #fff!important;
	}
	
	.back-blue {
		background: #5bc1d7;
	}
	
	#User_back {
		display: block;
		width: 100%;
		min-height: 880px;
		padding-top: 80px;
		padding-bottom: 60px;
		background: #f1f1f1;
	}
	
	.contWidth {
		margin: 0 auto;
		display: block;
		min-width: 1200px;
		width: 66%;
		position: relative;
	}
	
	.Personal_list dd {
		width: 25%;
		padding: 10px;
		float: left;
		text-align:center;
	}
	
	.list_Alone {
		padding: 40px 20px;
		background: #fff;
		border-radius: 10px;
		color: #282828;
	}
	
	.Alone_top span {
		display: inline-block;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: #282828;
		color: #fff;
		line-height: 140px;
	}
	
	.Alone_top p {
		margin: 20px 0;
	}
	
	.Alone_but button {
		width: 80%;
		height: 36px;
		background: #ff5d5e;
		border-radius: 18px;
		border: none;
		color: #fff;
	}
</style>