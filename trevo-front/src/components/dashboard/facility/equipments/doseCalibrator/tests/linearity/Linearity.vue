<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col">
        <h1>{{ equipment.type + ' ' + equipment.patrimonialNumber }}</h1>
        <h2>Linearidade - {{ test.date | year }}</h2>
      </div>
      <div class="col text-right">
        <button @click="generateDocument()" class="btn btn-outline-success"><i class="far fa-file-alt d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="far fa-file-alt" aria-hidden="true"></i> gerar PDF</span></button>
        <button @click="exclude()" v-if="permission.canExcludeFacility(currentUser)" class="btn btn-outline-danger"><i class="far fa-trash-alt d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="far fa-trash-alt" aria-hidden="true"></i> excluir</span></button>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments/doseCalibrator/'">{{ equipment.type }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id">{{ equipment.patrimonialNumber }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id + '/linearity/'">linearidade</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{  test.date | year }}</li>
        </ol>
      </nav>
    </div>

    <div class="row ml-md-3">
      <div class="col mb-3 pl-sm-1">
        <div class="hyper-card mb-3">
          <h5 class="mb-3">Informações:</h5>
          <p class="pl-3"><i class="fab fa-react" aria-hidden="true"></i> {{ test.radioisotope.name }}</p>
          <p class="pl-3"><i class="far fa-calendar-alt" aria-hidden="true"></i> {{ test.date | year  }}</p>
          <p class="pl-3"><i class="far fa-user" aria-hidden="true"></i> {{ test.responsible.name }}</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <table class="table table-responsive hyper-table col-12 m-auto">
          <thead>
            <tr>
              <th>Data e Hora</th>
              <th>Tempo (h)</th>
              <th>Atividade</th>
              <th>Atividade Calculada</th>
              <th>Desvio (%)</th>
            </tr>
          </thead>
          <tbody >
            <tr v-for="line in test.tests">
              <td>{{ line.date | moment('DD/MM/YYYY kk:mm')}}</td>
              <td>{{ line.time }}</td>
              <td>{{ twoDigits(line.activity) }}</td>
              <td>{{ isNaN(line.calculatedActivity) ? '-' : twoDigits(line.calculatedActivity) }}</td>
              <td>{{ isNaN(line.deviation) ? '-' : line.deviation + '%' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br><br>

    <div class="row col pr-0">
      <div class="hyper-card col ml-3 mr-0">
        <h5 class="mb-3">Resultado:</h5>
        <p v-if="test.conclusion === 'satisfatório'"> Todos os resultados apresentaram desvio menor que o estabelecido em norma.</p>
        <p v-else> Os resultados apresentaram desvio maior que o estabelecido em norma. O teste deverá ser realizado novamente ou o equipamento deverá ser enviado para manutenção.</p>
        <div class="row col"><span>Conclusão: {{ test.conclusion }}</span></div>
      </div>
    </div>

    <div class="col-12 align-items-center">
      <br><br>
      <div class="hyper-card col-12 col-md-6 offset-md-3" v-if="this.plotPoints.length > 0 && this.calculatedPlotPoints.length > 0">
        <plot id="plot-test" :plot-tests="this.plotPoints" :calculated-plot-tests="this.calculatedPlotPoints"></plot>
      </div>
      <br><br>
    </div>
  </div>
</template>

<script>
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import moment from 'moment'
import axios from 'axios'
import plot from './Plot'
import JsPDF from 'jspdf'

export default {
  components: { plot },

  data () {
    return {
      facility: {
        equipments: []
      },
      test: { radioisotope: { name: '' } },
      equipment: {},
      currentUser: {},
      permission: permission,
      plotPoints: [],
      calculatedPlotPoints: []
    }
  },

  filters: {
    year: function (date) {
      return moment(date).format('YYYY')
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.equipmentId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.equipment = ''
      } else {
        this.equipment = response.data

        axios.get(auth.apiUrl() + 'facility/' + response.data.facility._id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
        .then(resp => {
          if (resp.data.length === 0) {
            this.errors = 'Nenhum resultado encontrado'
            this.facility = ''
          } else {
            this.facility = resp.data
          }
        })
        .catch(error => {
          this.errors = error.data
          this.facility = ''
        })
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

    axios.get(auth.apiUrl() + 'equipment/doseCalibratorLinearityTests/' + this.$route.params.testId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      this.test = response.data
      this.testPoints(response.data.tests)
    })
    .catch(error => {
      this.errors = error.data
    })

    this.currentUser = auth.currentUser()
  },

  methods: {
    exclude () {
      if (confirm('Tem certeza que deseja excluir este teste?')) {
        auth.excludeDoseCalibratorLinearityTest(this, this.test, '/equipments/doseCalibrator/' + this.equipment._id + '/linearity')
      }
    },

    expCurveFit (d) {
      let sumX2Y = 0
      let sumYLnY = 0
      let sumXY = 0
      let sumXYLnY = 0
      let sumY = 0
      for (let i = 0; i < d.length; i++) {
        let x = d[i][0]
        let y = d[i][1]
        sumX2Y += Math.pow(x, 2) * y
        sumYLnY += y * Math.log(y)
        sumXY += x * y
        sumXYLnY += x * y * Math.log(y)
        sumY += y
      }
      let a = ((sumX2Y * sumYLnY) - (sumXY * sumXYLnY)) / (sumY * sumX2Y - Math.pow(sumXY, 2))
      let b = ((sumY * sumXYLnY) - (sumXY * sumYLnY)) / (sumY * sumX2Y - Math.pow(sumXY, 2))
      return { equation: [Math.exp(a), b] }
    },

    testPoints (tests) {
      let points = []

      for (let i = 0; i < tests.length; i++) {
        if (i === 0) {
          tests[i].time = 0
          points.push([parseFloat(tests[i].time), parseFloat(tests[i].activity)])
        } else {
          tests[i].time = ((new Date(tests[i].date) - new Date(tests[0].date)) / 60 / 60 / 1000).toFixed(2)
          points.push([parseFloat(tests[i].time), parseFloat(tests[i].activity)])
        }
      }
      let result = this.expCurveFit(points)

      for (let i = 0; i < tests.length; i++) {
        if (i === 0) {
          tests[i].calculatedActivity = result.equation[0] * Math.exp(result.equation[1] * tests[i].time)
          tests[i].deviation = (Math.abs(1 - tests[i].calculatedActivity / tests[i].activity) * 100).toFixed(2)
          this.plotPoints.push({ x: tests[i].time, y: tests[i].activity })
          this.calculatedPlotPoints.push({ x: tests[i].time, y: tests[i].calculatedActivity })
          if (tests[i].deviation > 10) {
            this.test.conclusion = 'insatisfatório'
            this.conclusion = 'insatisfatório'
          }
        } else {
          tests[i].calculatedActivity = (result.equation[0] * Math.exp(result.equation[1] * tests[i].time)).toFixed(2)
          tests[i].deviation = (Math.abs(1 - tests[i].calculatedActivity / tests[i].activity) * 100).toFixed(2)
          this.plotPoints.push({ x: tests[i].time, y: tests[i].activity })
          this.calculatedPlotPoints.push({ x: tests[i].time, y: tests[i].calculatedActivity })
          if (tests[i].deviation > 10) {
            this.test.conclusion = 'insatisfatório'
            this.conclusion = 'insatisfatório'
          }
        }
      }
    },

    twoDigits (val) {
      return parseFloat(val).toFixed(2)
    },

    addLabelAndInformation (doc, x, y, label, information) {
      var spaceBetweenInformationAndLabel = 5

      doc.setFontSize(8)
      doc.setFontStyle('bold')
      doc.text(label, x, y)
      doc.setFontSize(10)
      doc.setFontStyle('normal')
      if (information) {
        doc.text(information, x, y + spaceBetweenInformationAndLabel)
      } else {
        doc.text('', x, y + spaceBetweenInformationAndLabel)
      }
    },

    truncate (str, n) {
      return (str.length > n) ? str.substr(0, n - 3) + '...' : str
    },

    generateDocument () {
      var doc = new JsPDF()

      var radLogo = require('../../../../../../shared/radLogo').radLogo()
      var lineHeight = 12
      var tableLineHeight = 6
      var beginRoundedRect = 35
      var beginTextHeight = beginRoundedRect + 15

      var beginSecondRoundedRect = beginRoundedRect + 60 + 3
      var beginSecondTextHeight = beginSecondRoundedRect + 15

      var beginThirdRoundedRect = beginSecondRoundedRect + 15 + 2 * 6 + 3
      var beginThirdTextHeight = beginThirdRoundedRect + 15

      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

      doc.roundedRect(10, beginRoundedRect, 190, 60, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginRoundedRect + 8, 'Controle de Qualidade', null, null, 'center')

      this.addLabelAndInformation(doc, 15, beginTextHeight, 'Instalação:', this.truncate(this.facility.companyName, 43))
      this.addLabelAndInformation(doc, 90, beginTextHeight, 'Local:', this.equipment.localization)
      this.addLabelAndInformation(doc, 15, beginTextHeight + lineHeight, 'Equipamento:', this.equipment.type)
      this.addLabelAndInformation(doc, 90, beginTextHeight + lineHeight, 'Modelo:', this.equipment.manufacturer + '/' + this.equipment.model + '-' + this.equipment.serialNumber)
      this.addLabelAndInformation(doc, 150, beginTextHeight + lineHeight, 'Número Patrimonial:', this.equipment.patrimonialNumber)

      this.addLabelAndInformation(doc, 15, beginTextHeight + 2 * lineHeight, 'Teste:', 'Linearidade')
      this.addLabelAndInformation(doc, 90, beginTextHeight + 2 * lineHeight, 'Periodicidade:', 'Anual')
      this.addLabelAndInformation(doc, 150, beginTextHeight + 2 * lineHeight, 'Data:', moment(this.test.date).format('DD/MM/YYYY'))

      this.addLabelAndInformation(doc, 15, beginTextHeight + 3 * lineHeight, 'Responsável:', this.test.responsible.name)
      this.addLabelAndInformation(doc, 90, beginTextHeight + 3 * lineHeight, 'Isótopo utilizado:', this.test.radioisotope.name)
      this.addLabelAndInformation(doc, 150, beginTextHeight + 3 * lineHeight, 'Meia-vida:', (this.test.radioisotope.halfLife / 60 / 60).toFixed(2).toString().replace('.', ',') + ' horas')

      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginSecondRoundedRect + 8, 'Objetivos', null, null, 'center')

      doc.setFontSize(10)
      doc.setFontStyle('normal')
      doc.text(15, beginSecondTextHeight, 'Verificar a linearidade nas medidas de um calibrador de dose através da utilização de uma fonte de meia vida curta.')
      doc.text(15, beginSecondTextHeight + 6, 'As medidas devem estar dentro de um intervalo de até 10% (dez por cento) [1-2].')
      doc.roundedRect(10, beginSecondRoundedRect, 190, 15 + 2 * 6, 2, 2, 'S')

      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginThirdRoundedRect + 8, 'Análises', null, null, 'center')

      doc.setFontSize(10)
      doc.setFontStyle('normal')
      doc.text(15, beginThirdTextHeight + 2, 'Data e Hora')
      doc.text(69, beginThirdTextHeight + 2, 'Tempo (h)')
      doc.text(106, beginThirdTextHeight, 'Atividade')
      doc.text(106, beginThirdTextHeight + 4, 'Medida (µCi)')
      doc.text(143, beginThirdTextHeight, 'Atividade')
      doc.text(143, beginThirdTextHeight + 4, 'Calculada (µCi)')
      doc.text(180, beginThirdTextHeight + 2, 'Desvio (%)')

      for (let i = 0; i < this.test.tests.length; i++) {
        doc.text(15, beginThirdTextHeight + i * tableLineHeight + 10, moment(this.test.tests[i].date).format('DD/MM/YYYY kk:mm'))
        doc.text(69, beginThirdTextHeight + i * tableLineHeight + 10, parseFloat(this.test.tests[i].time).toFixed(2).toString())
        doc.text(106, beginThirdTextHeight + i * tableLineHeight + 10, parseFloat(this.test.tests[i].activity).toFixed(2).toString())
        doc.text(143, beginThirdTextHeight + i * tableLineHeight + 10, !isNaN(parseFloat(this.test.tests[i].calculatedActivity).toFixed(2)) ? parseFloat(this.test.tests[i].calculatedActivity).toFixed(2).toString() : '-')
        doc.text(180, beginThirdTextHeight + i * tableLineHeight + 10, !isNaN((parseFloat(this.test.tests[i].deviation).toFixed(2))) ? (parseFloat(this.test.tests[i].deviation).toFixed(2).toString()) + '%' : '-')
      }
      doc.roundedRect(10, beginThirdRoundedRect, 190, this.test.tests.length * tableLineHeight + 22, 2, 2, 'S')

      doc.text(190, 280, '1/2')

      doc.addPage()
      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

      doc.roundedRect(10, 35, 190, 100, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, 35 + 8, 'Gráfico', null, null, 'center')
      var canvas = document.querySelector('#scatter-chart')
      var canvasImg = canvas.toDataURL('image/png', 1.0)
      doc.setFontSize(20)
      doc.addImage(canvasImg, 'PNG', 63, 47, 83, 83)

      doc.roundedRect(10, 138, 190, 35, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, 138 + 8, 'Resultados', null, null, 'center')
      doc.setFontSize(10)
      doc.setFontStyle('normal')
      if (this.test.conclusion === 'satisfatório') {
        doc.text(15, 138 + 15, 'Todos os resultados apresentaram desvio menor que o estabelecido em norma [2].')
      } else {
        doc.text(15, 138 + 15, 'Os resultados apresentaram desvio maior que o estabelecido em norma [2]. O teste deverá ser realizado novamente')
        doc.text(15, 138 + 15 + 6, 'ou o equipamento enviado para manutenção.')
      }

      this.addLabelAndInformation(doc, 15, 138 + 15 + lineHeight, 'Conclusão:', this.test.conclusion)

      doc.roundedRect(10, 176, 190, 45, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, 178 + 8, 'Bibliografia', null, null, 'center')

      doc.setFontSize(10)
      doc.setFontStyle('normal')
      doc.text(15, 178 + 8 + 8, '[1] INTERNATIONAL ATOMIC ENERGY AGENCY. IAEA-TECDOC-602: Quality control of nuclear medicine')
      doc.text(15, 178 + 8 + 8 + 6, 'instruments 1991. Vienna. 1991')
      doc.text(15, 178 + 8 + 8 + 8 + 6, '[2] COMISSÃO NACIONAL DE ENERGIA NUCLEAR. Norma CNEN NN 3.05: Requisitos de Segurança e Proteção')
      doc.text(15, 178 + 8 + 8 + 8 + 6 + 6, 'Radiológica para Serviços de Medicina Nuclear. 2013.')

      doc.text(190, 280, '2/2')

      setTimeout(() => {
        // doc.output('dataurlnewwindow')
        window.open(doc.output('bloburl'))
      }, 3000)
    }
  }
}
</script>

<style scoped>
[data-letters-list]:before {
  content:attr(data-letters-list);
  display:inline-block;
  font-size:1em;
  width:3em;
  height:3em;
  line-height:3em;
  text-align:center;
  border-radius:50%;
  background: #00a767;
  vertical-align:middle;
  margin-right:1em;
  color:white;
}

.fa {
  width: 14px;
  height: 14px;
}
</style>
../../../../../../../../services/permissions