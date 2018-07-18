<template>
	<div class="personPop">
		<div class="popcontent">
			<div class="title">
				<span>
					<icon name="Realname" scale="6"></icon>
				</span>
				<em>实名认证</em>
				<i @click="closePop">&times;</i>
			</div>
			<div @keyup.enter="checkIdCard" class="center">
				<div>
					<label for="mobile">真实姓名</label>
					<i></i>
					<input v-model="tureName" />
				</div>
				<div>
					<label for="mobile">身份证号</label>
					<i></i>
					<input v-model="idCard" />
				</div>
				<button @click="checkIdCard">确认认证</button>
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
				tureName:'',
				idCard:''
			}
		},
		components: {
			Icon
		},
		mounted() {
			vm = this;
		},
		methods: {
			//认证
			checkIdCard(){
	    		if(APIS.IdCard(vm.idCard)){
	    			APIS.checkIdcard(vm.tureName,vm.idCard,function(data){
	//	    			console.log(data)
		    			if(data.code == 0 || data.code == 602){/*602指之前已认证过*/
		    				vm.closePop()
		    			}else if(data.code == 600){
		    				layer.msg('信息不完整');
		    			}else{
		    				layer.msg(data.msg);
		    			}
		    		})
	    		}
	
	    	},
	    	//关闭弹框
			closePop(){
				vm.$parent.popType = ""
				vm.tureName='';
				vm.idCard='';
			},
		},
	}
	
</script>
<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/personPop.css";
</style>