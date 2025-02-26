import { Scatter } from 'vue-chartjs'

export default {
  extends: Scatter,
  props: ['plotTests', 'calculatedPlotTests'],

  data () {
    return {
      chartData: {},
      activities: [],
      xAxesTicks: {},
      yAxesTicks: {},
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Tempo (h)'
            },
            ticks: { beginAtZero: true }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Atividade (µCi)'
            },
            ticks: {
              beginAtZero: true,
              callback: function (value, index, values) {
                return value.toFixed(0)
              }
            },
            type: 'logarithmic'
          }]
        },
        title: {
          display: true,
          text: 'Teste de Linearidade'
        }
      }
    }
  },

  created () {
    this.chartData = {
      datasets: [{
        data: this.plotTests,
        label: 'Medidas',
        backgroundColor: '#666666'
      }, {
        data: this.calculatedPlotTests,
        label: 'Regressão Linear',
        showLine: true,
        fill: false,
        pointRadius: 0
      }]
    }
  },

  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
