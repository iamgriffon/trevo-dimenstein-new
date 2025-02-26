<template>
  <div class="main">
    <div class="row px-3">
      <div class="col">
        <h2>Gerenciamento de Rejeitos Líquidos</h2>
      </div>
      <div class="col text-right">
        <b-btn @click="exportAllData" v-b-popover.hover.top="'exportar'" variant="secondary" class="btn btn-gray-secondary"><i class="fa fa-download d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fa fa-download" aria-hidden="true"></i></span></b-btn>
        <b-btn @click="" v-b-popover.hover.top="'agregar'" variant="secondary" class="btn btn-gray-secondary"><i class="fas fa-project-diagram d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fas fa-project-diagram" aria-hidden="true"></i></span></b-btn>
        <router-link v-if="permission.canCreateFacility(currentUser)" class="btn btn-success" :to="{ path: '/facility/' + facility._id + '/routines/liquidwastemanagement/register'}"><i class="fa fa-plus d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-sm-block"><i class="fa fa-plus" aria-hidden="true"></i> adicionar</span></router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/routines'">rotinas</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">gerenciamento de rejeitos líquidos</li>
        </ol>
      </nav>
    </div>

    <div class="col row mx-0">
      <div class="row w-100">
        <div class="col-12 col-md-6">
          <div class="form-inline col pb-3 filter">
            <div class="form-group">
              <v-select type="text" :options="filterStatusOptions" v-model="filterStatus" class="mx-sm-3"></v-select>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-right float-right">
            <div class="form-group pull-right">
              <date-picker v-model="filterDate" type="month" lang="pt-br" format="MM-YYYY" :clearable="false">
                <template slot="calendar-icon">
                  <i class="far fa-calendar-alt"></i>
                </template>
              </date-picker>
            </div>
          </div>
        </div>
      </div>
      <vue-good-table
      :columns="columns"
      :sort-options="{ enabled: true, initialSortBy: {field: 'date', type: 'asc'} }"
      :rows="filteredLiquidWasteManagementList"
      :responsive="true"
      :paginate="true"
      :pagination-options="paginationOptions"
      styleClass="table table-responsive hyper-table small-table mx-md-2 col-12 mx-sm-0"
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'date'">
            {{ props.row.date | moment('DD/MM/YY')}}
          </span>
          <span v-else-if="props.column.field == 'radiationPlanLiberationPrevision'">
            {{ props.row.radiationPlanLiberationPrevision | moment('DD/MM/YY')}}
          </span>
          <span v-else-if="props.column.field == 'calculatedLiberationPrevision'">
            {{ props.row.calculatedLiberationPrevision | moment('DD/MM/YY')}}
          </span>
          <span v-else-if="props.column.field == 'responsibleForLiberating'">
            {{ props.row.responsibleForLiberating ? props.row.responsibleForLiberating.name : '' }}
          </span>
          <span v-else-if="props.column.field == 'responsibleForClosing'">
            {{ props.row.responsibleForClosing ? props.row.responsibleForClosing.name : '' }}
          </span>
          <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span>
        </template>
      </vue-good-table>
    </div>
    <br><br>
    <div class="col-12 row hyper-card" v-if="filteredLiquidWasteManagementList.length > 0">
      <div class="col-12">
        <h5>Gerar Relatórios</h5>
      </div>
      <div class="col-12 row">
        <div class="col-6">
          <div class="form-group col-12">
            escolher mês: <v-select type="text" :options="filterMonthOptions" v-model="filterMonth" class="mx-sm-3"></v-select>
          </div>
          <div class="form-group mx-4 col-12" v-if="responsibleOptions.length > 0">
            <label class="col-form-label" for="selectType"><i class="far fa-user" aria-hidden="true"></i> Responsável</label>
            <v-select v-model="responsible" :options="responsibleOptions"></v-select>
          </div>
        </div>
        <div class="col pt-4 text-right">
          <button @click="downloadReport()" class="btn btn-outline-metalic-seaweed"><i class="fa fa-download d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fa fa-download" aria-hidden="true"></i> relatório mensal</span></button>
        </div>
      </div>
    </div>
    <br><br><br><br>
  </div>
</template>

