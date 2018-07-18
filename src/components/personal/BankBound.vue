<template>
	<div class="personPop">
		<div class="popcontent">
			<div class="title">
				<span>
					<icon name="Bankcard" scale="6"></icon>
				</span>
				<em>绑定银行卡</em>
				<i @click="$parent.popType = ''">&times;</i>
			</div>
			<div @keyup.enter="trueBank" class="center">
				<div>
					<label for="mobile">开户名称</label>
					<i></i>
					<span v-show='userInfo.idcard' style="padding-left:10px;">{{userInfo.name}}</span>
					<span v-show='!userInfo.idcard' style='padding-left:10px;color:#0058F1' class='pointer' @click="$parent.popType = 'idCard'">请实名认证</span>
				</div>
				<div class="bank">
					<label for="mobile">开户银行</label>
					<i></i>
					<select v-model='bankIndex'>
						<option v-for='(item,index) in bankList' :value='index'>{{item.bankFullName}}</option>
					</select>
				</div>
				<div class="address">
					<select v-model='provinceIndex' @change='changeProvince()'>
						<option v-for='(item,index) in provinceList' :value='index'>{{item.name}}</option>
					</select>
					<select v-model='cityIndex' @change='changeCity()'>
						<option v-for='(item,index) in cityList' :value='index'>{{item.name}}</option>
					</select>
					<select v-model='areaIndex'>
						<option v-for='(item,index) in areaList' :value='index'>{{item.name}}</option>
					</select>
				</div>
				<div>
					<label for="mobile">开户支行</label>
					<i></i>
					<input v-model='bankAddress'/>
				</div>
				<div>
					<label for="mobile">开户卡号</label>
					<i></i>
					<input v-model='bankNum'/>
				</div>
				<button @click="trueBank">确认绑定</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue';
	import { APIS } from '../../utils/apis.js';
	let vm;
	
	export default {
		data() {
			return {
				userInfo:{},
				bankList: [],
				provinceList: [],
				cityList: [],
				areaList: [],
				provinceId:130000,
				cityId:130100,
				provinceIndex:'0',
				cityIndex:'0',
				areaIndex:'0',
				bankIndex:'0',
				bankAddress:"",
				bankNum:"",
			}
		},
		components: {
			Icon
		},
		mounted() {
			vm = this;
		},
		methods: {
			//绑定银行卡获取系统支持的银行信息
			sysBankListWithdraw() {
				APIS.sysBankListWithdraw(function(res){
//					console.log(res)
					if(res.code == 0) {
						vm.bankList = res.data
					}
				})
			},
			//获取所有省份
			getprovince() {
				APIS.getprovince(function(res){
//					console.log(res)
					if(res.code == 0) {
						vm.provinceList = res.data
						vm.provinceId = vm.provinceList[vm.provinceIndex].id
						vm.getCity()
					}
				})
			},
			//获取市区列表
			getCity() {
				vm.cityList = []
				APIS.getRegion(vm.provinceId,function(res){
//					console.log(res)
					if(res.code == 0) {
						vm.cityList = res.data
						vm.cityId = vm.cityList[vm.cityIndex].id
						vm.getArea()
					}
				})
			},
			//获取县区列表
			getArea() {
				vm.areaList = []
				APIS.getRegion(vm.cityId,function(res){
//					console.log(res)
					if(res.code == 0) {
						vm.areaList = res.data
					}
				})
			},
			//得到选择的当前省份的id
			changeProvince(){
				vm.provinceId = vm.provinceList[vm.provinceIndex].id
				vm.getCity()
			},
			//得到选择的当前市区的id
			changeCity(){
				vm.cityId = vm.cityList[vm.cityIndex].id
				vm.getArea()
			},
			//确认绑定银行卡
			trueBank(){
				let bankId = vm.bankList[vm.bankIndex].id//银行id
				let province = vm.provinceList[vm.provinceIndex].name//开户行省
				let city = vm.cityList[vm.cityIndex].name//开户行市
				let area = ''//开户行县/区
				if(vm.areaList.length > 0){
					area = vm.areaList[vm.areaIndex].name
				}
				let userName = ''//用户账户
				if(vm.userInfo.mobile) {
					userName = vm.userInfo.mobile
				} else {
					userName = vm.userInfo.username
				}
				if(vm.bankAddress == '' || vm.bankNum == ''){
					layer.msg('信息不完整')
					return
				}
  				APIS.saveUserBank(bankId, province, city, area, vm.bankAddress,vm.bankNum,function(res){
//					console.log(res)
  					if(res.code == 0){
  						vm.$parent.getBaseUserInfo()
						vm.closePop()
  					}
  				})
			},
			//关闭弹框
			closePop(){
				vm.$parent.popType = ""
				vm.userInfo={};
				vm.bankList=[];
				vm.provinceLis=[];
				vm.cityList=[];
				vm.areaList=[];
				vm.provinceId=130000;
				vm.cityId=130100;
				vm.provinceIndex='0';
				vm.cityIndex='0';
				vm.areaIndex='0';
				vm.bankIndex='0';
				vm.bankAddress="";
				vm.bankNum="";
			},
		},
	}
	
</script>
<style scoped>
	@import "../../assets/css/style.css";
	@import "../../assets/css/personPop.css";
</style>