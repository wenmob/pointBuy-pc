<template>
	<div class="popContainer">
		<div class="popContent">
			<div class="title">
				<span>
					<icon name="User" scale="6"></icon>
				</span>
				<em>注册</em>
				<i class="pointer" @click="closeShadow">&times;</i>
			</div>
			<div class="center" @keyup.enter="Go">
				<div>
					<label for="mobile">手&nbsp;机&nbsp;号</label>
					<i></i>
					<input id="mobile" v-model="tel"/>
				</div>
				<div class="codeDiv">
					<label for="random">验&nbsp;证&nbsp;码</label>
					<i></i>
					<input id="random" v-model="random" />
					<span>
						<img class="imgStr" src="/code" @click="UpdateSrc"/>
					</span>
				</div>
				<div class="codeDiv">
					<label for="telStr">手机验证</label>
					<i></i>
					<input id="telStr" v-model="teTelStr" />
					<span class="telStr red" @click="UpdateTelStr">获取手机验证码</span>
				</div>
				<div>
					<label for="password">设置密码</label>
					<i></i>
					<input id="password" v-model="password" />
				</div>
				<div v-if="referrerType == 'sm'">
					<label for="mobile">邀&nbsp;请&nbsp;码</label>
					<i></i>
					<input v-model='referrerId'/>
				</div>
				<button @click="Go">确&nbsp;&nbsp;认</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue';
	import { APIS } from '../../utils/apis.js';
	let vm;

	export default {
		data(){
			return{
				verificationCode:'/code',
				tel:'',
				random:'',
				teTelStr:'',
				count:60,
				password:'',
				referrerType:'',
				referrerId:''//机构代码
			}
		},
		mounted() {
			vm = this;
			vm.getCommon()
		},
		components: {
			Icon,
		},
		methods: {
			//关闭弹窗
			closeShadow() {
				/*let str = ""
				for(var key in vm.$route.query) {
					console.log()
					if(key != "shadow" && key != "redirect") {
						str += key + "=" + vm.$route.query[key] + "&"
					}
				}
				vm.$router.push(vm.$route.path + "?" + str)*/
				this.$store.commit('changeSignpop', "")
			},
			/*获取电话数据*/
	    	getCommon(){
				APIS.getCommon(function(res){
	//					console.log(data.data);
//					vm.headerContent = res.data;
					if(res.data.regUseSellerid){
						vm.referrerType = 'sm'
					}else{
						vm.referrerType = ''
					}
				})
	    	},
			UpdateSrc() { //更新随机验证码
				$('.imgStr').attr('src', vm.verificationCode)
			},
			UpdateTelStr() { //更新短信验证码
				//如果手机号验证成功，再请求发送短信验证码
				if(APIS.phoneNumInput(vm.tel)) {
					APIS.get_sms_code(vm.tel, 1, vm.random, function(data) {
						//						console.log(data)
						if(data.code == 0) {
							layer.msg('验证码发送成功')
							//开始倒计时
							vm.countDown();
						} else if(data.code == 6000) {
							layer.msg('图形验证码错误');
							$('.imgStr').attr('src', vm.verificationCode) //刷新验证码
						} else if(data.code == 605) {
							layer.msg('手机号已注册，请登录', function() {
								vm.$store.commit('changeSignpop', 'login')
							})
						} else {
							layer.msg(data.msg)
						}
					})
				}
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
			Go() {
				//如果手机号和密码验证成功，再请求数据
				if(APIS.phoneNumInput(vm.tel) && APIS.checkPassword(vm.password)) {
					if(vm.referrerType == 'sm' && vm.referrerId == '') {
						layer.msg('请输入邀请码')
						return
					}
					APIS.getRegister(vm.tel, '', vm.password, vm.teTelStr, 0, vm.referrerType, vm.referrerId, function(data) {
						//							console.log(data)
						if(data.code == 0) {
							vm.tel='';
							vm.random='';
							vm.teTelStr='';
							vm.count=60;
							vm.password='';
							vm.referrerId='';
							vm.$store.commit('changeSignpop', 'login')

						} else if(data.code == 30000) {
							layer.msg('手机号已注册，请登录', function() {
								vm.$store.commit('changeSignpop', 'login')
							})
						} else {
							layer.msg(data.msg)
						}
					})
				}
			},
		}
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/User.css";
</style>