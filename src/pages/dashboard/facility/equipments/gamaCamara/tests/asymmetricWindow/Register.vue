<template>
  <div class="main">
    <div class="center">
      <div>
        <b-modal id="modal-center" centered no-close-on-backdrop no-close-on-esc hide-header hide-header-close hide-footer>
          <p class="col-12 mx-auto inline-block" style="width: fit-content">Fazendo upload do documento...</p>
          <img class="img img-fluid" src="/static/img/loading.gif">
        </b-modal>
      </div>
      <div class="col-12" enctype="multipart/form-data">
        <div class="row">
          <h2 class="col-9">Novo Teste de Janelas Assimétricas</h2>
          <h3 class="col-3" v-if="asymmetricWindowTests.length === 0"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> Teste de Aceite</h3>
        </div>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/' + equipment.type">{{ equipment.type }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/gamaCamara/' + equipment._id + '/asymmetricWindow/'">janelas assimétricas</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">novo</li>
            </ol>
          </nav>
        </div>
        <div class="hyper-card mb-3">
          <div class="alert alert-danger" v-if="error">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="far fa-calendar-alt" aria-hidden="true"></i> Data</label>
              <input type="date" v-model="date" class="form-control">
            </div>
            <div class="form-group col">
              <label class="col-form-label" for="selectType">Detectores testados</label>
              <v-select v-model="testedDetectors" :options="['Detector 1 e Detector 2', 'Detector 1', 'Detector 2']"></v-select>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"> Matrix utilizada</label>
              <v-select v-model="usedMatrix" :options="['64x64', '128x128', '256x256', '512x512', '1024x1024']"></v-select>
            </div>
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fas fa-hashtag" aria-hidden="true"></i> Número total de contagens</label>
              <input type="number" v-model="totalCountNumber" class="form-control">
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType"> Taxa de contagem (Kcount/s) <small class="text-muted">deve ser menor que 30 Kcount/s</small></label>
              <input type="number" max="30" v-model="countTax" class="form-control">
            </div>
            <div class="form-group col">
              <label class="col-form-label" for="selectType"><i class="fab fa-react" aria-hidden="true"></i> Atividade (µCi) da fonte pontual</label>
              <input type="number" v-model="pontualSourceActivity" class="form-control">
            </div>
          </div>
          <br>
          <div class="form-group row">
            <label class="radio-inline col">
              <input type="radio" name="optradio" :value="true" v-model="uniformityCorrection"> Teste realizado com correção de uniformidade
            </label>
            <label class="radio-inline col">
              <input type="radio" name="optradio" :value="false" v-model="uniformityCorrection"> Teste realizado sem correção de uniformidade
            </label>
          </div>
        </div>
        <div class="hyper-card mb-3" v-if="testedDetectors == 'Detector 1' || testedDetectors == 'Detector 1 e Detector 2'">
          <h3>Detector 1</h3>

          <div class="row" v-for="(energyAndResult, index) in energyAndResultsDetector1">
            <div class="form-group col-md-2">
              <div class="row col">
                <label class="col-form-label" for="selectType">Energias</label>
              </div>
              <label class="col-form-label" for="selectType"> {{ energyAndResult.energy }}</label>
            </div>
            <div class="form-check col-md-10 my-auto">
              <div class="row col">
                <label class="col-form-label" for="selectType">Resultados</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatus' + index + 'd1'" :id="'dataCheckStatus' + index + 'option1'" value="Imagem uniforme (satisfatório)" v-model="energyAndResult.dataCheckStatus">
                <label class="form-check-label" :for="'dataCheckStatus' + index + 'option1'">
                  Imagem uniforme (satisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatus' + index + 'd1'" :id="'dataCheckStatus' + index + 'option2'" value="Imagem com baixa uniformidade, sendo possível visualizar bordas de fotomultiplicadoras (insatisfatório)" v-model="energyAndResult.dataCheckStatus">
                <label class="form-check-label" :for="'dataCheckStatus' + index + 'option2'">
                  Imagem com baixa uniformidade, sendo possível visualizar bordas de fotomultiplicadoras (insatisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatus' + index + 'd1'" :id="'dataCheckStatus' + index + 'option3'" value="Imagem apresentando pontos de hiper-captação ou hipo-captação (insatisfatório)" v-model="energyAndResult.dataCheckStatus">
                <label class="form-check-label" :for="'dataCheckStatus' + index + 'option3'">
                  Imagem apresentando pontos de hiper-captação ou hipo-captação (insatisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatus' + index + 'd1'" :id="'dataCheckStatus' + index + 'option4'" value="Ver observações (insatisfatório)" v-model="energyAndResult.dataCheckStatus">
                <label class="form-check-label" :for="'dataCheckStatus' + index + 'option4'">
                  Ver observações (insatisfatório)
                </label>
              </div>
              <div class="row">
                <div class="form-group col">
                  <label class="col-form-label" for="selectType"> Pixel máximo</label>
                  <input type="number" @change='testPoints()' v-model="energyAndResult.maxPixel" class="form-control">
                </div>
                <div class="form-group col">
                  <label class="col-form-label" for="selectType"> Pixel mínimo</label>
                  <input type="number" @change='testPoints()' v-model="energyAndResult.minPixel" class="form-control">
                </div>
                <div class="form-group col">
                  <label class="col-form-label" for="selectType"> Uniformidade integral calculada (%)</label>
                  <input type="number" v-model="energyAndResult.integralCalculatedUniformity" readonly class="form-control">
                </div>
              </div>
              <hr>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType">Observações <small class="text-muted">máximo 150 caracteres</small></label>
              <textarea rows="3" maxlength="150" class="form-control" v-model="energyAndResultsDetector1Obs"></textarea>
            </div>
          </div>
        </div>
        <div class="hyper-card mb-3" v-if="testedDetectors == 'Detector 2' || testedDetectors == 'Detector 1 e Detector 2'">
          <h3>Detector 2</h3>

          <div class="row" v-for="(energyAndResult, index) in energyAndResultsDetector2">
            <div class="form-group col-md-2">
              <div class="row col">
                <label class="col-form-label" for="selectType">Energias</label>
              </div>
              <label class="col-form-label" for="selectType"> {{ energyAndResult.energy }}</label>
            </div>
            <div class="form-check col-md-10 my-auto">
              <div class="row col">
                <label class="col-form-label" for="selectType">Resultados</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatus' + index + 'd2'" :id="'dataCheckStatus' + index + 'option5'" value="Imagem uniforme (satisfatório)" v-model="energyAndResult.dataCheckStatus">
                <label class="form-check-label" :for="'dataCheckStatus' + index + 'option5'">
                  Imagem uniforme (satisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatus' + index + 'd2'" :id="'dataCheckStatus' + index + 'option6'" value="Imagem com baixa uniformidade, sendo possível visualizar bordas de fotomultiplicadoras (insatisfatório)" v-model="energyAndResult.dataCheckStatus">
                <label class="form-check-label" :for="'dataCheckStatus' + index + 'option6'">
                  Imagem com baixa uniformidade, sendo possível visualizar bordas de fotomultiplicadoras (insatisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatus' + index + 'd2'" :id="'dataCheckStatus' + index + 'option7'" value="Imagem apresentando pontos de hiper-captação ou hipo-captação (insatisfatório)" v-model="energyAndResult.dataCheckStatus">
                <label class="form-check-label" :for="'dataCheckStatus' + index + 'option7'">
                  Imagem apresentando pontos de hiper-captação ou hipo-captação (insatisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatus' + index + 'd2'" :id="'dataCheckStatus' + index + 'option8'" value="Ver observações (insatisfatório)" v-model="energyAndResult.dataCheckStatus">
                <label class="form-check-label" :for="'dataCheckStatus' + index + 'option8'">
                  Ver observações (insatisfatório)
                </label>
              </div>
              <div class="row">
                <div class="form-group col">
                  <label class="col-form-label" for="selectType"> Pixel máximo</label>
                  <input type="number" @change='testPoints()' v-model="energyAndResult.maxPixel" class="form-control">
                </div>
                <div class="form-group col">
                  <label class="col-form-label" for="selectType"> Pixel mínimo</label>
                  <input type="number" @change='testPoints()' v-model="energyAndResult.minPixel" class="form-control">
                </div>
                <div class="form-group col">
                  <label class="col-form-label" for="selectType"> Uniformidade integral calculada (%)</label>
                  <input type="number" v-model="energyAndResult.integralCalculatedUniformity" readonly class="form-control">
                </div>
              </div>
              <hr>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType">Observações <small class="text-muted">máximo 115 caracteres</small></label>
              <textarea rows="3" maxlength="115" class="form-control" v-model="energyAndResultsDetector2Obs"></textarea>
            </div>
          </div>
        </div>
        <button class="btn btn-success btn-block" @click="finishTest()">Finalizar Teste</button>
        <br>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import axios from 'axios'
import moment from 'moment-timezone'

export default {
  data () {
    var now = new Date()
    now = new Date(moment.tz(now, 'America/Sao_Paulo'))
    now = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
    return {
      permission: permission,
      asymmetricWindowTests: [],
      isAcceptanceTest: false,
      date: now,
      loading: false,
      numbers: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
      testedDetectors: '',
      uniformityCorrection: false,
      integralCalculatedUniformity: 0,
      countTax: '',
      pontualSourceActivity: '',
      totalCountNumber: '',
      usedMatrix: '',
      energyAndResultsDetector1Obs: '',
      energyAndResultsDetector1: [{
        energy: '140KeV ± 15%',
        dataCheckStatus: '',
        maxPixel: '',
        minPixel: '',
        integralCalculatedUniformity: ''
      },
      {
        energy: '140KeV ± 10%',
        dataCheckStatus: '',
        maxPixel: '',
        minPixel: '',
        integralCalculatedUniformity: ''
      },
      {
        energy: '140KeV + 10%',
        dataCheckStatus: '',
        maxPixel: '',
        minPixel: '',
        integralCalculatedUniformity: ''
      },
      {
        energy: '140KeV - 10%',
        dataCheckStatus: '',
        maxPixel: '',
        minPixel: '',
        integralCalculatedUniformity: ''
      }],
      energyAndResultsDetector2Obs: '',
      energyAndResultsDetector2: [{
        energy: '140KeV ± 15%',
        dataCheckStatus: '',
        maxPixel: '',
        minPixel: '',
        integralCalculatedUniformity: ''
      },
      {
        energy: '140KeV ± 10%',
        dataCheckStatus: '',
        maxPixel: '',
        minPixel: '',
        integralCalculatedUniformity: ''
      },
      {
        energy: '140KeV + 10%',
        dataCheckStatus: '',
        maxPixel: '',
        minPixel: '',
        integralCalculatedUniformity: ''
      },
      {
        energy: '140KeV - 10%',
        dataCheckStatus: '',
        maxPixel: '',
        minPixel: '',
        integralCalculatedUniformity: ''
      }],
      equipment: {
        _id: ''
      },
      facility: {},
      error: '',
      conclusions: ['Detector 1 não testado', 'Detector 2 não testado'],
      results: ['', ''],
      responsibleForPerforming: { name: auth.currentUser().name, _id: auth.currentUser().id }
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
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

    this.getAsymmetricWindowTests()
    this.currentUser = auth.currentUser()
  },
  watch: {
    loading () {
      if (this.loading) {
        this.$root.$emit('bv::show::modal', 'modal-center')
      }
    }
  },

  methods: {
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
    },

    allZero (array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] !== 0 && array[i] !== '0') {
          return false
        }
      }
      return true
    },

    testPoints () {
      if (this.testedDetectors === 'Detector 1' || this.testedDetectors === 'Detector 1 e Detector 2') {
        for (let i = 0; i < this.energyAndResultsDetector1.length; i++) {
          this.energyAndResultsDetector1[i].integralCalculatedUniformity = 100 * ((this.energyAndResultsDetector1[i].maxPixel - this.energyAndResultsDetector1[i].minPixel) / this.energyAndResultsDetector1[i].maxPixel + this.energyAndResultsDetector1[i].minPixel)
        }
      }
      if (this.testedDetectors === 'Detector 2' || this.testedDetectors === 'Detector 1 e Detector 2') {
        for (let i = 0; i < this.energyAndResultsDetector2.length; i++) {
          this.energyAndResultsDetector2[i].integralCalculatedUniformity = 100 * ((this.energyAndResultsDetector2[i].maxPixel - this.energyAndResultsDetector2[i].minPixel) / this.energyAndResultsDetector2[i].maxPixel + this.energyAndResultsDetector2[i].minPixel)
        }
      }

      // WTH?
      if (this.testedDetectors === 'Detector 1' || this.testedDetectors === 'Detector 1 e Detector 2') {
        for (let i = 0; i < this.energyAndResultsDetector1.length; i++) {
          if (i === 0 || i === 1) { // energias 140 ± 15% ou 140 ± 10%
            if ((this.energyAndResultsDetector1[0].dataCheckStatus === 'Imagem com baixa uniformidade, sendo possível visualizar bordas de fotomultiplicadoras (insatisfatório)' ||
            this.energyAndResultsDetector1[0].dataCheckStatus === 'Imagem apresentando pontos de hiper-captação ou hipo-captação (insatisfatório)' ||
            this.energyAndResultsDetector1[0].dataCheckStatus === 'Ver observações (insatisfatório)') ||
            (this.energyAndResultsDetector1[1].dataCheckStatus === 'Imagem com baixa uniformidade, sendo possível visualizar bordas de fotomultiplicadoras (insatisfatório)' ||
            this.energyAndResultsDetector1[1].dataCheckStatus === 'Imagem apresentando pontos de hiper-captação ou hipo-captação (insatisfatório)' ||
            this.energyAndResultsDetector1[1].dataCheckStatus === 'Ver observações (insatisfatório)')) {
              this.conclusions[0] = 'Insatisfatório'
              this.results[0] = 'As imagens do detector não são uniformes na região de energia utilizada durante exames diagnósticos. O detector não é considerado apto para uso e o fabricante deve ser contatado para manutenção, verificação de desajustes em fotomutiplicadoras e necessidade de refazer o mapa de correção.'
            } else if (this.energyAndResultsDetector1[i].dataCheckStatus === 'Imagem uniforme (satisfatório)') {
              for (let j = 0; j < this.energyAndResultsDetector1.length; j++) {
                if (j !== 0 && j !== 1) { // energias 140 ± 15% ou 140 ± 10%
                  if (this.energyAndResultsDetector1[j].dataCheckStatus === 'Imagem com baixa uniformidade, sendo possível visualizar bordas de fotomultiplicadoras (insatisfatório)' ||
                  this.energyAndResultsDetector1[j].dataCheckStatus === 'Imagem apresentando pontos de hiper-captação ou hipo-captação (insatisfatório)' ||
                  this.energyAndResultsDetector1[j].dataCheckStatus === 'Ver observações (insatisfatório)') {
                    this.conclusions[0] = 'Satisfatório'
                    this.results[0] = 'As imagens do detector são uniformes na região de energia utilizada durante exames diagnósticos. O detector é considerado apto para uso porém o fabricante deve ser contatado para verificação do de desajuste em fotomultiplicadoras e necessidade de refazer o mapa de correção.'
                  } else {
                    this.conclusions[0] = 'Satisfatório'
                    this.results[0] = ' As imagens do detector são uniformes, não apresentando pontos de hiper ou hipo-captação, nem regiões de alto contraste frio ou quente. O detector é considerado apto para uso.'
                  } // 1
                } // 2
              } // 3
            } // 4
          } // 5
        } // 6
      } // 7

      if (this.testedDetectors === 'Detector 2' || this.testedDetectors === 'Detector 1 e Detector 2') {
        for (let k = 0; k < this.energyAndResultsDetector2.length; k++) {
          if (k === 0 || k === 1) { // energias 140 ± 15% ou 140 ± 10%
            if ((this.energyAndResultsDetector2[0].dataCheckStatus === 'Imagem com baixa uniformidade, sendo possível visualizar bordas de fotomultiplicadoras (insatisfatório)' ||
            this.energyAndResultsDetector2[0].dataCheckStatus === 'Imagem apresentando pontos de hiper-captação ou hipo-captação (insatisfatório)' ||
            this.energyAndResultsDetector2[0].dataCheckStatus === 'Ver observações (insatisfatório)') ||
            (this.energyAndResultsDetector2[1].dataCheckStatus === 'Imagem com baixa uniformidade, sendo possível visualizar bordas de fotomultiplicadoras (insatisfatório)' ||
            this.energyAndResultsDetector2[1].dataCheckStatus === 'Imagem apresentando pontos de hiper-captação ou hipo-captação (insatisfatório)' ||
            this.energyAndResultsDetector2[1].dataCheckStatus === 'Ver observações (insatisfatório)')) {
              this.conclusions[1] = 'Insatisfatório'
              this.results[1] = 'As imagens do detector não são uniformes na região de energia utilizada durante exames diagnósticos. O detector não é considerado apto para uso e o fabricante deve ser contatado para manutenção, verificação de desajustes em fotomutiplicadoras e necessidade de refazer o mapa de correção.'
            } else if (this.energyAndResultsDetector2[k].dataCheckStatus === 'Imagem uniforme (satisfatório)') {
              for (let l = 0; l < this.energyAndResultsDetector2.length; l++) {
                if (l !== 0 && l !== 1) { // energias 140 ± 15% ou 140 ± 10%
                  if (this.energyAndResultsDetector2[l].dataCheckStatus === 'Imagem com baixa uniformidade, sendo possível visualizar bordas de fotomultiplicadoras (insatisfatório)' ||
                  this.energyAndResultsDetector2[l].dataCheckStatus === 'Imagem apresentando pontos de hiper-captação ou hipo-captação (insatisfatório)' ||
                  this.energyAndResultsDetector2[l].dataCheckStatus === 'Ver observações (insatisfatório)') {
                    this.conclusions[1] = 'Satisfatório'
                    this.results[1] = 'As imagens do detector são uniformes na região de energia utilizada durante exames diagnósticos. O detector é considerado apto para uso porém o fabricante deve ser contatado para verificação do de desajuste em fotomultiplicadoras e necessidade de refazer o mapa de correção.'
                  } else {
                    this.conclusions[1] = 'Satisfatório'
                    this.results[1] = ' As imagens do detector são uniformes, não apresentando pontos de hiper ou hipo-captação, nem regiões de alto contraste frio ou quente. O detector é considerado apto para uso.'
                  } // 1
                } // 2
              } // 3
            } // 4
          } // 5
        } // 6
      } // 7
    },

    average (array) {
      let sum = 0
      for (let i = 0; i < array.length - 1; i++) {
        sum += parseFloat(array[i + 1])
      }
      return sum / (array.length - 1)
    },
    finishTest () {
      if (confirm('Tem certeza que deseja finalizar este teste?')) {
        let valid = true

        if (this.testedDetectors === 'Detector 1' || this.testedDetectors === 'Detector 1 e Detector 2') {
          for (let i = 0; i < this.energyAndResultsDetector1.length; i++) {
            if (this.energyAndResultsDetector1[i].integralCalculatedUniformity === '') {
              valid = false
            }
          }
        }
        if (this.testedDetectors === 'Detector 2' || this.testedDetectors === 'Detector 1 e Detector 2') {
          for (let i = 0; i < this.energyAndResultsDetector2.length; i++) {
            if (this.energyAndResultsDetector2[i].integralCalculatedUniformity === '') {
              valid = false
            }
          }
        }

        if (valid) {
          if (this.asymmetricWindowTests.length === 0) {
            this.isAcceptanceTest = true
          }
          var credentials = {
            date: this.date,
            status: 'Em Andamento',
            isAcceptanceTest: this.isAcceptanceTest,
            energyAndResultsDetector1Obs: this.energyAndResultsDetector1Obs,
            energyAndResultsDetector1: this.energyAndResultsDetector1,
            energyAndResultsDetector2Obs: this.energyAndResultsDetector2Obs,
            energyAndResultsDetector2: this.energyAndResultsDetector2,
            testedDetectors: this.testedDetectors,
            uniformityCorrection: this.uniformityCorrection,
            integralCalculatedUniformity: this.integralCalculatedUniformity,
            countTax: this.countTax,
            pontualSourceActivity: this.pontualSourceActivity,
            totalCountNumber: this.totalCountNumber,
            usedMatrix: this.usedMatrix,
            conclusions: this.conclusions,
            results: this.results,
            equipment: { _id: this.$route.params.id },
            responsibleForPerforming: this.responsibleForPerforming
          }
          auth.registerGamaCamaraAsymmetricWindowTest(this, credentials, '/equipments/gamaCamara/' + this.equipment._id + '/asymmetricWindow/')
        } else {
          alert('Os valores de Pixel Máximo e Pixel Mínimo não foram preenchidos corretamente!')
        }
      }
    }
  }
}
</script>

<style>
.lateral-label {
  max-width: 60px;
}
</style>
../../../../../../../../services/permissions