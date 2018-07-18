<template>
  <div class="hangQing1-container">
    <!--头部-->
    <div class="hangQing1-head" :style="bgStyle">
      <div class="hangh-1">
        <span>{{stockName ? stockName : 'Xx'}}</span><br/>
        {{stockCode ? stockCode  : '-'}}
      </div>
      <div class="hangh-2">
        <span>{{stock.current ? stock.current : 'Xx'}}</span>
      </div>
      <div class="hangh-3">
        <span>{{stock.netChange && stock.netChange > 0 ? '+' : ''}}{{stock.netChange ? stock.netChange : '-'}}</span>
        <span>{{stock.netChange && stock.netChange > 0 ? '+' : ''}}{{stock.netChangeRatio ? stock.netChangeRatio + '%' : '-'}}</span>
      </div>
    </div>
    <div style="clear: both"></div>
    <!--股票行情-->
    <div class="hangQing1-curr">
      <div class="hangQing1-curr-1">
        <div class="hcurr"><span>今开</span><span :style="fontStyle(stock.open, stock.close)">{{stock.open}}</span></div>
        <div class="hcurr"><span>振幅</span><span style="color: rgb(244,57,57)">{{stock.zf ? stock.zf + '%' : ''}}</span></div>
      </div>
      <div class="hangQing1-curr-2">
        <div class="hcurr"><span>昨收</span><span>{{stock.close}}</span></div>
        <div class="hcurr"><span>涨跌</span><span :style="fontStyle(stock.current, stock.close)">{{stock.zd}}</span></div>
      </div>
      <div class="hangQing1-curr-2">
        <div class="hcurr"><span>涨停</span><span style="color: rgb(244,57,57)">{{stock.zt}}</span></div>
        <div class="hcurr"><span>最高</span><span style="color: rgb(244,57,57)">{{stock.highest}}</span></div>
      </div>
      <div class="hangQing1-curr-2">
        <div class="hcurr"><span>跌停</span><span style="color: rgb(46,172,12)">{{stock.dt}}</span></div>
        <div class="hcurr"><span>最低</span><span style="color: rgb(46,172,12)">{{stock.lowest}}</span></div>
      </div>
      <div style="clear: both"></div>
    </div>
   <!--分界线-->
   <div class="hangQing1-fen">
     <div class="hangQing1-dd">
       <a class="abtn acc" @click="changeCanvas(0)">分时</a><a class="abtn" @click="changeCanvas(1)">K线</a>
     </div>
   </div>
   <!--K线-->
   <div class="hangQing1-line">
     <drawTime ref="drawTime" :stock-data="stockData1" v-if="canvas == 0"></drawTime>
     <dateline :stock-data="stockData1" v-else></dateline>
   </div>
   <!--买入、卖出-->
   <div class="hangQing1-bs">
     <div class="hangQing1-bs-1" v-for="(bs,index) in stock.bs" :key="index" :style="bs.topStyle">
       <span>{{bs.name}}</span>
       <span :style="fontStyle(bs.price, bs.close)">{{bs.price}}</span>
       <span>{{bs.volume}}</span>
       <div style="clear: both"></div>
     </div>
   </div>
  </div>
</template>

