<template>
  <div class="rightTrade">
    <div class="rightHead">
      <router-link to="Notes" tag="span">策略须知</router-link>
      <icon name="Remind" scale="1.4"></icon>
    </div>
    <!--分界线-->
    <div class="rightFen"></div>
    <!--策略金额交易-->
    <div class="rightJY-d1">
      <span>策略金额</span>
      <input class="rightJY-d1-in1" ref="moneyf" id="moneyf" v-model="setVal" placeholder="1万的整数倍" @blur="checkMoney()"/>
      <div style="clear: both"></div>
    </div>
    <div class="rightJY-d1">
      <span>推&emsp;&emsp;荐</span>
      <ul>
         <li v-for="(st, index) in simpletuis" :class="index == tuiIndex ? 'tuiActive' : ''" :key="st.id" @click="dianJI(index)">{{st.name}}</li>
      </ul>
      <div style="clear: both"></div>
    </div>
    <div class="rightJY-d1">
      <span>买入价格</span>
      <p>{{stockData.current == '' ? '0.00' : stockData.current}}&nbsp;现价买入</p>
      <div style="clear: both"></div>
    </div>
    <div class="rightJY-d1">
      <span>买入数量</span>
      <p style="margin-top: 5px;"><span style="font-size: 14px;width: auto;margin-top: 0px;">预计购买</span>&nbsp;{{buyNum}}股</p>
      <div style="clear: both"></div>
    </div>
    <div class="rightJY-d1" style="margin-top: 0px;">
      <span></span>
      <p style="margin-top: 5px;font-size: 13px;color: #28282A">资金使用率{{fundRate}}</p>
      <div style="clear: both"></div>
    </div>
    <!--分界线-->
    <div class="rightFen"></div>
    <div class="rightJY-d1">
      <span>触发止盈</span>
      <p>+{{profit}}</p>
      <div style="clear: both"></div>
    </div>
    <div class="rightJY-d1">
      <span>触发止损</span>
      <p style="color: #2EAC0C">-{{loss}}</p>
      <div style="clear: both"></div>
    </div>
    <!--分界线-->
    <div class="rightFen"></div>
    <div class="rightJY-d1">
      <span style="letter-spacing: 1px;">履约保证金</span>
      <ul>
         <li style="width: 70px" v-for="(bj,index) in bzjs" :key="index" :class="index == bzjIndex ? 'tuiActive' : ''" @click="clickBzj(index)">{{Math.round(money / bj.level)}}</li>
      </ul>
      <div style="clear: both"></div>
    </div>
    <div class="rightJY-d1">
      <span>综合服务费</span>
      <p>{{serviceFee}}元（包含前两天）</p>
      <div style="clear: both"></div>
    </div>
    <div class="rightJY-d1" style="margin-top: 0px;">
      <span></span>
      <p style="margin-top: 5px;font-size: 13px;color: #28282A">注：最低按1万占用资金收取服务费</p>
      <div style="clear: both"></div>
    </div>
    <div class="rightJY-d2">
      <span>合计：</span>
      <span>{{sum}}</span>
      <span v-if="userShow">余额：{{uesrMoney}}</span>
      <div style="clear: both"></div>
    </div>
    <div class="rightJY-d3">
      <a class="noClick" id="createBtn" @click="subFun">发起策略</a>
    </div>
    <div class="rightJY-d4">
      <img src="../../assets/img/choose1.png" @click="chooseM" v-if="cmg == 0"/>
      <img src="../../assets/img/choose2.png" @click="chooseM" v-else/>
      <span @click="chooseM">阅读并同意</span>
      <span data-toggle="modal" data-target="#myModal" @click="ruleShow" style="color: #5192D2">《相关协议》</span>
    	<!--弹框-->
    	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
			  <div class="modal-dialog" role="document">
			    <div class="modal-content" style="top:300px;">
			      <div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" style="font-size:30px;">&times;</span></button>
			        <h4 class="modal-title" id="myModalLabel" style="font-weight:600;">协议</h4>
			      </div>
			      <div class="modal-body">
			        <div style="padding:20px;font-size:16px;">
	  						<p @click="ruleDetail('protocol')" data-dismiss="modal">1,平台服务协议</p>
	  						<p @click="ruleDetail('t1protocol')" data-dismiss="modal">2,A股交易合作协议</p>
	  					</div>
			      </div>
			      <!--<div class="modal-footer">-->
			        <!--<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>-->
			        <!--<button type="button" class="btn btn-primary">Save changes</button>-->
			      <!--</div>-->
			    </div>
			  </div>
			</div>


    </div>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue';
