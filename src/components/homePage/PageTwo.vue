<template>
  <div class="section section_two" v-lazy:background-image="imgIcon">
    <div class="search_stock">
      <h4>查询股票</h4>
      <div class="search_input">
        <input type="text" v-model="stock" @focus="stopBS" @input="searchStock($event)" class="form_input">
        <span class="input-group-btn">
          <button class="btn search_btn" type="button">
            <icon name="Search" scale="4.2"></icon>
          </button>
        </span>
        <!--显示搜索内容-->
		<div class="found-input-d" v-show="fidShow">
			<div class="found-input-d-nrr" v-for="(sst,index) in serchSt" :key="index" @mouseover="onMouseOver($event)" @mouseout="onMouseOut($event)" @click="clickGuo(sst.stockCode)">
				<span>{{sst.stockName}}</span>
				<span>{{sst.stockCode.replace(/\D/g,'')}}</span>
			</div>
		</div>
      </div>
      <div class="indexes">
        <dl>
          <dd v-for="item in sinajsNum">
            <p>{{item[0]}}</p>
            <p>
              <strong :class="item[2]<0?'green':'red'">{{Number(item[1]).toFixed(2)}}</strong>
            </p>
            <p>
              <span :class="item[2]<0?'green':'red'">{{item[2] < 0 ? item[2]: '+'+item[2]}}</span>
              <span :class="item[2]<0?'green':'red'">{{item[3] < 0 ? item[3]: '+'+item[3]}}%</span>
            </p>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
import { sinaStock } from '../../quote/sina'
let vm;
export default {
  data () {
    return {
			sinajsNum:[],
			hasData:false,
			tacticsList:[],
			stock: '',
			serchSt:"",
			fidShow: false,
			imgIcon:require("../../assets/img/background_01.jpg")
    }
  },
  components: {
    Icon
  },
  mounted(){
  	vm = this;
  	vm.getsinajs()
  },
  methods:{
  	// 当搜索input获取焦点的时候
			stopBS() {
				if(this.serchSt.length > 0) {
					this.fidShow = true
				} else {
					this.fidShow = false
				}
				this.$store.commit('changeListenStock', false)
				this.$store.commit('changeBeginAuto', false)
				this.$store.commit('changeStrue', false)
				this.$store.commit('changeLineC', false)
			},
			searchStock(e) {
				let _this = this
				let element = e.target.value
				_this.hasStock(element)
			},
			hasStock(element) {
				let _this = this
				// 渲染的数据内容
				let st = []
				this.getStockArray(element.toLowerCase()).then(res => {
					res.forEach(elem => {
						let arr = elem.split(',')
						if(arr[1] * 1 === 11) {
							let obj = {
								stockCode: arr[3],
								stockName: arr[4]
							}
							st.push(obj)
						}
					})
					_this.serchSt = st
					if(_this.serchSt.length > 0) {
						_this.fidShow = true
					} else {
						_this.fidShow = false
					}
				})
			},
			// 获取股票的信息
			getStockArray(k) {
				return new Promise((resolve, reject) => {
					sinaStock.getStock(k, (data) => {
						resolve(data)
					})
				})
			},
			// 鼠标移入的效果
			onMouseOver(e) {
				let _this = this
				let element = e.currentTarget
				element.style.background = '#f1f1f1'
			},
			// 鼠标移出的效果
			onMouseOut(e) {
				let _this = this
				let element = e.currentTarget
				element.style.background = 'transparent'
			},
			// 点击搜索后的效果
    		clickGuo(code){
//  			console.log(code)
    			vm.$router.push({path:"/Found",query:{code:code}})
    		},
  	// 获取上证指数
			getsinajs() {
				$.ajax({
					url: 'http://hq.sinajs.cn/list=s_sh000001,s_sz399001,s_sz399006',
					dataType: 'script',
					cache: true,
					success: function(data) {
						vm.sinajsNum.push(hq_str_s_sh000001.split(','))
						vm.sinajsNum.push(hq_str_s_sz399001.split(','))
						vm.sinajsNum.push(hq_str_s_sz399006.split(','))
//						 console.log(vm.sinajsNum);
					}
				})
			},
			
  }
}
</script>

<style>
@import url("../../assets/css/style.css");
@import url("../../assets/css/page.css");
.found-input-d {
		position: absolute;
		width: 100%;
		max-height: 320px;
		left: 0;
		top: 80px;
		z-index: 2000;
		background-color: #fff;
		overflow: auto;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	
	.found-input-d-nrr {
		padding: 7px 18px;
		cursor: pointer;
	}
	
	.found-input-d-nrr span {
		display: inline-block;
		font-size: 14px;
		color: #525252;
	}
	
	.found-input-d-nrr span:nth-child(1) {
		width: 100px;
	}
	
	.found-input-d-nrr span:nth-child(2) {
		width: 70px;
	}
.section_two {
  /*background: url(../../assets/img/background_01.jpg) 50%;*/
}
.search_stock{
    position: absolute;
    top: 36%;
    display: block;
    width: 100%;
    text-align: center;
  }
  .search_stock h4{
    font-size: 36px;
    font-weight: 900;
    margin-bottom: 20px;
    letter-spacing:8px;
  }
  .search_input{
  	position:relative;
    min-width: 900px;
    width: 55%;
    margin: 0 auto;
    height: 80px;
    border-radius: 40px;
    border: 1px solid #ff5d5e;
  }
  .search_input .form_input{
    width: 86%;
    height: 78px;
    border: none;
    background: none;
    font-size: 18px;
    float: left;
    padding-left: 40px; 
  }
  .search_input .search_btn{
    box-shadow: none;
    background: none;
    margin-top: 10px;
  }
  .indexes{
    display: block;
    width: 800px;
    margin: 0 auto;
    padding-top: 60px;
  }
  .indexes dl dd{
    width: 33.33%;
    float: left;
  }
  .indexes dl .border-left{
    border-left: 1px solid #ddd;
  }
  .indexes dl dd p{
    color: #585858;
    font-size: 18px;
    margin-bottom: 5px;
  }
  .indexes dl dd p strong{
    font-size: 28px;
  }
  .indexes dl dd p span{
    padding: 0 10px;
    font-size: 18px;
  }

</style>


