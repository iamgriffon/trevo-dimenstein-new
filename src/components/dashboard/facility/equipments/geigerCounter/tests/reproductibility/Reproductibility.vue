<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col">
        <h1>{{ equipment.type + ' ' + ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</h1>
        <h2>Reprodutibilidade - {{ test.month }}</h2>
      </div>
      <div class="col text-right">
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
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/geigerCounter/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/geigerCounter/' + equipment._id + '/reproductibility/'">reprodutibilidade</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ test.month }}</li>
        </ol>
      </nav>
    </div>

    <div class="row ml-md-3">
      <div class="col mb-3 pl-sm-1">
        <div class="hyper-card mb-3">
          <h5 class="mb-3">Informações:</h5>
          <p class="pl-3"><i class="far fa-calendar-alt" aria-hidden="true"></i> {{ test.date | moment('DD/MM/YYYY') }}</p>
          <p class="pl-3"><i class="far fa-calendar-alt" aria-hidden="true"></i> {{ test.month }}</p>
          <p class="pl-3"><i class="fab fa-react" aria-hidden="true"></i> {{ test.probe }}</p>
          <p class="pl-3"><i class="fab fa-react" aria-hidden="true"></i> {{ test.scale }}</p>
          <p class="pl-3"><i class="fab fa-react" aria-hidden="true"></i> {{ test.radioactiveSource + '-' + test.radioactiveSourceSerialNumber }}</p>
          <p class="pl-3"><i class="far fa-user" aria-hidden="true"></i> {{ test.responsible.name }}</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table table-responsive hyper-table col-12 w-100">
          <thead>
            <tr>
              <th>Medidas</th>
              <th>{{ test.probe + ' (' + test.scale + ')' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in numbers" class="text-center">
              <td>{{ i }}</td>
              <td>{{ test.measures[i] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row col pr-0">
      <div class="hyper-card col ml-3 mr-0">
        <h5 class="mb-3">Resultado:</h5>
        <p>Variação: {{ parseFloat(test.variation).toFixed(2) }}% </p>
        <p v-if="test.conclusion === 'satisfatório'"> Todos os resultados apresentaram desvio menor que o estabelecido em norma.</p>
        <p v-else> Os resultados apresentaram desvio maior que o estabelecido em norma. O equipamento deverá ser enviado para manutenção e/ou calibração.</p>
        <div class="row col"><span>Conclusão: {{ test.conclusion }}</span></div>
      </div>
    </div>
    <br>
    <div class="row col pr-0" v-if="test.observations !== ''">
      <div class="hyper-card col ml-3 mr-0">
        <h5 class="mb-3">Observações:</h5>
        <p>{{ test.observations }}</p>
      </div>
    </div>
    <br><br>
  </div>
</template>

<script>
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import axios from 'axios'

export default {
  data () {
    return {
      numbers: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
      facility: {
        name: '',
        equipments: []
      },
      test: { radioisotope: { name: '' }, responsible: { name: '' } },
      equipment: {},
      currentUser: {},
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

    axios.get(auth.apiUrl() + 'equipment/geigerCounterReproductibilityTests/' + this.$route.params.testId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
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

    this.currentUser = auth.currentUser()
  },

  methods: {
    exclude () {
      if (confirm('Tem certeza que deseja excluir este teste?')) {
        auth.excludeGeigerCounterReproductibilityTest(this, this.test, '/equipments/geigerCounter/' + this.equipment._id + '/reproductibility')
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
../../../../../../../../services/permissions