<template>
  <div class="main">
    <div class="center">
      <div class="col-12" enctype="multipart/form-data">
        <h2>Criar nova instalação</h2>
        <div class="col p-0">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
              <li class="breadcrumb-item active" aria-current="page">adicionar instalação</li>
            </ol>
          </nav>
        </div>
        <div class="hyper-card mb-3">
          <div class="form-group">
            <h4><span class="red">*</span>Departamento:</h4>
            <v-select v-model='facility.department' :options="[{ name: 'both', label: 'Ambos'}, { name: 'nuclearmedicine', label: 'Medicina Nuclear'}, { name: 'radiodiagnosis', label: 'Radiodiagnóstico'}]"></v-select>
          </div>
        </div>
        <div class="hyper-card mb-3">
          <div class="form-group">
            <h4>Grupo:</h4>
            <v-select v-model='facility.group' :options="groupOptions"></v-select>
          </div>
        </div>
        <div class="hyper-card mb-3">
          <div class="form-group">
            <label class="col-form-label" for="formName"><i class="far fa-image" aria-hidden="true"></i> Logo</label>
            <small class="text-muted">escolha uma imagem quadrada</small>
            <input type="file" class="form-control-file" placeholder="" @change="onLogoFileChange">
          </div>
          <div class="form-group">
            <label class="col-form-label" for="formName"><i class="far fa-image" aria-hidden="true"></i> Imagem de Fundo</label>
            <small class="text-muted">escolha uma imagem quadrada</small>
            <input type="file" class="form-control-file" placeholder="" @change="onBackgroundFileChange">
          </div>
        </div>
        <div class="hyper-card mb-3">
          <div class="alert alert-danger" v-if="error">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ errors }}
          </div>
          <div class="row">
            <div class="form-group col-12 col-md">
              <label class="col-form-label" for="formName"><i class="far fa-building" aria-hidden="true"></i> Nome<span class="red">*</span></label>
              <input type="text" class="form-control" placeholder="Nome" v-model="facility.name">
            </div>
            <div class="form-group col-12 col-md">
              <label class="col-form-label" for="formName"><i class="far fa-building" aria-hidden="true"></i> Razão Social<span class="red">*</span></label>
              <input type="text" class="form-control" placeholder="Razão Social" v-model="facility.companyName">
            </div>
          </div>
          <div class="row">
            <div class="form-group col-12 col-md">
              <label class="col-form-label" for="formName"><i class="fa fa-list-alt" aria-hidden="true"></i> CNPJ</label>
              <input type="text" class="form-control" placeholder="00.000.000/0000-00" v-model="facility.cnpj">
            </div>
            <div class="form-group col-6 col-md">
              <label class="col-form-label" for="formName"><i class="fa fa-phone" aria-hidden="true"></i> Telefone</label>
              <input type="text" class="form-control" placeholder="Telefone" v-model="facility.telephone">
            </div>
            <div class="form-group col-6 col-md">
              <label class="col-form-label" for="formName"><i class="fa fa-user" aria-hidden="true"></i> Contato</label>
              <input type="text" class="form-control" placeholder="Contato" v-model="facility.contactName">
            </div>
          </div>
          <div class="row">
            <div class="form-group col-12">
              <label class="col-form-label" for="formName"><i class="fa fa-map-marker" aria-hidden="true"></i> Endereço<span class="red">*</span></label>
              <small class="text-muted">formato: Logradouro, número - Bairro - Cidade - UF CEP</small>
              <input type="text" class="form-control" placeholder="Endereço" v-model="facility.address.street">
            </div>
          </div>
        </div>

        <div class="mb-3">
          <br>
          <br>
          <h4><i class="fa fa-users"></i> Pessoas</h4>
          <br class="d-none d-md-block">
          <br>
          <h5>Selecione as pessoas responsáveis por essa instalação <small class="text-muted"> opcional</small></h5>
          <div class="col-12">
            <div class="form-group">
              <label class="col-form-label">Titular da Instalação: </label>
              <b-btn v-if="facilityTitular" class="btn-success" href="#" v-b-tooltip.hover title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"><i class="fa fa-user"></i> {{ facilityTitular }}</b-btn>
              <b-btn v-else class="btn-outline-success" v-b-modal="'chooseTitular'">Selecionar pessoa</b-btn>
            </div>

            <b-modal id="chooseTitular" ref="chooseTitular" size="lg" title="Selecionar titular da instalação" cancel-title="Cancelar" cancel-variant="success-outline" ok-variant="success">
              <div class="col-12 px-0">
                <div class="input-group input-with-addon">
                  <span class="input-addon"><span class="fa fa-search"></span></span>
                  <input type="text" class="form-control form-with-addon" id="search-input-form" v-model="filter" @input="filter = $event.target.value" placeholder="buscar..." aria-describedby="search-input">
                </div>
                <br>
              </div>
              <div class="col-12" v-if="!filteredUsers.length">
                <br>
                <div class="hyper-card text-center">
                  <h4 class="m-0"><i class="fa fa-square-o" aria-hidden="true"></i></h4>
                </div>
              </div>
              <vue-good-table v-else :columns="columns" :rows="filteredUsers"
                :responsive="false"
                :paginate="true"
                :sort-options="{enabled: true, initialSortBy: {field: 'name', type: 'asc'}}"
                :pagination-options="paginationOptions"
                styleClass="table hyper-table col-12 px-0">
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'action'">
                    <button class="btn btn-success" @click="addToSelectedUsers(props.row._id), selectResponsability(props.row._id, 'Titular da instalação')"><i class="fa fa-plus" aria-hidden="true"></i></button>
                  </span>
                  <span v-else>
                    {{props.formattedRow[props.column.field]}}
                  </span>
                </template>
              </vue-good-table>
            </b-modal>
          </div>

          <div class="col-12">
            <div class="form-group">
              <label class="col-form-label">Responsável técnico: </label>
              <b-btn v-if="tecnicalReponsible" class="btn-success" href="#" v-b-tooltip.hover title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"><i class="fa fa-user"></i> {{ tecnicalReponsible }}</b-btn>
              <b-btn v-else class="btn-outline-success" v-b-modal="'chooseTecnicalReponsible'">Selecionar pessoa</b-btn>
            </div>

            <b-modal id="chooseTecnicalReponsible" ref="chooseTecnicalReponsible" size="lg" title="Selecionar responsável técnico" cancel-title="Cancelar" cancel-variant="success-outline" ok-variant="success">
              <div class="col-12 px-0">
                <div class="input-group input-with-addon">
                  <span class="input-addon"><span class="fa fa-search"></span></span>
                  <input type="text" class="form-control form-with-addon" id="search-input-form" v-model="filter" @input="filter = $event.target.value" placeholder="buscar..." aria-describedby="search-input">
                </div>
                <br>
              </div>
              <div class="col-12" v-if="!filteredUsers.length">
                <br>
                <div class="hyper-card text-center">
                  <h4 class="m-0"><i class="fa fa-square-o" aria-hidden="true"></i></h4>
                </div>
              </div>
              <vue-good-table v-else :columns="columns" :rows="filteredUsers"
                :paginate="true"
                :sort-options="{enabled: true, initialSortBy: {field: 'name', type: 'asc'}}"
                :pagination-options="paginationOptions"
                :responsive="false" styleClass="table hyper-table col-12 px-0">
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'action'">
                    <button class="btn btn-success" @click="addToSelectedUsers(props.row._id), selectResponsability(props.row._id, 'Responsável técnico')"><i class="fa fa-plus" aria-hidden="true"></i></button>
                  </span>
                  <span v-else>
                    {{props.formattedRow[props.column.field]}}
                  </span>
                </template>
              </vue-good-table>
            </b-modal>
          </div>

          <div class="col-12">
            <div class="form-group">
              <label class="col-form-label">Substituto do responsável técnico: </label>
              <b-btn v-if="tecnicalReponsibleSubs" class="btn-success" href="#" v-b-tooltip.hover title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"><i class="fa fa-user"></i> {{ tecnicalReponsibleSubs }}</b-btn>
              <b-btn v-else class="btn-outline-success" v-b-modal="'chooseTecnicalReponsibleSubs'">Selecionar pessoa</b-btn>
            </div>

            <b-modal id="chooseTecnicalReponsibleSubs" ref="chooseTecnicalReponsibleSubs" size="lg" title="Selecionar substituto do responsável técnico" cancel-title="Cancelar" cancel-variant="success-outline" ok-variant="success">
              <div class="col-12 px-0">
                <div class="input-group input-with-addon">
                  <span class="input-addon"><span class="fa fa-search"></span></span>
                  <input type="text" class="form-control form-with-addon" id="search-input-form" v-model="filter" @input="filter = $event.target.value" placeholder="buscar..." aria-describedby="search-input">
                  <br>
                </div>
              </div>
              <div class="col-12" v-if="!filteredUsers.length">
                <br>
                <div class="hyper-card text-center">
                  <h4 class="m-0"><i class="fa fa-square-o" aria-hidden="true"></i></h4>
                </div>
              </div>
              <vue-good-table v-else :columns="columns" :rows="filteredUsers"
                :paginate="true"
                :sort-options="{enabled: true, initialSortBy: {field: 'name', type: 'asc'}}"
                :pagination-options="paginationOptions"
                :responsive="false" styleClass="table hyper-table col-12 px-0">
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'action'">
                    <button class="btn btn-success" @click="addToSelectedUsers(props.row._id), selectResponsability(props.row._id, 'Substituto do responsável técnico')"><i class="fa fa-plus" aria-hidden="true"></i></button>
                  </span>
                  <span v-else>
                    {{props.formattedRow[props.column.field]}}
                  </span>
                </template>
              </vue-good-table>
            </b-modal>
          </div>

          <div class="col-12">
            <div class="form-group">
              <label class="col-form-label">Supervisor de radioproteção: </label>
              <b-btn v-if="radioprotectionSupervisor" class="btn-success" href="#" v-b-tooltip.hover title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"><i class="fa fa-user"></i> {{ radioprotectionSupervisor }}</b-btn>
              <b-btn v-else class="btn-outline-success" v-b-modal="'chooseRadioprotectionSupervisor'">Selecionar pessoa</b-btn>
            </div>

            <b-modal id="chooseRadioprotectionSupervisor" ref="chooseRadioprotectionSupervisor" size="lg" title="Selecionar supervisor de radioproteção" cancel-title="Cancelar" cancel-variant="success-outline" ok-variant="success">
              <div class="col-12 px-0">
                <div class="input-group input-with-addon">
                  <span class="input-addon"><span class="fa fa-search"></span></span>
                  <input type="text" class="form-control form-with-addon" id="search-input-form" v-model="filter" @input="filter = $event.target.value" placeholder="buscar..." aria-describedby="search-input">
                </div>
                <br>
              </div>
              <div class="col-12" v-if="!filteredUsers.length">
                <br>
                <div class="hyper-card text-center">
                  <h4 class="m-0"><i class="fa fa-square-o" aria-hidden="true"></i></h4>
                </div>
              </div>
              <vue-good-table v-else :columns="columns" :rows="filteredUsers"
                :paginate="true"
                :sort-options="{enabled: true, initialSortBy: {field: 'name', type: 'asc'}}"
                :pagination-options="paginationOptions"
                :responsive="false" styleClass="table hyper-table col-12 px-0">
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'action'">
                    <button class="btn btn-success" @click="addToSelectedUsers(props.row._id), selectResponsability(props.row._id, 'Supervisor de radioproteção')"><i class="fa fa-plus" aria-hidden="true"></i></button>
                  </span>
                  <span v-else>
                    {{props.formattedRow[props.column.field]}}
                  </span>
                </template>
              </vue-good-table>
            </b-modal>
          </div>

          <div class="col-12">
            <div class="form-group">
              <label class="col-form-label">Substituto do supervisor de radioproteção: </label>
              <b-btn v-if="radioprotectionSupervisorSub" class="btn-success" href="#" v-b-tooltip.hover title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"><i class="fa fa-user"></i> {{ radioprotectionSupervisorSub }}</b-btn>
              <b-btn v-else class="btn-outline-success" v-b-modal="'chooseRadioprotectionSupervisorSubs'">Selecionar pessoa</b-btn>
            </div>

            <b-modal id="chooseRadioprotectionSupervisorSubs" ref="chooseRadioprotectionSupervisorSubs" size="lg" title="Selecionar substituto do supervisor de radioproteção" cancel-title="Cancelar" cancel-variant="success-outline" ok-variant="success">
              <div class="col-12 px-0">
                <div class="input-group input-with-addon">
                  <span class="input-addon"><span class="fa fa-search"></span></span>
                  <input type="text" class="form-control form-with-addon" id="search-input-form" v-model="filter" @input="filter = $event.target.value" placeholder="buscar..." aria-describedby="search-input">
                  <br>
                </div>
              </div>
              <div class="col-12" v-if="!filteredUsers.length">
                <br>
                <div class="hyper-card text-center">
                  <h4 class="m-0"><i class="fa fa-square-o" aria-hidden="true"></i></h4>
                </div>
              </div>
              <vue-good-table v-else :columns="columns" :rows="filteredUsers"
                :paginate="true"
                :sort-options="{enabled: true, initialSortBy: {field: 'name', type: 'asc'}}"
                :pagination-options="paginationOptions"
                :responsive="false" styleClass="table hyper-table col-12 px-0">
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'action'">
                    <button class="btn btn-success" @click="addToSelectedUsers(props.row._id), selectResponsability(props.row._id, 'Substituto do supervisor de radioproteção')"><i class="fa fa-plus" aria-hidden="true"></i></button>
                  </span>
                  <span v-else>
                    {{props.formattedRow[props.column.field]}}
                  </span>
                </template>
              </vue-good-table>
            </b-modal>
          </div>
          <br>
          <br>

          <h5>Selecione as outras pessoas que terão acesso a essa instalação</h5>
          <small class="text-muted">opcional. Usuários rad dimenstein possuem acesso a todas as instalações por padrão.</small>
          <br>
          <br>
          <div class="col-12 px-0">
            <div class="input-group input-with-addon">
              <span class="input-addon"><span class="fa fa-search"></span></span>
              <input type="text" class="form-control form-with-addon" id="search-input-form" @input="secondFilter = $event.target.value" placeholder="buscar..." aria-describedby="search-input">
            </div>
            <br>
          </div>
          <div class="col-12" v-if="!secondFilteredUsers.length">
            <br>
            <div class="hyper-card text-center">
              <h4 class="m-0"><i class="fa fa-square-o" aria-hidden="true"></i></h4>
            </div>
          </div>
          <vue-good-table v-else :columns="columns" :rows="secondFilteredUsers"
            :paginate="true"
            :sort-options="{enabled: true, initialSortBy: {field: 'name', type: 'asc'}}"
            :pagination-options="paginationOptions"
            :responsive="false" styleClass="table hyper-table col-12 px-0">
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'action'">
                <button class="btn btn-success" @click="addToSelectedUsers(props.row._id)"><i class="fa fa-plus" aria-hidden="true"></i></button>
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>
          <br>
          <br>
          <h5>Pessoas selecionadas</h5>
          <div class="col-12" v-if="!facility.users.length">
            <br>
            <div class="hyper-card">
              Nenhuma pessoa selecionada...
            </div>
          </div>
          <vue-good-table v-else :columns="columnsWithResponsability" :rows="facility.users"
            :paginate="true"
            :sort-options="{enabled: true, initialSortBy: {field: 'name', type: 'asc'}}"
            :pagination-options="paginationOptions"
            :responsive="false" styleClass="table hyper-table col-12 px-0">
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'action'">
                <button class="btn btn-danger" @click="removeFromSelectedUsers(props.row._id)"><i class="fa fa-times" aria-hidden="true"></i></button>
              </span>
              <span v-else-if="props.column.field == 'responsability'">
                {{ props.row.responsabilities.join(", ") }}
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>
        </div>
        <br/><br/><br/>
        <div class="hyper-card mb-3">
          <div class="form-group">
            <label class="col-form-label" for="formName"><i class="far fa-file" aria-hidden="true"></i> Matrícula CNEN</label>
            <small class="text-muted">opcional</small>
            <input type="text" class="form-control" placeholder="00000" v-model="facility.CNENregistry">
          </div>
          <div class="form-group">
            <h4>Práticas Autorizadas: <small class="text-muted"> opcional</small></h4>
            <div class="form-check form-check-inline">
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="facility.doInpatientTherapy">
                Terapia com Internação
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="facility.doOutpatientTherapy">
                Terapia Ambulatorial
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="facility.doDiagnosis">
                Diagnóstico
              </label>
            </div>
          </div>
          <div class="row">
            <h4 class="col-12">Quantidade de radionuclídeos autorizados por semana: <small class="text-muted"> opcional</small></h4>
            <div class="form-group col-12 col-md-4" v-for="radioisotope in facility.radioisotopes">
              <div class="form-check form-check-inline" >
                <label class="form-check-label form-inline">
                  <input type="checkbox" :checked="radioisotope.quantity > 0" class="form-check-input col-1" @click="((radioisotope.quantity == null) ? radioisotope.quantity = 0 : radioisotope.quantity = null)">
                  <span class="col-4">{{ radioisotope.name }}</span>
                  <input type="text" class="form-control col-4" placeholder="00.00" v-model="radioisotope.quantity">
                  <span class="col-2">mCi</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-success btn-block" @click="register()">Criar instalação</button>
        <br>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '@/services/authentication'
