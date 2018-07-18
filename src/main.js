// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {store} from './vuex/store'
//import $ from '../static/js/jquery.min.js'
import '../static/Bootstrap/css/bootstrap.min.css'
import '../static/Bootstrap/js/bootstrap.min.js'
import VueLazyload from 'vue-lazyload'
import "babel-polyfill"
Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/img/error.jpg'),//这个是请求失败后显示的图片
  loading:require('./assets/img/loading.jpg'),//这个是加载的loading过渡效果
  try: 2, // 这个是加载图片数量
  attempt: 1
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//使用store
  components: { App },
  template: '<App/>'
})
