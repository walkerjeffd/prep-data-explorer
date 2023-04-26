import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import accessibility from 'highcharts/modules/accessibility'
import boost from 'highcharts/modules/boost'
import noData from 'highcharts/modules/no-data-to-display'

accessibility(Highcharts)
boost(Highcharts)
noData(Highcharts)

Highcharts.setOptions({
  chart: {
    animation: false
  },
  colors: ['#0B8BCC', '#68C9D0', '#F15A29', '#9BD4F4', '#8D9FD0', '#C1E1C1', '#8CD35E', '#F5D482', '#F7AE1D',
    '#F3AF8F', '#CECDC9'],
  title: {
    style: {
      color: 'black',
      font: 'bold 24px "Roboto Condensed", sans-serif'
    }
  },
  subtitle: {
    style: {
      color: 'black',
      font: '12px "Roboto Condensed", sans-serif'
    }
  },
  xAxis: {
    title: {
      style: {
        color: 'black',
        font: '18px "Roboto Condensed", sans-serif'
      }
    }
  },
  yAxis: {
    title: {
      style: {
        color: 'black',
        font: '18px "Roboto Condensed", sans-serif'
      }
    }
  },
  tooltip: {
    style: {
      color: 'black',
      fontSize: '12px'
    }
  },
  legend: {
    itemStyle: {
      font: '12px "Roboto Condensed", sans-serif',
      color: 'black'
    },
    itemHoverStyle: {
      color: 'gray'
    }
  }
})

export default HighchartsVue