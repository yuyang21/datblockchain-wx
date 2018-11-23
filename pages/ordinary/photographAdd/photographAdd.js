var app = getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({
  data: {
    earNotch: undefined,
    earTag: undefined,
    hasPicture: false,
    picUrls: [],
    files: []
  },
  chooseImage: function (e) {
    console.log("上传图片");
    if (this.data.files.length >= 5) {
      util.showErrorToast('只能上传五张图片')
      return false;
    }

    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        that.upload(res);
      }
    })
  },
  upload: function (res) {
    var that = this;
    const uploadTask = wx.uploadFile({
      url: api.StorageUpload,
      filePath: res.tempFilePaths[0],
      name: 'file',
      success: function (res) {
        var _res = JSON.parse(res.data);
        if (_res.errno === 0) {
          var url = _res.data.url
          that.data.picUrls.push(url)
          that.setData({
            hasPicture: true,
            picUrls: that.data.picUrls
          })
        }
      },
      fail: function (e) {
        wx.showModal({
          title: '错误',
          content: '上传失败',
          showCancel: false
        })
      },
    })

    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })

  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //耳缺
  bindinputEarNotch(event) {
    this.setData({
      earNotch: event.detail.value
    });
  },
  bindinputEarTag(event) {
    this.setData({
      earTag: event.detail.value
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
  onLoad: function (options) {

  },
  onClose: function () {
    wx.navigateBack();
  },
  onPost: function () {
    let that = this;
    let data = this.data;
    let register = this.data.register;
    if (this.isEmpty(data.pigId) && this.isEmpty(data.earNotch) && this.isEmpty(data.earTag)) {
      util.showErrorToast('请选猪');
      return false;
    }
    console.log(that.data.hasPicture);
    console.log(that.data.picUrls);
    util.request(api.PhotoSave, {
      earNotch: data.earNotch,
      earTag: data.earTag,
      hasPicture: that.data.hasPicture,
      picUrls: that.data.picUrls
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.showToast({
          title: '上传成功',
          complete: function () {
            wx.navigateBack();
          }
        })
      }
    });
  },
  onReady: function () {

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
  isEmpty(data) {
    if (data == '' || data == undefined) {
      return true;
    } else {
      return false;
    }
  }
})