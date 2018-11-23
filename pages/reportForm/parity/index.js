import * as echarts from '../../../ec-canvas/echarts';
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: 370
  });
  canvas.setChart(chart);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: '母猪胎龄！',
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
    util.request(api.DataBirthNumber).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        let data = res.data;
        chart.setOption({
          title: {
          },
          textStyle: {
            color: '#003333'
          },
          grid: {
            left: 20,
            right: 20,
            bottom: 5,
            top: 70,
            containLabel: false
          },
          yAxis: {
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: 'transparent'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#eee'
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: ['1胎', '2胎', '3胎', '4胎', '5胎', '6胎', '7胎', '>8胎'],
              axisLine: {
                show: false,
                lineStyle: {
                  color: 'transparent'
                }
              },
              axisLabel: {
                color: '#003333'
              }
            }
          ],
          series: [
            { // For shadow
              type: 'bar',
              itemStyle: {
                barBorderRadius: [15, 15, 0, 0],
                color: '#e3faf5' ,

              },
              barGap: '-100%',
              barCategoryGap: '50%',
              data: [50,50,50,50,50,50,50,50],
              animation: false
            },
            {
              name: '肉猪',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: false
                }
              },
              data: [data.bn1, data.bn2, data.bn3, data.bn4, data.bn5, data.bn6, data.bn7, data.bn8],
              itemStyle: {
                barBorderRadius: [15, 15, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#74e7cc' },
                    { offset: 1, color: '#3bc3a1' }
                  ]
                )
              },
              markPoint: {
                data: [
                  { name: '1胎', value: data.bn1 + '头', xAxis: 0, yAxis: data.bn1 },
                  { name: '2胎', value: data.bn2 + '头', xAxis: 1, yAxis: data.bn2 },
                  { name: '3胎', value: data.bn3 + '头', xAxis: 2, yAxis: data.bn3 },
                  { name: '4胎', value: data.bn4 + '头', xAxis: 3, yAxis: data.bn4 },
                  { name: '5胎', value: data.bn5 + '头', xAxis: 4, yAxis: data.bn5 },
                  { name: '6胎', value: data.bn6 + '头', xAxis: 5, yAxis: data.bn6 },
                  { name: '7胎', value: data.bn7 + '头', xAxis: 6, yAxis: data.bn7 },
                  { name: '8胎', value: data.bn8 + '头', xAxis: 7, yAxis: data.bn8 },
                ],
                itemStyle: {
                  color: '#fff',
                  // shadowColor: 'rgba(106, 191, 94, 0.31',
                  // shadowBlur: 1,
                  // shadowOffsetX: 1,
                  // shadowOffsetY: 1
                },
              },
            }
          ]
        })
      }
      wx.hideLoading();
      })
  }
});
