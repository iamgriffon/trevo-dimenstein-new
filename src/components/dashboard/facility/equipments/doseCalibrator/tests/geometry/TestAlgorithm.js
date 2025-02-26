import moment from 'moment-timezone'
import JsPDF from 'jspdf'

export const generateDocument = (test, facility, equipment, responsible) => {
  return new Promise((resolve, reject) => {
    var doc = new JsPDF()
    var radLogo = require('../../../../../../shared/radLogo').radLogo()
    var lineHeight = 12
    var tableLineHeight = 6
    var beginRoundedRect = 35
    var beginTextHeight = beginRoundedRect + 15

    var beginSecondRoundedRect = beginRoundedRect + 60 + 3
    var beginSecondTextHeight = beginSecondRoundedRect + 15

    var beginThirdRoundedRect = beginSecondRoundedRect + 15 + 5 * 6 + 3
    var beginThirdTextHeight = beginThirdRoundedRect + 15

    doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
    doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

    doc.roundedRect(10, beginRoundedRect, 190, 60, 2, 2, 'S')
    doc.setFontSize(12)
    doc.setFontStyle('bold')
    doc.text(105, beginRoundedRect + 8, 'Controle de Qualidade', null, null, 'center')

    addLabelAndInformation(doc, 15, beginTextHeight, 'Instalação:', facility.companyName ? truncate(facility.companyName, 43) : '')
    addLabelAndInformation(doc, 90, beginTextHeight, 'Local:', equipment.localization)
    addLabelAndInformation(doc, 15, beginTextHeight + lineHeight, 'Equipamento:', equipment.type)
    addLabelAndInformation(doc, 90, beginTextHeight + lineHeight, 'Modelo:', equipment.manufacturer + '/' + equipment.model + '-' + equipment.serialNumber)
    addLabelAndInformation(doc, 150, beginTextHeight + lineHeight, 'Número Patrimonial:', equipment.patrimonialNumber)

    addLabelAndInformation(doc, 15, beginTextHeight + 2 * lineHeight, 'Teste:', 'Geometria')
    addLabelAndInformation(doc, 90, beginTextHeight + 2 * lineHeight, 'Periodicidade:', 'Anual')
    addLabelAndInformation(doc, 150, beginTextHeight + 2 * lineHeight, 'Data:', moment(test.date).format('DD/MM/YYYY'))

    addLabelAndInformation(doc, 15, beginTextHeight + 3 * lineHeight, 'Responsável:', responsible.name)
    addLabelAndInformation(doc, 90, beginTextHeight + 3 * lineHeight, 'Isótopo utilizado:', test.radioisotope.name)
    addLabelAndInformation(doc, 150, beginTextHeight + 3 * lineHeight, 'Meia-vida:', (test.radioisotope.halfLife / 60 / 60).toFixed(2).toString().replace('.', ',') + ' horas')

    doc.setFontSize(12)
    doc.setFontStyle('bold')
    doc.text(105, beginSecondRoundedRect + 8, 'Objetivos', null, null, 'center')

    doc.setFontSize(10)
    doc.setFontStyle('normal')
    doc.text(15, beginSecondTextHeight, 'Verificar se os fatores de calibração do equipamento para recipientes e volumes diferentes daqueles usados nos')
    doc.text(15, beginSecondTextHeight + 6, 'testes usuais estão corretos [1]. A avaliação é feita pelas atividades medidas de uma amostra mantendo a')
    doc.text(15, beginSecondTextHeight + 12, 'quantidade de material radioativo em função do volume.')
    doc.text(15, beginSecondTextHeight + 18, 'Variações maiores que 10% devem ser investigadas, entre 5% e 10% é necessário utilizar o fator de correção de')
    doc.text(15, beginSecondTextHeight + 24, 'acordo com o recipiente e o volume [2].')

    doc.roundedRect(10, beginSecondRoundedRect, 190, 15 + 5 * 6, 2, 2, 'S')

    let conclusion = 'satisfatório'

    for (let numberOfContainers = 1; numberOfContainers <= test.tests.length; numberOfContainers++) {
      if (isEven(numberOfContainers)) {
        doc.addPage()
        doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
        doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

        beginThirdRoundedRect = 35
        beginThirdTextHeight = beginThirdRoundedRect + 15
      } else if (numberOfContainers !== 1 && numberOfContainers >= 2) {
        beginThirdRoundedRect = test.tests[numberOfContainers - 2].measures.length * tableLineHeight + 101
        beginThirdTextHeight = beginThirdRoundedRect + 15
      }

      conclusion = 'satisfatório'

      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginThirdRoundedRect + 8, test.tests[numberOfContainers - 1].container, null, null, 'center')

      doc.setFontSize(10)
      doc.text(105, beginThirdTextHeight, 'Análises', null, null, 'center')

      doc.setFontStyle('normal')
      doc.text(25, beginThirdTextHeight + 8, 'Volume (ml)')
      doc.text(69, beginThirdTextHeight + 8, 'Atividade Medida (mCi)')
      doc.text(120, beginThirdTextHeight + 8, 'Fator de Correção')
      doc.text(166, beginThirdTextHeight + 8, 'Variação (%)')

      for (let i = 0; i < test.tests[numberOfContainers - 1].measures.length; i++) {
        doc.text(27, beginThirdTextHeight + i * tableLineHeight + 14, test.tests[numberOfContainers - 1].measures[i].volume)
        doc.text(88, beginThirdTextHeight + i * tableLineHeight + 14, test.tests[numberOfContainers - 1].measures[i].activity)
        doc.text(129, beginThirdTextHeight + i * tableLineHeight + 14, test.tests[numberOfContainers - 1].measures[i].correctionFactor)
        doc.text(171, beginThirdTextHeight + i * tableLineHeight + 14, test.tests[numberOfContainers - 1].measures[i].variation)

        if (Math.abs(test.tests[numberOfContainers - 1].measures[i].variation) > 10) {
          conclusion = 'insatisfatório'
        } else if (Math.abs(test.tests[numberOfContainers - 1].measures[i].variation > 5)) {
          conclusion = 'satisfatório - adotar fatores de correção'
        }
      }

      doc.setFontSize(10)
      doc.setFontStyle('bold')
      doc.text(105, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 17, 'Resultados', null, null, 'center')
      doc.setFontSize(10)
      doc.setFontStyle('normal')
      if (test.tests[numberOfContainers - 1].container !== 'Transferência Frasco-Seringa') {
        if (conclusion === 'satisfatório') {
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 24, 'As variações nas atividades medidas entre diferentes volumes no recipiente ' + test.tests[numberOfContainers - 1].container + ' estão abaixo de 5%, de')
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 30, 'modo que não há necessidade de aplicar os fatores de correção para este recipiente.')
          addLabelAndInformation(doc, 15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 36, 'Conclusão:', conclusion)
        } else if (conclusion === 'satisfatório - adotar fatores de correção') {
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 24, 'As variações nas atividades medidas entre diferentes volumes no recipiente ' + test.tests[numberOfContainers - 1].container + ' estão entre 5% e 10%,')
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 29, 'de modo que é necessário aplicar o fator de correção correspondente (mostrado na tabela) para obter o valor da')
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 35, 'atividade equivalente no menor volume.')
          addLabelAndInformation(doc, 15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 40, 'Conclusão:', conclusion)
        } else {
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 24, 'As variações nas atividades medidas entre diferentes volumes no recipiente ' + test.tests[numberOfContainers - 1].container + ' estão acima de 10%, de')
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 30, 'modo que é necessário rever o uso deste recipiente até a conclusão de uma investigação sobre essa variação.')
          addLabelAndInformation(doc, 15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 36, 'Conclusão:', conclusion)
        }
      } else {
        if (conclusion === 'satisfatório') {
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 24, 'A variação nas atividades medidas entre os diferentes recipientes está abaixo de 5%, de modo que não há ')
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 30, 'necessidade de aplicar os fatores de correção para este recipiente.')
          addLabelAndInformation(doc, 15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 36, 'Conclusão:', conclusion)
        } else if (conclusion === 'satisfatório - adotar fatores de correção') {
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 24, 'Quando os usuários deste calibrador transferirem doses de frascos para seringa, e vice e versa, deverá ser')
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 30, 'adotado o fator de correção encontrado.')
          addLabelAndInformation(doc, 15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 36, 'Conclusão:', conclusion)
        } else {
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 24, 'Como há variação maior que 10% na transferência entre os recipientes, deverá ser adotado como referência o')
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 29, 'valor medido no frasco e a atividade na seringa ser encontrada através da atividade inicial menos a atividade')
          doc.text(15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 35, 'após retirada de volume pela seringa.')
          addLabelAndInformation(doc, 15, beginThirdTextHeight + test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 40, 'Conclusão:', conclusion)
        }
      }
      doc.roundedRect(10, beginThirdRoundedRect, 190, test.tests[numberOfContainers - 1].measures.length * tableLineHeight + 63, 2, 2, 'S')
    }

    if (test.tests.length === 1) {
      doc.addPage()
      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

      beginThirdRoundedRect = 35
      beginThirdTextHeight = beginThirdRoundedRect + 15
    } else if (!isEven(test.tests.length)) {
      doc.addPage()
      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

      beginThirdRoundedRect = 35
      beginThirdTextHeight = beginThirdRoundedRect + 15
    } else {
      beginThirdRoundedRect = test.tests[test.tests.length - 1].measures.length * tableLineHeight + 101
      beginThirdTextHeight = beginThirdRoundedRect + 15
    }

    doc.roundedRect(10, beginThirdRoundedRect, 190, 45, 2, 2, 'S')
    doc.setFontSize(12)
    doc.setFontStyle('bold')
    doc.text(105, beginThirdRoundedRect + 8, 'Bibliografia', null, null, 'center')

    doc.setFontSize(10)
    doc.setFontStyle('normal')
    doc.text(15, beginThirdRoundedRect + 8 + 8, '[1] COMISSÃO NACIONAL DE ENERGIA NUCLEAR. Norma CNEN NN 3.05: Requisitos de Segurança e Proteção')
    doc.text(15, beginThirdRoundedRect + 8 + 8 + 6, 'Radiológica para Serviços de Medicina Nuclear. 2013.')
    doc.text(15, beginThirdRoundedRect + 8 + 8 + 8 + 6, '[2] AMERICAN ASSOCIATION OF PHYSICISTS IN MEDICINE. The Selection, Use, Calibration, and Quality')
    doc.text(15, beginThirdRoundedRect + 8 + 8 + 8 + 6 + 6, 'Assurance of Radionuclide Calibrators Used in Nuclear Medicine, Report of AAPM Task Group 181. 2012.')
      //
      //
      // setTimeout(() => {
      //   // doc.output('dataurlnewwindow')
      //   window.open(doc.output('bloburl'))
      // }, 3000)

    setTimeout(() => {
      doc.output('dataurlnewwindow')
      resolve()
      // doc.save(equipment.type + ' ' + equipment.patrimonialNumber + ' Geometria - ' + test.date + '.pdf')
    }, 3000)
  })
}

