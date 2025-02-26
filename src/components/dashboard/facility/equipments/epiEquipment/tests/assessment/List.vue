<template>
  <div class="main">
    <div>
      <b-modal id="modal-center" centered no-close-on-backdrop no-close-on-esc hide-header hide-header-close hide-footer>
        <p class="col-12 mx-auto inline-block" style="width: fit-content">Carregando...</p>
        <img class="img img-fluid" src="/static/img/loading.gif">
      </b-modal>
    </div>
    <div class="col-12 row">
      <div class="col">
        <h2>Avaliação de EPIs</h2>
      </div>
      <div class="col text-right">
        <router-link id="add-button" v-if="permission.canCreateDocuments(currentUser)" class="btn btn-success" :to="{ path: '/equipments/epi/register/'}">
          <i class="fa fa-upload d-block d-md-none round-button" aria-hidden="true"></i>
          <span class="d-none d-md-block"><i class="fa fa-plus" aria-hidden="true"></i> adicionar</span>
        </router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item active" aria-current="page"><font-awesome-icon icon="fa-solid fa-shield" /></li>
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
      <br/>
      <div v-if="ready === false" class="col-12 text-center loading-icon">
        <p class="col-12 mx-auto inline-block" style="width: fit-content">Carregando...</p>
        <img class="img mx-auto img-fluid" src="/static/img/loading.gif">
      </div>
      <div v-if="error" class="col-12 px-5">
        <b-alert show variant="dark"><i class="fas fa-exclamation-triangle"></i> {{ error }}</b-alert>
      </div>
      <div>
        <template v-if="filteredDocuments.length > 0">
          <documents-table :tests="filteredDocuments" :loadDocuments="loadDocuments" :showEditButton="false"/>
        </template>
        <div v-else-if="permission.canSeeAllDocuments(currentUser)" class="col-12 text-center">
          <p>Nenhum documento encontrado na lista inicial. Você pode tentar realizar uma busca avançada.</p>
          <button class="btn btn-outline-success" v-b-modal="'advancedSearch'">Busca avançada</button>
          <b-modal id="advancedSearch" size="lg" ref="advancedSearch" title="Busca avançada de EPIs" hide-footer>
            <div class="col-12 row">
              <div class="input-group input-with-addon pl-3 pr-1 pt-3 pb-3">
                <span class="input-addon" id="search-input"><span class="fa fa-search"></span></span>
                <input type="text" class="form-control form-with-addon" id="search-input-form" @input="advancedFilter = $event.target.value" placeholder="busque por partes do nome do documento..." aria-describedby="search-input">
                <button class="btn btn-outline-success" @click="advancedSearch">Buscar</button>
              </div>
            </div>
          </b-modal>
        </div>
        <br><br>
      </div>
    </template>
  </div>
</template>

<script>
import 'pdfjs-dist'
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import axios from 'axios'
// import Hashids from 'hashids'
import documentsTable from '../../../../../../documentsTable/Index'

