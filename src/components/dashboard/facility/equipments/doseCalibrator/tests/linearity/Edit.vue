<template>
  <div class="main">
    <div class="center">
      <div>
        <b-modal id="modal-center" centered no-close-on-backdrop no-close-on-esc hide-header hide-header-close hide-footer>
          <p class="col-12 mx-auto inline-block" style="width: fit-content">Fazendo upload do documento...</p>
          <img class="img img-fluid" src="/static/img/loading.gif">
        </b-modal>
      </div>
      <div class="col-12" enctype="multipart/form-data">
        <div class="row">
          <div class="col">
            <h2>Editar Teste de Linearidade</h2>
          </div>
          <div class="col text-right">
            <button @click="finishTest()" v-if="permission.canExcludeFacility(currentUser)" class="btn btn-outline-success"><i class="fas fa-check d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fas fa-check" aria-hidden="true"></i> finalizar</span></button>
            <button @click="exclude()" v-if="permission.canExcludeFacility(currentUser)" class="btn btn-outline-danger"><i class="far fa-trash-alt d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="far fa-trash-alt" aria-hidden="true"></i> excluir</span></button>
          </div>
        </div>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/' + equipment.type">{{ equipment.type }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id + '/linearity/'">linearidade</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">editar</li>
            </ol>
          </nav>
        </div>
        <div class="hyper-card mb-3 col-12 col-md-6 mx-auto">
          <div class="alert alert-danger" v-if="error">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Radioisótopo</label>
              <input class="form-control" v-model="radioisotope.name" readonly/>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="far fa-calendar-alt" aria-hidden="true"></i> Data</label>
              <input type="date" v-model="date" class="form-control" readonly/>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="far fa-user" aria-hidden="true"></i> Responsável</label>
              <input v-model="responsible.name" readonly class="form-control"/>
            </div>
          </div>
        </div>
        <div class="mb-3 text-center">
          <div class="col-12 col-md-6 mx-auto pb-2">
            <table class="table table-fluid table-responsive hyper-table col-12 m-auto" v-if="tests.length > 0">
              <thead>
                <tr>
                  <th>Data e Hora</th>
                  <th>Tempo (h)</th>
                  <th>Atividade</th>
                  <th>Atividade Calculada</th>
                  <th>Desvio (%)</th>
                  <th>Remover</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="test in tests" v-if="tests.length > 0">
                  <td>{{ test.date | moment('DD/MM/YYYY kk:mm')}}</td>
                  <td>{{ test.time }}</td>
                  <td>{{ test.activity }}</td>
                  <td v-if="isNaN(test.calculatedActivity)"></td>
                  <td v-else>{{ test.calculatedActivity }}</td>
                  <td v-if="isNaN(test.deviation)"></td>
                  <td v-else>{{ test.deviation + ' ' }}<span v-if="test.deviation > 10" class="red"><i class="fas fa-exclamation-circle"></i></span></td>
                  <td><button @click="eraseLine(test)" class="btn btn-outline-danger"><i class="fas fa-times" aria-hidden="true"></i></button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="hyper-card col-12 col-md-6 mx-auto">
            <h5>Adicinar nova linha:</h5>
            <br>
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label class="col-form-label" for="formName"><i class="far fa-calendar-alt" aria-hidden="true"></i> Data e Hora</label>
                  <input type="datetime-local" class="form-control" v-model="test.date">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label class="col-form-label" for="formName"><i class="fab fa-react" aria-hidden="true"></i> Atividade (µCi)</label>
                  <input type="number" class="form-control" v-model="test.activity">
                </div>
              </div>
              <div class="col-12 col-md-1 align-middle pt-4 mt-2">
                <button @click="confirmLine()" class="btn btn-outline-metalic-seaweed"><i class="fa fa-check" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 mx-auto">
          <button class="btn btn-success btn-block" @click="edit()">Salvar</button>
        </div>
        <br>
        <br>
        <div class="row pb-5">
          <div class="hyper-card col-12 col-md-6 offset-md-3" v-if="this.plotPoints.length > 0 && this.calculatedPlotPoints.length > 0">
            <plot id="plot-test" :plot-tests="this.plotPoints" :calculated-plot-tests="this.calculatedPlotPoints"></plot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import router from '../../../../../../../routes'
import axios from 'axios'
import plot from './Plot'
import JsPDF from 'jspdf'
import moment from 'moment'
import Hashids from 'hashids'

