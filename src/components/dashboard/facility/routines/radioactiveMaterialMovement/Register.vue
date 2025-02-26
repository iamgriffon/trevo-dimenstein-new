<!-- src/components/Login.vue -->
<template>
  <div class="main">
    <div class="center">
      <div class="col-12" enctype="multipart/form-data">
        <h2>Adicionar Movimentação</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/routines'">rotinas</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/routines/radioactivematerialmov'">movimentação de material radioativo</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">adicionar</li>
            </ol>
          </nav>
        </div>
        <div class="alert alert-danger" v-if="error">
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
        </div>
        <div class="hyper-card mb-3">
          <div class="form-group">
            <label class="col-form-label" for=""><i class="far fa-calendar-alt" aria-hidden="true"></i> Data de Entrega</label>
            <input type="date" class="form-control" placeholder="" v-model="date" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Radioisótopo</label>
            <v-select v-model="radioisotope" :options="radioisotopes"></v-select>
          </div>
          <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Unidade da Atividade Inicial/Eluição</label>
          <div class="form-group row">
            <label class="radio-inline col">
              <input type="radio" name="optradio" value="mCi" v-model="activitiesUnit"> mCi
            </label>
            <label class="radio-inline col">
              <input type="radio" name="optradio" value="MBq" v-model="activitiesUnit"> MBq
            </label>
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="far fa-dot-circle" aria-hidden="true"></i><span v-if="radioisotope.value === 'Tc(99m)' || radioisotope.value === 'Ga(68)'"> Atividade da Eluição ({{ activitiesUnit }})</span><span v-else> Atividade Inicial ({{ activitiesUnit }})</span></label>
            <input type="text" class="form-control" placeholder="" v-model="initialActivity" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="far fa-circle" aria-hidden="true"></i><span v-if="radioisotope.value === 'Tc(99m)' || radioisotope.value === 'Ga(68)'"> Atividade de Marcação (mCi)</span><span v-else> Atividade de Uso (mCi)</span></label>
            <input type="text" class="form-control" placeholder="" v-model="usageActivity" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fas fa-th-large"></i> Número de Pacientes</label>
            <small class="text-muted">opcional</small>
            <input type="number" class="form-control" placeholder="" v-model="numberOfDoses" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fas fa-hashtag" aria-hidden="true"></i> Lote</label>
            <small class="text-muted">opcional</small>
            <input type="text" class="form-control" placeholder="" v-model="lot" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="far fa-calendar-alt" aria-hidden="true"></i> Validade</label>
            <small class="text-muted">opcional</small>
            <input type="date" class="form-control" placeholder="" v-model="validity" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for="formName"> Observações</label>
            <small class="text-muted">opcional</small>
            <textarea rows="5" class="form-control" v-model="observations"></textarea>
          </div>
          <div class="form-group" v-if="responsibleOptions.length > 0">
            <label class="col-form-label" for="selectType"><i class="far fa-user" aria-hidden="true"></i> Responsável</label>
            <v-select v-model="responsible" :options="responsibleOptions"></v-select>
          </div>
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
// import moment from 'moment-timezone'

export default {
  data () {
    var now = new Date()
    // now = new Date(moment.tz(now, 'America/Sao_Paulo'))
    now = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
    return {
      date: now,
      facility: {},
      permission: permission,
      radioisotope: '',
      usageActivity: '',
      usagePeriod: '',
      initialActivity: '',
      wasteType: '',
      usage: '',
      numberOfDoses: '',
      lot: '',
      validity: '',
      observations: '',
      activitiesUnit: 'mCi',
      responsible: { name: auth.currentUser().name, _id: auth.currentUser().id },
      radioisotopes: [
        {label: 'C(11)', value: 'C(11)', usagePeriod: 0, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Diagnóstico'},
        {label: 'Cr(51)', value: 'Cr(51)', usagePeriod: 3, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Diagnóstico'},
        {label: 'F(18)', value: 'F(18)', usagePeriod: 0, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Diagnóstico'},
        {label: 'Ga(67)', value: 'Ga(67)', usagePeriod: 3, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Diagnóstico'},
        {label: 'Ga(68)', value: 'Ga(68)', usagePeriod: 0, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Diagnóstico'},
        {label: 'I(123)', value: 'I(123)', usagePeriod: 3, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Diagnóstico'},
        {label: 'I(125)', value: 'I(125)', usagePeriod: 5, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Terapia'},
        {label: 'I(131)', value: 'I(131)', usagePeriod: 7, wasteType: 'Frascos, Papéis e Luvas, Pérfulos, Alimentos', usage: 'Terapia e Diagnóstico'},
        {label: 'In(111)', value: 'In(111)', usagePeriod: 3, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Diagnóstico'},
        {label: 'Lu(177)', value: 'Lu(177)', usagePeriod: 1, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Terapia'},
        {label: 'Ra(233)', value: 'Ra(233)', usagePeriod: 4, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Terapia'},
        {label: 'Sm(153)', value: 'Sm(153)', usagePeriod: 3, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Terapia'},
        {label: 'Tc(99m)', value: 'Tc(99m)', usagePeriod: 7, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Diagnóstico'},
        {label: 'Tl(201)', value: 'Tl(201)', usagePeriod: 3, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Diagnóstico'},
        {label: 'Y(90)', value: 'Y(90)', usagePeriod: 3, wasteType: 'Frascos, Papéis e Luvas, Pérfulos', usage: 'Terapia'}
      ],
      error: '',
      responsibleOptions: []
    }
  },

  watch: {
    radioisotope: function () {
      var dat = this.date
      dat = this.addDays(dat, this.radioisotopes.filter(rad => rad.value === this.radioisotope.value)[0].usagePeriod)
      this.usagePeriod = dat.getFullYear() + '-' + ('0' + (dat.getMonth() + 1)).slice(-2) + '-' + ('0' + dat.getDate()).slice(-2) // moment.tz(dat.getFullYear() + '-' + ('0' + (dat.getMonth() + 1)).slice(-2) + '-' + ('0' + dat.getDate()).slice(-2), 'America/Sao_Paulo')
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
      if (this.activitiesUnit === 'MBq') {
        this.initialActivity = this.sumString(this.initialActivity) / 37.0
      }
      var credentials = {
        date: this.date,
        radioisotope: this.radioisotope.value,
        initialActivity: this.sumString(this.initialActivity),
        usagePeriod: this.usagePeriod,
        usageActivity: this.sumString(this.usageActivity),
        wasteType: this.wasteType,
        usage: this.usage,
        numberOfDoses: this.numberOfDoses,
        lot: this.lot,
        validity: this.validity,
        responsible: { _id: this.responsible._id, name: this.responsible.name },
        observations: this.observations,
        facility: { _id: this.facility._id }
      }

      auth.registerFacilityRoutineRadioactiveMaterialMovement(this, credentials, '/facility/' + this.facility._id + '/routines/radioactivematerialmov')
    },

    addDays (date, days) {
      var dat = new Date(date) // new Date(moment.tz(date, 'America/Sao_Paulo'))
      dat.setDate(dat.getDate() + days)
      return dat
    },

    sumString (string) {
      string = (string.toString()).replace(',', '.')
      let array = (string.toString()).split('+')
      let sum = 0
      for (let i = 0; i < array.length; i++) {
        sum += parseFloat(array[i])
      }
      return sum.toFixed(2).toString()
    }
  }
}
</script>
../../../../../../services/permissions