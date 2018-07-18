<template>
	<div class="foundContainer">
		<top ref="top"></top>
		<div class="found_toolbar">
			<div class="contWidth">
				<div class="start_stop_time">
					<div>
						<input type="date" class="time_input" @change='changeDate' v-model='startDate'> 
						<span>{{startDate}}</span>
					</div>
					<em style="line-height:36px;">&nbsp;&nbsp;-&nbsp;&nbsp;</em>
					<div>
						<input type="date" class="time_input" @change='changeDate' v-model='endDate'>
						<span>{{endDate}}</span>
					</div>
					<span class="confirm_btn">
            			<button @click="changeDate">查询</button>
          			</span>
				</div>
			</div>
		</div>
		<div class="History">
			<div class="contWidth">
				<div class="History-title">
					<icon class="icon" name="List" scale="2.6"></icon>历史策略
				</div>
				<dl v-if="hasData">
					<dd v-for="(item,index) in historyList" class="an_History">
						<ul>
							<li style="width:25%;">
								<strong>{{item.stockName}}</strong>{{item.stockCode}}
							</li>
							<li style="width:15%;">
								盈亏 <span :class="item.settleProfit>=0?'red':'green'">{{item.settleProfit!=undefined?item.settleProfit.toFixed(2):'-'}}</span>
							</li>
							<li style="width:15%;">
								持仓 {{item.stockNumber}}股
							</li>
							<li style="width: 30%;">
								结算日期 {{item.settleTime}}
							</li>
							<li style="width:15%;">
								<button @click="changeDetail(index,item.stockId)" data-toggle="modal" data-target="#myModal">查看详情</button>
								
							</li>
						</ul>
					</dd>
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
				</dl>
				<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
					<deta ref="deta"></deta>
				</div>
				<!--无数据-->
				<div v-if="!hasData" style="margin-top:130px; text-align:center;">
					<img src="../assets/img/nodata.png" alt="" />
					<p style="margin-top:20px;font-size:20px;">暂时木有数据呀 ~ ~</p>
				</div>
			</div>
		</div>
		<fot ref="fot"></fot>
	</div>
</template>

<script>
	import Header from '@/components/common/Header';
	import Fot from '@/components/common/Footer';
	import Icon from 'vue-svg-icon/Icon.vue';
	import Details from '@/components/History_details';
	import { APIS } from '../utils/apis.js'
	import COMMON from '@/utils/common'
	let vm;

	export default {
		data() {
			return {
				startDate: '',
				endDate: '',
				pageNum: 1,
				pageSize: 7,
				historyList: [],
				totalPage:1,
				hasData: false,
				pageNumArr:[],
			}
		},
		components: {
			"top": Header,
			'fot': Fot,
			'deta': Details,
			Icon
		},
		mounted() {
			vm = this;
//			vm.changeDate()
			vm.getSeatchDate()
		},
		methods: {
			//获取默认的搜索时间(前7天至今)
			getSeatchDate() {
				let date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				vm.endDate = year + '-' + month + '-' + day

				let beforeDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
				vm.startDate = beforeDate.getFullYear() + "-" + (beforeDate.getMonth() + 1) + "-" + beforeDate.getDate();
				vm.historyTaddOne()
			},
			//历史列表
			historyTaddOne() {
				APIS.historyTaddOne(vm.startDate, vm.endDate, vm.pageNum, vm.pageSize, function(res) {
					if(res.code == 0 && res.data.result.length > 0) {
						vm.historyList = res.data.result
						vm.hasData = true
						vm.totalPage = res.data.totalPage
  					//执行带省略号分页样式分页
  					if(vm.totalPage > 10){
//		  					console.log(COMMON.getPagination(vm.currentPage,vm.totalPage,vm.pageNumArr))
	  					vm.pageNumArr = COMMON.getPagination(vm.pageNum,vm.totalPage,vm.pageNumArr)
  					}
						//						console.log(vm.historyT1List)
					} else {
						vm.hasData = false
					}
				})
			},
			//选择时间
			changeDate() {
				vm.historyT1List = undefined
				vm.pageNum = 1
				vm.historyTaddOne()
			},
			//减少页码数
	  		subPagrNo(){
	  			if(vm.pageNum > 1){
	  				vm.pageNum--;
	  				vm.historyTaddOne()
	  			}
	  		},
	  		//增加页码数
	  		addPagrNo(){
	  			if(vm.pageNum < vm.totalPage){
	  				vm.pageNum++;
	  				vm.historyTaddOne()
	  			}
	  		},
	  		//选择特定页码数
	  		chosePageNo(index){
//	  			console.log(index)
	  			if(index == vm.pageNum || index == '...'){
					return
				}
				vm.pageNum = index;
				vm.historyTaddOne()
	  		},
	  		//显示详情
	  		changeDetail(index,id){
//	  			vm.$refs.deta.id = id
	  			vm.$refs.deta.strategyDetail(id)
	  		},
		}
	}
