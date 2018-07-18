// 创建时间列的x轴
export let createX = () => {
  let h = 9
  let m = 30
  let t1 = ''
  let xx = []
  for (let i = 0; i < 242; i++) {
    if (m === 59) {
      t1 = h + ':' + m
      xx.push(t1)
      h++
      m = 0
    } else {
      if (m >= 10) {
        t1 = h + ':' + m
        xx.push(t1)
        if (m === 30) {
          if (h === 11) {
            h = 13
            m = 0
          } else {
            m++
          }
        } else {
          m++
        }
      } else {
        t1 = h + ':0' + m
        xx.push(t1)
        m++
      }
    }
  }
  return xx
}

/**
 * 创建option
 * dataTimes: x轴的时间段
 * downStr：最小值
 * yesterdayPrice: 昨收
 * upStr：最大值
 * datay：y轴的值
 * up：右上方的显示
 * line：右中间的显示
 * down：右下方的显示
 * dataJx: 均线
 * dataVolnum: 成交量
 */
export let createOption = (dataTimes, datay, up, line, down, upStr, yesterdayPrice, downStr, dataJx, dataVolnum) => {
  let option = {
    grid: [{
      top: '0%',
      left: '100%',
      right: '100%',
      bottom: '100%',
      height: '70%'
    }, {
      top: '72%',
      left: '100%',
      right: '100%',
      bottom: '100%',
      height: '18%'
    }],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function (a) {
        if (a[0].seriesName === '成交量') {
          return '时间：' + a[0].axisValueLabel + '<br/>' +
            '成交量：' + a[0].value
        } else {
          return '时间：' + a[0].axisValueLabel + '<br/>' +
            '价格：' + a[0].data
        }
      }
    },
    dataZoom: [{
      type: 'inside',
      realtime: true,
      start: 0,
      end: 100,
      zoomLock: true,
      xAxisIndex: [0, 1]
    }],
    xAxis: [{
      type: 'category',
      data: dataTimes,
      scale: true,
      boundaryGap: false,
      axisLabel: {
        show: false,
        margin: 1,
        fontSize: 9
      },
      axisLine: {
        show: true,
        onZero: false,
        lineStyle: {
          color: 'rgba(170,175,189,1)'
        }
      },
      splitLine: {
        show: false,
        lineStyle: {
          // 使用深浅的间隔色
          color: ['rgb(241,241,241)']
        }
      },
      axisTick: {
        show: false
      } // 去掉刻度线
    },
    {
      gridIndex: 1,
      type: 'category',
      data: dataTimes,
      scale: true,
      boundaryGap: false,
      axisLabel: {
        margin: 1,
        show: false,
        fontSize: 9,
        formatter: function (params) {
          if (params === '9:30') {
            return '9:30'
          } else if (params === '11:30') {
            return '11:30'
          } else if (params === '14:59') {
            return '14:59'
          } else {
            return ''
          }
        }
      },
      axisLine: {
        show: true,
        onZero: false,
        lineStyle: {
          color: 'rgba(98,98,98,1)'
        }

      },
      splitLine: {
        show: false,
        lineStyle: {
          // 使用深浅的间隔色
          color: ['rgb(241,241,241)']
        }
      },
      axisTick: {
        show: false
      } // 去掉刻度线
    }],
    yAxis: [{
      gridIndex: 0,
      name: '股票行情',
      scale: true,
      show: false,
      splitLine: { show: true },
      min: downStr,
      max: upStr,
      splitArea: {
        show: true
      }
    },
    {
      gridIndex: 1,
      name: '成交量',
      scale: true,
      show: false,
      splitArea: {
        show: true
      }
    }],
    series: [{
      name: '分时线',
      data: datay,
      type: 'line',
      smooth: 0,
      symbol: 'none',
      itemStyle: {
        normal: {color: 'rgba(76,133,186,0.8)'}
      },
      xAxisIndex: 0,
      yAxisIndex: 0,
      areaStyle: {
        color: 'rgba(214,225,245,0.8)'
      },
      lineStyle: {
        width: 1
      },
      // 标注线
      markLine: {
        symbol: 'pin',
        lineStyle: {
          color: 'rgba(255,77,77,1)',
          type: 'dashed'
        },
        data: [
          [
            {
              // 起点和终点的项会共用一个 name
              name: '基线',
              x: '0%',
              y: '35%'
            },
            {
              x: '100%',
              y: '35%'
            }
          ]

        ]
      },
      // 标注点
      markPoint: {
        data: [
          {
            name: line.toFixed(2) + '%',
            value: (line * 100).toFixed(2) + '%',
            y: '35%',
            x: '98%',
            symbol: 'pin',
            symbolSize: 1,
            label: {
              show: true,
              color: '#1c1c1c',
              position: 'left'
            },
            itemStyle: {
              color: 'rgb(128, 128, 128)'
            }
          },
          {
            name: '+' + up * 100 + '%',
            value: '+' + (Math.abs(up) * 100).toFixed(2) + '%',
            y: '3%',
            x: '98%',
            symbol: 'pin',
            symbolSize: 1,
            label: {
              show: true,
              color: 'red',
              position: 'left'
            },
            itemStyle: {
              color: 'rgb(128, 128, 128)'
            }
          },
          {
            name: down * 100 + '%',
            value: (down * 100).toFixed(2) + '%',
            y: '68%',
            x: '98%',
            symbol: 'pin',
            symbolSize: 1,
            label: {
              show: true,
              color: '#5CB24F',
              position: 'left'
            },
            itemStyle: {
              color: 'rgb(128, 128, 128)'
            }
          },
          {
            name: upStr,
            value: upStr,
            y: '3%',
            x: '1%',
            symbol: 'pin',
            symbolSize: 1,
            label: {
              show: true,
              color: 'red',
              position: 'right'
            },
            itemStyle: {
              color: 'rgb(128, 128, 128)'
            }
          },
          {
            name: yesterdayPrice,
            value: yesterdayPrice,
            y: '35%',
            x: '1%',
            symbol: 'pin',
            symbolSize: 1,
            label: {
              show: true,
              color: '#1c1c1c',
              position: 'right'
            },
            itemStyle: {
              color: 'rgb(128, 128, 128)'
            }
          },
          {
            name: downStr,
            value: downStr,
            y: '68.2%',
            x: '1%',
            symbol: 'pin',
            symbolSize: 1,
            label: {
              show: true,
              color: '#5CB24F',
              position: 'right'
            },
            itemStyle: {
              color: 'rgb(128, 128, 128)'
            }
          }
        ]
      }
    },
    // 均线
    {
      name: '均线',
      xAxisIndex: 0,
      yAxisIndex: 0,
      type: 'line',
      data: dataJx,
      symbol: 'none',
      itemStyle: {
        normal: {color: 'rgba(229,175,46,1)'}
      },
      lineStyle: {
        width: 1
      }

    },
    {
      name: '成交量',
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'bar',
      data: dataVolnum,
      markPoint: {
        data: [
          {
            name: 'vol max',
            type: 'max',
            symbol: 'arrow',
            symbolSize: 10,
            symbolRotate: 180,
            itemStyle: {
              color: 'rgba(229,118,21, 0.9)'
            },
            label: {
              show: true,
              normal: {
                formatter: function (param) {
                  return param != null ? param.value + '万' : ''
                },
                fontSize: 11,
                color: '#1c1c1c',
                position: 'right'
              }
            }
          },
          {
            name: 'time begin',
            value: '9:30',
            y: '92%',
            x: '0',
            symbol: 'pin',
            symbolSize: 1,
            label: {
              show: true,
              color: '#1c1c1c',
              position: 'right',
              fontSize: '10'
            },
            itemStyle: {
              color: 'rgb(128, 128, 128)'
            }
          },
          {
            name: 'time middle',
            value: '11:30',
            y: '92%',
            x: '46%',
            symbol: 'pin',
            symbolSize: 1,
            label: {
              show: true,
              color: '#1c1c1c',
              position: 'right',
              fontSize: '10'
            },
            itemStyle: {
              color: 'rgb(128, 128, 128)'
            }
          },
          {
            name: 'time middle',
            value: '15:00',
            y: '92%',
            x: '100%',
            symbol: 'pin',
            symbolSize: 1,
            label: {
              show: true,
              color: '#1c1c1c',
              position: 'left',
              fontSize: '10'
            },
            itemStyle: {
              color: 'rgb(128, 128, 128)'
            }
          }
        ]
      }

    }]
  }
  return option
}
