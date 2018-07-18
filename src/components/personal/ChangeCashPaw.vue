<template>
	<div class="personPop">
		<div class="popcontent">
			<div class="title">
				<span>
					<icon name="Transactionpassword" scale="6"></icon>
				</span>
				<em v-if="!$parent.userInfo.hasPayPassword">设置交易密码</em>
				<em v-if="$parent.userInfo.hasPayPassword">修改交易密码</em>
				<i @click="closePop">&times;</i>
			</div>
			<div v-if="$parent.userInfo.hasPayPassword" @keyup.enter="changeGo" class="center">
				<div>
					<label for="mobile4">手&nbsp;机&nbsp;号</label>
					<i></i>
					<input id="mobile4" type="number" v-model="tel"/>
				</div>
				<div class="codeDiv">
					<label for="random4">验&nbsp;证&nbsp;码</label>
					<i></i>
					<input id="random4" v-model="random" />
					<span>
						<img @click="UpdateSrc" class="imgCode" src="/code" alt="" />
					</span>
				</div>
				<div class="codeDiv">
					<label for="teTelStr4">手机验证</label>
					<i></i>
					<input id="teTelStr4" v-model="teTelStr"/>
					<span @click="getTelRandom" class="getTelStr red">获取手机验证码</span>
				</div>
				<div>
					<label for="password4">新&nbsp;密&nbsp;码</label>
					<i></i>
					<input id="password4" v-model="password" type="password" />
				</div>
				<div>
					<label for="passwordAgain">确认密码</label>
					<i></i>
					<input id="passwordAgain" v-model="passwordAgain" type="password" />
				</div>
				<button @click="changeGo">确认修改</button>
			</div>
			<div v-if="!$parent.userInfo.hasPayPassword" @keyup.enter="savePayPsw" class="center">
				<div>
					<label for="password5">提现密码</label>
					<i></i>
					<input id="password5" v-model="tradePaw" type="password" />
				</div>
				<div>
					<label for="passwordAgain2">确认密码</label>
					<i></i>
					<input id="passwordAgain2" v-model="tradePawAgain" type="password" />
				</div>
				<button @click="savePayPsw">确认设置</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue';
	import { APIS } from '../../utils/apis.js';
	let vm;
	
	export default {
		data() {
			return {
				count: 60,
				verificationCode: "/code",
				tel: '',
				random: '',
				password: '',
				passwordAgain: '',
				teTelStr: '',
				tradePaw:"",
				tradePawAgain:"",
				
			}
		},
		components: {
			Icon
		},
		mounted() {
			vm = this;
		},
		methods: {
			UpdateSrc() {
				$('.imgCode').attr('src', vm.verificationCode)
			},
			//获取手机验证码
			getTelRandom() {
				//如果手机号验证成功，再请求发送短信验证码
				if(!APIS.phoneNumInput(vm.tel)) {
					return	
				}
				APIS.get_sms_code(vm.tel, 2, vm.random, function(data) {
					//	            console.log(data)
					if(data.code == 0) {
						layer.msg('验证码发送成功');
						vm.countDown();
					}else if(data.code == 6000) {
						layer.msg(data.msg);
						$('.imgCode').attr('src', vm.verificationCode)
					} else {
						layer.msg(data.msg);
					}

				})
			},
			//倒计时
			countDown() {
				$('.getTelStr').text(vm.count + "秒");
				$('.getTelStr').css({
					"pointer-events": "none"
				});
				setTimeout(function() {
					vm.count--;
					if(vm.count == 0) {
						$('.getTelStr').css({
							"pointer-events": "auto"
						});
						$('.getTelStr').text('获取手机验证码');
						vm.count = 60;
						return;
					} else {
						$('.getTelStr').text(vm.count + "秒");
						vm.countDown();
					}
				}, 1000)
			},
			//确认修改
			changeGo() {
				//如果密码验证成功，再请求数据
				if(!APIS.phoneNumInput(vm.tel) || !APIS.checkPassword(vm.password)) {
					return	
				}	
				if(vm.passwordAgain != vm.password) {
					layer.msg('密码不一致,请重新输入');
					return
				}
				APIS.saveResetPayPsw(vm.tel, vm.password, vm.teTelStr, function(data) {
//					console.log(data)
					if(data.code == 0) {
						vm.closePop()
					} else if(data.code == 700) {
						layer.msg('您还未注册');
					} else {
						layer.msg( data.msg);
					}
				})
			},
			//确认设置
			savePayPsw() {
				if(!APIS.checkPassword(vm.tradePaw)) {
					return
				}
				if(vm.tradePaw != vm.tradePawAgain) {
					layer.msg('两次密码输入不一致');
					return
				}
				APIS.savePayPsw(vm.tradePaw, function(data) {
					if(data.code == 0) {
						vm.closePop()
					} else {
						layer.msg(data.msg);
					}
				})
			},
			//关闭弹框
			closePop(){
				vm.$parent.popType = ""
				vm.count=60
				vm.tel=''
				vm.random= ''
				vm.password= ''
				vm.passwordAgain= ''
				vm.teTelStr=''
				vm.tradePaw=""
				vm.tradePawAgain=""
			},
		},
	}
	
</script>
<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/personPop.css";
</style>