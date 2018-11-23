var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    vaccineList: [],
    page: 1,
    size: 10,
    totalPages: 1,
    total: 0,
    pigType: 0
  },
  onLoad: function (options) {
    console.log(options);
    if (options.pigType && options.pigType == 1) {
      this.setData({
        pigType: 1
      });
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    this.setData({
      page: 1,
      vaccineList: []
    });
    this.getAddressList();
  },
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.ListExcellentVaccine, { pigType: that.data.pigType, page: that.data.page, size: that.data.size }).then(function (res) {
      if (res.errno === 0) {
        that.TimeFormat(res.data.vaccineList);
        that.setData({
          vaccineList: that.data.vaccineList.concat(res.data.vaccineList),
          totalPages: res.data.totalPages,
          total: res.data.total
        });
      }
      wx.hideLoading();
    });
  },
  //下拉刷新
  onReachBottom() {
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
    } else {
      return false;
    }

    this.getAddressList();
  },
  vaccineAddOrUpdate(event) {
    let data = this.data;
    wx.navigateTo({
      url: '/pages/excellent/vaccineAdd/vaccineAdd?id=' + event.currentTarget.dataset.addressId + "&pigType=" + data.pigType
    })
  },
  TimeFormat(data) {
    if (data) {
      for (let i in data) {
        if (data[i].vaccineTime) {
          data[i].vaccineTime = data[i].vaccineTime.replace('T00:00:00', '');
        }
      }
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})