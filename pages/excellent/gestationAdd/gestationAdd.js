var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    register: {},
    pigStatus:null,
    sowId: null,
    pigStatusIndex: undefined,
    pigStatusArr: ['已受孕', '未受孕'],
    pigStatusText: '',
    saveRepeat:false
  },
  //页面查询猪信息
  getMatingDetail() {
    let that = this;
    util.request(api.SowDetail, { id: that.data.sowId }).then(function (res) {
      if (res.errno === 0) {
        if(res.data){
          console.log(res.data);
            that.TimeFormat(res.data);
            that.setData({
              register: res.data
            });
        }
      }
    });
  },
  bindPigStatusChange: function (e) {
    this.setData({
      pigStatusIndex: e.detail.value,
      pigStatusText: this.data.pigStatusArr[e.detail.value],
      pigStatus: this.data.pigStatusArr.length * 10 + Number(e.detail.value)
    })
  },
  radioChange: function (e) {
    let radioValue = e.detail.value;
    this.setData({
      pigStatus: radioValue
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.sowId && options.sowId != 0) {
      this.setData({
        sowId: options.sowId
      })
      this.getMatingDetail();
    }
  },
  onReady: function () {

  },
  //取消
  cancelAddress(){
    wx.navigateBack();
  },
  //保存
  saveAddress(){
    let data = this.data;
    if (this.isEmpty(data.sowId)) {
      util.showErrorToast('请选择妊检猪');
      return false;
    }
    if (this.isEmpty(data.pigStatus)) {
      util.showErrorToast('请选择是否受孕');
      return false;
    }
    this.setData({
      saveRepeat:true
    });
    util.request(api.UpdateExcellentPig, { 
      id: data.sowId,
      pigStatus:data.pigStatus
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.navigateBack();
      }
    });

  },
  onShow: function () {
    // 页面显示
    this.setData({
      saveRepeat: false
    });
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  TimeFormat(data) {
    if (data) {
        if (data.matingTime) {
          data.matingTime = data.matingTime.split("T")[0].replace(/\-/g, '.');
        } else {
          data.matingTime = "--";
        }
    }
  },
  isEmpty(data){
    if(data == '' || data == null){
      return true;
    }else{
      return false;
    }
  }
  
})