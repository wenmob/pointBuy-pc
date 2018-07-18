<template>
	<div class="moneyContent">
		<div v-show="!wechatCodeShow" class="inputMoney">
			<div class="moneyTit">
				<p>账户余额</p>
				<strong>{{$parent.userMoney.balance}}</strong>
			</div>
			<div class="inputCenter">
				<p>充值金额</p>
				<p><input v-model='wechatAmount'/></p>
				<p><button @click="wechantPay">确认充值</button></p>
			</div>
		</div>
		<div v-show="wechatCodeShow" class="codeMoney">
			<strong class="red">￥{{wechatData.money}}</strong>
			<p>为了能及时到账,请付款<span class="red">{{wechatData.money}}</span>元</p>
			<div class="code">
				<img :src="wechatData.qrcode" alt="" />
			</div>
			<div class="info" style="background:#76cf75">
				<img src="../../assets/img/sys.png" alt="" />
				<div>
					<p>请使用微信扫一扫</p>
					<p>扫描二维码支付</p>
				</div>
			</div>
			<div class="time">
				<span style="background:#76cf75">{{min}}分</span>
				<span style="background:#76cf75">{{sec}}秒</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { APIS } from '../../utils/apis.js';
	let vm;
	export default{
		data(){
			return{
				wechatCodeShow:false,
				wechatAmount:"",
				wechatData:{},
				endTime:"",
				endTimeControll:"",
				min:"",
				sec:"",
			}
		},
		mounted(){
			vm = this;
		},
		methods:{
			//微信转账
			wechantPay(){
				let wechatAmount = vm.wechatAmount*100
				if(wechatAmount <= 0){
					layer.msg('请填写有效的充值金额')
					return
				}
				if(wechatAmount%1 != 0){
					layer.msg('充值金额最多两位小数')
					return
				}
				APIS.wechantPay(wechatAmount,function(res){
//			  		console.log(res)
			  		if(res.code == 0){
			  			vm.wechatCodeShow = true
			  			vm.wechatData = res.data
			  			vm.getCountDown(1531479243000)
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
//					console.log(nowTime,endTime)
	                var t = endTime - nowTime.getTime();
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
							vm.wechatCodeShow = false
						  	
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