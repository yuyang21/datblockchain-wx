var util = require('../../../utils/util.js');
var QR = require("../../../utils/wxqrcode.js");
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    register: {},
    pigId:undefined,
    columnCode:undefined,
    pigType:undefined,
    isOrdinary:false,
    slaughterNumber: 0,
    disabled1: false,
    disabled2: false,
    earNotch:undefined,
    earTag:undefined,
    flag: true,
    imgData:undefined,
    saveRepeat:false
  },
  prevNum1() {
    this.setData({
      slaughterNumber: this.data.slaughterNumber >= 50 ? 50 : this.data.slaughterNumber + 1,
      disabled1: this.data.slaughterNumber !== 0 ? false : true,
      disabled2: this.data.slaughterNumber !== 50 ? false : true
    });
  },
  nextNum1() {
    this.setData({
      slaughterNumber: this.data.slaughterNumber <= 0 ? 0 : this.data.slaughterNumber - 1,
      disabled1: this.data.slaughterNumber !== 0 ? false : true,
      disabled2: this.data.slaughterNumber !== 50 ? false : true
    });
  },
  bindSlaughterNumberChange(event) {
    this.setData({
      slaughterNumber: event.detail.value
    })
  },
  bindSlaughterNumberChanging(event) {
    this.setData({
      slaughterNumber: event.detail.value
    })
  },
  //耳缺
  bindinputEarNotch(event) {
    this.setData({
      earNotch: event.detail.value
    });
  },
  //耳标
  earTagAdd(event) {
    let that = this;
    wx.scanCode({
      success: (res) => {
        let scanValue = res.result;
        util.request(api.QrCodeCheck, { url: scanValue, type: 'check' }, 'POST').then(function (res) {
          //校验url是否合法
          //校验二维码是否已绑定
          let register = that.data.register;
          if (res.errno === 0) {
            that.setData({
              earTag: res.data
            })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            that.setData({
              earTag: undefined
            })
            util.showErrorToast(res.errmsg);
          }
        });
      },
      fail: (res) => {
        util.showErrorToast("失败");
      },
      complete: (res) => {
      }
    })
  },
  //页面查询猪信息
  getMatingDetail() {
    let that = this;
    util.request(api.DetailExcellentPig, { id: that.data.pigId }).then(function (res) {
      if (res.errno === 0) {
        if(res.data){
            that.TimeFormat(res.data);
            that.setData({
              register: res.data
            });
        }
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.pigId && options.pigId != 0) {
      this.setData({
        pigId: options.pigId,
        isOrdinary: options.isOrdinary
      })
      this.getMatingDetail();
    }
  },
  onReady: function () {

  },
  bindIsColumnCode(event) {
    this.setData({
      columnCode: event.detail.value
    });
  },
  bindinputNum(e){
    this.setData({
      slaughterNumber: e.detail.value
    });
  },
  //取消
  cancelAddress(){
    wx.navigateBack();
  },
  //保存
  saveAddress(){
    let that = this;
    let data = this.data;
    let register = this.data.register;
    if (this.isEmpty(data.pigId) && this.isEmpty(data.earNotch) && this.isEmpty(data.earTag)) {
      util.showErrorToast('请选择待宰猪');
      return false;
    }
    if (this.isEmpty(data.slaughterNumber)) {
      util.showErrorToast('请输入分割数量');
      return false;
    }
    that.setData({
      saveRepeat:true
    });
    util.request(api.SlaughterSave, { 
      pig:{ pigId: data.pigId,
        blockNumber: data.slaughterNumber},
      version: register.version,
      pigId: data.pigId,
      earNotch:data.earNotch,
      earTag:data.earTag
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          imgData: QR.createQrCodeImg(res.data, { size: 300 })
        })
        that.show();
        //wx.navigateBack();
      }else if(res.errno === 402) {
        util.showErrorToast('参数错误');
      }else{
        util.showErrorToast('在你发呆这段时间已被人改过啦');
      }
    });

  },
  //出现
  show: function () {

    this.setData({ 
      flag: false,
      saveRepeat:false
    })

  },
  //消失

  hide: function () {

    this.setData({ flag: true })
    wx.navigateBack();
  },
  switch2Change: function (e) {
    if (e.detail.value){
      this.setData({
        pigType:0
      })
    }else{
      this.setData({
        pigType: 1
      })
    }
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  isEmpty(data){
    if(data == '' || data == undefined){
      return true;
    }else{
      return false;
    }
  },
  TimeFormat(data) {
    if (data) {
      if (data.birth) {
        data.birth = data.birth.split("T")[0].replace(/\-/g, '.');
      } else {
        data.birth = "--";
      }
    }
  },
  
})