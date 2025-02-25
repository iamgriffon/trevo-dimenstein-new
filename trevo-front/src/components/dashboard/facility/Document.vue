<template>
  <div class="main">
    <div class="col-12 row">
      <div class="col">
        <h2>Documentos</h2>
      </div>
      <div class="col text-right">
        <router-link v-if="permission.canCreateDocuments(currentUser)" class="btn btn-success" :to="{ path: '/document/register/'}"><i class="fa fa-upload d-block d-md-none round-button" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fa fa-upload" aria-hidden="true"></i> fazer upload</span></router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + $route.params.id">{{facility.name}}</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">documentos</li>
        </ol>
      </nav>
    </div>
    <template>
      <div class="col-12 row">
        <div class="input-group input-with-addon pl-3 pr-1 pt-3">
          <span class="input-addon" id="search-input"><span class="fa fa-search"></span></span>
          <input type="text" class="form-control form-with-addon" id="search-input-form" @input="filter = $event.target.value" placeholder="buscar..." aria-describedby="search-input">
        </div>
      </div>
      <div class="col-12 row" v-if="filteredDocuments.length > 0">
        <br/>
        <documents-table :tests="filteredDocuments" :loadDocuments="loadDocuments"/>
      </div>
    </template>
  </div>
</template>

<script>
import auth from '../../authentication/authentication'
import permission from '../../../../services/permissions'
import axios from 'axios'

import documentsTable from '../../documentsTable/Index'

export default {
  components: {
    'documents-table': documentsTable,
    permission
  },

  data () {
    return {
      filter: '',
      documents: [],
      facility: { name: '' },
      currentUser: {},
      ready: false,
      result: '',
      test: { name: '' }
    }
  },

  computed: {
    filteredDocuments () {
      if (this.filter.length > 0) {
        let exp = new RegExp(this.filter.trim(), 'i')
        return this.documents.filter(item =>
          exp.test(item.name) ||
          exp.test(item.validity) ||
          exp.test(item.facility[0].name) ||
          exp.test(item.hash) ||
          exp.test(item.uploadedBy[0].name) ||
          exp.test(item.uploadedAt))
      } else {
        return this.documents
      }
    }
  },

  created () {
    this.loadDocuments()
    this.loadFacility()

    this.currentUser = auth.currentUser()
    this.permission = permission
  },

  methods: {
    loadDocuments () {
      axios.get(auth.apiUrl() + 'document/facility/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(response => {
        if (response.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.documents = ''
        } else {
          let docs = response.data.map(doc => {
            doc.equipment = [{ _id: '', typeId: '' }]
            return doc
          })
          this.documents = docs
        }
      })
      .catch(error => {
        this.errors = error.data
        this.documents = ''
      })
    },
    loadFacility () {
      axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(response => {
        if (response.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.facility = ''
        } else {
          this.facility = response.data
        }
      })
      .catch(error => {
        this.errors = error.data
        this.documents = ''
      })
    }
  }
}
</script>

<style scoped>
.good-table {
  width: 100%;
  overflow-x: hidden;
}

div.main {
  z-index: 0;
  padding-top: 82px;
  padding-left: 28px;
}

.round-button {
  width: 14px;
  height: 24px;
  line-height: 24px;
}
</style>
../../../../services/permissions