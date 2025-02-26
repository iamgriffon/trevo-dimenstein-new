<!-- src/components/Login.vue -->
<template>
  <div class="main">
    <div class="center">
      <div class="col-12" enctype="multipart/form-data">
        <h2>Editar Fonte</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">adicionar</li>
            </ol>
          </nav>
        </div>
        <div class="alert alert-danger" v-if="error">
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
        </div>
        <div class="hyper-card mb-3">
          <div class="form-group">
            <label class="col-form-label" for="selectType"><i class="fab fa-react"></i> Radioisótopo</label>
            <v-select v-model="radioisotope" :options="radioisotopes"></v-select>
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fas fa-hashtag"></i> Número de Série</label>
            <input type="text" class="form-control" placeholder="" v-model="serialNumber" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fas fa-asterisk" aria-hidden="true"></i> Atividade Inicial (µCi)</label>
            <input type="number" class="form-control" placeholder="" v-model="initialActivity" >
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="far fa-calendar" aria-hidden="true"></i> Data de Medição da Atividade Inicial</label>
            <input type="date" class="form-control" placeholder="" v-model="initialActivityDate" >
          </div>
        </div>
        <button class="btn btn-success btn-block" @click="update()">Editar Fonte</button>
        <br>
        <br>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import auth from '../../../../../authentication/authentication'
import permission from '../../../../../../../services/permissions'
import axios from 'axios'

export default {
  data () {
    return {
      facility: {},
      equipment: {},
      radioisotopes: ['Ba(133)', 'Co(57)', 'Cs(137)'],
      _id: '',
      radioisotope: '',
      serialNumber: '',
      initialActivity: '',
      initialActivityDate: '',
      permission: permission,
      error: ''
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.equipmentId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.equipment = ''
      } else {
        this.equipment = response.data

        axios.get(auth.apiUrl() + 'facility/' + response.data.facility._id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
        .then(resp => {
          if (response.data.length === 0) {
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
        axios.get(auth.apiUrl() + 'doseCalibratorSource/' + this.$route.params.sourceId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
        .then(resp => {
          if (response.data.length === 0) {
            this.errors = 'Nenhum resultado encontrado'
            this.radioisotope = ''
            this.serialNumber = ''
            this.initialActivity = ''
            this.initialActivityDate = ''
          } else {
            this._id = resp.data._id
            this.radioisotope = resp.data.radioisotope
            this.serialNumber = resp.data.serialNumber
            this.initialActivity = resp.data.initialActivity
            this.initialActivityDate = resp.data.initialActivityDate
          }
        })
        .catch(error => {
          this.errors = error.data
          this.radioisotope = ''
          this.serialNumber = ''
          this.initialActivity = ''
          this.initialActivityDate = ''
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
    update () {
      var credentials = {
        _id: this._id,
        radioisotope: this.radioisotope,
        serialNumber: this.serialNumber,
        initialActivity: this.initialActivity,
        initialActivityDate: this.initialActivityDate,
        equipment: { _id: this.equipment._id }
      }
      auth.editDoseCalibratorSource(this, credentials, '/equipments/doseCalibrator/' + this.equipment._id)
    }
  }
}
</script>
../../../../../../../services/permissions