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
  },
  onLoad: function (options) {
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.setData({
      page: 1
    });
    this.getAddressList();
  },
  //加载猪列表
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.OrdinaryWeightlist, { page: that.data.page, size: that.data.size }).then(function (res) {
      if (res.errno === 0) {
        that.TimeFormat(res.data.weightList);
        that.setData({
          vaccineList: that.data.page == 1 ? res.data.weightList : that.data.vaccineList.concat(res.data.weightList),
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
  TimeFormat(data) {
    if (data) {
      for (let i in data) {
        if (data[i].birth) {
          data[i].birth = data[i].birth.split("T")[0].replace(/\-/g, '.');
        } else {
          data[i].birth = "--";
        }
        if (data[i].weightTime) {
          data[i].weightTime = data[i].weightTime.split("T")[0].replace(/\-/g, '.');
        } else {
          data[i].weightTime = "--";
        }
      }
    }
  },
  vaccineAddOrUpdate(event) {
    console.log(event)
    wx.navigateTo({
      url: '/pages/ordinary/weightAdd/weightAdd'
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})