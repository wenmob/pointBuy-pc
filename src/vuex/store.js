import "babel-polyfill"
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export const store = new Vuex.Store({
  state:{
    beginAuto: true, //分时线是否第一次的处理
    listenStock: true,
    strue: true, // 分时线的控制
    lineC: false,
    
    
    signpop: '', // 控制登录弹出框
    goUri: '', // 跳转地址
    tradeData: {} // 策略的数据，很重要
  },
  mutations:{
    changeBeginAuto: (state,payload) => {
         state.beginAuto = payload;
    },
    changeListenStock: (state,payload) => {
        state.listenStock = payload;
    },
    changeStrue: (state,payload) => {
        state.strue = payload;
    },
    changeLineC: (state,payload) => {
        state.lineC = payload;
    },
    //登录和注册弹窗
    changeSignpop: (state,payload) => {
        state.signpop =  payload
    },
    //重定向
    changeGoUri: (state,payload) => {
        state.goUri = payload
    },
    
    changeTradeData: (state,payload) => {
        state.tradeData = payload
    }

  },
  actions:{
    changeBeginAuto: (context,payload) => {
      context.commit('changeBeginAuto',payload);
    },
    changeListenStock: (context,payload) => {
      context.commit('changeListenStock',payload);
    },
    changeStrue: (context,payload) => {
      context.commit('changeStrue',payload);
    },
    changeLineC: (context,payload) => {
      context.commit('changeLineC',payload);
    },
    //登录和注册弹窗
    changeSignpop: (context,payload) => {
      context.commit('changeSignpop',payload);
    },
    //重定向
    changeGoUri: (context,payload) => {
      context.commit('changeGoUri',payload);
    },
    changeTradeData: (context,payload) => {
      context.commit('changeTradeData',payload);
    }
  }

});

