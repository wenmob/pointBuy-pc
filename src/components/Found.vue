<template>
  <div class="foundContainer">
    <top ref="top"></top>
    <div class="found_toolbar">
      <div class="contWidth">
        <div class="found_search">
          <input class="found_input" v-model="stock" @focus="stopBS" placeholder="请输入股票代码或名称" @input="searchStock($event)">
          <span class="found-group-btn">
            <button class="btn search_btn" type="button">
              <icon name="Search" scale="2.2"></icon>
            </button>
          </span>
          <!--显示搜索内容-->
          <div class="found-input-d" v-show="fidShow">
             <div class="found-input-d-nrr" v-for="(sst,index) in serchSt" :key="index" @mouseover="onMouseOver($event)" @mouseout="onMouseOut($event)" @click="clickGuo(sst.stockCode)">
               <span>{{sst.stockName}}</span>
               <span>{{sst.stockCode.replace(/\D/g,'')}}</span>
             </div>
          </div>
        </div>
        <div v-if="isLogin" class="logined">
          <!--<div class="logined_top">
            <p>余额<strong>{{uesrMoney.balance}}</strong></p>
          </div>-->
          <div class="logined_down">
            <router-link to="money" tag="button" class="back-red">充值</router-link>
            <router-link to="money?type=6" tag="button" class="back-blue">提现</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="found_cen">
      <div class="contWidth found_strategy">
        <!--左边的行情-->
        <div class="found_left">
          <hangQing1 :stock-data="stockData"></hangQing1>
        </div>
        <!--购买策略的页面-->
        <div class="found_right">
          <div class="found_right-inner">
            <hangQing2 :stock-data="stockData"></hangQing2>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <fot ref="fot"></fot>
  </div>
</template>

<script>
import Header from '@/components/common/Header';
import Fot from '@/components/common/Footer';
import Icon from 'vue-svg-icon/Icon.vue';
import HangQing1 from '@/components/foundPk/HangQing1';
import HangQing2 from '@/components/foundPk/HangQing2';
import selfApi from '../utils/stockSelf';
import { sinaStock } from '../quote/sina'
import { APIS } from '../utils/apis.js'
export default {
    data(){
      return{
      	isLogin:false,
      	uesrMoney:{},
        stockData: {
          business: '',
          close: '',
          code: '',
          current: '',
          dt: '',
          exchange: '',
          highest: '',
          lowest: '',
          name: '',
          netChange: '',
          netChangeRatio: '',
          open: '',
          volume: '',
          zd: '',
          zf: '',
          zt: '',
          bs: []
        },
        fidShow: false,
        stock: '',
        serchSt: [],
        scord: true
      }
    },
    components:{
        "top":Header,
        'fot':Fot,
        'hangQing1': HangQing1,
        'hangQing2': HangQing2,
        Icon
    },
    computed:{
      getBeginAuto() {
        return this.$store.state.beginAuto;
      }
    },
    beforeDestroy() {
      this.scord = false
      this.$store.commit('changeBeginAuto', true)
      this.$store.commit('changeListenStock', true)
      this.$store.commit('changeStrue', true)
    },
    mounted(){
      // $store.commit('add',10)
      this.hasCode()
      this.checklogin()
    },
    methods: {
    	//判断是否登录
    	checklogin(){
    		let _this = this
				APIS.checklogin(function(res){
					if(res.code == 0){
						_this.isLogin = true
						_this.userMoneyInfo()
					}else{
						_this.isLogin = false
					}
				})
			},
			// 查看资产接口
			userMoneyInfo() {
				let _this = this
				APIS.userMoneyInfo(function(res) {
					if(res.code == 0) {
						_this.uesrMoney = res.data
					}
				})
				
			},
      // 当input获取焦点的时候
      stopBS() {
        if (this.serchSt.length > 0) {
          this.fidShow = true
        } else {
          this.fidShow = false
        }
        this.$store.commit('changeListenStock', false)
        this.$store.commit('changeBeginAuto', false)
        this.$store.commit('changeStrue', false)
        this.$store.commit('changeLineC', false)
      },
      // 输入内容时，去搜索股票
     searchStock (e) {
      let _this = this
      let element = e.target.value
      _this.hasStock(element)
     },
     hasStock (element) {
      let _this = this
      // 渲染的数据内容
      let st = []
      this.getStockArray(element.toLowerCase()).then(res => {
        res.forEach(elem => {
          let arr = elem.split(',')
          if (arr[1] * 1 === 11) {
            let obj = {
              stockCode: arr[3],
              stockName: arr[4]
            }
            st.push(obj)
          }
        })
        _this.serchSt = st
        if (_this.serchSt.length > 0) {
          _this.fidShow = true
        } else {
          _this.fidShow = false
        }
      })
    },
    // 获取股票的信息
    getStockArray (k) {
      return new Promise((resolve, reject) => {
        sinaStock.getStock(k, (data) => {
          resolve(data)
        })
      })
    },
    // 鼠标移入的效果
    onMouseOver (e) {
      let _this = this
      let element = e.currentTarget
      element.style.background = '#f1f1f1'
    },
    // 鼠标移出的效果
    onMouseOut (e) {
      let _this = this
      let element = e.currentTarget
      element.style.background = 'transparent'
    },
    // 点击搜索后的效果
    clickGuo (code) {
      this.$store.commit('changeBeginAuto', true)
      this.$store.commit('changeListenStock', true)
      this.$store.commit('changeStrue', true)
      this.$store.commit('changeLineC',true)
      this.stockDetail(code).then(() => {
        this.stockBuyAndSale(code).then(() => {
          this.fidShow = false
        })
      })
    },
    // 获取股票的详情
    stockDetail (code) {
      return new Promise((resolve, reject) => {
          sinaStock.Detail(code, (res) => {
            this.stockData = Object.assign({}, this.stockData , res[0])
            this.stockData.code = this.stockData.exchange + this.stockData.code
            resolve()
          })
      })
    },
    // 获取买入、卖出的详情
    stockBuyAndSale (code) {
      return new Promise((resolve, reject) => {
        sinaStock.Market(code, (res) => {
          this.stockData = Object.assign({}, this.stockData , res)
          resolve()
        })
      })
    },
    // 判断是否有code传来
    hasCode() {
      if (this.$route.query.code){
        let code = this.$route.query.code
        this.clickGuo(code)
      } else {
        // 什么也不执行
      }
    }
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
.back-red{
    background: #ff5d5e;
}
.back-blue{
    background: #5bc1d7;
}
.contWidth {
	position:relative;
  margin: 0 auto;
  display: block;
  width: 1200px;
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
.found-input-d-nrr span{
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
  outline:0;
}

.found_cen {
  position: relative;
  display: block;
  width: 100%;
  height: 865px;
  background: #f1f1f1;
  border: 1px solid #fff;
}
.found_strategy {
  height: 780px;
  background: #fff;
  margin-top: 40px;
  margin-bottom: 40px;
  border-radius: 20px;
}
.found_left {
  float: left;
  width: 830px;
  height: 780px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.found_right {
  float: left;
  width: 360px;
  padding: 40px 0px;
  height: 780px;
  border: 1px solid #fff;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
.found_right-inner {
  height: 100%;
  border-left: 1px dotted #A7A7A7;
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
