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
        <h2>Novo Teste de Geometria</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/' + equipment.type">{{ equipment.type }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id + '/geometry/'">geometria</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">novo</li>
            </ol>
          </nav>
        </div>
        <div class="hyper-card mb-3 col-12 col-md-6 mx-auto">
          <div class="alert alert-danger" v-if="error">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
          </div>
          <div class="form-group">
            <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Radioisótopo</label>
            <v-select v-model="radioisotope.name" :options="radioisotopes"></v-select>
          </div>
          <div class="form-group">
            <label class="col-form-label" for="selectType"><i class="far fa-calendar-alt" aria-hidden="true"></i> Data</label>
            <input type="date" v-model="date" class="form-control">
          </div>
          <div class="form-group">
            <label class="col-form-label" for="selectType"><i class="far fa-user" aria-hidden="true"></i> Responsável</label>
            <v-select v-model="responsible" :options="responsibleOptions"></v-select>
          </div>
        </div>
        <div class="mb-3 text-center hyper-card" v-for="test in tests">
          <div class="row pl-2">
            <div class="col text-left">
              <h4>{{ test.container }}</h4>
            </div>
            <div class="col text-right">
              <button @click="eraseLine(test)" class="btn btn-outline-danger"><i class="fas fa-times" aria-hidden="true"></i></button>
            </div>
          </div>
          <div class="row">
            <div class="col">
            </div>
            <div class="col">
              Atividade Medida (mCi)
            </div>
            <div class="col">
              Fator de Correção
            </div>
            <div class="col">
              Variação (%)
            </div>
          </div>
          <div class="row" v-for="measure in test.measures">
            <div class="col">
              {{ measure.volume }}
            </div>
            <div class="form-group col">
              {{ measure.activity }}
            </div>
            <div class="col">
              {{ measure.correctionFactor }}
            </div>
            <div class="col">
              {{ measure.variation }}
            </div>
          </div>
        </div>
        <div class="mb-3 text-center hyper-card" v-for="test in editableTests">
          <div class="row pl-2">
            <div class="col text-left">
              <h4>{{ test.container }}</h4>
            </div>
            <div class="col text-right">
              <button @click="eraseEditableLine(test)" class="btn btn-outline-danger"><i class="fas fa-times" aria-hidden="true"></i></button>
            </div>
          </div>
          <div class="row">
            <div class="col">
            </div>
            <div class="col">
              Atividade Medida (mCi)
            </div>
          </div>
          <div class="row" v-for="measure in test.measures">
            <div class="col">
              {{ measure.volume }}
            </div>
            <div class="form-group col">
              <input type="number" v-model="measure.activity" class="form-control">
            </div>
          </div>
          <button @click="saveContainer(test)" class="btn btn-outline-success">Salvar</button>
        </div>
          <div class="hyper-card">
            <h5>Adicionar novo recipiente:</h5>
            <br>
            <div class="row">
              <div class="col-12 col-md-11">
                <div class="form-group">
                  <label class="col-form-label" for="formName"><i class="far fa-calendar-alt" aria-hidden="true"></i> Recipiente</label>
                  <v-select v-model="test.container" :options="containers"></v-select>
                </div>
              </div>
              <div class="col-12 col-md-1 align-middle pt-4 mt-2 text-right">
                <button @click="addContainer(test.container)" class="btn btn-outline-metalic-seaweed"><i class="fa fa-check" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
          <br>
          <div class="col-12 col-md-6 mx-auto">
            <button class="btn btn-success btn-block" @click="register()">Finalizar</button>
          </div>
          <br>
          <br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import axios from 'axios'
