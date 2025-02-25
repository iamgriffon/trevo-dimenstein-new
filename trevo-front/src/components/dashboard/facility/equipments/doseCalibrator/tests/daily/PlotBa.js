import { Scatter } from 'vue-chartjs'

export default {
  extends: Scatter,
  props: ['plotPointsBa', 'calculatedPlotBa', 'calculatedPlotPointsBaPlus', 'calculatedPlotPointsBaMinus'],

  data () {
    return {
      chartData: {},
      activities: [],
      xAxesTicks: {},
      yAxesTicks: {},
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                day: 'DD/MM/YYYY',
                month: 'MM/YYYY',
                year: 'YYYY'
              }
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Tempo'
            }
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
            }
          }]
        },
        title: {
          display: true,
          text: 'Teste de Reprodutibilidade Diário do Calibrador de Doses - Ba(133)'
        }
      }
    }
  },

  created () {
    this.chartData = {
      datasets: [{
        data: this.plotPointsBa,
        label: 'Medidas Ba(133)',
        backgroundColor: '#666666'
      }, {
        data: this.calculatedPlotBa,
        label: 'Decaimento calculado para Ba(133)',
        showLine: true,
        fill: false,
        pointRadius: 0,
        backgroundColor: '#A71D00',
        borderColor: '#A71D00'
      }, {
        data: this.calculatedPlotPointsBaPlus,
        label: 'Limite Superior CNEN',
        showLine: true,
        fill: false,
        pointRadius: 0,
        backgroundColor: '#F3BDB2',
        borderColor: '#F3BDB2'
      }, {
        data: this.calculatedPlotPointsBaMinus,
        showLine: true,
        label: 'Limite Inferior CNEN',
        fill: false,
        pointRadius: 0,
        backgroundColor: '#F3BDB2',
        borderColor: '#F3BDB2'
      }]
    }
  },

  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
