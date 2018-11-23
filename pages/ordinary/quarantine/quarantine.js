var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    register: {},
    quarantineCode: undefined,
    quarantineList:[],
    piglets: [{ pigId: undefined ,earTag:undefined}],
    saveRepeat:false
  },
  //手动输入检疫证明编号
  quarantineManual(event) {
    this.setData({
      quarantineCode: event.detail.value
    });
  },
  //耳标
  earTagAdd(event) {
    let that = this;
    wx.scanCode({
      success: (res) => {
        let scanValue = res.result;
        util.request(api.QrCodeDecrypt, { url: scanValue }, 'POST').then(function (res) {
          //校验url是否合法
          //校验二维码是否已绑定
          let register = that.data.register;
          if (res.errno === 0) {
            let index = event.target.dataset.index;
            let piglets = that.data.piglets;
            piglets[index].pigId = res.data.pigId;
            piglets[index].earTag = res.data.earTag;
            if (piglets.length - 1 == index) {
              piglets.push({ pigId: undefined, earTag:undefined});
            }
            that.setData({
              piglets: piglets
            })
            console.log(piglets);
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
  quarantineScan(event) {
    let that = this;
    wx.scanCode({
      success: (res) => {
        // let scanValue = res.result;
        // that.setData({
        //   quarantine: scanValue
        // })
        // wx.showToast({
        //   title: '成功',
        //   icon: 'success',
        //   duration: 2000
        // })

        let scanValue = res.result;
        util.request(api.CheckQuarantine, { id: scanValue }).then(function (res) {
          //校验检疫合格证是否合法
          if (res.errno === 0) {
            let quarantineList = res.data.quarantine;
            that.setData({
              quarantineList: quarantineList,
              quarantineCode: scanValue
            })
            console.log(quarantineList);
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            let quarantineList = [];
            that.setData({
              quarantineList: quarantineList
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
  onLoad: function (options) {

  },
  onReady: function () {

  },
  bindIsColumnCode(event) {
    this.setData({
      columnCode: event.detail.value
    });
  },
  //取消
  cancelAddress() {
    wx.navigateBack();
  },
  //保存
  saveAddress() {
    let that = this;
    let data = this.data;
    var piglets = data.piglets;
    if (this.isEmpty(data.quarantineCode)) {
      util.showErrorToast('请输入或扫描检疫证明二维码');
      return false;
    }
    if (this.isEmpty(data.quarantineList)) {
      util.showErrorToast('检疫证明二维码不正确');
      return false;
    }
    let pigletsListDto = [];
    for (let i in data.piglets){
      pigletsListDto.push(data.piglets[i].pigId);
    }
    let tag = false;
    for (let i = 0; i < piglets.length; i++) {
      let pig = piglets[i];
      if (!that.isEmpty(pig.earTag)) {
        tag = true;
      }
    }
    if (!tag) {
      util.showErrorToast('缺少耳标');
      return false;
    }
    that.setData({
      saveRepeat:true
    });
    var json = JSON.stringify(data.quarantineList);
    util.request(api.QuarantineSave, {
      quarantineCode: data.quarantineCode,
      pigIds: pigletsListDto,
      quarantine: json
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.navigateBack();
      }
    });

  },
  switch2Change: function (e) {
    if (e.detail.value) {
      this.setData({
        pigType: 0
      })
    } else {
      this.setData({
        pigType: 1
      })
    }
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
  isEmpty(data) {
    if (data == '' || data == undefined) {
      return true;
    } else {
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