import moment from 'moment'
import { testPoints, generateDocument } from './TestAlgorithm'

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
        container: '',
        date: ''
      },
      tests: [],
      editableTests: [],
      equipment: {
        _id: ''
      },
      radioisotopes: [
        {label: 'F(18)', value: 'F(18)', name: 'F(18)', halfLife: 6586.26},
        {label: 'Ga(68)', value: 'Ga(68)', name: 'Ga(68)', halfLife: 4062.6},
        {label: 'I(131)', value: 'I(131)', name: 'I(131)', halfLife: 692902.08},
        {label: 'Tc(99m)', value: 'Tc(99m)', name: 'Tc(99m)', halfLife: 21624.12}
      ],
      containers: [
        'Seringa 1ml', 'Seringa 3ml', 'Seringa 5ml', 'Seringa 10ml', 'Seringa 20ml', 'Frasco 20ml', 'Frasco 45ml', 'Transferência Frasco-Seringa'
      ],
      loading: false,
      conclusion: 'satisfatório',
      facility: {},
      error: '',
      permission: permission,
      responsible: { name: '', _id: '' },
      responsibleOptions: []
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
      testPoints(this.tests, this.conclusion)

      var credentials = {
        radioisotope: { name: this.radioisotope.name.value, halfLife: this.radioisotope.name.halfLife },
        tests: this.tests,
        equipment: { _id: this.$route.params.id },
        date: this.date,
        conclusion: this.conclusion,
        responsible: { name: this.responsible.name, _id: this.responsible._id }
      }

      generateDocument(credentials, this.facility, this.equipment, this.responsible).then(() => {
        auth.registerDoseCalibratorGeometryTest(this, credentials, '/equipments/doseCalibrator/' + this.equipment._id + '/geometry')
      })
    },

    average (array) {
      let sum = 0
      for (let i = 0; i < array.length - 1; i++) {
        sum += parseFloat(array[i + 1])
      }
      return sum / (array.length - 1)
    },

    saveContainer (test) {
      testPoints(test, this.conclusion)
      this.tests.push(test)
      let idx = this.editableTests.indexOf(test)
      if (idx !== -1) {
        this.editableTests.splice(idx, 1)
      }
      testPoints(this.tests, this.conclusion)
    },

    addContainer () {
      if (this.test.container === 'Seringa 1ml') {
        this.test.measures = [
          { volume: '0,2 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '0,4 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '0,6 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '0,8 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '1,0 ml', activity: '', correctionFactor: '', variation: '' }
        ]
      } else if (this.test.container === 'Seringa 3ml') {
        this.test.measures = [
          { volume: '1,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '1,5 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '2,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '2,5 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '3,0 ml', activity: '', correctionFactor: '', variation: '' }
        ]
      } else if (this.test.container === 'Seringa 5ml') {
        this.test.measures = [
          { volume: '1,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '2,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '3,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '4,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '5,0 ml', activity: '', correctionFactor: '', variation: '' }
        ]
      } else if (this.test.container === 'Seringa 10ml') {
        this.test.measures = [
          { volume: '1,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '2,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '3,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '4,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '5,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '6,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '7,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '8,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '9,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '10,0 ml', activity: '', correctionFactor: '', variation: '' }
        ]
      } else if (this.test.container === 'Seringa 20ml') {
        this.test.measures = [
          { volume: '1,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '2,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '4,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '6,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '8,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '10,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '12,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '14,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '16,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '18,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '20,0 ml', activity: '', correctionFactor: '', variation: '' }
        ]
      } else if (this.test.container === 'Frasco 20ml') {
        this.test.measures = [
          { volume: '4,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '6,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '8,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '10,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '20,0 ml', activity: '', correctionFactor: '', variation: '' }
        ]
      } else if (this.test.container === 'Frasco 45ml') {
        this.test.measures = [
          { volume: '5,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '10,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '15,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '20,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '25,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '30,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '35,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '40,0 ml', activity: '', correctionFactor: '', variation: '' },
          { volume: '45,0 ml', activity: '', correctionFactor: '', variation: '' }
        ]
      } else if (this.test.container === 'Transferência Frasco-Seringa') {
        this.test.measures = [
          { volume: 'Atividade - Rejeito na Seringa', activity: '', correctionFactor: '', variation: '' },
          { volume: 'Atividade no Frasco', activity: '', correctionFactor: '', variation: '' }
        ]
      }
      this.editableTests.push(this.test)
      this.test = { date: '', activity: '' }
    },
    eraseEditableLine (test) {
      let idx = this.editableTests.indexOf(test)
      if (idx !== -1) {
        this.editableTests.splice(idx, 1)
      }
      testPoints(this.tests, this.conclusion)
    },
    eraseLine (test) {
      let idx = this.tests.indexOf(test)
      if (idx !== -1) {
        this.tests.splice(idx, 1)
      }
      testPoints(this.tests, this.conclusion)
    }
  }
}
</script>../../../../../../../../services/permissions