var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    photoList: [],
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
    this.setData({
      page: 1,
      photoList: []
    });
    this.getAddressList();
  },
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.PhotoList, { page: that.data.page, size: that.data.size }).then(function (res) {
      if (res.errno === 0) {
        console.log(res);
        that.TimeFormat(res.data.data);
        that.setData({
          photoList: that.data.photoList.concat(res.data.data),
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
      url: '/pages/ordinary/photographAdd/photographAdd'
    })
  },
  TimeFormat(data) {
    if (data) {
      for (let i in data) {
        if (data[i].addTime) {
          data[i].addTime = data[i].addTime.replace('T00:00:00', '');
        }
      }
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }
})