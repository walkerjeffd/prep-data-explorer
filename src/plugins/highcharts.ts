import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'

Highcharts.setOptions({
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
      fontSize: '16px'
    }
  },
  legend: {
    itemStyle: {
      font: '18px "Roboto Condensed", sans-serif',
      color: 'black'
    },
    itemHoverStyle: {
      color: 'gray'
    }
  }
})

export default HighchartsVue