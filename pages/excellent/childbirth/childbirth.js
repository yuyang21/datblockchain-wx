var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    vaccineList: [],
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
      vaccineList: []
    });
    this.getAddressList();
  },
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.ListExcellentPig, { pigStatus:20, page: that.data.page, size: that.data.size }).then(function (res) {
      if (res.errno === 0) {
        that.TimeFormat(res.data.pigList);
        that.setData({
          vaccineList: that.data.page == 1 ? res.data.pigList:that.data.vaccineList.concat(res.data.pigList),
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
  selectPig(event){
    let that = this;
    let addressId = event.target.dataset.addressId;
    wx.navigateTo({
      url: '/pages/excellent/childbirthAdd/childbirthAdd?sowId=' + event.target.dataset.addressId
    })
    return false;
  },
  TimeFormat(data){
    if(data){
      for(let i in data){
        if (data[i].preproductionTime){
          data[i].preproductionTime = data[i].preproductionTime.split("T")[0].replace(/\-/g, '.');
        }else{
          data[i].preproductionTime = "--";
        }
      }
    }
  },
  vaccineAddOrUpdate(event) {
    console.log(event)
    wx.navigateTo({
      url: '/pages/excellent/childbirthRecord/childbirthRecord'
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})