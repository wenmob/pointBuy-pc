<template>
  <div class="serveContainer">
    <top ref="top"></top>
    <div class="min-height">
      <div class="contWidth">
        <div class="conter_left">
          <ul class="nav-noail" role="tablist">
            <li role="presentation" class="border_dot" :class="serverIndex==1?'active':''">
            	<a @click="changeServerIndex(1)" href="#Novice" aria-controls="Novice" role="tab" data-toggle="tab">新手指引</a>
            </li>
            <li role="presentation" class="border_dot" :class="serverIndex==0?'active':''">
            	<a @click="changeServerIndex(0)" href="#problem" aria-controls="problem" role="tab" data-toggle="tab">常见问题</a>
            </li>
            <li role="presentation" class="border_dot" :class="serverIndex==4?'active':''">
            	<a @click="changeServerIndex(4)" href="#Notice" aria-controls="Notice" role="tab" data-toggle="tab">平台公告</a>
            </li>
            <li role="presentation" class="border_dot" :class="serverIndex==2?'active':''">
            	<a @click="changeServerIndex(2)" href="#Security" aria-controls="Security" role="tab" data-toggle="tab">安全保障</a>
            </li>
            <li role="presentation" :class="serverIndex==3?'active':''">
            	<a @click="changeServerIndex(3)" href="#Agreement" aria-controls="Agreement" role="tab" data-toggle="tab">相关协议</a>
            </li>
          </ul>
        </div>
        <div class="conter_right tab-content">
          <div role="tabpanel" class="tab-pane" id="Novice" :class="serverIndex==1?'active':''">
          	<Novice ref="Novice"></Novice>
          </div>
          <div role="tabpanel" class="tab-pane" id="problem" :class="serverIndex==0?'active':''">
          	<problem ref="problem"></problem>
          </div>
          <div role="tabpanel" class="tab-pane" id="Notice" :class="serverIndex==4?'active':''">
          	<Notice ref="Notice"></Notice>
          </div>
          <div role="tabpanel" class="tab-pane" id="Security" :class="serverIndex==2?'active':''">
          	<Security ref="Security"></Security>
          </div>
          <div role="tabpanel" class="tab-pane" id="Agreement" :class="serverIndex==3?'active':''">
          	<Agreement ref="Agreement"></Agreement>
          </div>
        </div>
      </div>
    </div>
    <fot ref="fot"></fot>
  </div>  
</template>

<script>
import Header from '@/components/common/Header';
import Fot from '@/components/common/Footer';
import Icon from 'vue-svg-icon/Icon.vue';
import problem from '@/components/serve/problem';
import Novice from '@/components/serve/Novice';
import Notice from '@/components/serve/Notice';
import Security from '@/components/serve/Security';
import Agreement from '@/components/serve/Agreement';
import { APIS } from '../utils/apis.js';
import COMMON from '@/utils/common'

let vm;
  export default {
    data(){
      return{
       	noticeList:[],
       	totalPage:1,
       	pageNumArr:[],
       	noticeShow:false,
       	currentPage:1,
       	serverIndex:1,
       	detailData:"",
       	pageSize:4,
       	
      }
    },
    components:{
        "top":Header,
        'fot':Fot,
        'problem':problem,
        'Novice':Novice,
        'Notice':Notice,
        'Security':Security,
        'Agreement':Agreement,
        Icon
    },
    mounted(){
      vm = this;
      if(vm.$route.query.type){
      	vm.serverIndex = vm.$route.query.type
      }
     	
     	vm.changeServerIndex(vm.serverIndex)

    },
    watch:{
    	$route: function (to, from) {
	      vm.changeServerIndex(to.query.type)
	    },
    },
    methods:{
    	//切换选项卡
			changeServerIndex(index){
				vm.serverIndex = index
				if(vm.serverIndex == 4){
					vm.getNotice()
				}else{
					vm.getSeverce(index,true)
				}
			},
    	//服务中心
			getSeverce(type,isLoad){
				vm.noticeList = []
				APIS.getSeverce(type,vm.currentPage,9999,isLoad,function(res){
					console.log(res)
					if(res.code != 0){
						return
					}
					vm.noticeList = res.data.result
					vm.totalPage =res.data.totalPage
					//执行分页
  					if(vm.totalPage > 10){
  						console.log(COMMON.getPagination(vm.currentPage,vm.totalPage,vm.pageNumArr))
	  					vm.pageNumArr = COMMON.getPagination(vm.currentPage,vm.totalPage,vm.pageNumArr)
	  					
  					}
						
				})
			},
			//获取公告数据接口
  			getNotice(){
  				vm.noticeList = []
  				APIS.getNotice(vm.currentPage,vm.pageSize,'',function(res){
//	  				console.log(res)
	  				if(res && res.code == 0){
	  					vm.noticeList = res.data.result
	  					vm.totalPage = res.data.totalPage
	  					vm.noticeShow = true
	  					//执行分页
	  					if(vm.totalPage > 10){
	  						console.log(COMMON.getPagination(vm.currentPage,vm.totalPage,vm.pageNumArr))
		  					vm.pageNumArr = COMMON.getPagination(vm.currentPage,vm.totalPage,vm.pageNumArr)
	  						console.log(vm.pageNumArr)
	  					}
	  				}else{
	  					vm.noticeShow = false
	  				}
	  				
	  			})
  			},
  			
    }
    
  }
</script>

<style scoped>
  .clear{
    clear:both;
  }
  a{
    color: #282828;
    text-decoration: none;
  }
  .contWidth{
    margin: 0 auto;
    display: block;
    min-width: 1200px;
    width: 66%;
    position: relative;
  }
  .min-height{
    display: block;
    width: 100%;
    height: 100%;
    min-height: 660px;
    padding-bottom: 30px;
    background: #f1f1f1;
  }

  .conter_left{
    position: absolute;
    top: 30px;
    left: 0;
    width: 220px;
    min-height: 120px;
    background: #fff;
    border-radius: 10px;
    text-align:center;
  }
  .border_dot{
    border-bottom: dotted 1px #ddd;
  }
  .nav-noail{
    padding: 0;
    margin: 0 20px;
  }
  .nav-noail li{
    display: block;
    width: 180px;
    line-height: 60px;
    font-size: 16px;
  }
  
  .nav-noail li a:hover,.active>a{
    color: #ff5d5e;
  }
  .conter_right{
    position: relative;
    top: 30px;
    left: 240px;
    width: calc(100% - 240px);
    min-height: 600px;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 30px;
  } 
</style>
