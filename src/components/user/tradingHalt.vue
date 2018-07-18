<template>
	<div id="User_back">
		<div v-show="hasData" class="contWidth">
			<dl class="halt_list">
				<dd v-for="(item,index) in stopStockList">
					<div class="halt_shares">
						<div class="halt_shares_top">
							<h4>{{item.stockName}}</h4>
							<p>{{item.stockCode}}</p>
						</div>
						<div class="halt_shares_cen">
							<ul>
								<li>盈亏：<span :class="item.gainLoss>=0?'red':'green'">{{item.gainLoss!=undefined?item.gainLoss.toFixed(2):'-'}}</span></li>
								<li>数量：<span>{{item.positionNum}}股</span></li>
								<li>成交均价：<span>{{item.buyPriceMean}}</span></li>
								<li v-if="!item.sellAveragePrice">当前价格：<span>{{item.newPrice!=undefined?item.newPrice.toFixed(2):'-'}}</span></li>
								<li v-if="item.sellAveragePrice">卖出价格： <span>{{item.sellAveragePrice.toFixed(2)}}</span></li>
								<li>买断时间：<span>{{item.dateAdd}}</span></li>
								<li>卖出时间：<span>{{item.sellTime?item.sellTime:'-'}}</span></li>
							</ul>
						</div>
						<div class="halt_shares_down">
							<button style="background:#ff5d5e;color:#fff;" v-if="item.status == 2" @click="popController('stopSale',item.id,index)">卖出</button>
							<button v-if="item.status != 2">{{item.statusStr}}</button>
							<!--<button type="button">停牌</button>-->
						</div>
					</div>
				</dd>
				<div class="clear"></div>
			</dl>
		</div>
		<!--无数据-->
		<div v-show="!hasData" style="margin-top:130px;text-align:center;">
			<img src="../../assets/img/nodata.png"/>
			<p style="margin-top:20px;font-size:20px;">暂时木有数据呀 ~ ~</p>
		</div>
		<!--弹窗-->
		<div v-if="$route.path == '/user'&&$parent.leftIndex == 1">
			<inputPop v-show="inputPopShow" ref='inputPop'></inputPop>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue';
	import InputPop from '../common/InputPop.vue'
	import { APIS } from '../../utils/apis.js';
	let vm;
	export default {
		data() {
			return {
				hasData: false,
				stopStockList: [],
				inputPopShow: false,
				popType: "",
			}
		},
		components: {
			Icon,
			InputPop
		},
		mounted() {
			vm = this;
			
		},
		methods: {
			//停牌股票列表
			getStopStockList() {
				APIS.stopStockList(function(res) {
					if(res.code == 0 && res.data.length > 0) {
						vm.hasData = true
						vm.stopStockList = res.data
						vm.stopStockList.forEach(function(item) {
							//成交均价
							if(item.buyCostTotal && item.buyDoneNum) {
								item.buyPriceMean = (item.buyCostTotal / item.buyDoneNum).toFixed(2)
							} else {
								item.buyPriceMean = 0
							}
						})
					} else {
						vm.hasData = false
					}
				})
			},
			//卖出弹窗
			popController(type, strategyId, index) {
				console.log(strategyId)
				vm.inputPopShow = true
				vm.$refs.inputPop.popTit = '卖出'
				vm.popType = type
				vm.$refs.inputPop.stockId = strategyId
				console.log(vm.stopStockList[index])
				vm.$refs.inputPop.saleData = {
					stockName: vm.stopStockList[index].stockName,
					stockCode: vm.stopStockList[index].stockCode,
					gainLoss: vm.stopStockList[index].gainLoss,
					positionNum: vm.stopStockList[index].positionNum
				}
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
		background: #ff5d5e!important;
		color: #fff!important;
	}
	
	.back-blue {
		background: #5bc1d7;
	}
	
	#User_back {
		display: block;
		width: 100%;
		min-height: 880px;
		padding-top: 80px;
		padding-bottom: 60px;
		background: #f1f1f1;
	}
	
	.contWidth {
		margin: 0 auto;
		display: block;
		min-width: 1200px;
		width: 66%;
		position: relative;
		text-align: center;
	}
	
	.halt_list dd {
		width: 25%;
		float: left;
		padding: 10px;
	}
	
	.halt_shares {
		background: #fff;
		border-radius: 10px;
		padding: 20px;
		color: #282828;
	}
	
	.halt_shares_top {
		width: auto;
		border-bottom: 1px dotted #ddd;
	}
	
	.halt_shares_top H4 {
		font-weight: 900;
		margin-bottom: 0;
	}
	
	.halt_shares_top p {
		margin-bottom: 5px;
	}
	
	.halt_shares_cen {
		padding: 20px 0;
	}
	
	.halt_shares_cen ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	
	.halt_shares_cen ul li {
		text-align: left;
		padding: 5px 0;
	}
	
	.halt_shares_cen ul li span {
		float: right;
	}
	
	.halt_shares_down {
		width: 100%;
	}
	
	.halt_shares_down button {
		width: 68%;
		height: 36px;
		border: none;
		background: #dddddd;
		border-radius: 18px;
		font-weight: 600;
	}
	
	.bs_example {
		width: 100%;
		margin-top: 20px;
	}
	
	.bs_example nav {
		float: right;
	}
	
	.bs_example nav ul li a {
		display: inline-block;
		width: 24px;
		height: 24px;
		padding: 2px 0;
		border-radius: 50%;
		border: 1px solid #ddd;
		margin: 0 5px;
		color: #282828;
		font-size: 14px;
	}
	
	.bs_example nav ul li a:hover {
		background: #ff5d5e;
		color: #ffffff;
	}
</style>