<template>
	<div class="popContainer">
		<div class="popContent">
			<div class="title">
				<span>
					<icon name="Loginpassword" scale="6"></icon>
				</span>
				<em>忘记密码</em>
				<i @click="$parent.forgetShow =false;$store.commit('changeSignpop', '')">&times;</i>
			</div>
			<div @keyup.enter="changeGo" class="center">
				<div>
					<label for="tel1">手&nbsp;机&nbsp;号</label>
					<i></i>
					<input id="tel1" type="number"  v-model='tel'/>
				</div>
				<div class="codeDiv">
					<label for="random1">验&nbsp;证&nbsp;码</label>
					<i></i>
					<input id="random1" v-model='random' />
					<span>
						<img class="imgStr" src="/code" @click="UpdateSrc"/>
					</span>
				</div>
				<div class="codeDiv">
					<label for="teTelStr1">手机验证</label>
					<i></i>
					<input id="teTelStr1" v-model='teTelStr' />
					<span @click="getTelRandom" class="telStr red">获取手机验证码</span>
				</div>
				<div>
					<label for="password1">新&nbsp;密&nbsp;码</label>
					<i></i>
					<input id="password1" type="password" v-model='password'/>
				</div>
				<div>
					<label for="passwordAgain1">确认密码</label>
					<i></i>
					<input id="passwordAgain1" type="password"  v-model='passwordAgain'/>
				</div>
				<button @click="changeGo">确&nbsp;&nbsp;认</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue';
	import { APIS } from "../../utils/apis.js"
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
			}
		},
		components: {
			Icon
		},
		mounted() {
			vm = this;
		},
		methods: {
			//更新随机验证码
			UpdateSrc() {
				$('.imgStr').attr('src', vm.verificationCode)
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
						//开始倒计时
						vm.countDown();
					} else if(data.code == 604) {
						layer.msg('未绑定该手机号,请先绑定',function() { 
								vm.$router.push({path: 'user',query:{index:2,type:'mobile'}})
						});

					} else if(data.code == 6000) {
						layer.msg( data.msg );
						$('.imgStr').attr('src', vm.verificationCode)

					} else {
						layer.msg(data.msg)
					}
				})
			},
			//倒计时
			countDown() {
				$('.telStr').text(vm.count + "秒");
				$('.telStr').css({
					"pointer-events": "none"
				});
				setTimeout(function() {
					vm.count--;
					if(vm.count == 0) {
						$('.telStr').css({
							"pointer-events": "auto"
						});
						$('.telStr').text('获取手机验证码');
						vm.count = 60;
						return;
					} else {
						$('.telStr').text(vm.count + "秒");
						vm.countDown();
					}
				}, 1000)
			},
			//确认
			changeGo() {
				//如果密码验证成功，再请求数据
				if(!APIS.phoneNumInput(vm.tel) || !APIS.checkPassword(vm.password)) {
					return
				}
				if(vm.passwordAgain != vm.password) {
					layer.msg('密码不一致,请重新输入');
					return
				}
				APIS.changeLoginPaw(vm.tel, vm.password, vm.teTelStr, function(data) {
//							console.log(data)
					if(data.code == 0) {
						vm.$parent.forgetShow = false;
					} else if(data.code == 700) {
						layer.msg('您还未注册');
					} else {
						layer.msg(data.msg);
					}

				})
			},
		},
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/User.css";
</style>