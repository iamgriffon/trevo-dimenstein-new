<template>
  <div class="main">
    <div class="col-12 row m-0 p-0">
      <div class="col-10">
        <h1>{{ equipment.type + ' ' + ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</h1>
        <h2>Reprodutibilidade</h2>
      </div>
      <div class="col-2 text-right">
        <button @click="generateDocument" class="btn btn-outline-metalic-seaweed"><i class="fa fa-download d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-md-block"><i class="fa fa-download" aria-hidden="true"></i> gerar relatório</span></button>
        <router-link class="btn btn-success" :to="'/equipments/geigerCounter/' + equipment._id + '/reproductibility/register'"><i class="fa fa-plus d-sm-block d-md-none" aria-hidden="true"></i><span class="d-none d-sm-block"><i class="fa fa-plus" aria-hidden="true"></i> adicionar</span></router-link>
      </div>
    </div>
    <div class="col py-0">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/panel'"><i class="fa fa-home" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility'"><i class="far fa-building" aria-hidden="true"></i></router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id">{{ facility.name }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id + '/equipments'">equipamentos</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/facility/' + facility._id+ '/equipments/geigerCounter'">{{ equipment.type }}</router-link></li>
          <li class="breadcrumb-item" aria-current="page"><router-link :to="'/equipments/geigerCounter/' + equipment._id">{{ ( equipment.patrimonialNumber? equipment.patrimonialNumber : '' ) + (equipment.serialNumber & equipment.patrimonialNumber? ' - ' : '') + ( equipment.serialNumber? equipment.serialNumber : '' ) }}</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">reprodutibilidade</li>
        </ol>
      </nav>
    </div>
    <div class="form-inline col">
      <div class="form-group">
        <label for=""><i class="fa fa-filter"></i></label>
        <v-select type="text" :options="filterOptions" v-model="filter" class="mx-sm-3"></v-select>
      </div>
      <div class="form-group">
        <v-select type="text" :options="filterProbeOptions" v-model="filterProbe" class="mx-sm-3"></v-select>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table table-responsive hyper-table col mx-auto">
          <thead>
            <tr>
              <th>Data</th>
              <th>Mês</th>
              <th>Sonda</th>
              <th>Conclusão</th>
              <th>Responsável</th>
              <th></th>
            </tr>
          </thead>
          <tbody >
            <tr v-for="test in filteredReproductibilityTestList">
              <td>{{ test.date | moment('DD/MM/YYYY') }}</td>
              <td>{{ test.month }}</td>
              <td>{{ test.probe }}</td>
              <td>{{ test.conclusion }} <span v-if="test.conclusion == 'insatisfatório'" class="red"><i class="fas fa-exclamation-circle"></i></span></td>
              <td v-if="test.responsible">{{ test.responsible.name }}</td>
              <td v-else></td>
              <td class="text-right"><router-link :to="'/equipments/geigerCounter/' + equipment._id + '/reproductibility/' + test._id" class="btn btn-outline-metalic-seaweed"><i class="fa fa-info" aria-hidden="true"></i> informações</router-link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
import auth from '../../../../../../authentication/authentication'
import permission from '../../../../../../../../services/permissions'
import axios from 'axios'
import moment from 'moment'
import JsPDF from 'jspdf'

export default {

  data () {
    return {
      facility: {
        equipments: []
      },
      filter: '',
      filterOptions: [],
      filterProbe: '',
      filterProbeOptions: [],
      equipment: {},
      dataLetters: '',
      currentUser: {},
      permission: permission,
      tests: [],
      addedRadioactiveSource: false
    }
  },

  created () {
    axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.id, {headers: {Authorization: 'Bearer ' + auth.getToken()}})
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

        axios.get(auth.apiUrl() + 'equipment/' + this.$route.params.id + '/geigerCounterReproductibilityTests/', {headers: {Authorization: 'Bearer ' + auth.getToken()}})
        .then(r => {
          if (r.data.length === 0) {
            this.errors = 'Nenhum resultado encontrado'
            this.tests = ''
          } else {
            this.tests = r.data
            for (let i = 0; i < r.data.length; i++) {
              if (!this.filterOptions.includes(r.data[i].date.split('-')[0])) {
                this.filterOptions.push(r.data[i].date.split('-')[0])
              }
            }
            for (let i = 0; i < r.data.length; i++) {
              if (!this.filterProbeOptions.includes(r.data[i].probe)) {
                this.filterProbeOptions.push(r.data[i].probe)
              }
            }
            this.filter = new Date().getFullYear()
            this.filterProbe = this.filterProbeOptions[0]
          }
        })
        .catch(error => {
          this.errors = error.data
          this.tests = ''
        })
      }
    })
    .catch(error => {
      this.errors = error.data
      this.equipment = ''
    })
    this.currentUser = auth.currentUser()
  },

  computed: {
    filteredReproductibilityTestList () {
      if (this.filter && this.filterProbe) {
        let exp = new RegExp(this.filter, 'i')
        let expProbe = new RegExp(this.filterProbe, 'i')
        let rtList = this.tests.filter(rt => exp.test(rt.date))
        return rtList.filter(rt => expProbe.test(rt.probe))
      } else {
        return this.tests
      }
    }
  },

  methods: {
    exclude () {
      if (confirm('Tem certeza que deseja excluir esta instalação?')) {
        auth.excludeFacility(this, this.facility, '/facility')
      }
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

    avarage (array) {
      const n = array.length - 1
      if (n !== 0) {
        let sum = 0
        for (let i = 1; i < n + 1; i++) {
          sum += parseFloat(array[i])
        }
        return sum / n
      }
    },

    standardDeviation (array) {
      const n = array.length - 1
      if (n !== 0) {
        const mean = this.avarage(array)
        let variation = 0
        for (let i = 1; i < n + 1; i++) {
          variation += Math.pow(parseFloat(array[i]) - parseFloat(mean), 2)
        }
        return Math.sqrt(variation / (n - 1))
      }
    },

    generateDocument () {
      var doc = new JsPDF('l')
      var radLogo = require('../../../../../../shared/radLogo').radLogo()

      var lineHeight = 10
      var tableLineHeight = 5
      var beginRoundedRect = 34
      var beginTextHeight = beginRoundedRect + 10

      var beginSecondRoundedRect = beginRoundedRect + 29
      var beginSecondTextHeight = beginSecondRoundedRect + 11

      var beginThirdRoundedRect = beginSecondRoundedRect + 21
      var beginThirdTextHeight = beginThirdRoundedRect + 4

      let beginFourthRoundedRect = beginThirdRoundedRect + 13 * tableLineHeight + 17 + 6
      let beginFourthTextHeight = beginFourthRoundedRect + 11

      doc.roundedRect(10, 10, 276, 22, 2, 2, 'F')
      doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

      doc.roundedRect(10, beginRoundedRect, 276, 27, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(143, beginRoundedRect + 5, 'Controle de Qualidade', null, null, 'center')

      this.addLabelAndInformation(doc, 15, beginTextHeight, 'Instalação:', this.truncate(this.facility.companyName, 43))
      this.addLabelAndInformation(doc, 89, beginTextHeight, 'Equipamento:', this.equipment.type)
      this.addLabelAndInformation(doc, 123, beginTextHeight, 'Marca/Modelo:', this.equipment.manufacturer + '/' + this.equipment.model)
      this.addLabelAndInformation(doc, 177, beginTextHeight, 'Localização:', this.equipment.localization)
      this.addLabelAndInformation(doc, 231, beginTextHeight, 'Número Patrimonial:', this.equipment.patrimonialNumber)
      // this.addLabelAndInformation(doc, 123, beginTextHeight + lineHeight, 'Número de Série:', this.equipment.serialNumber)

      // this.addLabelAndInformation(doc, 69, beginTextHeight + lineHeight, 'Vencimento da Calibração:', moment(this.equipment.certificateValidity).format('DD/MM/YYYY'))
      // this.addLabelAndInformation(doc, 123, beginTextHeight + lineHeight, 'Teste:', 'Reprodutibilidade')
      // this.addLabelAndInformation(doc, 177, beginTextHeight + lineHeight, 'Periodicidade:', 'Mensal')
      let probeSerialNumber
      if (this.filterProbe === 'Exposição') {
        probeSerialNumber = this.equipment.exposureProbeSerialNumber
      } else {
        probeSerialNumber = this.equipment.contaminationProbeSerialNumber
      }
      this.addLabelAndInformation(doc, 69, beginTextHeight + lineHeight, 'Sonda/Número de Série da Sonda:', this.filterProbe + '/' + probeSerialNumber)

      this.addLabelAndInformation(doc, 123, beginTextHeight + lineHeight, 'Certificado de Calibração:', this.equipment.calibrationCertificateNumber)
      this.addLabelAndInformation(doc, 177, beginTextHeight + lineHeight, 'Vencimento da Calibração:', this.equipment.certificateValidity ? moment(this.equipment.certificateValidity).format('DD/MM/YYYY') : '')
      this.addLabelAndInformation(doc, 231, beginTextHeight + lineHeight, 'Teste/Periodicidade:', 'Reprodutibilidade/Mensal')

      doc.roundedRect(10, beginSecondRoundedRect, 276, 19, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(143, beginSecondRoundedRect + 6, 'Objetivo', null, null, 'center')

      doc.setFontSize(10)
      doc.setFontStyle('normal')
      doc.text(15, beginSecondTextHeight, 'Testar mensalmente a reprodutibilidade do equipamento através da realização de várias medidas seguidas sobre as mesmas condições. É permitido uma incerteza')
      doc.text(15, beginSecondTextHeight + 5, 'máxima de 20% [1, 2]. Se necessário o equipamento deverá ser enviado para calibração ou para manutenção.')

      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.roundedRect(10, beginThirdRoundedRect, 276, 86, 2, 2, 'S')
      // doc.text(105, beginThirdRoundedRect + 8, 'Análises', null, null, 'center')

      doc.setFontSize(10)
      doc.setFontStyle('normal')
      doc.text(15, beginThirdTextHeight + tableLineHeight, 'Medida')
      doc.text(15, beginThirdTextHeight + tableLineHeight + tableLineHeight, '1')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 2 * tableLineHeight, '2')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 3 * tableLineHeight, '3')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 4 * tableLineHeight, '4')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 5 * tableLineHeight, '5')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 6 * tableLineHeight, '6')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 7 * tableLineHeight, '7')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 8 * tableLineHeight, '8')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 9 * tableLineHeight, '9')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 10 * tableLineHeight, '10')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 11 * tableLineHeight, 'Unidade')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 12 * tableLineHeight, 'Média')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 13 * tableLineHeight, 'Dv. Pad.')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 14 * tableLineHeight, 'C.V. (%)')
      doc.text(15, beginThirdTextHeight + tableLineHeight + 15 * tableLineHeight, 'Conclusão')

      doc.text(35, beginThirdTextHeight, 'Jan.')
      doc.text(55, beginThirdTextHeight, 'Fev.')
      doc.text(75, beginThirdTextHeight, 'Mar.')
      doc.text(95, beginThirdTextHeight, 'Abr.')
      doc.text(115, beginThirdTextHeight, 'Mai.')
      doc.text(135, beginThirdTextHeight, 'Jun.')
      doc.text(155, beginThirdTextHeight, 'Jul.')
      doc.text(175, beginThirdTextHeight, 'Ago.')
      doc.text(195, beginThirdTextHeight, 'Set.')
      doc.text(215, beginThirdTextHeight, 'Out.')
      doc.text(235, beginThirdTextHeight, 'Nov.')
      doc.text(255, beginThirdTextHeight, 'Dez.')

      let yearFilteredTests = this.filteredReproductibilityTestList // this.tests.filter(tests => tests.month === 'abril')
      for (let j = 0; j < 12; j++) {
        let monthFilteredTests = []
        if (j === 0) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'janeiro')
        } else if (j === 1) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'fevereiro')
        } else if (j === 2) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'março')
        } else if (j === 3) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'abril')
        } else if (j === 4) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'maio')
        } else if (j === 5) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'junho')
        } else if (j === 6) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'julho')
        } else if (j === 7) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'agosto')
        } else if (j === 8) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'setembro')
        } else if (j === 9) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'outubro')
        } else if (j === 10) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'novembro')
        } else if (j === 11) {
          monthFilteredTests = yearFilteredTests.filter(tests => tests.month === 'dezembro')
        }
        if (monthFilteredTests[0]) {
          doc.text(35 + j * 20, beginThirdTextHeight + tableLineHeight, moment(monthFilteredTests[0].date).format('DD/MM/YY'))
        }

        if (monthFilteredTests[0]) {
          if (monthFilteredTests[0].radioactiveSource && monthFilteredTests[0].radioactiveSourceSerialNumber && this.addedRadioactiveSource === false) {
            this.addLabelAndInformation(doc, 15, beginTextHeight + lineHeight, 'Fonte de Material/Número de Série:', monthFilteredTests[0].radioactiveSource + '/' + monthFilteredTests[0].radioactiveSourceSerialNumber)
            this.addedRadioactiveSource = true
          }

          if (monthFilteredTests[0].observationType === 'ok') {
            for (let i = 1; i <= 10; i++) {
              doc.text(35 + j * 20, beginThirdTextHeight + 2 * tableLineHeight + (i - 1) * tableLineHeight, monthFilteredTests[0].measures[i])
            }

            const avarage = this.avarage(monthFilteredTests[0].measures)
            const standardDeviation = this.standardDeviation(monthFilteredTests[0].measures)

            doc.text(35 + j * 20, beginThirdTextHeight + 2 * tableLineHeight + 10 * tableLineHeight, monthFilteredTests[0].scale)
            doc.text(35 + j * 20, beginThirdTextHeight + 2 * tableLineHeight + 11 * tableLineHeight, avarage.toFixed(2))
            doc.text(35 + j * 20, beginThirdTextHeight + 2 * tableLineHeight + 12 * tableLineHeight, standardDeviation.toFixed(2))
            doc.text(35 + j * 20, beginThirdTextHeight + 2 * tableLineHeight + 13 * tableLineHeight, parseFloat(monthFilteredTests[0].variation).toFixed(2))
            doc.text(35 + j * 20, beginThirdTextHeight + 2 * tableLineHeight + 14 * tableLineHeight, monthFilteredTests[0].conclusion)
          } else if (monthFilteredTests[0].observationType === 'calibration') {
            if (monthFilteredTests[0].observationText) {
              doc.text(35 + j * 20, beginThirdTextHeight + 2 * tableLineHeight, monthFilteredTests[0].observationText, null, 270)
            } else {
              doc.text(35 + j * 20, beginThirdTextHeight + 2 * tableLineHeight, 'Enviado para calibração', null, 270)
            }
          } else if (monthFilteredTests[0].observationType === 'maintenance') {
            if (monthFilteredTests[0].observationText) {
              doc.text(35 + j * 20, beginThirdTextHeight + 2 * tableLineHeight, monthFilteredTests[0].observationText, null, 270)
            } else {
              doc.text(35 + j * 20, beginThirdTextHeight + 2 * tableLineHeight, 'Enviado para manutenção', null, 270)
            }
          }
        }
      }

      if (this.addedRadioactiveSource === false) {
        this.addLabelAndInformation(doc, 15, beginTextHeight + lineHeight, 'Fonte de Material/Número de Série:', '-')
      }

      doc.roundedRect(150, beginFourthRoundedRect, 136, 28, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(215, beginFourthRoundedRect + 6, 'Observações', null, null, 'center')

      doc.setFontSize(10)
      doc.setFontStyle('normal')
      doc.text(160, beginFourthTextHeight, yearFilteredTests[yearFilteredTests.length - 1].observations)

      doc.setFontSize(10)
      doc.setFontStyle('bold')
      doc.text(165, beginFourthTextHeight + 12, 'Responsável:', null, null, 'center')

      doc.setFontStyle('normal')
      doc.text(180, beginFourthTextHeight + 12, yearFilteredTests[yearFilteredTests.length - 1].responsible.name)

      doc.roundedRect(10, beginFourthRoundedRect, 137, 28, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(75, beginFourthRoundedRect + 6, 'Bibliografia', null, null, 'center')

      doc.setFontSize(8)
      doc.setFontStyle('normal')
      doc.text(14, beginFourthTextHeight, '[1] COMISSÃO NACIONAL DE ENERGIA NUCLEAR. Norma CNEN NN 3.05: Requisitos de')
      doc.text(14, beginFourthTextHeight + 4, 'Segurança e Proteção Radiológica para Serviços de Medicina Nuclear. 2013.')
      doc.text(14, beginFourthTextHeight + 8, '[2] Bureau International des Poids et Mesures. Evaluation of Measurement Data: Guide to the')
      doc.text(14, beginFourthTextHeight + 12, 'Expression of Uncertainty in Measurement. 2008.')

      doc.setFontSize(10)
      doc.text(279, beginFourthTextHeight + 15, '1/1')

      doc.save('Informações ' + this.facility.name + '.pdf')
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
../../../../../../../../services/permissions