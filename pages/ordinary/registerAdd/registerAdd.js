var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    register: {},
    sowId: undefined,
    columnCode:undefined,
    varietiesIndex: undefined,
    varietiesArr: [],
    varieties:undefined,
    piglets:[],
    pigGenderIndex: undefined,
    pigGenderArr: ['公', '母'],
    pigGenderText:undefined,
    saveRepeat:false
  },
  bindGenderChange: function (event) {
    let radioValue = event.detail.value;
    let index = event.target.dataset.index;
    let piglets = this.data.piglets;
    piglets[index].pigGender = radioValue;
    piglets[index].pigGenderText = this.data.pigGenderArr[radioValue];
    this.setData({
      piglets: piglets
    })
  },
  //页面查询猪信息
  getMatingDetail() {
    let that = this;
    util.request(api.ExcellentPigSowDetail, { id: that.data.sowId }).then(function (res) {
      if (res.errno === 0) {
        if(res.data){
          console.log(res.data);
            that.TimeFormat(res.data);
            let piglets = [];
            for (let i = 0; i < res.data.aliveNumber; i++){
              piglets[i] = { earNotch: undefined, earTag: undefined, pigGender:undefined};
            }
            that.setData({
              register: res.data,
              piglets: piglets
            });
        }
      }
    });
  },
  //品种
  bindPickerChange: function (e) {
    let varieties = this.data.varietiesArr[e.detail.value];
    this.setData({
      varietiesIndex: e.detail.value,
      varieties: varieties
    })
  },
  //获取字典值
  geDictionary() {
    let that = this;
    util.request(api.GetDictionary, { dictionaryId: 1 }).then(function (res) {
      if (res.errno === 0) {
        if (res.data) {
          let dictdataNames = res.data;
          let register_dic = [];
          for (var i = 0; i < dictdataNames.length; i++) {
            register_dic[i] = dictdataNames[i].dictdataName;
          }
          that.setData({
            varietiesArr: register_dic
          });
        }
      }
    });
  },
  //耳缺
  bindinputEarNotch(event) {
    let index = event.target.dataset.index;
    let piglets = this.data.piglets;
    piglets[index].earNotch = event.detail.value;
    this.setData({
      piglets: piglets
    });
  },
  //耳标
  earTagAdd(event) {
    let that = this;
    wx.scanCode({
      success: (res) => {
        let scanValue = res.result;
        util.request(api.QrCodeCheck, { url: scanValue, type: 'add' }, 'POST').then(function (res) {
          //校验url是否合法
          //校验二维码是否已绑定
          let register = that.data.register;
          if (res.errno === 0) {
            let index = event.target.dataset.index;
            let piglets = that.data.piglets;
            if (!that.isCheckEarTag(piglets, res.data)){
              util.showErrorToast("二维码重复");
              return false;
            }
            piglets[index].earTag = res.data;
            that.setData({
              piglets: piglets
            })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            register.earTag = undefined;
            that.setData({
              register: register
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
  //公母
  radioChange: function (event) {
    let radioValue = event.detail.value;
    let index = event.target.dataset.index;
    let piglets = this.data.piglets;
    piglets[index].pigGender = radioValue;
    this.setData({
      piglets: piglets
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.geDictionary();
    if (options.sowId && options.sowId != 0) {
      this.setData({
        sowId: options.sowId,
        columnCode: options.columnCode
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
    let that = this;
    let data = this.data;
    let register = this.data.register;
    var piglets = data.piglets;
    if (this.isEmpty(data.varieties)) {
      util.showErrorToast('请选择品种');
      return false;
    }
    for (let i = 0; i < piglets.length;i++){
      let pigletsJ = piglets;
      let pig = piglets[i];
      if (that.isEmpty(pig.earNotch) && that.isEmpty(pig.earTag)) {
        util.showErrorToast('缺少猪仔耳缺或耳标');
        return false;
      }
      for (var j in pigletsJ) {
        if (i != j){
          let pig2 = pigletsJ[j];
          if (pig.earNotch == pig2.earNotch) {
            util.showErrorToast('耳缺重复');
            return false;
          }
        }
      }
      if (that.isEmpty(pig.pigGender)){
        util.showErrorToast('缺少性别');
        return false;
      }
    }
   that.setData({
     saveRepeat:true
   });
    util.request(api.OrdinaryPigRegisterSave, { 
      piglets: piglets,//猪仔数组[{earNotch,eartag,pigGender}]
      brithId: register.id,//窝号
      columnCode: data.columnCode,//栏号
      pigMother:register.sowId,//母id
      pigFather:register.boarId,//父id
      birth:register.childbirthTime.replace('T00:00:00', '') + "T00:00:00",//出生日期
      varieties:data.varieties//品种
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
      if (data.childbirthTime) {
        data.childbirthTime = data.childbirthTime.split("T")[0];
        } else {
        data.childbirthTime = "--";
        }
    }
  },
  isEmpty(data){
    if(data == '' || data == undefined){
      return true;
    }else{
      return false;
    }
  },
  isCheckEarTag(data,earTag){
    if(data){
      for(let i in data){
        if (data[i].earTag == earTag){
          return false;
        }
      }
      return true;
    }
  }
  
})