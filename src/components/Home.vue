<template>
	<div class='homeContainer'>
		<top ref="top" class="top"></top>
		<hhh class="hhh"></hhh>
	</div>
</template>

<script>
	import Header from '@/components/common/Header';
	import Fot from '@/components/common/Footer';
	import Icon from 'vue-svg-icon/Icon.vue';
	import HHH from '@/components/HHH';

	let vm;
	export default {
		data() {
			return {
				shadowShow: '',
			}
		},
		components: {
			"top": Header,
			'fot': Fot,
			Icon,
			'hhh': HHH
		},
		beforeDestroy() {
			// $('body').css('overflow', 'auto')
		},
		//整屏
		mounted() {
			vm = this
		},
		methods: {
			
		}
	}
</script>

<style>
	.homeContainer {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	.top {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 11;
	}
</style>