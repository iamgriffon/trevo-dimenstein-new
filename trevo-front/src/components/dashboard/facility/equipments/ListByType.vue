<template>
  <div class="main">
    <div class="row px-3">
      <div class="col-6 col-md">
        <h2>Equipamentos</h2>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + $route.params.id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + $route.params.id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ typeOfEquipment.name }}</li>
        </ol>
      </nav>
    </div>

    <div class="col-12 row ml-0">
      <vue-good-table
      id="groups-table"
      :columns="columns"
      :rows="equipments"
      :responsive="false"
      :paginate="true"
      :pagination-options="paginationOptions"
      styleClass="table table-responsive d-table hyper-table small-table mx-md-2 col-12 mx-sm-0"
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'actions'">
            <router-link :to="{ path: '/equipments/' + translateType($route.params.typeId) + '/' + props.row._id }"  v-b-popover.hover.top="'informações'" variant="secondary" class="btn btn-gray-success mr-2">
              <i class="fa fa-info" aria-hidden="true"></i>
            </router-link>
            <b-btn v-if="permission.canExcludeDocuments(currentUser)" v-b-popover.hover.top="'excluir'" @click="exclude(props.row._id)" class="btn btn-gray-danger">
              <i class="far fa-trash-alt" aria-hidden="true"></i>
            </b-btn>
          </span>
          <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
import auth from '../../../authentication/authentication'
import permission from '../../../../../services/permissions'
import axios from 'axios'

export default {
  data () {
    return {
      facility: {},
      permission: permission,
      equipments: [],
      typeOfEquipment: { name: '' },
      currentUser: {},
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
          label: 'N. de Série',
          field: 'serialNumber'
        },
        {
          label: 'N. de Série Tubo',
          field: 'serialNumberTube'
        },
        {
          label: 'N. Patrimonial',
          field: 'patrimonialNumber'
        },
        {
          label: 'Fabricante',
          field: 'manufacturer'
        },
        {
          label: 'Modelo',
          field: 'model'
        },
        {
          label: 'Localização',
          field: 'localization'
        },
        {
          label: 'Ações',
          field: 'actions'
        }
      ],
      errors: ''
    }
  },

  created () {
    this.getListOfTypeOfEquipment(this.getFacilityEquipments())

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

    this.currentUser = auth.currentUser()
  },

  methods: {
    getFacilityEquipments () {
      axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id + '/equipments/' + this.$route.params.typeId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(response => {
        if (response.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.equipments = ''
        } else {
          this.equipments = response.data
        }
      })
      .catch(error => {
        this.errors = error.data
        this.equipments = ''
      })
    },

    getListOfTypeOfEquipment (callback) {
      axios.get(auth.apiUrl() + 'typeOfEquipment/' + this.$route.params.typeId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(response => {
        if (response.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.typeOfEquipment = ''
        } else {
          this.typeOfEquipment = response.data
          if (callback) {
            callback()
          }
        }
      })
      .catch(error => {
        this.errors = error.data
        this.listOfTypesOfEquipment = ''
      })
    },
    translateType () {
      if (this.typeOfEquipment.name === 'Calibrador de Doses') {
        return 'doseCalibrator'
      } else if (this.typeOfEquipment.name === 'Contador Geiger') {
        return 'geigerCounter'
      } else if (this.typeOfEquipment.name === 'Gama Camara') {
        return 'gamaCamara'
      } else {
        return this.typeOfEquipment._id
      }
    },

    exclude (id) {
      if (confirm('Tem certeza que deseja excluir este equipamento?')) {
        auth.excludeEquipment(this, {_id: id}, () => setTimeout(this.getFacilityEquipments(), 1000))
      }
    }
  }
}
</script>

<style scoped>
.good-table {
  width: 100%;
  overflow-x: hidden;
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

a.btn {
  min-width: 40px;
}
</style>
../../../../../services/permissions