var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {
      nickName: '点击登录',
      avatarUrl: ''
    },
    powerInfo: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {

  },
  onShow: function () {
    //获取用户的登录信息
    if (app.globalData.hasLogin){
      let userInfo = wx.getStorageSync('userInfo');
      let powrInfoName = wx.getStorageSync('powerName');
      this.setData({
        userInfo: userInfo,
        powerInfo: powrInfoName
      });
    }

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  goLogin(){
    if (!app.globalData.hasLogin) {
      wx.navigateTo({ url: "/pages/auth/login/login" });
    }
  },
  
  exitLogin: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      cancelColor: '#666666',
      confirmColor: '#31c4a1',
      success: function (res) {
        if (res.confirm) {
          // wx.removeStorageSync('token');
          // wx.removeStorageSync('userInfo');
          util.request(api.ExitLogin).then(function (res) {
            if (res.errno === 0) {
              // wx.switchTab({
              //   url: '/pages/index/index'
              // });
              wx.removeStorageSync('power');
              wx.navigateTo({
                url: '/pages/auth/login/login',
              })
            }else{
              util.showErrorToast('退出登录失败');
            }
          });
        }
      }
    })

  }
})