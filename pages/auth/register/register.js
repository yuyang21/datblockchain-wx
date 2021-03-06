var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    code: ''
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
  sendCode: function () {
    wx.showModal({
      title: '注意',
      content: '由于目前不支持手机短信发送，因此验证码任意值都可以',
      cancelColor: '#666666',
      confirmColor: '#31c4a1',
      showCancel: false
    });
  },
  startRegister: function () {
    var that = this;

    if (this.data.password.length < 3 || this.data.username.length < 3) {
      wx.showModal({
        title: '错误信息',
        content: '用户名和密码不得少于3位',
        cancelColor: '#666666',
        confirmColor: '#31c4a1',
        showCancel: false
      });
      return false;
    }

    if (this.data.password != this.data.confirmPassword) {
      wx.showModal({
        title: '错误信息',
        content: '确认密码不一致',
        cancelColor: '#666666',
        confirmColor: '#31c4a1',
        showCancel: false
      });
      return false;
    }

    if (this.data.mobile.length == 0 || this.data.code.length == 0) {
      wx.showModal({
        title: '错误信息',
        content: '手机号和验证码不能为空',
        cancelColor: '#666666',
        confirmColor: '#31c4a1',
        showCancel: false
      });
      return false;
    }

    wx.request({
      url: api.AuthRegister,
      data: {
        username: that.data.username,
        password: that.data.password,
        mobile: that.data.mobile,
        code: that.data.code
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.errno == 0) {
          app.globalData.hasLogin = true;
          wx.setStorageSync('userInfo', res.data.data.userInfo);
          wx.setStorage({
            key: "token",
            data: res.data.data.token,
            success: function () {
              wx.switchTab({
                url: '/pages/ucenter/index/index'
              });
            }
          });

        }
      }
    });
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
  bindConfirmPasswordInput: function (e) {

    this.setData({
      confirmPassword: e.detail.value
    });
  },
  bindMobileInput: function (e) {

    this.setData({
      mobile: e.detail.value
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
      case 'clear-confirm-password':
        this.setData({
          confirmPassword: ''
        });
        break;
      case 'clear-mobile':
        this.setData({
          mobile: ''
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