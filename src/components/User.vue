<template>
  <div class="foundContainer">
    <top ref="top"></top>
    <div class="user_toolbar">
      <div class="contWidth">
        <!-- <div class="Head_portrait" @click="shadowType='headportrait'">
          <div class="photo"><icon name="User" scale="9"></icon></div>
        </div> -->
        <div class="user_nav">
          <ul class="nav nav-pills nav-stacked" role="tablist">
            <li @click='changeLeft(index)' v-for='(item,index) in leftList' :class="index == leftIndex?'active':''" class='pointer'>
              <a>{{item}}</a>
            </li>
          </ul>
          <div class="clear"></div>
        </div>
        <div class="logined">
          <div class="logined_top">
            <p>余额<strong>{{userMoney.balance}}</strong></p>
          </div>
          <div class="logined_down">
            <router-link to="money" tag="button" class="back-red">充值</router-link>
            <router-link to="money?type=6" tag="button" class="back-blue">提现</router-link>
          </div>
        </div> 
      </div>
    </div>
    <div class="tab-content" >
      <moneyDetail v-show='leftIndex == 0' ref='moneyDetail'></moneyDetail>
      <Halt v-show='leftIndex == 1' ref="Halt"></Halt>
      <Personal v-show='leftIndex == 2' ref="Personal"></Personal>
      <Friends v-show='leftIndex == 3' ref="Friends"></Friends>
    </div>
    <fot ref="fot"></fot>
    <!--弹窗-->
    <div class="shadow">
    	<headportrait v-show="shadowType=='headportrait'" ref="headportrait"></headportrait>
    </div>
  </div>  
</template>

<script>
import Header from '@/components/common/Header';
import Fot from '@/components/common/Footer';
import Icon from 'vue-svg-icon/Icon.vue';
import Asset from '@/components/user/Asset';
import tradingHalt from '@/components/user/tradingHalt';
import Personal from '@/components/user/Personal';
import Friends from '@/components/user/Friends';
import Headportrait from '@/components/user/headportrait';
import { APIS } from '../utils/apis.js';
let vm;

  export default {
    data(){
      return{
        leftList:['资产明细','停牌股票','个人中心','邀请好友'],
        leftIndex:0,
        shadowType:"",
        isLogin:false,
        userMoney:{},
      }
    },
    mounted(){
        vm = this;
        vm.userMoneyInfo()
        if(vm.$route.query.index){
					vm.leftIndex = vm.$route.query.index
				}
        vm.changeLeft(vm.leftIndex)
    },
    components:{
        "top":Header,
        'fot':Fot,
        'moneyDetail':Asset,
        'Halt':tradingHalt,
        'Personal':Personal,
        'Friends':Friends,
        Icon,
        Headportrait,
    },
    methods:{
    	//判断是否登录
			/*checklogin(){
				APIS.checklogin(function(res){
					if(res.code == 0){
						vm.isLogin = true
						vm.userMoneyInfo()
					}else{
						vm.isLogin = false
					}
				})
			},*/
			//查看资产
			userMoneyInfo(){
				APIS.userMoneyInfo(function(res){
					if(res.code == 0){
						vm.userMoney = res.data
						vm.userMoney.balance = vm.userMoney.balance.toFixed(2)
					}
				})
			},
      //切换左侧按钮
      changeLeft(index){
//        console.log(index)
        vm.leftIndex = index
        if(index == 0){
        	vm.$refs.moneyDetail.startUserMoneyCashLog()
        }else if(index == 1){
        	vm.$refs.Halt.getStopStockList()
        }else if(index == 2){
        	vm.$refs.Personal.getBaseUserInfo()
        }else if(index == 3){
        	vm.$refs.Friends.getBaseUserInfo()
        	vm.$refs.Friends.baseMyusers()
        }
      },
      //显示登录，注册弹框
      changeShadow(type){
//    	vm.shadowShow = "register"
				if(vm.$route.query.shadow){
					window.reload()
				}else{
					if(JSON.stringify(vm.$route.query) == "{}"){
						vm.$router.push(vm.$route.fullPath+"?shadow="+type)
					}else{
						vm.$router.push(vm.$route.fullPath+"&shadow="+type)
					}
				}
      	
//    	console.log(vm.shadowShow)
      	
      }
    }
  }
</script>

<style scoped>
	@import "../assets/css/style.css";
  .clear{
    clear:both;
  }
  .red{
    color: #ff5d5e;
  }
  .green{
    color: #76cf75;
  }
  
  .back-red{
    background: #ff5d5e;
  }
  .back-blue{
    background: #5bc1d7;
  }
  .but_history{
    width:120px;
    height: 36px;
    border-radius: 18px;
    border: 2px solid #5bc1d7;
    line-height: 32px;
    font-size: 16px;
    color: #282828;
    cursor: pointer;
  }
  .contWidth{
    margin: 0 auto;
    display: block;
    min-width: 1200px;
    width: 66%;
    position: relative;
  }

  .user_toolbar{
    display: block;
    width: 100%;
    height: 68px;
    background: #3b3b3b;
    text-align: left;
  }
  
  .user_nav{
    position: absolute;
    color: #fff;
    padding: 16px 0;
  }
  .user_nav ul{
    list-style: none;
    margin:0;
    padding: 0;
  }
  .user_nav ul li{
    float: left;
    padding: 0 25px;
    height: 36px;
    font-size: 16px;
    background:transparent;
  }
  .nav-pills li.active{
    background: #fff;
    border-radius: 18px;
  }
  .nav-pills li.active a{
    color: #ff5d5e;
    background-color:transparent;
  }
  .nav-pills li.active:hover{
  	background-color:#fff;
  }
  .nav-pills li.active:hover a{
  	background-color:#fff;
  }
  .user_nav ul li:hover a{
    color: #ff5d5e;
  }
  .user_nav ul li:hover{
    color: #ff5d5e;
  }
	.nav-pills li a{
		background:transparent;
    line-height: 36px;
		color:#fff;
    padding: 0;
	}
	.nav-pills li a:hover{
		background:transparent;
    color: #ff5d5e;
	}
  .logined{
    position: absolute;
    top: 16px;
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
