<template>
  <div class="main">
    <div class="center">
      <div class="col-12" enctype="multipart/form-data">
        <h2>Novo Teste de Linearidade</h2>
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
              <li class="breadcrumb-item active" aria-current="page">novo</li>
            </ol>
          </nav>
        </div>
        <div class="hyper-card mb-3 col-12 col-md-6 mx-auto">
          <div class="alert alert-danger" v-if="error">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ error }}
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Radioisótopo</label>
              <v-select v-model="radioisotope.name" :options="radioisotopes"></v-select>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="far fa-calendar-alt" aria-hidden="true"></i> Data</label>
              <input type="date" v-model="date" class="form-control">
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="far fa-user" aria-hidden="true"></i> Responsável</label>
              <v-select v-model="responsible" :options="responsibleOptions"></v-select>
            </div>
          </div>
        </div>
        <div class="mb-3 text-center">
          <div class="col-12 col-md-6 mx-auto p-0">
            <table class="table table-fluid table-responsive hyper-table col-12 mx-auto" v-if="tests.length > 0">
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
              <div class="col-12 col-md-2 align-middle pt-4 mt-2">
                <button @click="confirmLine()" class="btn btn-outline-metalic-seaweed"><i class="fa fa-check" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 mx-auto">
          <button class="btn btn-success btn-block" @click="register()">Salvar</button>
        </div>
        <br>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import axios from 'axios'
import moment from 'moment'

export default {
  data () {
    var now = new Date()
    now = new Date(moment.tz(now, 'America/Sao_Paulo'))
    now = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
    return {
      status: '',
      radioisotope: {
        name: '',
        halfLife: ''
      },
      date: now,
      test: {
        date: '',
        activity: ''
      },
      tests: [],
      equipment: {
        _id: ''
      },
      radioisotopes: [
        {label: 'F(18)', value: 'F(18)', halfLife: 6586.26},
        {label: 'Ga(68)', value: 'Ga(68)', halfLife: 4062.6},
        {label: 'I(131)', value: 'I(131)', halfLife: 692902.08},
        {label: 'Tc(99m)', value: 'Tc(99m)', halfLife: 21624.12}
      ],
      conclusion: 'satisfatório',
      facility: {},
      responsible: { label: '', name: '' },
      responsibleOptions: [ { name: '' } ],
      permission: permission,
      error: ''
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
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

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

    this.currentUser = auth.currentUser()
  },
  methods: {
    register () {
      if (!this.responsible._id) {
        this.error = 'Selecione um responsável'
        return
      }
      this.testPoints(this.tests)

      var doc = {
        status: 'em andamento',
        radioisotope: { name: this.radioisotope.name.value, halfLife: this.radioisotope.name.halfLife },
        tests: this.tests,
        equipment: { _id: this.$route.params.id },
        date: this.date,
        responsible: { _id: this.responsible._id, name: this.responsible.name },
        conclusion: this.conclusion
      }
      auth.registerDoseCalibratorLinearityTest(this, doc, '/equipments/doseCalibrator/' + this.equipment._id + '/linearity/')
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
      let points = []

      for (let i = 0; i < tests.length; i++) {
        tests[i].date = tests[i].date

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
        } else if (i === 0) {
          tests[i].time = 0
          tests[i].calculatedActivity = (result.equation[0] * Math.exp(result.equation[1] * tests[i].time)).toFixed(2)
          tests[i].deviation = (Math.abs(100 - ((tests[i].activity * 100) / (result.equation[0] * Math.exp(result.equation[1] * tests[i].time))))).toFixed(2)
        } else {
          tests[i].time = ((new Date(tests[i].date) - new Date(tests[0].date)) / 60 / 60 / 1000).toFixed(2)
          tests[i].calculatedActivity = (result.equation[0] * Math.exp(result.equation[1] * tests[i].time)).toFixed(2)
          tests[i].deviation = (Math.abs(100 - ((tests[i].activity * 100) / (result.equation[0] * Math.exp(result.equation[1] * tests[i].time))))).toFixed(2)
        }
      }
    }
  }
}
</script>
../../../../../../../../services/permissions