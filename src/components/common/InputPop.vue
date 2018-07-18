<template>
	<div class="inputPop">
		<div class="inputcontent">
			<div class="popTit">
				<i></i>
				<span>{{popTit}}</span>
				<em @click="$parent.inputPopShow=false;zsShow = false">&times;</em>
			</div>
			<!--修改止损-->
			<div v-show="$parent.popType == 'changeZS'" class="popCenter">
				<div @keyup.enter='updateCloseLine'>
					<span>设置止损价</span>
					<input type="number" v-model='zsPrice' @keyup="changeZSprice"/>
					<span>
						<p>止损金额</p>
						<p :class="closeLine>=0?'red':'green'">{{closeLine !=undefined?closeLine:'-'}}</p>
					</span>
				</div>
				<div><span>最低止损价:</span><span class='red'>{{lowClosePrice?lowClosePrice.toFixed(2):'-'}}</span></div>
				<div class="popCenter-but"><button @click='updateCloseLine'>确 定</button></div>
			</div>
			<!--增加保证金-->
			<div v-show="$parent.popType == 'addBZJ'&&zsShow == false" class="popCenter">
				<div>
					<input @keyup="changeDeposit" style='width:200px' type="number" v-model='deposit'/>
				</div>
				<div>
					<span>止损金额：</span>
					<span class='green'>{{lowCloseLine?(Number(lowCloseLine)-Number(deposit)).toFixed(2):'-'}}</span>
				</div>
				<div style="padding-top:0;"><span>递延条件</span><span class='green'>≥{{warningLine?(warningLine-deposit).toFixed(2):'-'}}</span></div>
				<div class="popCenter-but"><button @click='zsNext' style="">下一步</button></div>
			</div>
			<div v-show="$parent.popType == 'addBZJ'&&zsShow == true" style="padding-top:20px" class="popCenter">
				<div><span>止损价格：</span><span class='green'>{{closePrice?closePrice.toFixed(2):'-'}}</span></div>
				<div><span>最低止损价:</span><span class='red'>{{((buyCostTotal+(Number(lowCloseLine)-Number(deposit)-bonusAmount))/positionNum).toFixed(2)}}</span></div>
				<div>
					<span>是否止损价调整到最低</span>
					<i style="margin-top:-4px;" @click="lowClose = 0" v-show='lowClose == 1'>
						<icon class='openIcon' name='open' scale='5'></icon>
					</i>
					<i style="margin-top:-4px;" @click="lowClose = 1" v-show='lowClose == 0'>
						<icon class='openIcon' name='close' scale='5'></icon>
					</i>
				</div>
				<div class="popCenter-but">
					<button @click='addDeposit' style="">确 定</button>
				</div>
			</div>
			<!--卖出-->
			<div v-show="$parent.popType == 'sale'||$parent.popType == 'stopSale'" class="popCenter salePop">
				<div>
					<span>
						<p>{{saleData.stockName}}</p>
						<p>{{saleData.stockCode}}</p>
					</span>
					<span>
						<p>盈亏</p>
						<p :class="saleData.gainLoss>=0?'redColor':'greenColor'">{{saleData.gainLoss}}</p>
					</span>
					<span>
						{{saleData.positionNum}}股
					</span>
				</div>
				<div style="margin-top:10px;">是否即时卖出？</div>
				<div class="popCenter-but">
					<button @click='stockSell'>确 定</button>
					<button @click="$parent.inputPopShow=false">取 消</button>
				</div>
			</div>
			<!--放弃策略-->
			<div v-show="$parent.popType == 'giveUp'" class="popCenter giveUp">
				<div>
					放弃策略履约保证金归投资人所有，不享有盈利分成；
				</div>
				<div>
					此策略将由投资人单独承担盈亏。
				</div>
				<div class="popCenter-but">
					<button @click="stopStockGiveUp">确定</button>
				</div>
			</div>
			<!--长期递延-->
			<!--<div v-show="$parent.popType == 'deferLong'" class="popCenter deferLong">
				<div>交易日</div>
				<div>
					<em @click="deferTime>5?deferTime--:''">-</em>
					<input type="number" v-model='deferTime'/>
					<em @click='deferTime++'>+</em>
				</div>
				<div>递延费:<span class='redColor'>{{investorGain}}</span>元</div>
				<div>
					<button @click=''>确 定</button>
				</div>
			</div>-->
			<!--买断策略-->
			<div v-show="$parent.popType == 'buyStop'" class="popCenter giveUp">
				<div>
					买断股票停牌市值，自己承担策略产生的盈亏；
				</div>
				<div>
					向投资人支付：								
					<span style='font-size:20px;margin-top:-7px;' class='red'>{{buyoutAmount?buyoutAmount.toFixed(2):'-'}}</span>
				</div>
				<div>
					<button @click="buyOut">确定</button>
				</div>
			</div>
			<!--立即递延-->
			<div v-show="$parent.popType == 'handDefer'" class="popCenter salePop">
				<div>
					<p>是否确定递延?</p>
				</div>
				<div class="popCenter-but">
					<button @click='continueStrategy'>确 定</button>
					<button @click="$parent.inputPopShow=false">取 消</button>
				</div>
			</div>
			
			
		</div>
	</div>
