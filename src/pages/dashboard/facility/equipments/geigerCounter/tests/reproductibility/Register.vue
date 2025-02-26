<template>
  <div class="main">
    <div class="center">
      <div class="col-12" enctype="multipart/form-data">
        <h2>Novo Teste de Reprodutibilidade</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/' + equipment.type">{{ equipment.type }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/geigerCounter/' + equipment._id + '/reproductibility/'">reprodutibilidade</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">novo</li>
            </ol>
          </nav>
        </div>
        <div class="hyper-card mb-3">
          <div class="alert alert-danger" v-if="error">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react"></i> Sonda do Teste</label>
              <v-select v-model="probe" :options="probes"></v-select>
            </div>
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react"></i> Escala</label>
              <v-select v-model="scale" :options="scales"></v-select>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="far fa-calendar-alt" aria-hidden="true"></i> Data</label>
              <input type="date" v-model="date" class="form-control">
            </div>
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="far fa-calendar-alt" aria-hidden="true"></i> Mês</label>
              <v-select :options="monthOptions" v-model="month"></v-select>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="far fa-user" aria-hidden="true"></i> Responsável</label>
              <v-select v-model="responsible" :options="responsibleOptions"></v-select>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Fonte de Material Radioativo</label>
              <input type="text" v-model="radioactiveSource" class="form-control">
            </div>
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Número de Série da Fonte de Material Radioativo</label>
              <input type="text" v-model="radioactiveSourceSerialNumber" class="form-control">
            </div>
          </div>
        </div>
        <div class="mb-3 text-center">
          <div class="hyper-card">
            <div class="row col">
              <h3>Informações</h3>
            </div>
            <div class="row">
              <div class="form-group col text-left">
                <label class="radio-inline col pt-1">
                  <input type="radio" name="dataCheckStatus" value="ok" v-model="observationType"> Realizar teste
                </label>
                <label class="radio-inline col pt-1">
                  <input type="radio" name="dataCheckStatus" value="calibration" v-model="observationType"> Equipamento enviado para calibração
                </label>
                <label class="radio-inline col pt-1">
                  <input type="radio" name="dataCheckStatus" value="maintenance" v-model="observationType"> Equipamento enviado para manutenção
                </label>
              </div>
              <div class="row col">
                <div class="form-group col-12" v-if="observationType && observationType !== 'ok'">
                  <small class="col-form-label text-muted" for="formName">adicionar uma observação (limite de caracteres: 40)</small>
                  <textarea rows="3" class="form-control" v-model="observationText" maxlength="40"></textarea>
                </div>
              </div>
            </div>
          </div>
          <br>
          <div class="hyper-card" v-if="observationType === 'ok'">
            <div class="row col">
              <div class="form-group col-3 px-1">
              </div>
              <div class="form-group col-9 px-1">
                <p class="mt-2 mb-0">Medidas ({{ scale }})</p>
              </div>
            </div>
            <div class="row col" v-for="i in numbers">
              <div class="form-group col-3 px-1 text-right lateral-label">
                <p class="mt-2 mb-0">{{ i }}:</p>
              </div>
              <div class="form-group col-9 px-1">
                <input type="number" v-model="measures[i]" class="form-control">
              </div>
            </div>
            <div class="row">
              <div class="form-group col-3 px-1 text-right lateral-label">
                <p class="mt-2 mb-0">Média:</p>
              </div>
              <div class="form-group col-9 px-1">
                <p class="mt-2 mb-0">{{ averageVal }}</p>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-3 px-1 text-right lateral-label">
                <p class="mt-2 mb-0">Desvio Padrão:</p>
              </div>
              <div class="form-group col-9 px-1">
                <p class="mt-2 mb-0">{{ standardDeviationVal }}</p>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-3 px-1 text-right lateral-label">
                <p class="mt-2 mb-0">Cálculo Variacional:</p>
              </div>
              <div class="form-group col-9 px-1">
                <p class="mt-2 mb-0">{{ variation }}</p>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-3 px-1 text-right lateral-label">
                <p class="mt-2 mb-0">Resultado:</p>
              </div>
              <div class="form-group col-9 px-1">
                <p class="mt-2 mb-0">{{ conclusion }}</p>
              </div>
            </div>
          </div>
          <div class="hyper-card mt-4">
            <div class="row col">
              <h3>Observações</h3>
            </div>
            <div class="row col text-left">
              <label class="radio-inline col pt-1">
                <input type="checkbox" name="dataCheckStatus" v-model="observationBug"> Equipamento apresentando algum defeito durante o teste
              </label>
            </div>
            <div class="row col">
              <div class="form-group col-12" v-if="observationBug">
                <small class="col-form-label text-muted" for="formName">descreva o defeito apresentado (limite de caracteres: 75)</small>
                <textarea rows="3" class="form-control" v-model="observations" maxlength="75"></textarea>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-success btn-block" @click="register()">Salvar</button>
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
    var months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    var actualMonth = months[now.getMonth()]
    now = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
    return {
      permission: permission,
      status: '',
      numbers: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
      measures: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      date: now,
      month: actualMonth,
      monthOptions: months,
      probes: [],
      probe: '',
      averageVal: 0,
      standardDeviationVal: 0,
      variation: 0,
      equipment: {
        _id: ''
      },
      conclusion: 'insatisfatório',
      facility: {},
      scales: [],
      scale: '',
      observationType: '',
      observationText: '',
      observationBug: false,
      observations: '',
      radioactiveSource: '',
      radioactiveSourceSerialNumber: '',
      responsibleOptions: [],
      reponsible: { _id: '', name: '' },
      error: ''
    }
  },

  watch: {
    probe: function (val, oldVal) {
      if (val === 'Exposição') {
        this.scales = [ 'mR/h', 'µR/h', 'mSv/h', 'µSv/h' ]
      } else if (val === 'Contaminação') {
        this.scales = [ 'CPM', 'KCPM' ]
      }
    },
    measures () {
      this.testPoints()
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

        if (response.data.probe === 'Exposição e Contaminação') {
          this.probes = ['Exposição', 'Contaminação']
        } else {
          this.probes = response.data.probe
          this.probe = response.data.probe
        }

        axios.get(auth.apiUrl() + 'facility/' + response.data.facility._id, {headers: {Authorization: 'Bearer ' + auth.getToken()}}).then(resp => {
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
  methods: {
    register () {
      this.testPoints()

      if (this.scale === '') {
        alert('Selecione uma escala')
      } else {
        var credentials = {
          date: this.date,
          month: this.month,
          measures: this.measures,
          average: this.averageVal,
          standardDeviation: this.standardDeviationVal,
          variation: this.variation,
          observationType: this.observationType,
          observationText: this.observationText,
          observationBug: this.observationBug,
          observations: this.observations,
          radioactiveSource: this.radioactiveSource,
          radioactiveSourceSerialNumber: this.radioactiveSourceSerialNumber,
          probe: this.probe,
          scale: this.scale,
          equipment: { _id: this.$route.params.id },
          responsible: { name: this.responsible.name, _id: this.responsible.id },
          conclusion: this.conclusion
        }
        auth.registerGeigerCounterReproductibilityTest(this, credentials, '/equipments/geigerCounter/' + this.equipment._id + '/reproductibility/')
      }
    },

    testPoints () {
      if (this.observationType === 'ok') {
        this.averageVal = this.average(this.measures)
        this.standardDeviationVal = this.standardDeviation(this.measures)
        this.variation = (this.standardDeviationVal / this.averageVal) * 100
        if (this.variation > 20) {
          this.conclusion = 'insatisfatório'
        } else {
          this.conclusion = 'satisfatório'
        }
      } else if (this.observationType === 'calibration') {
        this.conclusion = 'calibração'
      } else if (this.observationType === 'maintenance') {
        this.conclusion = 'manutenção'
      }
    },

    average (array) {
      let av = 0
      for (let j = 1; j < array.length; j++) {
        av += parseFloat(array[j])
      }
      return av / (array.length - 1)
    },

    standardDeviation (array) {
      var meanVal = this.average(array)
      var sDprep = 0
      for (let j = 1; j < array.length; j++) {
        sDprep += Math.pow((parseFloat(array[j]) - meanVal), 2)
      }
      return Math.sqrt(sDprep / (array.length - 2))
    }
  }
}
</script>
../../../../../../../../services/permissions