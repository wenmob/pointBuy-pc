import $ from '../../static/js/jquery.min.js'
export function splitData (rawData) {
  let categoryData = []
  let values = []
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0])
    values.push(rawData[i])
  }
  return {
    categoryData: categoryData,
    values: values
  }
}

export function calculateMA (data, dayCount) {
  let result = []
  let len = 160
  for (let i = 0; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      let ss = data.values[i - j]
      if (ss instanceof Array) {
        let ss1 = ss[1]
        sum += ss1 * 1
      }
    }
    result.push((sum * 1 / dayCount).toFixed(2))
  }
  return result
}

export function getNumbers (data) {
  let vol = []
  data.forEach(element => {
    let obj = {
      value: element[4],
      open: element[0],
      close: element[1],
      itemStyle: {
        color: element[1] > element[0] ? '#fff' : '#0DB408',
        borderColor: element[1] > element[0] ? '#DF312D' : '#0DB408',
        borderWidth: 1
      }
    }
    vol.push(obj)
  })
  return vol
}
export let baiduStock = {
  // 获得百度某股票的行情详情
  Detail: (stockCode, suc) => {
    let timestamp = (new Date()).valueOf()
    $.ajax({
      type: 'get',
      url: 'https://gupiao.baidu.com/api/rails/stockbasicbatch?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=' + stockCode + '&timestamp=' + timestamp,
      data: {},
      cache: false, // 不读缓存
      dataType: 'jsonp',
      jsonp: 'callback',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let obj = data.data[0]
        let rs = {
          open: (obj.open * 1).toFixed(2), // 今开
          close: (obj.preClose * 1).toFixed(2), // 昨收
          high: (obj.high * 1).toFixed(2), // 最高
          low: (obj.low * 1).toFixed(2), // 最低
          name: obj.stockName, // 股票名称
          code: obj.stockCode, // 股票代码
          current: (obj.close * 1).toFixed(2),
          volume: (obj.volume / 1000000).toFixed(2) + '万手', // 成交量
          business: (obj.capitalization / 100000000).toFixed(2) + '亿元', // 成交价
          exchange: obj.exchange, // 股票类型标签
          zt: obj.exchange.search('st') != -1 ? (obj.preClose * (1 + 0.05)).toFixed(2) : (obj.preClose * (1 + 0.1)).toFixed(2), // 涨停
          dt: obj.exchange.search('st') != -1 ? (obj.preClose * (1 - 0.05)).toFixed(2) : (obj.preClose * (1 - 0.1)).toFixed(2), // 跌停
          netChange: (obj.netChange * 1).toFixed(2), // 相比昨收增加了多少
          netChangeRatio: (obj.netChangeRatio * 1).toFixed(2) + '%' // 相比昨收的增涨率
        }
        suc(rs)
        /**
         * obj.open-今开
         * obj.preClose-昨收
         * obj.high-最高
         * obj.low-最低
         * obj.exchange-'sh'/'sz'
         * obj.stockCode-股票代码
         * obj.stockName-股票名称
         * obj.volume-成交量
         * obj.close-当前价格
         * (obj.turnoverRatio*1).toFixed(2) + '%' 换手率
         * obj.capitalization-总市值
         * obj.netChange-增减值
         * obj.netChangeRatio-增减幅率
         * obj.amplitudeRatio-振幅比
         */
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function (e) {
        // 请求出错处理
      }
    })
  },
  // 获取股票分时数据
  Timeline: (stockCode, suc) => {
    let timestamp = (new Date()).valueOf()
    console.log(stockCode + ',asdsafds')
    $.ajax({
      type: 'get',
      url: 'https://gupiao.baidu.com/api/stocks/stocktimeline?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=' + stockCode + '&timestamp=' + timestamp,
      data: {},
      async: false, // 不读缓存
      dataType: 'jsonp',
      processData: false,
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        // console.log(data);
        let timeline = data.data.timeline.timeline
        let dd1 = [] // 时间段对应的价格
        for (let i = 0; i < timeline.length; i++) {
          let t_0 = timeline[i].values['' + 2 + ''] + '' // 原始分时
          let t_1 = t_0.substring(0, t_0.length - 5)
          let n_0 = Math.floor(t_1.length / 2)
          let t_ = t_1.substring(0, n_0) + ':' + t_1.substring(n_0, t_1.length) // 获取时间段
          let obj = {
            time: t_, // 时间
            price: (timeline[i].values['' + 4 + ''] * 1).toFixed(2), // 当前价格
            close: (data.data.preclose * 1).toFixed(2), // 昨收
            volume: (timeline[i].values['' + 5 + ''] / 10000).toFixed(2), // 成交量
            average: (timeline[i].values['' + 6 + ''] * 1).toFixed(2), // 均线数据
            netChange: ((timeline[i].values['' + 4 + ''] * 1) - (data.data.preclose * 1)).toFixed(2), // 与昨收相比增加了多少
            netChangeRatio: (((timeline[i].values['' + 4 + ''] * 1) - (data.data.preclose * 1)) / (data.data.preclose * 1) * 100).toFixed(2) + '%'
          }
          dd1.push(obj)
        }
        suc(dd1)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function (err) {
        // 请求出错处理
        console.log(err)
      }
    })
  },
  // 获取股票日K的数据
  DayCandLestick: (stockCode, suc) => {
    let timestamp = (new Date()).valueOf()
    $.ajax({
      type: 'get',
      url: 'https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=' + stockCode + '&step=3&start=&count=160&fq_type=no&timestamp=' + timestamp,
      data: {},
      async: false, // 不读缓存
      dataType: 'jsonp',
      jsonp: 'callback',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let kLine = data.data
        let rawData = []
        for (let i = (kLine.length - 1); i >= 0; i--) {
          let rds = []
          let dataStr0 = kLine[i].values['' + 1 + ''] + ''
          let dataStr1 = dataStr0.substring(0, 4) + '/' + dataStr0.substring(4, 6) + '/' + dataStr0.substring(6, 8)
          rds.push(dataStr1)
          let open = kLine[i].values['' + 3 + ''].values['' + 3 + '']
          rds.push(open)
          let close = kLine[i].values['' + 3 + ''].values['' + 6 + '']
          rds.push(close)
          let lowest = kLine[i].values['' + 3 + ''].values['' + 5 + '']
          rds.push(lowest)
          let highest = kLine[i].values['' + 3 + ''].values['' + 4 + '']
          rds.push(highest)
          let volnumber = ((kLine[i].values['' + 3 + ''].values['' + 7 + '']) / 10000).toFixed(2)
          rds.push(volnumber)
          rawData.push(rds)
        }
        let datas = splitData(rawData)
        datas.volume = getNumbers(datas.values)
        datas.MA30 = calculateMA(datas, 30)
        datas.MA20 = calculateMA(datas, 20)
        datas.MA10 = calculateMA(datas, 10)
        datas.MA5 = calculateMA(datas, 5)
        suc(datas)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function (err) {
        // 请求出错处理
        console.log(err)
      }
    })
  },
  // 获取股票周K的数据
  WeekCandLestick: (stockCode, suc) => {
    let timestamp = (new Date()).valueOf()
    $.ajax({
      type: 'get',
      url: 'https://gupiao.baidu.com/api/stocks/stockweekbar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=' + stockCode + '&step=3&start=&count=160&fq_type=no&timestamp=' + timestamp,
      data: {},
      async: false, // 不读缓存
      dataType: 'jsonp',
      jsonp: 'callback',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let kLine = data.data
        let rawData = []
        for (let i = (kLine.length - 1); i >= 0; i--) {
          let rds = []
          let dataStr0 = kLine[i].values['' + 1 + ''] + ''
          let dataStr1 = dataStr0.substring(0, 4) + '/' + dataStr0.substring(4, 6) + '/' + dataStr0.substring(6, 8)
          rds.push(dataStr1)
          let open = kLine[i].values['' + 3 + ''].values['' + 3 + '']
          rds.push(open)
          let close = kLine[i].values['' + 3 + ''].values['' + 6 + '']
          rds.push(close)
          let lowest = kLine[i].values['' + 3 + ''].values['' + 5 + '']
          rds.push(lowest)
          let highest = kLine[i].values['' + 3 + ''].values['' + 4 + '']
          rds.push(highest)
          let volnumber = ((kLine[i].values['' + 3 + ''].values['' + 7 + '']) / 10000).toFixed(2)
          rds.push(volnumber)
          rawData.push(rds)
        }
        let datas = splitData(rawData)
        datas.volume = getNumbers(datas.values)
        datas.MA30 = calculateMA(datas, 30)
        datas.MA20 = calculateMA(datas, 20)
        datas.MA10 = calculateMA(datas, 10)
        datas.MA5 = calculateMA(datas, 5)
        suc(datas)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function (err) {
        // 请求出错处理
        console.log(err)
      }
    })
  },
  // 获取股票月K的数据
  MonthCandLestick: (stockCode, suc) => {
    let timestamp = (new Date()).valueOf()
    $.ajax({
      type: 'get',
      url: 'https://gupiao.baidu.com/api/stocks/stockmonthbar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=' + stockCode + '&step=3&start=&count=160&fq_type=no&timestamp=' + timestamp,
      data: {},
      async: false, // 不读缓存
      dataType: 'jsonp',
      jsonp: 'callback',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let kLine = data.data
        let rawData = []
        for (let i = (kLine.length - 1); i >= 0; i--) {
          let rds = []
          let dataStr0 = kLine[i].values['' + 1 + ''] + ''
          let dataStr1 = dataStr0.substring(0, 4) + '/' + dataStr0.substring(4, 6) + '/' + dataStr0.substring(6, 8)
          rds.push(dataStr1)
          let open = kLine[i].values['' + 3 + ''].values['' + 3 + '']
          rds.push(open)
          let close = kLine[i].values['' + 3 + ''].values['' + 6 + '']
          rds.push(close)
          let lowest = kLine[i].values['' + 3 + ''].values['' + 5 + '']
          rds.push(lowest)
          let highest = kLine[i].values['' + 3 + ''].values['' + 4 + '']
          rds.push(highest)
          let volnumber = ((kLine[i].values['' + 3 + ''].values['' + 7 + '']) / 10000).toFixed(2)
          rds.push(volnumber)
          rawData.push(rds)
        }
        let datas = splitData(rawData)
        datas.volume = getNumbers(datas.values)
        datas.MA30 = calculateMA(datas, 30)
        datas.MA20 = calculateMA(datas, 20)
        datas.MA10 = calculateMA(datas, 10)
        datas.MA5 = calculateMA(datas, 5)
        suc(datas)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function (err) {
        // 请求出错处理
        console.log(err)
      }
    })
  }

}
