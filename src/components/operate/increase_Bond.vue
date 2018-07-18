<template>
  <div class="Bond_frame">
    <div class="frame_content">
      <div class="frame_title">
        <h4>增加保证金</h4>
        <button type="button" class="frame_close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <div class="clear"></div>
      </div>
      <div class="frame_con">
        <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
        <p>最低止损金额：<span class="green">-7000.00</span></p>
        <p>递延条件≥4000.00</p>
        <button class="bond_but" type="button">下一步</button>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue';

let vm;
  export default {
    data(){
      return{
      }
    },
    components:{
        Icon
    }
  }
</script>

<style scoped>
  body{
    display: block;
    width: 100%;
    height: 100%;
    background: #666;
  }
  .clear{
    clear:both;
  }
  .red{
    color: #ff5d5e;
  }
  .green{
    color: #76cf75;
  }

  .Bond_frame{
    position: absolute;
    top: 45%;
    left: 50%;
    margin-top: -170px;
    margin-left: -290px;
  }
  .frame_content{
    display: block;
    width: 580px;
    min-height: 340px;
    background: #f1f1f1;
    border-radius: 10px;
  }
  .frame_title{
    width: auto;
    height: 68px;
    border-bottom: 1px solid #ddd;
    border-radius: 10px 10px 0 0;
    color: #282828;
    padding: 0 20px;
  }
  .frame_title h4{
    float: left;
    font-size: 18px;
    font-weight: 600;
    padding-left: 10px;
    border-left: 6px solid #ff5d5e;
    margin-top: 24px;
  }
  .frame_close{
    float: right;
    background: none;
    border: none;
    font-size: 36px;
  }
  .frame_con{
    padding: 40px; 
  }
  .frame_con p{
    margin: 20px 0;
  }
  .bond_but{
    background: #ff5d5e;
    width: 40%;
    height: 40px;
    border-radius: 4px;
    border:none;
    color: #fff;
  }
</style>
