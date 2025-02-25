<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col">
        <h1>{{ equipment.type + ' ' + ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</h1>
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
    <br>
    <h3>Mensais</h3>
    <div class="col-12 row px-0 mx-0">
      <router-link v-if="equipment.linearityAndIntrinsicSpatialResolution" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Linearidade e Resolução Espacial Intrínseca</h4>
      </router-link>
      <router-link v-if="equipment.hightCountageIntrinsicUniformity" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Uniformidade Intrínseca de Alta Taxa de Contagem</h4>
      </router-link>
    </div>
    <br>
    <h3>Semestrais</h3>
    <div class="col-12 row px-0 mx-0">
      <router-link v-if="equipment.angulation" :to="'/equipments/gamaCamara/' + equipment._id + '/angulation/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Angulação dos Furos dos Colimadores</h4>
      </router-link>
      <router-link v-if="equipment.planeSensibility" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Sensibilidade Plana</h4>
      </router-link>
      <router-link v-if="equipment.overallPerformance" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Desempenho Geral</h4>
      </router-link>
      <router-link v-if="equipment.tableVelocity" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Velocidade de Mesa</h4>
      </router-link>
      <router-link v-if="equipment.maximumCountingRate" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Taxa Máxima de Contagem</h4>
      </router-link>
      <router-link v-if="equipment.energeticResolution" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Resolução Energética</h4>
      </router-link>
      <router-link v-if="equipment.spatialCoRegistrationForMultienergeticSources" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Co-registro Espacial para Fontes Multienergéticas</h4>
      </router-link>
      <router-link v-if="equipment.extrinsicUniformityOfHighCountingRate" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Uniformidade Extrínseca de Alta Taxa de Contagem</h4>
      </router-link>
    </div>
    <br>
    <h3>Anuais</h3>
    <div class="col-12 row px-0 mx-0">
      <router-link v-if="equipment.asymmetricWindows" :to="'/equipments/gamaCamara/' + equipment._id + '/asymmetricWindow/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Janelas Assimétricas</h4><span v-if="asymmetricWindowTests.length === 0"><i class="fas fa-exclamation-triangle"></i> Necessário realizar teste de aceite</span>
      </router-link>
      <router-link v-if="equipment.uniformityForDifferentRadioisotopes" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Uniformidade para Diferentes Radioisótopos</h4>
      </router-link>
      <router-link v-if="equipment.overallPerformance" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Desempenho Geral</h4>
      </router-link>
      <router-link v-if="equipment.linearityAndExtrinsicSpatialResolution" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Linearidade e Resolução Espacial Extrínseca</h4>
      </router-link>
    </div>
    <br>
    <h3>Aceite</h3>
    <div class="col-12 row px-0 mx-0">
      <router-link v-if="equipment.pixelSize" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Tamanho de Pixel</h4>
      </router-link>
      <router-link v-if="equipment.shieldingSystem" :to="'/equipments/gamaCamara/' + equipment._id + '/reproductibility/'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h4>Blindagem do Sistema</h4>
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
      asymmetricWindowTests: [],
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

        this.getAsymmetricWindowTests()
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
    },
    getAsymmetricWindowTests () {
      axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.id + '/gamaCamaraAsymmetricWindowTests/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(r => {
        if (r.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.asymmetricWindowTests = ''
        } else {
          this.asymmetricWindowTests = r.data
        }
      })
      .catch(error => {
        this.errors = error.data
        this.asymmetricWindowTests = ''
      })
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