import { APIS } from '../../utils/apis'
export default {
  props: ['stockData'],
  data () {
    return {
      logining: true,
      money: '50000',
      bzj: '',
      tuiIndex: 3,
      bzjIndex: 0,
      maxCpje: '',
      minCpje: '',
      profit: 0,
      loss: 0,
      simpletuis: [
        {id: '1', value: 10000, name: '1万'}, {id: '2', value: 20000, name: '2万'}, {id: '3', value: 30000, name: '3万'},{id: '4', value: 50000, name: '5万'},
        {id: '5', value: 100000, name: '10万'}, {id: '6', value: 200000, name: '20万'}, {id: '7', value: 300000, name: '30万'},{id: '8', value: 500000, name: '50万'}
      ],
      bzjs: [],
      uesrMoney: '',
      userShow: false,
      tacticsObj: {},
      serviceFee: 0,
      sum: '',
      cmg: 0, // 阅读
      alertStr: '发起策略',
      canSubmit1: true, // 策略金额
      canSubmit2: false,  // 数量
      canSubmit3: false, // 资金使用率
      canSubmit4: false, //协议
      canSubmit5: false // 后台的传来是否可以点击
    }
  },
  computed: {
    setVal: {
      set(u){
      	console.log(u)
        let val = ''
        val = u.replace(/\D/g, '')
        $('#moneyf').val(val)
        if (val === '') {
          this.money = ''
        } else {
          this.money = val
        }
      },
      get(){
        return this.money
      }
    },
    buyNum() {
      let price = this.stockData.current
      let x = (Math.floor((this.money / price)/ 100)) * 100
      let res = ''
      if (isNaN(x) || x == Infinity) {
        res = 0
        this.canSubmit2 = false
      } else {
        res = x
        this.canSubmit2 = true
      }
      return res;
    },
    fundRate() {
      let price = this.stockData.current
      let x = (Math.floor((this.money / price)/ 100)) * 100
      let num = ''
      if (isNaN(x) || x == Infinity) {
        num= 0
      } else {
        num = x
      }
      let tal = ((price * num / this.money) * 100).toFixed(2)
      let res = ''
      if (isNaN(tal) || tal == Infinity) {
        res = '0.00%'
        this.canSubmit3 = false
      } else {
        res = tal + '%'
        this.canSubmit3 = true
      }
      return res
    },
    getChangeLineC() {
        return this.$store.state.lineC;
    }
  },
  components: {
    Icon
  },
  beforeDestroy() {
    this.$store.commit('changeLineC',false)
  },
  mounted() {
    this.getSetT()
    this.isLogin().then(() => {
      this.userMoneyInfo()
    })
    this.$store.commit('changeLineC',false)
  },
  methods: {
    // 点击推荐的效果
    dianJI(n) {
      this.tuiIndex = n
      this.money = this.simpletuis[n].value
      this.algorithm(this.bzjIndex)
    },
    // 点击保证金的效果
    clickBzj (n) {
      this.bzjIndex = n
      this.algorithm(n)
    },
    // 获取策略组的设置参数
    getSetT() {
      return new Promise((resolve, reject) => {
        APIS.strategySet_get(1, res => {
          if (res.code === 0) {
            let arr = res.data;
            this.tacticsObj = arr[0]
            this.bzjs = this.tacticsObj.rates
            this.algorithm(0)
          }
          resolve()
        })
      })
    },
    // 检查金额是否为1万的整数
    checkMoney () {
      if (this.money % 10000 !== 0) {
        layer.msg('请输入1万的整数倍')
        this.canSubmit1 = false
      } else {
        this.canSubmit1 = true
      }
    },
    // 策略算法
    algorithm(n) {
      this.bzj = Math.round(this.money / this.bzjs[n].level)
      this.maxCpje = this.bzjs[n].maxCpje // 最大操盘金额
      this.minCpje = this.bzjs[n].minCpje
      this.profit = (this.money * 1 * (this.tacticsObj.profitStopPercent / 100)).toFixed(2)
      this.loss = (this.bzj * this.bzjs[n].zsxPercent / 100).toFixed(2)
      this.serviceFee = this.money / 10000 * this.bzjs[n].commFee
      this.sum = this.bzj + this.serviceFee
    },
    // 判断是否登录
    isLogin () {
      return new Promise((resolve, reject) => {
        APIS.checklogin((res) => {
          if (res.code === 0) {
            this.userShow = true
             resolve('登录')
          } else {
            this.userShow = false
            reject()
            // resolve('未登录')
          }
        })
      })
    },
    // 查看资产接口
  	userMoneyInfo(){
      return new Promise((resolve, reject) => {
        APIS.userMoneyInfo((res) => {
	  		  if(res.code === 0){
            this.uesrMoney = (res.data.balance * 1).toFixed(2)
             resolve()
	  		  } else {
            reject()
            // resolve(res.msg)
          }
	  	  })
      })
    },
    // 选择是否阅读
    chooseM () {
      let code = this.stockData.code.replace(/\D/g, '')
      if (this.cmg === 0) {
        this.cmg = 1
        this.canSubmit4 = true
        // if (this.canSubmit4 && this.canSubmit5) {
        //   $('#createBtn').removeClass('noClick')
        //   $('#createBtn').text(this.alertStr)
        // }
      } else {
        this.cmg = 0
        this.canSubmit4 = false
        // $('#createBtn').addClass('noClick')
        // $('#createBtn').text(this.alertStr)
      }
      APIS.canBuy(code, (res) => {
          if (res.code === 0) {
            if (this.canSubmit4) {
              this.canSubmit5 = true
              $('#createBtn').removeClass('noClick')
              this.alertStr = '发起策略'
              $('#createBtn').text('发起策略')
            } else {
              this.canSubmit5 = false
              $('#createBtn').addClass('noClick')
              this.alertStr = '发起策略'
              $('#createBtn').text('发起策略')
            }
          } else {
            this.canSubmit5 = false
            $('#createBtn').addClass('noClick')
            this.alertStr = res.msg
            $('#createBtn').text(res.msg)
          }
      })
    },
    // 提交时先检查是否可以提交
    beginCreate() {
      return new Promise((resolve, reject) => {
        if (!this.canSubmit1) {
         layer.msg('策略金额不满足是1万的整数倍')
          reject('不可提交')
        }
        if (!this.canSubmit2) {
         layer.msg('购买数量不满足100的整数倍')
          reject('不可提交')
        }
        if (!this.canSubmit3) {
         layer.msg('购买数量不满足100的整数倍')
          reject('不可提交')
        }
        if (!this.canSubmit4) {
         layer.msg('请选择是否同意协议')
         reject('不可提交')
        }
        if (!this.canSubmit5) {
         layer.msg(this.alertStr)
         reject('不可提交')
        }
        if (this.canSubmit1 && this.canSubmit2 && this.canSubmit3 && this.canSubmit4 && this.canSubmit5) {
          resolve()
        }
    })

    },
    subFun() {
      this.beginCreate().then(() => {
        this.$store.commit('changeGoUri', 'trade') // changeTradeData
        let operateAmount = this.money * 1
        let rateId = this.bzjs[this.bzjIndex].id
        let code = this.stockData.code.replace(/\D/g, '')
        this.$store.commit('changeTradeData', {operateAmount: operateAmount, rateId: rateId, stockCode: code})
        APIS.buyTAddOne({operateAmount: operateAmount, rateId: rateId, stockCode: code}, (res) => {
          if (res.code === 0) {
            // 跳转我的策略
            this.$router.push({path: '/strategy'})
          } else if (res.code === 602) {
            layer.msg('身份未认证')
            // 身份验证 user?index=2&type=idCard
            this.$router.push({path: '/user', query: {index: 2, type:'idCard'}})
          } else if (res.code === 4000) {
            layer.msg('余额不足')
            // 余额不足
            this.$router.push({path: '/money'})
          } else {
            layer.msg(res.msg)
          }

        })
      })
    },
    // 每秒检查是否可以点击
    autoBtnFun () {
      if (this.stockData.code !== '' && this.stockData.code !== undefined) {
        let code = this.stockData.code.replace(/\D/g, '')
        APIS.canBuy(code, (res) => {
          if (res.code === 0) {
            if (this.canSubmit4) {
              this.canSubmit5 = true
              $('#createBtn').removeClass('noClick')
              this.alertStr = '发起策略'
              $('#createBtn').text('发起策略')
            } else {
              this.canSubmit5 = false
              $('#createBtn').addClass('noClick')
              this.alertStr = '发起策略'
              $('#createBtn').text('发起策略')
            }

          } else {
            this.canSubmit5 = false
            $('#createBtn').addClass('noClick')
            this.alertStr = res.msg
            $('#createBtn').text(res.msg)
          }


          if (this.getChangeLineC) {
            setTimeout(() => {
              this.autoBtnFun()
            }, 1000);
          }
        })
      }
    },
    //相关协议
    ruleShow(){
    	/*layer.open({
			  type: 1,
			  title:`<h4 style=" font-weight:600;">协议</h4>`,
//			  skin: 'layui-layer-rim', //加上边框
			  area: ['420px', 'auto'], //宽高
			  content: `<div style="padding:20px;font-size:16px;">
			  						<p @click="ruleDetail('protocol')">1,平台服务协议</p>
			  						<p @click="$router.push(Text?type=rule&index=t1protocol)">2,A股交易合作协议</p>
			  					</div>`
			});*/
			
    },
    //跳转协议详情
    ruleDetail(type){
    	this.$router.push("Text?type=rule&index="+type)
    }
  },
  watch: {
    stockData: {
      handler (newValue, oldValue) {
        this.autoBtnFun()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  /* @import url('../../assets/css/style.css'); */
  .rightTrade {
    padding: 0px 20px;
  }
  .rightHead {
    text-align: right;
    cursor:pointer;
  }
  .rightHead span {
    font-size: 14px;
  }
  .rightFen {
    border-top: 1px dotted #A7A7A7;
    margin-top: 8px;
  }
  .rightJY-d1 {
    margin-top: 14px;
  }
  .rightJY-d1 span{
    display: inline-block;
    width: 108px;
    letter-spacing: 3px;
    font-size: 15px;
    float: left;
    margin-top: 5px;
  }
  .rightJY-d1 input{
    float: left;
    width: 208px;
    height: 30px;
    padding: 0px 13px;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    font-size: 15px;
  }
  .rightJY-d1 ul {
    float: left;
    width: 220px;
    padding: 0px;
    list-style: none;
    margin-top: -13px;
    margin-left: -13px;

  }
  .rightJY-d1 ul li {
    float: left;
    width: 42px;
    font-size: 14px;
    margin-left: 13px;
    margin-top: 13px;
    padding: 4px 0px;
    border: 1px solid #DDDDDD;
    text-align: center;
    cursor: pointer;
  }
  .rightJY-d1 ul li:hover {
    background-color: #F43939;
    color: #fff;
  }
  .rightJY-d1 p {
    float: left;
    font-size: 15px;
    margin-top: 5px;
    color: #F43939;
  }
  .rightJY-d2{
    margin-top: 10px;
  }
  .rightJY-d2 span:nth-child(1) {
    float: left;
    margin-top: 8px;
    font-size: 13px;
  }
  .rightJY-d2 span:nth-child(2){
    float: left;
    font-size: 22px;
    font-weight: 600;
    color: #F43939;
  }
  .rightJY-d2 span:nth-child(3) {
    float: right;
    margin-top: 8px;
    font-size: 13px;
  }
  .rightJY-d3 {
    margin-top: 0px;
  }
  .rightJY-d3 a{
    display: inline-block;
    width: 100%;
    height: 40px;
    text-align: center;
    background-color: #F43939;
    color: #fff;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    line-height: 40px;
    cursor: pointer;
  }
  .rightJY-d4 {
    margin-top: 5px;
    cursor: pointer;
  }
  .rightJY-d4 img{
    width: 13px;
  }
  .rightJY-d4 span{
    font-size: 13px;
  }
  .tuiActive {
    background-color: #F43939;
    color: #fff;
  }
  .rightJY-d1-in1:focus {
    outline: none;
    border: 1px solid #F43939;
  }
  .rightJY-d3 .noClick {
    pointer-events: none;
    background-color: #8B8B8B;
  }
</style>