import axios from 'axios'

export default {
  data () {
    return {
      filter: '',
      secondFilter: '',
      users: [],
      columns: [
        {
          label: '',
          field: 'action'
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
      columnsWithResponsability: [
        {
          label: '',
          field: 'action'
        },
        {
          label: 'Nome',
          field: 'name'
        },
        {
          label: 'Tipo de Usuário',
          field: 'type'
        },
        {
          label: 'Responsabilidade',
          field: 'responsability'
        }
      ],
      groupOptions: [],
      paginationOptions: {
        enabled: true,
        nextLabel: '>',
        prevLabel: '<',
        rowsPerPageLabel: 'Linhas por página:',
        ofLabel: 'de',
        pageLabel: 'página',
        allLabel: 'Todos'
      },
      facility: {
        name: '',
        companyName: '',
        cnpj: '',
        address: {},
        telephone: '',
        CNENregistry: '',
        professionCNEN: '',
        professionNumberCNEN: '',
        validityOfOperationAuthorization: '',
        logoImg: '',
        backgroundImg: '',
        doInpatientTherapy: false,
        doOutpatientTherapy: false,
        doDiagnosis: false,
        radioisotopes: [
          {name: 'C(11)', quantity: null},
          {name: 'Cr(51)', quantity: null},
          {name: 'F(18)', quantity: null},
          {name: 'Ga(67)', quantity: null},
          {name: 'Ga(68)', quantity: null},
          {name: 'I(123)', quantity: null},
          {name: 'I(125)', quantity: null},
          {name: 'I(131)', quantity: null},
          {name: 'In(111)', quantity: null},
          {name: 'Lu(177)', quantity: null},
          {name: 'Ra(233)', quantity: null},
          {name: 'Sm(153)', quantity: null},
          {name: 'Tc(99m)', quantity: null},
          {name: 'Tl(201)', quantity: null},
          {name: 'Y(90)', quantity: null}
        ],
        usersId: [],
        users: []
      },
      error: '',
      errors: '',
      facilityTitular: '',
      tecnicalReponsible: '',
      tecnicalReponsibleSubs: '',
      radioprotectionSupervisor: '',
      radioprotectionSupervisorSub: ''
    }
  },

  computed: {
    filteredUsers () {
      if (this.filter.length > 0) {
        let exp = new RegExp(this.filter.trim(), 'i')
        let users = this.users.filter(user => exp.test(user.name))
        return users
      } else {
        return this.users
      }
    },
    secondFilteredUsers () {
      if (this.secondFilter.length > 0) {
        let exp = new RegExp(this.secondFilter.trim(), 'i')
        let users = this.users.filter(user => exp.test(user.name))
        return users.filter(user => !this.facility.users.includes(user))
      } else {
        return this.users.filter(user => !this.facility.users.includes(user))
      }
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'users/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.users = ''
      } else {
        for (var i = 0; i < response.data.length; i++) {
          this.users.push({_id: response.data[i]._id, name: response.data[i].name, type: response.data[i].type, responsabilities: [], ANLicenseNumber: response.data[i].ANLicenseNumber, FMLicenseNumber: response.data[i].FMLicenseNumber})
        }
        this.users.sort()
      }
    })
    .catch(error => {
      this.errors = error.data
      this.users = ''
    })

    axios.get(auth.apiUrl() + 'group', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.groupOptions = ''
      } else {
        for (let i = 0; i < response.data.length; i++) {
          this.groupOptions.push({ name: { name: response.data[i].name, _id: response.data[i]._id }, label: response.data[i].name })
        }
        this.groupOptions.sort((a, b) => {
          if (a.label > b.label) return 1
          if (a.label < b.label) return -1
          return 0
        })
      }
    })
    .catch(error => {
      this.errors = error.data
      this.groupOptions = ''
    })
    this.currentUser = auth.currentUser()
  },
  methods: {
    register () {
      var credentials = {
        name: this.facility.name,
        companyName: this.facility.companyName,
        cnpj: this.facility.cnpj,
        telephone: this.facility.telephone,
        contactName: this.facility.contactName,
        address: this.facility.address,

        CNENregistry: this.facility.CNENregistry,
        professionCNEN: this.facility.professionCNEN,
        professionNumberCNEN: this.facility.professionNumberCNEN,
        validityOfOperationAuthorization: this.facility.validityOfOperationAuthorization,
        doInpatientTherapy: this.facility.doInpatientTherapy,
        doOutpatientTherapy: this.facility.doOutpatientTherapy,
        doDiagnosis: this.facility.doDiagnosis,
        radioisotopes: this.facility.radioisotopes,
        department: this.facility.department.name,
        group: this.facility.group.name,

        backgroundImg: this.facility.backgroundImg,
        logoImg: this.facility.logoImg,

        users: this.facility.users
      }

      auth.registerFacility(this, credentials, '/facility')
    },

    addRadioisotope (radioisotope) {
      this.facility.radioisotopes.push({radioisotope: 0})
    },

    resetFilters () {
      this.filter = ''
      this.secondFilter = ''
    },

    selectResponsability (userId, userResponsability) {
      var user = this.users.find(user => user._id === userId)
      user.responsabilities.push(userResponsability)
      this.resetFilters()

      if (userResponsability === 'Titular da instalação') {
        this.facilityTitular = user.name
        this.$refs.chooseTitular.hide()
      } else if (userResponsability === 'Responsável técnico') {
        this.tecnicalReponsible = user.name
        this.$refs.chooseTecnicalReponsible.hide()
      } else if (userResponsability === 'Substituto do responsável técnico') {
        this.tecnicalReponsibleSubs = user.name
        this.$refs.chooseTecnicalReponsibleSubs.hide()
      } else if (userResponsability === 'Supervisor de radioproteção') {
        this.radioprotectionSupervisor = user.name
        this.$refs.chooseRadioprotectionSupervisor.hide()
      } else if (userResponsability === 'Substituto do supervisor de radioproteção') {
        this.radioprotectionSupervisorSub = user.name
        this.$refs.chooseRadioprotectionSupervisorSubs.hide()
      }
    },

    addToSelectedUsers (userId, userResponsability) {
      this.resetFilters()
      var user = this.users.find(user => user._id === userId)
      if (!this.facility.users.includes(user)) {
        this.facility.users.push(user)
        this.facility.usersId.push(user._id)
      }
    },

    removeFromSelectedUsers (userId) {
      this.resetFilters()
      var user = this.facility.users.find(user => user._id === userId)
      if (this.facility.users.indexOf(user) !== -1) {
        this.facility.users.splice(this.facility.users.indexOf(user), 1)
        this.facility.usersId.splice(this.facility.usersId.indexOf(user._id), 1)
        user.responsabilities = []

        if (user.name === this.facilityTitular) {
          this.facilityTitular = ''
        }
        if (user.name === this.tecnicalReponsible) {
          this.tecnicalReponsible = ''
        }
        if (user.name === this.tecnicalReponsibleSubs) {
          this.tecnicalReponsibleSubs = ''
        }
        if (user.name === this.radioprotectionSupervisor) {
          this.radioprotectionSupervisor = ''
        }
        if (user.name === this.radioprotectionSupervisorSub) {
          this.radioprotectionSupervisorSub = ''
        }
      }
      if (!this.users.includes(user)) {
        this.filteredUsers.push(user)
      }
    },

    onProfessionCNENChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createProfessionCNENFile(files[0])
    },
    createProfessionCNENFile (file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        vm.facility.professionCNEN = e.target.result
      }
      reader.readAsDataURL(file)
    },

    onLogoFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createLogo(files[0])
    },
    createLogo (file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        var image = new Image()
        image.onload = function (imageEvent) {
          var canvas = document.createElement('canvas')
          var maxSize = 200
          var width = image.width
          var height = image.height
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
          }
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d').drawImage(image, 0, 0, width, height)

          var dataUrl = canvas.toDataURL('image/png')

          vm.facility.logoImg = dataUrl
        }
        image.src = e.target.result
      }
      reader.readAsDataURL(file)
    },
    onBackgroundFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createBackground(files[0])
    },
    createBackground (file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        var image = new Image()
        image.onload = function (imageEvent) {
          var canvas = document.createElement('canvas')
          var maxSize = 300
          var width = image.width
          var height = image.height
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
          }
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d').drawImage(image, 0, 0, width, height)

          var dataUrl = canvas.toDataURL('image/png')

          vm.facility.backgroundImg = dataUrl
        }
        image.src = e.target.result
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

#search-input-form {
  margin-left: 0px;
}

div.vgt-wrap__footer.vgt-clearfix {
  margin-left: 0;
  width: 100%;
}
</style>
