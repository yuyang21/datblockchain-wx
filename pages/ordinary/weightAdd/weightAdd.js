var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    register: {
      earNotch: undefined,
      weight: undefined,
      earTag: undefined,
      weightTime: util.formatTimeDate(new Date()),
      saveRepeat:false
    },
  },
  bindinputEarNotch(event) {
    let register = this.data.register;
    register.earNotch = event.detail.value;
    this.setData({
      register: register
    });
  },
  bindinputWeight(event) {
    let register = this.data.register;
    register.weight = event.detail.value;
    this.setData({
      register: register
    });
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    let register = this.data.register;
    register.weightTime = e.detail.value;
    this.setData({
      register: register
    })
  },
  onLoad: function (options) {
  },
  onReady: function () {

  },
  cancelAddress() {
    wx.navigateBack();
  },
  //耳缺扫一扫
  earTabAdd() {
    let that = this;
    wx.scanCode({
      success: (res) => {
        let scanValue = res.result;
        util.request(api.QrCodeCheck, { url: scanValue, type: 'check' }, 'POST').then(function (res) {
          //校验url是否合法
          //校验二维码是否已绑定
          let register = that.data.register;
          if (res.errno === 0) {
            register.earTag = res.data;
            that.setData({
              register: register
            })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            register.earTag = undefined;
            that.setData({
              register: register
            })
            util.showErrorToast(res.errmsg);
          }
        });
      },
      fail: (res) => {
        util.showErrorToast("失败");
      },
      complete: (res) => {
      }
    })
  },
  saveAddress() {
    console.log(this.data.register)
    let register = this.data.register;
    if (this.isEmpty(register.earNotch) && this.isEmpty(register.earTag)) {
      util.showErrorToast('请输入耳缺或扫描耳标');
      return false;
    }

    if (this.isEmpty(register.weight)) {
      util.showErrorToast('请输入重量');
      return false;
    }

    if (this.isEmpty(register.weightTime)) {
      util.showErrorToast('请选择时间');
      return false;
    }
    this.setData({
      saveRepeat:true
    });
    let that = this;
    util.request(api.OrdinaryWeightAdd, {
      earNotch: register.earNotch,
      earTag: register.earTag,
      weight: register.weight,
      weightTime: register.weightTime.replace('T00:00:00', '') + "T00:00:00"
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.navigateBack();
      } else if (res.errno === 403){
        util.showErrorToast('耳缺耳标错误');
      }
    });

  },
  onShow: function () {
    // 页面显示
    this.setData({
      saveRepeat:false
    });

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  isEmpty(data) {
    if (data == '' || data == undefined) {
      return true;
    } else {
      return false;
    }
  },

})