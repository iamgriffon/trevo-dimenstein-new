<template>
  <div class="main">
    <div class="row px-3">
      <div class="col-6 col-md">
        <h2>Equipamentos</h2>
      </div>
      <div class="col-4 col-md text-center">
      </div>
      <div class="col-2 col-md text-right">
        <!-- <button v-if="permission.canCreateDocuments(currentUser)" class="btn btn-success" @click="showUploadModal = !showUploadModal"><i class="fa fa-upload d-block d-md-none round-button" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fa fa-upload" aria-hidden="true"></i> fazer upload de documento</span></button> -->
        <router-link v-if="permission.canCreateFacility(currentUser)" class="btn btn-success" :to="{ path: '/facility/'+ $route.params.id +'/equipment/register/'}"><i class="fa fa-plus d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-sm-block"><i class="fa fa-plus" aria-hidden="true"></i> adicionar</span></router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + $route.params.id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">equipamentos</li>
        </ol>
      </nav>
    </div>

    <div class="col-12 row ml-0">
      <div v-for="listByType in listOfEquipmentsByType" class="col-sm-12 col-md-4 col-lg-3 my-3 px-sm-0 px-md-1" v-if="listOfEquipmentsByType.length > 0">
        <router-link :to="'/facility/' + $route.params.id + '/equipments/' + listByType._id">
          <div class="hyper-card card p-0">
            <div class="background-img" v-lazy:background-image="listByType.pathBackgroundImg"></div>
            <div class="text-center p-3">
              <h5 class="card-title text-center">{{ listByType.name }}</h5>
            </div>
          </div>
        </router-link>
      </div>
    </div>
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
</template>

<script>
import auth from '../../../authentication/authentication'
import permission from '../../../../../services/permissions'
import documentUploader from '../../../documentUploader/Index'
import axios from 'axios'

export default {
  components: {
    'document-uploader': documentUploader
  },

  data () {
    return {
      errors: '',
      facility: { name: '' },
      equipments: [],
      currentUser: {},
      listOfEquipmentsByType: [ { name: '', _id: '', pathBackgroundImg: '' } ],
      listOfTypesOfEquipment: [],
      typesOfTest: [],
      showUploadModal: false,
      permission: permission
    }
  },

  // watch: {
  //   showUploadModal () {
  //     if (this.showUploadModal) {
  //       this.$root.$emit('bv::show::modal', 'modal-document')
  //     }
  //   }
  // },

  created () {
    this.loadTypesOfEquipment()

    axios.get(auth.apiUrl() + 'facility/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      console.log(response)
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
              // this.equipments = res.data
              this.listInTypes(res.data, response.data)

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

    listInTypes (equipments, typesOfEquipment) {
      for (let i = 0; i < equipments.length; i++) {
        if (!this.foundIdInList(equipments[i], this.listOfEquipmentsByType)) {
          for (let k = 0; k < typesOfEquipment.length; k++) {
            if (equipments[i].typeId === typesOfEquipment[k]._id) {
              this.listOfEquipmentsByType.push(typesOfEquipment[k])
            }
          }
        }
      }
    },

    foundIdInList (equipment, listOfEquipmentsByType) {
      if (listOfEquipmentsByType.length > 0) {
        for (let i = 0; i < listOfEquipmentsByType.length; i++) {
          if (listOfEquipmentsByType[i]._id === equipment.typeId) {
            return true
          } else if (i === listOfEquipmentsByType.length - 1) {
            return false
          }
        }
      }
    },

    translateTypeParam (type, id) {
      if (type === 'Calibrador de Doses') {
        return 'doseCalibrator'
      } else if (type === 'Contador Geiger') {
        return 'geigerCounter'
      } else if (type === 'Gama Camara') {
        return 'gamaCamara'
      } else {
        return id
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
</style>
../../../../../services/permissions