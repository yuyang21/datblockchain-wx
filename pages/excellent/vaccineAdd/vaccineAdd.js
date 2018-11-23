var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    register: {
      id:0,
      columnCodes: null,
      earNotchs:null,
      earTags: null,
      vaccineCode:null,
      vaccine:null,
      selectType:4,
      vaccineTime: util.formatTimeDate(new Date())  
    },
    addressId: 0,
    varietiesIndex: undefined,
    varietiesArr: [],
    selectTypeIndex: undefined,
    selectTypeArr: ['耳标', '耳缺', '栏号', '全部'],
    selectTypeText: '耳标',
    pigType: 0,
    checkfunRepeat:false
  },
  //选择疫苗记录
  bindSelectTypeChange: function (e) {
    let register = this.data.register;
    register.selectType = this.data.selectTypeArr.length - e.detail.value;
    this.setData({
      selectTypeIndex: e.detail.value,
      register: register,
      selectTypeText: this.data.selectTypeArr[e.detail.value]
    })
  },
  //选择疫苗
  bindPickerChange: function (e) {
    let register = this.data.register;
    register.vaccine = this.data.varietiesArr[e.detail.value];
    this.setData({
      varietiesIndex: e.detail.value,
      register: register
    })
  },
  //输入栏号
  bindinputColumnCode(event) {
    let register = this.data.register;
    register.columnCodes = event.detail.value;
    this.setData({
      register: register
    });
  },
  //输入耳缺
  bindinputEarNotch(event){
    let register = this.data.register;
    register.earNotchs = event.detail.value;
    this.setData({
      register: register
    });
  },
  //输入疫苗编号
  bindinputSource (event){
    let register = this.data.register;
    register.vaccineCode = event.detail.value;
    this.setData({
      register: register
    });
  },
  //输入免疫人员
  bindinputPeo(event) {
    let register = this.data.register;
    register.vaccinePeo = event.detail.value;
    this.setData({
      register: register
    });
  },
  //接种日期  
  bindDateChange: function (e) {
    let register = this.data.register;
    register.vaccineTime = e.detail.value;
    this.setData({
      register: register
    })
  },
  //获取猪的信息
  getAddressDetail() {
    let that = this;
    util.request(api.DetailExcellentPig, { id: that.data.addressId }).then(function (res) {
      if (res.errno === 0) {
        if(res.data){
          console.log(res.data);
            that.setData({
              register: res.data
            });
        }
      }
    });
  },
  //获取疫苗字典值
  geDictionary() {
    let that = this;
    util.request(api.GetDictionary, { dictionaryId: 2 }).then(function (res) {
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
    this.setData({
      pigType: options.pigType ? options.pigType : 0
    });
    if (options.id && options.id != 0) {
      this.setData({
        addressId: options.id,
        pigType: options.pigType ? options.pigType:0
      });
      this.getAddressDetail();
    }
  },
  //取消
  cancelAddress(){
    wx.navigateBack();
  },
  //扫一扫
  earTabAdd(){
    let that = this;
    wx.scanCode({
      success: (res) => {
        let scanValue = res.result;
        util.request(api.QrCodeCheck, { url: scanValue,type:'check'}, 'POST').then(function (res) {
          //校验url是否合法
          //校验二维码是否已绑定
          let register = that.data.register;
          if (res.errno === 0) {
            register.earTags = register.earTags ? register.earTags + (" " + res.data) : res.data;
            that.setData({
              register: register
            })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: res.errmsg,
              icon: 'loading',
              duration: 2000
            })
          }
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'loading',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  //保存
  saveAddress(){
    let that = this.data;
    let register = that.register;
    if (register.selectType == 2 && this.isEmpty(register.columnCodes)) {
      util.showErrorToast('请输入栏号');
      return false;
    }
    if (register.selectType == 3 && this.isEmpty(register.earNotchs)) {
      util.showErrorToast('请输入耳缺');
      return false;
    }
    if (register.selectType == 4 && this.isEmpty(register.earTags)) {
      util.showErrorToast('请输入耳标');
      return false;
    }
    if (this.isEmpty(register.vaccine)) {
      util.showErrorToast('请选择疫苗');
      return false;
    }

    if (this.isEmpty(register.vaccineTime)) {
      util.showErrorToast('请选择时间');
      return false;
    }
    this.setData({
      checkfunRepeat: true
    });
    util.request(api.ExcellentVaccineAdd, { 
      id: register.id,
      columnCodes: register.columnCodes,
      earNotchs: register.earNotchs,
      earTags: register.earTags,
      vaccineCode: register.vaccineCode,
      vaccine: register.vaccine,
      selectType: register.selectType,
      vaccinePeo:register.vaccinePeo,
      pigType:that.pigType,
      vaccineTime: register.vaccineTime.replace('T00:00:00', '') +"T00:00:00"
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.navigateBack();
      }
    });
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