<template>
  <div class="main">
    <div class="">
      <div>
        <b-modal id="modal-center" centered no-close-on-backdrop no-close-on-esc hide-header hide-header-close hide-footer>
          <p class="col-12 mx-auto inline-block" style="width: fit-content">Fazendo upload do documento...</p>
          <img class="img img-fluid" src="/static/img/loading.gif">
        </b-modal>
      </div>
      <div class="row">
        <h2>Editar documento</h2>
        <div class="col py-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb my-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + test.facility._id">{{ test.facility.name }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + test.facility._id + '/equipments'">equipamentos</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + test.facility._id + '/equipments/' + equipment.typeId">{{ equipment.type }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/' + equipment.typeId + '/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/' + equipment.typeId + '/' + equipment._id + '/' + test._id">{{ test.name }}</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">editar</li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="row">
        <div class="col-12 offset-md-2 col-md-8" enctype="multipart/form-data">
          <div class="hyper-card mb-3">
          <div class="alert alert-danger" v-if="error">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
          </div>
          <div class="row">
            <div class="form-group col-12 col-md">
              <label class="col-form-label" for="formName"><i class="far fa-file" aria-hidden="true"></i> Nome</label>
              <input type="text" class="form-control" placeholder="Nome" v-model="test.name">
            </div>
          </div>
          <div class="row">
            <div class="form-group col-12 col-md">
              <label class="col-form-label" for="formName"><i class="far fa-calendar-alt" aria-hidden="true"></i> Data</label>
              <input type="date" class="form-control" :class="{ 'alert-form-control': invalidDate }" placeholder="" v-model="test.date">
            </div>
              <div class="form-group col-12 col-md">
            <label class="col-form-label" for="formName"><i class="far fa-calendar-alt" aria-hidden="true"></i> Validade</label>
              <small class="text-muted">opcional</small>
              <input type="date" class="form-control" :class="{ 'alert-form-control': invalidValidity }" placeholder="" v-model="test.validity">
            </div>
          </div>
          </div>
          <div class="row">
            <div class="hyper-card col mx-3" :class="{ 'alert-hyper-card': invalidFile }">
              <div class="form-group">
                <label class="col-form-label" for="formName"><i class="fa fa-archive" aria-hidden="true"></i> Arquivo</label>
                <small class="text-muted">arquivo deve estar no formato .pdf</small>
                <input type="file" class="form-control-file" placeholder="" @change="onFileChange" accept="application/pdf">
              </div>
            </div>
          </div>
          <br>
          <div class="row">
            <div class="hyper-card col mx-3">
              <span<i class="far fa-building"></i> Instalação: {{ test.facility.name }}</span>
            </div>
            <div class="hyper-card col mx-3">
              <span><i class="fa fa-cubes"></i> Equipamento: {{ equipment.serialNumber }}</span>
            </div>
          </div>
          <br>
          <div class="hyper-card mb-3">
            <div class="input-group col">
              <input class="form-check-input" type="checkbox" :checked="test.hash !== ''" @click="generateCode()">
              <label class="form-check-label" for="defaultCheck1">
                <i class="fa fa-qrcode" aria-hidden="true"></i> Adicionar assinatura e código
                <small v-if="test.hash" class="text-muted">{{ 'código: ' + test.hash}}</small>
              </label>
            </div>
            <br v-if="test.hash">
            <strong v-if="test.hash">Posição da Assinatura:</strong>
            <div v-if="test.hash" class="row mx-auto">
              <div class="col"><button class="btn btn-choose-position" :class="{ selected : test.position == 'tl' }" @click="test.position = 'tl'"><img class="img img-fluid" src="/static/top_left.png"></button></div>
              <div class="col"><button class="btn btn-choose-position" :class="{ selected : test.position == 'tr' }" @click="test.position = 'tr'"><img class="img img-fluid" src="/static/top_right.png"></button></div>
              <div class="col"><button class="btn btn-choose-position" :class="{ selected : test.position == 'bl' }" @click="test.position = 'bl'"><img class="img img-fluid" src="/static/bottom_left.png"></button></div>
              <div class="col"><button class="btn btn-choose-position" :class="{ selected : test.position == 'br' }" @click="test.position = 'br'"><img class="img img-fluid" src="/static/bottom_right.png"></button></div>
            </div>
            <br v-if="test.hash">
            <strong v-if="test.hash">Páginas Assinadas:</strong>
            <div v-if="test.hash" class="row mx-auto justify-content-center">
              <div class="col-12 col-md-4 mb-2"><button @click="test.mode = 'first'" class="btn btn-block btn-outline-success" :class="{'active' : test.mode == 'first'}">primeira página</button></div>
              <div class="col-12 col-md-4 mb-2"><button @click="test.mode = 'all'" class="btn btn-block btn-outline-success" :class="{'active' : test.mode == 'all'}">todas as páginas</button></div>
              <div class="col-12 col-md-4"><button @click="test.mode = 'last'" :class="{'active' : test.mode == 'last'}" class="btn btn-block btn-outline-success">última página</button></div>
            </div>
          </div>
          <div class="hyper-card" :class="{ 'alert-hyper-card': invalidStatus }">
            <span><i class="far fa-check-square"></i> Status:</span>
            <v-select v-model="test.status" :options="statusOptions"></v-select>
          </div>
          <br>
          <div class="hyper-card" :class="{ 'alert-hyper-card': invalidConclusion }" v-if="conclusionOptions.length > 0">
            <span><i class="far fa-check-circle"></i> Conclusão:</span>
            <v-select v-model="test.conclusion" :options="conclusionOptions"></v-select>
          </div>

          <div class="mb-3">
            <br>
            <div class="row px-0">
              <template>
                <div v-for="facility in facilities" class="col-sm-12 col-md-4 my-3">
                  <div class="hyper-card card p-0 facility-hyper-card" :class="{ 'facility-hyper-card-selected' : test.facility == facility}">
                    <div class="background-img" :style="'background-image: url(' + facility.backgroundImg + ')'"></div>
                    <div class="col-6 mx-auto logo-circle">
                      <img class="logo-img rounded-circle img-fluid center" :src="facility.logoImg"></img>
                    </div>
                    <div class="text-center up-25 pr-3 pl-3">
                      <h5 class="card-title text-center">{{ test.facility.name }}</h5>
                      <button v-if="test.facility !== facility" class="btn btn-light" @click="selectFacility(facility)"><i class="fa fa-check" aria-hidden="true"></i> selecionar</button>
                      <button v-else class="btn btn-light" @click="removeFacility"><i class="fa fa-times" aria-hidden="true"></i> remover</button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div v-if="this.test.comments.length > 0">
            <div v-for="commentary in test.comments">
              <div class="hyper-card mb-3">
                <div class="row px-3">
                  <span><i class="far fa-comment"></i> {{ commentary.commentedBy.name }} - {{ commentary.commentedAt | moment('DD/MM/YYYY') }}</span>
                </div>
                <div class="row px-3">
                  <p>{{ commentary.text }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="openCommentaryBox">
            <div class="hyper-card mb-3">
              <div class="row px-3">
                <div class="row" style="width: -webkit-fill-available;">
                  <div class="col-6">
                    Comentário:
                  </div>
                  <div class="col-6 text-right">
                    <small style="color: #888888">{{ currentUser.name }} - {{ today | moment('DD/MM/YYYY') }}</small>
                  </div>
                </div>
                <div class="input-group">
                  <textarea class="form-control" aria-label="With textarea" v-model="commentaryText"></textarea>
                </div>
                <button class="btn btn-outline-metalic-seaweed mx-auto mt-3" @click="addComment">Comentar</button>
              </div>
            </div>
          </div>

          <div class="d-inline-flex" style="width: -webkit-fill-available;">
            <button class="btn btn-outline-metalic-seaweed mx-auto" @click="openCommentaryBox = true">Adicionar comentário</button>
            <button class="btn btn-success btn-block mx-auto" @click="register()">Enviar documento</button>
          </div>
          <br>
          <br>
        </div>
      </div>

    </div>
  </div>

  </div>
</template>

<script>
import moment from 'moment-timezone'
import auth from '../../../../authentication/authentication'
import permission from '../../../../../../services/permissions'
import axios from 'axios'
import Hashids from 'hashids'

export default {
  data () {
    return {
      today: new Date(),
      loading: false,
      permission: permission,
      filter: '',
      currentUser: {},
      facilities: [],
      facility: { _id: '' },
      equipment: {
        _id: '',
        name: ''
      },
      testName: '',
      test: {
        name: '',
        date: '',
        validity: '',
        uploadedAt: '',
        _id: '',
        facility: {},
        equipment: {},
        hash: '',
        mode: '',
        position: '',
        conclusion: '',
        status: '',
        comments: []
      },
      users: [],
      columns: [
        {
          label: ''
        },
        {
          label: 'Nome',
          field: 'name'
        },
        {
          label: 'Tipo de Usuário',
          field: 'type'
        }
      ],
      statusOptions: ['Falta assinar', 'Corrigir', 'Assinado', 'Liberado'],
      conclusionOptions: ['Satisfatório', 'Satisfatório com observações', 'Insatisfatório'],
      error: '',
      invalidDate: false,
      invalidFile: false,
      invalidStatus: false,
      invalidConclusion: false,
      invalidValidity: false,
      openCommentaryBox: false,
      commentaryText: ''
    }
  },

  watch: {
    loading () {
      if (this.loading) {
        this.$root.$emit('bv::show::modal', 'modal-center')
      }
    },
    'test.hash' (newVal, oldVal) {
      if (newVal) {
        this.statusOptions = ['Assinado', 'Liberado']
      } else {
        this.statusOptions = ['Em andamento', 'Corrigir', 'Falta assinar', 'Assinado', 'Liberado']
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

        axios.get(auth.apiUrl() + 'facility/' + response.data.facility._id, {headers: {Authorization: 'Bearer ' + auth.getToken()}}).then(resp => {
          if (resp.data.length === 0) {
            this.errors = 'Nenhum resultado encontrado'
            this.test.facility = ''
          } else {
            this.test.facility = resp.data
          }
        })
        .catch(error => {
          this.errors = error.data
          this.test.facility = ''
        })
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

    axios.get(auth.apiUrl() + 'doc/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.test = ''
      } else {
        console.log(response.data)
        this.test = response.data
        this.test.date = moment(response.data.date).format('YYYY-MM-DD')
        this.test.validity = moment(response.data.validity).format('YYYY-MM-DD')
        this.test.hash = ''
        this.test.position = ''
      }
    })
    .catch(error => {
      this.errors = error.data
      this.test = ''
    })
    // this.test._id = this.$route.params.id
    this.currentUser = auth.currentUser()
  },

  methods: {
    register () {
      var credentials = {
        _id: this.$route.params.id,
        name: this.test.name.split(' ').join('_').split('/').join('-'),
        date: moment(this.test.date).format(),
        mode: this.test.mode,
        position: this.test.position,
        updatedAt: new Date(),
        updatedBy: {_id: this.currentUser.id, name: this.currentUser.name},
        hash: this.test.hash,
        status: this.test.status,
        conclusion: this.test.conclusion,
        facility: { _id: this.test.facility._id, name: this.test.facility.name },
        equipment: { _id: this.equipment._id, name: this.equipment.serialNumber },
        test: { _id: this.$route.params.testId, name: this.test.name },
        comments: this.test.comments
      }
      // if (this.test.hash) {
      //   credentials.signedBy = {_id: this.currentUser.id, name: this.currentUser.name}
      //   credentials.signedAt = new Date()
      // }
      // if (this.test.status === 'Liberado') {
      //   credentials.liberatedBy = {_id: this.currentUser.id, name: this.currentUser.name}
      //   credentials.liberatedAt = new Date()
      // }
      if (this.test.data) {
        credentials.data = this.test.data
      }

      if (!this.test.date) {
        alert('É necessário selecionar uma data!')
        this.invalidDate = true
      } else {
        this.invalidDate = false
      }

      if (this.test.validity) {
        if (this.test.validity <= this.test.date) {
          alert('A data de validade precisa ser superior à data do teste!')
          this.invalidValidity = true
        } else {
          this.invalidValidity = false
          credentials.validity = moment(this.test.validity)
        }
      }

      if (!this.test.conclusion) {
        alert('É necessário selecionar uma conclusão!')
        this.invalidConclusion = true
      } else {
        this.invalidConclusion = false
      }

      if (!this.test.status) {
        alert('É necessário selecionar um status!')
        this.invalidStatus = true
      } else {
        this.invalidStatus = false
      }

      if (!this.invalidFile && !this.invalidConclusion && !this.invalidDate && !this.invalidStatus && !this.invalidValidity) {
        this.loading = true
        auth.editDocument(this, credentials, () => {
          this.$router.push({ path: '/equipments/' + this.equipment.typeOfEquipmentId + '/' + this.equipment._id + '/' + this.$route.params.testId })
        })
      }
    },

    generateCode () {
      if (this.test.hash === '') {
        var hashids = new Hashids('AKJSBDalsdabskJASd', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
        this.test.hash = hashids.encode(Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1))
        this.test.mode = 'last'
        this.test.position = 'bl'
      } else {
        this.test.hash = ''
      }
    },

    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createFile(files[0])
    },
    createFile (file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        vm.test.data = e.target.result
      }
      reader.readAsDataURL(file)
    },

    addComment () {
      this.test.comments.push({
        commentedBy: { name: auth.currentUser().name, _id: auth.currentUser().id },
        commentedAt: new Date(),
        text: this.commentaryText
      })
      this.openCommentaryBox = false
    }
  }
}
</script>

<style scoped>
div.main {
  z-index: 0;
  padding-top: 82px;
  padding-left: 28px;
}

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

.background-img {
  opacity: 0.6;
  z-index: 0;
  min-height: 150px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: center no-repeat;
  background-size: cover;
}

.logo-img {
  z-index: 1;
  position: relative;
  background: center no-repeat;
  -webkit-box-shadow: 0px 0px 25px 0px rgba(0,0,0,0.1);
  -moz-box-shadow: 0px 0px 25px 0px rgba(0,0,0,0.1);
  box-shadow: 0px 0px 25px 0px rgba(0,0,0,0.1);
}

.logo-circle {
  z-index: 1;
  top: -45px;
}

.up-25 {
  position: relative;
  top: -30px;
}

.facility-hyper-card {
  border: 3px solid rgba(62,57,107,0.07);
  transition: 0.2s;
}

.facility-hyper-card-selected {
  border: 3px solid #00a767;
}

.btn.btn-outline-metalic-seaweed.active {
  color: white;
  background-color: #028090;
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
.btn {
  max-width: 300px;
}
.alert-hyper-card {
  border-color: #BA4A47;
  background-color: rgba(186, 74, 71, 0.1)
}
.alert-form-control {
  border-color: #BA4A47;
  background-color: rgba(186, 74, 71, 0.1)
}
</style>
../../../../../../services/permissions