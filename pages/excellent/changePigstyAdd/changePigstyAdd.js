var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    register: {},
    pigId: undefined,
    columnCode: undefined,
    pigType: undefined,
    isOrdinary: false,
    pigStatus:undefined,
    pigStatusArr: ['保育室', '育肥室'],
    pigStatusIndex: undefined,
    pigStatusText: undefined,
    saveRepeat: false
  },
  bindPigStatusChange: function (e) {
    console.log(Number(e.detail.value));
    this.setData({
      pigStatusIndex: e.detail.value,
      pigStatusText: this.data.pigStatusArr[e.detail.value],
      pigStatus: Number(e.detail.value)  + 45
    })
  },
  //页面查询猪信息
  getMatingDetail() {
    let that = this;
    util.request(api.DetailExcellentPig, { id: that.data.pigId }).then(function (res) {
      if (res.errno === 0) {
        if (res.data) {
          that.TimeFormat(res.data);
          that.setData({
            register: res.data,
            //pigStatus: that.data.isOrdinary ? res.data.pigStatus == 46 || res.data.pigStatus == 45? 46:45 :40
          });
        }
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.pigId && options.pigId != 0) {
      this.setData({
        pigId: options.pigId,
        isOrdinary: options.isOrdinary,
        //pigStatus: options.isOrdinary?45:40
      })
      this.getMatingDetail();
    }
  },
  onReady: function () {

  },
  bindIsColumnCode(event) {
    this.setData({
      columnCode: event.detail.value
    });
  },
  //取消
  cancelAddress() {
    wx.navigateBack();
  },
  //保存
  saveAddress() {
    let data = this.data;
    let register = this.data.register;
    if (this.isEmpty(data.columnCode)) {
      util.showErrorToast('没有目标栏号');
      return false;
    }
    this.setData({
      saveRepeat: true
    });
    util.request(api.ChangeCCExcellentPig, {
      id: data.pigId,
      //pigStatus: register.pigStatus,
      columnCode: data.columnCode,
      pigStatus: data.pigStatus,
      pigType: data.pigType,
      version: register.version
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.navigateBack();
      }
    });

  },
  switch2Change: function (e) {
    if (e.detail.value) {
      this.setData({
        pigType: 0
      })
    } else {
      this.setData({
        pigType: 1
      })
    }
  },
  switch3Change: function (e) {
    if (e.detail.value) {
      this.setData({
        pigStatus: 40
      })
    } else {
      this.setData({
        pigStatus: undefined
      })
    }
  },
  radioChange: function (e) {
    this.setData({
      pigStatus: e.detail.value
    })
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
  TimeFormat(data) {
    if (data) {
      if (data.birth) {
        data.birth = data.birth.split("T")[0].replace(/\-/g, '.');
      } else {
        data.birth = "--";
      }
    }
  },

})