<script>
import auth from '../../../../authentication/authentication'
import permission from '../../../../../../services/permissions'
import axios from 'axios'
import moment from 'moment'
import JsPDF from 'jspdf'
import DatePicker from 'vue2-datepicker'

var today = new Date()

export default {
  components: { DatePicker },
  data () {
    return {
      facility: {},
      liquidWasteManagementList: [],
      tagNumber: 0,
      newYear: true,
      filterDate: today,
      filterStatus: 'armazenamento',
      currentUser: {},
      // filterMonth: '',
      ready: false,
      filterStatusOptions: ['todos', 'liberados', 'armazenamento'],
      total: 0,
      filter: '',
      permission: permission,
      // filterOptions: [],
      // filterMonth: '',
      filterMonthOptions: [
        { label: 'Janeiro', value: 0 },
        { label: 'Fevereiro', value: 1 },
        { label: 'Março', value: 2 },
        { label: 'Abril', value: 3 },
        { label: 'Maio', value: 4 },
        { label: 'Junho', value: 5 },
        { label: 'Julho', value: 6 },
        { label: 'Agosto', value: 7 },
        { label: 'Setembro', value: 8 },
        { label: 'Outubro', value: 9 },
        { label: 'Novembro', value: 10 },
        { label: 'Dezembro', value: 11 }
      ],
      columns: [
        {
          label: 'Data',
          field: 'date'
        },
        {
          label: 'Isótopo',
          field: 'radioisotope'
        },
        {
          label: 'Atividade do Rejeito (mCi)',
          field: 'activity'
        },
        {
          label: 'Volume (ml)',
          field: 'volume'
        },
        {
          label: 'Previsão de Liberação PPR',
          field: 'radiationPlanLiberationPrevision'
        },
        {
          label: 'Responsável',
          field: 'responsibleForClosing'
        },
        {
          label: 'Estimativa de Liberação',
          field: 'calculatedLiberationPrevision'
        },
        {
          label: 'Data de Liberação',
          field: 'liberationDate'
        },
        {
          label: 'Exposição na Liberação (mR/h)',
          field: 'liberationExposure'
        },
        {
          label: 'Responsável pela Liberação',
          field: 'responsibleForLiberating'
        },
        {
          label: 'Ação',
          field: 'action'
        }
      ],
      paginationOptions: {
        enabled: true,
        nextLabel: '>',
        prevLabel: '<',
        rowsPerPageLabel: 'Linhas por página:',
        ofLabel: 'de',
        pageLabel: 'página',
        allLabel: 'Todos'
      },
      filterOptions: [],
      responsibleOptions: [],
      responsible: { _id: '', name: '' }
    }
  },

  watch: {
    filterDate: function () {
      this.liquidWasteManagementList = []
      this.loadLiquidWasteManagement('armazenados')
      this.loadLiquidWasteManagement('liberados')
    }
  },

  computed: {
    filteredLiquidWasteManagementList () {
      if (this.filterStatus === 'liberados') {
        if (this.filterDate !== '') {
          this.filterMonth = this.filterMonthOptions[this.filterDate.getMonth()]
          let exp = new RegExp(this.filterDate.getFullYear(), 'i')
          let rmmList = this.liquidWasteManagementList.filter(rmm => exp.test(rmm.date)).filter(rmm => rmm.liberationDate)
          let rmmListMonth = rmmList.filter(rmm => (new Date(rmm.date).getMonth() === this.filterMonth.value))
          return rmmListMonth
        } else {
          this.filterMonth = this.filterMonthOptions[this.filterDate.getMonth()]
          let exp = new RegExp(this.filterDate.getFullYear(), 'i')
          let rmmList = this.liquidWasteManagementList.filter(rmm => exp.test(rmm.date)).filter(rmm => rmm.liberationDate)
          let rmmListMonth = rmmList.filter(rmm => (new Date(rmm.date).getMonth() === this.filterMonth.value))
          return rmmListMonth
        }
      } else if (this.filterStatus === 'armazenamento') {
        if (this.filterDate !== '') {
          this.filterMonth = this.filterMonthOptions[this.filterDate.getMonth()]
          let exp = new RegExp(this.filterDate.getFullYear(), 'i')
          let rmmList = this.liquidWasteManagementList.filter(rmm => exp.test(rmm.date)).filter(rmm => !rmm.liberationDate)
          let rmmListMonth = rmmList.filter(rmm => (new Date(rmm.date).getMonth() === this.filterMonth.value))
          return rmmListMonth
        } else {
          this.filterMonth = this.filterMonthOptions[this.filterDate.getMonth()]
          let exp = new RegExp(this.filterDate.getFullYear(), 'i')
          let rmmList = this.liquidWasteManagementList.filter(rmm => exp.test(rmm.date)).filter(rmm => !rmm.liberationDate)
          let rmmListMonth = rmmList.filter(rmm => (new Date(rmm.date).getMonth() === this.filterMonth.value))
          return rmmListMonth
        }
      } else {
        if (this.filterDate !== '') {
          this.filterMonth = this.filterMonthOptions[this.filterDate.getMonth()]
          let exp = new RegExp(this.filterDate.getFullYear(), 'i')
          let rmmList = this.liquidWasteManagementList.filter(rmm => exp.test(rmm.date))
          let rmmListMonth = rmmList.filter(rmm => (new Date(rmm.date).getMonth() === this.filterMonth.value))
          return rmmListMonth
        } else {
          this.filterMonth = this.filterMonthOptions[this.filterDate.getMonth()]
          let exp = new RegExp(this.filterDate.getFullYear(), 'i')
          let rmmList = this.liquidWasteManagementList.filter(rmm => exp.test(rmm.date))
          let rmmListMonth = rmmList.filter(rmm => (new Date(rmm.date).getMonth() === this.filterMonth.value))
          return rmmListMonth
        }
      }
    },
    filteredLiquidWasteManagementListByMonth () {
      var listByMonth = [
        {
          month: 'Janeiro',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Fevereiro',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Março',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Abril',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Maio',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Junho',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Julho',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Agosto',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Setembro',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Outubro',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Novembro',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }, {
          month: 'Dezembro',
          list: [
            {label: 'C(11)', activity: 0},
            {label: 'Cr(51)', activity: 0},
            {label: 'F(18)', activity: 0},
            {label: 'Ga(67)', activity: 0},
            {label: 'Ga(68)', activity: 0},
            {label: 'I(123)', activity: 0},
            {label: 'I(125)', activity: 0},
            {label: 'I(131)', activity: 0},
            {label: 'In(111)', activity: 0},
            {label: 'Lu(177)', activity: 0},
            {label: 'Ra(233)', activity: 0},
            {label: 'Sm(153)', activity: 0},
            {label: 'Tc(99m)', activity: 0},
            {label: 'Tl(201)', activity: 0},
            {label: 'Y(90)', activity: 0}
          ]
        }
      ]
      for (let i = 0; i < this.liquidWasteManagementList.length; i++) {
        var rmm = this.liquidWasteManagementList[i]
        var rmmMonth = new Date(rmm.date).getMonth()

        for (var month = 0; month < listByMonth.length; month++) {
          for (let j = 0; j < listByMonth[month].list.length; j++) {
            if (listByMonth[month].list[j].label === rmm.radioisotope && rmmMonth === month) {
              listByMonth[month].list[j].activity += parseFloat(rmm.activity)
            }
          }
        }
      }
      return listByMonth
    }
  },

  created () {
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
      this.facility = ''
    })
    this.filterMonth = this.filterMonthOptions[new Date().getMonth()]
    this.loadLiquidWasteManagement('armazenados')
    this.loadLiquidWasteManagement('liberados')
    this.currentUser = auth.currentUser()

    axios.get(auth.apiUrl() + 'users/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.responsibleOptions = []
      } else {
        let responseUsers = response.data.filter(user => { return user.type === 'rad fisico' })
        this.responsibleOptions = responseUsers.map(user => { return { label: user.name, name: user.name, _id: user._id } })
      }
    })
    .catch(error => {
      this.errors = error.data
      this.responsibleOptions = []
    })
  },

  methods: {
    loadLiquidWasteManagement (status) {
      if (status === '') {
        this.liquidWasteManagementList = []
      }
      var filter = {}
      if (this.filterDate.getMonth() === 11) {
        filter = {
          status: status,
          pageSize: 10,
          pageNum: 1,
          facilityId: this.$route.params.id,
          dateGte: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '01',
          dateLt: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '31',
          limit: 10
        }
      } else {
        filter = {
          status: status,
          pageSize: 10,
          pageNum: 1,
          facilityId: this.$route.params.id,
          dateGte: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '01',
          dateLt: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 2).toString() + '-' + '01',
          limit: 10
        }
      }

      axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id + '/routines/liquidWasteManagement/', {headers: {Authorization: 'Bearer ' + auth.getToken()}, params: { filters: filter }})
      .then(response => {
        if (response.data.list.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.liquidWasteManagementList = []
        } else {
          var total = response.data.paging.total
          this.liquidWasteManagementList.push.apply(this.liquidWasteManagementList, response.data.list)
          for (var i = 0; i < response.data.list.length; i++) {
            if (!this.filterOptions.includes(response.data.list[i].date.split('-')[0])) {
              this.filterOptions.push(response.data.list[i].date.split('-')[0])
            }
          }
          for (let i = 2; i <= (total / filter.limit + 1); i++) {
            if (this.filterDate.getMonth() === 11) {
              filter = {
                status: status,
                pageSize: 10,
                pageNum: i,
                facilityId: this.$route.params.id,
                dateGte: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '01',
                dateLt: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '31',
                limit: 10
              }
            } else {
              filter = {
                status: status,
                pageSize: 10,
                pageNum: i,
                facilityId: this.$route.params.id,
                dateGte: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '01',
                dateLt: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 2).toString() + '-' + '01',
                limit: 10
              }
            }
            axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id + '/routines/liquidWasteManagement/', {headers: {Authorization: 'Bearer ' + auth.getToken()}, params: { filters: filter }})
            .then(resp => {
              if (resp.data.list.length === 0) {
                this.errors = 'Nenhum resultado encontrado'
              } else {
                this.liquidWasteManagementList.push.apply(this.liquidWasteManagementList, resp.body.list)
              }
            })
          }
        }
      })
      .catch(error => {
        this.errors = error.data
      })
    },

    exclude (id) {
      if (confirm('Tem certeza que deseja excluir este rejeito?')) {
        auth.excludeFacilityRoutineLiquidWasteManagement(this, {_id: id}, () => setTimeout(this.loadLiquidWasteManagement(''), 1000))
      }
    },

    liberate (id) {
      if (confirm('Tem certeza que deseja liberar este rejeito?')) {
        auth.liberateFacilityRoutineLiquidWasteManagement(this, {
          _id: id,
          liberationDate: new Date(),
          responsibleForLiberating: { name: auth.currentUser().name, _id: auth.currentUser().id }
        }, () => setTimeout(this.loadLiquidWasteManagement(''), 1000))
      }
    },

    exportAllData () {
      const rows = [['Data', 'Isótopo', 'Local', 'Atividade do Rejeito (mCi)', 'Volume (ml)', 'Responsável', 'Previsão de Liberação PPR', 'Estimativa de Liberação', 'Data de Liberação', 'Exposição na Liberação(mR/h)', 'Responsável pela Liberação']]
      let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      for (let i = 0; i < this.liquidWasteManagementList.length; i++) {
        if (new Date(this.liquidWasteManagementList[i].date).getFullYear() === parseFloat(this.filter)) {
          let liberationDate = ''
          let responsibleForLiberating = ''
          if (this.liquidWasteManagementList[i].responsibleForLiberating) {
            liberationDate = moment(this.liquidWasteManagementList[i].liberationDate).format('DD/MM/YY')
            responsibleForLiberating = this.liquidWasteManagementList[i].responsibleForLiberating.name
          }
          let localization = ''
          if (this.liquidWasteManagementList[i].localization) {
            localization = this.liquidWasteManagementList[i].localization
          } else {
            localization = ''
          }
          let liberationExposure = ''
          if (liberationDate !== '') {
            liberationExposure = '<0.02'
          } else {
            liberationExposure = ''
          }

          rows.push([
            moment(this.liquidWasteManagementList[i].date).format('DD/MM/YY'),
            localization,
            this.liquidWasteManagementList[i].radioisotope,
            this.liquidWasteManagementList[i].activity,
            this.liquidWasteManagementList[i].volume,
            this.liquidWasteManagementList[i].responsibleForClosing.name,
            moment(this.liquidWasteManagementList[i].radiationPlanLiberationPrevision).format('DD/MM/YY'),
            moment(this.liquidWasteManagementList[i].calculatedLiberationPrevision).format('DD/MM/YY'),
            liberationDate,
            liberationExposure,
            responsibleForLiberating
          ])
        }
      }
      rows.forEach(function (rowArray) {
        let row = rowArray.join(';')
        csvContent += row + '\r\n'
      })
      var encodedUri = encodeURI(csvContent)
      var link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', this.facility.name + ' - Gerenciamento de Rejeito Líquido - ' + this.filterMonth.value + '.csv')
      document.body.appendChild(link)
      link.click()
    },

    addLabelAndInformation (doc, x, y, label, information) {
      var spaceBetweenInformationAndLabel = 5

      doc.setFontSize(8)
      doc.setFontStyle('bold')
      doc.text(label, x, y)
      doc.setFontSize(10)
      doc.setFontStyle('normal')
      if (information) {
        doc.text(information, x, y + spaceBetweenInformationAndLabel)
      } else {
        doc.text('', x, y + spaceBetweenInformationAndLabel)
      }
    },

    truncate (str, n) {
      return (str.length > n) ? str.substr(0, n - 3) + '...' : str
    },

    downloadReport () {
      var doc = new JsPDF('l')

      var radLogo = require('../../../../shared/radLogo').radLogo()
      // var lineHeight = 12
      var beginRoundedRect = 10
      var beginTextHeight = beginRoundedRect + 13

      // let numPages = Math.ceil(this.solidWasteManagementList.length / 19)
      // numPages = 5

      let actualPage = 1
      let j = 27
      for (let i = 0; i < this.liquidWasteManagementList.length; i++) {
        if (new Date(this.liquidWasteManagementList[i].date).getFullYear() === parseFloat(this.filterDate.getFullYear()) && new Date(this.liquidWasteManagementList[i].date).getMonth() === this.filterMonth.value) {
          if (j === 27) {
            doc.addPage()
            doc.roundedRect(10, beginTextHeight + 15, 278, 20 + j * 4, 2, 2, 'S')

            doc.roundedRect(177, 10, 111, 22, 2, 2, 'F')
            doc.addImage(radLogo, 'PNG', 182, 12, 74, 20)

            doc.roundedRect(10, beginRoundedRect, 160, 22, 2, 2, 'S')
            doc.setFontSize(12)
            doc.setFontStyle('bold')
            doc.text(90, beginRoundedRect + 6, 'Relatório de Gerenciamento de Rejeitos Líquidos', null, null, 'center')

            this.addLabelAndInformation(doc, 15, beginTextHeight, 'Razão Social:', this.truncate(this.facility.companyName, 43))
            this.addLabelAndInformation(doc, 75, beginTextHeight, 'Mês:', this.filterMonth.label)
            this.addLabelAndInformation(doc, 125, beginTextHeight, 'Responsável:', this.responsible.name)

            doc.setFontSize(8)
            doc.setFontStyle('bold')
            doc.text(15, beginTextHeight + 28, 'Data')
            doc.text(36, beginTextHeight + 28, 'Isótopo')
            doc.text(56, beginTextHeight + 25, 'Atividade')
            doc.text(56, beginTextHeight + 28, '(mCi)')
            doc.text(82, beginTextHeight + 25, 'Volume')
            doc.text(82, beginTextHeight + 28, '(ml)')
            doc.text(106, beginTextHeight + 22, 'Previsão de')
            doc.text(106, beginTextHeight + 25, 'Liberação')
            doc.text(106, beginTextHeight + 28, 'PPR')
            doc.text(132, beginTextHeight + 28, 'Responsável')
            doc.text(162, beginTextHeight + 25, 'Estimativa')
            doc.text(162, beginTextHeight + 28, 'de Liberação')
            doc.text(192, beginTextHeight + 25, 'Data de')
            doc.text(192, beginTextHeight + 28, 'Liberação')
            doc.text(216, beginTextHeight + 22, 'Exposição')
            doc.text(216, beginTextHeight + 25, 'de Liberação')
            doc.text(216, beginTextHeight + 28, '(mR/h)')
            doc.text(246, beginTextHeight + 22, 'Responsável')
            doc.text(246, beginTextHeight + 25, 'pela')
            doc.text(246, beginTextHeight + 28, 'Liberação')

            doc.setFontSize(12)
            doc.setFontStyle('bold')
            doc.text(154, 172 + 6, 'Observações', null, null, 'center')
            doc.setFontSize(10)
            doc.setFontStyle('normal')
            doc.text(15, 172 + 12, 'Para liberação dos rejeitos líquidos é realizada a medida da taxa de exposição com o detector de radiação Geiger-Muller. O valor da taxa de exposição para liberação do')
            doc.text(15, 172 + 16, 'rejeito deve ser igual ao valor da taxa de exposição ambiente (0,02mR/h). Todos os rejeitos líquidos são monitorados antes de serem desprezados, como descrito no')
            doc.text(15, 172 + 20, 'Plano de Proteção Radiológica (PPR), seguindo as Normas da CNEN.')
            doc.roundedRect(10, 172, 278, 26, 2, 2, 'S')

            var numPag = Math.floor(this.liquidWasteManagementList.length / 24) + 1
            doc.text(280, 196, actualPage + '/' + numPag)

            actualPage++
            j = 1
          }
          var liberationDate = ''
          var liberationExposure = ''
          var responsibleForLiberating = ''
          var responsibleForClosing = ''

          if (this.liquidWasteManagementList[i].liberationDate) {
            liberationDate = moment(this.liquidWasteManagementList[i].liberationDate).format('DD/MM/YY')
          }
          if (this.liquidWasteManagementList[i].liberationDate) {
            liberationExposure = '<0.02'
          }
          if (this.liquidWasteManagementList[i].responsibleForLiberating) {
            if (this.liquidWasteManagementList[i].responsibleForLiberating.name.length > 14) {
              responsibleForLiberating = this.liquidWasteManagementList[i].responsibleForLiberating.name.substring(0, 14) + '.'
            } else {
              responsibleForLiberating = this.liquidWasteManagementList[i].responsibleForLiberating.name
            }
          }
          if (this.liquidWasteManagementList[i].responsibleForClosing.name.length > 14) {
            responsibleForClosing = this.liquidWasteManagementList[i].responsibleForClosing.name.substring(0, 14) + '.'
          } else {
            responsibleForClosing = this.liquidWasteManagementList[i].responsibleForClosing.name
          }

          doc.setFontSize(8)
          doc.setFontStyle('normal')
          doc.text(15, beginTextHeight + 33 + j * 4, moment(this.liquidWasteManagementList[i].date).format('DD/MM/YY'))
          doc.text(36, beginTextHeight + 33 + j * 4, this.liquidWasteManagementList[i].radioisotope)
          doc.text(56, beginTextHeight + 33 + j * 4, parseFloat(this.liquidWasteManagementList[i].activity).toFixed(2))
          doc.text(82, beginTextHeight + 33 + j * 4, parseFloat(this.liquidWasteManagementList[i].volume).toFixed(1))
          doc.text(106, beginTextHeight + 33 + j * 4, moment(this.liquidWasteManagementList[i].radiationPlanLiberationPrevision).format('DD/MM/YY'))
          doc.text(132, beginTextHeight + 33 + j * 4, responsibleForClosing)
          doc.text(162, beginTextHeight + 33 + j * 4, moment(this.liquidWasteManagementList[i].calculatedLiberationPrevision).format('DD/MM/YY'))
          doc.text(192, beginTextHeight + 33 + j * 4, liberationDate)
          doc.text(216, beginTextHeight + 33 + j * 4, liberationExposure)
          doc.text(246, beginTextHeight + 33 + j * 4, responsibleForLiberating)

          j++
        }
      }
      doc.deletePage(1)

      doc.save('Informações ' + this.facility.name + '.pdf')
    }
  }
}
</script>
<style>
table.hyper-table.small-table > thead > tr > th {
  padding: 12px 12px 0 12px;
  min-width: 140px;
  font-size: 14px;
  vertical-align: bottom !important;
}
</style>
../../../../../../services/permissions