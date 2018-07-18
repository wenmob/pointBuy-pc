// 分时线的数据
function tempData (rawData) {
  let categoryData = []
  let values = []
  let volumes = []
  for (let i = 0; i < rawData.length; i++) {
    let element = rawData[i].split(' ')
    let str0 = element[0]
    let str1 = str0.substring(0, 2) // 时
    let str2 = str0.substring(2) // 分
    let str3 = str1 + ':' + str2
    categoryData.push(str3)
    volumes.push(element[element.length - 1])
    values.push(element[1])
  }
  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes
  }
}
// k线数据提取
function splitData (rawData) {
  let categoryData = []
  let values = []
  let volumes = []
  for (let i = 0; i < rawData.length; i++) {
    let element = rawData[i].split(' ')
    let str0 = element[0]
    let str1 = str0.substring((str0.length - 4))
    let str2 = str0.substring(0, (str0.length - 4)) // 年
    let str3 = str1.substring(0, 2) // 月
    let str4 = str1.substring(2) // 日
    let str5 = str2 + '/' + str3 + '/' + str4
    categoryData.push(str5)
    volumes.push(element[element.length - 1])
    let A = []
    for (let j = 1; j < element.length - 1; j++) {
      A.push(element[j])
    }
    values.push(A)
  }
  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes,
    MA5: calculateMA(5, values),
    MA10: calculateMA(10, values),
    MA20: calculateMA(20, values),
    MA30: calculateMA(30, values)
  }
}
// k线的平均值
function calculateMA (dayCount, data) {
  var result = []
  for (let i = 0; i < data.length; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    var sum = 0
    for (var j = 0; j < dayCount; j++) {
      sum += data[i - j][1] * 1
    }
    result.push((sum / dayCount).toFixed(2))
  }
  return result
}
export let txunStock = {
  // 获取股票的详情
  Details: (stockCode, suc) => {
    /**
         *  0: 未知
 1: 名字
 2: 代码
 3: 当前价格
 4: 昨收
 5: 今开
 6: 成交量（手）
 7: 外盘
 8: 内盘
 9: 买一
10: 买一量（手）
11-18: 买二 买五
19: 卖一
20: 卖一量
21-28: 卖二 卖五
29: 最近逐笔成交
30: 时间
31: 涨跌
32: 涨跌%
33: 最高
34: 最低
35: 价格/成交量（手）/成交额
36: 成交量（手）
37: 成交额（万）
38: 换手率
39: 市盈率
40:
41: 最高
42: 最低
43: 振幅
44: 流通市值
45: 总市值
46: 市净率
47: 涨停价
48: 跌停价
         */
    $.ajax({
      type: 'get',
      url: 'http://qt.gtimg.cn/q=' + stockCode,
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let hq_str = eval('v_' + stockCode)
        let arr = hq_str.split('~')
        let arrs = []
        let detail = {
          stockName: arr[1],
          stockCode: arr[2],
          current: arr[3],
          close: arr[4],
          open: arr[5],
          volume: arr[36] + '手',
          business: arr[37] + '万', // 成交额
          outter: arr[7],
          inner: arr[8],
          highest: arr[41],
          lowest: arr[42],
          zt: arr[47],
          dt: arr[48],
          zf: arr[43],
          netChange: arr[31],
          netChangeRatio: arr[32] + '%'
        }
        let obj5 = {
          name: '买1',
          price: arr[9],
          close: arr[4],
          volume: arr[10]
        }
        let obj6 = {
          name: '买2',
          price: arr[11],
          close: arr[4],
          volume: arr[12]
        }
        let obj7 = {
          name: '买3',
          price: arr[13],
          close: arr[4],
          volume: arr[14]
        }
        let obj8 = {
          name: '买4',
          price: arr[15],
          close: arr[4],
          volume: arr[16]
        }
        let obj9 = {
          name: '买5',
          price: arr[17],
          close: arr[4],
          volume: arr[18]
        }
        let obj4 = {
          name: '卖1',
          price: arr[19],
          close: arr[4],
          volume: arr[20]
        }
        let obj3 = {
          name: '卖2',
          price: arr[21],
          close: arr[4],
          volume: arr[22]
        }
        let obj2 = {
          name: '卖3',
          price: arr[23],
          close: arr[4],
          volume: arr[24]
        }
        let obj1 = {
          name: '卖4',
          price: arr[25],
          close: arr[4],
          volume: arr[26]
        }
        let obj0 = {
          name: '卖5',
          price: arr[27],
          close: arr[4],
          volume: arr[28]
        }
        for (let i = 0; i < 10; i++) {
          let uname = 'obj' + i
          let val = eval(uname)
          arrs.push(val)
        }
        let emt = {
          detail: detail,
          buyAndSale: arrs
        }
        suc(emt)
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
  // 获取实时资金的流向
  /**
     *  0: 代码
 1: 主力流入
 2: 主力流出
 3: 主力净流入
 4: 主力净流入/资金流入流出总和
 5: 散户流入
 6: 散户流出
 7: 散户净流入
 8: 散户净流入/资金流入流出总和
 9: 资金流入流出总和1+2+5+6
10: 未知
11: 未知
12: 名字
13: 日期
     */
  FundFlow: (stockCode, suc) => {
    $.ajax({
      type: 'get',
      url: 'http://qt.gtimg.cn/q=ff_' + stockCode,
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let hq_str = eval('v_ff_' + stockCode)
        let arr = hq_str.split('~')
        let obj = {
          stockName: arr[12],
          stockCode: arr[0],
          mainFlow: arr[1],
          mainOutflow: arr[2],
          mainNetFlow: arr[3],
          perMain: arr[4], // 主力净流入/资金流入流出总和
          privateFlow: arr[5],
          privateOutflow: arr[6],
          privateNetFlow: arr[7],
          perPrivate: arr[8],
          fundSum: arr[9], // 资金流入流出总和1+2+5+6
          time: arr[13]
        }
        suc(obj)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function () {
        // 请求出错处理
      }
    })
  },
  // 获取盘口分析
  /**
     * 0: 买盘大单
1: 买盘小单
2: 卖盘大单
3: 卖盘小单
     */
  PositionAnalysis: (stockCode, suc) => {
    $.ajax({
      type: 'get',
      url: 'http://qt.gtimg.cn/q=s_pk' + stockCode,
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let hq_str = eval('v_s_pk' + stockCode)
        let arr = hq_str.split('~')
        let obj = {
          buyBigPos: arr[0],
          buySmallPos: arr[1],
          saleBigPos: arr[2],
          saleSmallPos: arr[3]
        }
        suc(obj)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function () {
        // 请求出错处理
      }
    })
  },
  // 获取股票的简要信息
  /**
    * 0: 未知
1: 名字
2: 代码
3: 当前价格
4: 涨跌
5: 涨跌%
6: 成交量（手）
7: 成交额（万）
8:
9: 总市值
    */
  Brief: (stockCode, suc) => {
    $.ajax({
      type: 'get',
      url: 'http://qt.gtimg.cn/q=s_' + stockCode,
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let hq_str = eval('v_s_' + stockCode)
        let arr = hq_str.split('~')
        let obj = {
          stockName: arr[1],
          stockCode: arr[2],
          current: arr[3],
          netChange: arr[4],
          netChangeRatio: arr[5] + '%',
          volume: arr[6],
          business: arr[7] + '万',
          total: arr[9]
        }
        suc(obj)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function () {
        // 请求出错处理
      }
    })
  },
  // 获取腾讯分时线的数据
  Timeline: (stockCode, suc) => {
    $.ajax({
      type: 'get',
      url: 'http://data.gtimg.cn/flashdata/hushen/minute/' + stockCode + '.js?maxage=110&' + Math.random(),
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let hq_str = eval('min_data')
        let arr = hq_str.split('\n')
        let arrs = []
        for (let i = 2; i < arr.length; i++) {
          arrs.push(arr[i])
        }
        let obj = tempData(arrs)
        suc(obj)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function () {
        // 请求出错处理
      }
    })
  },
  // 获取腾讯日K的数据
  DayCandLestick: (stockCode, suc) => {
    $.ajax({
      type: 'get',
      url: 'http://data.gtimg.cn/flashdata/hushen/latest/daily/' + stockCode + '.js?maxage=43201&visitDstTime=1',
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let hq_str = eval('latest_daily_data')
        let arr = hq_str.split('\n')
        let arrs = []
        for (let i = 2; i < arr.length; i++) {
          arrs.push(arr[i])
        }
        let obj = splitData(arrs)
        suc(obj)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function () {
        // 请求出错处理
      }
    })
  },
  // 获取腾讯周K的数据
  WeekCandLestick: (stockCode, suc) => {
    $.ajax({
      type: 'get',
      url: 'http://data.gtimg.cn/flashdata/hushen/latest/weekly/' + stockCode + '.js?maxage=43201&visitDstTime=1',
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let hq_str = eval('latest_weekly_data')
        let arr = hq_str.split('\n')
        let arrs = []
        for (let i = 2; i < arr.length; i++) {
          arrs.push(arr[i])
        }
        let obj = splitData(arrs)
        suc(obj)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function () {
        // 请求出错处理
      }
    })
  },
  // 获取腾讯月K的数据
  MonthCandLestick: (stockCode, suc) => {
    $.ajax({
      type: 'get',
      url: 'http://data.gtimg.cn/flashdata/hushen/monthly/' + stockCode + '.js?maxage=43201',
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let hq_str = eval('monthly_data')
        let arr = hq_str.split('\n')
        let arrs = []
        for (let i = 1; i < arr.length; i++) {
          arrs.push(arr[i])
        }
        let obj = splitData(arrs)
        suc(obj)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function () {
        // 请求出错处理
      }
    })
  }
}