<script>
import { sinaStock } from '../../quote/sina'
import DrawTime from './DrawTime'
import Dateline from './Dateline'
export default {
  props: ['stockData'],
  data () {
    return {
      canvas: 0,
      stockName: undefined,
      stockCode: undefined,
      stockData1: {},
      stock: {
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
        bs: [
          {close: '-', name: '卖五', price: '-', volume: '-', topStyle: 'margin-top: 0px'},
          {close: '-', name: '卖四', price: '-', volume: '-', topStyle: ''},
          {close: '-', name: '卖三', price: '-', volume: '-', topStyle: ''},
          {close: '-', name: '卖二', price: '-', volume: '-', topStyle: ''},
          {close: '-', name: '卖一', price: '-', volume: '-', topStyle: ''},
          {close: '-', name: '买一', price: '-', volume: '-', topStyle: 'margin-top: 70px'},
          {close: '-', name: '买二', price: '-', volume: '-', topStyle: ''},
          {close: '-', name: '买三', price: '-', volume: '-', topStyle: ''},
          {close: '-', name: '买四', price: '-', volume: '-', topStyle: ''},
          {close: '-', name: '买五', price: '-', volume: '-', topStyle: ''}
        ]
      }
    }
  },
  computed: {
     bgStyle() {
      let netChange = isNaN(this.stock.netChange)
        ? undefined
        : this.stock.netChange
      if (netChange * 1 < 0) {
        return 'background: rgb(46,172,12)'
      } else if (netChange * 1 > 0) {
        return 'background: rgb(244,57,57)'
      } else {
        return 'background: #8B8B8B'
      }
    },
    getListenStock() {
        return this.$store.state.listenStock;
    }
  },
  components:{
    // "drawKline": DrawKline,
    "drawTime": DrawTime,
    "dateline": Dateline
  },
  beforeDestroy() {
    this.listenStock = false
  },
  mounted() {

  },
  methods: {
    // 改变K线图
    changeCanvas(n) {
      this.canvas = n
      if (n === 0) {
        this.$store.commit('changeBeginAuto', true)
      }
      let _this = $('.abtn').eq(n)
      $('.abtn').not(_this).removeClass('acc')
      _this.addClass('acc')
    },
    // 获取股票的详情
    stockDetail (code) {
      return new Promise((resolve, reject) => {
          sinaStock.Detail(code, (res) => {
            this.stock = Object.assign({}, this.stock , res[0])
            this.stockData1 = Object.assign({}, this.stockData1 , res[0])
            resolve()
          })
      })
    },
    // 获取买入、卖出的详情
    stockBuyAndSale (code) {
      return new Promise((resolve, reject) => {
        sinaStock.Market(code, (res) => {
          let bs = res.bs
          bs.forEach(element => {
             if (element.name === '卖五') {
                element.topStyle = 'margin-top: 0px'
             } else if (element.name === '买一') {
                element.topStyle = 'margin-top: 70px'
             } else {
                element.topStyle = ''
             }
          });
          this.stock = Object.assign({}, this.stock , res)
          resolve()
        })
      })
    },
    // 每秒钟获取数据
    presecGetDatas (code) {
      let _this = this;
      this.stockDetail(code).then(() => {
        this.stockBuyAndSale(code).then(() => {
          if(this.getListenStock) {
            setTimeout(() => {
              _this.presecGetDatas(code)
            }, 1000);
          }
        })
      })
    },
    // 显示的颜色 工具
    fontStyle (price, close) {
      let sl = ''
      if (price * 1 > close * 1) {
        sl = 'color: rgb(244,57,57)'
      } else if (price * 1 < close * 1) {
        sl = 'color: rgb(46,172,12)'
      } else {
        sl = 'color: #8B8B8B'
      }
      return sl
    }
  },
  watch: {
    stockData: {
      handler (newValue, oldValue) {
        this.stockName = newValue.name
        this.stockCode = newValue.code.replace(/\D/g, '')
        this.stockData1 = newValue
        this.presecGetDatas(newValue.code)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.hangQing1-container {
  width: 100%;
  height: 100%;
}
.hangQing1-head {
  height: 70px;
  background-color: #FF5C5E;
  border-top-left-radius: 20px;
  padding: 16px;
}
.hangh-1 {
  float: left;
  color: #fff;
  line-height: 1.2;
  font-size: 14px;
}
.hangh-1 span {
  font-weight: 600;
  font-size: 20px;
}
.hangh-2 {
  float: left;
  color: #fff;
  font-size: 40px;
  line-height: 1;
  margin-left: 40px;
  font-weight: 600;
}
.hangh-3 {
  float: left;
  color: #fff;
  margin-left: 3px;
  line-height: 3.6;
}
.hangh-3 span {
  display: inline-block;
  margin-left: 8px;
}
.hangQing1-curr {
  padding-top: 6px;
  padding-bottom: 16px;
  background-color: #FCFBFB;
}
.hcurr span{
  display: inline-block;
  margin-left: 16px;
  font-size: 15px;
  margin-top: 10px;
}
.hangQing1-curr-1{
  float: left;
}
.hangQing1-curr-2{
  float: left;
  margin-left: 30px;
}
.hangQing1-fen {
  padding: 0px 16px;
  margin-top: 26px;
}
.hangQing1-dd {
  height: 44px;
  border-bottom: 1px solid #DCDCDC;
}
.hangQing1-dd a{
  display: inline-block;
  padding: 11px 20px;
  font-size: 15px;
  font-weight: 600;
  color: #5F5F5F;
  border-style: none;
  text-decoration: none;
  cursor: pointer;
}
.hangQing1-dd .acc {
  color: rgb(244,57,57);
  border-bottom: 1px solid rgb(244,57,57);
}
.hangQing1-line {
  float: left;
  margin-top: 15px;
  margin-left: 16px;
  width: 510px;
  height: 520px;
}
.hangQing1-bs {
  float: right;
  margin-right: 15px;
  margin-top: 15px;
  width: 196px;
  height: 520px;
}
.hangQing1-bs-1 {
  margin-top: 26px;
}
.hangQing1-bs-1 span{
  display: inline-block;
  font-size: 15px;
}
.hangQing1-bs-1 span:nth-child(1) {
  float: left;
}
.hangQing1-bs-1 span:nth-child(2){
  float: left;
  margin-left: 50px;
}
.hangQing1-bs-1 span:nth-child(3) {
  float: right;
  margin-left: 30px;
}
</style>


