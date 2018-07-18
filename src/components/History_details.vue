<template>
  <div class="modal-dialog" role="document" style="margin-top:5%;">
    <div class="detail_content" style="width:800px; margin-left:-200px;">
      <div class="modal-body">
        <div class="detail_cen">
          <div class="detail_title">交易合作</div>
          <ul>
            <li>投资人<span>{{detailData!= undefined&&detailData.investorName?detailData.investorName:'-'}}</span></li>
            <li>点买人<span>{{detailData!= undefined&&detailData.userName?detailData.userName:'-'}}</span></li>
          </ul>
          <div class="clear"></div>
        </div>
        <div class="detail_cen">
          <div class="detail_title">交易明细</div>
          <ul>
            <li>股票名称<span>{{detailData.stockName}}</span></li>
            <li>交易数量<span>{{detailData.positionNum!=undefined?detailData.positionNum:'-'}}股</span></li>
            <li>买入价格<span>{{detailData.buyAveragePrice!=undefined?detailData.buyAveragePrice.toFixed(2):'-'}}</span></li>
            <li>卖出价格<span>{{detailData.sellAveragePrice!=undefined?detailData.sellAveragePrice.toFixed(2):'-'}}</span></li>
            <li>买入类型<span>市价成交</span></li>
            <li>卖出类型<span>市价成交</span></li>
            <li>买入时间<span>{{detailData.dateAdd?detailData.dateAdd.split(' ')[0]:'-'}}</span></li>
            <li>卖出时间<span>{{detailData.sellTime?detailData.sellTime.split(' ')[0]:'-'}}</span></li>
            <div class="clear"></div>
          </ul>
          <ul style="border-top: 1px solid #ddd;">
            <li>履约保证金<span class="red">{{detailData.deposit!=undefined?detailData.deposit.toFixed(2):'-'}}</span></li>
            <li>综合服务费<span>{{detailData.comFee!=undefined?detailData.comFee.toFixed(2):'-'}}</span></li>
            <li>递延费<span>{{detailData.continueFee!=undefined?detailData.continueFee.toFixed(2):'-'}}</span></li>
          </ul>
          <div class="clear"></div>
        </div>
        <div class="detail_cen">
          <div class="detail_title">盈亏分配</div>
          <ul>
            <li>点买人<span :class="detailData.gainLoss>=0?'red':'green'">{{detailData.gainLoss!=undefined?detailData.gainLoss.toFixed(2):'-'}}</span></li>
            <li>投资人<span class='red'>{{detailData.investorGain!=undefined?detailData.investorGain.toFixed(2):'-'}}</span></li>
          </ul>
          <div class="clear"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" data-dismiss="modal">关闭</button>
        <router-link :to="'Found?code='+detailData.stockCodeAll" tag="button" data-dismiss="modal"  class="btn btn-primary">再次创建策略</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { APIS } from '../utils/apis.js'
import Icon from 'vue-svg-icon/Icon.vue';

let vm;
  export default {
    data(){
      return{
      	id:"",
      	detailData:{},
      }
    },
    components:{
        Icon
    },
    mounted(){
    	vm = this;
//  	vm.strategyDetail()
    },
    methods:{
    	//策略(历史)详情
			strategyDetail(id){
				APIS.strategyDetail(id,function(res){
					if(res.code == 0){
						vm.detailData = res.data
						console.log(vm.detailData)
						console.log(vm.hasDetail)
						//卖出价格
						if(vm.detailData.sellCostTotal!=0&&vm.detailData.sellDoneNum!=0){
							vm.detailData.sellPrice = vm.detailData.sellCostTotal/vm.detailData.sellDoneNum
						}else{
							vm.detailData.sellPrice = 0
						}
					}
					console.log(vm.detailData)
				})
				

			},
    }
  }
</script>

<style scoped>
  .clear{
    clear:both;
  }
  .red{
    color: #ff5d5e;
  }
  .green{
    color: #76cf75;
  }
  .detail_content{
    width:800px;
    margin-left:-200px;
    background: #fff;
    border-radius: 8px;
    padding: 20px;
  }
  .detail_cen{
    text-align: left;
  }
  .detail_title{
    font-size: 18px;
    font-weight: 600;
    width: 100%;
    height: 36px;
    background: #f1f1f1;
    padding:0 10px;
  }
  .detail_cen ul{
    list-style: none;
    margin:0;
    padding: 10px 0;
    font-size: 16px;
    line-height: 48px;
  }
  .detail_cen ul li{
    padding: 0 10px;
    width: 50%;
    float: left;
  }
  .detail_cen ul li span{
    width: 50%;
    float: right;
  }
</style>
