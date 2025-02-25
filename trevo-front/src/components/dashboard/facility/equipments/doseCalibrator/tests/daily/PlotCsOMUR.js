import { Scatter } from 'vue-chartjs'

export default {
  extends: Scatter,
  props: ['plotPointsCsOmur', 'calculatedPlotCsOmur', 'calculatedPlotPointsCsOmurPlus', 'calculatedPlotPointsCsOmurMinus'],

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
          text: 'Teste de Repetibilidade Diário do Calibrador de Doses - Cs(137) no Radioisótopo mais Utilizado'
        }
      }
    }
  },

  created () {
    this.chartData = {
      datasets: [{
        data: this.plotPointsCsOmur,
        label: 'Medidas Cs(137) no Radioisótopo mais Utilizado',
        backgroundColor: '#666666'
      }, {
        data: this.calculatedPlotCsOmur,
        label: 'Decaimento calculado para Cs(137) no Radioisótopo mais Utilizado',
        showLine: true,
        fill: false,
        pointRadius: 0,
        backgroundColor: '#A71D00',
        borderColor: '#A71D00'
      }, {
        data: this.calculatedPlotPointsCsOmurPlus,
        label: 'Limite Superior CNEN',
        showLine: true,
        fill: false,
        pointRadius: 0,
        backgroundColor: '#F3BDB2',
        borderColor: '#F3BDB2'
      }, {
        data: this.calculatedPlotPointsCsOmurMinus,
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
