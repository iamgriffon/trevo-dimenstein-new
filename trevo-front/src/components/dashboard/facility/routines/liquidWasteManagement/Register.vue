<!-- src/components/Login.vue -->
<template>
  <div class="main">
    <div class="center">
      <div class="col-12" enctype="multipart/form-data">
        <h2>Adicionar Rejeito Líquido</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/routines'">rotinas</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/routines/liquidwastemanagement/' + year">gerenciamento de rejeitos líquidos</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">adicionar</li>
            </ol>
          </nav>
        </div>
        <div class="alert alert-danger" v-if="error">
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
        </div>
        <div class="hyper-card mb-3">
          <div class="form-group">
            <label class="col-form-label" for=""><i class="far fa-calendar-alt" aria-hidden="true"></i> Data</label>
            <input type="date" class="form-control" placeholder="" v-model="date">
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fas fa-map-marker" aria-hidden="true"></i> Local</label>
            <small class="text-muted">opcional</small>
            <input type="text" class="form-control" placeholder="" v-model="localization" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Radioisótopo</label>
            <v-select v-model="radioisotope" :options="radioisotopes"></v-select>
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="far fa-dot-circle" aria-hidden="true"></i> Volume do Rejeito (ml)</label>
            <input type="number" class="form-control" placeholder="" v-model="volume" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fas fa-asterisk" aria-hidden="true"></i> Atividade (mCi)</label>
            <input type="text" class="form-control" placeholder="" v-model="activity" >
          </div>
        </div>
        <button class="btn btn-success btn-block" @click="register()">Adicionar Movimentação</button>
        <br>
        <br>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import auth from '../../../../authentication/authentication'
import permission from '../../../../../../services/permissions'
import axios from 'axios'
import moment from 'moment-timezone'

export default {
  data () {
    var now = new Date()
    var thisYear = now.getFullYear()
    now = new Date(moment.tz(now, 'America/Sao_Paulo'))
    now = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
    return {
      date: now,
      year: thisYear,
      facility: {},
      permission: permission,
      radioisotope: '',
      localization: '',
      volume: '',
      activity: '',
      responsible: { name: auth.currentUser().name, _id: auth.currentUser().id },
      radioisotopes: [
        {label: 'Cr(51)', value: 'Cr(51)', halfLife: 667.2, liberationPlanLiberationPrevision: 630, CNENLimit: 9.3}, // CNENLIMIT IMAGEM MBq/m3
        {label: 'F(18)', value: 'F(18)', halfLife: 1.83, liberationPlanLiberationPrevision: 3, CNENLimit: 13},
        {label: 'Ga(67)', value: 'Ga(67)', halfLife: 78, liberationPlanLiberationPrevision: 120, CNENLimit: 1.9},
        {label: 'Ga(68)', value: 'Ga(68)', halfLife: 1.13, liberationPlanLiberationPrevision: 3, CNENLimit: 3.7},
        {label: 'I(123)', value: 'I(123)', halfLife: 13.2, liberationPlanLiberationPrevision: 20, CNENLimit: 1.9},
        {label: 'I(131)', value: 'I(131)', halfLife: 193, liberationPlanLiberationPrevision: 310, CNENLimit: 0.019},
        {label: 'In(111)', value: 'In(111)', halfLife: 67.2, liberationPlanLiberationPrevision: 120, CNENLimit: 1.1},
        {label: 'Lu(177)', value: 'Lu(177)', halfLife: 162, liberationPlanLiberationPrevision: 270, CNENLimit: 0.74},
        {label: 'Ra(233)', value: 'Ra(233)', halfLife: 274, liberationPlanLiberationPrevision: 380, CNENLimit: 0.0019},
        {label: 'Sm(153)', value: 'Sm(153)', halfLife: 46.3, liberationPlanLiberationPrevision: 120, CNENLimit: 0.56},
        {label: 'Tc(99m)', value: 'Tc(99m)', halfLife: 6.02, liberationPlanLiberationPrevision: 20, CNENLimit: 1900},
        {label: 'Tl(201)', value: 'Tl(201)', halfLife: 72.91, liberationPlanLiberationPrevision: 120, CNENLimit: 3.7}
      ],
      error: ''
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.facility = ''
      } else {
        this.facility = response.data
      }
    })
    .catch(error => {
      this.errors = error.data
      this.facility = ''
    })
    this.currentUser = auth.currentUser()
  },
  methods: {
    register () {
      var credentials = {
        date: this.date,
        radioisotope: this.radioisotope.value,
        activity: this.sumString(this.activity),
        localization: this.localization,
        volume: this.volume,
        radiationPlanLiberationPrevision: this.getRadiationPlanLiberationPrevision(),
        calculatedLiberationPrevision: this.getCalculatedLiberationPrevision(),
        responsibleForClosing: this.responsible,
        facility: { _id: this.facility._id }
      }
      auth.registerFacilityRoutineLiquidWasteManagement(this, credentials, '/facility/' + this.facility._id + '/routines/liquidwastemanagement/' + this.year)
    },

    addDays (date, days) {
      var dat = new Date(moment.tz(date, 'America/Sao_Paulo'))
      dat.setDate(dat.getDate() + days)
      return dat
    },

    getCalculatedLiberationPrevision () {
      // console.log(-Math.log((this.radioisotope.CNENLimit * this.volume * 0.000001) / (this.activity * 37)) * (this.radioisotope.halfLife / (24 * 0.6931471806)))
      return this.addDays(this.date, -Math.log((this.radioisotope.CNENLimit * this.volume * 0.000001) / (parseFloat(this.sumString(this.activity)) * 37)) * (this.radioisotope.halfLife / (24 * 0.6931471806)))
    },

    getRadiationPlanLiberationPrevision () {
      return this.addDays(this.date, this.radioisotope.liberationPlanLiberationPrevision)
    },

    sumString (string) {
      let array = (string.toString()).split('+')
      let sum = 0
      for (let i = 0; i < array.length; i++) {
        sum += parseFloat(array[i])
      }
      return sum.toString()
    }
  }
}
</script>
../../../../../../services/permissions