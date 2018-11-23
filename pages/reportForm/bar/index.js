import * as echarts from '../../../ec-canvas/echarts';
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var barGraph = null;
var pieChart = null;


let chart = null;
var dataShadow = [];
var data = [20, 30, 50, 20, 30];
var yMax = 50;
for (var i = 0; i < data.length; i++) {
  dataShadow.push(yMax);
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: '栏舍存栏！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ecBar: {
      onInit: function (canvas, width, height) {
        barGraph = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barGraph);
        return barGraph;
      }
    },
    ecPie: {
      onInit: function (canvas, width, height) {
        pieChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(pieChart);
        return pieChart;
      }
    }
  },
  onReady() {
  },
  onLoad: function () {
    //加载过快导致echarts未创建完成出现空值错误
    setTimeout(this.getData,500);
    //this.getData();
  },
  getData() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.DataClassification).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        barGraph.setOption({
          backgroundColor: "#ffffff",
          color: ['#37a2da', '#32c5e9', '#67e0e3'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: 20,
            right: 20,
            bottom: 15,
            top: 40,
            containLabel: true
          },
          xAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#999'
                }
              },
              axisLabel: {
                color: '#666'
              },
              show: false
            }
          ],
          yAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: ['种用母猪', '种用公猪', '哺乳猪仔', '保育猪', '育肥猪'],
              axisLine: {
                lineStyle: {
                  color: '#fff'
                },
                inside: true
              },
              axisLabel: {
                color: '#999',
                inside: false
              }
            }
          ],
          series: [
            { // For shadow
              type: 'bar',
              itemStyle: {
                color: 'rgb(227,250,245)',
                barBorderRadius: [0, 15, 15, 0]
              },
              barGap: '-100%',
              barCategoryGap: '40%',
              data: dataShadow,
              animation: false,
            },
            {
              name: '肉猪',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  color: '#666666'
                }
              },
              data: [res.data.sowCount, res.data.boarCount, res.data.nurtureCount, res.data.conservation, res.data.fatten],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  1, 0, 0, 0,
                  [
                    { offset: 0, color: '#74e7cc' },
                    { offset: 0.8, color: '#3bc3a1' },
                    { offset: 1, color: '#31c4a1' }
                  ]
                ),
                // color: '#3bc3a1'
                shadowColor: '#3bc3a1',
                barBorderRadius: [0, 15, 15, 0]
              },
              z: 10
            }
          ]
        });
        pieChart.setOption({
          backgroundColor: "#ffffff",
          color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#007500"],
          series: [{
            label: {
              fontSize: 14,
              color: '#999999'
            },
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['25%', '40%'],
            data: [{
              value: res.data.sowCount,
              name: '种用母猪',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  1, 0, 0, 0,
                  [
                    { offset: 0, color: '#f1adfa' },
                    { offset: 1, color: '#f9ecfd' }
                  ]
                )
              }
            }, {
              value: res.data.boarCount,
              name: '种用公猪',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  1, 0, 0, 0,
                  [
                    { offset: 0, color: '#3bcaff' },
                    { offset: 1, color: '#58d4fe' }
                  ]
                )
              }
            }, {
              value: res.data.nurtureCount,
              name: '哺乳猪仔',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  1, 0, 0, 0,
                  [
                    { offset: 0, color: '#ffbf34' },
                    { offset: 1, color: '#ffd633' }
                  ]
                )
              }
            }, {
              value: res.data.conservation,
              name: '保育猪',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  1, 0, 0, 0,
                  [
                    { offset: 0, color: '#a889ff' },
                    { offset: 1, color: '#bb9fff' }
                  ]
                )
              }
            }, {
              value: res.data.fatten,
              name: '育肥猪',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  1, 0, 0, 0,
                  [
                    { offset: 0, color: '#b6e02a' },
                    { offset: 1, color: '#d5f04a' }
                  ]
                )
              }
            }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 2, 2, 0.3)'
              }
            }
          }]
        });
      }
      wx.hideLoading();
    });
  }
});
