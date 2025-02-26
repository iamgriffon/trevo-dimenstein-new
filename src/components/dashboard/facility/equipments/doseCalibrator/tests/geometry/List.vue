<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col-10">
        <h1>{{ equipment.type + ' ' + ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</h1>
        <h2>Geometria</h2>
      </div>
      <div class="col-2 text-right">
        <router-link class="btn btn-success" :to="'/equipments/doseCalibrator/' + equipment._id + '/geometry/register'"><i class="fa fa-plus d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-sm-block"><i class="fa fa-plus" aria-hidden="true"></i> adicionar</span></router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/doseCalibrator'">{{ equipment.type }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">geometria</li>
        </ol>
      </nav>
    </div>
    <div class="row">
      <div class="col">
        <table class="table table-responsive hyper-table col mx-auto">
          <thead>
            <tr>
              <th>Data</th>
              <th>Vencimento</th>
              <th>Conclusão</th>
              <th>Responsável</th>
              <th></th>
            </tr>
          </thead>
          <tbody >
            <tr v-for="test in tests">
              <td>{{ test.date | moment('DD/MM/YYYY') }}</td>
              <td>{{ addYear(test.date) }}</td>
              <td>{{ test.conclusion }} <span v-if="test.conclusion != 'satisfatório' && test.conclusion != 'Satisfatório'" class="red"><i class="fas fa-exclamation-circle"></i></span></td>
              <td v-if="test.responsible">{{ test.responsible.name }}</td>
              <td v-else></td>
              <td v-if="test.status == 'em andamento'" class="text-right">
                <router-link :to="'/equipments/doseCalibrator/' + equipment._id + '/linearity/' + test._id + '/edit'" class="btn btn-outline-success"><i class="fas fa-edit" aria-hidden="true"></i> editar</router-link>
              </td>
              <td v-else class="text-right"><router-link :to="'/equipments/doseCalibrator/' + equipment._id + '/geometry/' + test._id" class="btn btn-outline-metalic-seaweed"><i class="fa fa-info" aria-hidden="true"></i> informações</router-link></td>
            </tr>
          </tbody>
        </table>
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
    return {
      facility: {
        equipments: []
      },
      equipment: { _id: '', name: '', type: '', patrimonialNumber: '' },
      dataLetters: '',
      currentUser: {},
      permission: permission,
      tests: [],
      errors: ''
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      console.log(response.data)
      this.equipment = response.data

      axios.get(auth.apiUrl() + 'facility/' + response.data.facility._id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(resp => {
        this.facility = resp.data
      })
      .catch(error => {
        this.errors = error.data
        this.facility = ''
      })

      axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.id + '/DoseCalibratorGeometryTests/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(r => {
        this.tests = r.data
      })
      .catch(error => {
        this.errors = error.data
        this.tests = ''
      })
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

    addYear (date) {
      return moment(new Date(new Date(date).setFullYear(new Date(date).getFullYear() + 1))).format('DD/MM/YYYY')
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
../../../../../../../../services/permissions