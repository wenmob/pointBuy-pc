<template>
	<div class="popContainer">
		<div class="popContent">
			<!-- <div class="close" @click="$parent.popType = ''">&times;</div> -->
			<div class="Headportrait">
				<h3>头&nbsp;&nbsp;像</h3>
				<div class="Head_portrait">
		          	<div class="photo">
		          		<icon class="icon" name="PhotoUploading" scale="10"></icon>
		          		<span>上传图片</span>
		          	</div>
		        </div>
		        <p>仅支持JPG、PNG格式，文件小于1M（方形图）</p>
		        <div class="Headportrait_but">
		        	<button type="button">保存</button>
		        	<button type="button" @click="$parent.shadowType = ''">取消</button>
		        </div>
			</div>
		</div>
	</div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue';
	let vm;
	
	export default {
		data() {
			return {
				
			}
		},
		components: {
			Icon
		},
		mounted() {
			vm = this;
		},
		methods: {
			
		},
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	.popContainer{
		position:fixed;
		top:0;
		width:100%;
		height:100%;
		background:rgba(0,0,0,.5);
		text-align:center;
	}
	.popContainer .popContent{
		position:fixed;
		top:0;
		left:0;
		right:0;
		bottom:0;
		margin:auto;
		width:500px;
		height:600px;
		background:#fff;
		border-radius: 10px;
	}
	.Headportrait{
		position: relative;
	}
	.Headportrait h3{
		position: relative;
		top: 100px;
		font-size: 30px;
	}
	.Head_portrait{
	    position: relative;
	    top:140px;
	    left: 170px;
	    width: 160px;
	    height: 160px;
	    border-radius: 50%;
	    background: #f1f1f1;
	    padding: 10px;
	    cursor: pointer;
	}
	.photo{
	    width: 140px;
	    height: 140px;
	    border-radius: 50%;
	    background: #3b3b3b;
	    color: #fff;  
	}
	.photo .icon{
		margin-top: 10px;
	}
	.photo span{
		display: block;
		position: relative;
		top: -20px;
	}
	.Headportrait p{
		position: relative;
		top: 160px;
		font-size: 14px;
		color: #585858;
	}
	.Headportrait_but{
		position: relative;
		top: 200px;
	}
	.Headportrait_but button{
		width: 150px;
		height: 46px;
		border:1px solid #ddd;
		border-radius: 23px;
		line-height:46px;
		margin: 0 20px;
		font-size: 16px;
		color: #282828;
	}
</style>