var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    register: {
      id:0,
      columnCode: '',
      earNotch:undefined,
      // weight:undefined,
      source:undefined,
      varieties:undefined,
      pigGender:1,
      birth:undefined,
      earTag:undefined
    },
    addressId: 0,
    openSelectRegion: false,
    selectRegionList: [
      { id: 0, name: '省份', pid: 1, type: 1 },
      { id: 0, name: '城市', pid: 1, type: 2 },
      { id: 0, name: '区县', pid: 1, type: 3 }
    ],
    regionType: 1,
    regionList: [],
    selectRegionDone: false,
    varietiesIndex: undefined,
    varietiesArr: [] 
  },
  bindPickerChange: function (e) {
    let register = this.data.register;
    register.varieties = this.data.varietiesArr[e.detail.value];
    this.setData({
      varietiesIndex: e.detail.value,
      register: register
    })
  },
  bindinputMobile(event) {
    let register = this.data.register;
    register.mobile = event.detail.value;
    this.setData({
      register: register
    });
  },
  bindinputColumnCode(event) {
    let register = this.data.register;
    register.columnCode = event.detail.value;
    this.setData({
      register: register
    });
  },
  bindinputEarNotch(event){
    let register = this.data.register;
    register.earNotch = event.detail.value;
    this.setData({
      register: register
    });
  },
  bindinputSource (event){
    let register = this.data.register;
    register.source = event.detail.value;
    this.setData({
      register: register
    });
  },
  bindinputWeight(event) {
    let register = this.data.register;
    register.weight = event.detail.value;
    this.setData({
      register: register
    });
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    let register = this.data.register;
    register.birth = e.detail.value;
    this.setData({
      register: register
    })
  },
  radioChange: function (e) {
    let register = this.data.register;
    register.pigGender = e.detail.value;
    this.setData({
      register: register
    })
  },
  bindIsDefault(){
    let register = this.data.register;
    register.isDefault = !register.isDefault;
    this.setData({
      register: register
    });
  },
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
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return item.id != 0;
    });

    that.setData({
      selectRegionDone: doneStatus
    })

  },
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });

    //设置区域选择数据
    let register = this.data.register;
    if (register.provinceId > 0 && register.cityId > 0 && register.areaId > 0) {
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].id = register.provinceId;
      selectRegionList[0].name = register.provinceName;
      selectRegionList[0].pid = 0;

      selectRegionList[1].id = register.cityId;
      selectRegionList[1].name = register.cityName;
      selectRegionList[1].pid = register.provinceId;

      selectRegionList[2].id = register.areaId;
      selectRegionList[2].name = register.areaName;
      selectRegionList[2].pid = register.cityId;

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      });

      this.getRegionList(register.cityId);
    } else {
      this.setData({
        selectRegionList: [
          { id: 0, name: '省份', pid: 0, type: 1 },
          { id: 0, name: '城市', pid: 0, type: 2 },
          { id: 0, name: '区县', pid: 0, type: 3 }
        ],
        regionType: 1
      })
      this.getRegionList(0);
    }

    this.setRegionDoneStatus();

  },
  onLoad: function (options) {
    //加载字典值
    // 页面初始化 options为页面跳转所带来的参数
    this.geDictionary();
    console.log(options)
    if (options.id && options.id != 0) {
      this.setData({
        addressId: options.id
      });
      this.getAddressDetail();
    }
  },
  onReady: function () {

  },
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex-1].id <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    })
    
    let selectRegionItem = selectRegionList[regionTypeIndex];

    this.getRegionList(selectRegionItem.pid);

    this.setRegionDoneStatus();

  },
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.type;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;


    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      })
      this.getRegionList(regionItem.id);
    } else {
      this.setData({
        selectRegionList: selectRegionList
      })
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.id = 0;
        item.name = index == 1 ? '城市' : '区县';
        item.pid = 0;
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList
    })


    that.setData({
      regionList: that.data.regionList.map(item => {

        //标记已选择的
        if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].id == item.id) {
          item.selected = true;
        } else {
          item.selected = false;
        }

        return item;
      })
    });

    this.setRegionDoneStatus();

  },
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let register = this.data.register;
    let selectRegionList = this.data.selectRegionList;
    register.provinceId = selectRegionList[0].id;
    register.cityId = selectRegionList[1].id;
    register.areaId = selectRegionList[2].id;
    register.provinceName = selectRegionList[0].name;
    register.cityName = selectRegionList[1].name;
    register.areaName = selectRegionList[2].name;

    this.setData({
      register: register,
      openSelectRegion: false
    });

  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },
  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.RegionList, { pid: regionId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          regionList: res.data.map(item => {

            //标记已选择的
            if (regionType == item.type && that.data.selectRegionList[regionType - 1].id == item.id) {
              item.selected = true;
            } else {
              item.selected = false;
            }

            return item;
          })
        });
      }
    });
  },
  cancelAddress(){
    wx.navigateBack();
  },
  //耳缺扫一扫
  earTabAdd(){
    //"结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
    let that = this;
    wx.scanCode({
      success: (res) => {
        //方案一:
        // let register = this.data.register;
        // register.earTag = res.result;
        // that.setData({
        //   register: register
        // })
        //方案二:
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
  saveAddress(){
    console.log(this.data.register)
    let register = this.data.register;
    if (register.columnCode == '') {
      util.showErrorToast('请输入栏号');

      return false;
    }
    if (register.earNotch == '') {
      util.showErrorToast('请输入耳缺');

      return false;
    }
    
    if (register.source == '') {
      util.showErrorToast('请输入来源');
      return false;
    }


    if (register.varieties == 0) {
      util.showErrorToast('请选择品种');
      return false;
    }

    if (register.birth == '') {
      util.showErrorToast('请选择时间');
      return false;
    }

    let that = this;
    util.request(api.SaveExcellentPig, { 
      id: register.id,
      columnCode: register.columnCode,
      earNotch: register.earNotch,
      source: register.source,
      varieties: register.varieties,
      pigGender: register.pigGender,
      birth: register.birth.replace('T00:00:00', '') +"T00:00:00"
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.navigateBack();
      }
    });

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
  
})