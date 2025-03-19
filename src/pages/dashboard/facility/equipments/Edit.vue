<!-- src/components/Login.vue -->
<template>
  <div class="main">
    <div class="center">
      <div class="col-12" enctype="multipart/form-data">
        <h2>Editar Equipamento</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/' + translateTypeParam(equipment.type)">{{ equipment.type }}</router-link></li>
              <li class="breadcrumb-item active"><router-link :to="'/facility/' + facility._id+ '/equipments/' + translateTypeParam(equipment.type) + '/' + equipment._id">{{ equipment.patrimonialNumber }}</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">editar</li>
            </ol>
          </nav>
        </div>
        <div class="alert alert-danger" v-if="error">
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ error }}
        </div>
        <div class="hyper-card mb-3">
          <div class="form-group">
            <label class="col-form-label" for="selectType"><i class="fas fa-cubes"></i> Tipo</label>
            <v-select v-model="type" :options="types"></v-select>
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
            <label class="col-form-label" for=""><i class="fas fa-hashtag"></i> Número de Série Tubo</label>
            <small class="text-muted">opcional</small>
            <input type="text" class="form-control" placeholder="" v-model="serialNumberTube">
          </div>
          <div class="form-group">
            <label class="col-form-label" for=""><i class="fas fa-hashtag"></i> Número Patrimonial</label>
            <small class="text-muted">opcional</small>
            <input type="text" class="form-control" placeholder="" v-model="patrimonialNumber">
          </div>
        </div>

        <div class="hyper-card mb-3" v-if="type">
          <h3>Informações específicas - {{ type }}</h3>
          <!-- Calibrador de Doses -->
          <div class="form-group" v-if="type === 'Calibrador de Doses'">
            <label class="col-form-label" for="selectType"><i class="fab fa-react"></i> Isótopo mais utilizado neste calibrador</label>
            <v-select v-model="mostUsedRadioisotope" :options="mostUsedRadioisotopes"></v-select>
          </div>
          <!-- Contador Geiger -->
          <div class="form-group" v-if="type === 'Contador Geiger'">
            <label class="col-form-label" for=""><i class="fas fa-hashtag" aria-hidden="true"></i> Número do Certificado de Calibração</label>
            <small class="text-muted">opcional</small>
            <input type="text" class="form-control" placeholder="" v-model="calibrationCertificateNumber">
          </div>
          <div class="form-group" v-if="type === 'Contador Geiger'">
            <label class="col-form-label" for=""><i class="far fa-calendar" aria-hidden="true"></i> Validade do Certificado</label>
            <small class="text-muted">opcional</small>
            <input type="date" class="form-control" placeholder="" v-model="certificateValidity">
          </div>
          <div class="form-group" v-if="type === 'Contador Geiger'">
            <label class="col-form-label" for="selectType"><i class="fab fa-react"></i> Sondas</label>
            <v-select v-model="probe" :options="probes"></v-select>
          </div>
          <div class="form-group" v-if="probe === 'Exposição' || probe === 'Exposição e Contaminação'">
            <label class="col-form-label" for="selectType"><i class="fas fa-hashtag"></i> Número de Série da Sonda de Exposição</label>
            <input type="text" class="form-control" placeholder="" v-model="exposureProbeSerialNumber">
          </div>
          <div class="form-group" v-if="probe === 'Contaminação' || probe === 'Exposição e Contaminação'">
            <label class="col-form-label" for="selectType"><i class="fas fa-hashtag"></i> Número de Série da Sonda de Contaminação</label>
            <input type="text" class="form-control" placeholder="" v-model="contaminationProbeSerialNumber">
          </div>
          <!-- Gama Camara -->
          <div class="form-group" v-if="type === 'Gama Camara'">
            <label class="col-form-label" for="selectType"><i class="fab fa-react"></i> Número de Detectores</label>
            <v-select v-model="numberOfDetectors" :options="[ '1', '2' ]"></v-select>
          </div>
          <div class="form-group" v-if="type === 'Gama Camara'">
            <label class="col-form-label" for="selectType"><i class="fab fa-react"></i> Número de Pares de Colimadores</label>
            <v-select v-model="numberOfPairsOfCollimators" :options="[ '1', '2', '3', '4' ]"></v-select>
          </div>
          <div class="form-group" v-if="type === 'Gama Camara' && numberOfPairsOfCollimators > 0">
            <label class="col-form-label" for="selectType"><i class="fab fa-react"></i> Nome dos Colimadores</label>
            <template v-for="i in parseFloat(numberOfPairsOfCollimators)">
              <input type="text" class="form-control mb-3" placeholder="" v-model="nameOfCollimators[i]">
            </template>
          </div>
          <div class="form-group" v-if="type === 'Gama Camara'">
            <h4>Testes aplicáveis ao equipamento:</h4>
            <br>
            <div class="pl-3">
              <h5>Mensais</h5>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="hightCountageIntrinsicUniformity"> Uniformidade intrínseca de alta taxa de contagem
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="intrinsicSpatialResolutionAndLinearity"> Resolução e linearidade espacial intrínseca
              </label>
            </div>
            <br>
            <div class="pl-3">
              <h5>Semestrais</h5>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="angulation"> Angulação
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="planeSensibility"> Sensibilidade plana
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="overallPerformance"> Desempenho geral
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="tableVelocity"> Velocidade de mesa
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="maximumCountingRate"> Taxa máxima de contagem
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="energeticResolution"> Resolução energética
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="spatialCoRegistrationForMultienergeticSources"> Co-registro espacial para fontes multienergéticas
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="extrinsicUniformityOfHighCountingRate"> Uniformidade extrínseca de alta taxa de contagem
              </label>
            </div>
            <br>
            <div class="pl-3">
              <h5>Anual</h5>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="asymmetricWindows"> Janelas assimétricas
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="uniformityForDifferentRadioisotopes"> Uniformidade para diferentes radioisótopos
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="linearityAndExtrinsicSpatialResolution"> Linearidade e resolução espacial extrínseca
              </label>
            </div>
            <br>
            <div class="pl-3">
              <h5>Aceite</h5>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="pixelSize"> Tamanho de pixel
              </label>
              <label class="form-inline col">
                <input type="checkbox" class="form-control mr-3" placeholder="" v-model="shieldingSystem"> Blindagem do sistema
              </label>
            </div>
          </div>
        </div>
        <button class="btn btn-success btn-block" @click="edit()">Editar Equipamento</button>
        <br><br>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '@/services/authentication'
