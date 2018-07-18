<template>
	<div class="section">
		<div :style="{background: 'url('+ extensionBg +') no-repeat 50%'}" class="Promotion"></div>
		<fot></fot>
	</div>
</template>

<script>
	import Fot from '@/components/common/Footer';
	import { APIS } from '../../utils/apis.js';
	let vm;
	
	export default {
		data() {
			return {
					extensionBg:""
			}
		},
		components: {
			'fot': Fot,
		},
		mounted(){
			vm = this;
			vm.getbgPic("index_Extension_background")
		},
		methods: {
			//获取背景图片
			getbgPic(position) {
				APIS.getbgPic(position, function(res) {
					if(res.code != 0) {
						layer.msg(res.msg)
						return
					}
					vm.extensionBg = res.data.pic
				})
			},
		}
	}
</script>

<style>
	@import url("../../assets/css/page.css");
	.Promotion {
		display: block;
		width: 100%;
		height: 600px;
		/*background-size:cover;*/
		background-position: center;
		/*background: url(../../assets/img/background_02.jpg) 50%;*/
	}
</style>