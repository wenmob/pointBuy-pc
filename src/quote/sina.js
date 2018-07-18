import $ from '../../static/js/jquery.min.js'
export let sinaStock = {
  // 获取买入，卖出的接口 stockCode='sh601006'
  Market: (stockCode, suc) => {
    // console.log(stockCode + 'dsfsdgff')
    $.ajax({
      type: 'get',
      url: 'http://hq.sinajs.cn/list=' + stockCode + '#rnd=' + Math.random(),
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let hq_str = eval('hq_str_' + stockCode)
        let arr = hq_str.split(',')
        let arrs = []
        /**
                 * arr[0]股票名称、arr[2]昨收、arr[3]当前价格
                 * 卖五：arr[29]价格、arr[28]成交量
                 * 卖四：arr[27]价格、arr[26]成交量
                 * 卖三：arr[25]价格、arr[24]成交量
                 * 卖二：arr[23]价格、arr[22]成交量
                 * 卖一：arr[21]价格、arr[20]成交量
                 * ------------------------------
                 * 买一：arr[11]价格、arr[10]成交量
                 * 买二：arr[13]价格、arr[12]成交量
                 * 买三：arr[15]价格、arr[14]成交量
                 * 买四：arr[17]价格、arr[16]成交量
                 * 买五：arr[19]价格、arr[18]成交量
                 */
        let obj0 = { name: '卖五', close: arr[2], price: (arr[29] * 1).toFixed(2), volume: Math.round(arr[28] / 100) }
        let obj1 = { name: '卖四', close: arr[2], price: (arr[27] * 1).toFixed(2), volume: Math.round(arr[26] / 100) }
        let obj2 = { name: '卖三', close: arr[2], price: (arr[25] * 1).toFixed(2), volume: Math.round(arr[24] / 100) }
        let obj3 = { name: '卖二', close: arr[2], price: (arr[23] * 1).toFixed(2), volume: Math.round(arr[22] / 100) }
        let obj4 = { name: '卖一', close: arr[2], price: (arr[21] * 1).toFixed(2), volume: Math.round(arr[20] / 100) }
        let obj5 = { name: '买一', close: arr[2], price: (arr[11] * 1).toFixed(2), volume: Math.round(arr[10] / 100) }
        let obj6 = { name: '买二', close: arr[2], price: (arr[13] * 1).toFixed(2), volume: Math.round(arr[12] / 100) }
        let obj7 = { name: '买三', close: arr[2], price: (arr[15] * 1).toFixed(2), volume: Math.round(arr[14] / 100) }
        let obj8 = { name: '买四', close: arr[2], price: (arr[17] * 1).toFixed(2), volume: Math.round(arr[16] / 100) }
        let obj9 = { name: '买五', close: arr[2], price: (arr[19] * 1).toFixed(2), volume: Math.round(arr[18] / 100) }

        for (let i = 0; i < 10; i++) {
          let uname = 'obj' + i
          let val = eval(uname)
          arrs.push(val)
        }

        let sc = {
          name: arr[0], // 股票名称
          code: stockCode.replace(/\D/g,''), // 股票代码
          currentPrice: arr[3], // 当前价格
          bs: arrs // 买入卖出
        }
        suc(sc)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function () {
        // 请求出错处理
      }
    })
  },
  // 股票详情
  Detail: (stockCode, suc) => {
    let timestamp = (new Date()).valueOf()
    $.ajax({
      type: 'get',
      url: 'http://hq.sinajs.cn/etag.php?_=' + timestamp + '&list=' + stockCode,
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let scc = stockCode.split(',')
        let arrDate = []
        scc.forEach(element => {
          let hq_str = eval('hq_str_' + element.toLowerCase())
          let arr = hq_str.split(',')
          /**
                 * arr[0]是股票名称、arr[1]今天开盘价位、arr[2]昨天收盘价、arr[3]是当前价、
                 * arr[4]是最高价、arr[5]是最低价位、arr[8]是成交量、arr[9]是成交额
                 */
          let sc = {
            name: arr[0], // 股票名称
            code: stockCode.substring(2), // 股票代码
            exchange: stockCode.substring(0, 2), // 股票的类型标签
            open: (arr[1] * 1).toFixed(2), // 开盘价
            close: (arr[2] * 1).toFixed(2), // 收盘价
            current: (arr[3] * 1).toFixed(2), // 当前价
            highest: (arr[4] * 1).toFixed(2), // 最高价
            lowest: (arr[5] * 1).toFixed(2), // 最低价
            zt: stockCode.search('st') !== -1 ? (arr[2] * (1 + 0.05)).toFixed(2) : (arr[2] * (1 + 0.1)).toFixed(2), // 涨停
            dt: stockCode.search('st') !== -1 ? (arr[2] * (1 - 0.05)).toFixed(2) : (arr[2] * (1 - 0.1)).toFixed(2), // 跌停
            zf: ((((arr[4] * 1) - (arr[5] * 1)) / (arr[2] * 1)) * 100).toFixed(2),
            volume: (arr[8] / 10000).toFixed(2), // 成交量
            business: (arr[9] / 100000000).toFixed(2), // 成交额
            netChange: ((arr[3] * 1) - (arr[2] * 1)).toFixed(2), // 相比昨收增加了多少
            netChangeRatio: ((((arr[3] * 1) - (arr[2] * 1)) / arr[2]) * 100).toFixed(2) // 相比昨收的增涨率
          }
          sc.zd = sc.netChange
          arrDate.push(sc)
        })
        suc(arrDate)
      },
      complete: function (XMLHttpRequest, textStatus) {
        // HideLoading();
      },
      error: function () {
        // 请求出错处理
      }
    })
  },
  getStock: (k, suc) => {
    let timestamp = (new Date()).valueOf()
    $.ajax({
      type: 'get',
      url: 'http://suggest3.sinajs.cn/suggest/type=&key=' + k + '&name=suggestdata_' + timestamp,
      data: {},
      cache: true, // 不读缓存
      dataType: 'script',
      beforeSend: function (XMLHttpRequest) {
        // ShowLoading();
      },
      success: function (data, textStatus) {
        let suggestdata = eval('suggestdata_' + timestamp)
        let arr = suggestdata.split(';')
        suc(arr)
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