import permission from '@/services/permissions'
import axios from 'axios'

export default {
  data () {
    return {
      facility: {},
      equipment: { serialNumber: '', type: '' },
      types: [],
      type: '',
      typeId: '',
      listOfTypesOfEquipment: [],
      mostUsedRadioisotopes: ['F(18)', 'Ga(68)', 'I(131)', 'Tc(99m)'],
      mostUsedRadioisotope: '',
      probes: ['Exposição', 'Contaminação', 'Exposição e Contaminação'],
      probe: '',
      numberOfDetectors: 0,
      numberOfPairsOfCollimators: 0,
      nameOfCollimators: [],
      visualInspect: false,
      hightCountageIntrinsicUniformity: false,
      intrinsicSpatialResolutionAndLinearity: false,
      angulation: false,
      planeSensibility: false,
      overallPerformance: false,
      tableVelocity: false,
      maximumCountingRate: false,
      energeticResolution: false,
      spatialCoRegistrationForMultienergeticSources: false,
      extrinsicUniformityOfHighCountingRate: false,
      asymmetricWindows: false,
      uniformityForDifferentRadioisotopes: false,
      linearityAndExtrinsicSpatialResolution: false,
      pixelSize: false,
      shieldingSystem: false,
      exposureProbeSerialNumber: '',
      contaminationProbeSerialNumber: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      serialNumberTube: '',
      patrimonialNumber: '',
      localization: '',
      calibrationCertificateNumber: '',
      certificateValidity: '',
      error: '',
      permission: permission
    }
  },

  watch: {
    type: function (newVal, oldVal) {
      for (let i = 0; i < this.listOfTypesOfEquipment.length; i++) {
        if (newVal === this.listOfTypesOfEquipment[i].name) {
          this.typeId = this.listOfTypesOfEquipment[i]._id
        }
      }
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
        this.numberOfDetectors = response.data.numberOfDetectors
        this.numberOfPairsOfCollimators = response.data.numberOfPairsOfCollimators
        this.nameOfCollimators = response.data.nameOfCollimators
        this.hightCountageIntrinsicUniformity = response.data.hightCountageIntrinsicUniformity
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
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

    this.currentUser = auth.currentUser()
  },

  methods: {
    translateTypeParam (type) {
      if (type === 'Calibrador de Doses') {
        return 'doseCalibrator'
      } else if (type === 'Gama Camara') {
        return 'gamaCamara'
      } else if (type === 'Contador Geiger') {
        return 'geigerCounter'
      }
    },

    edit () {
      var credentials = {
        _id: this.equipment._id,
        type: this.type,
        typeId: this.typeId,
        manufacturer: this.manufacturer,
        model: this.model,
        serialNumber: this.serialNumber,
        serialNumberTube: this.serialNumberTube,
        patrimonialNumber: this.patrimonialNumber,
        localization: this.localization,
        calibrationCertificateNumber: this.calibrationCertificateNumber,
        certificateValidity: this.certificateValidity,
        probe: this.probe,
        exposureProbeSerialNumber: this.exposureProbeSerialNumber,
        contaminationProbeSerialNumber: this.contaminationProbeSerialNumber,
        numberOfDetectors: this.numberOfDetectors,
        numberOfPairsOfCollimators: this.numberOfPairsOfCollimators,
        nameOfCollimators: this.nameOfCollimators,
        hightCountageIntrinsicUniformity: this.hightCountageIntrinsicUniformity,
        intrinsicSpatialResolutionAndLinearity: this.intrinsicSpatialResolutionAndLinearity,
        angulation: this.angulation,
        planeSensibility: this.planeSensibility,
        overallPerformance: this.overallPerformance,
        tableVelocity: this.tableVelocity,
        maximumCountingRate: this.maximumCountingRate,
        energeticResolution: this.energeticResolution,
        spatialCoRegistrationForMultienergeticSources: this.spatialCoRegistrationForMultienergeticSources,
        extrinsicUniformityOfHighCountingRate: this.extrinsicUniformityOfHighCountingRate,
        asymmetricWindows: this.asymmetricWindows,
        uniformityForDifferentRadioisotopes: this.uniformityForDifferentRadioisotopes,
        linearityAndExtrinsicSpatialResolution: this.linearityAndExtrinsicSpatialResolution,
        pixelSize: this.pixelSize,
        shieldingSystem: this.shieldingSystem,
        facility: { _id: this.facility._id },

        // Dose Calibrator
        mostUsedRadioisotope: this.mostUsedRadioisotope
      }
      auth.editEquipment(this, credentials, '/equipments/' + this.translateTypeParam(this.type) + '/' + this.equipment._id)
    }
  }
}
</script>
