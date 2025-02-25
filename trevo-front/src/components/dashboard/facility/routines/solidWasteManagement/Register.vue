<!-- src/components/Login.vue -->
<template>
  <div class="main">
    <div class="center">
      <div class="col-12" enctype="multipart/form-data">
        <h2>Adicionar Rejeito</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/routines'">rotinas</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/routines/solidwastemanagement'">gerenciamento de rejeitos sólidos</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">adicionar</li>
            </ol>
          </nav>
        </div>
        <div class="alert alert-danger" v-if="error">
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
        </div>
        <div class="hyper-card mb-3">
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label class="col-form-label" for=""><i class="far fa-calendar-alt" aria-hidden="true"></i> Data</label>
                <input type="date" class="form-control" placeholder="" v-model="date">
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label class="col-form-label" for=""><i class="fas fa-hashtag" aria-hidden="true"></i> Número da Etiqueta</label>
                <input type="number" class="form-control" placeholder="" v-model="tagNumber" readonly>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fas fa-map-marker" aria-hidden="true"></i> Local</label>
            <input type="text" class="form-control" placeholder="" v-model="localization" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fab fa-react" aria-hidden="true"></i> Radioisótopo</label>
            <v-select v-model="radioisotope" :options="radioisotopes" id="selectRadioisotopes"></v-select>
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fas fa-cubes" aria-hidden="true"></i> Tipo</label>
            <v-select v-model="wasteType" :options="wasteTypes" id="selectWasteTypes"></v-select>
          </div>
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label class="col-form-label" for=""><i class="fas fa-asterisk"></i> Exposição</label>
                <input v-if="geigerSaturation" type="text" class="form-control" readonly></input>
                <input v-else type="number" class="form-control" placeholder="" v-model="exposure" >
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-group geigerSaturation">
                <input type="checkbox" id="geigerSaturation" v-model="geigerSaturation">
                <label for="geigerSaturation">Saturação do Geiger</label>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="radio-inline col">
              <input type="radio" name="optradio" value="microRPerHour" v-model="exposureUnit"> µR/h
            </label>
            <label class="radio-inline col">
              <input type="radio" name="optradio" value="miliRPerHour" v-model="exposureUnit"> mR/h
            </label>
            <label class="radio-inline col">
              <input type="radio" name="optradio" value="microSvPerHour" v-model="exposureUnit"> µSv/h
            </label>
            <label class="radio-inline col">
              <input type="radio" name="optradio" value="miliSvPerHour" v-model="exposureUnit"> mSv/h
            </label>
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fas fa-square"></i> Peso (kg)</label>
            <input type="number" class="form-control" placeholder="" v-model="weight" >
          </div>
        </div>
        <button class="btn btn-success btn-block" @click="register()">Adicionar Rejeito</button>
        <br>
        <br>
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
    // now = new Date(moment.tz(now, 'America/Sao_Paulo'))
    now = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
    return {
      date: now,
      permission: permission,
      facility: {},
      tagNumber: 0,
      localization: '',
      wasteType: '',
      radioisotope: '',
      exposure: '',
      weight: '',
      activity: '',
      exposureUnit: '',
      geigerSaturation: false,
      radiationPlanLiberationPrevision: '',
      calculatedLiberationPrevision: '',
      responsibleForClosing: { name: auth.currentUser().name, _id: auth.currentUser().id },
      wasteTypes: ['Perfurocortante e Frascos', 'Luvas, Papéis e Forrações', 'Forrações e Alimentos', 'Animais e Materiais Específicos'],
      radioisotopes: [
        { label: 'Cr(51)', value: 'Cr(51)', halfLife: 667.2, bigGamma: 0.000632, liberationPrevisionDays: 160, CNENLimit: 1 },
        { label: 'F(18)', value: 'F(18)', halfLife: 1.83, bigGamma: 0.0185, liberationPrevisionDays: 3, CNENLimit: 0.01 },
        { label: 'Ga(67)', value: 'Ga(67)', halfLife: 78, bigGamma: 0.039, liberationPrevisionDays: 90, CNENLimit: 0.1 },
        { label: 'Ga(68)', value: 'Ga(68)', halfLife: 1.13, bigGamma: 0.0176, liberationPrevisionDays: 3, CNENLimit: 0.01 },
        { label: 'I(123)', value: 'I(123)', halfLife: 13.2, bigGamma: 0.00748, liberationPrevisionDays: 15, CNENLimit: 100 },
        { label: 'I(131)', value: 'I(131)', halfLife: 193, bigGamma: 0.00764, liberationPrevisionDays: 120, CNENLimit: 0.1 },
        { label: 'In(111)', value: 'In(111)', halfLife: 67.2, bigGamma: 0.0136, liberationPrevisionDays: 90, CNENLimit: 0.1 },
        { label: 'Lu(177)', value: 'Lu(177)', halfLife: 162, bigGamma: 0.000764, liberationPrevisionDays: 180, CNENLimit: 1 },
        { label: 'Ra(233)', value: 'Ra(233)', halfLife: 274, bigGamma: 0.00879, liberationPrevisionDays: 390, CNENLimit: 0.1 },
        { label: 'Sm(153)', value: 'Sm(153)', halfLife: 46.3, bigGamma: 0.00244, liberationPrevisionDays: 90, CNENLimit: 0.1 },
        { label: 'Tc(99m)', value: 'Tc(99m)', halfLife: 6.02, bigGamma: 0.00337, liberationPrevisionDays: 15, CNENLimit: 0.1 },
        { label: 'Tl(201)', value: 'Tl(201)', halfLife: 72.91, bigGamma: 0.00237, liberationPrevisionDays: 90, CNENLimit: 0.1 }
      ],
      error: ''
    }
  },

  watch: {
    radioisotope: function () {
      var dat = this.date
      dat = this.addDays(dat, this.radioisotopes.filter(rad => rad.value === this.radioisotope.value)[0].usagePeriod)
      this.usagePeriod = moment.tz(dat.getFullYear() + '-' + ('0' + (dat.getMonth() + 1)).slice(-2) + '-' + ('0' + dat.getDate()).slice(-2), 'America/Sao_Paulo')
      this.wasteType = this.radioisotopes.filter(rad => rad.value === this.radioisotope.value)[0].wasteType
      this.usage = this.radioisotopes.filter(rad => rad.value === this.radioisotope.value)[0].usage
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
    if (this.$route.params.tagnumber) {
      this.tagNumber = this.$route.params.tagnumber
    }
  },
  methods: {
    register () {
      var credentials = {
        date: this.date,
        facility: { _id: this.facility._id },
        tagNumber: this.tagNumber,
        localization: this.localization,
        wasteType: this.wasteType,
        radioisotope: this.radioisotope.value,
        exposure: this.getExposure(),
        weight: this.weight,
        activity: this.getActivity(),
        radiationPlanLiberationPrevision: this.addDays(this.date, this.radioisotope.liberationPrevisionDays),
        calculatedLiberationPrevision: this.getCalculatedLiberationPrevision(),
        responsibleForClosing: this.responsibleForClosing
      }
      auth.registerFacilityRoutineSolidWasteManagement(this, credentials, '/facility/' + this.facility._id + '/routines/solidwastemanagement/' + new Date().getFullYear())
    },

    addDays (date, days) {
      var dat = new Date(moment.tz(date, 'America/Sao_Paulo'))
      dat.setDate(dat.getDate() + days)
      return dat
    },
    getActivity () {
      if (this.geigerSaturation === true) {
        return 'Saturação'
      } else if (this.getExposure() / (this.radioisotope.bigGamma * 3700) < 0.001) {
        return '< 0.001'
      } else {
        return this.getExposure() / (this.radioisotope.bigGamma * 3700)
      }
    },
    getCalculatedLiberationPrevision () {
      if (this.geigerSaturation === true || this.getActivity() === '< 0.001') {
        return this.addDays(this.date, this.radioisotope.liberationPrevisionDays)
      } else {
        return this.addDays(this.date, -Math.log(this.radioisotope.CNENLimit / (this.getActivity() * 37)) * (this.radioisotope.halfLife / (24 * 0.6931471806)) / this.weight)
      }
    },

    getExposure () {
      if (this.geigerSaturation === true) {
        return 'Saturação'
      } else if (this.exposureUnit === 'miliSvPerHour') {
        return this.exposure * 100
      } else if (this.exposureUnit === 'microRPerHour') {
        return this.exposure * 0.001
      } else if (this.exposureUnit === 'microSvPerHour') {
        return this.exposure * 0.1
      } else {
        return this.exposure
      }
    }
  }
}
</script>

<style>
  .geigerSaturation {
    line-height: 116px;
    margin: 0;
    height: 116px;
  }
</style>
../../../../../../services/permissions