</script>

<style scoped>
	@import "../assets/css/style.css";
	.clear {
		clear: both;
	}
	
	.red {
		color: #ff5d5e;
	}
	
	.green {
		color: #76cf75;
	}
	
	.but_history {
		width: 120px;
		height: 36px;
		border-radius: 18px;
		border: 2px solid #5bc1d7;
		line-height: 32px;
		font-size: 16px;
		color: #282828;
		cursor: pointer;
	}
	
	.contWidth {
		margin: 0 auto;
		display: block;
		min-width: 1200px;
		width: 66%;
	}
	
	.found_toolbar {
		display: block;
		width: 100%;
		height: 68px;
		background: #3b3b3b;
		padding: 16px 0;
		text-align: left;
	}
	
	.start_stop_time {
		display: flex;
		width: 480px;
		height: 36px;
		color: #fff;
	}
	.start_stop_time div{
		position:relative;
	}
	.start_stop_time div span{
		position:absolute;
		top:7px;
		left:15px;
		background:#3b3b3b;
		width:110px;
		/*height:30px;*/
		/*line-height:30px;*/
		text-align:center;
		overflow:hidden;
	}
	.time_input {
		position:relative;
		color: #fff;
		background: none;
		border: 1px solid #ddd;
		height: 36px;
		font-size: 14px;
		padding-left: 20px;
		width: 160px;
		border-radius: 18px;
	}
	.time_input::-webkit-clear-button {    /*控制date清除按钮*/
	  	visibility: hidden;
	}
	.time_input::-webkit-calendar-picker-indicator {      /*控制date下拉小箭头的*/
		background:transparent;
		margin-right:10px;
	}
	.confirm_btn button {
		border: 0;
		width: 120px;
		height: 36px;
		background: #5bc1d7;
		border-radius: 18px;
		margin-left: 10px;
		color: #fff;
		margin-top:3px;
	}
	
	.History {
		position:relative;
		display: block;
		width: 100%;
		min-height: 880px;
		padding-top: 40px;
		padding-bottom: 170px;
		background: #f1f1f1;
	}
	
	.History-title {
		font-size: 24px;
		color: #585858;
		text-align: left;
	}
	
	.History-title .icon {
		margin-bottom: -3px;
		margin-right: 5px;
		color: #ff5d5e;
	}
	
	.History dl dd {
		margin-top: 10px;
		width: 100%;
		height: 80px;
		background: #fff;
		padding: 20px;
		border-radius: 2px;
	}
	.History .pagination{
		/*position:absolute;
		bottom:70px;
		right:100px;*/
		float: right;
	}
	.History .pagination .active a{
		background:#ff5d5e;
		color:#fff;
	}
	.History .pagination a{
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
	.an_History ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	.an_History ul li {
		float: left;
		line-height: 40px;
		color: #585858;
		font-size: 16px;
	}
	
	.an_History ul li strong {
		font-size: 24px;
		margin-right: 5px;
	}
	
	.an_History ul li button {
		width: 120px;
		height: 36px;
		border: 2px solid #ff5d5e;
		border-radius: 18px;
		background: none;
		line-height: 36px;
		color: #ff5d5e;
		font-weight: 600;
	}
</style>