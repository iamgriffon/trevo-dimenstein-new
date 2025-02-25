<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col-9">
        <h1>{{ equipment.type + ' ' + ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</h1>
        <h2>Janelas Assimétricas</h2>
      </div>
      <div class="col-3 text-right">
        <router-link v-if="tests.length > 0" class="btn btn-success" :to="'/equipments/gamaCamara/' + equipment._id + '/asymmetricWindow/register'"><i class="fa fa-plus d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-sm-block"><i class="fa fa-plus" aria-hidden="true"></i> adicionar</span></router-link>
        <router-link v-else class="btn btn-success" :to="'/equipments/gamaCamara/' + equipment._id + '/asymmetricWindow/register'"><i class="fa fa-plus d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-sm-block"><i class="fa fa-plus" aria-hidden="true"></i> realizar teste de aceitação</span></router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/gamaCamara'">{{ equipment.type }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/gamaCamara/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">janelas assimétricas</li>
        </ol>
      </nav>
    </div>
    <div class="row">
      <div class="col">
        <table class="table table-responsive hyper-table col mx-auto" v-if="tests.length > 0">
          <thead>
            <tr>
              <th>Data</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Detector 1</th>
              <th v-if="equipment.numberOfDetectors == '2'">Detector 2</th>
              <th>Realizado por</th>
              <th>Finalizado por</th>
              <th></th>
            </tr>
          </thead>
          <tbody >
            <tr v-for="test in tests">
              <td>{{ test.date | moment('DD/MM/YYYY')}}</td>
              <td>{{ addSemester(test.date) }}</td>
              <td><span v-if="test.isAcceptanceTest">Teste de Aceite - </span>{{ test.status }}</td>
              <td v-if="test.conclusions[0] == 'Detector 1 não testado'">-</td>
              <td v-else>{{ test.conclusions[0] }}</td>
              <template v-if="equipment.numberOfDetectors == '2'">
                <td v-if="test.conclusions[1] == 'Detector 2 não testado'">-</td>
                <td v-else>{{ test.conclusions[1] }}</td>
              </template>
              <td v-if="test.responsibleForPerforming">{{ test.responsibleForPerforming.name }}</td>
              <td v-else></td>
              <td v-if="test.responsibleForFinalizing">{{ test.responsibleForFinalizing.name }}</td>
              <td v-else></td>
              <td class="text-right"><router-link :to="'/equipments/gamaCamara/' + equipment._id + '/asymmetricWindow/' + test._id" class="btn btn-outline-metalic-seaweed"><i class="fa fa-info" aria-hidden="true"></i> informações</router-link></td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <div class="alert alert-danger">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> É necessário realizar o teste de aceitação
          </div>
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

export default {

  data () {
    return {
      facility: {
        equipments: []
      },
      equipment: {},
      dataLetters: '',
      currentUser: {},
      permission: permission,
      tests: []
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

        axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.id + '/gamaCamaraAsymmetricWindowTests/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
        .then(r => {
          if (r.data.length === 0) {
            this.errors = 'Nenhum resultado encontrado'
            this.tests = ''
          } else {
            this.tests = r.data
          }
        })
        .catch(error => {
          this.errors = error.data
          this.tests = ''
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

    addSemester (date) {
      var thisDate = new Date(date)
      return moment(thisDate.setMonth(thisDate.getMonth() + 6)).format('DD/MM/YYYY')
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