<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col-10">
        <h1>{{ equipment.type + ' ' + ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</h1>
        <h2>Diário</h2>
      </div>
      <div class="col-2 text-right">
        <router-link class="btn btn-success" :to="'/equipments/doseCalibrator/' + equipment._id + '/daily/register'"><i class="fa fa-plus d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-sm-block"><i class="fa fa-plus" aria-hidden="true"></i> adicionar</span></router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/doseCalibrator'">{{ equipment.type }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">diário</li>
        </ol>
      </nav>
    </div>
    <div class="row">
      <div class="form-inline col">
        <div class="form-group">
          <label for=""><i class="fa fa-filter"></i></label>
          <v-select type="text" :options="filterDateOptions" v-model="filterDate" class="mx-sm-3"></v-select>
        </div>
        <div class="form-group">
          <v-select type="text" :options="filterDateMonthOptions" v-model="filterDateMonth" class="mx-sm-3"></v-select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table table-responsive small-table hyper-table col mx-auto pt-3">
          <thead>
            <tr>
              <th>Data</th>
              <th>Auto-zero (mV)</th>
              <th>BG (µCi)</th>
              <th>System Test/Chamber Voltage (V)</th>
              <th>Data Check</th>
              <th>Atividade de Co(57)(µCi)</th>
              <th>Desvio de Co(57)(%)</th>
              <th>Atividade de Ba(133)(µCi)</th>
              <th>Desvio de Ba(133)(%)</th>
              <th>Atividade de Cs(137)(µCi)</th>
              <th>Desvio de Cs(137)(%)</th>
              <th>Atividade de Cs(137) medido em {{ equipment.mostUsedRadioisotope }}(µCi)</th>
              <th>Desvio de Cs(137) medido em {{ equipment.mostUsedRadioisotope }}(%)</th>
              <th>Responsável</th>
              <th>Remover</th>
            </tr>
          </thead>
          <tbody >
            <tr v-for="test in filteredTestsList">
              <td>{{ test.date | moment('DD/MM/YY') }}</td>
              <td>{{ test.autoZero + ' (' + test.autoZeroStatus + ')' }}</td>
              <td>{{ test.bG + ' (' + test.bGStatus + ')' }}</td>
              <td>{{ test.systemTest + ' (' + test.systemTestStatus + ')' }}</td>
              <td>{{ test.dataCheckStatus }}</td>
              <td>{{ test.sourceCoActivity }}</td>
              <td>
                <span v-if='!isNaN(parseFloat(test.sourceCoActivityDeviation))' :class="{ 'red-span' : parseFloat(test.sourceCoActivityDeviation) > 10 }">
                  {{ parseFloat(test.sourceCoActivityDeviation).toFixed(2) + '%' }}
                </span>
              </td>
              <td>{{ test.sourceBaActivity }}</td>
              <td>
                <span v-if='!isNaN(parseFloat(test.sourceBaActivityDeviation))' :class="{ 'red-span' : parseFloat(test.sourceBaActivityDeviation) > 10 }">
                  {{ parseFloat(test.sourceBaActivityDeviation).toFixed(2) + '%' }}
                </span>
              </td>
              <td>{{ test.sourceCsActivity }}</td>
              <td>
                <span v-if='!isNaN(parseFloat(test.sourceCsActivityDeviation))' :class="{ 'red-span' : parseFloat(test.sourceCsActivityDeviation) > 10 }">
                  {{ parseFloat(test.sourceCsActivityDeviation).toFixed(2) + '%' }}
                </span>
              </td>
              <td>{{ test.sourceCsOnMostUsedRadioisotopeActivity }}</td>
              <td>
                <span v-if='!isNaN(parseFloat(test.sourceCsOnMostUsedRadioisotopeActivityDeviation))' :class="{ 'red-span' : parseFloat(test.sourceCsOnMostUsedRadioisotopeActivityDeviation) > 10 }">
                  {{ parseFloat(test.sourceCsOnMostUsedRadioisotopeActivityDeviation).toFixed(2) + '%'}}
                </span>
              </td>
              <td>{{ test.responsible.name }}</td>
              <td><button v-if="permission.canExcludeSolidWasteManagement(currentUser)" @click="exclude(test._id)" class="btn btn-outline-danger"><i class="far fa-trash-alt" aria-hidden="true"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br>
    <div class="col-12 align-items-center">
      <div class="hyper-card col-12" v-if="plotPointsCo.length > 0" style="max-height: 450px">
        <plotco style="max-height: 450px" id="plot-co" :plot-points-co="plotPointsCo" :calculated-plot-co="calculatedPlotPointsCo" :calculated-plot-points-co-plus="calculatedPlotPointsCoPlus5" :calculated-plot-points-co-minus="calculatedPlotPointsCoMinus5"></plotco>
      </div>
      <br>
    </div>
    <div class="col-12 align-items-center">
      <div class="hyper-card col-12" v-if="plotPointsBa.length > 0" style="max-height: 450px">
        <plotba style="max-height: 450px" id="plot-ba" :plot-points-ba="plotPointsBa" :calculated-plot-ba="calculatedPlotPointsBa" :calculated-plot-points-ba-plus="calculatedPlotPointsBaPlus5" :calculated-plot-points-ba-minus="calculatedPlotPointsBaMinus5"></plotba>
      </div>
      <br>
    </div>
    <div class="col-12 align-items-center">
      <div class="hyper-card col-12" v-if="plotPointsCs.length > 0" style="max-height: 450px">
        <plotcs style="max-height: 450px" id="plot-cs" :plot-points-cs="plotPointsCs" :calculated-plot-cs="calculatedPlotPointsCs" :calculated-plot-points-cs-plus="calculatedPlotPointsCsPlus5" :calculated-plot-points-cs-minus="calculatedPlotPointsCsMinus5"></plotcs>
      </div>
      <br>
    </div>
    <div class="col-12 align-items-center">
      <div class="hyper-card col-12" v-if="plotPointsCsOnMostUsedRadioisotope.length > 0" style="max-height: 450px">
        <plotcsomur style="max-height: 450px" id="plot-cs" :plot-points-cs-omur="plotPointsCsOnMostUsedRadioisotope" :calculated-plot-cs-omur="calculatedPlotPointsCsOnMostUsedRadioisotope" :calculated-plot-points-cs-omur-plus="calculatedPlotPointsCsOnMostUsedRadioisotopePlus5" :calculated-plot-points-cs-omur-minus="calculatedPlotPointsCsOnMostUsedRadioisotopeMinus5"></plotcsomur>
      </div>
    </div>
    <br><br>
    <div class="row">
      <div class="col-12 col-md-6 mx-auto">
        <div class="hyper-card" v-if="tests.length > 0">
          <div class="">
            <h5>Gerar Relatórios</h5>
            <br/>
          </div>
          <div class="col-12">
            <div class="form-group">
              <i class="far fa-calendar-alt" aria-hidden="true"></i> escolher mês: <v-select type="text" :options="filterReportMonth" v-model="filterMonth" class="mx-sm-3"></v-select>
            </div>
          </div>
          <div class="col-12" v-if="responsibleOptions.length > 0">
            <div class="form-group">
              <label class="col-form-label" for="selectType"><i class="far fa-user" aria-hidden="true"></i> Responsável</label>
              <v-select v-model="responsible" :options="responsibleOptions" class="mx-sm-3"></v-select>
            </div>
          </div>
          <div class="col pt-4 text-center">
            <button @click="downloadReport()" class="btn btn-outline-metalic-seaweed"><i class="fa fa-download d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fa fa-download" aria-hidden="true"></i> relatório mensal</span></button>
          </div>
        </div>
      </div>
    </div>
    <br><br><br><br>
  </div>
</template>

<script>
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import plotco from './PlotCo'
import plotba from './PlotBa'
import plotcs from './PlotCs'
import plotcsomur from './PlotCsOMUR'
import axios from 'axios'
import JsPDF from 'jspdf'
import moment from 'moment'

export default {
  components: { plotco, plotba, plotcs, plotcsomur },

  data () {
    return {
      facility: {
        equipments: []
      },
      equipment: {},
      dataLetters: '',
      currentUser: {},
      permission: permission,
      tests: [],
      filterDateMonth: '',
      plotPointsCo: [],
      calculatedPlotPointsCo: [],
      calculatedPlotPointsCoPlus5: [],
      calculatedPlotPointsCoMinus5: [],
      plotPointsBa: [],
      calculatedPlotPointsBa: [],
      calculatedPlotPointsBaPlus5: [],
      calculatedPlotPointsBaMinus5: [],
      plotPointsCs: [],
      calculatedPlotPointsCs: [],
      calculatedPlotPointsCsPlus5: [],
      calculatedPlotPointsCsMinus5: [],
      plotPointsCsOnMostUsedRadioisotope: [],
      calculatedPlotPointsCsOnMostUsedRadioisotope: [],
      calculatedPlotPointsCsOnMostUsedRadioisotopePlus5: [],
      calculatedPlotPointsCsOnMostUsedRadioisotopeMinus5: [],
      filterDateOptions: [],
      filterDateMonthOptions: [
        {label: 'Janeiro', value: 0},
        {label: 'Fevereiro', value: 1},
        {label: 'Março', value: 2},
        {label: 'Abril', value: 3},
        {label: 'Maio', value: 4},
        {label: 'Junho', value: 5},
        {label: 'Julho', value: 6},
        {label: 'Agosto', value: 7},
        {label: 'Setembro', value: 8},
        {label: 'Outubro', value: 9},
        {label: 'Novembro', value: 10},
        {label: 'Dezembro', value: 11}],
      filterReportMonth: [
        {label: 'Janeiro', value: 0},
        {label: 'Fevereiro', value: 1},
        {label: 'Março', value: 2},
        {label: 'Abril', value: 3},
        {label: 'Maio', value: 4},
        {label: 'Junho', value: 5},
        {label: 'Julho', value: 6},
        {label: 'Agosto', value: 7},
        {label: 'Setembro', value: 8},
        {label: 'Outubro', value: 9},
        {label: 'Novembro', value: 10},
        {label: 'Dezembro', value: 11}],
      filterMonth: '',
      responsibleOptions: [],
      responsible: { name: '', _id: '' }
    }
  },

  computed: {
    filteredTestsList () {
      if (this.filterDate.length > 0) {
        if (this.filterDateMonth) {
          let exp = new RegExp(this.filterDate.trim(), 'i')
          let testList = this.tests.filter(t => exp.test(t.date)).filter(test => new Date(test.date).getMonth() === this.filterDateMonth.value)
          return testList
        }
      } else {
        return []
      }
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
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

        this.loadDailyTests()
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })
    this.currentUser = auth.currentUser()
    let month = new Date().getMonth()
    this.filterDateMonth = { label: this.filterDateMonthOptions[month].label, value: this.filterDateMonthOptions[month].value }
    if (this.$route.params.year) {
      this.filterDate = this.$route.params.year
    }

    if (auth.currentUser().type === 'administrador' || auth.currentUser().type === 'rad laudos' || auth.currentUser().type === 'rad fisico' || auth.currentUser().type === 'rad admin') {
      axios.get(auth.apiUrl() + 'users/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(response => {
        if (response.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.responsibleOptions = []
        } else {
          let responseUsers = response.data.filter(user => { return user.type === 'rad fisico' })
          this.responsibleOptions = responseUsers.map(user => { return { label: user.name, name: user.name, _id: user._id } })
        }
      })
      .catch(error => {
        this.errors = error.data
        this.responsibleOptions = []
      })
    }
  },

  methods: {
    loadDailyTests () {
      axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.id + '/doseCalibratorDailyTests/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(r => {
        if (r.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.tests = ''
        } else {
          r.data = r.data.sort((a, b) => { return new Date(a.date).getTime() - new Date(b.date).getTime() })
          this.tests = r.data
          for (var i = 0; i < r.data.length; i++) {
            if (!this.filterDateOptions.includes(r.data[i].date.split('-')[0])) {
              this.filterDateOptions.push(r.data[i].date.split('-')[0])
            }
            this.plotPointsCo.push({ x: new Date(r.data[i].date), y: parseFloat(r.data[i].sourceCoActivity) })
            this.plotPointsBa.push({ x: new Date(r.data[i].date), y: parseFloat(r.data[i].sourceBaActivity) })
            this.plotPointsCs.push({ x: new Date(r.data[i].date), y: parseFloat(r.data[i].sourceCsActivity) })
            this.plotPointsCsOnMostUsedRadioisotope.push({ x: new Date(r.data[i].date), y: parseFloat(r.data[i].sourceCsOnMostUsedRadioisotopeActivity) })

            let tCo = new Date(r.data[i].date) - new Date(r.data[i].sourceCo.initialActivityDate)
            let calculatedCoActivity = r.data[i].sourceCo.initialActivity * Math.exp(-(0.6931471806 * tCo / 1000 / 60 / 60) / 6522.96)
            this.calculatedPlotPointsCo.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedCoActivity) })
            this.calculatedPlotPointsCoPlus5.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedCoActivity + calculatedCoActivity * 0.05) })
            this.calculatedPlotPointsCoMinus5.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedCoActivity - calculatedCoActivity * 0.05) })

            let tBa = new Date(r.data[i].date) - new Date(r.data[i].sourceBa.initialActivityDate)
            let calculatedBaActivity = r.data[i].sourceBa.initialActivity * Math.exp(-(0.6931471806 * tBa / 1000 / 60 / 60) / 92067.6)
            this.calculatedPlotPointsBa.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedBaActivity) })
            this.calculatedPlotPointsBaPlus5.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedBaActivity + calculatedBaActivity * 0.05) })
            this.calculatedPlotPointsBaMinus5.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedBaActivity - calculatedBaActivity * 0.05) })

            let tCs = new Date(r.data[i].date) - new Date(r.data[i].sourceCs.initialActivityDate)
            let calculatedCsActivity = r.data[i].sourceCs.initialActivity * Math.exp(-(0.6931471806 * tCs / 1000 / 60 / 60) / 264289.2)
            this.calculatedPlotPointsCs.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedCsActivity) })
            this.calculatedPlotPointsCsPlus5.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedCsActivity + calculatedCsActivity * 0.05) })
            this.calculatedPlotPointsCsMinus5.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedCsActivity - calculatedCsActivity * 0.05) })

            let tCsOnMostUsedRadioisotope = new Date(r.data[i].date) - new Date(r.data[i].sourceCsOnMostUsedRadioisotope.initialActivityDate)
            let calculatedCsOnMostUsedRadioisotopeActivity = r.data[i].sourceCsOnMostUsedRadioisotope.initialActivity * Math.exp(-(0.6931471806 * tCsOnMostUsedRadioisotope / 1000 / 60 / 60) / 264289.2)
            this.calculatedPlotPointsCsOnMostUsedRadioisotope.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedCsOnMostUsedRadioisotopeActivity) })
            this.calculatedPlotPointsCsOnMostUsedRadioisotopePlus5.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedCsOnMostUsedRadioisotopeActivity + calculatedCsOnMostUsedRadioisotopeActivity * 0.05) })
            this.calculatedPlotPointsCsOnMostUsedRadioisotopeMinus5.push({ x: new Date(r.data[i].date), y: parseFloat(calculatedCsOnMostUsedRadioisotopeActivity - calculatedCsOnMostUsedRadioisotopeActivity * 0.05) })
          }
        }
      })
      .catch(error => {
        this.errors = error.data
        this.tests = ''
      })
    },

    exclude (id) {
      if (confirm('Tem certeza que deseja excluir este teste?')) {
        auth.excludeDoseCalibratorDailyTest(this, {_id: id}, () => setTimeout(this.loadDailyTests(), 1000))
      }
    },

    allZero (array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] !== 0 && array[i] !== '0') {
          return false
        }
      }
      return true
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

    downloadReport () {
      var doc = new JsPDF()
      var radLogo = require('../../../../../../shared/radLogo').radLogo()

      var lineHeight = 12
      var beginRoundedRect = 35
      var tableLineHeight = 6
      var beginTextHeight = beginRoundedRect + 9

      var beginSecondRoundedRect = beginRoundedRect + 41
      var beginSecondTextHeight = beginSecondRoundedRect + 15

      var beginThirdRoundedRect = beginSecondRoundedRect + 45
      var beginThirdTextHeight = beginThirdRoundedRect + 5

      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

      doc.roundedRect(10, beginRoundedRect, 190, 38, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginRoundedRect + 6, 'Controle de Qualidade', null, null, 'center')

      this.addLabelAndInformation(doc, 15, beginTextHeight, 'Instalação:', this.truncate(this.facility.companyName, 43))
      this.addLabelAndInformation(doc, 90, beginTextHeight, 'Local:', this.equipment.localization)
      if (this.responsible.name !== '') {
        this.addLabelAndInformation(doc, 150, beginTextHeight, 'Responsável:', this.responsible.name)
      }
      this.addLabelAndInformation(doc, 15, beginTextHeight + lineHeight - 2, 'Equipamento:', this.equipment.type)
      this.addLabelAndInformation(doc, 90, beginTextHeight + lineHeight - 2, 'Modelo:', this.equipment.manufacturer + '/' + this.equipment.model + '-' + this.equipment.serialNumber)
      this.addLabelAndInformation(doc, 150, beginTextHeight + lineHeight - 2, 'Número Patrimonial:', this.equipment.patrimonialNumber)

      this.addLabelAndInformation(doc, 15, beginTextHeight + 2 * lineHeight - 4, 'Teste:', 'Reprodutibilidade')
      this.addLabelAndInformation(doc, 90, beginTextHeight + 2 * lineHeight - 4, 'Periodicidade:', 'Diário')
      this.addLabelAndInformation(doc, 150, beginTextHeight + 2 * lineHeight - 4, 'Mês:', this.filterMonth.label)

      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginSecondRoundedRect + 8, 'Informações das Fontes Utilizadas', null, null, 'center')

      doc.setFontSize(10)
      doc.setFontStyle('bold')
      doc.text(15, beginSecondTextHeight, 'Radioisótopo')
      doc.text(90, beginSecondTextHeight, 'Co(57)')
      doc.text(112, beginSecondTextHeight, 'Ba(133)')
      doc.text(139, beginSecondTextHeight, 'Cs(137)')
      doc.text(160, beginSecondTextHeight, 'Cs(137) no mais utili.')

      doc.text(15, beginSecondTextHeight + tableLineHeight, 'Número de Série:')
      doc.text(15, beginSecondTextHeight + 2 * tableLineHeight, 'Atividade Inicial (µCi):')
      doc.text(15, beginSecondTextHeight + 3 * tableLineHeight, 'Data da Atividade Inicial:')
      doc.text(15, beginSecondTextHeight + 4 * tableLineHeight, 'Atividade Calculada no Dia do Teste (µCi):')
      doc.setFontStyle('normal')

      let i = this.tests.length - 1
      while (!this.tests[i].measureCs && i > 1) {
        i--
      }
      if (this.tests[i].sourceCo) {
        let tCo = new Date() - new Date(this.tests[i].sourceCo.initialActivityDate)
        let calculatedCoActivity = this.tests[i].sourceCo.initialActivity * Math.exp(-(0.6931471806 * tCo / 1000 / 60 / 60) / 6522.96)

        doc.text(90, beginSecondTextHeight + tableLineHeight, this.tests[i].sourceCo.serialNumber || '-')
        doc.text(90, beginSecondTextHeight + 2 * tableLineHeight, this.tests[i].sourceCo.initialActivity || '-')
        doc.text(90, beginSecondTextHeight + 3 * tableLineHeight, moment(this.tests[i].sourceCo.initialActivityDate).format('DD/MM/YYYY') || '-')
        doc.text(90, beginSecondTextHeight + 4 * tableLineHeight, calculatedCoActivity.toFixed(2).toString().replace('.', ',') || '-')
      }

      i = this.tests.length - 1
      while (!this.tests[i].measureCs && i > 1) {
        i--
      }
      if (this.tests[i].sourceBa) {
        let tBa = new Date() - new Date(this.tests[i].sourceBa.initialActivityDate)
        let calculatedBaActivity = this.tests[i].sourceBa.initialActivity * Math.exp(-(0.6931471806 * tBa / 1000 / 60 / 60) / 92067.6)

        doc.text(112, beginSecondTextHeight + tableLineHeight, this.tests[i].sourceBa.serialNumber || '-')
        doc.text(112, beginSecondTextHeight + 2 * tableLineHeight, this.tests[i].sourceBa.initialActivity || '-')
        doc.text(112, beginSecondTextHeight + 3 * tableLineHeight, moment(this.tests[i].sourceBa.initialActivityDate).format('DD/MM/YYYY') || '-')
        doc.text(112, beginSecondTextHeight + 4 * tableLineHeight, calculatedBaActivity.toFixed(2).toString().replace('.', ',') || '-')
      }

      i = this.tests.length - 1
      while (!this.tests[i].measureCs && i > 1) {
        i--
      }
      if (this.tests[i].sourceCs) {
        let tCs = new Date() - new Date(this.tests[i].sourceCs.initialActivityDate)
        let calculatedCsActivity = this.tests[i].sourceCs.initialActivity * Math.exp(-(0.6931471806 * tCs / 1000 / 60 / 60) / 264289.2)

        doc.text(139, beginSecondTextHeight + tableLineHeight, this.tests[i].sourceCs.serialNumber || '-')
        doc.text(139, beginSecondTextHeight + 2 * tableLineHeight, this.tests[i].sourceCs.initialActivity || '-')
        doc.text(139, beginSecondTextHeight + 3 * tableLineHeight, moment(this.tests[i].sourceCs.initialActivityDate).format('DD/MM/YYYY') || '-')
        doc.text(139, beginSecondTextHeight + 4 * tableLineHeight, calculatedCsActivity.toFixed(2).toString().replace('.', ',') || '-')
      }

      i = this.tests.length - 1
      while (!this.tests[i].sourceCs.sourceCsOnMostUsedRadioisotope && i > 1) {
        i--
      }
      if (this.tests[i].sourceCsOnMostUsedRadioisotope) {
        let tCsOnMostUsedRadioisotope = new Date() - new Date(this.tests[i].sourceCsOnMostUsedRadioisotope.initialActivityDate)
        let calculatedCsOnMostUsedRadioisotopeActivity = this.tests[i].sourceCsOnMostUsedRadioisotope.initialActivity * Math.exp(-(0.6931471806 * tCsOnMostUsedRadioisotope / 1000 / 60 / 60) / 264289.2)

        doc.text(166, beginSecondTextHeight + tableLineHeight, this.tests[i].sourceCsOnMostUsedRadioisotope.serialNumber || '-')
        doc.text(166, beginSecondTextHeight + 2 * tableLineHeight, this.tests[i].sourceCsOnMostUsedRadioisotope.initialActivity || '-')
        doc.text(166, beginSecondTextHeight + 3 * tableLineHeight, moment(this.tests[i].sourceCsOnMostUsedRadioisotope.initialActivityDate).format('DD/MM/YYYY') || '-')
        doc.text(166, beginSecondTextHeight + 4 * tableLineHeight, calculatedCsOnMostUsedRadioisotopeActivity.toFixed(2).toString().replace('.', ',') || '-')
      }

      doc.roundedRect(10, beginSecondRoundedRect, 190, 42, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')

      doc.setFontSize(8)
      doc.setFontStyle('bold')
      doc.text(15, beginThirdRoundedRect + 5 + 8, 'Data')
      doc.text(30, beginThirdRoundedRect + 5 + 4, 'Auto-zero')
      doc.text(30, beginThirdRoundedRect + 5 + 8, '(mV)')
      doc.text(50, beginThirdRoundedRect + 5 + 4, 'BG')
      doc.text(50, beginThirdRoundedRect + 5 + 8, '(µCi)')
      doc.text(66, beginThirdRoundedRect + 5, 'System Test/')
      doc.text(66, beginThirdRoundedRect + 5 + 4, 'Chamber Voltage')
      doc.text(66, beginThirdRoundedRect + 5 + 8, '(V)')
      doc.text(92, beginThirdRoundedRect + 5 + 4, 'Data')
      doc.text(92, beginThirdRoundedRect + 5 + 8, 'Check')
      doc.text(108, beginThirdRoundedRect + 5 + 8, 'Co(57)')
      doc.text(136, beginThirdRoundedRect + 5, 'Atividade (µCi) e Desvio (%)')
      doc.text(130, beginThirdRoundedRect + 5 + 8, 'Ba(133)')
      doc.text(150, beginThirdRoundedRect + 5 + 8, 'Cs(137)')
      doc.text(170, beginThirdRoundedRect + 5 + 8, 'Cs(137) em ' + this.equipment.mostUsedRadioisotope)

      let j = 0
      doc.setFontSize(8)
      doc.setFontStyle('normal')
      for (let i = 0; i < this.tests.length; i++) {
        if (new Date(this.tests[i].date).getMonth() === this.filterMonth.value && new Date(this.tests[i].date).getFullYear() === parseFloat(this.filterDate)) {
          doc.text(15, beginThirdTextHeight + 14 + j * 6, moment(this.tests[i].date).format('DD/MM/YY'))
          doc.text(30, beginThirdTextHeight + 14 + j * 6, this.tests[i].autoZero + ' (' + this.tests[i].autoZeroStatus + ')')
          doc.text(48, beginThirdTextHeight + 14 + j * 6, this.tests[i].bG + ' (' + this.tests[i].bGStatus + ')')
          doc.text(68, beginThirdTextHeight + 14 + j * 6, this.tests[i].systemTest + ' (' + this.tests[i].systemTestStatus + ')')
          doc.text(92, beginThirdTextHeight + 14 + j * 6, this.tests[i].dataCheckStatus)
          if (!isNaN(parseFloat(this.tests[i].sourceCoActivityDeviation))) {
            doc.text(108, beginThirdTextHeight + 14 + j * 6, this.tests[i].sourceCoActivity + ' (' + parseFloat(this.tests[i].sourceCoActivityDeviation).toFixed(2) + '%)')
          } else {
            doc.text(108, beginThirdTextHeight + 14 + j * 6, this.tests[i].sourceCoActivity)
          }
          if (!isNaN(parseFloat(this.tests[i].sourceBaActivityDeviation))) {
            doc.text(130, beginThirdTextHeight + 14 + j * 6, this.tests[i].sourceBaActivity + ' (' + parseFloat(this.tests[i].sourceBaActivityDeviation).toFixed(2) + '%)')
          } else {
            doc.text(130, beginThirdTextHeight + 14 + j * 6, this.tests[i].sourceBaActivity)
          }
          if (!isNaN(parseFloat(this.tests[i].sourceCsActivityDeviation))) {
            doc.text(150, beginThirdTextHeight + 14 + j * 6, this.tests[i].sourceCsActivity + ' (' + parseFloat(this.tests[i].sourceCsActivityDeviation).toFixed(2) + '%)')
          } else {
            doc.text(150, beginThirdTextHeight + 14 + j * 6, this.tests[i].sourceCsActivity)
          }
          if (!isNaN(parseFloat(this.tests[i].sourceCsOnMostUsedRadioisotopeActivityDeviation))) {
            doc.text(170, beginThirdTextHeight + 14 + j * 6, this.tests[i].sourceCsOnMostUsedRadioisotopeActivity + ' (' + parseFloat(this.tests[i].sourceCsOnMostUsedRadioisotopeActivityDeviation).toFixed(2) + '%)')
          } else {
            doc.text(170, beginThirdTextHeight + 14 + j * 6, this.tests[i].sourceCsOnMostUsedRadioisotopeActivity)
          }
          j++
        }
      }
      doc.roundedRect(10, beginThirdRoundedRect, 190, 15 + j * 6, 2, 2, 'S')
      doc.text(190, 282, '1/1')

      doc.save('Informações ' + this.facility.name + ' - Calibrador de Doses - Teste Diário - ' + this.filterMonth.label + '.pdf')
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

table.hyper-table.small-table > thead > tr > th {
  padding: 12px 12px 0 12px;
  min-width: 100px;
  font-size: 14px;
  vertical-align: bottom !important;
}

.red-span {
  color: red !important;
  font-weight: bolder;
}
</style>
../../../../../../../../services/permissions