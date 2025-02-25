<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col">
        <h1>{{ facility.name }}</h1>
      </div>
      <div class="col text-right">
        <router-link :to="{ path: '/facility/' + facility._id + '/info' }" class="btn btn-outline-metalic-seaweed"><i class="fa fa-info d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fa fa-info" aria-hidden="true"></i> informações</span></router-link>
        <router-link :to="facility._id + '/edit'" v-if="permission.canEditFacility(currentUser)" class="btn btn-outline-success"><i class="fas fa-edit d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fas fa-edit" aria-hidden="true"></i> editar</span></router-link>
        <button @click="exclude()" v-if="permission.canExcludeFacility(currentUser)" class="btn btn-outline-danger"><i class="far fa-trash-alt d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="far fa-trash-alt" aria-hidden="true"></i> excluir</span></button>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ facility.name }}</li>
        </ol>
      </nav>
    </div>

    <div class="col-12 row px-0 mx-0">
      <router-link :to="'/facility/' + facility._id + '/documents'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h3>Lista de Documentos</h3>
      </router-link>
      <router-link :to="'/facility/' + facility._id + '/equipments'" class="hyper-card col m-3 left-border-metalic-seaweed hyper-card-shadow-hover">
        <h3>Equipamentos</h3>
      </router-link>
      <router-link :to="'/facility/' + facility._id + '/routines'" class="hyper-card col m-3 left-border-queen-blue hyper-card-shadow-hover">
        <h3>Rotinas</h3>
      </router-link>
    </div>
    <br>
    <br>
    <div class="col-12">
      <h3 v-if="facility.users.length > 0">Pessoas</h3>
      <vue-good-table :columns="columns" :rows="facility.users" :paginate="false" styleClass="table hyper-table pl-0 pl-md-2 ml-0 ml-md-2 mr-2 col-12">
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'icon'">
            <span :data-letters-list="props.row.name.split(' ')[0].charAt(0) + props.row.name.split(' ')[1].charAt(0)"></span>
          </span>
          <span v-else-if="props.column.field == 'responsability'">
            {{ props.row.responsabilities.join(", ") }}
          </span>
          <span v-else-if="props.column.field == 'actions'">
            <router-link :to="{ path: '/user/' + props.row._id }" class="btn btn-light"><i class="fa fa-user" aria-hidden="true"></i> informações</router-link>
          </span>
          <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span>
        </template>
      </vue-good-table>
    </div>
    <div class="col-12">
      <br/>
      <hr v-if="permission.canCreateDocuments(currentUser)"/>
      <div v-if="permission.canCreateDocuments(currentUser)" class="col-6 col-md">
        <h2>Enviar Documentos</h2>
      </div>
      <br/>
      <document-uploader
        v-if="permission.canCreateDocuments(currentUser)"
        :show="showUploadModal"
        :facilityOptions="[facility]"
        :equipmentOptions="equipments"
        :typesOfTestOptions="typesOfTest"
      />
      <br/><br/>
    </div>
  </div>
</template>

<script>
import auth from '../../authentication/authentication'
import permission from '../../../../services/permissions'
import axios from 'axios'
import documentUploader from '../../documentUploader/Index'

export default {
  components: {
    'document-uploader': documentUploader
  },

  data () {
    return {
      permission: permission,
      facility: {
        users: [],
        equipments: []
      },
      equipments: [],
      typesOfTest: [],
      dataLetters: '',
      currentUser: {},
      columns: [
        {
          label: '',
          field: 'icon'
        },
        {
          label: 'Nome',
          field: 'name'
        },
        {
          label: 'Responsabilidade',
          field: 'responsability'
        },
        {
          label: 'Ações',
          field: 'actions',
          width: '10%'
        }
      ]
    }
  },

  created () {
    this.loadTypesOfEquipment()

    axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      console.log(response.data)
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.facility = ''
      } else {
        this.facility._id = response.data._id
        this.facility.name = response.data.name
        this.facility.companyName = response.data.companyName
        this.facility.cnpj = response.data.cnpj
        this.facility.telephone = response.data.telephone
        this.facility.address = response.data.address

        this.facility.CNENregistry = response.data.CNENregistry
        this.facility.professionCNEN = response.data.professionCNEN
        this.facility.professionNumberCNEN = response.data.professionNumberCNEN
        this.facility.validityOfOperationAuthorization = response.data.validityOfOperationAuthorization
        this.facility.doInpatientTherapy = response.data.doInpatientTherapy
        this.facility.doOutpatientTherapy = response.data.doOutpatientTherapy
        this.facility.doDiagnosis = response.data.doDiagnosis
        this.facility.radioisotopes = response.data.radioisotopes

        this.facility.users = response.data.users
      }
    })
    .catch(error => {
      this.errors = error.data
      this.facility = ''
    })
    this.currentUser = auth.currentUser()
  },

  methods: {
    loadTypesOfEquipment () {
      this.listOfEquipmentsByType = []
      this.listOfTypesOfEquipment = []
      axios.get(auth.apiUrl() + 'typeOfEquipment', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
      .then(response => {
        if (response.data.length === 0) {
          this.errors = 'Nenhum resultado encontrado'
          this.listOfTypesOfEquipment = ''
        } else {
          this.listOfTypesOfEquipment = response.data

          axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id + '/equipments', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
          .then(res => {
            if (res.data.length === 0) {
              this.errors = 'Nenhum resultado encontrado'
              this.equipments = ''
            } else {
              // for update file form:
              for (let equipment of res.data) {
                axios.get(auth.apiUrl() + 'test/typeOfEquipment/' + equipment.typeId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
                .then(r => {
                  if (!r.data.length) {
                    console.log('')
                  } else {
                    for (const typeOfTest of r.data) {
                      if (!this.typesOfTest.find(e => { return e._id === typeOfTest._id })) {
                        this.typesOfTest.push({ name: typeOfTest.typeOfEquipment + ' - ' + typeOfTest.name, testName: typeOfTest.name, _id: typeOfTest._id })
                      }
                    }
                    this.typesOfTest.sort((a, b) => {
                      return a.name.localeCompare(b.name)
                    })
                  }
                })
                equipment.name = equipment.type + ' - ' + equipment.manufacturer + ' ' + equipment.model + ' ' + equipment.serialNumber
                this.equipments.push(equipment)
              }
              this.equipments.sort((a, b) => {
                return a.name.localeCompare(b.name)
              })
            }
          }).catch(error => {
            this.errors = error.data
            this.equipments = ''
          })
        }
      })
      .catch(error => {
        this.errors = error.data
        this.listOfTypesOfEquipment = ''
      })
    },

    exclude () {
      if (confirm('Tem certeza que deseja excluir esta instalação?')) {
        auth.excludeFacility(this, this.facility, '/facility')
      }
    },
    downloadFacilityProfession () {
      var professionCNEN = document.getElementById('professionCNEN')
      professionCNEN.href = this.facility.professionCNEN

      professionCNEN.click()
    }
  }
}
</script>

<style scoped>
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

.fa {
  width: 14px;
  height: 14px;
}
</style>
../../../../services/permissions