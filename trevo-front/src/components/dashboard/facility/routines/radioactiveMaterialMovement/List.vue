<template>
  <div class="main">
    <div class="row px-3">
      <div class="col">
        <h2>Movimentação de Material Radioativo</h2>
      </div>
      <div class="col text-right">
        <b-btn @click="exportAllData" v-b-popover.hover.top="'exportar'" variant="secondary" class="btn btn-gray-secondary"><i class="fa fa-download d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fa fa-download" aria-hidden="true"></i></span></b-btn>
        <router-link v-if="permission.canCreateFacility(currentUser)" class="btn btn-success" :to="{ path: '/facility/' + facility._id + '/routines/radioactivematerialmov/register'}"><i class="fa fa-plus d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-sm-block"><i class="fa fa-plus" aria-hidden="true"></i> adicionar</span></router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/routines'">rotinas</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">movimentação de material radioativo</li>
        </ol>
      </nav>
    </div>

    <div class="col row mx-0">
      <div class="row w-100">
        <div class="col">
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
      :rows="filteredRadioactiveMaterialMovementList"
      :responsive="true"
      :paginate="true"
      :pagination-options="paginationOptions"
      styleClass="table table-responsive hyper-table small-table mx-md-2 col-12 mx-sm-0"
      >
        <template slot="table-row" slot-scope="props">

          <span v-if="props.column.field == 'date'">
            {{ props.row.date | moment('DD/MM/YY')}}
          </span>
          <span v-else-if="props.column.field == 'initialActivity'">
            {{ parseFloat(props.row.initialActivity).toFixed(2) }}
          </span>
          <span v-else-if="props.column.field == 'usageActivity'">
            {{ parseFloat(props.row.usageActivity).toFixed(2) }}
          </span>
          <span v-else-if="props.column.field == 'validity'">
            {{ props.row.validity | moment('DD/MM/YY')}}
          </span>
          <span v-else-if="props.column.field == 'responsibleForClosing'">
            {{ props.row.responsible.name }}
          </span>
          <span v-else-if="props.column.field == 'action'">
            <b-btn v-if="props.row.observations" class="btn btn-outline-metalic-seaweed" href="#" v-b-tooltip.hover :title="'Observações: '+ props.row.observations"><i class="fas fa-info-circle"></i></b-btn></button>
            <router-link :to="'/facility/' + facility._id + '/routines/radioactivematerialmov/' + props.row._id + '/edit'" @click="exclude(props.row._id)" class="btn btn-gray-secondary" v-b-tooltip.hover="'editar'"><i class="far fa-edit" aria-hidden="true"></i></router-link>
          </span>
          <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span>
          <!--
          <td></td>
          <td>{{ props.row.radioisotope }}</td>
          <td></td>
          <td></td>
          <td>{{ props.row.lot }}</td>
          <td v-if="props.row.validity"></td>
          <td v-else></td>
          <td>{{ props.row.wasteType }}</td>
          <td>{{ props.row.usage }}</td>
          <td v-if="props.row.responsible">{{ props.row.responsible.name }}</td>
          <td v-else></td>
          <td>
          </td> -->
        </template>
      </vue-good-table>
    </div>
    <br><br>
    <div class="col-12 row ml-0" v-if="filteredRadioactiveMaterialMovementList.length > 0">
      <div class="col">
        <h2>Soma Mensal - {{ filterMonth.label }}</h2>
      </div>
      <div class="col-12 row" v-for="list in filteredRMMListByMonth" v-if="list.month === filterMonth.label">
        <div class="col-10">
          <table class="table table-responsive hyper-table mx-md-2 col-12 mx-sm-0" >
            <thead>
              <tr>
                <th>Isótopo</th>
                <th>Atividade Inicial (mCi)</th>
                <th>Atividade de Uso (mCi)</th>
              </tr>
            </thead>
            <tbody >
              <tr v-for="rmm in list.list" v-if="rmm.initialActivity > 0">
                <td>{{ rmm.label }}</td>
                <td>{{ parseFloat(rmm.initialActivity).toFixed(2) }}</td>
                <td>{{ parseFloat(rmm.usageActivity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-2 text-right">
          <b-btn @click="confirmDownloadFacilityDocument()" v-b-popover.hover.top="'relatório mensal'" variant="secondary" class="btn btn-gray-secondary"><i class="far fa-file-alt d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="far fa-file-alt" aria-hidden="true"></i></span></b-btn>
        </div>
         <b-modal id="modal-center" centered hide-footer no-close-on-backdrop>
          <p class="col-12 mx-auto inline-block" style="width: fit-content">Selecione o responsável</p>
          <div class="form-group mx-3">
            <label class="col-form-label" for="selectType"><i class="far fa-user" aria-hidden="true"></i> Responsável</label>
            <v-select v-model="responsible" :options="responsibleOptions"></v-select>
            <br/>
            <b-btn @click="downloadFacilityDocument(list)">realizar o download</b-btn>
          </div>
        </b-modal>
      </div>
    </div>
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
      permission: permission,
      radioactiveMaterialMovementList: [],
      // filter: '',
      filterDate: today,
      filterMonth: '',
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
          label: 'Atividade Inicial (mCi)',
          field: 'initialActivity'
        },
        {
          label: 'Atividade de Uso (mCi)',
          field: 'usagelActivity'
        },
        {
          label: 'Lote',
          field: 'lot'
        },
        {
          label: 'Validade',
          field: 'validity'
        },
        {
          label: 'Tipo',
          field: 'wasteType'
        },
        {
          label: 'Uso',
          field: 'usage'
        },
        {
          label: 'Responsável',
          field: 'responsibleForClosing'
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
      ready: false,
      filterOptions: [],
      responsibleOptions: [],
      responsible: { _id: '', name: '' },
      showResponsibleModal: false
    }
  },

  computed: {
    filteredRadioactiveMaterialMovementList () {
      if (this.filterDate !== '') {
        this.filterMonth = this.filterMonthOptions[this.filterDate.getMonth()]
        let exp = new RegExp(this.filterDate.getFullYear(), 'i')
        let rmmList = this.radioactiveMaterialMovementList.filter(rmm => exp.test(rmm.date))
        let rmmListMonth = rmmList.filter(rmm => (new Date(rmm.date).getMonth() === this.filterMonth.value))
        return rmmListMonth
      } else {
        this.filterMonth = this.filterMonthOptions[this.filterDate.getMonth()]
        let exp = new RegExp(this.filterDate.getFullYear(), 'i')
        let rmmList = this.radioactiveMaterialMovementList.filter(rmm => exp.test(rmm.date))
        let rmmListMonth = rmmList.filter(rmm => (new Date(rmm.date).getMonth() === this.filterMonth.value))
        return rmmListMonth
      }
    },
    filteredRMMListByMonth () {
      var listByMonth = [
        {
          month: 'Janeiro',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Fevereiro',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Março',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Abril',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Maio',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Junho',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Julho',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Agosto',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Setembro',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Outubro',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Novembro',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }, {
          month: 'Dezembro',
          list: [
            {label: 'C(11)', initialActivity: 0, usageActivity: 0},
            {label: 'Cr(51)', initialActivity: 0, usageActivity: 0},
            {label: 'F(18)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(67)', initialActivity: 0, usageActivity: 0},
            {label: 'Ga(68)', initialActivity: 0, usageActivity: 0},
            {label: 'I(123)', initialActivity: 0, usageActivity: 0},
            {label: 'I(125)', initialActivity: 0, usageActivity: 0},
            {label: 'I(131)', initialActivity: 0, usageActivity: 0},
            {label: 'In(111)', initialActivity: 0, usageActivity: 0},
            {label: 'Lu(177)', initialActivity: 0, usageActivity: 0},
            {label: 'Ra(233)', initialActivity: 0, usageActivity: 0},
            {label: 'Sm(153)', initialActivity: 0, usageActivity: 0},
            {label: 'Tc(99m)', initialActivity: 0, usageActivity: 0},
            {label: 'Tl(201)', initialActivity: 0, usageActivity: 0},
            {label: 'Y(90)', initialActivity: 0, usageActivity: 0}
          ]
        }
      ]
      for (let i = 0; i < this.filteredRadioactiveMaterialMovementList.length; i++) {
        var rmm = this.filteredRadioactiveMaterialMovementList[i]
        var rmmMonth = new Date(rmm.date).getMonth()

        for (var month = 0; month < listByMonth.length; month++) {
          for (let j = 0; j < listByMonth[month].list.length; j++) {
            if (listByMonth[month].list[j].label === rmm.radioisotope && rmmMonth === month) {
              listByMonth[month].list[j].initialActivity += parseFloat(rmm.initialActivity)
              listByMonth[month].list[j].usageActivity += parseFloat(rmm.usageActivity)
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
      console.log(response.data)
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
    this.loadRadioactiveMaterialManagement()

    this.permission = permission
    this.currentUser = auth.currentUser()
  },

  watch: {
    filterDate: function () {
      this.radioactiveMaterialMovementList = []
      this.loadRadioactiveMaterialManagement()
    },
    showResponsibleModal () {
      if (this.showResponsibleModal) {
        this.$root.$emit('bv::show::modal', 'modal-center')
      }
    }
  },

  methods: {
    loadRadioactiveMaterialManagement () {
      var filter = {}
      if (this.filterDate.getMonth() === 11) {
        filter = {
          pageSize: 10,
          pageNum: 1,
          facilityId: this.$route.params.id,
          dateGte: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '01',
          dateLt: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '31',
          limit: 10
        }
      } else {
        filter = {
          pageSize: 10,
          pageNum: 1,
          facilityId: this.$route.params.id,
          dateGte: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '01',
          dateLt: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 2).toString() + '-' + '01',
          limit: 10
        }
      }

      axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id + '/routines/radioactiveMaterialMovement/', {headers: {Authorization: 'Bearer ' + auth.getToken()}, params: { filters: filter }})
      .then(response => {
        if (response.data.list.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.radioactiveMaterialMovementList = []
        } else {
          var total = response.data.paging.total
          this.radioactiveMaterialMovementList.push.apply(this.radioactiveMaterialMovementList, response.data.list)
          for (var i = 0; i < response.data.list.length; i++) {
            if (!this.filterOptions.includes(response.data.list[i].date.split('-')[0])) {
              this.filterOptions.push(response.data.list[i].date.split('-')[0])
            }
          }
          for (let i = 2; i <= (total / filter.limit + 1); i++) {
            if (this.filterDate.getMonth() === 11) {
              filter = {
                pageSize: 10,
                pageNum: i,
                facilityId: this.$route.params.id,
                dateGte: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '01',
                dateLt: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '31',
                limit: 10
              }
            } else {
              filter = {
                pageSize: 10,
                pageNum: i,
                facilityId: this.$route.params.id,
                dateGte: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 1).toString() + '-' + '01',
                dateLt: this.filterDate.getFullYear().toString() + '-' + (this.filterDate.getMonth() + 2).toString() + '-' + '01',
                limit: 10
              }
            }
            axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id + '/routines/radioactiveMaterialMovement/', {headers: {Authorization: 'Bearer ' + auth.getToken()}, params: { filters: filter }})
            .then(resp => {
              if (resp.data.list.length === 0) {
                this.errors = 'Nenhum resultado encontrado'
              } else {
                this.radioactiveMaterialMovementList.push.apply(this.radioactiveMaterialMovementList, resp.data.list)
              }
            })
          }
        }
      })
      .catch(error => {
        this.errors = error.data
        this.radioactiveMaterialMovementList = []
      })
    },

    exportAllData () {
      const rows = [['Data', 'Isótopo', 'Atividade Inicial (que chegou ou eluída) (mCi)', 'Atividade de Uso (mCi)', 'Número de Doses ou Pacientes', 'Lote', 'Validade', 'Tipos de Rejeito', 'Uso', 'Responsável', 'Observações']]
      let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      for (let i = 0; i < this.radioactiveMaterialMovementList.length; i++) {
        // var usagePeriod = ''
        // if (this.radioactiveMaterialMovementList[i].date !== this.radioactiveMaterialMovementList[i].usagePeriod) {
        //   usagePeriod = moment(this.radioactiveMaterialMovementList[i].date).format('DD/MM/YY') + ' à ' + moment(this.radioactiveMaterialMovementList[i].usagePeriod).format('DD/MM/YY')
        // } else {
        //   usagePeriod = moment(this.radioactiveMaterialMovementList[i].date).format('DD/MM/YY')
        // }
        // console.log(new Date(this.radioactiveMaterialMovementList[i].date).getFullYear(), this.filterDate.getFullYear())
        if (new Date(this.radioactiveMaterialMovementList[i].date).getFullYear() === this.filterDate.getFullYear()) {
          console.log('?')
          rows.push([
            moment(this.radioactiveMaterialMovementList[i].date).format('DD/MM/YY'),
            this.radioactiveMaterialMovementList[i].radioisotope,
            this.radioactiveMaterialMovementList[i].initialActivity,
            // usagePeriod,
            this.radioactiveMaterialMovementList[i].usageActivity,
            this.radioactiveMaterialMovementList[i].numberOfDoses,
            this.radioactiveMaterialMovementList[i].lot,
            this.radioactiveMaterialMovementList[i].validity,
            this.radioactiveMaterialMovementList[i].wasteType,
            this.radioactiveMaterialMovementList[i].usage,
            this.radioactiveMaterialMovementList[i].responsible.name,
            this.radioactiveMaterialMovementList[i].observations
          ])
        }
      }
      console.log(rows)
      rows.forEach(function (rowArray) {
        let row = rowArray.join(';')
        csvContent += row + '\r\n'
      })
      var encodedUri = encodeURI(csvContent)
      var link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', this.facility.name + ' - Movimentação de Material Radioativo.csv')
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

    confirmDownloadFacilityDocument () {
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
      this.showResponsibleModal = true
    },

    truncate (str, n) {
      return (str.length > n) ? str.substr(0, n - 1) + '...' : str
    },

    downloadFacilityDocument (list) {
      var doc = new JsPDF()

      var radLogo = require('../../../../shared/radLogo').radLogo()
      // var lineHeight = 12
      var beginRoundedRect = 45
      var beginTextHeight = beginRoundedRect + 15

      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

      doc.roundedRect(10, beginRoundedRect, 190, 25, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginRoundedRect - 4, 'Relatório de Movimentação de Material Radioativo', null, null, 'center')
      doc.text(105, beginRoundedRect + 8, list.month, null, null, 'center')

      this.addLabelAndInformation(doc, 15, beginTextHeight, 'Razão Social:', this.truncate(this.facility.companyName, 50))
      this.addLabelAndInformation(doc, 135, beginTextHeight, 'Responsável:', this.responsible.name)

      doc.text(15, beginTextHeight + 22, 'Isótopo')
      doc.text(105, beginTextHeight + 22, 'Atividade Inicial (mCi)', null, null, 'center')
      doc.text(195, beginTextHeight + 22, 'Atividade de Uso (mCi)', null, null, 'right')

      let j = 0
      for (let i = 0; i < list.list.length; i++) {
        if (list.list[i].initialActivity > 0 && list.list[i].usageActivity > 0) {
          doc.text(15, beginTextHeight + 32 + j * 8, list.list[i].label)
          doc.text(105, beginTextHeight + 32 + j * 8, parseFloat(list.list[i].initialActivity).toFixed(2).toString(), null, null, 'center')
          doc.text(195, beginTextHeight + 32 + j * 8, parseFloat(list.list[i].usageActivity).toFixed(2).toString(), null, null, 'right')
          j++
        }
      }
      doc.roundedRect(10, beginTextHeight + 15, 190, 15 + j * 8, 2, 2, 'S')

      doc.save('Informações ' + this.facility.name + '.pdf')
      this.showResponsibleModal = false
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