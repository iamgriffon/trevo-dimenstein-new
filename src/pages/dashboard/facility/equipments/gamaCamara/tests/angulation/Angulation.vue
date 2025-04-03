<template>
  <div class="main">
    <div>
      <b-modal id="modal-center" centered no-close-on-backdrop no-close-on-esc hide-header hide-header-close hide-footer>
        <p class="col-12 mx-auto inline-block" style="width: fit-content">Fazendo upload do documento...</p>
        <img class="img img-fluid" src="/static/img/loading.gif">
      </b-modal>
    </div>
    <div class="col-12 row m-0 p-0">
      <div class="col">
        <h1>{{ equipment.type + ' ' + equipment.patrimonialNumber }}</h1>
        <h2>Angulação dos Furos dos Colimadores - {{ test.date | moment('MM-YYYY') }}</h2>
      </div>
      <div class="col text-right">
        <button @click="finishTest()" v-if="permission.canExcludeFacility(currentUser) && test.status !== 'Concluído'" class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300">
          <FontAwesomeIcon icon="fa-solid fa-check" class="md:mr-2" />
          <span class="hidden md:inline">Finalizar teste</span>
        </button>
        <button @click="exclude()" v-if="permission.canExcludeFacility(currentUser)" class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-300">
          <FontAwesomeIcon icon="fa-solid fa-trash-alt" class="md:mr-2" />
          <span class="hidden md:inline">Excluir</span>
        </button>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments/doseCalibrator/'">{{ equipment.type }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/gamaCamara/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/gamaCamara/' + equipment._id + '/angulaiton/'">angulação</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ test.date | moment('MM-YYYY') }}</li>
        </ol>
      </nav>
    </div>

    <div class="row ml-md-3">
      <div class="col mb-3 pl-sm-1">
        <div class="hyper-card mb-3">
          <h5 class="mb-3">Informações:</h5>
          <p>Data de Realização: {{ test.date | moment('DD/MM/YYYY')  }}</p>
          <p>Responsável pela Execução: {{ test.responsibleForPerforming.name  }}</p>
        </div>
      </div>
    </div>

    <div class="row ml-md-3" v-for="test in test.tests">
      <div class="col mb-3 pl-sm-1">
        <div class="hyper-card mb-3">
          <h3 class="mb-3">{{ test.collimator }}</h3>
          <h5>{{ test.head }}</h5>
          <br>
          <p>Atividade da Fonte Pontual: {{ test.pontualSourceActivity }}</p>
          <p>Número de Imagens por Cabeça: {{ test.numberOfImagesByHead }}</p>
          <p>Número total de Contagens: {{ test.totalCount }}</p>
          <p>Matrix usada: {{ test.usedMatrix }}</p>
          <div v-if="test.head === 'Cabeça 1' || test.head === 'Cabeça 1 e Cabeça 2'">
            <hr>
            <h5>Cabeça 1</h5>
            <p>Análise: {{ test.dataCheckStatusH1 }}</p>
            <p v-if="test.head1Obs !== ''">Observações: {{ test.head1Obs }}</p>
          </div>
          <div v-if="test.head === 'Cabeça 2' || test.head === 'Cabeça 1 e Cabeça 2'">
            <hr>
            <h5>Cabeça 2</h5>
            <p>Análise: {{ test.dataCheckStatusH2 }}</p>
            <p v-if="test.head2Obs !== ''">Observações: {{ test.head2Obs }}</p>
          </div>

        </div>
      </div>
    </div>
    <br>
    <div class="row col pr-0" v-if="test.status === 'Concluído'">
      <div class="hyper-card col ml-3 mr-0">
        <p>Data de Finalização: {{ test.finalizingDate | moment('DD/MM/YYYY')  }}</p>
        <p>Responsável por Finalizar: {{ test.responsibleForFinalizing.name }}</p>
      </div>
    </div>
    <br><br>
  </div>
</template>

<script>
import auth from '@/services/authentication'
import permission from '@/services/permissions'; // Corrected import
// import router from '../../../../../../../routes'
import axios from 'axios'
import moment from 'moment'
import JsPDF from 'jspdf'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // Added FontAwesome import

