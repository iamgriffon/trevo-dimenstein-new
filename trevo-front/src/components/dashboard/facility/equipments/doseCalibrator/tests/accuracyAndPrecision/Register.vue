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
        <h2>Novo Teste de Exatidão e de Precisão</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/' + equipment.type">{{ equipment.type }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/' + equipment._id">{{ equipment.patrimonialNumber }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id + '/accuracyandprecision/'">exatidão e precisão</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">novo</li>
            </ol>
          </nav>
        </div>
        <div class="hyper-card mb-3">
          <div class="alert alert-danger" v-if="error">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
          </div>
          <div class="form-group mx-3">
            <label class="col-form-label" for="selectType"><i class="far fa-calendar-alt" aria-hidden="true"></i> Data de Execução do Teste</label>
            <input type="date" v-model="date" class="form-control">
          </div>
          <div class="form-group mx-3">
            <label class="col-form-label" for="selectType"><i class="far fa-user" aria-hidden="true"></i> Responsável</label>
            <v-select v-model="responsible" :options="responsibleOptions"></v-select>
          </div>
          <br/>
          <hr/>
          <br/>
          <div class="row mx-3">
            <div class="form-group col px-1 text-right lateral-label">
              <p></p>
            </div>
            <div class="form-group col px-1">
              <p class="mt-2 mb-0">Co(57)</p>
            </div>
            <div class="form-group col px-1">
              <p class="mt-2 mb-0">Ba(133)</p>
            </div>
            <div class="form-group col px-1">
              <p class="mt-2 mb-0">Cs(137)</p>
            </div>
          </div>
          <div class="row mx-3">
            <div class="form-group col px-1 text-right lateral-label">
              <p class="mt-2 mb-0">nº série</p>
            </div>
            <div class="form-group col px-1">
              <v-select v-model="sourceCo" :options="sourcesCoOptions"></v-select>
            </div>
            <div class="form-group col px-1">
              <v-select v-model="sourceBa" :options="sourcesBaOptions"></v-select>
            </div>
            <div class="form-group col px-1">
              <v-select v-model="sourceCs" :options="sourcesCsOptions"></v-select>
            </div>
          </div>
          <div class="row mx-3">
            <div class="form-group col px-1 text-right lateral-label">
              <p></p>
            </div>
            <div class="form-group col px-1">
              <p class="mt-2 mb-0">Atividade (µCi)</p>
            </div>
            <div class="form-group col px-1">
              <p class="mt-2 mb-0">Precisão (%)</p>
            </div>
            <div class="form-group col px-1">
              <p class="mt-2 mb-0">Atividade (µCi)</p>
            </div>
            <div class="form-group col px-1">
              <p class="mt-2 mb-0">Precisão (%)</p>
            </div>
            <div class="form-group col px-1">
              <p class="mt-2 mb-0">Atividade (µCi)</p>
            </div>
            <div class="form-group col px-1">
              <p class="mt-2 mb-0">Precisão (%)</p>
            </div>
          </div>
          <div class="row mx-3" v-for="i in numbers">
            <div class="form-group col px-1 text-right lateral-label">
              <p class="mt-2 mb-0">{{ i }}:</p>
            </div>
            <div class="form-group col px-1">
              <input type="number" v-model="measureCo[i]" class="form-control">
            </div>
            <div class="col px-1">
              <span v-if="precisionCo[i] && !isNaN(precisionCo[i])">{{ precisionCo[i].toFixed(2) + '%' }}</span>
            </div>
            <div class="form-group col px-1">
              <input type="number" v-model="measureBa[i]" class="form-control">
            </div>
            <div class="col px-1">
              <span v-if="precisionBa[i] && !isNaN(precisionBa[i])">{{ precisionBa[i].toFixed(2) + '%' }}</span>
            </div>
            <div class="form-group col px-1">
              <input type="number" v-model="measureCs[i]" class="form-control">
            </div>
            <div class="col px-1">
              <span v-if="precisionCs[i] && !isNaN(precisionCs[i])">{{ precisionCs[i].toFixed(2) + '%' }}</span>
            </div>
          </div>
          <div class="row mx-3">
            <div class="form-group col px-1 text-right lateral-label">
              <p class="mt-2 mb-0">Exatidão:</p>
            </div>
            <div class="form-group col">
              <p class="mt-2 mb-0 text-right mr-5" v-if="accuracyCo && !isNaN(accuracyCo)">{{ accuracyCo + '%' }}</p>
            </div>
            <div class="form-group col">
              <p class="mt-2 mb-0 text-right mr-5" v-if="accuracyBa && !isNaN(accuracyBa)">{{ accuracyBa + '%' }}</p>
            </div>
            <div class="form-group col">
              <p class="mt-2 mb-0 text-right mr-5" v-if="accuracyCs && !isNaN(accuracyCs)">{{ accuracyCs + '%' }}</p>
            </div>
          </div>
        </div>
        <div class="row col-12 col-md-6 mx-auto">
          <button class="btn btn-success btn-block" @click="finishTest()">Finalizar Teste</button>
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
import { testPoints, generateDocument } from './TestAlgorithm'

