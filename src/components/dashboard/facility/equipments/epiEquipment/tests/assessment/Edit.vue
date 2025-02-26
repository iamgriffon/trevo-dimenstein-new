<template>
  <div class="main">
    <div class="center">
      <div>
        <b-modal id="modal-center" centered no-close-on-backdrop no-close-on-esc hide-header hide-header-close hide-footer>
          <p class="col-12 mx-auto inline-block" style="width: fit-content">Fazendo upload do documento...</p>
          <img class="img img-fluid" src="/static/img/loading.gif">
        </b-modal>
      </div>
      <div>
        <b-modal v-model="generateTestProgressModalVisible" id="modal-uploading" centered no-close-on-backdrop no-close-on-esc hide-header hide-header-close hide-footer>
          <p class="col-12 mx-auto inline-block" style="width: fit-content">Fazendo upload das avaliações...</p>
          <div class="row pl-2 pr-2 mx-auto">
            <b-progress class="mt-2 w-90" :max="1" animated>
              <b-progress-bar :value="progress" variant="success"></b-progress-bar>
              <b-progress-bar :value="errorProgress" variant="warning"></b-progress-bar>
            </b-progress>
            <div class="centered pt-1">
              {{ `${parseInt(tests.length * (progress + errorProgress))}/${tests.length}` }}
            </div>
          </div>
          <div class="alert alert-danger mt-2" v-for="uploadError in uploadErrors">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ uploadError }}
          </div>
          <div class="mx-auto centered mt-3">
            <button class="btn btn-success btn" :disabled="progress + errorProgress < 1" @click="generateTestProgressModalVisible = false">
              <i v-if="progress + errorProgress < 1" class="fas fa-circle-notch fa-spin"></i>
              <span v-if="progress + errorProgress >= 1">fechar</span>
            </button>
          </div>
        </b-modal>
      </div>
      <div class="col-12" enctype="multipart/form-data">
        <h2>Nova Avaliação de EPIs</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/epi'"><font-awesome-icon icon="fa-solid fa-shield" /></router-link></li>
              <li class="breadcrumb-item active" aria-current="page">novo</li>
            </ol>
          </nav>
        </div>
        <div class="hyper-card mb-3">
          <div>
            <h3>Informações da Instituição</h3>
          </div>
          <div class="alert alert-danger" v-if="error">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
          </div>
          <div class="form-group mx-3">
            <label class="col-form-label" for="selectType"><i class="far fa-building" aria-hidden="true"></i> Instituição</label>
            
            <div class="input-group input-with-addon pr-1" v-if="!facility.name">
              <span class="input-addon"><span class="fas fa-search"></span></span>
              <b-input type="text" class="form-control form-with-addon" v-model="searchFacilityQuery" id="search-facility-input" placeholder="buscar..." aria-describedby="search-input"></b-input>
              <div v-if="loadingFacility" class="loading-div">
                <span><i class="fas fa-circle-notch fa-spin"></i> buscando...</span>
              </div>
              
              <div v-if="facilities.length > 0" class="loading-div">
                <button v-for="facility in facilities" :key="facility._id" replace @click="selectFacility(facility)">
                  <span class="search-result"><i class="far fa-building"></i> {{ facility.name }}</span><br/>
                </button>
              </div>
            </div>
            <input v-if="facility.name" v-model="facility.name" class="form-control" disabled>
            <button v-if="facility.name" class="btn btn-outline-danger btn-remove" @click="removeSelectedFacility()"><i class="fa fa-times" aria-hidden="true"></i></button>
          </div>
          <div class="form-group mx-3" :class="{ 'margin-top-minus' : facility.name }">
            <label class="col-form-label" for="selectType"><i class="fa fa-map-marker" aria-hidden="true"></i> Endereço</label>
            <input type="text" v-model="facilityAddress" class="form-control">
          </div>
        </div>
        <div class="hyper-card mb-3">
          <div>
            <h3>Informações do Equipamento Utilizado</h3>
          </div>
          <div class="alert alert-danger" v-if="error">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
          </div>
          <div class="form-group mx-3">
            <label class="col-form-label" for="selectType"><font-awesome-icon icon="fa-solid fa-screwdriver-wrench" /> Equipamento</label>
            <div class="alert alert-danger" v-if="errorEquipment">
              <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errorsEquipment }}
            </div>
            <div class="input-group input-with-addon pr-1" v-if="!equipmentName && !createEquipment">
              <span class="input-addon"><span class="fas fa-search"></span></span>
              <b-input type="text" class="form-control form-with-addon" v-model="searchEquipmentQuery" id="search-equipment-input" placeholder="buscar..." aria-describedby="search-input"></b-input>
              <div v-if="loadingEquipment" class="loading-div">
                <span><i class="fas fa-circle-notch fa-spin"></i> buscando...</span>
              </div>
              
              <div v-if="equipments.length > 0" class="loading-div">
                <button v-for="equipment in equipments" :key="equipment._id" replace @click="selectEquipment(equipment)">
                  <span class="search-result"><font-awesome-icon icon="fa-solid fa-screwdriver-wrench" /> {{(equipment.type) + ' - ' + ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (((equipment.serialNumber) && (equipment.patrimonialNumber)) ? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</span><br/>
                </button>
              </div>
            </div>
            <input v-if="equipmentName" v-model="equipmentName" class="form-control" disabled>
            <button v-if="equipmentName" class="btn btn-danger btn-remove" @click="removeSelectedEquipment()"><i class="fa fa-times" aria-hidden="true"></i></button>
          </div>
          <div class="row" v-if="createEquipment">
            <button class="btn mx-auto btn-outline-success" @click="closeCreateEquipment()" v-if="!equipmentName">buscar equipamento</button>
          </div>
          <br v-if="!createEquipment && !equipmentName"/>
          <hr v-if="!createEquipment && !equipmentName"/>
          <div class="row" v-if="!createEquipment">
            <button class="btn mx-auto btn-outline-success" @click="openCreateEquipment()" v-if="!equipmentName">criar novo equipamento</button>
          </div>
          <div class="row" v-if="createEquipment">
            <div class="mb-3 w-100 px-5">
              <div class="form-group">
                <label class="col-form-label" for="selectType"><i class="fas fa-cubes"></i> Tipo</label>
                <v-select v-model="equipmentType" :options="types"></v-select>
              </div>
              <div class="form-group">
                <label class="col-form-label" for=""><i class="fas fa-map-marker" aria-hidden="true"></i> Localização</label>
                <input type="text" class="form-control" placeholder="ex.: laboratório" v-model="localization">
              </div>
              <div class="form-group">
                <label class="col-form-label" for=""><i class="far fa-building" aria-hidden="true"></i> Fabricante</label>
                <input type="text" class="form-control" placeholder="" v-model="manufacturer">
              </div>
              <div class="form-group">
                <label class="col-form-label" for=""><i class="far fa-square" aria-hidden="true"></i> Modelo</label>
                <input type="text" class="form-control" placeholder="" v-model="model">
              </div>
              <div class="form-group">
                <label class="col-form-label" for=""><i class="fas fa-hashtag"></i> Número de Série</label>
                <input type="text" class="form-control" placeholder="" v-model="serialNumber">
              </div>
              <div class="form-group">
                <label class="col-form-label" for=""><i class="fas fa-hashtag"></i> Número Patrimonial</label>
                <small class="text-muted">opcional</small>
                <input type="text" class="form-control" placeholder="" v-model="patrimonialNumber">
              </div>
            </div>
            <div class="row mx-auto">
              <button class="btn btn-success" @click="registerEquipment()">Adicionar Equipamento</button>
            </div>
            <br><br>
          </div>
          <div class="form-group">
            <label class="col-form-label" for="selectType"><i class="fas fa-cubes"></i> Modo de Avaliação</label>
            <v-select v-model="avaliationMode" id="select-avaliation-mode" :options="avaliationModes"></v-select>
          </div>
        </div>
        <div class="hyper-card mb-3">
          <div v-if="!addingTest">
            <div>
              <h3>Testes</h3>
            </div>
            <div v-if="tests.length > 0" class="mb-3">
              <div v-for="test in tests">
                <div class="row justify-content-center mt-4">
                  <div class="div-line col-9">
                  {{ test.title }}
                  </div>
                  <div class="col-1 pt-1">
                    <button class="btn btn-outline-danger" @click="removeTest(test.title)"><i class="fa fa-times" aria-hidden="true"></i></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="row centralized-button">
              <button class="btn btn-outline-success btn" id="add-test-button" @click="insertTest()">Adicionar Avaliação</button>
            </div>
          </div>
          <div v-else>
            <div>
              <h3>Informações do EPI</h3>
            </div>
            <div class="alert alert-danger" v-if="error">
              <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
            </div>
            <div class="form-group mx-3">
              <label class="col-form-label" for="selectType"><i class="fa fa-list-alt" aria-hidden="true"></i> Ordem de Serviço</label>
              <input type="text" v-model="serviceOrder" id="service-order-input" class="form-control">
            </div>
            <div class="form-group mx-3">
              <label class="col-form-label" for="selectType"><i class="fas fa-cubes"></i> Equipamento (tipo de EPI)</label>
              <v-select v-model="epiType" id="epi-type-input" :options="epiTypes"></v-select>
            </div>
            <div class="form-group mx-3">
              <label class="col-form-label" for="selectType"><i class="fas fa-cubes"></i> Tamanho</label>
              <v-select v-model="size" id="size-input" :options="sizes"></v-select>
            </div>
            <div class="form-group mx-3">
              <label class="col-form-label" for="selectType"><i class="fa fa-list-alt" aria-hidden="true"></i> Cor</label>
              <input type="text" id="color-input" v-model="color" class="form-control">
            </div>
            <div class="form-group mx-3">
              <label class="col-form-label" for="selectType"><i class="fa fa-list-alt" aria-hidden="true"></i> Identificação (nº de série, patrimônio)</label>
              <input type="text" id="identification-input" v-model="identification" class="form-control">
            </div>
            <div class="form-group mx-3">
              <label class="col-form-label" for="selectType"><i class="fa fa-list-alt" aria-hidden="true"></i> CA <small class="opacity-60">opcional</small></label>
              <input type="text" id="ca-input" v-model="ca" class="form-control">
            </div>
            <div class="form-group mx-3">
              <label class="col-form-label" for="selectType"><i class="fa fa-list-alt" aria-hidden="true"></i> Setor</label>
              <input type="text" id="sector-input" v-model="sector" class="form-control">
            </div>
            <div class="form-group mx-3">
              <label class="col-form-label" for="selectType"><i class="fas fa-cubes"></i> Finalidade de Uso</label>
              <v-select v-model="useGoal" id="use-goal-input" :options="useGoals"></v-select>
            </div>
            <div class="form-group mx-3">
              <label class="col-form-label" for="selectType"><i class="fas fa-cubes"></i> Avaliação</label>
              <v-select v-model="avaliation" id="avaliation-input" :options="avaliations"></v-select>
            </div>
            <div class="row mx-2">
              <div class="form-group col-12 col-md">
                <label class="col-form-label" for="formName"><i class="far fa-calendar-alt" aria-hidden="true"></i> Data</label>
                <input type="date" class="form-control" :class="{ 'alert-form-control': invalidDate }" placeholder="" v-model="formatedDate">
              </div>
              <div class="form-group col-12 col-md">
                <label class="col-form-label" for="formName"><i class="far fa-calendar-alt" aria-hidden="true"></i> Validade</label>
                <small class="text-muted">opcional</small>
                <input type="date" class="form-control" :class="{ 'alert-form-control': invalidValidity }" placeholder="" v-model="formatedValidity">
              </div>
            </div>
            <div class="form-group mx-3">
              <label class="col-form-label" for="selectType"><i class="fa fa-list-alt" aria-hidden="true"></i>  Nome do arquivo de certificado</label>
              <input type="text" v-model="title" class="form-control">
            </div>
            <div class="row col-12 col-md-6 mt-5 mx-auto mb-4">
              <button class="btn btn-outline-success btn-block mb-3" id="save-test" @click="saveTest()">Salvar Avaliação</button>
              <button class="btn btn-outline-danger btn-block mb-3" @click="addingTest = false">Cancelar</button>
            </div>
          </div>
          <div v-if="!addingTest" class="row col-12 col-md-6 mx-auto">
            <button class="btn btn-success btn-block" :disabled="tests.length == 0" @click="finishTest()">Finalizar</button>
          </div>
          <br>
          <br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import axios from 'axios'
import moment from 'moment-timezone'
import { PDFDocument, StandardFonts } from 'pdf-lib'
// import download from 'downloadjs'
import router from '../../../../../../../routes'
import Hashids from 'hashids'

export default {
  data () {
    var now = new Date()
    now = new Date(moment.tz(now, 'America/Sao_Paulo'))
    var formatedDate = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
    return {
      currentUser: {},
      date: new Date(),
      formatedDate: formatedDate,
      formatedValidity: '',
      searchFacilityQuery: '',
      searchEquipmentQuery: '',
      title: '',
      searchQuery: '',
      loading: false,
      loadingFacility: false,
      loadingEquipment: false,
      createEquipment: false,
      invalidDate: false,
      invalidValidity: false,
      validity: '',
      serviceOrder: '',
      equipments: [],
      equipmentName: '',
      equipment: {
        _id: ''
      },
      color: '',
      identification: '',
      ca: '',
      sector: '',
      types: [],
      facilities: [],
      facilityAddress: '',
      facility: {},
      error: '',
      conclusion: 'satisfatório',
      permission: permission,
      equipmentType: '',
      equipmentTypeId: '',
      errorEquipment: false,
      errorsEquipment: '',
      equipmentFacilityAddress: '',
      avaliationMode: '',
      avaliationModes: [ 'Escopia', 'Grafia', 'Scout' ],
      epiType: '',
      epiTypes: [
        'Avental Plumbífero', 'Protetor de Tireoide', 'Protetor de Gônadas', 'Avental Sobretudo Plumbífero', 'Luvas Plumbíferas', 'Óculos Plumbífero', 'Colete Plumbífero', 'Saiote Plumbífero', 'Avental Plumbífero Odontológico (Babador)'
      ],
      sizes: [ 'Adulto', 'Infantil' ],
      size: '',
      useGoals: [
        'Radiologia convencional', 'Radiologia odontológica geral', 'Radiologia odontológica intraoral', 'Radiologia Intervencionista'
      ],
      useGoal: '',
      avaliations: [ 'Satisfatório', 'Substituição Não Imediata', 'Substituição Imediata', 'Reparar' ],
      avaliation: '',
      addingTest: false,
      tests: [],
      progress: 0,
      errorProgress: 0,
      uploadErrors: [],
      generateTestProgressModalVisible: false
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.equipmentId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.equipment = ''
      } else {
        console.log(response.data)
        this.equipment = response.data
        this.type = response.data.type
        this.typeId = response.data.typeId
        this.manufacturer = response.data.manufacturer
        this.model = response.data.model
        this.serialNumber = response.data.serialNumber
        this.serialNumberTube = response.data.serialNumberTube
        this.patrimonialNumber = response.data.patrimonialNumber
        this.localization = response.data.localization
        this.calibrationCertificateNumber = response.data.calibrationCertificateNumber
        this.certificateValidity = response.data.certificateValidity
        this.probe = response.data.probe
        this.exposureProbeSerialNumber = response.data.exposureProbeSerialNumber
        this.contaminationProbeSerialNumber = response.data.contaminationProbeSerialNumber
        this.intrinsicSpatialResolutionAndLinearity = response.data.intrinsicSpatialResolutionAndLinearity
        this.angulation = response.data.angulation
        this.planeSensibility = response.data.planeSensibility
        this.overallPerformance = response.data.overallPerformance
        this.tableVelocity = response.data.tableVelocity
        this.maximumCountingRate = response.data.maximumCountingRate
        this.energeticResolution = response.data.energeticResolution
        this.spatialCoRegistrationForMultienergeticSources = response.data.spatialCoRegistrationForMultienergeticSources
        this.extrinsicUniformityOfHighCountingRate = response.data.extrinsicUniformityOfHighCountingRate
        this.asymmetricWindows = response.data.asymmetricWindows
        this.uniformityForDifferentRadioisotopes = response.data.uniformityForDifferentRadioisotopes
        this.linearityAndExtrinsicSpatialResolution = response.data.linearityAndExtrinsicSpatialResolution
        this.pixelSize = response.data.pixelSize
        this.shieldingSystem = response.data.shieldingSystem
        this.mostUsedRadioisotope = response.data.mostUsedRadioisotope

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

        axios.get(auth.apiUrl() + 'typeOfEquipment', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
        .then(resp => {
          if (resp.data.length === 0) {
            this.errors = 'Nenhum resultado encontrado'
            this.listOfTypesOfEquipment = ''
          } else {
            this.listOfTypesOfEquipment = resp.data
            for (let i = 0; i < resp.data.length; i++) {
              this.types.push(resp.data[i].name)
            }
            this.types.sort()
          }
        })
        .catch(error => {
          this.errors = error.data
          this.listOfTypesOfEquipment = ''
        })

        axios.get(auth.apiUrl() + 'equipment/epiAvaliation/' + this.$route.params.testId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
        .then(response => {
          if (response.data.length === 0) {
            this.errors = 'Nenhum resultado encontrado'
            this.test = ''
          } else {
            console.log('epiAvaliation:', response.data)
            // this._id = response.data._id
            // this.status = response.data.status
            // this.tests = response.data.tests
            // this.radioisotope = response.data.radioisotope
            // this.date = moment(response.data.date).format('YYYY-MM-DD')
            // this.responsible = { label: response.data.responsible.name, name: response.data.responsible.name, _id: response.data.responsible._id }
            // this.testPoints(response.data.tests)
          }
        })
        .catch(error => {
          this.errors = error.data
          this.test = ''
        })
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

    this.currentUser = auth.currentUser()
  },

  // created () {
  //   this.currentUser = auth.currentUser()
  //   axios.get(auth.apiUrl() + 'typeOfEquipment', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
  //   .then(response => {
  //     if (response.data.length === 0) {
  //       this.errors = 'Nenhum resultado encontrado'
  //       this.listOfTypesOfEquipment = ''
  //     } else {
  //       this.listOfTypesOfEquipment = response.data

  //       for (let i = 0; i < response.data.length; i++) {
  //         this.types.push(response.data[i].name)
  //       }
  //       this.types.sort()
  //     }
  //   })
  //   .catch(error => {
  //     this.error = true
  //     this.errors = error.data
  //     this.listOfTypesOfEquipment = ''
  //   })
  // },
  watch: {
    searchFacilityQuery (value) {
      this.searchFacility(value)
    },
    searchEquipmentQuery (value) {
      this.searchEquipment(value)
    },
    equipmentType: function (newVal, oldVal) {
      for (let i = 0; i < this.listOfTypesOfEquipment.length; i++) {
        if (newVal === this.listOfTypesOfEquipment[i].name) {
          this.equipmentTypeId = this.listOfTypesOfEquipment[i]._id
        }
      }
    },
    equipmentName () {
      const now = new Date()
      this.title = `${now.getFullYear()}_${(now.getMonth() + 1)}_${now.getDate()}_Certificado_${this.identification || ''}`
    },
    useGoal (val) {
      if (val === 'Radiologia convencional' || val === 'Radiologia odontológica geral') {
        const date = new Date(this.date.getTime())
        this.validity = new Date(date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)))
        this.validity = new Date(moment.tz(this.validity, 'America/Sao_Paulo'))
        this.formatedValidity = this.validity.getFullYear() + '-' + ('0' + (this.validity.getMonth() + 1)).slice(-2) + '-' + ('0' + this.validity.getDate()).slice(-2)
      }
      if (val === 'Radiologia odontológica intraoral') {
        const date = new Date(this.date.getTime())
        this.validity = new Date(date.setTime(date.getTime() + (2 * 365.5 * 24 * 60 * 60 * 1000)))
        this.validity = new Date(moment.tz(this.validity, 'America/Sao_Paulo'))
        this.formatedValidity = this.validity.getFullYear() + '-' + ('0' + (this.validity.getMonth() + 1)).slice(-2) + '-' + ('0' + this.validity.getDate()).slice(-2)
      }
      if (val === 'Radiologia Intervencionista') {
        const date = new Date(this.date.getTime())
        this.validity = new Date(date.setTime(date.getTime() + (0.5 * 365.5 * 24 * 60 * 60 * 1000)))
        this.validity = new Date(moment.tz(this.validity, 'America/Sao_Paulo'))
        this.formatedValidity = this.validity.getFullYear() + '-' + ('0' + (this.validity.getMonth() + 1)).slice(-2) + '-' + ('0' + this.validity.getDate()).slice(-2)
      }
    },
    formatedDate (val) {
      let date = new Date(val)
      date = new Date(date.setHours(date.getHours() + 3))
      this.date = new Date(moment.tz(date, 'America/Sao_Paulo'))
      this.title = `${this.date.getFullYear()}_${(this.date.getMonth() + 1)}_${this.date.getDate()}_Certificado_${this.identification || ''}`
    },
    identification () {
      this.title = `${this.date.getFullYear()}_${(this.date.getMonth() + 1)}_${this.date.getDate()}_Certificado_${this.identification || ''}`
    },
    formatedValidity (val) {
      let date = new Date(val)
      date = new Date(date.setHours(date.getHours() + 3))
      this.validity = new Date(moment.tz(date, 'America/Sao_Paulo'))
    }
  },

  methods: {
    searchFacility (value) {
      if (value) {
        if (value.length > 3) {
          this.loadingFacility = true
          axios.get(auth.apiUrl() + 'search/' + value, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
          .then(response => {
            if (response.data.length === 0) {
              this.errors = 'Nenhum resultado encontrado'
              this.facilities = ''
              this.loadingFacility = false
            } else {
              this.facilities = response.data.facilities
              this.loadingFacility = false
            }
          })
          .catch(error => {
            this.errors = error.response.data
            this.facilities = ''
            this.loadingFacility = false
          })
        }
      } else {
        this.facilities = []
      }
    },
    searchEquipment (value) {
      if (value) {
        if (value.length > 3) {
          this.loadingEquipment = true
          axios.get(auth.apiUrl() + 'search/' + value, { headers: { Authorization: 'Bearer ' + auth.getToken() } })
          .then(response => {
            if (response.data.length === 0) {
              this.errors = 'Nenhum resultado encontrado'
              this.equipments = ''
              this.loadingEquipment = false
            } else {
              this.equipments = response.data.equipments
              this.loadingEquipment = false
            }
          })
          .catch(error => {
            this.errors = error.response.data
            this.equipments = ''
            this.loadingEquipment = false
          })
        }
      } else {
        this.equipments = []
      }
    },
    selectFacility (facility) {
      this.errorEquipment = false
      this.facility = facility
      this.facilityAddress = facility.address[0].street + ', ' + facility.address[0].number + (facility.address[0].complement ? ', ' + facility.address[0].complement : '') + ', ' + facility.address[0].city + ' - ' + facility.address[0].state
    },
    removeSelectedFacility () {
      this.facility = {}
    },
    selectEquipment (equipment) {
      this.searchFacilityQuery = ''
      this.equipment = equipment
      this.equipmentName = (equipment.type) + ' - ' + (equipment.patrimonialNumber ? equipment.patrimonialNumber : '') + (((equipment.serialNumber) && (equipment.patrimonialNumber)) ? ' - ' : '') + (equipment.serialNumber ? equipment.serialNumber : '')
      this.getFacilityEquipmentAddress(equipment)

      if (equipment.avaliationMode) {
        this.avaliationMode = equipment.avaliationMode
      }
    },

    getFacilityEquipmentAddress (equipment) {
      if (equipment) {
        if (equipment.facility) {
          if (equipment.facility._id) {
            axios.get(auth.apiUrl() + 'facility/' + equipment.facility._id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
            .then(response => {
              const facility = response.data
              const val = facility.address[0].street + ', ' + facility.address[0].number + (facility.address[0].complement ? ', ' + facility.address[0].complement : '') + ', ' + facility.address[0].city + ' - ' + facility.address[0].state
              this.equipmentFacilityAddress = val
            })
            .catch(error => {
              this.errors = error.data
              this.facility = ''
            })
          }
        }
      }
    },

    toBarsDate (date) {
      if (date.length === 10) {
        return `${date.substring(8, 10)}/${date.substring(5, 7)}/${date.substring(0, 4)}`
      }
    },

    removeSelectedEquipment () {
      this.searchEquipmentQuery = ''
      this.equipment = { _id: '' }
      this.equipmentName = ''
    },
    openCreateEquipment () {
      if (!this.facility.name) {
        this.errorEquipment = true
        this.errorsEquipment = 'É necessário selecionar a instituição'
      } else {
        this.errorEquipment = false
        this.createEquipment = true
      }
    },
    closeCreateEquipment () {
      this.createEquipment = false
    },
    async registerEquipment () {
      var data = {
        type: this.equipmentType,
        typeId: this.equipmentTypeId,
        manufacturer: this.manufacturer,
        model: this.model,
        serialNumber: this.serialNumber,
        serialNumberTube: this.serialNumberTube,
        patrimonialNumber: this.patrimonialNumber,
        localization: this.localization,
        avaliationMode: this.avaliationMode,
        facility: { _id: this.facility._id }
      }
      const rEquipment = await auth.registerEquipment(this, data)
      this.equipment = await rEquipment
      this.equipmentName = await (rEquipment.type) + ' - ' + (rEquipment.patrimonialNumber ? rEquipment.patrimonialNumber : '') + (((rEquipment.serialNumber) && (rEquipment.patrimonialNumber)) ? ' - ' : '') + (rEquipment.serialNumber ? rEquipment.serialNumber : '')
      this.createEquipment = false
    },

    async generateTest (test) {
      const url = 'https://radimenstein-trevo-s3.s3.amazonaws.com/epiEquipmentAvaliation4.pdf'
      const existingPdfBytes4 = await fetch(url).then(res => res.arrayBuffer())

      const pdfDoc = await PDFDocument.load(existingPdfBytes4)
      const timesFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]

      const { width, height } = firstPage.getSize()
      firstPage.drawText(test.serviceOrder, {
        x: width / 2 - 193,
        y: height / 2 + 334,
        size: 14,
        font: timesFont
      })

      firstPage.drawText(this.facility.companyName, {
        x: width / 2 - 240,
        y: height / 2 + 304,
        size: 14,
        font: timesFont
      })

      if (this.facilityAddress.length > 70) {
        firstPage.drawText(this.facilityAddress.slice(0, 70), {
          x: width / 2 - 245,
          y: height / 2 + 274,
          size: 14,
          font: timesFont
        })
        firstPage.drawText(this.facilityAddress.slice(71), {
          x: width / 2 - 245,
          y: height / 2 + 274 - 20,
          size: 14,
          font: timesFont
        })
      } else {
        firstPage.drawText(this.facilityAddress, {
          x: width / 2 - 245,
          y: height / 2 + 274,
          size: 14,
          font: timesFont
        })
      }

      firstPage.drawText(this.equipment.type || '', {
        x: width / 2 - 220,
        y: height / 2 + 183 - 15,
        size: 14,
        font: timesFont
      })

      firstPage.drawText(this.equipment.manufacturer, {
        x: width / 2 - 270,
        y: height / 2 + 154 - 15,
        size: 14,
        font: timesFont
      })

      firstPage.drawText(this.equipment.model, {
        x: width / 2 + 40,
        y: height / 2 + 154 - 15,
        size: 14,
        font: timesFont
      })

      firstPage.drawText(this.equipment.serialNumber, {
        x: width / 2 - 238,
        y: height / 2 + 125 - 15,
        size: 14,
        font: timesFont
      })

      if (this.equipment.patrimonialNumber) {
        firstPage.drawText(this.equipment.patrimonialNumber, {
          x: width / 2 + 60,
          y: height / 2 + 125 - 15,
          size: 14,
          font: timesFont
        })
      }

      if (this.avaliationMode) {
        firstPage.drawText(this.avaliationMode, {
          x: width / 2 - 188,
          y: height / 2 + 95 - 15,
          size: 14,
          font: timesFont
        })
      }

      if (this.equipmentFacilityAddress) {
        if (this.equipmentFacilityAddress.length > 70) {
          firstPage.drawText(this.equipmentFacilityAddress.slice(0, 70), {
            x: width / 2 - 232,
            y: height / 2 + 67 - 15,
            size: 14,
            font: timesFont
          })
          firstPage.drawText(this.equipmentFacilityAddress.slice(71), {
            x: width / 2 - 232,
            y: height / 2 + 67 - 15 - 20,
            size: 14,
            font: timesFont
          })
        } else {
          firstPage.drawText(this.equipmentFacilityAddress, {
            x: width / 2 - 232,
            y: height / 2 + 67 - 15,
            size: 14,
            font: timesFont
          })
        }
      }

      firstPage.drawText(test.epiType, {
        x: width / 2 - 225,
        y: height / 2 - 105 - 15 - 15,
        size: 14,
        font: timesFont
      })

      firstPage.drawText(test.size, {
        x: width / 2 - 250,
        y: height / 2 - 134 - 15 - 15,
        size: 14,
        font: timesFont
      })

      firstPage.drawText(test.sector, {
        x: width / 2 + 77,
        y: height / 2 - 134 - 15 - 15,
        size: 14,
        font: timesFont
      })

      firstPage.drawText(test.identification, {
        x: width / 2 + 127,
        y: height / 2 - 163 - 15 - 15,
        size: 14,
        font: timesFont
      })

      firstPage.drawText(test.color, {
        x: width / 2 - 288,
        y: height / 2 - 163 - 15 - 15,
        size: 14,
        font: timesFont
      })

      if (test.ca !== '') {
        firstPage.drawText(test.ca, {
          x: width / 2 + 60,
          y: height / 2 - 193 - 15 - 15,
          size: 14,
          font: timesFont
        })
      }

      firstPage.drawText(test.useGoal, {
        x: width / 2 - 193,
        y: height / 2 - 193 - 15 - 15,
        size: 14,
        font: timesFont
      })

      firstPage.drawText(test.avaliation, {
        x: width / 2 - 250,
        y: height / 2 - 221 - 15 - 15,
        size: 14,
        font: timesFont
      })

      if (test.avaliation === 'Satisfatório') {
        firstPage.drawText('Encontra-se íntegro e de acordo com as normas da ANVISA.', {
          x: width / 2 - 243,
          y: height / 2 - 250 - 15 - 15,
          size: 14,
          font: timesFont
        })
      }

      if (test.avaliation === 'Substituição Não Imediata') {
        firstPage.drawText('Apresenta rachadura(s) com menos de 1,0 cm de tamanho e/ou sinais de início de perda', {
          x: width / 2 - 243,
          y: height / 2 - 250 - 15 - 15,
          size: 14,
          font: timesFont
        })

        firstPage.drawText('de integridade. Deve ser monitorado e reavaliado em um período máximo de um (01) ano,', {
          x: width / 2 - 243,
          y: height / 2 - 270 - 15 - 15,
          size: 14,
          font: timesFont
        })

        firstPage.drawText('e deve ser feita uma previsão para a substituição do mesmo.', {
          x: width / 2 - 243,
          y: height / 2 - 290 - 15 - 15,
          size: 14,
          font: timesFont
        })
      }

      if (test.avaliation === 'Substituição Imediata') {
        firstPage.drawText('Apresenta rachadura(s) com mais de 1,0 cm de tamanho e/ou perda considerável de', {
          x: width / 2 - 243,
          y: height / 2 - 250 - 15 - 15,
          size: 14,
          font: timesFont
        })

        firstPage.drawText('integridade. Recomenda-se imediata retirada de uso e substituição do EPI.', {
          x: width / 2 - 243,
          y: height / 2 - 270 - 15 - 15,
          size: 14,
          font: timesFont
        })
      }

      if (test.avaliation === 'Reparar') {
        firstPage.drawText('A malha plumbífera encontra-se íntegra, entretanto o tecido, costuras ou fechos estão', {
          x: width / 2 - 243,
          y: height / 2 - 250 - 15 - 15,
          size: 14,
          font: timesFont
        })

        firstPage.drawText('danificados. Recomenda-se que o EPI seja retirado temporariamente de uso e consertado.', {
          x: width / 2 - 243,
          y: height / 2 - 270 - 15 - 15,
          size: 14,
          font: timesFont
        })

        firstPage.drawText('O fabricante deve ser consultado para verificar a melhor  forma de reparo. Caso não seja', {
          x: width / 2 - 243,
          y: height / 2 - 290 - 15 - 15,
          size: 14,
          font: timesFont
        })
        firstPage.drawText('possível/viável o conserto, retirar de uso.', {
          x: width / 2 - 243,
          y: height / 2 - 310 - 15 - 15,
          size: 14,
          font: timesFont
        })
      }

      firstPage.drawText(this.toBarsDate(test.formatedDate), { // `${this.date.getDate()}/` + (this.date.getMonth() < 9 ? '0' + (parseInt(this.date.getMonth()) + 1) : parseInt(this.date.getMonth()) + 1) + `/${this.date.getFullYear()}`, {
        x: width / 2 - 110 - 130,
        y: height / 2 - 344 - 8 - 15 - 15,
        size: 14,
        font: timesFont
      })

      firstPage.drawText(this.toBarsDate(test.formatedValidity), { // `${this.validity.getDate()}/` + (this.validity.getMonth() < 9 ? '0' + (parseInt(this.validity.getMonth()) + 1) : parseInt(this.validity.getMonth()) + 1) + `/${this.validity.getFullYear()}`, {
        x: width / 2 - 110 - 138,
        y: height / 2 - 364 - 8 - 15 - 15,
        size: 14,
        font: timesFont
      })

      var hashids = new Hashids('AKJSBDalsdabskJASd', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
      const hash = hashids.encode(Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1))

      const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true })
      const credentials = {
        name: test.title.split(' ').join('_').split('/').join('-'),
        date: moment(this.date).format(),
        data: pdfBytes,
        uploadedAt: new Date(),
        uploadedBy: {_id: this.currentUser.id, name: this.currentUser.name},
        signedBy: {_id: this.currentUser.id, name: this.currentUser.name},
        liberatedBy: {_id: this.currentUser.id, name: this.currentUser.name},
        signedAt: new Date(),
        mode: 'first',
        position: 'bl',
        hash: hash,
        scheduledEmail: true,
        status: 'Liberado',
        conclusion: test.avaliation,
        validity: moment(test.validity).format(),
        facility: { _id: this.facility._id, name: this.facility.name },
        equipment: { _id: this.equipment._id, name: this.equipment.serialNumber },
        test: { _id: '5cb5d3865e719264dd704b67', name: 'Controle de Qualidade (Radiologia Geral)' }
      }

      const regDoc = await auth.registerDocument(this, credentials)
      if (regDoc.status === 200) {
        return true
      } else {
        return false
      }
      // this.loading = false
    },

    async finishTest () {
      if (this.tests.length > 0) {
        if (confirm(`Tem certeza que deseja finalizar os ${this.tests.length} testes?`)) {
          this.generateTestProgressModalVisible = true

          const timeoutPromise = (test) => new Promise(resolve => {
            setTimeout(async () => {
              let genTest = await this.generateTest(test)
              if (genTest) {
                this.progress += 1 / this.tests.length
                if (this.progress >= 1) {
                  this.generateTestProgressModalVisible = false
                  setTimeout(() => {
                    router.push({ path: '/equipments/epi' })
                  }, 1000)
                }
              } else {
                this.errorProgress += 1 / this.tests.length
                this.uploadErrors.push(`Houve um problema ao realizar o upload da avaliação ${test.title}.`)
              }
              resolve()
            }, 1000)
          })

          for (const test of this.tests) {
            await timeoutPromise(test)
          }
        }
      }
    },

    insertTest () {
      this.addingTest = true
    },
    saveTest () {
      if (!this.title) {
        window.alert('Nome é obrigatório')
        return
      }

      if (!this.serviceOrder) {
        window.alert('Ordem de Serviço é obrigatório')
        return
      }

      if (!this.facility.name) {
        window.alert('Instituição é obrigatório')
        return
      }

      if (!this.facilityAddress) {
        window.alert('Endereço da Instituição é obrigatório')
        return
      }

      if (!this.equipmentName) {
        window.alert('Equipamento é obrigatório')
        return
      }

      if (!this.size) {
        window.alert('Tamanho é obrigatório')
        return
      }

      if (!this.color) {
        window.alert('Cor é obrigatório')
        return
      }

      if (!this.identification) {
        window.alert('Identificação é obrigatório')
        return
      }

      if (!this.sector) {
        window.alert('Setor é obrigatório')
        return
      }

      if (!this.avaliation) {
        window.alert('Avaliação é obrigatória')
        return
      }

      if (!this.date) {
        window.alert('Data é obrigatória')
        return
      }

      if (!this.validity) {
        window.alert('Validade é obrigatória')
        return
      }

      const currentTest = {
        serviceOrder: this.serviceOrder,
        epiType: this.epiType,
        size: this.size,
        color: this.color,
        identification: this.identification,
        ca: this.ca,
        sector: this.sector,
        useGoal: this.useGoal,
        avaliation: this.avaliation,
        formatedDate: this.formatedDate,
        formatedValidity: this.formatedValidity,
        title: this.title
      }
      let now = new Date()
      now = new Date(moment.tz(now, 'America/Sao_Paulo'))
      this.serviceOrder = ''
      this.epiType = ''
      this.size = ''
      this.color = ''
      this.identification = ''
      this.ca = ''
      this.sector = ''
      this.useGoal = ''
      this.avaliation = ''
      this.formatedDate = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
      this.formatedValidity = ''
      this.title = ''
      this.tests.push(currentTest)
      this.addingTest = false
    },
    removeTest (title) {
      const tempTests = this.tests.filter(test => { return test.title !== title })
      this.tests = tempTests
    }
  }
}
</script>

<style>
.lateral-label {
  max-width: 60px;
}

.loading-div {
  z-index: 99;
  top: 37px;
  flex-direction: column;
  background: white;
  position: absolute;
  width: 99%;
  border: solid 1px #0F181C30;
  padding-left: 8px;
  color: #0F181C;
}
.loading-div button {
  padding-top: 5px;
  padding-bottom: 5px; 
  text-align: left;
  width: 100%;
  flex: 1;
  background-color: transparent;
  border: none;
}
.loading-div button:focus {
  outline: 2px auto #00a767;
}
.search-result {
  color: #0F181C60;
  cursor: pointer;
}

.search-result:hover {
  color: #00a767;
}

.btn-remove {
  position: relative;
  top: -37px;
  left: 96%;
}

.margin-top-minus {
  margin-top: -36px;
}
.opacity-60 {
  opacity: 0.5;
}
.centralized-button {
  margin-bottom: 40px;
  flex: 1;
  justify-content: center;
}
.div-line {
  border: 1px solid #CCC;
  padding: 10px;
  margin-left: 15px;
  border-radius: 3px;
}

.centered {
  flex: 1;
  text-align: center;
  justify-content: center;
  margin: 0 auto;
}
.w-90 {
  width: 90%;
}
</style>../../../../../../../../services/permissions