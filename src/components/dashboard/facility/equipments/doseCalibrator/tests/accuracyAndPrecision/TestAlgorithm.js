import moment from 'moment-timezone'
import JsPDF from 'jspdf'

export const generateDocument = (values, facility, equipment) => {
  return new Promise((resolve, reject) => {
    testPoints(values).then((test) => {
      var doc = new JsPDF()
      var radLogo = require('../../../../../../shared/radLogo').radLogo()
      var lineHeight = 12
      var tableLineHeight = 5
      var beginRoundedRect = 35
      var beginTextHeight = beginRoundedRect + 15

      var beginSecondRoundedRect = beginRoundedRect + 60 + 3
      var beginSecondTextHeight = beginSecondRoundedRect + 15

      var beginThirdRoundedRect = beginSecondRoundedRect + 15 + 6 * 5.5 + 3
      var beginThirdTextHeight = beginThirdRoundedRect + 15

      var beginFourthRoundedRect = beginThirdRoundedRect + 45.5
      var beginFourthTextHeight = beginFourthRoundedRect + 13.5

      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)

      doc.roundedRect(10, beginRoundedRect, 190, 60, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginRoundedRect + 8, 'Controle de Qualidade', null, null, 'center')

      addLabelAndInformation(doc, 15, beginTextHeight, 'Instalação:', truncate(facility.companyName, 43))
      addLabelAndInformation(doc, 90, beginTextHeight, 'Local:', equipment.localization)
      addLabelAndInformation(doc, 15, beginTextHeight + lineHeight, 'Equipamento:', equipment.type)
      addLabelAndInformation(doc, 90, beginTextHeight + lineHeight, 'Modelo:', equipment.manufacturer + '/' + equipment.model + '-' + equipment.serialNumber)
      addLabelAndInformation(doc, 150, beginTextHeight + lineHeight, 'Número Patrimonial:', equipment.patrimonialNumber)

      addLabelAndInformation(doc, 15, beginTextHeight + 2 * lineHeight, 'Teste:', 'Exatidão e Precisão')
      addLabelAndInformation(doc, 90, beginTextHeight + 2 * lineHeight, 'Periodicidade:', 'Semestral')
      addLabelAndInformation(doc, 150, beginTextHeight + 2 * lineHeight, 'Data:', moment(test.date).format('DD/MM/YYYY'))

      addLabelAndInformation(doc, 15, beginTextHeight + 3 * lineHeight, 'Responsável:', test.responsible.name || '')

      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginSecondRoundedRect + 8, 'Objetivos', null, null, 'center')

      doc.setFontSize(10)
      doc.setFontStyle('normal')
      doc.text(15, beginSecondTextHeight, 'Verificar a precisão e a exatidão do equipamento através de medidas sequenciais de uma mesma fonte radioativa')
      doc.text(15, beginSecondTextHeight + 5.5, 'padrão. A precisão irá verificar se há dispersão entre os valores, sendo definida como a variação percentual de cada')
      doc.text(15, beginSecondTextHeight + 11, 'medida em relação a sua média [1]. Esta variação deve estar em um intervalo de até 5% [2].')
      doc.text(15, beginSecondTextHeight + 16.5, 'A exatidão verifica se as medidas diferem significativamente do valor nominal da fonte padrão. É definida pelo')
      doc.text(15, beginSecondTextHeight + 22, 'variação percentual da média dos valores medidos em relação ao valor esperado [1]. Esta variação deve estar em')
      doc.text(15, beginSecondTextHeight + 27.5, 'um intervalo de até 10% [2].')

      doc.roundedRect(10, beginSecondRoundedRect, 190, 15 + 6 * 5.5, 2, 2, 'S')

      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginThirdRoundedRect + 8, 'Informações das Fontes Utilizadas', null, null, 'center')

      doc.setFontSize(10)
      doc.setFontStyle('bold')
      doc.text(15, beginThirdTextHeight, 'Radioisótopo')
      doc.text(90, beginThirdTextHeight, 'Co(57)')
      doc.text(127, beginThirdTextHeight, 'Ba(133)')
      doc.text(164, beginThirdTextHeight, 'Cs(137)')

      let tCo = new Date(test.date) - new Date(test.sourceCo.initialActivityDate)
      let calculatedCoActivity = test.sourceCo.initialActivity * Math.exp(-(0.6931471806 * tCo / 1000 / 60 / 60) / 6522.96)

      let tBa = new Date(test.date) - new Date(test.sourceBa.initialActivityDate)
      let calculatedBaActivity = test.sourceBa.initialActivity * Math.exp(-(0.6931471806 * tBa / 1000 / 60 / 60) / 92067.6)

      let tCs = new Date(test.date) - new Date(test.sourceCs.initialActivityDate)
      let calculatedCsActivity = test.sourceCs.initialActivity * Math.exp(-(0.6931471806 * tCs / 1000 / 60 / 60) / 264289.2)

      doc.text(15, beginThirdTextHeight + tableLineHeight, 'Número de Série:')
      doc.text(15, beginThirdTextHeight + 2 * tableLineHeight, 'Atividade Inicial (µCi):')
      doc.text(15, beginThirdTextHeight + 3 * tableLineHeight, 'Data da Atividade Inicial:')
      doc.text(15, beginThirdTextHeight + 4 * tableLineHeight, 'Atividade Calculada no Dia do Teste (µCi):')
      doc.setFontStyle('normal')
      if (!allZero(test.measureCo)) {
        doc.text(90, beginThirdTextHeight + tableLineHeight, test.sourceCo.serialNumber)
        doc.text(90, beginThirdTextHeight + 2 * tableLineHeight, test.sourceCo.initialActivity)
        doc.text(90, beginThirdTextHeight + 3 * tableLineHeight, moment(test.sourceCo.initialActivityDate).format('DD/MM/YYYY'))
        doc.text(90, beginThirdTextHeight + 4 * tableLineHeight, formatNumber(calculatedCoActivity))
      }
      if (!allZero(test.measureBa)) {
        doc.text(127, beginThirdTextHeight + tableLineHeight, test.sourceBa.serialNumber)
        doc.text(127, beginThirdTextHeight + 2 * tableLineHeight, test.sourceBa.initialActivity)
        doc.text(127, beginThirdTextHeight + 3 * tableLineHeight, moment(test.sourceBa.initialActivityDate).format('DD/MM/YYYY'))
        doc.text(127, beginThirdTextHeight + 4 * tableLineHeight, formatNumber(calculatedBaActivity))
      }
      if (!allZero(test.measureCs)) {
        doc.text(164, beginThirdTextHeight + tableLineHeight, test.sourceCs.serialNumber)
        doc.text(164, beginThirdTextHeight + 2 * tableLineHeight, test.sourceCs.initialActivity)
        doc.text(164, beginThirdTextHeight + 3 * tableLineHeight, moment(test.sourceCs.initialActivityDate).format('DD/MM/YYYY'))
        doc.text(164, beginThirdTextHeight + 4 * tableLineHeight, formatNumber(calculatedCsActivity))
      }
      doc.roundedRect(10, beginThirdRoundedRect, 190, 42, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginFourthRoundedRect + 8, 'Análises', null, null, 'center')
      doc.setFontSize(10)
      doc.text(15, beginFourthTextHeight, 'Radioisótopo')
      doc.text(60, beginFourthTextHeight, 'Co(57)')
      doc.text(113, beginFourthTextHeight, 'Ba(133)')
      doc.text(166, beginFourthTextHeight, 'Cs(137)')
      doc.text(15, beginFourthTextHeight + 6, 'Medidas')
      doc.text(40, beginFourthTextHeight + 6, 'Atividade (µCi)  Precisão (%)')
      doc.text(93, beginFourthTextHeight + 6, 'Atividade (µCi)  Precisão (%)')
      doc.text(146, beginFourthTextHeight + 6, 'Atividade (µCi)  Precisão (%)')
      doc.setFontStyle('normal')
      for (let i = 1; i < test.measureCo.length; i++) {
        doc.text(20, beginFourthTextHeight + (i - 1) * tableLineHeight + 11, i.toString())
        if (!allZero(test.measureCo)) {
          doc.text(53.5, beginFourthTextHeight + (i - 1) * tableLineHeight + 11, formatNumberToZero(test.measureCo[i]))
          doc.text(70.5, beginFourthTextHeight + (i - 1) * tableLineHeight + 11, formatNumberToZero(Array.isArray(test.precisionCo) ? test.precisionCo[i] : test.precisionCo.split(',')[i]) + '%')
        }
        if (!allZero(test.measureBa)) {
          doc.text(106, beginFourthTextHeight + (i - 1) * tableLineHeight + 11, formatNumberToZero(test.measureBa[i]))
          doc.text(123, beginFourthTextHeight + (i - 1) * tableLineHeight + 11, formatNumberToZero(Array.isArray(test.precisionBa) ? test.precisionBa[i] : test.precisionBa.split(',')[i]) + '%')
        }
        if (!allZero(test.measureCs)) {
          doc.text(159, beginFourthTextHeight + (i - 1) * tableLineHeight + 11, formatNumberToZero(test.measureCs[i]))
          doc.text(176, beginFourthTextHeight + (i - 1) * tableLineHeight + 11, formatNumberToZero(Array.isArray(test.precisionCs) ? test.precisionCs[i] : test.precisionCs.split(',')[i]) + '%')
        }
      }
      doc.setFontStyle('bold')
      doc.text(15, beginFourthTextHeight + test.measureCo.length * tableLineHeight + 6.5, 'Exatidão:')
      doc.setFontStyle('normal')
      if (test.accuracyCo.toString() !== '-') {
        doc.text(60, beginFourthTextHeight + test.measureCo.length * tableLineHeight + 6.5, test.accuracyCo.toString() + '%')
      }
      if (test.accuracyBa.toString() !== '-') {
        doc.text(113, beginFourthTextHeight + test.measureCo.length * tableLineHeight + 6.5, test.accuracyBa.toString() + '%')
      }
      if (test.accuracyCs.toString() !== '-') {
        doc.text(166, beginFourthTextHeight + test.measureCo.length * tableLineHeight + 6.5, test.accuracyCs.toString() + '%')
      }
      doc.roundedRect(10, beginFourthRoundedRect, 190, test.measureCo.length * tableLineHeight + 24, 2, 2, 'S')
      doc.text(190, 280, '1/2')
      doc.text(190, 280, '1/2')
      doc.addPage()
      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)
      doc.roundedRect(10, 35, 190, 25 + lineHeight, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginRoundedRect + 8, 'Resultados', null, null, 'center')
      doc.setFontSize(10)
      doc.setFontStyle('normal')
      if (test.conclusion === 'Satisfatório') {
        doc.text(15, beginRoundedRect + 15, 'O equipamento apresentou os resultados dos testes de exatidão e precisão dentro dos limites estabelecidos em')
        doc.text(15, beginRoundedRect + 15 + 6, 'norma [2], sendo considerado apto para uso.')
      } else {
        doc.text(15, beginRoundedRect + 15, 'O equipamento apresentou algum resultado acima dos limites estabelecidos em norma [2]. Recomendamos que o')
        doc.text(15, beginRoundedRect + 15 + 6, 'calibrador seja enviado para manutenção. Ao retornar, repetiremos o teste.')
      }
      addLabelAndInformation(doc, 15, beginRoundedRect + 15 + lineHeight, 'Conclusão:', test.conclusion)
      doc.roundedRect(10, beginRoundedRect + 40, 190, 45, 2, 2, 'S')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(105, beginRoundedRect + 40 + 8, 'Bibliografia', null, null, 'center')
      doc.setFontSize(10)
      doc.setFontStyle('normal')
      doc.text(15, beginRoundedRect + 40 + 8 + 8, '[1] INTERNATIONAL ATOMIC ENERGY AGENCY. IAEA-TECDOC-602: Quality control of nuclear medicine')
      doc.text(15, beginRoundedRect + 40 + 8 + 8 + 6, 'instruments 1991. Vienna. 1991')
      doc.text(15, beginRoundedRect + 40 + 8 + 8 + 8 + 6, '[2] COMISSÃO NACIONAL DE ENERGIA NUCLEAR. Norma CNEN NN 3.05: Requisitos de Segurança e Proteção')
      doc.text(15, beginRoundedRect + 40 + 8 + 8 + 8 + 6 + 6, 'Radiológica para Serviços de Medicina Nuclear. 2013.')
      doc.text(190, 280, '2/2')

      setTimeout(() => {
        window.open(doc.output('bloburl'))
        resolve()
      }, 3000)
    })
  })
}

