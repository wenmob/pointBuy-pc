<template>
	<div class="headerContainer">
		<div class="top_toolbar">
			<div class="contWidth">
				<div class="tele">服务热线：{{commonInfo.tel}}</div>
				<div v-if="!isLogin" class="toolbar">
					<span @click="changeShadow('login')">登录</span> |
					<span @click="changeShadow('register')">注册</span>
				</div>
				<div v-if="isLogin" class="toolbar">
					<span>{{userInfo.mobile}}</span> |
					<span @click="userLoginOut">退出</span>
				</div>
			</div>
		</div>
		<div class="top_logo_nav">
			<div class="contWidth">
				<div class="logo">
					<img :src="commonInfo.logo" height="60" />
					<span>{{commonInfo.siteName}}</span>
				</div>
				<div class="nav_right">
					<ul>
						<router-link :class="item.path == routePath ? 'headerActive' : ''" v-for='(item,index) in headerData' :to='item.path' tag='li'>{{item.name}}</router-link>
					</ul>
				</div>
			</div>
		</div>
	</div>
	</div>
</template>

<script>
	import { APIS } from '../../utils/apis.js';
	let vm;

	export default {
		data() {
			return {
				headerData: [{
						name: '首页',
						path: '/'
					},
					{
						name: '创建',
						path: '/Found'
					},
					{
						name: '策略',
						path: '/strategy'
					},
					{
						name: '我的',
						path: '/user'
					}
				],
				userInfo: {},
				routePath: '/',
				isLogin:false,
				commonInfo:{}
			}
		},
		mounted() {
			vm = this;
			vm.checklogin()
			vm.getCommon()
		},
		methods: {
			// 获取网站公共信息接口
			getCommon() {
				APIS.getCommon(function(res){
					if(res.code ==0){
						vm.commonInfo = res.data
					}
				})
			},
			//判断是否登录
			checklogin(){
				APIS.checklogin(function(res){
					if(res.code == 0){
						vm.isLogin = true
						vm.getBaseUserInfo()
					}else{
						vm.isLogin = false
					}
				})
			},
			getBaseUserInfo() {
				APIS.getBaseUserInfo(function(res){
//					console.log(res)
					if(res.code == 0){
						vm.userInfo = res.data
					}
				})
			},
			//显示弹框
			changeShadow(type) {
				/*if(vm.$route.query.shadow) {
					lacation.reload()
				} else {
					if(JSON.stringify(vm.$route.query) == "{}") {
						vm.$router.push(vm.$route.fullPath + "?shadow=" + type)
					} else {
						vm.$router.push(vm.$route.fullPath + "&shadow=" + type)
					}
				}*/
				this.$store.commit('changeSignpop', type)
			},
			//退出登录
			userLoginOut(){
				APIS.userLoginOut(function(res){
//						console.log(res)
					if(res.code == 0){
						if(vm.$route.path == "/"){
							location.reload()
						}else{
							vm.$router.push('/')
						}
						
					}
					
				})
			},
		}
	}
</script>

<style scoped>
	.router-link-exact-active.router-link-active{
		border-bottom: 1px solid #ff5d5e;
	}
	.contWidth {
		margin: 0 auto;
		display: block;
		min-width: 1200px;
		width: 66%;
	}
	
	.headerContainer {
		display: block;
		width: 100%;
		color: #fff;
	}
	
	.top_toolbar {
		display: block;
		width: 100%;
		height: 30px;
		background: #3b3b3b;
		border-bottom: 1px solid #282828;
		font-size: 14px;
		line-height: 30px;
	}
	
	.top_toolbar span {
		cursor: pointer;
	}
	
	.top_logo_nav {
		display: block;
		width: 100%;
		height: 88px;
		background: #282828;
		border-top: 1px solid #3b3b3b;
		padding: 14px 0;
	}
	
	.tele,
	.logo {
		float: left;
		text-align: left;
	}
	.logo span{
		padding-left:20px;
	}
	.toolbar,
	.nav_right {
		float: right;
		text-align: right;
	}
	
	.nav_right ul {
		float: right;
		list-style: none;
		height: 57px;
	}
	
	.nav_right ul li {
		font-size: 16px;
		line-height: 58px;
		margin-left: 40px;
		float: left;
		cursor: pointer;
	}
	
	.headerContainer .headerActive {
		
	}
	
	.nav_right ul li:hover {
		border-bottom: 1px solid #fff;
	}
</style>