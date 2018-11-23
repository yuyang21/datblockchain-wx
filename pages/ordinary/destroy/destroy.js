var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    pigList: [],
    page: 1,
    size: 10,
    totalPages: 1,
    total: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //this.getAddressList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.initData();
  },
  initData(){
    this.setData({
      page: 1,
      pigList: []
    });
    this.getAddressList();
  },
  getAddressList (){
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.ListExcellentPig, {pigType:1, page: that.data.page, size: that.data.size }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          //pigList: res.data.pigList
          pigList: that.data.pigList.concat(res.data.pigList),
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
  deleteAddress(event){
    console.log(event.target)
    let that = this;
    wx.showModal({
      title: '',
      content: '此肉猪确定要淘汰？',
      confirmColor: '#31c4a1',
      cancelColor: '#666666',
      success: function (res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          util.request(api.ExcellentPigDelete, { id: addressId }, 'POST').then(function (res) {
            if (res.errno === 0) {
              that.initData();
            }
          });
          console.log('用户点击确定')
        }
      }
    })
    return false;
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})