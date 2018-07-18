<template>
	<div class="foundContainer strategyContainer">
		<top ref="top"></top>
		<div class="found_toolbar">
			<div class="contWidth">
				<div class="found_search">
					<input type="text" class="found_input" v-model="stock" @focus="stopBS" @input="searchStock($event)" placeholder="请输入股票代码或名称">
					<span class="found-group-btn">
			            <button class="btn search_btn" type="button"><icon name="Search" scale="2.2"></icon></button>
			        </span>
					<!--显示搜索内容-->
					<div class="found-input-d" v-show="fidShow">
						<div class="found-input-d-nrr" v-for="(sst,index) in serchSt" :key="index" @mouseover="onMouseOver($event)" @mouseout="onMouseOut($event)" @click="clickGuo(sst.stockCode)">
							<span>{{sst.stockName}}</span>
							<span>{{sst.stockCode.replace(/\D/g,'')}}</span>
						</div>
					</div>
				</div>
				<div class="logined">
		          <div class="logined_top">
		            <p>余额<strong>{{uesrMoney.balance}}</strong></p>
		          </div>
		          <div class="logined_down">
		            <router-link to="money" tag="button" class="back-red">充值</router-link>
		            <router-link to="money?type=6" tag="button" class="back-blue">提现</router-link>
		          </div>
		        </div>
			</div>
		</div>
		<div class="Strategy">
			<div class="contWidth">
				<div class="Strategy-title">
					<div class="Strategy-title_left">
						<icon class="icon" name="List" scale="2.6"></icon>策略持仓</div>
					<div class="Strategy-title_cen">
						总市值：
						<span class="red">{{marketValSum}}</span>
						策略盈亏：
						<span :class="gainLossSum>= 0?'red':'green'">{{gainLossSum}}</span>
						<!--余额：
						<span class="red">{{uesrMoney.balance!=undefined?uesrMoney.balance.toFixed(2):"-"}}</span>-->
					</div>
					<div class="Strategy-title_right">
						<router-link to='History' class="but_history" tag='div'>历史策略</router-link>
					</div>
					<div class="clear"></div>
				</div>
				<dl v-if="hasData">
					<dd class="an_Strategy" v-for="(item,index) in listT1">
						<div class="Strategy_data">
							<div>
								<ul>
									<li>
										<strong>{{item.stockName}}</strong>{{item.stockCode}}
									</li>
									<li>当前价格<span>{{item.newPrice!=undefined?item.newPrice.toFixed(2):'-'}}</span></li>
									<li>成交均价
										<span>
											{{item.buyAveragePrice!=undefined?item.buyAveragePrice.toFixed(2):'-'}}
										</span>
									</li>
									<li>持仓<span>{{item.positionNum}}股</span></li>

									<li>止盈<span class="red">{{item.profitStop!=undefined?item.profitStop.toFixed(2):'-'}}</span></li>
									<li>止损<span class="green">{{item.closeLine!=undefined?item.closeLine.toFixed(2):'-'}}</span></li>
									<li>
										盈亏
										<span :class="item.gainLoss>=0?'red':'green'">
											{{item.gainLoss!=undefined?item.gainLoss.toFixed(2):'-'}}
										</span>
									</li>
								</ul>
								<div class="but_Strategy">
									<i v-if='item.buttonType == 0'>等待接单</i>
									<i v-if='item.buttonType == 1'>等待买入</i>
									<button v-if='item.buttonType == 2'>新购</button>
									<button class="but_Strategy_red" @click="popController('sale','',item.id,index)" v-if='item.buttonType == 3'>卖出</button>
									<i v-if='item.buttonType == 4'>等待卖出</i>
									<button v-if='item.buttonType == 6'>停牌</button>
								</div>
							</div>
							<div v-if="item.warningStr">
								<icon name="warning5" scale="1.5" class="warning"></icon>
								{{item.warningStr}}
							</div>
						</div>
						<div class="Strategy_defer">
							<ul>
								<li>日期：{{item.buyTime}}</li>
								<li>递延条件：≥{{item.warningLine!=undefined?item.warningLine.toFixed(2):'-'}}</li>
								<li>递延费：{{item.continueFee!=undefined?item.continueFee.toFixed(2):'-'}}元</li>
								<li style="padding:0;" class="switch" v-if="item.continueFlag != -1">
									自动递延
									<em @click="autoContinueFlag(item.strategyId,0,index)" v-show='item.continueFlag == 1'>
					                  <icon class='openIcon' name='open' scale='5'></icon>
					                </em>
									<em @click="autoContinueFlag(item.strategyId,1,index)" v-show='item.continueFlag == 0'>
					                  <icon class='openIcon' name='close' scale='5'></icon>
					                </em>
								</li>
							</ul>
							<div v-if='item.buttonType != 6' class="Strategy_operation">
								<button @click="popController('changeZS','',item.id,index)">修改止损</button>
								<button @click="popController('addBZJ',item.strategyId,item.id,index)">增加保证金</button>
								<button v-if="item.needContinue ==1&&item.continueFlag != -1" @click="popController('handDefer',item.strategyId,'',index)">立即递延</button>
							</div>
							<div v-if='item.buttonType == 6' class="Strategy_operation">
								<button @click="popController('giveUp','',item.id,index)">放弃策略</button>
								<button @click="popController('buyStop','',item.id,index)">买断策略</button>
								<button v-if="item.needContinue ==1&&item.continueFlag != -1" @click="popController('handDefer',item.strategyId,'',index)">立即递延</button>
							</div>
							<div class="clear"></div>
						</div>
					</dd>
				</dl>
				<!--无数据-->
				<div v-if="!hasData" style="margin-top:130px;text-align:center;">
					<img src="../assets/img/nodata.png" />
					<p style="margin-top:20px;font-size:20px;">暂时木有数据呀 ~ ~</p>
				</div>
			</div>
		</div>
		<!--底部-->
		<fot ref="fot"></fot>
		<!--弹窗-->
		<div v-if="$route.path == '/strategy'">
			<inputPop v-show="inputPopShow" ref='inputPop'></inputPop>
		</div>
	</div>
