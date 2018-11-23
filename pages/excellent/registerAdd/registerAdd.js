var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    register: {
      id:0,
      columnCode: '',
      earNotch:'',
      source:'',
      varieties:null,
      pigGender:null,
      birth:null,
      earTag:null
    },
    addressId: 0,
    varietiesIndex: null,
    varietiesArr: [],
    pigGenderArr: ['公', '母'],
    checkfunRepeat:false
  },
  //公母选择
  bindGenderChange: function (e) {
    let register = this.data.register;
    register.pigGender = Number(e.detail.value);
    this.setData({
      register: register
    })
  },
  //选择品种
  bindPickerChange: function (e) {
    let register = this.data.register;
    register.varieties = this.data.varietiesArr[e.detail.value];
    this.setData({
      varietiesIndex: e.detail.value,
      register: register
    })
  },
  //栏号输入
  bindinputColumnCode(event) {
    let register = this.data.register;
    register.columnCode = event.detail.value;
    this.setData({
      register: register
    });
  },
  //耳缺输入
  bindinputEarNotch(event){
    let register = this.data.register;
    register.earNotch = event.detail.value;
    this.setData({
      register: register
    });
  },
  //说明输入
  bindinputSource (event){
    let register = this.data.register;
    register.source = event.detail.value;
    this.setData({
      register: register
    });
  },
  //出生日期
  bindDateChange: function (e) {
    let register = this.data.register;
    register.birth = e.detail.value;
    this.setData({
      register: register
    })
  },
 //查询猪信息
  getAddressDetail() {
    let that = this;
    util.request(api.DetailExcellentPig, { id: that.data.addressId }).then(function (res) {
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
  //品种字典
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
  onLoad: function (options) {
    this.geDictionary();
    if (options.id && options.id != 0) {
      this.setData({
        addressId: options.id
      });
      this.getAddressDetail();
    }
  },
  //取消
  cancelAddress(){
    wx.navigateBack();
  },
  //耳标扫一扫
  earTabAdd(){
    let that = this;
    wx.scanCode({
      success: (res) => {
        let scanValue = res.result;
        util.request(api.QrCodeCheck, { url: scanValue,type:'add'}, 'POST').then(function (res) {
          //校验url是否合法
          //校验二维码是否已绑定
          let register = that.data.register;
          if (res.errno === 0) {
            register.earTag = res.data;
            that.setData({
              register: register
            })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          }else{
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
  //保存
  saveAddress(){
    let register = this.data.register;
    if (register.pigGender == null) {
      util.showErrorToast('请选公母');
      return false;
    }
    if (this.isEmpty(register.columnCode)) {
      util.showErrorToast('请输入栏号');
      return false;
    }
    if (this.isEmpty(register.earNotch)) {
      util.showErrorToast('请输入耳缺');
      return false;
    }
    if (this.isEmpty(register.varieties)) {
      util.showErrorToast('请选择品种');
      return false;
    }

    if (this.isEmpty(register.birth)) {
      util.showErrorToast('请选择时间');
      return false;
    }
    this.setData({
      checkfunRepeat: true
    });
    let that = this;
    util.request(api.SaveExcellentPig, { 
      id: register.id,
      columnCode: register.columnCode,
      earNotch: register.earNotch,
      earTag: register.earTag,
      source: register.source,
      varieties: register.varieties,
      pigGender: register.pigGender,
      birth: register.birth.replace('T00:00:00', '') +"T00:00:00",
      version:register.version,
      pigType:0,
      pigStatus: register.pigStatus
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.navigateBack();
      }
    });
  },
  TimeFormat(data) {
    if (data) {
      if (data.birth) {
        data.birth = data.birth.split("T")[0];
      } else {
        data.birth = "--";
      }
    }
  },
  onShow: function () {
    this.setData({
      checkfunRepeat: false
    });
  },
  isEmpty(data) {
    if (data == '' || data == null) {
      return true;
    } else {
      return false;
    }
  }
})