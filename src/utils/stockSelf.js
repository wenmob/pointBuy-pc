import request from './request'
import $ from '../../static/js/jquery.min.js'
import router from '@/router'
// 封装ajax
function sxjx (resolve, reject, res, uri, datajson, xhr, loginProp) {
  $.ajax({
    type: xhr,
    url: res.url + uri,
    cache: false,
    data: datajson,
    beforeSend: function (XMLHttpRequest) {
      XMLHttpRequest.setRequestHeader('stock-token', res.token)
    },
    success: function (data, textStatus) {
      if (data.code === '0') {
        resolve(data)
      } else if (data.code === '700') {
        resolve(data)
      } else if (data.code === '100000') {
        if (loginProp) {

          router.push('/login')
        }
      } else if (data.code === '100001') {
        if (loginProp) {

          router.push('/login')
        }
      } else if (data.code === '100002') {
        if (loginProp) {

          router.push('/login')
        }
      } else {

        reject(data.msg)
      }
    },
    complete: function (XMLHttpRequest, textStatus) {
      // HideLoading();
    },
    error: function (e) {
      // 请求出错处理
      reject(e)
    }
  })
}
const selfApi = {
  // 获取自选股的接口
  getStockSelfUrl () {
    return request({
      url: '/user/getStockSelfUrl',
      method: 'get',
      data: ''
    })
  },
  // 获取自选股的路径 GET /user/getStockSelfUrl
  self_url () {
    let _this = this
    return new Promise((resolve, reject) => {
      _this.getStockSelfUrl().then(res => {
        if (!res) {
          // router.push('/login')
        }
        if (res.code === 0) {
          resolve(res.data)
        } else {
          resolve('')
        }
      }).catch(e => {
        reject(e)
      })
    })
  },
  // 获取自选股票的列表 GET/stock/list
  getSelfStockList () {
    let _this = this
    return new Promise((resolve, reject) => {
      _this.self_url().then(res => {
        if (res === '') {
          router.push('/login')
        }
        sxjx(resolve, reject, res, '/stock/list', {}, 'get', true)
      })
    })
  },
  // 添加自选股的方法 post/stock/add
  addSelfStock (stockCode, stockName) {
    let _this = this
    return new Promise((resolve, reject) => {
      _this.self_url().then(res => {
        if (res === '') {
          router.push('/login')
        }
        sxjx(resolve, reject, res, '/stock/add', {
          stockCode: stockCode,
          stockName: stockName
        }, 'post', true)
      })
    })
  },
  // 删除自选的代码 /stock/del
  subSelfStock (stockCode) {
    let _this = this
    return new Promise((resolve, reject) => {
      _this.self_url().then(res => {
        if (res === '') {
          router.push('/login')
        }
        sxjx(resolve, reject, res, '/stock/del', {
          stockCode: stockCode
        }, 'post', true)
      })
    })
  },
  // 自选股排序 /stock/sort
  sortSelfStock (ids) {
    let _this = this
    return new Promise((resolve, reject) => {
      _this.self_url().then(res => {
        if (res === '') {
          router.push('/login')
        }
        sxjx(resolve, reject, res, '/stock/sort', {
          ids: ids
        }, 'post', true)
      })
    })
  }

}

export default selfApi
