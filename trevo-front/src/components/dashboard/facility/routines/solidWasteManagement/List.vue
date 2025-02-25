<template>
  <div class="main">
    <div class="row px-3">
      <div class="col">
        <h2>Gerenciamento de Rejeitos Sólidos</h2>
      </div>
      <div class="col text-right">
        <a href="#" @click="downloadHowToFill" class="pr-3">como preencher a etiqueta?</a>
        <a id="como-preencher" download="como-preencher.png" style="display:none;" href="/static/img/como-preencher-etiqueta.png"/>
        <b-btn @click="exportAllData" v-b-popover.hover.top="'exportar'" variant="secondary" class="btn btn-gray-secondary"><i class="fa fa-download d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fa fa-download" aria-hidden="true"></i></span></b-btn>
        <router-link v-if="permission.canCreateSolidWasteManagement(currentUser)" class="btn btn-success" :to="{ path: '/facility/' + facility._id + '/routines/solidwastemanagement/register/' + (parseFloat(tagNumber) + 1)}"><i class="fa fa-plus d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-sm-block"><i class="fa fa-plus" aria-hidden="true"></i> adicionar</span></router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/routines'">rotinas</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">gerenciamento de rejeitos sólidos</li>
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
            <div class="form-group">
              <v-select type="text" :options="filterLocalizationOptions" v-model="filterLocalization" class="mx-sm-3"></v-select>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-right float-right">
            <div class="form-group pull-right">
              <date-picker v-model="filterDate" type="year" lang="pt-br" format="YYYY" :clearable="false">
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
      :sort-options="{ enabled: true, initialSortBy: {field: 'tagNumber', type: 'asc'} }"
      :rows="filteredSolidWasteManagementList"
      :responsive="false"
      :paginate="true"
      :pagination-options="paginationOptions"
      styleClass="table table-responsive hyper-table small-table mx-md-2 col-12 mx-sm-0"
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'action'" class='d-inline-flex'>
            <b-btn v-if="permission.canLiberateSolidWasteManagement(currentUser)" v-b-popover.hover.top="'liberar'" variant="secondary" @click="liberateSolidWasteManagement(props.row._id)" class="btn btn-gray-success mr-2">
              <i class="fas fa-check" aria-hidden="true"></i>
            </b-btn>
            <b-btn v-if="permission.canExcludeSolidWasteManagement(currentUser)" v-b-popover.hover.top="'excluir'" @click="excludeSolidWasteManagement(props.row._id)" class="btn btn-gray-danger">
              <i class="far fa-trash-alt" aria-hidden="true"></i>
            </b-btn>
          </span>
          <span v-else-if="props.column.field == 'date'">
            {{ props.row.date | moment('DD/MM/YY')}}
          </span>
          <span v-else-if="props.column.field == 'weight'">
            {{ parseFloat(props.row.weight).toFixed(1) }}
          </span>
          <span v-else-if="props.column.field == 'exposure' & isNaN(parseFloat(props.row.exposure))">
          </span>
          <span v-else-if="props.column.field == 'exposure' & !isNaN(parseFloat(props.row.exposure))">
            {{ parseFloat(props.row.exposure).toFixed(2) }}
          </span>
          <span v-else-if="props.column.field == 'activity' & isNaN(parseFloat(props.row.activity))">
          </span>
          <span v-else-if="props.column.field == 'activity' & !isNaN(parseFloat(props.row.activity))">
            {{ parseFloat(props.row.activity).toFixed(2) }}
          </span>
          <span v-else-if="props.column.field == 'radiationPlanLiberationPrevision'">
            {{ props.row.radiationPlanLiberationPrevision | moment('DD/MM/YY')}}
          </span>
          <span v-else-if="props.column.field == 'calculatedLiberationPrevision'">
            {{ props.row.calculatedLiberationPrevision | moment('DD/MM/YY')}}
          </span>
          <span v-else-if="props.column.field == 'responsibleForClosing' & !props.row.responsibleForClosing">
          </span>
          <span v-else-if="props.column.field == 'responsibleForClosing'">
            {{ props.row.responsibleForClosing.name }}
          </span>
          <span v-else-if="props.column.field == 'responsibleForLiberating' & !props.row.responsibleForLiberating">
          </span>
          <span v-else-if="props.column.field == 'responsibleForLiberating'">
            {{ props.row.responsibleForLiberating.name }}
          </span>
          <span v-else-if="props.column.field == 'liberationDate'">
            {{ props.row.liberationDate | moment('DD/MM/YY')}}
          </span>
          <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span>
        </template>
      </vue-good-table>
    </div>
    <br><br>
    <div class="col-12 row hyper-card" v-if="filteredSolidWasteManagementList.length > 0">
      <div class="col-12">
        <h5>Gerar Relatórios</h5>
      </div>
      <div class="col-12 row">
        <div class="col pl-5">
          <div class="form-group">
            escolher mês: <v-select type="text" :options="filterReportMonth" v-model="filterMonth" class="mx-sm-3"></v-select>
          </div>
          <div class="form-group mx-3" v-if="responsibleOptions.length > 0">
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
/* eslint no-labels: ["error", { "allowLoop": true }] */
export default {
  components: { DatePicker },
  data () {
    return {
      facility: {},
      solidWasteManagementList: [],
      permission: permission,
      tagNumber: 0,
      newYear: true,
      filterDate: today,
      filterStatus: 'armazenamento',
      filterLocalization: '',
      // filterMonth: '',
      ready: false,
      filterLocalizationOptions: [''],
      filterStatusOptions: ['todos', 'liberados', 'armazenamento'],
      total: 0,
      filterReportMonth: [
        {label: 'Janeiro', value: 0},
        {label: 'Fevereiro', value: 1},
        {label: 'Março', value: 2},
        {label: 'Abril', value: 3},
        {label: 'Maio', value: 4},
        {label: 'Junho', value: 5},
        {label: 'Julho', value: 6},
        {label: 'Agosto', value: 7},
        {label: 'Setembro', value: 8},
        {label: 'Outubro', value: 9},
        {label: 'Novembro', value: 10},
        {label: 'Dezembro', value: 11}],
      radioisotopes: [
        { label: 'Cr(51)', value: 'Cr(51)', halfLife: 667.2, bigGamma: 0.00000632, liberationPrevisionDays: 160, CNENLimit: 1 },
        { label: 'F(18)', value: 'F(18)', halfLife: 1.83, bigGamma: 0.000185, liberationPrevisionDays: 3, CNENLimit: 0.01 },
        { label: 'Ga(67)', value: 'Ga(67)', halfLife: 78, bigGamma: 0.00039, liberationPrevisionDays: 90, CNENLimit: 0.1 },
        { label: 'Ga(68)', value: 'Ga(68)', halfLife: 1.13, bigGamma: 0.0176, liberationPrevisionDays: 3, CNENLimit: 0.01 },
        { label: 'I(123)', value: 'I(123)', halfLife: 13.2, bigGamma: 0.0000748, liberationPrevisionDays: 15, CNENLimit: 100 },
        { label: 'I(131)', value: 'I(131)', halfLife: 193, bigGamma: 0.0000764, liberationPrevisionDays: 120, CNENLimit: 0.1 },
        { label: 'In(111)', value: 'In(111)', halfLife: 67.2, bigGamma: 0.000136, liberationPrevisionDays: 90, CNENLimit: 0.1 },
        { label: 'Lu(177)', value: 'Lu(177)', halfLife: 162, bigGamma: 0.00000764, liberationPrevisionDays: 180, CNENLimit: 1 },
        { label: 'Ra(233)', value: 'Ra(233)', halfLife: 274, bigGamma: 0.0000879, liberationPrevisionDays: 390, CNENLimit: 0.1 },
        { label: 'Sm(153)', value: 'Sm(153)', halfLife: 46.3, bigGamma: 0.0000244, liberationPrevisionDays: 90, CNENLimit: 0.1 },
        { label: 'Tc(99m)', value: 'Tc(99m)', halfLife: 6.02, bigGamma: 0.00337, liberationPrevisionDays: 15, CNENLimit: 0.1 },
        { label: 'Tl(201)', value: 'Tl(201)', halfLife: 72.91, bigGamma: 0.00237, liberationPrevisionDays: 90, CNENLimit: 0.1 }
      ],
      columns: [
        {
          label: 'Data',
          field: 'date'
        },
        {
          label: 'N. Etiqueta',
          field: 'tagNumber',
          type: 'number'
        },
        {
          label: 'Localização',
          field: 'localization'
        },
        {
          label: 'Tipo',
          field: 'wasteType'
        },
        {
          label: 'Isótopo',
          field: 'radioisotope'
        },
        {
          label: 'Peso (kg)',
          field: 'weigth'
        },
        {
          label: 'Exposição (mR/h)',
          field: 'exposure'
        },
        {
          label: 'Atividade (mCi)',
          field: 'activity'
        },
        {
          label: 'Previsão Liberação PPR',
          field: 'radiationPlanLiberationPrevision'
        },
        {
          label: 'Previsão Liberação Calculada',
          field: 'calculatedLiberationPrevision'
        },
        {
          label: 'Responsável',
          field: 'responsibleForClosing'
        },
        {
          label: 'Data Liberação',
          field: 'liberationDate'
        },
        {
          label: 'Exposição Liberação (mR/h)',
          field: 'liberationExposure'
        },
        {
          label: 'Atividade Liberação (mCi/kg)',
          field: 'liberationActivity'
        },
        {
          label: 'Responsável pela Liberação',
          field: 'responsibleForLiberating'
        },
        {
          label: 'N. Etiqueta',
          field: 'tagNumber',
          type: 'number'
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
      responsibleOptions: [],
      responsible: { _id: '', name: '' }
    }
  },

  computed: {
    filteredSolidWasteManagementList () {
      if (this.filterDate.getFullYear() > 0) {
        var year = this.filterDate.getFullYear()
        if (this.filterStatus === 'liberados') {
          if (this.filterLocalization) {
            let exp = new RegExp(year, 'i')
            let swmList = this.solidWasteManagementList.filter(swm => exp.test(swm.date)).filter(swm => swm.liberationDate)
            let exp2 = new RegExp(this.filterLocalization.trim(), 'i')
            let swmLocalizationFiltered = swmList.filter(swm => exp2.test(swm.localization))
            return swmLocalizationFiltered
          } else {
            let exp = new RegExp(year, 'i')
            let swmList = this.solidWasteManagementList.filter(swm => exp.test(swm.date)).filter(swm => swm.liberationDate)
            return swmList
          }
        } else if (this.filterStatus === 'armazenamento') {
          if (this.filterLocalization) {
            let exp = new RegExp(year, 'i')
            let swmList = this.solidWasteManagementList.filter(swm => exp.test(swm.date)).filter(swm => !swm.liberationDate)
            let exp2 = new RegExp(this.filterLocalization.trim(), 'i')
            let swmLocalizationFiltered = swmList.filter(swm => exp2.test(swm.localization))
            return swmLocalizationFiltered
          } else {
            let exp = new RegExp(year, 'i')
            let swmList = this.solidWasteManagementList.filter(swm => exp.test(swm.date)).filter(swm => !swm.liberationDate)
            return swmList
          }
        } else {
          if (this.filterLocalization) {
            let exp = new RegExp(year, 'i')
            let swmList = this.solidWasteManagementList.filter(swm => exp.test(swm.date))
            let exp2 = new RegExp(this.filterLocalization.trim(), 'i')
            let swmLocalizationFiltered = swmList.filter(swm => exp2.test(swm.localization))
            return swmLocalizationFiltered
          } else {
            let exp = new RegExp(year, 'i')
            let swmList = this.solidWasteManagementList.filter(swm => exp.test(swm.date))
            return swmList
          }
        }
      } else {
        return []
      }
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

    this.loadSolidWasteManagementList('')

    this.currentUser = auth.currentUser()
    if (this.$route.params.year) {
      this.filterDate = new Date('01/01/' + this.$route.params.year.toString())
    }

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

  watch: {
    filter () {
      // this.$route.params.year = this.filter
    },

    filterStatus () {
      this.solidWasteManagementList.sort((a, b) => { return parseInt(b.tagNumber) - parseInt(a.tagNumber) })
    },

    newYear () {
      if (this.newYear) {
        this.tagNumber = 0
      }
    }
  },

  methods: {
    excludeSolidWasteManagement (id) {
      if (confirm('Tem certeza que deseja excluir este rejeito?')) {
        auth.excludeFacilityRoutineSolidWasteManagement(this, {_id: id},
          () => setTimeout(this.loadSolidWasteManagementList(''), 1000)
        )
      }
    },
    liberateSolidWasteManagement (id) {
      if (confirm('Tem certeza que deseja liberar este rejeito?')) {
        auth.liberateFacilityRoutineSolidWasteManagement(this, {
          _id: id,
          liberationDate: new Date(),
          responsibleForLiberating: { name: auth.currentUser().name, _id: auth.currentUser().id },
          liberationActivity: this.getLiberationActivity(id),
          liberationExposure: this.getLiberationExposure(id)
        },
          () => setTimeout(this.loadSolidWasteManagementList(''), 1000)
        )
      }
    },

    loadSolidWasteManagementList (status) {
      if (status === '') {
        this.solidWasteManagementList = []
      }
      this.tagNumber = 0
      var filter = {
        pageSize: 10,
        pageNum: 1,
        facilityId: this.$route.params.id,
        status: status,
        limit: 10
      }
      axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id + '/routines/solidWasteManagement/', {headers: {Authorization: 'Bearer ' + auth.getToken()}, params: { filters: filter }})
      .then(response => {
        if (response.data.list.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.solidWasteManagementList = []
        } else {
          this.solidWasteManagementList.push.apply(this.solidWasteManagementList, response.data.list)
          var total = response.data.paging.total

          for (var i = 0; i < response.data.list.length; i++) {
            if (parseFloat(response.data.list[i].tagNumber) > parseFloat(this.tagNumber) && new Date().getFullYear() === new Date(response.data.list[i].date).getFullYear()) {
              this.tagNumber = response.data.list[i].tagNumber
            }
            if (new Date().getFullYear() === new Date(response.data.list[i].date).getFullYear()) {
              this.newYear = false
            }
          }
          for (let i = 0; i < response.data.list.length; i++) {
            if (!this.filterLocalizationOptions.includes(response.data.list[i].localization)) {
              this.filterLocalizationOptions.push(response.data.list[i].localization)
            }
          }

          for (let i = 2; i <= (total / filter.limit + 1); i++) {
            filter = {
              pageSize: 10,
              pageNum: i,
              facilityId: this.$route.params.id,
              status: status,
              limit: 10
            }
            axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id + '/routines/solidWasteManagement/', {headers: {Authorization: 'Bearer ' + auth.getToken()}, params: { filters: filter }})
            .then(resp => {
              if (resp.data.list.length === 0) {
                this.errors = 'Nenhum resultado encontrado'
              } else {
                this.solidWasteManagementList.push.apply(this.solidWasteManagementList, resp.data.list)
                for (var k = 0; k < resp.data.list.length; k++) {
                  if (parseFloat(resp.data.list[k].tagNumber) > parseFloat(this.tagNumber) && new Date().getFullYear() === new Date(resp.body.list[k].date).getFullYear()) {
                    this.tagNumber = resp.data.list[k].tagNumber
                  }
                }
              }
            })
          }
        }
      })
      .catch(error => {
        this.errors = error.data
        this.solidWasteManagementList = []
      })
    },

    getLiberationActivity (id) {
      let solidWasteManagement = this.solidWasteManagementList.filter(solidWasteManagement => solidWasteManagement._id === id)[0]
      let radioisotope = this.radioisotopes.filter(radioisotope => radioisotope.value === solidWasteManagement.radioisotope)[0]
      if (solidWasteManagement.exposure === 'Saturação') {
        return '< ' + radioisotope.CNENLimit
      } else {
        let t = new Date() - new Date(solidWasteManagement.date)
        let activity = solidWasteManagement.activity * Math.exp(-(0.6931471806 * t / 1000 / 60 / 60) / radioisotope.halfLife) / solidWasteManagement.weight
        if (activity < radioisotope.CNENLimit || !activity) {
          return '< ' + radioisotope.CNENLimit
        } else {
          activity.toFixed(3).toString()
        }
      }
    },

    getLiberationExposure (id) {
      let solidWasteManagement = this.solidWasteManagementList.filter(solidWasteManagement => solidWasteManagement._id === id)[0]
      let radioisotope = this.radioisotopes.filter(radioisotope => radioisotope.value === solidWasteManagement.radioisotope)[0]
      if (solidWasteManagement.exposure === 'Saturação') {
        return '< 0.02'
      } else {
        let t = new Date() - new Date(solidWasteManagement.date)
        let exposure = solidWasteManagement.exposure * Math.exp(-(0.6931471806 * t / 1000 / 60 / 60) / radioisotope.halfLife)
        if (exposure < 0.02) {
          return '< 0.02'
        } else {
          return exposure.toFixed(3).toString()
        }
      }
    },

    exportAllData () {
      const rows = [['Data', 'N. Etiqueta', 'Localização', 'Tipo', 'Isótopo', 'Peso (kg)', 'Exposição (mSv/h)', 'Atividade (mCi)', 'Previsão de Liberação PPR', 'Previsão de Liberação Calculada', 'Responsável', 'Data de Liberação', 'Exposição de Liberação (mSv/h)', 'Atividade de Liberação (MBq/kg)', 'Responsável pela Liberação']]
      let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      for (let i = 0; i < this.solidWasteManagementList.length; i++) {
        if (new Date(this.solidWasteManagementList[i].date).getFullYear() === parseFloat(this.filterDate.getFullYear())) {
          var exposure = ''
          var activity = ''
          var liberationDate = ''
          var liberationExposure = ''
          var liberationActivity = ''
          var responsibleForLiberating = ''
          if (this.solidWasteManagementList[i].exposure === 'Saturação') {
            exposure = 'Saturação'
            activity = 'Saturação'
          } else if (isNaN(parseFloat(this.solidWasteManagementList[i].activity))) {
            exposure = parseFloat(this.solidWasteManagementList[i].exposure).toFixed(3)
            activity = this.solidWasteManagementList[i].activity
          } else {
            exposure = parseFloat(this.solidWasteManagementList[i].exposure).toFixed(3)
            activity = parseFloat(this.solidWasteManagementList[i].activity).toFixed(3)
          }
          if (this.solidWasteManagementList[i].liberationDate) {
            liberationDate = moment(this.solidWasteManagementList[i].liberationDate).format('DD/MM/YY')
          }
          if (this.solidWasteManagementList[i].liberationExposure) {
            if (isNaN(parseFloat(this.solidWasteManagementList[i].liberationExposure))) {
              liberationExposure = this.solidWasteManagementList[i].liberationExposure
            } else {
              liberationExposure = parseFloat(this.solidWasteManagementList[i].liberationExposure).toFixed(3)
            }
          }
          if (this.solidWasteManagementList[i].liberationActivity) {
            if (isNaN(parseFloat(this.solidWasteManagementList[i].liberationActivity))) {
              liberationActivity = this.solidWasteManagementList[i].liberationActivity
            } else {
              liberationActivity = parseFloat(this.solidWasteManagementList[i].liberationActivity).toFixed(3)
            }
          }
          if (this.solidWasteManagementList[i].responsibleForLiberating) {
            responsibleForLiberating = this.solidWasteManagementList[i].responsibleForLiberating.name
          }

          rows.push([
            moment(this.solidWasteManagementList[i].date).format('DD/MM/YY'),
            this.solidWasteManagementList[i].tagNumber,
            this.solidWasteManagementList[i].localization,
            this.solidWasteManagementList[i].wasteType,
            this.solidWasteManagementList[i].radioisotope,
            this.solidWasteManagementList[i].weight,
            exposure,
            activity,
            moment(this.solidWasteManagementList[i].radiationPlanLiberationPrevision).format('DD/MM/YY'),
            moment(this.solidWasteManagementList[i].calculatedLiberationPrevision).format('DD/MM/YY'),
            this.solidWasteManagementList[i].responsibleForClosing.name,
            liberationDate,
            liberationExposure,
            liberationActivity,
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
      link.setAttribute('download', this.facility.name + ' - Gerenciamento de Rejeitos Sólidos - ' + this.filterDate.getFullYear() + ' .csv')
      document.body.appendChild(link)
      setTimeout(() => { link.click() }, 1000)
    },

    downloadHowToFill () {
      var docButton = document.getElementById('como-preencher')
      docButton.click()
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

    downloadReport (list) {
      var doc = new JsPDF('l')

      var radLogo = require('../../../../shared/radLogo').radLogo()

      // var lineHeight = 12
      var beginRoundedRect = 10
      var beginTextHeight = beginRoundedRect + 13

      // let numPages = Math.ceil(this.solidWasteManagementList.length / 19)
      // numPages = 5

      let j = 18
      for (let i = 0; i < this.solidWasteManagementList.length; i++) {
        if (new Date(this.solidWasteManagementList[i].date).getFullYear() === parseFloat(this.filterDate.getFullYear()) && new Date(this.solidWasteManagementList[i].date).getMonth() === this.filterMonth.value) {
          if (j === 18) {
            doc.addPage()
            doc.roundedRect(10, beginTextHeight + 15, 278, 15 + j * 8, 2, 2, 'S')

            doc.roundedRect(177, 10, 111, 22, 2, 2, 'F')
            doc.addImage(radLogo, 'PNG', 182, 12, 74, 20)

            doc.roundedRect(10, beginRoundedRect, 160, 22, 2, 2, 'S')
            doc.setFontSize(12)
            doc.setFontStyle('bold')
            doc.text(90, beginRoundedRect + 6, 'Relatório de Gerenciamento de Rejeitos Sólidos', null, null, 'center')

            this.addLabelAndInformation(doc, 15, beginTextHeight, 'Razão Social:', this.truncate(this.facility.companyName, 43))
            this.addLabelAndInformation(doc, 75, beginTextHeight, 'Mês:', this.filterMonth.label)
            this.addLabelAndInformation(doc, 125, beginTextHeight, 'Responsável:', this.responsible.name)

            doc.setFontSize(8)
            doc.setFontStyle('bold')
            doc.text(15, beginTextHeight + 28, 'Data')
            doc.text(28, beginTextHeight + 28, 'N. Etiq.')
            doc.text(41, beginTextHeight + 28, 'Local')
            doc.text(56, beginTextHeight + 28, 'Tipo')
            doc.text(95, beginTextHeight + 28, 'Isótopo')
            doc.text(108, beginTextHeight + 25, 'Peso')
            doc.text(108, beginTextHeight + 28, '(kg)')
            doc.text(120, beginTextHeight + 25, 'Exposição')
            doc.text(120, beginTextHeight + 28, '(mR/h)')
            doc.text(136, beginTextHeight + 25, 'Atividade')
            doc.text(136, beginTextHeight + 28, '(mCi)')
            doc.text(152, beginTextHeight + 22, 'Previsão de')
            doc.text(152, beginTextHeight + 25, 'Liberação')
            doc.text(152, beginTextHeight + 28, 'PPR')
            doc.text(170, beginTextHeight + 22, 'Previsão de')
            doc.text(170, beginTextHeight + 25, 'Liberação')
            doc.text(170, beginTextHeight + 28, 'Calculada')
            doc.text(190, beginTextHeight + 28, 'Responsável')
            doc.text(212, beginTextHeight + 25, 'Data de')
            doc.text(212, beginTextHeight + 28, 'Liberação')
            doc.text(228, beginTextHeight + 22, 'Exposição')
            doc.text(228, beginTextHeight + 25, 'de Liberação')
            doc.text(228, beginTextHeight + 28, '(mR/h)')
            doc.text(248, beginTextHeight + 22, 'Atividade')
            doc.text(248, beginTextHeight + 25, 'de Liberação')
            doc.text(248, beginTextHeight + 28, '(mCi/kg)')
            doc.text(267, beginTextHeight + 22, 'Responsável')
            doc.text(267, beginTextHeight + 25, 'pela')
            doc.text(267, beginTextHeight + 28, 'Liberação')

            j = 0
          }
          var exposure = ''
          var activity = ''
          var liberationDate = ''
          var liberationExposure = ''
          var liberationActivity = ''
          var responsibleForLiberating = ''
          var responsibleForClosing = ''

          if (this.solidWasteManagementList[i].exposure === 'Saturação') {
            exposure = 'Saturação'
            activity = 'Saturação'
          } else if (isNaN(parseFloat(this.solidWasteManagementList[i].activity))) {
            exposure = parseFloat(this.solidWasteManagementList[i].exposure).toFixed(2)
            activity = this.solidWasteManagementList[i].activity
          } else {
            exposure = parseFloat(this.solidWasteManagementList[i].exposure).toFixed(2)
            activity = parseFloat(this.solidWasteManagementList[i].activity).toFixed(2)
          }
          if (this.solidWasteManagementList[i].liberationDate) {
            liberationDate = moment(this.solidWasteManagementList[i].liberationDate).format('DD/MM/YY')
          }
          if (this.solidWasteManagementList[i].liberationExposure) {
            if (isNaN(parseFloat(this.solidWasteManagementList[i].liberationExposure))) {
              liberationExposure = this.solidWasteManagementList[i].liberationExposure
            } else {
              liberationExposure = parseFloat(this.solidWasteManagementList[i].liberationExposure).toFixed(2)
            }
          }
          if (this.solidWasteManagementList[i].liberationActivity) {
            if (isNaN(parseFloat(this.solidWasteManagementList[i].liberationActivity))) {
              liberationActivity = this.solidWasteManagementList[i].liberationActivity
            } else {
              liberationActivity = parseFloat(this.solidWasteManagementList[i].liberationActivity).toFixed(2)
            }
          }
          if (this.solidWasteManagementList[i].responsibleForLiberating) {
            if (this.solidWasteManagementList[i].responsibleForLiberating.name.length > 14) {
              responsibleForLiberating = this.solidWasteManagementList[i].responsibleForLiberating.name.substring(0, 14) + '.'
            } else {
              responsibleForLiberating = this.solidWasteManagementList[i].responsibleForLiberating.name
            }
          }
          if (this.solidWasteManagementList[i].responsibleForClosing.name.length > 14) {
            responsibleForClosing = this.solidWasteManagementList[i].responsibleForClosing.name.substring(0, 14) + '.'
          } else {
            responsibleForClosing = this.solidWasteManagementList[i].responsibleForClosing.name
          }

          doc.setFontSize(8)
          doc.setFontStyle('normal')
          console.log(this.solidWasteManagementList[i].tagNumber)
          doc.text(15, beginTextHeight + 33 + j * 8, moment(this.solidWasteManagementList[i].date).format('DD/MM/YY'))
          doc.text(32, beginTextHeight + 33 + j * 8, this.solidWasteManagementList[i].tagNumber.toString())
          doc.text(41, beginTextHeight + 33 + j * 8, this.solidWasteManagementList[i].localization)
          doc.text(56, beginTextHeight + 33 + j * 8, this.solidWasteManagementList[i].wasteType)
          doc.text(95, beginTextHeight + 33 + j * 8, this.solidWasteManagementList[i].radioisotope)
          doc.text(110, beginTextHeight + 33 + j * 8, parseFloat(this.solidWasteManagementList[i].weight).toFixed(1))
          doc.text(120, beginTextHeight + 33 + j * 8, exposure.toString())
          doc.text(136, beginTextHeight + 33 + j * 8, activity.toString())
          doc.text(152, beginTextHeight + 33 + j * 8, moment(this.solidWasteManagementList[i].radiationPlanLiberationPrevision).format('DD/MM/YY'))
          doc.text(170, beginTextHeight + 33 + j * 8, moment(this.solidWasteManagementList[i].calculatedLiberationPrevision).format('DD/MM/YY'))
          doc.text(190, beginTextHeight + 33 + j * 8, responsibleForClosing)
          doc.text(212, beginTextHeight + 33 + j * 8, liberationDate)
          doc.text(228, beginTextHeight + 33 + j * 8, liberationExposure)
          doc.text(248, beginTextHeight + 33 + j * 8, liberationActivity)
          doc.text(266, beginTextHeight + 33 + j * 8, responsibleForLiberating)
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
  /* padding: 12px 12px 0 12px; */
  min-width: 100px;
  /* font-size: 14px; */
  line-height: 1;
  vertical-align: bottom !important;
}

.good-table {
  max-width: 100%;
}


</style>
../../../../../../services/permissions