var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    childbirthsList: [],
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
      page: 1
    });
    this.getAddressList();
  },
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.ExcellentPigChildbirthList, { page: that.data.page, size: that.data.size }).then(function (res) {
      if (res.errno === 0) {
        that.TimeFormat(res.data.childbirthsList);
        console.log(res.data.childbirthsList);
        that.setData({
          childbirthsList: that.data.childbirthsList.concat(res.data.childbirthsList),
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
  //查看详情时开发
  vaccineAddOrUpdate (event) {
    console.log(event)
    wx.navigateTo({
      url: '/pages/excellent/matingBoar/matingBoar?id=' + event.currentTarget.dataset.addressId
    })
  },
  
  
  TimeFormat(data) {
    if (data) {
      for (let i in data) {
        if (data[i].childbirthTime) {
          data[i].childbirthTime = data[i].childbirthTime.split("T")[0].replace(/\-/g, '.');
        } else {
          data[i].childbirthTime = "--";
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