</template>

<script>
	import { APIS } from "../../utils/apis.js"
	import Icon from 'vue-svg-icon/Icon.vue'
	let vm;
	
	export default{
		data(){
			return{
				popTit:'',
				strategyId:'',
				stockId:'',
				zsPrice:'',//设置的止损价格
				zsMax:"",//限制输入止损价格的位数
				zsFloorMax:'',//限制输入止损价格的小数点位数
				lowClosePrice:'',//最低止损价格
				closePrice:'',//当前的止损价格
				closeLine:'',//当前止损金额(止损线)
				buyAveragePrice:'',//成交均价
				supplyDeposit:'',
				
				lowCloseLine:'',//(用于计算止损金额)
				deposit:'',//添加的保证金
				depositFloorMax:'',//限制添加的保证金的小数点位数
				warningLine:'',//递延条件
				bonusAmount:'',//分红金额
				buyCostTotal:'',//买入总价
				positionNum:'',//买入数量
				lowClose:1,
				zsShow:false,//增加保证金的时候是否调整到最低止损价
				buyoutAmount:'',//买断时需付金额
				
				
				
				
				
				
				deferTime:5,//长期递延时间
				dayNum:'',//手动递延时间
				continueFee:'',//手动递延费
				amount:'',//增加的金额
				lever:'',//T+d杠杆
				continueFeeRate:'',
				surplusDeposit:'',//终止策略组
				saleData:{//卖出弹窗的数据
						stockName:'',
						stockCode:'',
						gainLoss:'',
						positionNum:''
					},
				investorGain:'',//长期递延的递延费
				
				
				
			}
		},
		components: {
			Icon
		},
		mounted(){
			vm = this;
//			console.log(vm.$parent)
			
		},
		methods:{
			zsNext(){
				if(vm.deposit == ''){
					layer.msg("请设置保证金")
					return
				}
				vm.zsShow =true
			},
			//获取最低止损价
			getLowClosePrice(){
//				console.log(stockId)
				APIS.getLowClosePrice(vm.stockId,function(res){
					if(res.code == 0){
						vm.lowClosePrice = res.data
					}else{
						layer.msg(res.msg)
					}
				})
			},
			//修改止损输入框
			changeZSprice(){
				/*小数点不得多于两位*/
				if(vm.zsPrice.toString().indexOf(".") != -1){
					if(vm.zsPrice.toString().split(".")[1].length == 2){
						vm.zsFloorMax = vm.zsPrice
					}
					if(vm.zsPrice.toString().split(".")[1].length > 2){
						vm.zsPrice = vm.zsFloorMax
						layer.msg('小数点不得多于两位');
						return
					}
				}
				/*最多8位数*/
				if(vm.zsPrice.length == 8){
					vm.zsMax = vm.zsPrice
				}
				if(vm.zsPrice.length > 8){
					vm.zsPrice = vm.zsMax
				}
				vm.closeLine = (((vm.zsPrice-vm.buyAveragePrice)*vm.positionNum)-vm.supplyDeposit).toFixed(2)
			},
			//确定修改止损
			updateCloseLine(){
				console.log(vm.stockId)
				if(vm.zsPrice == ''){
					layer.msg("请设置止损价")
					return
				}
				console.log(vm.stockId)
				APIS.updateCloseLine(vm.stockId,vm.zsPrice,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						layer.msg("操作成功")
					}else{
						layer.msg(res.msg)
					}
				})
			},
			//增加保证金输入框
			changeDeposit(){
				/*小数点不得多于两位*/
				console.log(vm.deposit.toString())
				if(vm.deposit.toString().indexOf(".") == -1){
					return
				}
				if(vm.deposit.toString().split(".")[1].length == 2){
					vm.depositFloorMax = vm.deposit
				}
				if(vm.deposit.toString().split(".")[1].length > 2){
					vm.deposit = vm.depositFloorMax
					layer.msg('小数点不得多于两位');
				}
			},
			//增加保证金
			addDeposit(){
				console.log(vm.strategyId)
				APIS.addDeposit(vm.strategyId,vm.deposit,vm.lowClose,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						vm.zsShow = false
						vm.lowClose=1//调整到最低止损价的开关
					}else{
						layer.msg(res.msg)
					}
				})
			},
			//股票卖出
			stockSell(){
				if(vm.$parent.popType == 'stopSale'){//停牌股票卖出
					vm.stopSell()
					return
				}
				APIS.stockSell(vm.stockId,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						layer.msg("已提交")
					}else{
						layer.msg(res.msg)
					}
				})
			},
			//停牌股票卖出
			stopSell(){
				APIS.sellOut(vm.stockId,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						layer.msg("卖出成功")
					}else{
						layer.msg(res.msg)
					}
				})
			},
			//策略递延(T+1立即递延)
			continueStrategy(){
				APIS.continueStrategy(vm.strategyId,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						layer.msg('递延成功')
					}else{
						layer.msg(res.msg)
					}
				})
			},
			//T+1停牌放弃策略
			stopStockGiveUp(){
				APIS.stopStockGiveUp(vm.stockId,function(res){
					if(res.code == 0){
						layer.msg("已放弃该策略")
					}else{
						layer.msg(res.msg)
					}
				})
			},
			//T+1停牌买断
			buyOut(){
				APIS.buyOut(vm.stockId,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						layer.msg("买断成功")
					}else{
						layer.msg(res.msg)
					}
				})
			},
			
			
		}
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	.inputPop{
		position:absolute;
		top:0;
		left:0;
		bottom:0;
		width:100%;
		height:100%;
		background:rgba(0,0,0,.7);
		z-index:99000;
		
	}
	.inputcontent{
		position:fixed;
		left:0;
		right:0;
		top:0;
		bottom:0;
		margin:auto;
		width:420px;
		height:300px;
		background:#fff;
		border-radius:10px;
	}
	.popTit{
		height:50px;
		background:#f36a6a;
		color:#fff;
		padding:0 15px;
		font-size:16px;
		line-height:50px;
		border-radius:10px 10px 0  0;
		text-align:left;
	}
	.popTit	i{
		display:inline-block;
		float:left;
		width:4px;
		height:14px;
		background:#fff;
		margin-top:17px;
		
	}
	.popTit	span{
		padding-left:10px;
	}
	.popTit	em{
		position:absolute;
		top:-5px;
		right:15px;
		font-size: 30px;
		cursor: pointer;
	}
	.popCenter{
		padding: 40px 30px 0 30px;
		position: relative;
		height: 250px;
	}
	.popCenter-but{
		/*position: absolute;
		bottom: 40px;*/
		width: 360px;
		text-align: center;
	}
	.popCenter div{
		display:flex;
		justify-content: center;
		font-size:15px;
		color:#585858;
		line-height:20px;
		padding-top: 10px;
	}
	.popCenter div input{
		border:2px solid #eee;
		border-radius:10px;
		width: 130px;
		height: 36px;
		margin:0 20px;
		text-align:center;
	}
	.popCenter div span{
		line-height: 36px;
	}
	.popCenter div span p{
		line-height:18px;
		text-align:center;
		margin-bottom: 0;
		font-size: 14px;
	}
	/*.popCenter div:nth-of-type(2){
		line-height:60px;
	}*/
	.popCenter div i{
		/*margin-top:-15px;*/
		margin-left:15px;
	}
	.popCenter div em{
		width:68px;
		height:56px;
		line-height:44px;
		text-align:center;
		font-size:70px;
		border:2px solid #eee;
		border-radius:10px;
		color:#989898;
	}
	.popCenter div button{
		width:250px;
		height:36px;
		line-height: 36px;
		background:#f36a6a;
		color:#fff;
		border:0;
		border-radius:8px;
		font-size:16px;
	}
	.salePop div{
		align-items: center;
	}
	.salePop div p{
		margin-top: 10px;
		/*font-size:24px;*/
		
	}
	.salePop div span{
		flex:1;
		text-align:center;
		color:#282828;
	}
	.salePop div span:first-child p:first-child{
		font-size:20px;
	}
	.salePop div button{
		width:200px;
		margin:10px 30px;
	}
	.salePop div button:last-child{
		background:#989898;
	}
	.giveUp{
		padding-top:50px;
	}
	.giveUp div{
		justify-content: left;
	}
	.giveUp div:last-child{
		justify-content: center;
		margin-top:30px;
	}
	.deferLong{
		padding-top:30px;
	}
	.deferLong div input{
		text-align:center;
		width:258px;
	}
	.deferLong div em{
		width:68px;
		height:56px;
		line-height:44px;
		text-align:center;
		font-size:70px;
		border:2px solid #eee;
		border-radius:10px;
		color:#989898;
	}
	.deferLong div:nth-of-type(3){
		line-height:60px;
	}
	.deferLong div button{
		margin-top:30px;
	}
</style>