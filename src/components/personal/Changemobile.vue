<template>
	<div class="personPop">
		<div class="popcontent">
			<div class="title">
				<span>
					<icon name="handset" scale="6"></icon>
				</span>
				<em>{{tel}}</em>
				<i @click="closePop">&times;</i>
			</div>
			<div class="center" @keyup.enter="goChange">
				<div>
					<label for="tel1">新手机号</label>
					<i></i>
					<input id="tel1" v-model="tel" type="number" />
				</div>
				<div class="codeDiv">
					<label for="random2">验&nbsp;证&nbsp;码</label>
					<i></i>
					<input id="random2" v-model="random" />
					<span>
						<img class="imgCode" src="/code" @click="UpdateSrc"/>
					</span>
				</div>
				<div class="codeDiv">
					<label for="telStr1">手机验证</label>
					<i></i>
					<input id="telStr1" v-model="telStr"/>
					<span @click="UpdateTelStr" class="getTelCode red">获取手机验证码</span>
				</div>
				<div>
					<label for="paw2">登录密码</label>
					<i></i>
					<input id="paw2" type="password" v-model="password" />
				</div>
				<button @click="goChange">确认修改</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue';
	import {APIS} from "../../utils/apis.js"
	let vm;
	
	export default {
		data() {
			return {
				tel:"",
				verificationCode:'/code',
				tel:'',
				random:'',
				telStr:'',
				password:'',
				count:60
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
				$('.imgCode').attr('src', vm.verificationCode)
			},
			//更新短信验证码
			UpdateTelStr() { 
				//如果手机号验证成功，再请求发送短信验证码
				if(APIS.phoneNumInput(vm.tel)) {
					APIS.get_sms_code(vm.tel, 2, vm.random, function(data) {
//						console.log(data)
						if(data.code == 0) {
							layer.msg('验证码发送成功',function(){
							    //开始倒计时
								vm.countDown();
							});
							
						} else if(data.code == 6000) {
							layer.msg('图形验证码错误',function(){
								$('.imgCode').attr('src', vm.verificationCode) //刷新验证码
							});
							
						} else {
							layer.msg(data.msg);
						}
					})
				}

			},
			//倒计时
			countDown() {
				$('.getTelCode').text(vm.count + "秒");
				$('.getTelCode').css({
					"pointer-events": "none"
				});
				setTimeout(function() {
					vm.count--;
					if(vm.count == 0) {
						$('.getTelCode').css({
							"pointer-events": "auto"
						});
						$('.getTelCode').text('获取手机验证码');
						vm.count = 60;
						return;
					} else {
						$('.getTelCode').text(vm.count + "秒");
						vm.countDown();
					}
				}, 1000)
			},
			//确认更换/绑定
			goChange() {
				if(!APIS.phoneNumInput(vm.tel) || !APIS.checkPassword(vm.password)) {
					return
				}
				if(vm.telStr == ''){
					layer.msg('请输入短信验证码');
					return
				}
				APIS.changePhone(vm.tel, vm.password, vm.telStr, function(data) {
//						console.log(data)
					if(data.code == 0) {
						vm.closePop()
					} else if(data.code == 600) {
						layer.msg('信息不完善');
					} else {
						layer.msg(data.msg);
					}
				})
			},
			//关闭弹框
			closePop(){
				vm.$parent.popType = ""
				vm.tel='';
				vm.random='';
				vm.telStr='';
				vm.password=''
			},
		},
	}
	
</script>
<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/personPop.css";
</style>