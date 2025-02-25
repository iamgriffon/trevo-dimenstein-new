<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col">
        <h1>{{ equipment.type + ' ' + ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</h1>
      </div>
      <div class="col text-right">
        <router-link :to="'/facility/' + facility._id + '/equipment/' + equipment._id + '/edit'" class="btn btn-outline-success"><i class="fas fa-edit d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fas fa-edit" aria-hidden="true"></i> editar</span></router-link>
        <!-- <router-link :to="facility._id + '/edit'" v-if="permission.canEditFacility(currentUser)" class="btn btn-outline-success"><i class="fas fa-edit d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fas fa-edit" aria-hidden="true"></i> editar</span></router-link>
        <button @click="exclude()" v-if="permission.canExcludeFacility(currentUser)" class="btn btn-outline-danger"><i class="far fa-trash-alt d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="far fa-trash-alt" aria-hidden="true"></i> excluir</span></button>-->
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/' + translateTypeParam(equipment.type)">{{ equipment.type }}</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</li>
        </ol>
      </nav>
    </div>

    <h2>Testes</h2>
    <div class="col-12 row px-0 mx-0">
      <router-link :to="'/equipments/geigerCounter/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h3>Reprodutibilidade</h3>
      </router-link>
    </div>

    <br><br>
    <div class="row ml-md-3">
      <div class="col mb-3 pl-sm-1">
        <div class="hyper-card mb-3">
          <h5 class="mb-3">Informações:</h5>
          <p class="pl-3"><i class="far fa-building" aria-hidden="true"></i> {{ facility.name }}</p>
          <p class="pl-3"><i class="fas fa-cubes" aria-hidden="true"></i> {{ equipment.type }}</p>
          <p class="pl-3"><i class="fas fa-hashtag"></i> {{ equipment.patrimonialNumber + ' (' +  equipment.manufacturer + '/' + equipment.model + '-' + equipment.serialNumber + ')' }}</p>
          <p class="pl-3"><i class="fas fa-map-marker" aria-hidden="true"></i> {{ equipment.localization }}</p>
          <p class="pl-3" v-if="equipment.calibrationCertificateNumber"><i class="fas fa-hashtag" aria-hidden="true"></i> {{ equipment.calibrationCertificateNumber + ' - ' + equipment.certificateValidity }}</p>
          <p class="pl-3" v-if="equipment.mostUsedRadioisotope"><i class="fab fa-react" aria-hidden="true"></i> {{ equipment.mostUsedRadioisotope }}</p>
        </div>
      </div>
    </div>
    <br>
    <div class="col-12 row m-0 p-0">
      <div class="col pb-2">
        <h3>Sondas</h3>
      </div>
    </div>
    <div class="row ml-md-3" v-if="equipment">
      <div class="col mb-3 pl-sm-1">
        <div class="hyper-card mb-3">
          <p class="pl-3"><i class="fas fa-cubes" aria-hidden="true"></i> {{ equipment.probe }}</p>
          <p class="pl-3" v-if="equipment.probe === 'Exposição' || equipment.probe === 'Exposição e Contaminação'"><i class="fas fa-hashtag"></i> Número de Série da Sonda de Exposição: {{ equipment.exposureProbeSerialNumber }}</p>
          <p class="pl-3" v-if="equipment.probe === 'Contaminação' || equipment.probe === 'Exposição e Contaminação'"><i class="fas fa-hashtag"></i> Número de Série da Sonda de Contaminação: {{ equipment.contaminationProbeSerialNumber }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../../../authentication/authentication'
import permission from '../../../../../../services/permissions'
import axios from 'axios'

export default {
  data () {
    let now = new Date()
    let year = now.getFullYear()
    return {
      dateYear: year,
      facility: {
        equipments: []
      },
      equipment: {},
      dataLetters: '',
      currentUser: {},
      permission: permission,
      columns: [
        {
          label: ''
        },
        {
          label: 'Nome',
          field: 'name'
        },
        {
          label: 'Responsabilidade',
          field: 'responsability'
        }
      ]
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
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })
    this.currentUser = auth.currentUser()
  },

  methods: {
    exclude () {
      if (confirm('Tem certeza que deseja excluir esta instalação?')) {
        auth.excludeFacility(this, this.facility, '/facility')
      }
    },
    downloadFacilityProfession () {
      var professionCNEN = document.getElementById('professionCNEN')
      professionCNEN.href = this.facility.professionCNEN

      professionCNEN.click()
    },
    translateTypeParam (type) {
      if (type === 'Calibrador de Doses') {
        return 'doseCalibrator'
      }
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
</style>
../../../../../../services/permissions