</template>

<script>
	import Header from '@/components/common/Header';
	import Fot from '@/components/common/Footer';
	import InputPop from '@/components/common/InputPop';
	import { APIS } from '../utils/apis.js'
	import Icon from 'vue-svg-icon/Icon.vue';
	import { sinaStock } from '../quote/sina'

	let vm;
	export default {
		data() {
			return {
				fidShow: false,
				uesrMoney: {},
				inputPopShow: false,
				loadShow: true,
				hasData: false,
				listT1: [],
				isInval: true,
				marketValSum: '', // 总市值
				gainLossSum: '', // 策略盈亏
				stock: '',
				serchSt: [],
			}
		},
		mounted() {
			vm = this;
			vm.userMoneyInfo()
			vm.strategyListT1()
		},
		beforeDestroy() {
			this.isInval = false
		},
		components: {
			"top": Header,
			'fot': Fot,
			Icon,
			InputPop
		},
		methods: {
			// 当搜索input获取焦点的时候
			stopBS() {
				if(this.serchSt.length > 0) {
					this.fidShow = true
				} else {
					this.fidShow = false
				}
				this.$store.commit('changeListenStock', false)
				this.$store.commit('changeBeginAuto', false)
				this.$store.commit('changeStrue', false)
				this.$store.commit('changeLineC', false)
			},
			searchStock(e) {
				let _this = this
				let element = e.target.value
				_this.hasStock(element)
			},
			hasStock(element) {
				let _this = this
				// 渲染的数据内容
				let st = []
				this.getStockArray(element.toLowerCase()).then(res => {
					res.forEach(elem => {
						let arr = elem.split(',')
						if(arr[1] * 1 === 11) {
							let obj = {
								stockCode: arr[3],
								stockName: arr[4]
							}
							st.push(obj)
						}
					})
					_this.serchSt = st
					if(_this.serchSt.length > 0) {
						_this.fidShow = true
					} else {
						_this.fidShow = false
					}
				})
			},
			// 获取股票的信息
			getStockArray(k) {
				return new Promise((resolve, reject) => {
					sinaStock.getStock(k, (data) => {
						resolve(data)
					})
				})
			},
			// 鼠标移入的效果
			onMouseOver(e) {
				let _this = this
				let element = e.currentTarget
				element.style.background = '#f1f1f1'
			},
			// 鼠标移出的效果
			onMouseOut(e) {
				let _this = this
				let element = e.currentTarget
				element.style.background = 'transparent'
			},
			// 点击搜索后的效果
    		clickGuo(code){
//  			console.log(code)
    			vm.$router.push({path:"/Found",query:{code:code}})
    		},
			// 查看资产接口
			userMoneyInfo() {
				if(!vm.isInval) {
					return
				}
				APIS.userMoneyInfo(function(res) {
					if(res.code == 0) {
						vm.uesrMoney = res.data
					}
					setTimeout(() => {
						vm.userMoneyInfo()
					}, 5000)
				})
				
			},
			//弹出框
			popController(type, strategyId, stockId, index) {
//				console.log(stockId)
				vm.inputPopShow = true
				vm.popType = type
				vm.$refs.inputPop.strategyId = strategyId
				vm.$refs.inputPop.stockId = stockId

				if(type == 'changeZS') {
					vm.$refs.inputPop.popTit = '修改止损'
					vm.$refs.inputPop.closeLine = vm.listT1[index].closeLine.toFixed(2) //止损金额(止损线)
					vm.$refs.inputPop.zsPrice = vm.listT1[index].closePrice
					vm.$refs.inputPop.buyAveragePrice = vm.listT1[index].buyAveragePrice //成交均价
					vm.$refs.inputPop.positionNum = vm.listT1[index].positionNum //买入数量
					vm.$refs.inputPop.supplyDeposit = vm.listT1[index].supplyDeposit
					vm.$refs.inputPop.getLowClosePrice()
					vm.$refs.inputPop.closePrice = vm.listT1[index].closePrice //当前止损价格
				} else if(type == 'addBZJ') {
					vm.$refs.inputPop.popTit = '增加保证金'
					vm.$refs.inputPop.deposit = '' //要增加的保证金
					vm.$refs.inputPop.warningLine = vm.listT1[index].warningLine //递延条件
					vm.$refs.inputPop.lowCloseLine = vm.listT1[index].lowCloseLine //(用于计算止损金额)*/
					vm.$refs.inputPop.bonusAmount = vm.listT1[index].bonusAmount //分红金额
					vm.$refs.inputPop.buyCostTotal = vm.listT1[index].buyCostTotal //买入总价
					vm.$refs.inputPop.positionNum = vm.listT1[index].positionNum //买入数量
					vm.$refs.inputPop.closePrice = vm.listT1[index].closePrice //当前止损价格
				} else if(type == 'handDefer') {
					vm.$refs.inputPop.popTit = '立即递延'
				} else if(type == 'sale') {
					vm.$refs.inputPop.popTit = '卖出'
					vm.$refs.inputPop.saleData = {
						stockName: vm.listT1[index].stockName,
						stockCode: vm.listT1[index].stockCode,
						gainLoss: vm.listT1[index].gainLoss,
						positionNum: vm.listT1[index].positionNum
					}
				} else if(type == 'giveUp') {
					vm.$refs.inputPop.popTit = '放弃策略'
				} else if(type == 'buyStop') {
					vm.$refs.inputPop.popTit = '买断策略'
					vm.$refs.inputPop.buyoutAmount = vm.listT1[index].buyoutAmount //买断时需付金额
				}
			},
			// T+1持仓列表
			strategyListT1() {
				if(!vm.isInval) {
					return
				}
				APIS.strategyListT1(vm.loadShow, res => {
					if(vm.loadShow) {
						vm.loadShow = false
					}
					if(res.code !== 0 || res.data.length <= 0) {
						vm.hasData = false
						return
					}
					vm.hasData = true
					vm.listT1 = res.data

					// 总市值
					vm.marketValSum = ''
					// 策略盈亏
					vm.gainLossSum = ''
					vm.listT1.forEach(item => {
						// item.buttonType = 6//TODO 测试代码
						// 总市值
						vm.marketValSum = (
							Number(vm.marketValSum) +
							item.newPrice * item.positionNum
						).toFixed(2)
						// 策略盈亏
						vm.gainLossSum = (Number(vm.gainLossSum) + item.gainLoss).toFixed(2)
					})
					//实时更新
					setTimeout(() => {
						vm.strategyListT1()
					}, 3000)
				})
			},
			//关闭/开启自动递延
			autoContinueFlag(strategyId, continueFlag, index) {
				APIS.autoContinueFlag(strategyId, continueFlag, function(res) {
					if(res.code == 0) {
						vm.listT1[index].continueFlag = continueFlag
					} else {
						layer.msg(res.msg)
					}
				})
			},
		}
	}
