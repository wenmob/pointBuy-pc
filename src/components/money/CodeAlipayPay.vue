<template>
	<div class="moneyContent">
		<div v-show="!alipayCodeShow" class="inputMoney">
			<div class="moneyTit">
				<p>账户余额</p>
				<strong>{{$parent.userMoney.balance}}</strong>
			</div>
			<div class="inputCenter">
				<p>充值金额</p>
				<p><input v-model="alipayAmount"/></p>
				<p><button @click="alipayPay">确认充值</button></p>
			</div>
		</div>
		<div v-show="alipayCodeShow" class="codeMoney">
			<strong class="red">￥{{alipayData.money}}</strong>
			<p>为了能及时到账,请付款<span class="red">{{alipayData.money}}</span>元</p>
			<div class="code">
				<img :src="alipayData.qrcode" alt="" />
			</div>
			<div class="info">
				<img src="../../assets/img/sys.png" alt="" />
				<div>
					<p>请使用支付宝扫一扫</p>
					<p>扫描二维码支付</p>
				</div>
			</div>
			<div class="time">
				<span>{{min}}分</span>
				<span>{{sec}}秒</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { APIS } from '../../utils/apis.js';
	import QRCode from 'qrcodejs2';
	let vm;
	export default{
		data(){
			return{
				alipayCodeShow:false,
				alipayAmount:"",
				alipayData:{},
				endTime:"",
				endTimeControll:'',
				min:"",
	            sec:"",
	            
			}
		},
		mounted(){
			vm = this;
		},
		methods:{
			//支付宝转账
			alipayPay(){
				console.log(vm.alipayAmount)
				let alipayAmount = vm.alipayAmount*100
				if(alipayAmount <= 0){
					layer.msg('请填写有效的充值金额')
					return
				}
				if(alipayAmount%1 != 0){
					layer.msg('充值金额最多两位小数')
					return
				}
				APIS.alipayPay(alipayAmount,function(res){
//			  		console.log(res)
			  		if(res.code == 0){
			  			vm.alipayCodeShow = true
			  			vm.alipayData = res.data
			  			vm.getCountDown(vm.alipayData.endTime)
			  		}else{
			  			layer.msg(res.msg)
			  		}
			  	})
			},
			//倒计时
			getCountDown(timestamp){  
				clearInterval(vm.endTimeControll)
	            vm.endTimeControll = setInterval(function(){
	            	console.log('endTimeControll')
	                var nowTime = new Date();
	                var endTime = timestamp*1
					console.log(nowTime,endTime)
	                var t = endTime - nowTime.getTime();
	                console.log(t)
                   	var min=Math.floor(t/1000/60%60);
                   	var sec=Math.floor(t/1000%60);
	    			
	                if (min < 10) {
	                     min = "0" + min;
	                }
	                if (sec < 10) {
	                     sec = "0" + sec;
	                }
	                vm.min = min
	                vm.sec = sec
	                
	                if(min <= 0 && sec <= 0){
	                	clearInterval(vm.endTimeControll)
	                	layer.alert('二维码时间已到期，请重新填写转账金额', {
//						  skin: 'layui-layer-molv' //样式类名
						  closeBtn: 0
						}, function(){
							layer.closeAll()
							vm.alipayCodeShow = false
						});
	                }
	            
	            },1000);
	        },
		}
	}
</script>

<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/money.css";
	
</style>