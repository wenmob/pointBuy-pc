<template>
  <div class="textContainer">
    <top ref="top"></top>
    <div class="text_area">
      <div class="contWidth">
        <div class="text_cen">
          <div class="text_cen_tit">{{detailData.title}}</div>
          <div class="text_content" v-html="detailData.content">
          	
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
import { APIS } from '../utils/apis.js';
let vm;
  export default {
    data(){
      return{
      	detailData:{}
      }
    },
    components:{
        "top":Header,
        'fot':Fot,
        Icon
    },
    mounted(){
    	vm = this;
    	if(vm.$route.query.type == "rule"){
    		vm.getUserNotice()
    		return
    	}
    	if(vm.$route.query.type == "notice"){
    		vm.noticeDetail()
    		return
    	}
    	
    },
    methods:{
    	//相关协议
    	getUserNotice () {
	      APIS.siteExtContent(vm.$route.query.index, (res) => {
	      	vm.detailData = {}
	        if (res.code === 0) {
	          vm.detailData = res.data
	        }
	      })
    	},
    	//公告详情
			noticeDetail(){
				vm.detailData = {}
  				APIS.getNoticeDetail(vm.$route.query.id,function(res){
//						console.log(res)
  					if(res.code == 0){
  						vm.detailData = res.data[0]
//	  						console.log(vm.detailData)
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
  .contWidth{
    margin: 0 auto;
    display: block;
    min-width: 1200px;
    width: 66%;
  }

  
  .text_area{
    display: block;
    width: 100%;
    min-height: 880px;
    padding-top: 40px;
    padding-bottom: 60px; 
    background: #f1f1f1;
  }
  .text_cen{
    width: auto;
    min-height: 780px;
    background: #fff;
    border-radius: 20px;
    padding: 20px 40px;
  }
  .text_cen_tit{
    height: 48px;
    line-height: 48px;
    text-align: left;
    font-size: 18px;
    font-weight: 600;
    color: #282828;
    border-bottom: 1px dotted #ddd;
  }
  .text_content{
    padding: 30px 0;
    font-family: "宋体";
    color: #282828;
    text-align:center;
  }
  
</style>