export const testPoints = (tests, conclusion) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < tests.length; i++) {
      let average = 0
      for (let j = 0; j < tests[i].measures.length; j++) {
        average += parseFloat(tests[i].measures[j].activity)
      }
      average = average / tests[i].measures.length

      for (let j = 0; j < tests[i].measures.length; j++) {
        tests[i].measures[j].correctionFactor = (average / tests[i].measures[j].activity).toFixed(2)
        tests[i].measures[j].variation = (100 * tests[i].measures[j].activity / average - 100).toFixed(2)
        if (Math.abs(tests[i].measures[j].variation) > 10) {
          conclusion = 'insatisfatório'
        } else if (Math.abs(tests[i].measures[j].variation > 5)) {
          conclusion = 'satisfatório - adotar fatores de correção'
        }
      }
    }

    resolve(tests, conclusion)
  })
}

const addLabelAndInformation = (doc, x, y, label, information) => {
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
}

const isEven = (n) => {
  return n % 2 === 0
}

const truncate = (str, n) => {
  return (str.length > n) ? str.substr(0, n - 1) + '...' : str
}
// export const testPoints = (values) => {
//   return new Promise((resolve, reject) => {
//     let tCo = new Date(values.date) - new Date(values.sourceCo.initialActivityDate)
//     let calculatedCoActivity = values.sourceCo.initialActivity * Math.exp(-(0.6931471806 * tCo / 1000 / 60 / 60) / 6522.96)

