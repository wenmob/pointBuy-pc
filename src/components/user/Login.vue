<template>
	<div class="popContainer">
		<div class="popContent">
			<div class="login_top">
				<div class="close" @click="closeShadow">&times;</div>
				<div class="login_title">会员登录</div>
				<div>
					<div class="Head_portrait">
						<div class="photo">
							<icon name="User" scale="9"></icon>
						</div>
					</div>
				</div>
			</div>
			<div @keyup.enter="getLogin" class="login_cen center">
				<div>
					<label for="mobile2">手&nbsp;机&nbsp;号</label>
					<i></i>
					<input id="mobile2" v-model="mobile" type="tel" />
				</div>
				<div>
					<label for="password2">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码</label>
					<i></i>
					<input id="password2" v-model="password" type="password" />
				</div>
				<div><button @click="getLogin" id="login_but" type="button">登&nbsp;&nbsp;录</button></div>
				<p class="pointer" @click="changeShadow">登录失败忘记密码?</P>
			</div>
		</div>
		<forgetpaw v-show="forgetShow" ref="forgetpaw"></forgetpaw>
	</div>
</template>

<script>
	import Forgetpaw from '@/components/user/forgetpaw';
	import { APIS } from '../../utils/apis.js';
	import Icon from 'vue-svg-icon/Icon.vue';
	let vm;
	export default {
		data() {
			return {
				forgetShow: false,
				mobile: "",
				password: "",
			}
		},
		mounted() {
			vm = this;
		},
		components: {
			Forgetpaw,
			Icon,
		},
		computed: {
			getGoUri() {
				return this.$store.state.goUri;
			},
			getTradeData() {
				return this.$store.state.tradeData;
			}
		},
		methods: {
			//显示忘记密码弹框
			changeShadow() {
				vm.forgetShow = true;
			},
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
			// 登录的接口
			getLogin() {
				if(!APIS.phoneNumInput(vm.mobile) || !APIS.checkPassword(vm.password)) {
					return
				}
				APIS.getLogin(vm.mobile, vm.password, (res) => {
					if(res.code == 0) {
						vm.mobile = "";
						vm.password = "";
						if(this.getGoUri === 'trade') {
							vm.buyTAddOne()
						} else if(this.getGoUri === '') {
							location.reload()
							this.$store.commit('changeSignpop', '')
							return
						} else {
							this.$store.commit('changeSignpop', '')
							vm.$router.push(this.getGoUri)
						}
						// if(vm.$route.query.redirect){
						// 	vm.$router.push(vm.$route.query.redirect)
						// }else{
						// 	vm.$router.push(-1)
						// }
					} else {
						layer.msg(res.msg)
					}
				})
			},
			//创建中发起策略
			buyTAddOne() {
				let obj = this.getTradeData
				APIS.buyTAddOne(obj, (res) => {
					console.log(res);
					if(res.code === 0) {
						// 跳转我的策略
						this.$router.push({
							path: '/strategy'
						})
            this.$store.commit('changeSignpop', '')
					} else if(res.code === 602) {
						layer.msg('身份未认证')
						// 身份验证 user?index=2&type=idCard
						this.$router.push({
							path: '/user',
							query: {
								index: 2,
								type: 'idCard'
							}
						})
            this.$store.commit('changeSignpop', '')
					} else if(res.code === 4000) {
						layer.msg('余额不足')
						// 余额不足
						this.$router.push({
							path: '/money'
						})
            this.$store.commit('changeSignpop', '')
					} else {
						layer.msg(res.msg)
						this.$store.commit('changeSignpop', '')
					}

				})
			},

		},

	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/User.css";
	.popContainer .popContent .close {
		color: #fff;
	}

	.login_top {
		background: #ff5d5e;
		height: 180px;
		border-radius: 10px 10px 0 0;
		color: #fff;
	}

	.login_title {
		position: relative;
		top: 40px;
		font-size: 24px;
		font-weight: 500;
		text-align: center;
		width: 500px;
	}

	.Head_portrait {
		margin-top: 80px;
		margin-left: auto;
		margin-right: auto;
		width: 160px;
		height: 160px;
		border-radius: 50%;
		background: #fff;
		padding: 10px;
		cursor: pointer;
	}

	.photo {
		width: 140px;
		height: 140px;
		border-radius: 50%;
		background: #3b3b3b;
		color: #fff;
		padding: 25px 30px;
	}

	.login_cen {
		position: relative;
		top: 100px;
		text-align: center;
	}
</style>
