<template>
	<div class="serve-conter">
		<div class="serve_title">
			<icon class="red" name="Notice" scale="3"></icon><span>平台公告</span>
		</div>
		<div class="serve_conter">
			<ul class="Notice_list">
				<li v-for="(item,index) in $parent.noticeList">
					<router-link :to="'Text?type=notice&id='+item.id" tag='div'>
						{{index+1}}、 {{item.title}}
						<span>{{item.dateAdd}}</span>
					</router-link>
				</li>
			</ul>
			<!--分页-->
			<ul class="pagination">
				<li @click='subPagrNo' class='pointer'>
					<a aria-label="Previous">
						<span aria-hidden="true">&laquo;</span>
					</a>
				</li>
				<li v-if='$parent.totalPage <= 10' @click='chosePageNo(item)' :class="item == $parent.currentPage?'active':''" v-for='item in $parent.totalPage' class='pointer'>
					<a>{{item}}</a>
				</li>
				<li v-if='$parent.totalPage > 10' @click='chosePageNo(item)' :class="item == $parent.currentPage?'active':''" v-for='item in $parent.pageNumArr' class='pointer'>
					<a>{{item}}</a>
				</li>

				<li @click='addPagrNo' class='pointer'>
					<a aria-label="Next">
						<span aria-hidden="true">&raquo;</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	//	import { API } from "../../utils/api.js"
	import Icon from 'vue-svg-icon/Icon.vue'
	let vm;

	export default {
		data() {
			return {

			}
		},
		components: {
			Icon
		},
		mounted(){
			vm = this;
		},
		methods:{
			//减少页码数
	  		subPagrNo(){
	  			if(vm.$parent.currentPage > 1){
	  				vm.$parent.currentPage--;
	  				vm.$parent.getNotice()
	  			}
	  		},
	  		//增加页码数
	  		addPagrNo(){
	  			if(vm.$parent.currentPage < vm.$parent.totalPage){
	  				vm.$parent.currentPage++;
	  				vm.$parent.getNotice()
	  			}
	  		},
	  		//选择特定页码数
	  		chosePageNo(index){
//	  			console.log(index)
	  			if(index == vm.$parent.currentPage || index == '...'){
					return
				}
				vm.$parent.currentPage = index;
				vm.$parent.getNotice()
	  		},
		}
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	.serve-conter {
		color: #282828;
		font-size: 16px;
	}
	
	.serve_title {
		text-align: left;
		border-bottom: solid 1px #bbb;
		padding: 5px 0;
	}
	
	.serve_title span {
		position: relative;
		top: -7px;
		left: 8px;
		font-weight: 600;
	}
	
	.serve_conter {
		text-align: left;
		padding: 0 20px;
	}
	
	.Notice_list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	
	.Notice_list li {
		border-bottom: dotted 1px #ddd;
		padding: 15px 10px;
		position: relative;
		font-size: 16px;
		cursor:pointer;
	}
	
	.Notice_list li span {
		position: absolute;
		right: 10px;
	}
	.serve_conter .pagination{
		position:absolute;
		bottom:20px;
		right:100px;
	}
	.serve_conter .pagination .active a{
		background:#ff5d5e;
		color:#fff;
	}
	.serve_conter .pagination a{
		width: 30px;
	    height: 30px;
	    padding:0;
	    line-height:30px;
	    border-radius: 50%;
	    border: 1px solid #ddd;
	    margin: 0 5px;
	    color: #282828;
	    font-size: 14px;
	    text-align:center;
	}
	.serve_conter .pagination li:first-child a{
		line-height:28px;
	}
	.serve_conter .pagination li:last-child a{
		line-height:28px;
	}
</style>