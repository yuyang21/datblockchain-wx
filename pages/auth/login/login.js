var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../services/user.js');

var app = getApp();
Page({
  data: {
    username: '',
    password: '',
    code: '',
    loginErrorCount: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  wxLogin: function () {
    user.checkLogin().catch(() => {

      user.loginByWeixin().then(res => {
        app.globalData.hasLogin = true;

        wx.navigateBack({
          delta: 1
        })
      }).catch((err) => {
        app.globalData.hasLogin = false;
        util.showErrorToast('微信登录失败');
      });

    });
  },
  accountLogin: function () {
    var that = this;

    if (this.data.password.length < 1 || this.data.username.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        cancelColor: '#666666',
        confirmColor: '#31c4a1',
        showCancel: false
      });
      return false;
    }
    util.request(api.AuthLoginByAccount, {username: that.data.username,password: that.data.password
    }, 'POST').then(function (res) {
      if (res.errno == 0) {
        that.setData({
          loginErrorCount: 0
        });
        wx.setStorageSync('power', res.data.power);
        wx.setStorageSync("powerName", res.data.powerName);
        wx.navigateBack({
          delta: 1
        })
      } else if (res.errno == 401){
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        wx.removeStorageSync('power');
        app.globalData.hasLogin = false;
        wx.navigateTo({ url: "/pages/auth/wxLogin/login" });
      }
      else {
        that.setData({
          loginErrorCount: that.data.loginErrorCount + 1
        });
        //app.globalData.hasLogin = false;
        util.showErrorToast('账户登录失败');
      }
    });
    // wx.request({
    //   url: api.AuthLoginByAccount,
    //   data: {
    //     username: that.data.username,
    //     password: that.data.password
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     if (res.data.errno == 0){
    //       that.setData({
    //         loginErrorCount: 0
    //       });
    //       // app.globalData.hasLogin = true;
    //       // wx.setStorageSync('userInfo', res.data.data.userInfo);
    //       // wx.setStorage({
    //       //   key:"token",
    //       //   data: res.data.data.token,
    //       //   success: function(){
    //       //     wx.switchTab({
    //       //       url: '/pages/ucenter/index/index'
    //       //     });
    //       //   }
    //       // });
    //       wx.setStorageSync('power', res.data.data.power);
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     }
    //     else{
    //       that.setData({
    //         loginErrorCount: that.data.loginErrorCount + 1
    //       });
    //       //app.globalData.hasLogin = false;
    //       util.showErrorToast('账户登录失败');
    //     }
    //   }
    // });
  },
  bindUsernameInput: function (e) {

    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function (e) {

    this.setData({
      password: e.detail.value
    });
  },
  bindCodeInput: function (e) {

    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  }
})