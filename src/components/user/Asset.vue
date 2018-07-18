<template>
	<div id="User_back">
		<div class="contWidth">
			<div class="User_content_top">
				<div class="Asset_type Frame">
					<span @click="choseShow = !choseShow">{{content}}</span>
					<div v-show="choseShow">
						<p @click="content = item.name;btype=item.val;choseShow = false;startUserMoneyCashLog()" v-for="(item,index) in choseList">
							{{item.name}}
						</p>
					</div>
				</div>
				<div class="time_input">
					<span>
						<input type="date" @change="pageNum =1;startUserMoneyCashLog()" class="Frame" v-model="startDate">
						<i>{{startDate}}</i>
					</span>
					 -
					 <span>
					 	<input type="date" @change="pageNum =1;startUserMoneyCashLog()" class="Frame" v-model="endDate">
					 	<i>{{endDate}}</i>
					 </span>
					
				</div>
				<div class="confirm_btn">
					<button @click="pageNum =1;startUserMoneyCashLog()">查询</button>
				</div>
				<div class="clear"></div>
			</div>
			<div v-show="hasContent" class="User_content_list">
				<dl>
					<dt>
		              <span>交易时间</span>
		              <span>交易类型</span>
		              <span>交易金额</span>
		              <span>账户余额</span>
		              <span>备注</span>
		            </dt>
					<dd v-for="(item,index) in finaDetails">
						<span>{{item.dateAdd}}</span>
						<span>{{item.typeStr}}</span>
						<span>
							<i v-if="item.behavior == 0&& item.amount > 0">+{{item.amount}}</i>
							<i v-else-if="item.behavior == 0&& item.amount < 0">{{item.amount}}</i>
							<i v-else-if="item.behavior == 1&& item.amount > 0">-{{item.amount}}</i>
							<i v-else>{{item.amount}}</i>
						</span>
						<span>{{item.balance}}</span>
						<span>{{item.orderNumber}}</span>
					</dd>
				</dl>
				<!--分页-->
				<ul class="pagination">
					<li @click='subPagrNo' class='pointer'>
						<a aria-label="Previous">
							<span aria-hidden="true">&laquo;</span>
						</a>
					</li>
					<li v-if='totalPage <= 10' @click='chosePageNo(item)' :class="item == pageNum?'active':''" v-for='item in totalPage' class='pointer'>
						<a>{{item}}</a>
					</li>
					<li v-if='totalPage > 10' @click='chosePageNo(item)' :class="item == pageNum?'active':''" v-for='item in pageNumArr' class='pointer'>
						<a>{{item}}</a>
					</li>

					<li @click='addPagrNo' class='pointer'>
						<a aria-label="Next">
							<span aria-hidden="true">&raquo;</span>
						</a>
					</li>
				</ul>
			</div>
			<!--无数据-->
			<div v-show="!hasContent" style="margin-top:130px;text-align:center;">
				<img src="../../assets/img/nodata.png"/>
				<p style="margin-top:20px;font-size:20px;">暂时木有数据呀 ~ ~</p>
			</div>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue';
	import { APIS } from '../../utils/apis.js';
	import COMMON from '@/utils/common'
	let vm;
	
	export default {
		data() {
			return {
				typeStr: '',
				choseList:[
					{name:'全部',val:""},
					{name:'充值',val:"recharge"},
					{name:'提现',val:"withdraw"},
					{name:'其他',val:"other"}, 
				],
				btype:"",
				choseShow:false,
				content:"全部",
//				choseVal:"",
				startDate:"起始时间",
				endDate:"截止时间",
				pageNum:1,
				pageSize:10,
				hasContent:false,
				totalPage:1,
				finaDetails:[],
				pageNumArr:[]
				
			}
		},
		components: {
			Icon,
		},
		mounted(){
			vm = this;
			
		},
		methods:{
			//资金明细
			startUserMoneyCashLog() {
				vm.finaDetails = []
//				console.log(vm.pageNum)
				APIS.userMoneyCashLog('',vm.btype,vm.startDate,vm.endDate, vm.pageNum, vm.pageSize,function(data) {
					if(data.code == 0) {
						vm.hasContent = true;
						vm.totalPage = data.data.totalPage
						let arryDatas = data.data.result;
						arryDatas.forEach(function(elem) {
							vm.finaDetails.push(elem);
						});
						//执行带省略号分页样式分页
	  					if(vm.totalPage > 10){
	//		  					console.log(COMMON.getPagination(vm.currentPage,vm.totalPage,vm.pageNumArr))
		  					vm.pageNumArr = COMMON.getPagination(vm.pageNum,vm.totalPage,vm.pageNumArr)
	  					}

					} else if(data.code == 700) {
						vm.hasContent = false;
					}
				})
			},
			//减少页码数
	  		subPagrNo(){
	  			if(vm.pageNum > 1){
	  				vm.pageNum--;
	  				vm.startUserMoneyCashLog()
	  			}
	  		},
	  		//增加页码数
	  		addPagrNo(){
	  			if(vm.pageNum < vm.totalPage){
	  				console.log(vm.pageNum)
	  				vm.pageNum++;
	  				console.log(vm.pageNum)
	  				vm.startUserMoneyCashLog()
	  			}
	  		},
	  		//选择特定页码数
	  		chosePageNo(index){
//	  			console.log(index)
	  			if(index == vm.pageNum || index == '...'){
					return
				}
				vm.pageNum = index;
				vm.startUserMoneyCashLog()
	  		},
		}
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	.clear {
		clear: both;
	}
	
	.red {
		color: #ff5d5e;
	}
	
	.green {
		color: #76cf75;
	}
	
	.back-red {
		background: #ff5d5e;
	}
	
	.back-blue {
		background: #5bc1d7;
	}
	
	.contWidth {
		margin: 0 auto;
		display: block;
		min-width: 1200px;
		width: 66%;
		text-align: center;
	}
	
	#User_back {
		position:relative;
		display: block;
		width: 100%;
		min-height: 880px;
		padding-top: 80px;
		padding-bottom: 100px;
		background: #f1f1f1;
		/*z-index:-1;*/
	}
	
	.User_content_top {
		text-align: left;
	}
	
	.Asset_type,
	.time_input,
	.confirm_btn {
		float: left;
		margin-right: 20px;
	}
	
	.Frame {
		width: 180px;
		height: 36px;
		background: none;
		border: 1px solid #ddd;
		line-height: 36px;
		font-size: 16px;
		border-radius: 18px;
	}
	.Asset_type{
		text-align:center; 
		position:relative;
		cursor:pointer;
	}
	.Asset_type span{
		display:inline-block;
		width:100%;
		height:100%;
	}
	.Asset_type div{
		position:absolute;
		top:36px;
	}
	.Asset_type p {
		width:170px;
		height:36px;
		border-radius: 18px;
		line-height:36px;
		padding-left:10px; 
		padding-right:10px;
		background:rgba(255,255,255,.8);
		margin:0 0 1px 0;
	}
	.Asset_type p:hover{
		background:rgba(255,93,94,.8);
		color: #fff;
	}
	.form-type {
		width: 180px;
		height: 36px;
		background: none;
		border: none;
		opacity: 0;
		padding-left: 20px;
		font-size: 16px;
		display: absolute;
		z-index: 20;
	}
	.time_input span{
		position:relative;
		display:inline-block;
		height:36px;
	}
	.time_input input {
		padding-left: 20px;
		padding-right: 5px;
		text-align: center;
	}
	.time_input span i{
		position:absolute;
		top:1px;
		left:20px;
		width:120px;
		height:34px;
		text-align: center;
		background:#f1f1f1;
		line-height:34px;
	}
	.confirm_btn button {
		width: 120px;
		height: 36px;
		background: #ff5d5e;
		border: none;
		border-radius: 18px;
		color: #fff;
	}
	
	.User_content_list {
		margin-top: 20px;
	}
	
	.User_content_list dl,
	.User_content_list dl dt {
		margin: 0;
		padding: 0;
	}
	
	.User_content_list dl dt {
		display: block;
		width: 100%;
		height: 48px;
		line-height: 48px;
		background: #dddddd;
		border-radius: 24px;
	}
	
	.User_content_list dl dt span {
		display: inline-block;
		width: 19%;
		font-size: 15px;
	}
	
	.User_content_list dl dd {
		display: block;
		width: 100%;
		padding: 30px 0;
		border-bottom: 1px dotted #bbb;
		margin-bottom: 0;
	}
	
	.User_content_list dl dd:hover {
		font-size: #ff5d5e;
		border-radius: 4px;
	}
	
	.User_content_list dl dd span {
		display: inline-block;
		width: 19%;
		font-size: 15px;
	}
	
	.User_content_list .pagination{
		/*position:absolute;
		bottom:20px;
		right:100px;*/
		float: right;
	}
	.User_content_list .pagination .active a{
		background:#ff5d5e;
		color:#fff;
	}
	.User_content_list .pagination a{
		width: 30px;
	    height: 30px;
	    padding:0;
	    line-height:30px;
	    border-radius: 50%;
	    border: 1px solid #ddd;
	    margin: 0 5px;
	    color: #282828;
	    font-size: 14px;
	}
	input[type="date"]::-webkit-clear-button {    /*控制清除按钮*/
		visibility: hidden;
	}
</style>