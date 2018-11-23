var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    register: {},
    childbirthState: 0,
    childbirthTime: undefined,
    sowId: undefined,
    pigletNumber: 0,
    aliveNumber: 0,
    mummyNumber: 0,
    drowningNumber: 0,
    stillbirthNumber: 0,
    disabled1: false,
    disabled2: false,
    disabled3: false,
    disabled4: false,
    disabled5: false,
    disabled6: false,
    disabled7: false,
    disabled8: false,
    disabled9: false,
    disabled10: false,
    childbirthStateText: '正常',
    childbirthStateArr: ['正常', '流产'],
    childbirthStateIndex: 0,
    saveRepeat:false
  },
  bindChildbirthStateChange: function (e) {
    this.setData({
      childbirthStateIndex: e.detail.value,
      childbirthStateText: this.data.childbirthStateArr[e.detail.value],
      childbirthState: e.detail.value
    })
    // console.log(this.data.childbirthState)
  },
  //输入仔数
  bindinputPigletNumber(event) {
    let value = event.detail.value.replace(/\D/g, '');
    value = Number(value) > 50 ? 50 : value
    this.setData({
      pigletNumber: value
    });
  },
  //输入活仔数
  bindinputAliveNumber(event) {
    let value = event.detail.value.replace(/\D/g, '');
    value = Number(value) > 50 ? 50 : value
    this.setData({
      aliveNumber: value
    });
  },
  //输入木乃伊
  bindinputMummyNumber(event) {
    let value = event.detail.value.replace(/\D/g, '');
    value = Number(value) > 50 ? 50 : value
    this.setData({
      mummyNumber: value
    });
  },
  //输入溺仔
  bindinputDrowningNumber(event) {
    let value = event.detail.value.replace(/\D/g, '');
    value = Number(value) > 50 ? 50 : value
    this.setData({
      drowningNumber: value
    });
  },
  //输入死胎
  bindinputStillbirthNumber(event) {
    let value = event.detail.value.replace(/\D/g, '');
    value = Number(value) > 50 ? 50 : value
    this.setData({
      stillbirthNumber: value
    });
  },
  prevNum1() {
    this.setData({
      pigletNumber: this.data.pigletNumber >= 50 ? 50 : this.data.pigletNumber + 1,
      disabled1: this.data.pigletNumber !== 0 ? false : true,
      disabled2: this.data.pigletNumber !== 50 ? false : true
    });
  },
  nextNum1() {
    this.setData({
      pigletNumber: this.data.pigletNumber <= 0 ? 0 : this.data.pigletNumber - 1,
      disabled1: this.data.pigletNumber !== 0 ? false : true,
      disabled2: this.data.pigletNumber !== 50 ? false : true
    });
  },
  prevNum2() {
    this.setData({
      aliveNumber: this.data.aliveNumber >= 50 ? 50 : this.data.aliveNumber + 1,
      disabled3: this.data.aliveNumber !== 0 ? false : true,
      disabled4: this.data.aliveNumber !== 50 ? false : true
    });
  },
  nextNum2() {
    this.setData({
      aliveNumber: this.data.aliveNumber <= 0 ? 0 : this.data.aliveNumber - 1,
      disabled3: this.data.aliveNumber !== 0 ? false : true,
      disabled4: this.data.aliveNumber !== 50 ? false : true
    });
  },
  prevNum3() {
    this.setData({
      mummyNumber: this.data.mummyNumber >= 50 ? 50 : this.data.mummyNumber + 1,
      disabled5: this.data.mummyNumber !== 0 ? false : true,
      disabled6: this.data.mummyNumber !== 50 ? false : true
    });
  },
  nextNum3() {
    this.setData({
      mummyNumber: this.data.mummyNumber <= 0 ? 0 : this.data.mummyNumber - 1,
      disabled5: this.data.mummyNumber !== 0 ? false : true,
      disabled6: this.data.mummyNumber !== 50 ? false : true
    });
  },
  prevNum4() {
    this.setData({
      drowningNumber: this.data.drowningNumber >= 50 ? 50 : this.data.drowningNumber + 1,
      disabled7: this.data.drowningNumber !== 0 ? false : true,
      disabled8: this.data.drowningNumber !== 50 ? false : true
    });
  },
  nextNum4() {
    this.setData({
      drowningNumber: this.data.drowningNumber <= 0 ? 0 : this.data.drowningNumber - 1,
      disabled7: this.data.drowningNumber !== 0 ? false : true,
      disabled8: this.data.drowningNumber !== 50 ? false : true
    });
  },
  prevNum5() {
    this.setData({
      stillbirthNumber: this.data.stillbirthNumber >= 50 ? 50 : this.data.stillbirthNumber + 1,
      disabled9: this.data.stillbirthNumber !== 0 ? false : true,
      disabled10: this.data.stillbirthNumber !== 50 ? false : true
    });
  },
  nextNum5() {
    this.setData({
      stillbirthNumber: this.data.stillbirthNumber <= 0 ? 0 : this.data.stillbirthNumber - 1,
      disabled9: this.data.stillbirthNumber !== 0 ? false : true,
      disabled10: this.data.stillbirthNumber !== 50 ? false : true
    });
  },
  //页面查询猪信息
  getMatingDetail() {
    let that = this;
    util.request(api.SowDetail, { id: that.data.sowId }).then(function (res) {
      if (res.errno === 0) {
        if (res.data) {
          console.log(res.data);
          that.TimeFormat(res.data);
          that.setData({
            register: res.data
          });
        }
      }
    });
  },
  //是否流产
  radioChange: function (e) {
    let radioValue = e.detail.value;
    this.setData({
      childbirthState: radioValue
    })
  },
  //分娩日期
  bindDateChange: function (e) {
    this.setData({
      childbirthTime: e.detail.value
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
  cancelAddress() {
    wx.navigateBack();
  },
  //保存
  saveAddress() {
    let data = this.data;
    let register = this.data.register;
    if (data.childbirthState === 0) {
      if (this.isEmpty(data.pigletNumber)) {
        util.showErrorToast('请输入仔数');
        return false;
      }
      if (data.pigletNumber != parseInt(data.aliveNumber) + parseInt(data.mummyNumber) + parseInt(data.drowningNumber) + parseInt(data.stillbirthNumber)) {
        util.showErrorToast('猪仔总数与详细数不符');
        return false;
      }
    }
    if (this.isEmpty(data.childbirthTime)) {
      util.showErrorToast('请选择分娩日期');
      return false;
    }
    this.setData({
      saveRepeat:true
    });
    util.request(api.ExcellentPigChildbirthSave, {
      childbirthState: data.childbirthState,
      childbirthTime: data.childbirthTime.replace('T00:00:00', '') + "T00:00:00",
      pigletNumber: data.pigletNumber,
      aliveNumber: data.aliveNumber,
      mummyNumber: data.mummyNumber,
      drowningNumber: data.drowningNumber,
      stillbirthNumber: data.stillbirthNumber,
      matingRecordId: register.id,
      sowId: register.sowId,
      sowEarNotch: register.sowEarNotch,
      sowEarTag: register.sowEarTag,
      boarId: register.boarId,
      boarEarNotch: register.boarEarNotch,
      boarEarTag: register.boarEarTag,
      matingTime: register.matingTime.replace('T00:00:00', '') + "T00:00:00"
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.navigateBack();
      }
    });

  },
  onShow: function () {
    // 页面显示
    this.setData({
      saveRepeat:false
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
      if (data.preproductionTime) {
        data.preproductionTime = data.preproductionTime.split("T")[0].replace(/\-/g, '.');
      } else {
        data.preproductionTime = "--";
      }
    }
  },
  isEmpty(data) {
    if (data == '' || data == undefined) {
      return true;
    } else {
      return false;
    }
  }

})