export const testPoints = (values) => {
  return new Promise((resolve, reject) => {
    let tCo = new Date(values.date) - new Date(values.sourceCo.initialActivityDate)
    let calculatedCoActivity = values.sourceCo.initialActivity * Math.exp(-(0.6931471806 * tCo / 1000 / 60 / 60) / 6522.96)

    let tBa = new Date(values.date) - new Date(values.sourceBa.initialActivityDate)
    let calculatedBaActivity = values.sourceBa.initialActivity * Math.exp(-(0.6931471806 * tBa / 1000 / 60 / 60) / 92067.6)

    let tCs = new Date(values.date) - new Date(values.sourceCs.initialActivityDate)
    let calculatedCsActivity = values.sourceCs.initialActivity * Math.exp(-(0.6931471806 * tCs / 1000 / 60 / 60) / 264289.2)

    if (allZero(values.measureCo)) {
      values.accuracyCo = '-'
    } else {
      values.accuracyCo = (100 * (Math.abs(average(values.measureCo) - calculatedCoActivity) / calculatedCoActivity)).toFixed(2)
    }
    if (allZero(values.measureBa)) {
      values.accuracyBa = '-'
    } else {
      values.accuracyBa = (100 * (Math.abs(average(values.measureBa) - calculatedBaActivity) / calculatedBaActivity)).toFixed(2)
    }
    if (allZero(values.measureCs)) {
      values.accuracyCs = '-'
    } else {
      values.accuracyCs = (100 * (Math.abs(average(values.measureCs) - calculatedCsActivity) / calculatedCsActivity)).toFixed(2)
    }

    let precisionCo = Array.isArray(values.precisionCo) ? values.precisionCo : values.precisionCo.split(',').map(e => { parseFloat(e) })
    let precisionBa = Array.isArray(values.precisionBa) ? values.precisionBa : values.precisionBa.split(',').map(e => { parseFloat(e) })
    let precisionCs = Array.isArray(values.precisionCs) ? values.precisionCs : values.precisionCs.split(',').map(e => { parseFloat(e) })

    values.precisionCo = precisionCo
    values.precisionBa = precisionBa
    values.precisionCs = precisionCs

    for (let i = 0; i < values.measureCo.length; i++) {
      values.precisionCo[i] = (Math.abs(100 * (parseFloat(values.measureCo[i]) - average(values.measureCo)) / average(values.measureCo)))
      values.precisionBa[i] = (Math.abs(100 * (parseFloat(values.measureBa[i]) - average(values.measureBa)) / average(values.measureBa)))
      values.precisionCs[i] = (Math.abs(100 * (parseFloat(values.measureCs[i]) - average(values.measureCs)) / average(values.measureCs)))

      if (Math.sqrt(values.precisionCo[i] * parseFloat(values.precisionCo[i])) > 5 ||
          Math.sqrt(values.precisionBa[i] * parseFloat(values.precisionBa[i])) > 5 ||
          Math.sqrt(values.precisionCs[i] * parseFloat(values.precisionCs[i])) > 5 ||
          Math.sqrt(values.accuracyCo * values.accuracyCo) > 10 ||
          Math.sqrt(values.accuracyBa * values.accuracyBa) > 10 ||
          Math.sqrt(values.accuracyCs * values.accuracyCs) > 10) {
        values.conclusion = 'Insatisfatório'
      } else {
        values.conclusion = 'Satisfatório'
      }
    }

    resolve(values)
  })
}

const allZero = (array) => {
  for (var i = 0; i < array.length; i++) {
    if (array[i] !== 0 && array[i] !== '0') {
      return false
    }
  }
  return true
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

const formatNumberToZero = (value) => {
  if (value) {
    var result = parseFloat(value)
    if (isNaN(result)) {
      return '0,00'
    } else {
      return result.toFixed(2).toString().replace('.', ',')
    }
  } else {
    return '0,00'
  }
}

const formatNumber = (value) => {
  if (isNaN(value)) {
    return '-'
  } else {
    return value.toFixed(2).toString().replace('.', ',')
  }
}

const average = (array) => {
  let sum = 0
  for (let i = 0; i < array.length - 1; i++) {
    sum += parseFloat(array[i + 1])
  }
  return sum / (array.length - 1)
}

const truncate = (str, n) => {
  return (str.length > n) ? str.substr(0, n - 1) + '...' : str
}
