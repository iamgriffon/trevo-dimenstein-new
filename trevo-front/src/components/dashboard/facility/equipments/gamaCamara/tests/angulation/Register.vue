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
        <h2>Novo Teste de Angulação dos Furos dos Colimadores</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/' + equipment.type">{{ equipment.type }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/gamaCamara/' + equipment._id + '/angulation/'">angulação dos furos dos colimadores</router-link></li>
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
          </div>
        </div>

        <div class="hyper-card mb-3" v-for="test in tests">
          <div class="row">
            <div class="col">
              <h3>{{ test.collimator + ' - ' + test.head }}</h3>
            </div>
            <div class="col text-right">
              <button @click="eraseTest(test)" class="btn btn-outline-danger"><i class="fas fa-times" aria-hidden="true"></i></button>
            </div>
          </div>
          <p>Atividade da fonte pontual (mCi): {{ test.pontualSourceActivity }}</p>
          <p>Número de imagens por cabeça: {{ test.numberOfImagesByHead }}</p>
          <p>Total de contagens em cada imagem: {{ test.totalCount }}</p>
          <p>Matrix utilizada: {{ test.usedMatrix }}</p>
          <template v-if="test.dataCheckStatusH1 !== ''">
            <h5>Cabeça 1</h5>
            <p>Análises: {{ test.dataCheckStatusH1 }}</p>
            <p v-if="test.head1Obs !== ''">Observações: {{ test.head1Obs }}</p>
          </template>
          <template v-if="test.dataCheckStatusH2 !== ''">
            <h5>Cabeça 2</h5>
            <p>Análises: {{ test.dataCheckStatusH2 }}</p>
            <p v-if="test.head2Obs !== ''">Observações: {{ test.head2Obs }}</p>
          </template>
        </div>

        <div class="hyper-card mb-3" v-for="test in currentTests">
          <div class="row">
            <div class="col">
              <h3>{{ test.collimator + ' - ' + test.head }}</h3>
            </div>
            <div class="col text-right">
              <button @click="eraseTestFromCurrentTests(test)" class="btn btn-outline-danger"><i class="fas fa-times" aria-hidden="true"></i></button>
            </div>
          </div>

          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType">Atividade da fonte pontual (mCi)</label>
              <input type="number" v-model="test.pontualSourceActivity" class="form-control">
            </div>
            <div class="form-group col">
              <label class="col-form-label" for="selectType">Número de imagens por cabeça</label>
              <v-select v-model="test.numberOfImagesByHead" :options="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"></v-select>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType">Total de contagens em cada imagem</label>
              <input type="number" v-model="test.totalCount" class="form-control">
            </div>
            <div class="form-group col">
              <label class="col-form-label" for="selectType">Matrix utilizada</label>
              <v-select v-model="test.usedMatrix" :options="['64x64', '128x128', '256x256', '512x512', '1024x1024']"></v-select>
            </div>
          </div>
          <div class="row" v-if="test.head === 'Cabeça 1' || test.head === 'Cabeça 1 e Cabeça 2'">
            <div class="form-check col-md-2 my-auto">
              <div class="row col">
                <label class="col-form-label" for="selectType">Cabeça 1</label>
              </div>
            </div>
            <div class="form-check col-md-10 my-auto">
              <div class="row col">
                <label class="col-form-label" for="selectType">Análises</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatusH1'" :id="'dataCheckStatusH1Option1'" value="Imagens apresentam o padrão de simetria esperado (satisfatório)" v-model="test.dataCheckStatusH1">
                <label class="form-check-label" :for="'dataCheckStatusH1Option1'">
                  Imagens apresentam o padrão de simetria esperado (satisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatusH1'" :id="'dataCheckStatusH1Option2'" value="Imagens apresentam o pequenas irregularidades aceitáveis (satisfatório)" v-model="test.dataCheckStatusH1">
                <label class="form-check-label" :for="'dataCheckStatusH1Option2'">
                  Imagens apresentam o pequenas irregularidades aceitáveis (satisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatusH1'" :id="'dataCheckStatusH1Option3'" value="Imagens apresentam distorções significativas (insatisfatório)" v-model="test.dataCheckStatusH1">
                <label class="form-check-label" :for="'dataCheckStatusH1Option3'">
                  Imagens apresentam distorções significativas (insatisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatusH1'" :id="'dataCheckStatusH1Option4'" value="Ver observações (insatisfatório)" v-model="test.dataCheckStatusH1">
                <label class="form-check-label" :for="'dataCheckStatusH1Option4'">
                  Ver observações (insatisfatório)
                </label>
              </div>
              <div class="form-group">
                <label class="col-form-label" for="selectType">Observações <small class="text-muted">máximo 150 caracteres</small></label>
                <textarea rows="3" maxlength="150" class="form-control" v-model="test.head1Obs"></textarea>
              </div>
            </div>
          </div>
          <hr v-if="test.head === 'Cabeça 1 e Cabeça 2'">
          <div class="row" v-if="test.head === 'Cabeça 2' || test.head === 'Cabeça 1 e Cabeça 2'">
            <div class="form-check col-md-2 my-auto">
              <div class="row col">
                <label class="col-form-label" for="selectType">Cabeça 2</label>
              </div>
            </div>
            <div class="form-check col-md-10 my-auto">
              <div class="row col">
                <label class="col-form-label" for="selectType">Análises</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatusH2'" :id="'dataCheckStatusH2Option1'" value="Imagens apresentam o padrão de simetria esperado (satisfatório)" v-model="test.dataCheckStatusH2">
                <label class="form-check-label" :for="'dataCheckStatusH2Option1'">
                  Imagens apresentam o padrão de simetria esperado (satisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatusH2'" :id="'dataCheckStatusH2Option2'" value="Imagens apresentam o pequenas irregularidades aceitáveis (satisfatório)" v-model="test.dataCheckStatusH2">
                <label class="form-check-label" :for="'dataCheckStatusH2Option2'">
                  Imagens apresentam o pequenas irregularidades aceitáveis (satisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatusH2'" :id="'dataCheckStatusH2Option3'" value="Imagens apresentam distorções significativas (insatisfatório)" v-model="test.dataCheckStatusH2">
                <label class="form-check-label" :for="'dataCheckStatusH2Option3'">
                  Imagens apresentam distorções significativas (insatisfatório)
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" :name="'dataCheckStatusH2'" :id="'dataCheckStatusH2Option4'" value="Ver observações (insatisfatório)" v-model="test.dataCheckStatusH2">
                <label class="form-check-label" :for="'dataCheckStatusH2Option4'">
                  Ver observações (insatisfatório)
                </label>
              </div>
              <div class="form-group">
                <label class="col-form-label" for="selectType">Observações <small class="text-muted">máximo 150 caracteres</small></label>
                <textarea rows="3" maxlength="150" class="form-control" v-model="test.head2Obs"></textarea>
              </div>
            </div>
          </div>
          <div class="mx-auto text-center">
            <button class="btn btn-outline-success" @click="saveTest(test)">Salvar</button>
          </div>
        </div>

        <div class="hyper-card mb-3">
          <h3>Selecionar colimador testado</h3>
          <div class="row">
            <div class="form-group col">
              <label class="col-form-label" for="selectType">Colimador</label>
              <v-select v-model="choosenCollimator" :options="collimatorOptions"></v-select>
            </div>
            <div class="form-group col">
              <label class="col-form-label" for="selectType">Cabeça</label>
              <v-select v-model="choosenHead" :options="headOptions"></v-select>
            </div>
            <div class="col-12 col-md-1 align-middle pt-4 mt-2 text-right">
              <button @click="addCollimator(choosenCollimator, choosenHead)" class="btn btn-outline-metalic-seaweed"><i class="fa fa-check" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>

        <button class="btn btn-success btn-block" @click="finishTest(test)">Finalizar Teste</button>
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
      date: now,
      collimatorOptions: [],
      choosenCollimator: '',
      collimators: [],
      headOptions: ['Cabeça 1', 'Cabeça 2', 'Cabeça 1 e Cabeça 2'],
      head: '',
      tests: [],
      currentTests: [],
      equipment: {
        _id: ''
      },
      facility: {},
      error: '',
      permission: permission,
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
        response.data.nameOfCollimators.shift()
        this.collimatorOptions = response.data.nameOfCollimators

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
    this.currentUser = auth.currentUser()
  },

  methods: {
    addCollimator (choosenCollimator, choosenHead) {
      let test = {
        collimator: choosenCollimator,
        head: choosenHead,
        pontualSourceActivity: '',
        numberOfImagesByHead: '',
        totalCount: '',
        usedMatrix: '',
        dataCheckStatusH1: '',
        head1Obs: '',
        dataCheckStatusH2: '',
        head2Obs: ''
      }

      this.currentTests.push(test)
      this.choosenHead = ''
      this.choosenCollimator = ''
    },

    eraseTestFromCurrentTests (test) {
      let idx = this.currentTests.indexOf(test)
      if (idx !== -1) {
        this.currentTests.splice(idx, 1)
      }
    },
    eraseTest (test) {
      let idx = this.tests.indexOf(test)
      if (idx !== -1) {
        this.tests.splice(idx, 1)
      }
    },

    saveTest (test) {
      this.eraseTestFromCurrentTests(test)
      this.tests.push(test)
    },

    finishTest () {
      if (confirm('Tem certeza que deseja finalizar este teste?')) {
        var credentials = {
          date: this.date,
          isAcceptanceTest: false,
          status: 'Em Andamento',
          tests: this.tests,
          equipment: { _id: this.$route.params.id },
          responsibleForPerforming: this.responsibleForPerforming
        }
        auth.registerGamaCamaraAngulationTest(this, credentials, '/equipments/gamaCamara/' + this.equipment._id + '/angulation/')
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