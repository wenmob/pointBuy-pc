import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import { getToken } from '@/utils/auth'
import {store} from '../vuex/store'

let statuc = 0
let comfit = 0
// 获取statuc值
export function getStatuc () {
  return statuc
}
export function getComfit () {
  return comfit
}
// 改变statuc值
export function setStatuc (val) {
  statuc = val
}
export function setComfit (val) {
  comfit = val
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (getToken()) {
    config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    layer.closeAll('loading') // 每个接口得到数据后，关闭load效果
    const res = response.data
    if (res.code === 100000) {

      if (statuc === 0) {
        statuc = 1
        //弹出登录
        store.commit('changeSignpop','login')
	        // if(router.history.current.query.shadow){
					// 	window.reload()
					// }else{
					// 	if(JSON.stringify(router.history.current.query) == "{}"){
					// 		router.push(router.history.current.fullPath+"?shadow=login")
					// 	}else{
					// 		router.push(router.history.current.fullPath+"&shadow=login")
					// 	}
					// }
      }
    } else if (res.code === 100001) {
      if (statuc === 0) {
        statuc = 1
        	//弹出登录
        store.commit('changeSignpop','login')
      }
    } else if (res.code === 100002) {
      if (statuc === 0) {
        statuc = 1
        //弹出登录
        store.commit('changeSignpop','login')
      }
    } else {
      return response.data
    }
  }, error => {
    console.log('err' + error) // for debug
    layer.msg( error.message)
    return Promise.reject(error)
  })

export default service