</script>
<style scoped>
	@import "../assets/css/style.css";
	.back-red{
	    background: #ff5d5e;
	}
	.back-blue{
	    background: #5bc1d7;
	}
	.found-input-d {
		position: absolute;
		width: 100%;
		max-height: 320px;
		left: 0;
		top: 36px;
		z-index: 2000;
		background-color: #fff;
		overflow: auto;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	
	.found-input-d-nrr {
		padding: 7px 18px;
		cursor: pointer;
	}
	
	.found-input-d-nrr span {
		display: inline-block;
		font-size: 14px;
		color: #525252;
	}
	
	.found-input-d-nrr span:nth-child(1) {
		width: 100px;
	}
	
	.found-input-d-nrr span:nth-child(2) {
		width: 70px;
	}
	
	.strategyContainer {
		position: relative;
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
		text-align: center;
	}
	
	.contWidth {
		position:relative;
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
	}
	
	.found_search {
		position: relative;
		display: block;
		width: 360px;
		height: 36px;
		border-radius: 18px;
		border: 1px solid #fff;
		color: #fff;
	}
	
	.found_input {
		color: #fff;
		background: none;
		border: none;
		/*line-height: 36px;*/
		font-size: 14px;
		/*float: left;*/
		padding-left: 20px;
		width: 300px;
	}
	
	.found-group-btn .search_btn {
		box-shadow: none;
		background: none;
		color: #fff;
	}
	
	.Strategy {
		display: block;
		width: 100%;
		min-height: 880px;
		padding-top: 80px;
		padding-bottom: 60px;
		background: #f1f1f1;
	}
	
	.Strategy-title_left {
		float: left;
		font-size: 24px;
		color: #585858;
	}
	
	.Strategy-title_left .icon {
		margin-bottom: -3px;
		margin-right: 5px;
		color: #ff5d5e;
	}
	
	.Strategy-title_cen {
		float: left;
		font-size: 14px;
		color: #585858;
		margin-left: 40px;
		padding-top: 12px;
	}
	
	.Strategy-title_cen span {
		padding: 0 5px;
		margin-right: 10px;
	}
	
	.Strategy-title_right {
		float: right;
	}
	
	.Strategy dl dd {
		margin-top: 20px;
		width: 100%;
		height: 174px;
		border-radius: 20px;
		background: #fff;
	}
	
	.Strategy_data {
		height: 110px;
		margin: 0 20px;
		padding-top: 30px;
		border-bottom: 1px solid #ddd;
	}
	
	.Strategy_data>div {
		display: flex;
	}
	
	.Strategy_data>div:nth-of-type(2) {
		color: #ff5d5e;
		margin-top: 10px;
	}
	
	.Strategy_data>div:nth-of-type(2) .warning {
		margin-top: 3px;
		margin-right: 5px;
	}
	
	.Strategy_data ul,
	.Strategy_defer ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	.Strategy_data ul {
		overflow: hidden;
		width: calc(100% - 120px);
		display: flex;
	}
	
	.Strategy_data ul li {
		padding: 5px 2.8%;
		font-size: 15px;
		text-align: center;
	}
	
	.Strategy_data ul li strong {
		color: #282828;
		font-size: 26px;
		font-weight: 900;
		margin-right: 5px;
	}
	
	.Strategy_data ul li span {
		display: block;
	}
	
	.but_Strategy,
	.but_Strategy_red {
		float: right;
		width: 120px;
		line-height: 50px;
	}
	
	.but_Strategy button {
		border: none;
		width: 120px;
		height: 48px;
		border-radius: 24px;
		background: #f1f1f1;
	}
	
	.but_Strategy .but_Strategy_red {
		border: none;
		width: 120px;
		height: 48px;
		border-radius: 24px;
		background: #ff5d5e;
		color: #fff;
	}
	
	.Strategy_defer {
		margin: 0 20px;
		padding-top: 20px;
		font-size: 14px;
	}
	
	.Strategy_defer ul {
		list-style: none;
		line-height: 24px;
	}
	
	.Strategy_defer ul li {
		float: left;
		padding-right: 2%;
	}
	
	.switch {
		line-height: 24px;
	}
	.switch em {
		float: right;
	}
	
	.switch em .openIcon {
		margin-top: -10px;
		margin-left: 10px;
		cursor: pointer;
	}
	
	.Strategy_operation {
		float: right;
	}
	
	.Strategy_operation button {
		display: inline-block;
		width: 100px;
		height: 24px;
		border: 1px solid #ff5d5e;
		background: none;
		color: #ff5d5e;
		font-size: 14px;
		border-radius: 12px;
		margin-left: 5px;
	}
	.logined{
    position: absolute;
    top: 0px;
    right: 0;
    z-index:100;
  }
  .logined_top{
    color: #fff;
    height: 36px;
    text-align: left;
    float: left;
  }
  .logined_top p{
    font-size: 16px;
    margin-top: -12px; 
  }
  .logined_top p strong{
    font-size: 30px;
    margin: 0 20px;
    position: relative;
    top: 10px;
  }
  .logined_down{
    float: left;
    margin-top:23px;
  }
  .logined_down button{
    width: 58px;
    height: 58px;
    border-radius: 30px;
    border:0;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    margin-left: 10px;
   
  }
</style>