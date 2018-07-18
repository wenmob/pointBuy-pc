<template>
	<div class="serve-conter">
		<div class="serve_title">
			<icon class="red" name="Agreement" scale="3"></icon><span>相关协议</span>
		</div>
		<div class="serve_conter">
			<ul class="agreement_list">
				<li><router-link to="Text?type=rule&index=protocol" tag='div'>平台服务协议</router-link></li>
				<li><router-link to="Text?type=rule&index=t1protocol" tag='div'>A股交易合作协议</router-link></li>
			</ul>
		</div>
	</div>
</template>

<script>
//	import { API } from "../../utils/api.js"
	import Icon from 'vue-svg-icon/Icon.vue'
	let vm;
	
	export default{
		data(){
			return{
				
			}
		},
		components: {
			Icon
		},
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	.serve-conter{
		color: #282828;
		font-size: 16px;
	}
	.serve_title{
		text-align: left;
		border-bottom: solid 1px #bbb;
		padding: 5px 0;
	}
	.serve_title span{
		position: relative;
		top: -7px;
		left: 8px;
		font-weight: 600;
	}
	.serve_conter{
		text-align: left;
		padding: 0 20px;
	}
	
	.agreement_list{
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.agreement_list li{
		border-bottom: dotted 1px #ddd;
		padding: 15px 10px;
		position: relative;
		font-size: 16px;
		cursor:pointer;
	}
</style>