<template>
  <div class="main">
    <div class="row px-3">
      <div class="col-6 col-md">
        <h2>Rotinas</h2>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">rotinas</li>
        </ol>
      </nav>
    </div>
    <div class="col-12 row px-0 mx-0">
      <router-link :to="'/facility/' + facility._id + '/routines/radioactivematerialmov'" class="hyper-card col m-3 left-border-eagle-green hyper-card-shadow-hover">
        <h5>Movimentação de Material Radioativo</h5>
      </router-link>
      <router-link :to="'/facility/' + facility._id + '/routines/solidwastemanagement/' + year" class="hyper-card col m-3 left-border-metalic-seaweed hyper-card-shadow-hover">
        <h5>Gerenciamento de Rejeitos Sólidos</h5>
      </router-link>
      <router-link :to="'/facility/' + facility._id + '/routines/liquidwastemanagement/' + year" class="hyper-card col m-3 left-border-queen-blue hyper-card-shadow-hover">
        <h5>Gerenciamento de Rejeitos Líquidos</h5>
      </router-link>
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
      errors: '',
      facility: {},
      permission: permission,
      year: new Date().getFullYear()
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
    this.currentUser = auth.currentUser()
  }
}
</script>

<style>
</style>
../../../../../services/permissions