import * as echarts from '../../../ec-canvas/echarts';
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const app = getApp();
let chart = null;
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: 430
  });
  canvas.setChart(chart);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: '种猪猪龄！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },

  onReady() {
  },
  onLoad: function () {
    //加载过快导致echarts未创建完成出现空值错误
    setTimeout(this.getData, 500);
    //this.getData();
  },
  getData() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.DataPigAge).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        let boar = res.data.boar;
        let sow = res.data.sow;
        chart.setOption({
          backgroundColor: "#fff",
          color: ["#4cd0fd", "#31c4a1"],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            bottom: -10,
            itemWidth: 40,
            itemHeight: 10,
            itemGap: 60,
            textStyle: {
              color: '#999999'
            },
            data: ['种用公猪', '种用母猪']
          },
          grid: {
            containLabel: false,
            right: 20,
            top: 80
          },

          xAxis: {
            type: 'category',
            offset: 10,
            boundaryGap: true,
            data: ['0~1', '1~2', '2~3', '3~4', '4~5', '5~6', '>6年'],
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#003333'
              }
            },
            nameGap: 50,
            nameLocation: 'end'
          },
          yAxis: {
            x: 'center',
            type: 'value',
            offset: 5,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#003333'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#eee'
              }
            }
          },
          series: [{
            name: '种用公猪',
            type: 'line',
            smooth: true,
            data: [boar.count0to1, boar.count1to2, boar.count2to3, boar.count3to4, boar.count4to5, boar.count5to6, boar.countThan6],
            // data: [4,2,1,0,0,0],
            lineStyle: {
              normal: {
                width: 2,
                shadowColor: '#4cd0fd',
                shadowBlur: 2,
                shadowOffsetY: 1
              }
            },
            itemStyle: {
              borderWidth: 2,
            }
          }, {
            name: '种用母猪',
            type: 'line',
            smooth: true,
            data: [sow.count0to1, sow.count1to2, sow.count2to3, sow.count3to4, sow.count4to5, sow.count5to6, sow.countThan6],
            // data: [8,0,0,1,0,0],
            lineStyle: {
              normal: {
                width: 2,
                shadowColor: '#31c4a1',
                shadowBlur: 2,
                shadowOffsetY: 1
              }
            },
            itemStyle: {
              borderWidth: 2,
            }
          }]
        })
      }
      wx.hideLoading();
    });
  }
});
