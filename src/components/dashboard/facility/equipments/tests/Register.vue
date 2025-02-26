<template>
  <div class="main">
    <router-link class="btn btn-link-success to-right" :to="{ path: '/equipments/' + equipment.typeId + '/' + equipment._id + '/' + this.$route.params.id + '/register-old'}">versão antiga</router-link>
    <br/><br/>
    <document-uploader 
      :facilityOptions="[facility]"
      :equipmentOptions="[equipment]"
      :typesOfTestOptions="[typeOfTest]"
      :redirect="'/equipments/' + equipment.typeId + '/' + equipment._id + '/' + this.$route.params.id"
    />
  </div>
</template>

<script>
import auth from '../../../../authentication/authentication'
import permission from '../../../../../../services/permissions'
import axios from 'axios'
import documentUploader from '../../../../documentUploader/Index'

export default {
  components: {
    'document-uploader': documentUploader
  },

  data () {
    return {
      today: new Date(),
      loading: false,
      permission: permission,
      filter: '',
      files: [],
      typeOfTest: [],
      file: {},
      currentUser: {},
      facilities: [],
      facility: {},
      equipment: {
        _id: '',
        name: ''
      },
      testName: '',
      test: {
        name: '',
        date: '',
        validity: '',
        uploadedAt: '',
        _id: '',
        facility: {},
        equipment: {},
        hash: '',
        mode: '',
        position: '',
        conclusion: '',
        status: '',
        comments: []
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
      statusOptions: ['Falta assinar', 'Corrigir', 'Assinado', 'Liberado'],
      conclusionOptions: ['Satisfatório', 'Satisfatório com observações', 'Insatisfatório'],
      error: '',
      invalidDate: false,
      invalidFile: false,
      invalidStatus: false,
      invalidConclusion: false,
      invalidValidity: false,
      openCommentaryBox: false,
      commentaryText: ''
    }
  },

  watch: {
    loading () {
      if (this.loading) {
        this.$root.$emit('bv::show::modal', 'modal-center')
      }
    },
    'test.hash' (newVal, oldVal) {
      if (newVal) {
        this.statusOptions = ['Assinado', 'Liberado']
      } else {
        this.statusOptions = ['Em andamento', 'Corrigir', 'Falta assinar', 'Assinado', 'Liberado']
      }
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.equipmentId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.equipment = ''
      } else {
        this.equipment = response.data
        this.equipment.name = `${response.data.type} - ${response.data.manufacturer} ${response.data.model} ${response.data.serialNumber}`
        this.equipment.fullName = `${response.data.type} - ${response.data.manufacturer} ${response.data.model} ${response.data.serialNumber}`

        axios.get(auth.apiUrl() + 'facility/' + response.data.facility._id, {headers: {Authorization: 'Bearer ' + auth.getToken()}}).then(resp => {
          if (resp.data.length === 0) {
            this.errors = 'Nenhum resultado encontrado'
            this.test.facility = ''
          } else {
            this.test.facility = resp.data
            this.facility = resp.data
          }
        })
        .catch(error => {
          this.errors = error.data
          this.test.facility = ''
        })
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

    axios.get(auth.apiUrl() + 'test/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.test = ''
      } else {
        this.typeOfTest = { _id: response.data._id, testName: response.data.typeOfEquipment + ' - ' + response.data.name, fullName: response.data.typeOfEquipment + ' - ' + response.data.name, name: response.data.typeOfEquipment + ' - ' + response.data.name }
      }
    })
    .catch(error => {
      this.errors = error.data
      this.test = ''
    })
    this.test._id = this.$route.params.id
    this.currentUser = auth.currentUser()
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
.btn {
  max-width: 300px;
}
.alert-hyper-card {
  border-color: #BA4A47;
  background-color: rgba(186, 74, 71, 0.1)
}
.alert-form-control {
  border-color: #BA4A47;
  background-color: rgba(186, 74, 71, 0.1)
}

.drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}
.drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}

.align-center {
  text-align: center;
  margin: 0 auto;
  display: block;
}

.file-upload-input {
  border: dashed 3px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  text-align: center;
  margin: 0 auto;
  display: block;
  padding: 50px;
}

.file-upload-input p {
  margin-bottom: 0 !important;
}

.rm-file {
  border: none !important;
  margin: 5px auto;
}

.to-right {
  text-align: right;
  display: block;
  margin: 0 0 0 auto;
}
</style>
../../../../../../services/permissions