export default {
  data () {
    return {
      numbers: [0, 1],
      facility: {
        name: '',
        equipments: []
      },
      test: { responsibleForPerforming: { name: '' } },
      equipment: {},
      currentUser: {},
      permission: permission,
      loading: false
    }
  },

  watch: {
    loading () {
      if (this.loading) {
        this.$root.$emit('bv::show::modal', 'modal-center')
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

        axios.get(auth.apiUrl() + 'facility/' + response.data.facility._id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
        .then(resp => {
          if (resp.data.length === 0) {
            this.errors = 'Nenhum resultado encontrado'
            this.facility = ''
          } else {
            this.facility = resp.data
          }
        })
        .catch(error => {
          this.errors = error.data
          this.facility = ''
        })
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })

    axios.get(auth.apiUrl() + 'equipment/GamaCamaraAngulationTests/' + this.$route.params.testId, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
    .then(response => {
      if (response.data.length === 0) {
        this.errors = 'Nenhum resultado encontrado'
        this.test = ''
      } else {
        this.test = response.data
      }
    })
    .catch(error => {
      this.errors = error.data
      this.test = ''
    })

    this.currentUser = auth.currentUser()
  },

  methods: {
    exclude () {
      if (confirm('Tem certeza que deseja excluir este teste?')) {
        auth.excludeGamaCamaraAngulationTest(this, this.test, '/equipments/gamaCamara/' + this.equipment._id + '/angulation')
      }
    },
    finishTest () {
      if (confirm('Tem certeza que deseja finalizar este teste?')) {
        // this.test.status = 'Concluído'
        this.test.responsibleForFinalizing = { name: auth.currentUser().name, _id: auth.currentUser().id }
        // var now = new Date()
        // now = new Date(moment.tz(now, 'America/Sao_Paulo'))
        // now = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
        // this.test.finalizingDate = now
        // auth.updateGamaCamaraAngulationTest(this, this.test)

        this.generateDocument()
        // this.loading = true
        // setTimeout(function () {
        //   router.push({ path: '/document' })
        // }, 6000)
      }
    },

    addLabelAndInformation (doc, x, y, label, information) {
      var spaceBetweenInformationAndLabel = 5

      doc.setFontSize(8)
      doc.setFont(undefined, 'bold')
      doc.text(label, x, y)
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      if (information) {
        doc.text(information, x, y + spaceBetweenInformationAndLabel)
      } else {
        doc.text('', x, y + spaceBetweenInformationAndLabel)
      }
    },

    generateDocument () {
      var doc = new JsPDF()

      var radLogo = `data:image/png;base64,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46le/asCazVa4ifx91157LS666CJ0d3dj9+7duOGGG9je3aafymfB8lS0Ye8/GUDiVrq3kHPzClkkAzyVZG/gfZOJ5giiRPYK+naKVMRTtK07vIgsaUQTV9W2N4LWOUY79K7GMYpdD27P4IGdLjy40407uYr2d9uzuHlbGt+5bRg/u38Ou/aFEIh3oyFBH9MIHbf0v2Ro1fL56zA+PYcDQ4OYHDpIPYtm6rFhlKhvtXo7yIYYDMpg2BLBRdsapuMUl+gsdVF/clMh1Oymjimpc7bzC7/b68/F8fDhw7jsssuwbt06PP744/jZz35miEQvrqOjA1/5ylfwt3/7t2YGtaKLwpJEgG984xsNcWzZsoUz/oS59vDDDxtC/sQnPmH6pD8CppKAob4KJNqD433vex85UhQiLhGwytVS+de85jWmXIFEBPuLX/zCcBARlAj7oYceMhEenZ2djAb5MjZt2mTK1T0lAUF9EQAExJ/+9KeGaMQF3v3udxviF9C///3vGyAvozVW+bRFgED7u9/9zoBbdats3VNEiSaMu+66y/RDHFRt3rNnD6644gr09vZqD3F1Tz0y4Z/jIq/a/3e+vP7843f+L3aVn9778oP/s7wW37DqU9617g8aLznPj/0c855e2GzP5T55y4/8H/0v5+t870e0WjP5D+51P7rXh/19//+eUv//z5/3r3f3/rQ49+8/t+73t/s36W5c6+2V6qfJp7qU3t1/4fR/1I+Fq372/P/w+rP7c4//v9n/+X5f+n9r7n8P3tPf/4/978/v9//f1/n53c/+/X/9v8/+58c/1+6H9j1/L/+fv/f+b7//j/03z9n8/9+7f8Z3z76v/7B4j88l+/6/7fH5//19/+p7a311/b/z9UqY2VAAAAAElFTkSuQmCC`
      var lineHeight = 12
      // var tableLineHeight = 4
      var beginRoundedRect = 35
      var beginTextHeight = beginRoundedRect + 10

      var beginSecondRoundedRect = beginRoundedRect + 42 + 3
      var beginSecondTextHeight = beginSecondRoundedRect + 10

      var beginThirdRoundedRect = beginSecondRoundedRect + 9 + 2 * 4 + 3
      var beginThirdTextHeight = beginThirdRoundedRect + 10

      var beginFourthRoundedRect = beginThirdRoundedRect + 70
      // var beginFourthTextHeight = beginFourthRoundedRect + 10
      //
      // var begintFifthRoudedRect = beginFourthRoundedRect + 59 + 3
      // var begintFifthTextHeight = begintFifthRoudedRect + 10

      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

      doc.roundedRect(10, beginRoundedRect, 190, 42, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text(105, beginRoundedRect + 5, 'Controle de Qualidade', null, null, 'center')

      this.addLabelAndInformation(doc, 15, beginTextHeight, 'Instalação:', this.facility.companyName)
      this.addLabelAndInformation(doc, 150, beginTextHeight, 'Realizado por:', this.test.responsibleForPerforming.name)
      this.addLabelAndInformation(doc, 15, beginTextHeight + lineHeight, 'Equipamento:', this.equipment.type)
      this.addLabelAndInformation(doc, 90, beginTextHeight + lineHeight, 'Marca - Modelo - Número de Série:', this.equipment.manufacturer + ' - ' + this.equipment.model + ' - ' + this.equipment.serialNumber)
      this.addLabelAndInformation(doc, 150, beginTextHeight + lineHeight, 'Número Patrimonial:', this.equipment.patrimonialNumber)

      this.addLabelAndInformation(doc, 15, beginTextHeight + 2 * lineHeight, 'Teste/Periodicidade:', 'Angulação dos Furos do Colimador')
      this.addLabelAndInformation(doc, 90, beginTextHeight + 2 * lineHeight, 'Periodicidade:', 'Semestral')
      this.addLabelAndInformation(doc, 150, beginTextHeight + 2 * lineHeight, 'Data:', moment(this.test.date).format('DD/MM/YYYY'))

      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text(105, beginSecondRoundedRect + 5, 'Objetivos', null, null, 'center')

      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text(15, beginSecondTextHeight, 'Verificar o alinhamento e a angulação dos septos de cada colimador, realizando imagens estáticas em diferentes')
      doc.text(15, beginSecondTextHeight + 4, 'pontos do campo de visão do detector com uma fonte pontual posicionada a uma distância aproximada de 2,5m.')
      doc.roundedRect(10, beginSecondRoundedRect, 190, 9 + 2 * 4, 2, 2, 'S')

      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text(105, beginThirdRoundedRect + 5, 'Análises', null, null, 'center')

      for (let i = 0; i < this.test.tests.length; i++) {
        doc.setFontSize(8)
        doc.setFont(undefined, 'bold')
        doc.text(15, beginThirdTextHeight + i * 22, 'Colimador')
        doc.text(50, beginThirdTextHeight + i * 22, 'Matrix utilizada')
        doc.text(84, beginThirdTextHeight + i * 22, 'Nº de total de contagens')
        doc.text(127, beginThirdTextHeight + i * 22, 'Nº de imagens')
        doc.text(162, beginThirdTextHeight + i * 22, 'Atividade (mCi)')
        doc.setFontSize(10)
        doc.setFont(undefined, 'normal')
        doc.text(15, beginThirdTextHeight + 4 + i * 22, this.test.tests[i].collimator)
        doc.text(50, beginThirdTextHeight + 4 + i * 22, this.test.tests[i].usedMatrix)
        doc.text(84, beginThirdTextHeight + 4 + i * 22, this.test.tests[i].totalCount)
        doc.text(127, beginThirdTextHeight + 4 + i * 22, this.test.tests[i].numberOfImagesByHead)
        doc.text(162, beginThirdTextHeight + 4 + i * 22, this.test.tests[i].pontualSourceActivity)

        var position = beginThirdTextHeight + 9 + i * 22
        if (this.test.tests[i].head === 'Cabeça 1' || this.test.tests[i].head === 'Cabeça 1 e Cabeça 2') {
          doc.setFont(undefined, 'bold')
          doc.text(15, position, 'Detector 1 - ')
          doc.setFont(undefined, 'normal')
          doc.text(15 + 20, position, this.test.tests[i].dataCheckStatusH1)
          position += 4
        }
        if (this.test.tests[i].head === 'Cabeça 2' || this.test.tests[i].head === 'Cabeça 1 e Cabeça 2') {
          doc.setFont(undefined, 'bold')
          doc.text(15, position, 'Detector 2 - ')
          doc.setFont(undefined, 'normal')
          doc.text(15 + 20, position, this.test.tests[i].dataCheckStatusH2)
          position += 4
        }
      }

      doc.roundedRect(10, beginThirdRoundedRect, 190, 70, 2, 2, 'S')

      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text(105, beginFourthRoundedRect + 5, 'Resultados', null, null, 'center')

      doc.save('Informações - teste.pdf')
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
