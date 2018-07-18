<template>
  <div class="section" :style="{'height':offsetheight+'px'}">
    <div class="container-p" :style="{'transform': 'translate3d(0px,-'+ fullPage*offsetheight +'px, 0px)'}">
      <div v-for="i in bannerList" :style="{'height':offsetheight+'px','background':i.bg}">
        <page-one refs="pageOne" v-if="i.sideIndex == 0"></page-one>
        <page-two refs="pageTwo" v-else-if="i.sideIndex == 1"></page-two>
        <page-three refs="pageThree" v-else-if="i.sideIndex == 2"></page-three>
        <page-four refs="pageFour" v-else></page-four>
      </div>
    </div>
    <div class="fixed-list">
      <div v-for="(i,index) in bannerList" :class="fullPage==index?'color':''" @click="pageInfo(index)">
      </div>
    </div>
  </div>
</template>
<script>
import PageOne from '@/components/homePage/PageOne'
import PageTwo from '@/components/homePage/PageTwo'
import PageThree from '@/components/homePage/PageThree'
import PageFour from '@/components/homePage/PageFour'
import { APIS } from '../utils/apis.js';
let vm;
export default{
	data(){
		return {
			bannerList:[                 //盒子背景颜色
				{
          bg:"#fff",
          sideIndex: 0
				},
				{
          bg:"#fff",
          sideIndex: 1
				},
				{
          bg:"#5b90d7",
          sideIndex: 2
				},
				{
          bg:"#3b3b3b",
          sideIndex: 3
				}
			],
			offsetheight:document.documentElement.clientHeight,    //获取当前页面的高度
			fullPage:0,           //当前在第几页
			fullPageNum:false,        //是否在滑动
		}
  },
  components: {
    'pageOne': PageOne,
    'pageTwo': PageTwo,
    'pageThree': PageThree,
    'pageFour': PageFour
  },
  beforeDestroy() {
    document.removeEventListener('DOMMouseScroll',this.scroll,false);
    window.onmousewheel=document.onmousewheel=null;
  },
  beforeMount() {
    vm = this;
		//在元素加载完毕的时候添加鼠标滑动事件
		if(document.addEventListener){
        document.addEventListener('DOMMouseScroll',this.scroll,false);
    }
    window.onmousewheel=document.onmousewheel=this.scroll;
    vm.rollingStrategy()
  },
	mounted(){
	},
	methods:{
		//
		//点击左侧小点时跳转到相应的page
		//
		pageInfo(index){
			this.fullPage=index;
		},
		//
		//鼠标事件
		//
		scroll(e){
			e=e || window.event;
			//是否正在滑动
        if(this.fullPageNum){
            return false;
        }
        // console.log(e.detail + 'sfasf');

        //
        //   e.wheelDelta为负数时向下滑动
        //
        if(e.wheelDelta<0 | e.detail < 0){
            if(this.fullPage>=3){
                return false
            }
            this.fullPageNum=true;
            this.pageInfo(this.fullPage+1);
            //
            //  css设置动画事件为1000，所以等到1000ms后滚动状态为false
            //
            setTimeout(()=>{
            	this.fullPageNum=false;
            },1000)
        //
        //   否则就是向上划
        //
        }else{
            if(this.fullPage<=0){
                return false;
            }
            this.fullPageNum=true;
            this.pageInfo(this.fullPage-1);
            setTimeout(()=>{
            	this.fullPageNum=false;
            },1000)
        }
		},
		// 首页滚动策略
	    rollingStrategy () {
	      /*APIS.rollingStrategy(function (res) {
	      	console.log(res)
	        if (res.code == 0) {
//	          vm.hasData = true
						console.log(vm.$refs)
	          vm.$refs.pageThree.tacticsList = res.data
	        } else {
//	          vm.hasData = false
	        }
	        console.log(vm.$refs.pageThree.tacticsList)
	      })*/
	    },
	}
}
</script>
<style lang="scss">
.section {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.container-p {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translate3d(0px, 0px, 0px);
  transition: all 1000ms ease;
}
.fixed-list {
  position: fixed;
  top: 40%;
  right: 20px;
  div {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    margin-bottom: 20px;
    border: 1px solid #fff;
    cursor:pointer;
  }
  div.color {
    background: #fff;
  }
}
</style>
