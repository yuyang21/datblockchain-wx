var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    matingList: [],
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
      matingList: []
    });
    this.getAddressList();
  },
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.ListExcellentPigMating, { page: that.data.page, size: that.data.size }).then(function (res) {
      if (res.errno === 0) {
        that.TimeFormat(res.data.matingList);
        that.setData({
          matingList: that.data.page == 1?res.data.matingList:that.data.matingList.concat(res.data.matingList),
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
        if (data[i].matingTime) {
          //data[i].newWeaningTime = data[i].newWeaningTime.replace('T00:00:00', '');
          data[i].matingTime = data[i].matingTime.split("T")[0].replace(/\-/g, '.');
        } else {
          data[i].matingTime = "--";
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