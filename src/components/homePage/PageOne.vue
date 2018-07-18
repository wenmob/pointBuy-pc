<template>
  <div :style="{background: 'url('+ prodctBg +') no-repeat 50%'}" class="section section_one">
    <div class="cen_nav">
      <dl>
        <dd>
          <a>
            <span style="background:#ff5d5e">
              <icon name="Novice" scale="5"></icon>
            </span>
            <p>新手课堂</p>
          </a>
        </dd>
        <dd>
          <a @click="changeShadow">
            <span style="background:#76cf75">
              <icon name="Vip" scale="5"></icon>
            </span>
            <p>注册会员</p>
          </a>
        </dd>
        <dd>
          <a href="#/Found">
            <span style="background:#5bc1d7">
              <icon name="Create" scale="5"></icon>
            </span>
            <p>创建策略</p>
          </a>
        </dd>
        <dd>
          <a href="#/money">
            <span style="background:#ffb849">
              <icon name="Money" scale="5"></icon>
            </span>
            <p>充值中心</p>
          </a>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
import { APIS } from '../../utils/apis.js';
let vm;
export default {
  data () {
    return {
				prodctBg:"",
				isLogin:false
    }
  },
  components: {
    Icon
  },
  mounted(){
  	vm = this;
  	vm.getbgPic("index_prodct_background")
  },
  methods:{
  	//显示注册
      changeShadow(){
      	//判断是否登录
				APIS.checklogin(function(res){
					if(res.code != 0){
						vm.$store.commit('changeSignpop', "register")
					}
				})
     },
     //获取背景图片
			getbgPic(position) {
				APIS.getbgPic(position, function(res) {
					if(res.code != 0) {
						layer.msg(res.msg)
						return
					}
					vm.prodctBg = res.data.pic
				})
			},
			
  }
}
</script>

<style>
 @import url('../../assets/css/page.css');
 .section_one{
    /*background: url(../../assets/img/banner.jpg) 50%;*/
  }
</style>


