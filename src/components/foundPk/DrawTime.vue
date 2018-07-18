<template>
  <div class="time-page" id="myChars1">
  </div>
</template>

<script>
import echarts from 'echarts'
import { baiduStock } from '../../quote/baidu'
import { createX, createOption } from '../../assets/js/timeLine'
export default {
  name: 'timeLine',
  props: ['stockData'],
  data  () {
    return {
      myChars1: undefined,
      option: {},
      dataTimes: [],
      datay: [],
      dataVolnum: [],
      dataJx: [],
      upStr: 0,
      yesterdayPrice: 0,
      downStr: 0,
      up: 0,
      line: 0,
      down: 0,
      // beginAuto: true,
      minuteCan: true
    }
  },
  beforeDestroy () {
    this.$store.commit('changeStrue', true)
    this.minuteCan = false
    this.myChars1 = undefined
  },
  computed:{
      getBeginAuto() {
        return this.$store.state.beginAuto;
      },
      getStrue() {
        return this.$store.state.strue;
      }
  },
  mounted () {
    this.createChartsA()
    this.createLine(this.stockData)
  },
  methods: {
    // 创建第一个echarts
    createChartsA () {
      this.myChars1 = echarts.init(document.getElementById('myChars1'))
    },
    // 获取股票详情的数据
    getterTimeDetail (obj) {
      return new Promise((resolve, reject) => {
        let abjLength = Object.keys(obj)
        if (abjLength.length === 0) {
          return
        }
        this.yesterdayPrice = (obj.close * 1).toFixed(2)
        let b1 = Math.abs(obj.highest * 1 - obj.close * 1)
        let b2 = Math.abs(obj.lowest * 1 - obj.close * 1)
        if (b1 > b2) {
          this.upStr = (obj.highest * 1).toFixed(2)
          this.downStr = (obj.close * 1 - b1).toFixed(2)
        } else if (b1 < b2) {
          this.upStr = (obj.close * 1 + b2).toFixed(2)
          this.downStr = (obj.lowest * 1).toFixed(2)
        }
        this.up = (this.upStr - this.yesterdayPrice) / this.yesterdayPrice
        this.line = 0.00
        this.down = (this.downStr - this.yesterdayPrice) / this.yesterdayPrice
        resolve()
      })
    },
    // 获取分时线的数据
    getterTimeData () {
      let _this = this
      return new Promise((resolve, reject) => {
        let abjLength = Object.keys(this.stockData)
        if (abjLength.length === 0) {
          return
        }
        let stockCode = this.stockData.exchange + this.stockData.code.replace(/\D/g,'')
        _this.datay = []
        _this.dataVolnum = []
        _this.dataJx = []
        baiduStock.Timeline(stockCode, (res) => {
          _this.dataTimes = createX()
          let sset = new Set(_this.dataTimes)
          for (let i = 0; i < res.length; i++) {
            if (sset.has(res[i].time)) {
              _this.datay.push(res[i].price)

              let bi = 0
              if (i === 0) {
                bi = res[i].price * 1 - res[i].close * 1
              } else {
                bi = res[i].price * 1 - res[i - 1].price * 1
              }
              let col = ''
              if (bi > 0) {
                col = '#F70303'
              } else if (bi < 0) {
                col = '#0DB408'
              } else {
                col = '#B2B2B2'
              }
              let obj = {
                value: res[i].volume,
                itemStyle: {
                  color: col,
                  borderColor: 'transparent',
                  borderWidth: 0.5
                }
              }
              _this.dataVolnum.push(obj)
              _this.dataJx.push(res[i].average)
            }
          }
          resolve()
        })
      })
    },
    // 一分钟后
    updateLine () {
      return new Promise((resolve, reject) => {
        if (this.minuteCan) {
          this.getterTimeData().then(() => {
            let option1 = this.myChars1.getOption()
            option1.xAxis[0].data = this.dataTimes
            option1.xAxis[1].data = this.dataTimes
            option1.series[0].data = this.datay
            option1.series[1].data = this.dataJx
            option1.series[2].data = this.dataVolnum
            this.myChars1.setOption(option1)
            if (this.getStrue) {
              setTimeout(() => {
                this.updateLine()
              }, 60000)
            }
          })
        }
      })
    },
    // 每秒钟刷新的方法
    reData (newValue) {
      let abjLength = Object.keys(newValue)
      if (abjLength.length === 0) {
          return
      }
      this.yesterdayPrice = (newValue.close * 1).toFixed(2)
      let b1 = Math.abs(newValue.highest * 1 - newValue.close * 1)
      let b2 = Math.abs(newValue.lowest * 1 - newValue.close * 1)
      if (b1*1 > b2*1) {
        this.upStr = (newValue.highest * 1).toFixed(2)
        this.downStr = (newValue.close * 1 - b1*1).toFixed(2)
      } else if (b1*1 < b2*1) {
        this.upStr = (newValue.close * 1 + b2*1).toFixed(2)
        this.downStr = (newValue.lowest * 1).toFixed(2)
      }
      this.up = (this.upStr - this.yesterdayPrice) / this.yesterdayPrice
      this.line = 0.00
      this.down = (this.downStr - this.yesterdayPrice) / this.yesterdayPrice
      this.datay[this.datay.length - 1] = (newValue.current * 1).toFixed(2)
      let option1 = this.myChars1.getOption()
      if (option1.series.length === 0) {
        return
      }
      option1.yAxis[0].max = this.upStr
      option1.yAxis[0].min = this.downStr
      option1.series[0].markPoint.data[5].value = this.downStr
      option1.series[0].markPoint.data[3].value = this.upStr
      option1.series[0].markPoint.data[1].value = '+' + (this.up * 100).toFixed(2) + '%'
      option1.series[0].markPoint.data[2].value = (this.down * 100).toFixed(2) + '%'
      option1.series[0].data = this.datay
      this.myChars1.setOption(option1)
    },
    createLine (newValue) {
      let _this = this
      let abjLength = Object.keys(newValue)
      if (abjLength.length === 0) {
          return
      }
      if (this.getStrue) {
          if (this.getBeginAuto) {
            this.$store.commit('changeBeginAuto', false)
            if (_this.myChars1) {
              _this.myChars1.clear()
            }
            this.getterTimeData().then(() => {
              this.getterTimeDetail(newValue).then(() => {
                this.option = createOption(this.dataTimes, this.datay, this.up, this.line, this.down, this.upStr, this.yesterdayPrice, this.downStr, this.dataJx, this.dataVolnum)
                this.myChars1.setOption(this.option)
                setTimeout(() => {
                  this.updateLine()
                }, 60000)
              })
            })
          }
          if (this.myChars1) {
            this.reData(newValue)
          }
        }
    }
  },
  watch: {
    stockData: {
      handler (newValue, oldValue) {
        let _this = this;
        let abjLength = Object.keys(newValue)
        if (abjLength.length === 0) {
          return
        }
        if (this.getStrue) {
          if (this.getBeginAuto) {
            this.$store.commit('changeBeginAuto', false)
            if (_this.myChars1) {
              _this.myChars1.clear()
            }
            this.getterTimeData().then(() => {
              this.getterTimeDetail(newValue).then(() => {
                this.option = createOption(this.dataTimes, this.datay, this.up, this.line, this.down, this.upStr, this.yesterdayPrice, this.downStr, this.dataJx, this.dataVolnum)
                this.myChars1.setOption(this.option)
                setTimeout(() => {
                  this.updateLine()
                }, 60000)
              })
            })
          }
          if (this.myChars1) {
            this.reData(newValue)
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.time-page {
  width: 100%;
  height: 100%;
}
</style>
