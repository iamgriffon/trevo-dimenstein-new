<template>
  <div class="main">
    <div class="center">
      <div class="col-12" enctype="multipart/form-data">
        <h2>Novo Teste Diário</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/' + equipment.type">{{ equipment.type }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id + '/daily/'">diário</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">novo</li>
            </ol>
          </nav>
        </div>
        <div class="hyper-card col-12 col-md-6 mb-3 mx-auto">
          <div class="form-group">
            <label class="col-form-label" for="selectType"><i class="far fa-calendar-alt" aria-hidden="true"></i> Data</label>
            <input type="date" v-model="date" class="form-control">
          </div>
          <div class="form-group">
            <label class="col-form-label" for="selectType"><i class="far fa-user" aria-hidden="true"></i> Responsável</label>
            <v-select v-model="responsible" :options="responsibleOptions"></v-select>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fas fa-sliders-h"></i> Auto-zero (mV)</label>
              <small class="text-muted">opcional</small>
              <input type="number" v-model="autoZero" class="form-control">
            </div>
            <div class="form-group col row my-auto">
              <label class="radio-inline col pt-3">
                <input type="radio" name="autoZeroStatus" value="OK" v-model="autoZeroStatus"> OK
              </label>
              <label class="radio-inline col pt-3">
                <input type="radio" name="autoZeroStatus" value="ERRO" v-model="autoZeroStatus"> ERRO
              </label>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fas fa-asterisk" aria-hidden="true"></i> BG (µCi)</label>
              <small class="text-muted">opcional</small>
              <input type="number" v-model="bG" class="form-control">
            </div>
            <div class="form-group col row my-auto">
              <label class="radio-inline col pt-3">
                <input type="radio" name="bGStatus" value="OK" v-model="bGStatus"> OK
              </label>
              <label class="radio-inline col pt-3">
                <input type="radio" name="bGStatus" value="High" v-model="bGStatus"> High
              </label>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fas fa-sliders-h"></i> System Test/ Chamber Voltage (V)</label>
              <small class="text-muted">opcional</small>
              <input type="number" v-model="systemTest" class="form-control">
            </div>
            <div class="form-group col row my-auto">
              <label class="radio-inline col pt-3">
                <input type="radio" name="systemTestStatus" value="OK" v-model="systemTestStatus"> OK
              </label>
              <label class="radio-inline col pt-3">
                <input type="radio" name="systemTestStatus" value="ERRO" v-model="systemTestStatus"> ERRO
              </label>
            </div>
          </div>
          <div class="row">
            <div class="form-group col row my-auto">
              <div class="form-group col">
                <label class="col-form-label" for="selectType"><i class="fas fa-sliders-h"></i> Data Check</label>
              </div>
              <label class="radio-inline col pt-1">
                <input type="radio" name="dataCheckStatus" value="OK" v-model="dataCheckStatus"> OK
              </label>
              <label class="radio-inline col pt-1">
                <input type="radio" name="dataCheckStatus" value="ERRO" v-model="dataCheckStatus"> ERRO
              </label>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Co(57) (µCi)</label>
              <small class="text-muted">opcional</small>
              <div class="row">
                <v-select :class="'mx-3'" v-model="sourceCo" :options="sourcesCoOptions"></v-select>
                <input type="number" v-model="sourceCoActivity" class="form-control col mr-3">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Ba(133) (µCi)</label>
              <small class="text-muted">opcional</small>
              <div class="row">
                <v-select :class="'mx-3'" v-model="sourceBa" :options="sourcesBaOptions"></v-select>
                <input type="number" v-model="sourceBaActivity" class="form-control col mr-3">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Cs(137) (µCi)</label>
              <small class="text-muted">opcional</small>
              <div class="row">
                <v-select :class="'mx-3'" v-model="sourceCs" :options="sourcesCsOptions"></v-select>
                <input type="number" v-model="sourceCsActivity" class="form-control col mr-3">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Cs(137) na fonte {{ equipment.mostUsedRadioisotope }} (µCi)</label>
              <small class="text-muted">opcional</small>
              <div class="row">
                <v-select :class="'mx-3'" v-model="sourceCsOnMostUsedRadioisotope" :options="sourcesCsOnMostUsedRadioisotopeOptions"></v-select>
                <input type="number" v-model="sourceCsOnMostUsedRadioisotopeActivity" class="form-control col mr-3">
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
import moment from 'moment-timezone'

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
      autoZero: '',
      autoZeroStatus: 'OK',
      bG: '',
      bGStatus: 'OK',
      systemTest: '',
      systemTestStatus: 'OK',
      dataCheckStatus: 'OK',
      sourcesCo: [],
      sourcesCoOptions: [],
      sourceCo: { serialNumber: '' },
      sourceCoActivity: '',
      sourcesBa: [],
      sourcesBaOptions: [],
      sourceBa: { serialNumber: '' },
      sourceBaActivity: '',
      sourcesCs: [],
      sourcesCsOptions: [],
      sourceCs: { serialNumber: '' },
      sourceCsActivity: '',
      sourcesCsOnMostUsedRadioisotopeOptions: [],
      sourcesCsOnMostUsedRadioisotope: { serialNumber: '' },
      sourceCsOnMostUsedRadioisotopeActivity: '',
      equipment: {
        _id: ''
      },
      permission: permission,
      facility: {},
      responsibleOptions: [],
      responsible: { name: '' },
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

        axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.id + '/doseCalibratorSources/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
        .then(resp => {
          if (response.data.length === 0) {
            this.errors = 'Nenhum resultado encontrado'
            this.sources = ''
          } else {
            this.sourcesCo = resp.data.filter(source => source.radioisotope === 'Co(57)')
            for (let i = 0; i < this.sourcesCo.length; i++) {
              this.sourcesCoOptions.push({
                label: this.sourcesCo[i].serialNumber,
                value: this.sourcesCo[i].serialNumber,
                _id: this.sourcesCo[i]._id,
                equipment: this.sourcesCo[i].equipment,
                initialActivity: this.sourcesCo[i].initialActivity,
                initialActivityDate: this.sourcesCo[i].initialActivityDate,
                radioisotope: this.sourcesCo[i].radioisotope,
                serialNumber: this.sourcesCo[i].serialNumber
              })
            }
            this.sourceCo = this.sourcesCoOptions[this.sourcesCoOptions.length - 1]

            this.sourcesBa = resp.data.filter(source => source.radioisotope === 'Ba(133)')
            for (let i = 0; i < this.sourcesBa.length; i++) {
              this.sourcesBaOptions.push({
                label: this.sourcesBa[i].serialNumber,
                value: this.sourcesBa[i].serialNumber,
                _id: this.sourcesBa[i]._id,
                equipment: this.sourcesBa[i].equipment,
                initialActivity: this.sourcesBa[i].initialActivity,
                initialActivityDate: this.sourcesBa[i].initialActivityDate,
                radioisotope: this.sourcesBa[i].radioisotope,
                serialNumber: this.sourcesBa[i].serialNumber
              })
            }
            this.sourceBa = this.sourcesBaOptions[this.sourcesBaOptions.length - 1]

            this.sourcesCs = resp.data.filter(source => source.radioisotope === 'Cs(137)')
            for (let i = 0; i < this.sourcesCs.length; i++) {
              this.sourcesCsOptions.push({
                label: this.sourcesCs[i].serialNumber,
                value: this.sourcesCs[i].serialNumber,
                _id: this.sourcesCs[i]._id,
                equipment: this.sourcesCs[i].equipment,
                initialActivity: this.sourcesCs[i].initialActivity,
                initialActivityDate: this.sourcesCs[i].initialActivityDate,
                radioisotope: this.sourcesCs[i].radioisotope,
                serialNumber: this.sourcesCs[i].serialNumber
              })
            }
            this.sourceCs = this.sourcesCsOptions[this.sourcesCsOptions.length - 1]

            this.sourcesCsOnMostUsedRadioisotope = resp.data.filter(source => source.radioisotope.includes('Cs(137) medido em'))
            for (let i = 0; i < this.sourcesCsOnMostUsedRadioisotope.length; i++) {
              this.sourcesCsOnMostUsedRadioisotopeOptions.push({
                label: this.sourcesCsOnMostUsedRadioisotope[i].serialNumber,
                value: this.sourcesCsOnMostUsedRadioisotope[i].serialNumber,
                _id: this.sourcesCsOnMostUsedRadioisotope[i]._id,
                equipment: this.sourcesCsOnMostUsedRadioisotope[i].equipment,
                initialActivity: this.sourcesCsOnMostUsedRadioisotope[i].initialActivity,
                initialActivityDate: this.sourcesCsOnMostUsedRadioisotope[i].initialActivityDate,
                radioisotope: this.sourcesCsOnMostUsedRadioisotope[i].radioisotope,
                serialNumber: this.sourcesCsOnMostUsedRadioisotope[i].serialNumber
              })
            }
            this.sourceCsOnMostUsedRadioisotope = this.sourcesCsOnMostUsedRadioisotopeOptions[this.sourcesCsOnMostUsedRadioisotopeOptions.length - 1]

            if (!this.sourceCo || !this.sourceBa || !this.sourceCs || !this.sourceCsOnMostUsedRadioisotope) {
              alert('É necessário adicionar as quatro fontes para que o teste diário seja realizado.')
            }
          }
        })
        .catch(error => {
          this.errors = error.data
          this.sources = ''
        })
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

    const currentUser = auth.currentUser()
    this.currentUser = currentUser

    axios.get(auth.apiUrl() + 'users/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.responsibleOptions = []
        this.responsibleOptions.unshift({ label: currentUser.name, name: currentUser.name, _id: currentUser.id })
        this.responsible = { label: currentUser.name, name: currentUser.name, _id: currentUser.id }
      } else {
        let responseUsers = response.data.filter(user => { return user.type === 'rad fisico' })
        this.responsibleOptions = responseUsers.map(user => { return { label: user.name, name: user.name, _id: user._id } })
        this.responsibleOptions.unshift({ label: currentUser.name, name: currentUser.name, _id: currentUser.id })
        this.responsible = { label: currentUser.name, name: currentUser.name, _id: currentUser.id }
      }
    })
    .catch(error => {
      this.errors = error.data
      this.responsibleOptions = []
      this.responsibleOptions.unshift({ label: currentUser.name, name: currentUser.name, _id: currentUser.id })
      this.responsible = { label: currentUser.name, name: currentUser.name, _id: currentUser.id }
    })
  },
  methods: {
    register () {
      this.testPoints()

      var credentials = {
        date: this.date,
        autoZero: this.autoZero,
        autoZeroStatus: this.autoZeroStatus,
        bG: this.bG,
        bGStatus: this.bGStatus,
        systemTest: this.systemTest,
        systemTestStatus: this.systemTestStatus,
        dataCheckStatus: this.dataCheckStatus,
        sourceCo: {
          _id: this.sourceCo._id,
          equipment: this.sourceCo.equipment,
          initialActivity: this.sourceCo.initialActivity,
          initialActivityDate: this.sourceCo.initialActivityDate,
          radioisotope: this.sourceCo.radioisotope,
          serialNumber: this.sourceCo.serialNumber
        },
        sourceCoActivity: this.sourceCoActivity,
        sourceCoActivityDeviation: this.sourceCoActivityDeviation,
        sourceBa: {
          _id: this.sourceBa._id,
          equipment: this.sourceBa.equipment,
          initialActivity: this.sourceBa.initialActivity,
          initialActivityDate: this.sourceBa.initialActivityDate,
          radioisotope: this.sourceBa.radioisotope,
          serialNumber: this.sourceBa.serialNumber
        },
        sourceBaActivity: this.sourceBaActivity,
        sourceBaActivityDeviation: this.sourceBaActivityDeviation,
        sourceCs: {
          _id: this.sourceCs._id,
          equipment: this.sourceCs.equipment,
          initialActivity: this.sourceCs.initialActivity,
          initialActivityDate: this.sourceCs.initialActivityDate,
          radioisotope: this.sourceCs.radioisotope,
          serialNumber: this.sourceCs.serialNumber
        },
        sourceCsActivity: this.sourceCsActivity,
        sourceCsActivityDeviation: this.sourceCsActivityDeviation,
        sourceCsOnMostUsedRadioisotope: {
          _id: this.sourceCsOnMostUsedRadioisotope._id,
          equipment: this.sourceCsOnMostUsedRadioisotope.equipment,
          initialActivity: this.sourceCsOnMostUsedRadioisotope.initialActivity,
          initialActivityDate: this.sourceCsOnMostUsedRadioisotope.initialActivityDate,
          radioisotope: this.sourceCsOnMostUsedRadioisotope.radioisotope,
          serialNumber: this.sourceCsOnMostUsedRadioisotope.serialNumber
        },
        sourceCsOnMostUsedRadioisotopeActivity: this.sourceCsOnMostUsedRadioisotopeActivity,
        sourceCsOnMostUsedRadioisotopeActivityDeviation: this.sourceCsOnMostUsedRadioisotopeActivityDeviation,

        equipment: { _id: this.equipment._id },
        responsible: { name: this.responsible.name, _id: this.responsible._id }
      }
      auth.registerDoseCalibratorDailyTest(this, credentials, '/equipments/doseCalibrator/' + this.equipment._id + '/daily/' + new Date().getFullYear())
    },

    testPoints () {
      let tCo = new Date(this.date) - new Date(this.sourceCo.initialActivityDate)
      let calculatedCoActivity = this.sourceCo.initialActivity * Math.exp(-(0.6931471806 * tCo / 1000 / 60 / 60) / 6522.96)

      let tBa = new Date(this.date) - new Date(this.sourceBa.initialActivityDate)
      let calculatedBaActivity = this.sourceBa.initialActivity * Math.exp(-(0.6931471806 * tBa / 1000 / 60 / 60) / 92067.6)

      let tCs = new Date(this.date) - new Date(this.sourceCs.initialActivityDate)
      let calculatedCsActivity = this.sourceCs.initialActivity * Math.exp(-(0.6931471806 * tCs / 1000 / 60 / 60) / 264289.2)

      let tCsOnMostUsedRadioisotope = new Date(this.date) - new Date(this.sourceCsOnMostUsedRadioisotope.initialActivityDate)
      let calculatedCsOnMostUsedRadioisotopeActivity = this.sourceCsOnMostUsedRadioisotope.initialActivity * Math.exp(-(0.6931471806 * tCsOnMostUsedRadioisotope / 1000 / 60 / 60) / 264289.2)

      if (this.sourceCoActivity > 0) {
        this.sourceCoActivityDeviation = (100 * this.sourceCoActivity / calculatedCoActivity) - 100
      }
      if (this.sourceBaActivity > 0) {
        this.sourceBaActivityDeviation = (100 * this.sourceBaActivity / calculatedBaActivity) - 100
      }
      if (this.sourceCsActivity > 0) {
        this.sourceCsActivityDeviation = (100 * this.sourceCsActivity / calculatedCsActivity) - 100
      }
      if (this.sourceCsOnMostUsedRadioisotopeActivity) {
        this.sourceCsOnMostUsedRadioisotopeActivityDeviation = (100 * this.sourceCsOnMostUsedRadioisotopeActivity / calculatedCsOnMostUsedRadioisotopeActivity) - 100
      }
    }
  }
}
</script>
../../../../../../../../services/permissions