<template>
  <div class="section" display="block">
    <div class="moving_Location">
      <div class="moving">
        <h4>策略动态</h4>
        <ul>
          <li v-for="item in tacticsList">
            <span>{{item.mobile}}</span>
            <span>{{item.dateStr}}</span>
            <span>{{item.stockName}} {{item.number}}股</span>
            <span>
              <router-link :to="'/Found?code='+(item.stockCodeFull).toLowerCase()" tag="button">点 买</router-link>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { APIS } from '../../utils/apis.js';
	
	let vm;
export default {
		data(){
			return{
				hasData:false,
				tacticsList:[]
			}
		},
		mounted(){
			vm = this;
			vm.rollingStrategy()
		},
		methods:{
			 // 首页滚动策略
	    rollingStrategy () {
	      APIS.rollingStrategy(function (res) {
	        if (res.code === 0) {
	          vm.hasData = true
	          vm.tacticsList = res.data
	        } else {
	          vm.hasData = false
	        }
	      })
	    },
		}
}
</script>

<style>
  @import url("../../assets/css/page.css");
    .moving_Location{
    position: absolute;
    top: 28%;
    display: block;
    width: 100%;
    text-align: center;
  }
  .moving{
    display: block;
    color: #fff;
    width: 55%;
    min-width: 1200px;
    margin: 0 auto;
  }
  .moving h4{
    font-size: 36px;
    font-weight: 900;
    margin-bottom: 60px;
    letter-spacing:8px;
  }
  .moving ul{
    list-style: none;
  }
  .moving ul li{
    line-height: 28px;
    padding: 10px 0;
    border-bottom: 1px dotted #fff;
    font-size: 16px;
  }
  .moving ul li span{
    display: inline-block;
    width: 24%;
    margin: 0;
    padding: 0;
  }
  .moving ul li span button{
    width: 100px;
    height: 28px;
    border-radius: 14px;
    border: 0;
    color: #ff5d5e;
  }
</style>


