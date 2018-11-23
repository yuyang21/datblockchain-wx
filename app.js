var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

App({
  onLaunch: function () {
  },
  onShow: function (options) {
    user.checkLogin().then(res => {
      //console.log("app中判断登陆过了");
      this.globalData.hasLogin = true;
    }).catch(() => {
      //console.log("app中判断没有登陆");
      this.globalData.hasLogin = false;
      //没有登陆，这里进行微信登陆
      user.checkLogin().catch(() => {
        user.loginByWeixin().then(res => {
          this.globalData.hasLogin = true;
          //解决远程调试不进入页面问题
          wx.switchTab({
            url: "/pages/index/index"
          });
          // wx.navigateBack({
          //   delta: 1
          // })
        }).catch((err) => {
          this.globalData.hasLogin = false;
          util.showErrorToast('微信登录失败');
          wx.navigateTo({ url: "/pages/auth/wxLogin/login" });
        });

      });
    });
  },
  globalData: {
    hasLogin: false,
    power:null,
    first:true
  }
})