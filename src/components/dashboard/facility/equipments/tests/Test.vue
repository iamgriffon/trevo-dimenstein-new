<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col">
        <h1>{{ equipment.type + ' ' + ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</h1>
        <h2>{{ test.name }}</h2>
      </div>
      <div class="col text-right">
        <router-link v-if="permission.canCreateFacility(currentUser)" class="btn btn-success" :to="{ path: '/equipments/' + equipment.typeId + '/' + equipment._id + '/' + this.$route.params.id + '/register'}"><i class="fa fa-plus d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-sm-block"><i class="fa fa-plus" aria-hidden="true"></i> adicionar</span></router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments/' + equipment.typeId">{{ equipment.type }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/' + equipment.typeId + '/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ test.name }}</li>
        </ol>
      </nav>
    </div>
    <documents-table :tests="tests" :equipment="equipment" :loadDocuments="loadDocuments"/>
  </div>
</template>

<script>
import auth from '../../../../authentication/authentication'
import permission from '../../../../../../services/permissions'
import axios from 'axios'
import documentsTable from '../../../../documentsTable/Index'

export default {
  components: {
    'documents-table': documentsTable
  },
  data () {
    return {
      permission: permission,
      facility: {
        equipments: []
      },
      today: new Date(),
      test: { name: '' },
      signeTest: { name: '' },
      equipment: {},
      currentUser: {},
      plotPoints: [],
      calculatedPlotPoints: [],
      tests: [],
      pdfUrl: '',
      url: '',
      loading: false,
      actualTest: {},
      commentaryText: '',
      signaturePosition: '',
      signatureMode: ''
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
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

    axios.get(auth.apiUrl() + 'test/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.test = ''
      } else {
        this.test = response.data
      }
    })
    .catch(error => {
      this.errors = error.data
      this.test = ''
    })

    this.loadDocuments()
    this.currentUser = auth.currentUser()
  },

  methods: {
    loadDocuments () {
      this.tests = []
      axios.get(auth.apiUrl() + 'test/' + this.$route.params.equipmentId + '/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(response => {
        if (response.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.tests = ''
        } else {
          if (permission.canSeeNotLiberatedTests(this.currentUser)) {
            this.tests = response.data
            this.loading = false
          } else {
            this.tests = response.data.filter((test) => { return test.status === 'Liberado' })
            this.loading = false
          }
        }
      })
      .catch(error => {
        this.errors = error.data
        this.test = ''
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
.good-table {
  max-width: 100%;
}

.btn-choose-position {
  background-color: white;
  border-color: #00a767;
  align-items: center;
  margin-top: 15px;
}

.btn-choose-position:focus, .btn-choose-position.selected {
  border-color: #00a767;
  box-shadow: 0 0 0 0.2rem #00a767;
}

.btn-block.btn-outline-success.selected {
  color: white;
  background-color: #00a767;
}

/* @media (min-width: 992px) { */
/* } */
</style>
../../../../../../services/permissions