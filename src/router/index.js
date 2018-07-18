import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Found from '@/components/Found'
import Text from '@/components/Text'
import Notes from '@/components/Notes'
import Strategy from '@/components/Strategy'
import History from '@/components/History'
import User from '@/components/User'
import money from '@/components/money'
import Serve from '@/components/Serve'
import increase_Bond from '@/components/operate/increase_Bond'
import { APIS } from '../utils/apis.js'
import {store} from '../vuex/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
				title: '首页',
				requireAuth: false
			}
    },
	  {
		path: '/Found',
		name: 'Found',
		component: Found,
        meta:{
            title:'创建',
            requireAuth:false
        }
	  },
    {
    path: '/Notes',
    name: 'Notes',
    component: Notes,
        meta:{
            title:'注释说明',
            requireAuth:true
        }
    },
    {
    path: '/Text',
    name: 'Text',
    component: Text,
        meta:{
            title:'文本',
            requireAuth:true
        }
    },
    {
    path: '/Strategy',
    name: 'Strategy',
    component: Strategy,
        meta:{
            title:'策略',
            requireAuth:true
        }
    },
    {
    path: '/History',
    name: 'History',
    component: History,
        meta:{
            title:'历史策略',
            requireAuth:true
        }
    },
    {
    path: '/User',
    name: 'User',
    component: User,
        meta:{
            title:'用户',
            requireAuth:true
        }
    },
    {
    path: '/increase_Bond',
    name: 'increase_Bond',
    component: increase_Bond,
        meta:{
            title:'增加保证金',
            requireAuth:true
        }
    },
    {
    path: '/money',
    name: 'money',
    component: money,
        meta:{
            title:'充值中心',
            requireAuth:true
        }
    },
    {
    path: '/Serve',
    name: 'Serve',
    component: Serve,
        meta:{
            title:'服务中心',
            requireAuth:false
        }
    },
  ]
})

router.beforeEach((to, from, next) => {
   /*console.log(to);
   console.log(from);*/
 	
	//判断当前浏览器是否为ie9或以下
    (function myBrowser(){
	    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE浏览器
	    
	    if (isIE) {
	        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
	        reIE.test(userAgent);
	        var fIEVersion = parseFloat(RegExp["$1"]);
//	       	console.log(fIEVersion)
	       if(fIEVersion <= 9){
	       		layer.alert('您的浏览器版本过低，请先升级浏览器', {
						  	closeBtn: 0,
						  	border:0
						}, function(){
						  	window.location.href = 'https://support.microsoft.com/zh-cn/help/18520/download-internet-explorer-11-offline-installer'
						});
	       		
	       }else{
//	       	console.log('ie9以上')
	       }
	    }else{
//	    	console.log('非ie')
	    }
	    
	    
	    /*判断是否为360浏览器*/
	    /* function _mime(option, value) {
           var mimeTypes = navigator.mimeTypes;
           console.log(mimeTypes)
            for (var mt in mimeTypes) {
                if (mimeTypes[mt][option] == value) {
                   return true;
               }
           }
           return false;
        }
	    var isChrome = userAgent.toLowerCase().indexOf("chrome")
	    var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
	    
	   if (isChrome>1 && is360) { 
            layer.alert('您的浏览器为360', {
			  	closeBtn: 0,
			  	border:0
			}, function(){
			  	window.location.href = 'https://browser.360.cn/se/'
			});
        }*/
	})()
	//定义项目title
		APIS.getCommon(function(res){
			if(res.code == 0){
				document.title = res.data.siteName;
			}
		})
	/*控制登录注册弹框*/
  if (to.matched.some(record => record.meta.requireAuth)) {
    APIS.checklogin(function (data) {
      if (data.code === 0) {
      	next()
        /*if (Vue.prototype.shadowShow !== 'login') {
          next()
        } else {
          next({ path: '/' })
        }*/
      } else {
      	//弹出登录
      	store.commit('changeSignpop','login')
      	//重定向
      	store.commit('changeGoUri',to.fullPath)
      	/*if(from.query.shadow){
					router.push({ path: from.fullPath })
					return
				}else{
					if(JSON.stringify(from.query) == "{}"){

						router.push(from.fullPath+"?shadow=login&redirect="+to.fullPath)
					}else{
						router.push(from.fullPath+"&shadow=login&redirect="+to.fullPath)
					}
				}*/

      }
    })
  } else {
    next()
  }
})

export default router
