<template>
	<div class="serve-conter">
		<div class="serve_title">
			<icon class="green" name="Novice" scale="3"></icon><span>新手指引</span>
		</div>
		<div class="serve_conter">
			<div v-for="item in $parent.noticeList">
				<h5><strong>{{item.title}}</strong></h5>
				<p v-html="item.content">
					
				</p>
			</div>
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
		padding-top: 20px; 
	}
	.serve_conter h5{
		padding-top: 15px;
	}
	.serve_conter h5 strong{
		font-size: 16px;
	}
	.serve_conter p{
		text-indent: 2em;
		color: #585858;
		padding-bottom: 10px;
		border-bottom: dotted 1px #ddd;
	}
	
</style>