//     let tBa = new Date(values.date) - new Date(values.sourceBa.initialActivityDate)
//     let calculatedBaActivity = values.sourceBa.initialActivity * Math.exp(-(0.6931471806 * tBa / 1000 / 60 / 60) / 92067.6)

//     let tCs = new Date(values.date) - new Date(values.sourceCs.initialActivityDate)
//     let calculatedCsActivity = values.sourceCs.initialActivity * Math.exp(-(0.6931471806 * tCs / 1000 / 60 / 60) / 264289.2)

//     if (allZero(values.measureCo)) {
//       values.accuracyCo = '-'
//     } else {
//       values.accuracyCo = (100 * (Math.abs(average(values.measureCo) - calculatedCoActivity) / calculatedCoActivity)).toFixed(2)
//     }
//     if (allZero(values.measureBa)) {
//       values.accuracyBa = '-'
//     } else {
//       values.accuracyBa = (100 * (Math.abs(average(values.measureBa) - calculatedBaActivity) / calculatedBaActivity)).toFixed(2)
//     }
//     if (allZero(values.measureCs)) {
//       values.accuracyCs = '-'
//     } else {
//       values.accuracyCs = (100 * (Math.abs(average(values.measureCs) - calculatedCsActivity) / calculatedCsActivity)).toFixed(2)
//     }

