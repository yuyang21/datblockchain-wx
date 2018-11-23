const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    powers: [],
    waitMating:0,
    waitGestation:0,
    waitChildbirth:0,
    waitWeneing:0,
    waitWeneing35:0,
    waitMating25:0,
    // itemColumn: ['#ebfcf5', '#f7e6fe', '#ddf7ff', '#fafbc5', '#ddf7ff', '#ffe9d4', '#ffd4d4', '#f7e6fe', '#ebfcf5', '#ddf7ff', '#fcfdce', '#ffd4d4', '#ffe9d4', '#ddf7ff','#ebfcf5']
  },
  onShareAppMessage: function () {
    return {
      title: 'blackPig360',
      desc: '区块黑猪',
      path: '/pages/index/index'
    }
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          powers: res.data.powers,
          waitMating: res.data.waitMating,
          waitGestation: res.data.waitGestation,
          waitChildbirth: res.data.waitChildbirth,
          waitWeneing: res.data.waitWeneing,
          waitWeneing35: res.data.waitWeneing35,
          waitMating25: res.data.waitMating25,
          distinguish: res.data.distinguish
        });
      }
    });
  },
  onLoad: function (options) {
      
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    user.checkLogin().then(res => {
      console.log("index判断已登录");
    }).catch(() => {
      console.log("index跳转到微信登陆");
      wx.navigateTo({ url: "/pages/auth/wxLogin/login" });
    });
    let power = wx.getStorageSync('power');
    if(power){
      this.getIndexData();
    }else{
      wx.navigateTo({ url: "/pages/auth/login/login" });
    }
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