export default {
  components: {
    'documents-table': documentsTable
  },
  data () {
    return {
      filter: '',
      advancedFilter: '',
      documents: [],
      permission: permission,
      currentUser: {},
      today: '',
      facilities: [],
      test: { name: '' },
      signeTest: { name: '' },
      signaturePosition: '',
      signatureMode: '',
      commentaryText: '',
      actualTest: {},
      paginationOptions: {
        enabled: true,
        nextLabel: '>',
        prevLabel: '<',
        rowsPerPageLabel: 'Linhas por página:',
        ofLabel: 'de',
        pageLabel: 'página',
        allLabel: 'Todos'
      },
      columns: [
        {
          label: '',
          field: 'type'
        },
        {
          label: 'Ações',
          field: 'actions'
        },
        {
          label: 'Conclusão',
          field: 'conclusion'
        },
        {
          label: 'Nome',
          field: 'name',
          sortable: true
        },
        {
          label: 'Instalação',
          field: 'facility'
        },
        {
          label: 'Upload por',
          field: 'uploadedBy'
        },
        {
          label: 'Upload',
          field: 'uploadedAt',
          sortable: true
        },
        {
          label: 'Validade',
          field: 'validity',
          sortable: true
        },
        {
          label: 'Status',
          field: 'status'
        }
      ],
      ready: false,
      pdfUrl: '',
      result: '',
      error: '',
      url: ''
    }
  },

  watch: {
    '$route.params.status': function (newVal, oldVal) {
      if (newVal || oldVal) {
        this.clearAllDocuments().then(
          this.loadStatusDocuments(newVal)
        )
      }
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
    if (this.$route.params.status) {
      this.loadStatusDocuments(this.$route.params.status)
    } else {
      this.loadDocuments()
    }

    this.today = new Date()
    this.currentUser = auth.currentUser()
  },

  methods: {
    clearAllDocuments () {
      return new Promise((resolve, reject) => {
        this.ready = false
        this.documents = []
        this.test = { name: '' }
        this.signeTest = { name: '' }
        this.signaturePosition = ''
        this.signatureMode = ''
        this.commentaryText = ''
        this.actualTest = {}
        resolve()
      })
    },

    loadDocuments () {
      this.clearAllDocuments().then(() => {
        var reqFilter = {
          pageSize: 10,
          pageNum: 1,
          limit: 10
        }

        if (this.currentUser.type === 'administrador' || this.currentUser.type === 'rad laudos' || this.currentUser.type === 'rad fisico' || this.currentUser.type === 'rad admin') {
          this.tagNumber = 0

          axios.get(
            auth.apiUrl() + 'documents/byTestId', {
              headers: { Authorization: 'Bearer ' + auth.getToken() },
              params: { filters: reqFilter, testId: '5cb5d3865e719264dd704b67' }
            }
          ).then(response => {
            if (response.data.list.length === 0) {
              this.error = 'Nenhum documento encontrado'
              this.documents = []
              this.ready = true
            } else {
              this.documents.push.apply(this.documents, response.data.list)
              var total = response.data.paging.total
              this.ready = false
              this.error = ''

              for (let i = 2; i <= (total / reqFilter.limit + 1) && i <= 50; i++) {
                reqFilter = {
                  pageSize: 10,
                  pageNum: i,
                  facilityId: this.$route.params.id,
                  status: '',
                  limit: 10
                }
                axios.get(
                  auth.apiUrl() + 'documents/byTestId', {
                    headers: { Authorization: 'Bearer ' + auth.getToken() },
                    params: { filters: reqFilter, testId: '5cb5d3865e719264dd704b67' }
                  }
                ).then(resp => {
                  if (resp.data.list.length === 0) {
                    this.errors = 'Nenhum documento encontrado'
                    this.ready = true
                  } else {
                    this.documents.push.apply(this.documents, resp.data.list)
                    // this.documents = this.documents.filter(doc => { return doc.test[0]._id === '5cb5d3865e719264dd704b67' })
                    this.documents.sort((a, b) => {
                      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
                    })

                    let docs = this.documents
                    for (let doc of docs) {
                      doc.equipment[0].typeId = 'epi'
                    }

                    this.documents = docs

                    this.ready = true
                    this.error = ''
                  }
                })
                .catch(err => {
                  this.error = err.data
                  this.documents = []
                })
              }
            }
          })
          .catch(error => {
            this.error = error.data
            this.documents = []
          })
        } else {
          axios.get(auth.apiUrl() + 'facilities/', { headers: { Authorization: 'Bearer ' + auth.getToken() }, params: { filters: reqFilter } })
          .then(response => {
            if (response.data.list.length === 0) {
              this.error = 'Nenhum documento encontrado'
              this.facilities = []
              this.ready = true
            } else {
              this.facilities.push.apply(this.facilities, response.data.list)
              this.ready = true
              this.error = ''

              for (const facility of response.data.list) {
                this.requestFacilityEPIDocs(facility._id)
              }
            }
          })
          .catch(error => {
            this.error = error.data
            this.documents = []
          })
        }
      })
    },

    async requestFacilityEPIDocs (facilityId) {
      axios.get(auth.apiUrl() + 'document/facility/' + facilityId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(response => {
        if (response.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.documents = []
        } else {
          let docs = response.data.filter(doc => { return doc.test[0]._id === '5cb5d3865e719264dd704b67' })
          this.documents.push.apply(this.documents, docs)
          this.documents.sort((a, b) => {
            return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          })
        }
      })
      .catch(error => {
        this.errors = error.data
        this.documents = []
      })
    },

    async advancedSearch () {
      this.filter = this.advancedFilter
      axios.get(auth.apiUrl() + 'searchEPIDocs/' + this.advancedFilter, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(response => {
        if (response.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.documents = []
        } else {
          let docs = response.data
          this.documents.push.apply(this.documents, docs)
          this.documents.sort((a, b) => {
            return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          })
        }
      })
      .catch(error => {
        this.errors = error.data
        this.documents = []
      })
    }
  }
}
</script>

<style scoped>
.fa {
  width: 14px;
  height: 14px;
}
.good-table {
  max-width: 100%;
}

.round-button {
  width: 14px;
  height: 24px;
  line-height: 24px;
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

#pdfModal___BV_modal_body_ > iframe:nth-child(1) {
  width: -moz-available;
  height: -moz-available;
  min-height: 90vh;
}
.loading-icon {
  position: absolute;
  z-index: 2;
  background: white;
  height: 100%;
}
</style>
../../../../../../../../services/permissions