export default {
  data () {
    var now = new Date()
    now = new Date(moment.tz(now, 'America/Sao_Paulo'))
    now = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
    return {
      date: now,
      loading: false,
      numbers: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
      measureCo: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      measureBa: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      measureCs: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      accuracyCo: '',
      accuracyBa: '',
      accuracyCs: '',
      precisionCo: [],
      precisionBa: [],
      precisionCs: [],
      equipment: {
        _id: ''
      },
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
      facility: {},
      error: '',
      conclusion: 'satisfatório',
      permission: permission,
      responsible: { name: '', _id: '' },
      responsibleOptions: []
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
          if (resp.data.length === 0) {
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
          }
        })
        .catch(error => {
          this.errors = error.data
          this.sources = ''
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
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })
    this.currentUser = auth.currentUser()
  },
  watch: {
    measureCo () {
      testPoints({
        date: this.date,
        sourceCo: {
          _id: this.sourceCo._id,
          equipment: this.sourceCo.equipment,
          initialActivity: this.sourceCo.initialActivity,
          initialActivityDate: this.sourceCo.initialActivityDate,
          radioisotope: this.sourceCo.radioisotope,
          serialNumber: this.sourceCo.serialNumber
        },
        measureCo: this.measureCo,
        accuracyCo: this.accuracyCo,
        precisionCo: this.precisionCo,
        sourceBa: {
          _id: this.sourceBa._id,
          equipment: this.sourceBa.equipment,
          initialActivity: this.sourceBa.initialActivity,
          initialActivityDate: this.sourceBa.initialActivityDate,
          radioisotope: this.sourceBa.radioisotope,
          serialNumber: this.sourceBa.serialNumber
        },
        measureBa: this.measureBa,
        accuracyBa: this.accuracyBa,
        precisionBa: this.precisionBa,
        sourceCs: {
          _id: this.sourceCs._id,
          equipment: this.sourceCs.equipment,
          initialActivity: this.sourceCs.initialActivity,
          initialActivityDate: this.sourceCs.initialActivityDate,
          radioisotope: this.sourceCs.radioisotope,
          serialNumber: this.sourceCs.serialNumber
        },
        measureCs: this.measureCs,
        accuracyCs: this.accuracyCs,
        precisionCs: this.precisionCs,
        conclusion: this.conclusion,
        equipment: { _id: this.$route.params.id },
        responsible: this.responsible
      }).then(result => {
        this.accuracyCo = result.accuracyCo
        this.accuracyBa = result.accuracyBa
        this.accuracyCs = result.accuracyCs
      })
    },
    measureBa () {
      testPoints({
        date: this.date,
        sourceCo: {
          _id: this.sourceCo._id,
          equipment: this.sourceCo.equipment,
          initialActivity: this.sourceCo.initialActivity,
          initialActivityDate: this.sourceCo.initialActivityDate,
          radioisotope: this.sourceCo.radioisotope,
          serialNumber: this.sourceCo.serialNumber
        },
        measureCo: this.measureCo,
        accuracyCo: this.accuracyCo,
        precisionCo: this.precisionCo,
        sourceBa: {
          _id: this.sourceBa._id,
          equipment: this.sourceBa.equipment,
          initialActivity: this.sourceBa.initialActivity,
          initialActivityDate: this.sourceBa.initialActivityDate,
          radioisotope: this.sourceBa.radioisotope,
          serialNumber: this.sourceBa.serialNumber
        },
        measureBa: this.measureBa,
        accuracyBa: this.accuracyBa,
        precisionBa: this.precisionBa,
        sourceCs: {
          _id: this.sourceCs._id,
          equipment: this.sourceCs.equipment,
          initialActivity: this.sourceCs.initialActivity,
          initialActivityDate: this.sourceCs.initialActivityDate,
          radioisotope: this.sourceCs.radioisotope,
          serialNumber: this.sourceCs.serialNumber
        },
        measureCs: this.measureCs,
        accuracyCs: this.accuracyCs,
        precisionCs: this.precisionCs,
        conclusion: this.conclusion,
        equipment: { _id: this.$route.params.id },
        responsible: this.responsible
      }).then(result => {
        this.accuracyCo = result.accuracyCo
        this.accuracyBa = result.accuracyBa
        this.accuracyCs = result.accuracyCs
      })
    },
    measureCs () {
      testPoints({
        date: this.date,
        sourceCo: {
          _id: this.sourceCo._id,
          equipment: this.sourceCo.equipment,
          initialActivity: this.sourceCo.initialActivity,
          initialActivityDate: this.sourceCo.initialActivityDate,
          radioisotope: this.sourceCo.radioisotope,
          serialNumber: this.sourceCo.serialNumber
        },
        measureCo: this.measureCo,
        accuracyCo: this.accuracyCo,
        precisionCo: this.precisionCo,
        sourceBa: {
          _id: this.sourceBa._id,
          equipment: this.sourceBa.equipment,
          initialActivity: this.sourceBa.initialActivity,
          initialActivityDate: this.sourceBa.initialActivityDate,
          radioisotope: this.sourceBa.radioisotope,
          serialNumber: this.sourceBa.serialNumber
        },
        measureBa: this.measureBa,
        accuracyBa: this.accuracyBa,
        precisionBa: this.precisionBa,
        sourceCs: {
          _id: this.sourceCs._id,
          equipment: this.sourceCs.equipment,
          initialActivity: this.sourceCs.initialActivity,
          initialActivityDate: this.sourceCs.initialActivityDate,
          radioisotope: this.sourceCs.radioisotope,
          serialNumber: this.sourceCs.serialNumber
        },
        measureCs: this.measureCs,
        accuracyCs: this.accuracyCs,
        precisionCs: this.precisionCs,
        conclusion: this.conclusion,
        equipment: { _id: this.$route.params.id },
        responsible: this.responsible
      }).then(result => {
        this.accuracyCo = result.accuracyCo
        this.accuracyBa = result.accuracyBa
        this.accuracyCs = result.accuracyCs
      })
    },
    loading () {
      if (this.loading) {
        this.$root.$emit('bv::show::modal', 'modal-center')
      }
    }
  },

  methods: {
    finishTest () {
      if (confirm('Tem certeza que deseja finalizar este teste?')) {
        const test = {
          date: this.date,
          sourceCo: {
            _id: this.sourceCo._id,
            equipment: this.sourceCo.equipment,
            initialActivity: this.sourceCo.initialActivity,
            initialActivityDate: this.sourceCo.initialActivityDate,
            radioisotope: this.sourceCo.radioisotope,
            serialNumber: this.sourceCo.serialNumber
          },
          measureCo: this.measureCo,
          accuracyCo: this.accuracyCo,
          precisionCo: this.precisionCo,
          sourceBa: {
            _id: this.sourceBa._id,
            equipment: this.sourceBa.equipment,
            initialActivity: this.sourceBa.initialActivity,
            initialActivityDate: this.sourceBa.initialActivityDate,
            radioisotope: this.sourceBa.radioisotope,
            serialNumber: this.sourceBa.serialNumber
          },
          measureBa: this.measureBa,
          accuracyBa: this.accuracyBa,
          precisionBa: this.precisionBa,
          sourceCs: {
            _id: this.sourceCs._id,
            equipment: this.sourceCs.equipment,
            initialActivity: this.sourceCs.initialActivity,
            initialActivityDate: this.sourceCs.initialActivityDate,
            radioisotope: this.sourceCs.radioisotope,
            serialNumber: this.sourceCs.serialNumber
          },
          measureCs: this.measureCs,
          accuracyCs: this.accuracyCs,
          precisionCs: this.precisionCs,
          conclusion: this.conclusion,
          equipment: { _id: this.$route.params.id },
          responsible: this.responsible
        }
        this.loading = true
        generateDocument(test, this.facility, this.equipment).then(() => {
          this.loading = false
          auth.registerDoseCalibratorAccuracyAndPrecisionTest(this, test, '/equipments/doseCalibrator/' + this.equipment._id + '/accuracyandprecision')
        })
      }
    }
  }
}
</script>

<style>
.lateral-label {
  max-width: 60px;
}
</style>
../../../../../../../../services/permissions