<template>
	<div class="personPop">
		<div class="popcontent">
			<div class="title">
				<span>
					<icon name="Loginpassword" scale="6"></icon>
				</span>
				<em>修改登录密码</em>
				<i @click="closePop">&times;</i>
			</div>
			<div @keyup.enter="changeLoginPaw" class="center">
				<div>
					<label for="mobile">原&nbsp;密&nbsp;码</label>
					<i></i>
					<input v-model="oldPaw" />
				</div>
				<div>
					<label for="mobile">新&nbsp;密&nbsp;码</label>
					<i></i>
					<input v-model="newPaw" />
				</div>
				<div>
					<label for="mobile">确认密码</label>
					<i></i>
					<input v-model="newPawAgain" />
				</div>
				<button @click="changeLoginPaw">确&nbsp;&nbsp;&nbsp;&nbsp;认</button>
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
				oldPaw: '',
				newPaw: '',
				newPawAgain: ''
			}
		},
		components: {
			Icon
		},
		mounted() {
			vm = this;
		},
		methods: {
			//修改
			changeLoginPaw() {
				if(!APIS.checkPassword(vm.oldPaw) || !APIS.checkPassword(vm.newPaw)) {
					return
				}
				if(vm.newPaw != vm.newPawAgain) {
					layer.msg('新密码不一致');
					return
				}
				APIS.updateLoginPsw(vm.oldPaw, vm.newPaw, function(data) {
//					console.log(data)
					if(data.code != 0) {
						layer.msg(data.msg);
					}
					//退出登录,并跳转至登录页面
					APIS.userLoginOut(function(data) {
						if(data.code != 0){
							layer.msg(data.msg);
							return
						}
						vm.closePop()
						vm.$router.push("/?shadow=login&redirect=user")
					})
				})
			},
			//关闭弹框
			closePop(){
				vm.$parent.popType = ""
				vm.oldPaw="";
				vm.newPaw="";
				vm.newPawAgain="";
			},
		},
	}
	
</script>
<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/personPop.css";
</style>