export default {
  components: { plot },

  data () {
    return {
      status: '',
      radioisotope: {
        name: '',
        halfLife: ''
      },
      plotPoints: [],
      calculatedPlotPoints: [],
      conclusion: 'satisfatório',
      date: '',
      test: {
        date: '',
        activity: ''
      },
      tests: [],
      equipment: { name: '', _id: '' },
      facility: {},
      responsible: { label: '', name: '' },
      responsibleOptions: [ { name: '' } ],
      error: '',
      permission: permission,
      loading: false
    }
  },

  watch: {
    loading () {
      if (this.loading) {
        this.$root.$emit('bv::show::modal', 'modal-center')
      }
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.equipmentId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.error = 'Nenhum resultado encontrado'
        this.equipment = ''
      } else {
        this.equipment = response.data

        axios.get(auth.apiUrl() + 'facility/' + response.data.facility._id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
        .then(resp => {
          if (resp.data.length === 0) {
            this.error = 'Nenhum resultado encontrado'
            this.facility = ''
          } else {
            this.facility = resp.data
          }
        }, resp => {
          this.error = resp.data.faultString
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
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.test = ''
      } else {
        this._id = response.data._id
        this.status = response.data.status
        this.tests = response.data.tests
        this.radioisotope = response.data.radioisotope
        this.date = moment(response.data.date).format('YYYY-MM-DD')
        this.responsible = { label: response.data.responsible.name, name: response.data.responsible.name, _id: response.data.responsible._id }
        this.testPoints(response.data.tests)
      }
    })
    .catch(error => {
      this.errors = error.data
      this.test = ''
    })

    this.currentUser = auth.currentUser()
  },
  methods: {
    exclude () {
      if (confirm('Tem certeza que deseja excluir este teste?')) {
        var credentials = {
          _id: this._id
        }
        auth.excludeDoseCalibratorLinearityTest(this, credentials, '/equipments/doseCalibrator/' + this.equipment._id + '/linearity')
      }
    },

    edit () {
      if (!this.responsible._id) {
        this.error = 'Selecione um responsável'
        return
      }
      this.testPoints(this.tests)

      var doc = {
        _id: this._id,
        status: 'em andamento',
        conclusion: this.conclusion,
        radioisotope: { name: this.radioisotope.name.value, halfLife: this.radioisotope.name.halfLife },
        tests: this.tests,
        responsible: { _id: this.responsible._id, name: this.responsible.name },
        equipment: { _id: this.$route.params.id },
        date: this.date
      }
      auth.editDoseCalibratorLinearityTest(this, doc, '/equipments/doseCalibrator/' + this.equipment._id + '/linearity/')
    },

    confirmLine () {
      this.tests.push(this.test)
      this.test = { date: '', activity: '' }
      this.testPoints(this.tests)
    },
    eraseLine (test) {
      let idx = this.tests.indexOf(test)
      if (idx !== -1) {
        this.tests.splice(idx, 1)
      }
      this.testPoints(this.tests)
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
      return new Promise((resolve, reject) => {
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
          if (Math.abs(1 - (result.equation[0] * Math.exp(result.equation[1] * tests[i].time) / tests[i].activity)) * 100 > 10) {
            this.conclusion = 'insatisfatório'
          }
        }
        for (let i = 0; i < tests.length; i++) {
          if (tests.length === 1) {
            tests[i].time = 0
            tests[i].calculatedActivity = ''
            tests[i].deviation = ''
            this.plotPoints.push({ x: tests[i].time, y: tests[i].activity })
            this.calculatedPlotPoints.push({ x: tests[i].time, y: tests[i].calculatedActivity })
          } else if (i === 0) {
            tests[i].time = 0
            tests[i].calculatedActivity = (result.equation[0] * Math.exp(result.equation[1] * tests[i].time)).toFixed(2)
            tests[i].deviation = (Math.abs(100 - ((tests[i].activity * 100) / (result.equation[0] * Math.exp(result.equation[1] * tests[i].time))))).toFixed(2)
            this.plotPoints.push({ x: tests[i].time, y: tests[i].activity })
            this.calculatedPlotPoints.push({ x: tests[i].time, y: tests[i].calculatedActivity })
          } else {
            tests[i].time = ((new Date(tests[i].date) - new Date(tests[0].date)) / 60 / 60 / 1000).toFixed(2)
            tests[i].calculatedActivity = (result.equation[0] * Math.exp(result.equation[1] * tests[i].time)).toFixed(2)
            tests[i].deviation = (Math.abs(100 - ((tests[i].activity * 100) / (result.equation[0] * Math.exp(result.equation[1] * tests[i].time))))).toFixed(2)
            this.plotPoints.push({ x: tests[i].time, y: tests[i].activity })
            this.calculatedPlotPoints.push({ x: tests[i].time, y: tests[i].calculatedActivity })
          }
        }
        resolve(tests)
      })
    },

    finishTest () {
      if (confirm('Se houverem modificações que não tiverem sido salvas, essas modificações serão descartadas! Tem certeza que deseja finalizar este teste?')) {
        this.loading = true
        this.testPoints(this.tests).then(() => {
          let credentials = {
            _id: this._id,
            status: 'finalizado'
          }
          auth.finishDoseCalibratorLinearityTest(this, credentials)
          this.generateDocument().then(() => {
            this.loading = false
            router.push({ path: '/facility/' + this.facility._id + '/documents' })
          })
        })
      }
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
      return new Promise((resolve, reject) => {
        this.testPoints(this.tests)
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
        this.addLabelAndInformation(doc, 150, beginTextHeight + 2 * lineHeight, 'Data:', moment(this.date).format('DD/MM/YYYY'))

        this.addLabelAndInformation(doc, 15, beginTextHeight + 3 * lineHeight, 'Responsável:', this.responsible.name)
        this.addLabelAndInformation(doc, 90, beginTextHeight + 3 * lineHeight, 'Isótopo utilizado:', this.radioisotope.name)
        this.addLabelAndInformation(doc, 150, beginTextHeight + 3 * lineHeight, 'Meia-vida:', (this.radioisotope.halfLife / 60 / 60).toFixed(2).toString().replace('.', ',') + ' horas')

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

        for (let i = 0; i < this.tests.length; i++) {
          doc.text(15, beginThirdTextHeight + i * tableLineHeight + 10, moment(this.tests[i].date).format('DD/MM/YYYY kk:mm'))
          doc.text(69, beginThirdTextHeight + i * tableLineHeight + 10, parseFloat(this.tests[i].time).toFixed(2).toString())
          doc.text(106, beginThirdTextHeight + i * tableLineHeight + 10, parseFloat(this.tests[i].activity).toFixed(2).toString())
          doc.text(143, beginThirdTextHeight + i * tableLineHeight + 10, !isNaN(parseFloat(this.tests[i].calculatedActivity).toFixed(2)) ? parseFloat(this.tests[i].calculatedActivity).toFixed(2).toString() : '-')
          doc.text(180, beginThirdTextHeight + i * tableLineHeight + 10, !isNaN((parseFloat(this.tests[i].deviation).toFixed(2) + '%')) ? (parseFloat(this.tests[i].deviation).toFixed(2).toString()) : '-')
        }
        doc.roundedRect(10, beginThirdRoundedRect, 190, this.tests.length * tableLineHeight + 22, 2, 2, 'S')

        doc.text(190, 280, '1/2')

        doc.addPage()
        doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
        doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

        doc.roundedRect(10, 35, 190, 100, 2, 2, 'S')
        doc.setFontSize(12)
        doc.setFontStyle('bold')
        doc.text(105, 35 + 8, 'Gráfico', null, null, 'center')
        var canvas = document.getElementById('scatter-chart') // ('#scatter-chart')
        var canvasImg = canvas.toDataURL('image/png', 1.0)
        doc.setFontSize(20)
        doc.addImage(canvasImg, 'PNG', 63, 47, 83, 83)

        doc.roundedRect(10, 138, 190, 35, 2, 2, 'S')
        doc.setFontSize(12)
        doc.setFontStyle('bold')
        doc.text(105, 138 + 8, 'Resultados', null, null, 'center')
        doc.setFontSize(10)
        doc.setFontStyle('normal')
        if (this.conclusion === 'satisfatório') {
          doc.text(15, 138 + 15, 'Todos os resultados apresentaram desvio menor que o estabelecido em norma [2].')
        } else {
          doc.text(15, 138 + 15, 'Os resultados apresentaram desvio maior que o estabelecido em norma [2]. O teste deverá ser realizado novamente')
          doc.text(15, 138 + 15 + 6, 'ou o equipamento enviado para manutenção.')
        }

        this.addLabelAndInformation(doc, 15, 138 + 15 + lineHeight, 'Conclusão:', this.conclusion)

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

        var hashids = new Hashids('AKJSBDalsdabskJASd', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
        setTimeout(() => {
          doc.save(this.equipment.type + ' ' + this.equipment.patrimonialNumber + ' Linearidade - ' + this.test.date + '.pdf')
        }, 3000)

        const docData = doc.output('dataurinewwindow')

        var cred = {
          name: this.equipment.type + ' ' + this.equipment.patrimonialNumber + ' Linearidade - ' + this.test.date,
          data: docData,
          mode: 'last',
          uploadedAt: new Date(),
          uploadedBy: {_id: this.currentUser.id, name: this.currentUser.name},
          validity: new Date(new Date(this.date).setFullYear(new Date(this.date).getFullYear() + 1)),
          hash: hashids.encode(Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1)),
          facility: {_id: this.facility._id, name: this.facility.name}
        }
        auth.registerDocument(this, cred, () => {
          resolve()
        })
      })
    }
  }
}
</script>
../../../../../../../../services/permissions