<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col">
        <h1>{{ equipment.type + ' ' + equipment.patrimonialNumber }}</h1>
        <h2>Geometria - {{ test.date | moment('MM/YYYY')}}</h2>
      </div>
      <div class="col text-right">
        <button @click="genDocument()" class="btn btn-outline-success"><i class="far fa-file-alt d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="far fa-file-alt" aria-hidden="true"></i> gerar PDF</span></button>
        <button @click="exclude()" v-if="permission.canExcludeFacility(currentUser)" class="btn btn-outline-danger"><i class="far fa-trash-alt d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="far fa-trash-alt" aria-hidden="true"></i> excluir</span></button>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments/doseCalibrator/'">{{ equipment.type }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id">{{ equipment.patrimonialNumber }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id + '/geometry/'">geometria</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ test.date | moment('MM/YYYY') }}</li>
        </ol>
      </nav>
    </div>

    <div class="row ml-md-3">
      <div class="col mb-3 pl-sm-1">
        <div class="hyper-card mb-3">
          <h5 class="mb-3">Informações:</h5>
          <p class="pl-3"><i class="fab fa-react" aria-hidden="true"></i> {{ test.radioisotope.name }}</p>
          <p class="pl-3"><i class="far fa-calendar-alt" aria-hidden="true"></i> {{ test.date | moment('DD/MM/YYYY') }}</p>
          <p class="pl-3"><i class="far fa-user" aria-hidden="true"></i> {{ test.responsible.name }}</p>
        </div>
      </div>
    </div>

    <div class="mb-3 ml-3 text-center hyper-card" v-for="test in test.tests">
      <div class="row pl-2">
        <div class="col text-left">
          <h4>{{ test.container }}</h4>
        </div>
      </div>
      <div class="row">
        <div class="col">
        </div>
        <div class="col">
          Atividade Medida (mCi)
        </div>
        <div class="col">
          Fator de Correção
        </div>
        <div class="col">
          Variação (%)
        </div>
      </div>
      <div class="row" v-for="measure in test.measures">
        <div class="col">
          {{ measure.volume }}
        </div>
        <div class="form-group col">
          {{ measure.activity }}
        </div>
        <div class="col">
          {{ measure.correctionFactor }}
        </div>
        <div class="col">
          {{ measure.variation }}
        </div>
      </div>
    </div>

    <div class="row col pr-0">
      <div class="hyper-card col ml-3 mr-0">
        <h5 class="mb-3">Resultado:</h5>
        <p v-if="test.conclusion === 'satisfatório' || test.conclusion === 'Satisfatório'"> Todos os resultados apresentaram desvio menor que o estabelecido em norma.</p>
        <p v-else> Os resultados apresentaram desvio maior que o estabelecido em norma. O teste deverá ser realizado novamente ou o equipamento deverá ser enviado para manutenção.</p>
        <div class="row col"><span>Conclusão: {{ test.conclusion }}</span></div>
      </div>
    </div>
    <br><br>
  </div>
</template>

<script>
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import axios from 'axios'
// import moment from 'moment'
import { testPoints, generateDocument } from './TestAlgorithm'
// import JsPDF from 'jspdf'

export default {
  data () {
    return {
      facility: {
        name: '',
        equipments: []
      },
      test: { radioisotope: { name: '' }, responsible: { name: '' } },
      equipment: { name: '' },
      currentUser: { name: '' },
      permission: permission,
      plotPoints: [],
      calculatedPlotPoints: []
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
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

    axios.get(auth.apiUrl() + 'equipment/doseCalibratorGeometryTests/' + this.$route.params.testId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then((response) => {
      this.test = response.data
      testPoints(response.data.tests)
    })
    .catch((error) => {
      this.errors = error.data
    })

    this.currentUser = auth.currentUser()
  },

  methods: {
    exclude () {
      if (confirm('Tem certeza que deseja excluir este teste?')) {
        auth.excludeDoseCalibratorGeometryTest(this, this.test, '/equipments/doseCalibrator/' + this.equipment._id + '/geometry')
      }
    },

    genDocument () {
      generateDocument(this.test, this.facility, this.equipment, this.test.responsible)
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