//     let precisionCo = Array.isArray(values.precisionCo) ? values.precisionCo : values.precisionCo.split(',').map(e => { parseFloat(e) })
//     let precisionBa = Array.isArray(values.precisionBa) ? values.precisionBa : values.precisionBa.split(',').map(e => { parseFloat(e) })
//     let precisionCs = Array.isArray(values.precisionCs) ? values.precisionCs : values.precisionCs.split(',').map(e => { parseFloat(e) })

//     values.precisionCo = precisionCo
//     values.precisionBa = precisionBa
//     values.precisionCs = precisionCs

//     for (let i = 0; i < values.measureCo.length; i++) {
//       values.precisionCo[i] = (Math.abs(100 * (parseFloat(values.measureCo[i]) - average(values.measureCo)) / average(values.measureCo)))
//       values.precisionBa[i] = (Math.abs(100 * (parseFloat(values.measureBa[i]) - average(values.measureBa)) / average(values.measureBa)))
//       values.precisionCs[i] = (Math.abs(100 * (parseFloat(values.measureCs[i]) - average(values.measureCs)) / average(values.measureCs)))

//       if (Math.sqrt(values.precisionCo[i] * parseFloat(values.precisionCo[i])) > 5 ||
//           Math.sqrt(values.precisionBa[i] * parseFloat(values.precisionBa[i])) > 5 ||
//           Math.sqrt(values.precisionCs[i] * parseFloat(values.precisionCs[i])) > 5 ||
//           Math.sqrt(values.accuracyCo * values.accuracyCo) > 10 ||
//           Math.sqrt(values.accuracyBa * values.accuracyBa) > 10 ||
//           Math.sqrt(values.accuracyCs * values.accuracyCs) > 10) {
//         values.conclusion = 'Insatisfatório'
//       } else {
//         values.conclusion = 'Satisfatório'
//       }
//     }

//     resolve(values)
//   })
// }

// const allZero = (array) => {
//   for (var i = 0; i < array.length; i++) {
//     if (array[i] !== 0 && array[i] !== '0') {
//       return false
//     }
//   }
//   return true
// }

// const addLabelAndInformation = (doc, x, y, label, information) => {
//   var spaceBetweenInformationAndLabel = 5

//   doc.setFontSize(8)
//   doc.setFontStyle('bold')
//   doc.text(label, x, y)
//   doc.setFontSize(10)
//   doc.setFontStyle('normal')
//   if (information) {
//     doc.text(information, x, y + spaceBetweenInformationAndLabel)
//   } else {
//     doc.text('', x, y + spaceBetweenInformationAndLabel)
//   }
// }

// const formatNumberToZero = (value) => {
//   if (value) {
//     var result = parseFloat(value)
//     if (isNaN(result)) {
//       return '0,00'
//     } else {
//       return result.toFixed(2).toString().replace('.', ',')
//     }
//   } else {
//     return '0,00'
//   }
// }

// const average = (array) => {
//   let sum = 0
//   for (let i = 0; i < array.length - 1; i++) {
//     sum += parseFloat(array[i + 1])
//   }
//   return sum / (array.length - 1)
// }
