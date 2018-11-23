import * as echarts from '../../../ec-canvas/echarts';
var app = getApp();

Page({
  data: {
    charts: [{
      id: 'bar',
      name: '栏舍存栏',
      src: '/static/images/echarts/icons/hurdles.png'
    }, {
        id: 'line',
      name: '种猪猪龄',
      src: '/static/images/echarts/icons/pig-age.png'
    }, {
      id: 'pie',
      name: '分娩报表',
      src: '/static/images/echarts/icons/delivery-report.png'
    },
    {
      id: 'parity',
      name: '母猪胎龄',
      src: '/static/images/echarts/icons/sow-fetal-age.png'
    }  
    // {
    //   id: 'tree',
    //   name: '树图'
    // },
    ]
  },
  onLoad: function (options) {
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  open: function (e) {
    wx.navigateTo({
      url: '../' + e.target.dataset.chart.id + '/index'
    });
  }
})