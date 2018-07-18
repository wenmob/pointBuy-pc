<template>
  <div class="textContainer">
    <top ref="top"></top>
    <div class="text_area">
      <div class="contWidth">
        <div class="text_cen">
          <div class="text_cen_tit">策略须知</div>
          <div v-html="userNotice" class="notes_content">
          	
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
      	userNotice:""
      }
    },
    components:{
        "top":Header,
        'fot':Fot,
        Icon
    },
    mounted(){
    	this.getUserNotice()
    },
    methods:{
    	getUserNotice () {
	      APIS.siteExtContent('user-agreement', (res) => {
	        if (res.code === 0) {
	          this.userNotice = res.data.content
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
  .notes_content{
    padding: 20px 0;
  }
  .notes_trade{
    border-bottom: 1px dotted #ddd;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  .notes_content p span{
    font-size: 18px;
    text-align: left;
    line-height: 36px;
    color: #282828;
    font-weight: 600;
  }
  .notes_content p{
    font-size: 16px;
    text-align: left;
    line-height: 24px;
    text-indent: 2em;
    color: #585858;
    margin-bottom: 10px;
  }
</style>
