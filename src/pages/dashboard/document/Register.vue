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
        <h2>Enviar documento</h2>
        <div class="col py-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb my-0 px-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/document'"><i class="fa fa-inbox" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item active" aria-current="page">novo</li>
            </ol>
          </nav>
        </div>
        <div class="hyper-card mb-3">
        <div class="alert alert-danger" v-if="error">
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ error }}
        </div>
        <div class="row">
          <div class="form-group col-12 col-md">
            <label class="col-form-label" for="formName"><i class="far fa-file" aria-hidden="true"></i> Nome</label>
            <input type="text" class="form-control" placeholder="Nome" v-model="doc.name">
          </div>
          <div class="form-group col-12 col-md">
            <label class="col-form-label" for="formName"><i class="far fa-calendar-alt" aria-hidden="true"></i> Validade</label>
            <small class="text-muted">opcional</small>
            <input type="date" class="form-control" placeholder="" v-model="doc.validity">
          </div>
        </div>
        <div class="row">
          <div class="form-group col">
            <label class="col-form-label" for="formName"><i class="fa fa-archive" aria-hidden="true"></i> Arquivo</label>
            <small class="text-muted">arquivo deve estar no formato .pdf</small>
            <input type="file" class="form-control-file" placeholder="" @change="onFileChange" accept="application/pdf">
          </div>
        </div>
      </div>

      <div class="hyper-card mb-3">
        <div class="input-group col">
          <input class="form-check-input" type="checkbox" :checked="doc.hash !== ''" @click="generateCode()">
          <label class="form-check-label" for="defaultCheck1">
            <i class="fa fa-qrcode" aria-hidden="true"></i> Adicionar assinatura e código
            <small v-if="doc.hash" class="text-muted">{{ 'código: ' + doc.hash}}</small>
          </label>
        </div>
        <br v-if="doc.hash">
        <div v-if="doc.hash" class="row mx-auto justify-content-center">
          <div class="col-12 col-md-4 mb-2"><button @click="doc.mode = 'first'" class="btn btn-block btn-outline-metalic-seaweed" :class="{'active' : doc.mode == 'first'}">primeira página</button></div>
          <div class="col-12 col-md-4 mb-2"><button @click="doc.mode = 'all'" class="btn btn-block btn-outline-metalic-seaweed" :class="{'active' : doc.mode == 'all'}">todas as páginas</button></div>
          <div class="col-12 col-md-4"><button @click="doc.mode = 'last'" :class="{'active' : doc.mode == 'last'}" class="btn btn-block btn-outline-metalic-seaweed">última página</button></div>
        </div>
      </div>

      <div class="mb-3">
        <br>
        <h4><i class="far fa-building"></i> Instalação</h4>
        <h5>Selecione a instalação deste arquivo</h5>
        <div class="row px-0">
          <template>
            <div v-for="facility in facilities" class="col-sm-12 col-md-4 my-3">
              <div class="hyper-card card p-0 facility-hyper-card" :class="{ 'facility-hyper-card-selected' : doc.facility == facility}">
                <div class="background-img" :style="'background-image: url(' + facility.backgroundImg + ')'"></div>
                <div class="col-6 mx-auto logo-circle">
                  <img class="logo-img rounded-circle img-fluid center" :src="facility.logoImg"></img>
                </div>
                <div class="text-center up-25 pr-3 pl-3">
                  <h5 class="card-title text-center">{{ facility.name }}</h5>
                  <button v-if="doc.facility !== facility" class="btn btn-light" @click="selectFacility(facility)"><i class="fa fa-check" aria-hidden="true"></i> selecionar</button>
                  <button v-else class="btn btn-light" @click="removeFacility"><i class="fa fa-times" aria-hidden="true"></i> remover</button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <button class="btn btn-success btn-block" @click="register()">Enviar documento</button>
      <br>
      <br>
    </div>

  </div>

  </div>
</template>

<script>
import moment from 'moment-timezone'
import auth from '../../authentication/authentication'
import axios from 'axios'
import Hashids from 'hashids'

export default {
  data () {
    return {
      loading: false,
      filter: '',
      currentUser: {},
      facilities: [],
      doc: {
        facility: {},
        hash: '',
        mode: ''
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
      error: ''
    }
  },

  watch: {
    loading () {
      if (this.loading) {
        this.$root.$emit('bv::show::modal', 'modal-center')
      }
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'facilities/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.facilities = ''
      } else {
        for (var i = 0; i < response.data.length; i++) {
          this.facilities.push({_id: response.data[i]._id, name: response.data[i].name, backgroundImg: response.data[i].backgroundImg, logoImg: response.data[i].logoImg})
        }
      }
    })
    .catch(error => {
      this.errors = error.data
      this.facilities = ''
    })

    this.currentUser = auth.currentUser()
  },
  methods: {
    register () {
      var credentials = {
        name: this.doc.name,
        data: moment(this.doc.data).format(),
        mode: this.doc.mode,
        uploadedAt: new Date(),
        uploadedBy: {_id: this.currentUser.id, name: this.currentUser.name},
        hash: this.doc.hash,
        facility: {_id: this.doc.facility._id, name: this.doc.facility.name}
      }
      if (this.doc.validity) {
        credentials.validity = moment(this.doc.validity)
      }
      this.loading = true
      auth.registerDocument(this, credentials, '/document')
    },

    selectFacility (facility) {
      this.doc.facility = facility
    },

    removeFacility () {
      this.doc.facility = {}
    },

    generateCode () {
      if (this.doc.hash === '') {
        var hashids = new Hashids('AKJSBDalsdabskJASd', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
        this.doc.hash = hashids.encode(Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1))
        this.doc.mode = 'last'
      } else {
        this.doc.hash = ''
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
        vm.doc.data = e.target.result
      }
      reader.readAsDataURL(file)
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
</style>
