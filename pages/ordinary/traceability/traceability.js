var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    scanUrl:undefined
  },
  onLoad: function (options) {
    console.log("zhy");
    let that = this;
    setTimeout(function () {
      that.earTabAdd();
    }, 500)
  },
  onReady: function () {

  },
  //耳缺扫一扫
  earTabAdd() {
    let that = this;
    wx.scanCode({
      success: (res) => {
        let scanValue = res.result;
        util.request(api.QrCodeSubstitution, { url: scanValue }, 'POST').then(function (res) {
          if (res.errno === 0) {
            that.setData({
              scanUrl: res.data
            })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            util.showErrorToast(res.errmsg);
            setTimeout(function () {
              wx.navigateBack();
            }, 1000) 
          }
        });
      },
      fail: (res) => {
        util.showErrorToast("失败");
        setTimeout(function () {
          wx.navigateBack();
        }, 500)
      },
      complete: (res) => {
      }
    })
  },
  
  onShow: function () {
    
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})