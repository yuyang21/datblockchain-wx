var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    boarList: [],
    page: 1,
    size: 10,
    totalPages: 1,
    total: 0,
    sowId:undefined
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.id && options.id != 0) {
      this.setData({
        sowId: options.id,
        boarList: []
      });
      // this.getAddressList();
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.setData({
      page: 1,
      boarList: []
    });
    this.getAddressList();
  },
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.ListExcellentMatingBoar, { pigId: that.data.sowId,page: that.data.page, size: that.data.size }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          boarList: that.data.boarList.concat(res.data.boarList),
          totalPages: res.data.totalPages,
          total: res.data.total
        });
      }else{
        util.showErrorToast('参数异常');
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
  vaccineAddOrUpdate (event) {
    console.log(event)
    wx.navigateTo({
      url: '/pages/excellent/matingAdd/matingAdd?id=' + event.currentTarget.dataset.addressId
    })
  },
  deleteAddress(event){
    console.log(event.target)
    let that = this;
    let addressId = event.target.dataset.addressId;
    wx.navigateTo({
      url: '/pages/excellent/matingAdd/matingAdd?sowId=' + that.data.sowId+'&boarId=' + event.target.dataset.addressId
    })
    // wx.showModal({
    //   title: '',
    //   content: '确定要删除种猪？',
    //   cancelColor: '#666666',
    //   confirmColor:'#31c4a1',
    //   success: function (res) {
    //     if (res.confirm) {
    //       let addressId = event.target.dataset.addressId;
    //       util.request(api.ExcellentPigDelete, { id: addressId }, 'POST').then(function (res) {
    //         if (res.errno === 0) {
    //           that.getAddressList();
    //         }
    //       });
    //       console.log('用户点击确定')
    //     }
    //   }
    // })
    return false;
  },
  TimeFormat(data){
    if(data){
      for(let i in data){
        if (data[i].newWeaningTime){
          //data[i].newWeaningTime = data[i].newWeaningTime.replace('T00:00:00', '');
          data[i].newWeaningTime = data[i].newWeaningTime.split("T")[0].replace(/\-/g, '.');
        }else{
          data[i].newWeaningTime = "--";
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