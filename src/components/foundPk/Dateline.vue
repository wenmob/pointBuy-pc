<template>
  <div class="time-page" id="myChars1"></div>
</template>

<script>
import echarts from 'echarts'
import { createOptionDay } from '../../assets/js/kline'
import { baiduStock } from '../../quote/baidu'
export default{
  name: 'dayLine',
  props: ['stockData'],
  data () {
    return {
      myChars1: undefined,
      option: {},
      MA5: [],
      MA10: [],
      MA20: [],
      MA30: [],
      categoryData: [],
      values: [],
      volume: [],
      ffShow: true
    }
  },
  beforeDestroy () {
    this.myChars1 = undefined
  },
  mounted () {
    this.createChartsA()
    this.getterDayChart().then(() => {
      this.option = createOptionDay(this.MA5, this.MA10, this.MA20, this.MA30, this.categoryData, this.values, this.volume)
      this.myChars1.setOption(this.option)
    })
  },
  methods: {
    // 创建第一个echarts
    createChartsA () {
      this.myChars1 = echarts.init(document.getElementById('myChars1'))
    },
    // 获取K线的数据
    getterDayChart () {
      return new Promise((resolve, reject) => {
        let stockCode = this.stockData.exchange + this.stockData.code
        baiduStock.DayCandLestick(stockCode, (res) => {
          this.MA5 = res.MA5
          this.MA10 = res.MA10
          this.MA20 = res.MA20
          this.MA30 = res.MA30
          this.categoryData = res.categoryData
          this.values = res.values
          this.volume = res.volume
          resolve()
        })
      })
    }
  },
  watch: {
    stockData: {
       handler (newValue, oldValue) {
         if (this.ffShow) {
           this.ffShow = false
           this.createChartsA()
           this.getterDayChart().then(() => {
              this.option = createOptionDay(this.MA5, this.MA10, this.MA20, this.MA30, this.categoryData, this.values, this.volume)
              this.myChars1.setOption(this.option)
           })
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
