<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col">
        <h1>{{ equipment.type + ' ' + ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</h1>
        <h2>Exatidão e Precisão - {{ test.date | moment('MM-YYYY') }}</h2>
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
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name || '' }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments/doseCalibrator/'">{{ equipment.type }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/doseCalibrator/' + equipment._id + '/accuracyandprecision/'">exatidão e precisão</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ test.date | moment('MM-YYYY') }}</li>
        </ol>
      </nav>
    </div>

    <div class="row ml-md-3">
      <div class="col mb-3 pl-sm-1">
        <div class="hyper-card mb-3">
          <h5 class="mb-3">Informações:</h5>
          <p>Data de Realização: {{ test.date | moment('DD/MM/YYYY')  }}</p>
          <p>Responsável: {{ test.responsible.name }}</p>
        </div>
      </div>
    </div>

    <div class="row ml-md-3">
      <div class="col-12 col-md-4 mb-3 pl-sm-1" v-for="source in sources">
        <div class="hyper-card mb-3">
          <div class="row">
            <div class="col">
              <h5 class="mb-3">{{ source.radioisotope}} </h5>
            </div>
          </div>
          <p class="pl-3"><i class="fas fa-hashtag" aria-hidden="true"></i> Número de Série: {{ source.serialNumber }}</p>
          <p class="pl-3"><i class="fas fa-asterisk" aria-hidden="true"></i> Atividade Inicial: {{ source.initialActivity }} (µCi)</p>
          <p class="pl-3"><i class="far fa-calendar" aria-hidden="true"></i> Data da Atividade Inicial: {{ source.initialActivityDate | moment('DD/MM/YY') }}</p>
        </div>
      </div>
    </div>

    <div class="col">
      <div class="col-12 row ml-2 mr-2 mb-2">
        <div class="col"></div>
        <div class="col">Co(57)</div>
        <div class="col">Ba(133)</div>
        <div class="col">Cs(137)</div>
      </div>
      <div class="col-12 row ml-2 mr-2 mb-2">
        <div class="col"></div>
        <div class="col">Atividade (µCi)</div>
        <div class="col">Precisão (%)</div>
        <div class="col">Medida (µCi)</div>
        <div class="col">Precisão (%)</div>
        <div class="col">Medida (µCi)</div>
        <div class="col">Precisão (%)</div>
      </div>
      <div class="hyper-card col-12 row ml-2 mr-2 mb-2" v-for="i in numbers">
        <div class="col">{{ i }}:</div>
        <div class="col">{{ Array.isArray(test.measureCo) ? test.measureCo[i] : '' }}</div>
        <div class="col">{{ Array.isArray(test.precisionCo) ? parseFloat(test.precisionCo[i]).toFixed(2) : test.precisionCo ? parseFloat(test.precisionCo.split(",")[i]).toFixed(2) : '' }}</div>
        <div class="col">{{ Array.isArray(test.measureBa) ? test.measureBa[i] : '' }}</div>
        <div class="col">{{ Array.isArray(test.precisionBa) ?  parseFloat(test.precisionBa[i]).toFixed(2) : test.precisionBa ? parseFloat(test.precisionBa.split(",")[i]).toFixed(2) : '' }}</div>
        <div class="col">{{ Array.isArray(test.measureCs) ? test.measureCs[i] : '' }}</div>
        <div class="col">{{ Array.isArray(test.precisionCs) ? parseFloat(test.precisionCs[i]).toFixed(2) : test.precisionBa ? parseFloat(test.precisionCs.split(",")[i]).toFixed(2): '' }}</div>
      </div>
      <div class="hyper-card col-12 row ml-2 mr-2 mb-2">
        <div class="col">Exatidão: </div>
        <div class="col">{{ test.accuracyCo + '%' }}</div>
        <div class="col"></div>
        <div class="col">{{ test.accuracyBa + '%' }}</div>
        <div class="col"></div>
        <div class="col">{{ test.accuracyCs + '%' }}</div>
        <div class="col"></div>
      </div>
    </div>
    <br><br>

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
import { generateDocument } from './TestAlgorithm'

export default {
  data () {
    return {
      numbers: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
      facility: {
        equipments: []
      },
      test: { radioisotope: { name: '' }, responsible: { name: '' } },
      equipment: {},
      currentUser: {},
      sources: [],
      permission: permission
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

    axios.get(auth.apiUrl() + 'equipment/doseCalibratorAccuracyAndPrecisionTests/' + this.$route.params.testId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.test = ''
      } else {
        this.test = response.data
        if (response.data.sourceBa) {
          this.sources.push(response.data.sourceBa)
        }
        if (response.data.sourceCo) {
          this.sources.push(response.data.sourceCo)
        }
        if (response.data.sourceCs) {
          this.sources.push(response.data.sourceCs)
        }
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
        auth.excludeDoseCalibratorAccuracyAndPrecisionTest(this, this.test, '/equipments/doseCalibrator/' + this.equipment._id + '/accuracyandprecision')
      }
    },

    genDocument () {
      generateDocument(this.test, this.facility, this.equipment)
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