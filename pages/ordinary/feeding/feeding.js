var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    feedingList: [],
    page: 1,
    size: 10,
    totalPages: 1,
    total: 0
  },
  onLoad: function (options) {

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.setData({
      page: 1,
      feedingList: []
    });
    this.getAddressList();
  },
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.FeedingList, { page: that.data.page, size: that.data.size, pigType: 1 }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          //feedingList: res.data.feedingList
          feedingList: that.data.feedingList.concat(res.data.feedingList),
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
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})