var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    map: {},
    start: util.formatTimeDateByMonth(new Date(), -1),
    end: util.formatTimeDate(new Date())
  },
  onLoad: function (options) {
    this.getAddressList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {

  },
  //加载数据
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.DataChildbirthSummary, {
      start: that.data.start.replace(' 00:00:00', '') + " 00:00:00",
      end: that.data.end.replace(' 00:00:00', '') + " 00:00:00",
    }).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        if (res.data == null) {
          res.data = {
            alive_number: 0,
            piglet_number: 0,
            alive_number: 0,
            mummy_number: 0,
            drowning_number: 0,
            stillbirth_number: 0
          }
        }
        let map = res.data;
        that.setData({
          map: map
        });
      }
      wx.hideLoading();
    });
  },
  query: function () {
    this.getAddressList();
  },
  //  点击日期组件确定事件  
  bindStartDateChange: function (e) {
    this.setData({
      start: e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    this.setData({
      end: e.detail.value
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

})
