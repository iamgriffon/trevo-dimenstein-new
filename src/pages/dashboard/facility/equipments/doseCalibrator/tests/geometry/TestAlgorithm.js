import moment from 'moment-timezone'
import JsPDF from 'jspdf'
import radLogo from '@/assets/logo_rad.png'

// Helper function to add labels and information to the PDF
const addLabelAndInformation = (doc, x, y, label, information) => {
  const spaceBetweenInformationAndLabel = 5
  doc.setFontSize(8)
  doc.setFont(undefined, 'bold')
  doc.text(label, x, y)
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(information || '', x, y + spaceBetweenInformationAndLabel)
}

// Helper function to check if a number is even
const isEven = (n) => {
  return n % 2 === 0
}

// Helper function to truncate strings
const truncate = (str, n) => {
  if (!str) return ''
  return (str.length > n) ? str.substr(0, n - 3) + '...' : str
}

// Function to generate the PDF document for the Geometry test
export const generateDocument = async (test, facility, equipment, responsible) => {
  const doc = new JsPDF()
  const lineHeight = 12
  const tableLineHeight = 6
  let beginRoundedRect = 35
  let beginTextHeight = beginRoundedRect + 15

  let beginSecondRoundedRect = beginRoundedRect + 60 + 3
  let beginSecondTextHeight = beginSecondRoundedRect + 15

  let beginThirdRoundedRect = beginSecondRoundedRect + 15 + 5 * 6 + 3
  let beginThirdTextHeight = beginThirdRoundedRect + 15

  // --- Page Header ---
  doc.setFillColor(240, 240, 240)
  doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
  if (radLogo) {
    doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)
  }

  // --- General Info Box ---
  doc.setDrawColor(200, 200, 200)
  doc.roundedRect(10, beginRoundedRect, 190, 60, 2, 2, 'S')
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Controle de Qualidade', 105, beginRoundedRect + 8, { align: 'center' })

  addLabelAndInformation(doc, 15, beginTextHeight, 'Instalação:', facility.companyName ? truncate(facility.companyName, 43) : '')
  addLabelAndInformation(doc, 90, beginTextHeight, 'Local:', equipment.localization)
  addLabelAndInformation(doc, 15, beginTextHeight + lineHeight, 'Equipamento:', equipment.type)
  addLabelAndInformation(doc, 90, beginTextHeight + lineHeight, 'Modelo:', `${equipment.manufacturer}/${equipment.model}-${equipment.serialNumber}`)
  addLabelAndInformation(doc, 150, beginTextHeight + lineHeight, 'Número Patrimonial:', equipment.patrimonialNumber)
  addLabelAndInformation(doc, 15, beginTextHeight + 2 * lineHeight, 'Teste:', 'Geometria')
  addLabelAndInformation(doc, 90, beginTextHeight + 2 * lineHeight, 'Periodicidade:', 'Anual')
  addLabelAndInformation(doc, 150, beginTextHeight + 2 * lineHeight, 'Data:', moment(test.date).format('DD/MM/YYYY'))
  addLabelAndInformation(doc, 15, beginTextHeight + 3 * lineHeight, 'Responsável:', responsible?.name || 'N/A')
  addLabelAndInformation(doc, 90, beginTextHeight + 3 * lineHeight, 'Isótopo utilizado:', test.radioisotope?.name || 'N/A')
  const halfLifeHours = test.radioisotope?.halfLife ? (test.radioisotope.halfLife / 3600).toFixed(2).replace('.', ',') : 'N/A'
  addLabelAndInformation(doc, 150, beginTextHeight + 3 * lineHeight, 'Meia-vida:', `${halfLifeHours} horas`)

  // --- Objectives Box ---
  doc.roundedRect(10, beginSecondRoundedRect, 190, 15 + 5 * 6, 2, 2, 'S')
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Objetivos', 105, beginSecondRoundedRect + 8, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text('Verificar se os fatores de calibração do equipamento para recipientes e volumes diferentes daqueles usados nos', 15, beginSecondTextHeight)
  doc.text('testes usuais estão corretos [1]. A avaliação é feita pelas atividades medidas de uma amostra mantendo a', 15, beginSecondTextHeight + 6)
  doc.text('quantidade de material radioativo em função do volume.', 15, beginSecondTextHeight + 12)
  doc.text('Variações maiores que 10% devem ser investigadas, entre 5% e 10% é necessário utilizar o fator de correção de', 15, beginSecondTextHeight + 18)
  doc.text('acordo com o recipiente e o volume [2].', 15, beginSecondTextHeight + 24)

  beginThirdRoundedRect = beginSecondRoundedRect + 15 + 5 * 6 + 3

  // --- Iterate through each container's test results ---
  for (let i = 0; i < test.tests.length; i++) {
    const geometryTest = test.tests[i]
    let pageConclusion = 'satisfatório' // Reset conclusion for each section/page

    // Check for page break (2 containers per page)
    if (i > 0 && isEven(i)) {
      doc.addPage()
      // Redraw header on new page
      doc.setFillColor(240, 240, 240)
      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      if (radLogo) {
        doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)
      }
      beginThirdRoundedRect = 35 // Reset Y position for the container box
    } else if (i > 0) {
      // Position the next container box below the previous one on the same page
      const previousTest = test.tests[i - 1]
      beginThirdRoundedRect += previousTest.measures.length * tableLineHeight + 63 + 3 // Add space below previous box
    }

    beginThirdTextHeight = beginThirdRoundedRect + 15

    // --- Container Results Box ---
    doc.roundedRect(10, beginThirdRoundedRect, 190, geometryTest.measures.length * tableLineHeight + 63, 2, 2, 'S')
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(geometryTest.container || 'Recipiente Desconhecido', 105, beginThirdRoundedRect + 8, { align: 'center' })

    // --- Analysis Table Header ---
    doc.setFontSize(10)
    doc.text('Análises', 105, beginThirdTextHeight, { align: 'center' })
    doc.setFont(undefined, 'normal')
    doc.text('Volume (mL)', 25, beginThirdTextHeight + 8)
    doc.text('Atividade Medida (µCi)', 69, beginThirdTextHeight + 8)
    doc.text('Fator de Correção', 120, beginThirdTextHeight + 8)
    doc.text('Variação (%)', 166, beginThirdTextHeight + 8)

    // --- Analysis Table Rows ---
    let currentY = beginThirdTextHeight + 14
    for (let j = 0; j < geometryTest.measures.length; j++) {
      const measure = geometryTest.measures[j]
      doc.text(measure.volume?.toString() || '-', 27, currentY)
      doc.text(measure.activity?.toString() || '-', 88, currentY)
      doc.text(measure.correctionFactor?.toString() || '-', 129, currentY)
      doc.text(measure.variation?.toString() || '-', 171, currentY)

      // Determine conclusion based on variation
      const variation = parseFloat(measure.variation)
      if (!isNaN(variation)) {
        if (Math.abs(variation) > 10) {
          pageConclusion = 'insatisfatório'
        } else if (Math.abs(variation) > 5 && pageConclusion !== 'insatisfatório') {
          pageConclusion = 'satisfatório - adotar fatores de correção'
        }
      }
      currentY += tableLineHeight
    }

    // --- Results Text ---
    currentY += 3 // Space before results text
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text('Resultados', 105, currentY, { align: 'center' })
    doc.setFont(undefined, 'normal')
    currentY += 7

    let conclusionText = []
    if (geometryTest.container !== 'Transferência Frasco-Seringa') {
      if (pageConclusion === 'satisfatório') {
        conclusionText = [
          `As variações nas atividades medidas entre diferentes volumes no recipiente ${geometryTest.container} estão abaixo de 5%, de`,
          `modo que não há necessidade de aplicar os fatores de correção para este recipiente.`
        ]
      } else if (pageConclusion === 'satisfatório - adotar fatores de correção') {
        conclusionText = [
          `As variações nas atividades medidas entre diferentes volumes no recipiente ${geometryTest.container} estão entre 5% e 10%,`,
          `de modo que é necessário aplicar o fator de correção correspondente (mostrado na tabela) para obter o valor da`,
          `atividade equivalente no menor volume.`
        ]
      } else { // insatisfatório
        conclusionText = [
          `As variações nas atividades medidas entre diferentes volumes no recipiente ${geometryTest.container} estão acima de 10%, de`,
          `modo que é necessário rever o uso deste recipiente até a conclusão de uma investigação sobre essa variação.`
        ]
      }
    } else { // Transferência Frasco-Seringa case
      if (pageConclusion === 'satisfatório') {
        conclusionText = [
          `A variação nas atividades medidas entre os diferentes recipientes está abaixo de 5%, de modo que não há`,
          `necessidade de aplicar os fatores de correção para este recipiente.`
        ]
      } else if (pageConclusion === 'satisfatório - adotar fatores de correção') {
        conclusionText = [
          `Quando os usuários deste calibrador transferirem doses de frascos para seringa, e vice e versa, deverá ser`,
          `adotado o fator de correção encontrado.`
        ]
      } else { // insatisfatório
        conclusionText = [
          `Como há variação maior que 10% na transferência entre os recipientes, deverá ser adotado como referência o`,
          `valor medido no frasco e a atividade na seringa ser encontrada através da atividade inicial menos a atividade`,
          `após retirada de volume pela seringa.`
        ]
      }
    }

    conclusionText.forEach(line => {
      doc.text(line, 15, currentY)
      currentY += 6
    })

    addLabelAndInformation(doc, 15, currentY, 'Conclusão:', pageConclusion)
  }

  // --- Bibliography Section (add to the last page) ---
  // Check if we need a new page for bibliography
  const lastTest = test.tests[test.tests.length - 1]
  const lastTestBoxHeight = lastTest.measures.length * tableLineHeight + 63
  const bibliographyHeight = 45

  if (isEven(test.tests.length)) { // Last box was on the right
    // Position based on the second to last box's bottom
    const secondLastTest = test.tests.length >= 2 ? test.tests[test.tests.length - 2] : null
    const secondLastBoxHeight = secondLastTest?.measures.length * tableLineHeight + 63 || 0
    // Estimate where the last box ended (roughly secondLastBoxBottom + spacing + lastBoxHeight)
    const estimatedLastBoxBottom = (35 + secondLastBoxHeight + 3) + lastTestBoxHeight

    if (estimatedLastBoxBottom + bibliographyHeight + 15 > doc.internal.pageSize.height) { // Check if space is enough
      doc.addPage()
      // Redraw header
      doc.setFillColor(240, 240, 240)
      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      if (radLogo) doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)
      beginThirdRoundedRect = 35 // Reset Y position
    } else {
      // Try placing it below the second to last box (if it fits)
      beginThirdRoundedRect = 35 + secondLastBoxHeight + 3 // Below the left box
      if (beginThirdRoundedRect + bibliographyHeight + 15 > doc.internal.pageSize.height) { // If still doesn't fit below left
        beginThirdRoundedRect = 35 // Go to top of page (should already be on new page)
      } else { 
        // Check if it overlaps the right box
        const rightBoxTop = 35 + secondLastBoxHeight + 3 + lastTestBoxHeight + 3 // Start Y of right box
        if (beginThirdRoundedRect + bibliographyHeight > rightBoxTop) { // Simple overlap check
          beginThirdRoundedRect = 35 // Go to top (means it must be on a new page) 
        } // else it fits below the left box without overlapping the right 
      } 
    }
  } else { // Last box was on the left or only one box
    if (beginThirdRoundedRect + lastTestBoxHeight + bibliographyHeight + 15 > doc.internal.pageSize.height) {
      doc.addPage()
      // Redraw header
      doc.setFillColor(240, 240, 240)
      doc.roundedRect(10, 10, 190, 22, 2, 2, 'F')
      if (radLogo) doc.addImage(radLogo, 'PNG', 15, 12, 74, 20)
      beginThirdRoundedRect = 35 // Reset Y position
    } else {
      beginThirdRoundedRect += lastTestBoxHeight + 3 // Position below the last box
    }
  }

  doc.roundedRect(10, beginThirdRoundedRect, 190, bibliographyHeight, 2, 2, 'S')
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Bibliografia', 105, beginThirdRoundedRect + 8, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  let currentY = beginThirdRoundedRect + 16
  doc.text('[1] COMISSÃO NACIONAL DE ENERGIA NUCLEAR. Norma CNEN NN 3.05: Requisitos de Segurança e Proteção', 15, currentY)
  currentY += 6
  doc.text('Radiológica para Serviços de Medicina Nuclear. 2013.', 15, currentY)
  currentY += 8
  doc.text('[2] AMERICAN ASSOCIATION OF PHYSICISTS IN MEDICINE. The Selection, Use, Calibration, and Quality', 15, currentY)
  currentY += 6
  doc.text('Assurance of Radionuclide Calibrators Used in Nuclear Medicine, Report of AAPM Task Group 181. 2012.', 15, currentY)

  // Open the PDF in a new window (removed setTimeout)
  doc.output('dataurlnewwindow')
}

export const testPoints = async (tests) => {
  let overallConclusion = 'satisfatório'

  if (!tests || !Array.isArray(tests)) {
    console.warn('testPoints called with invalid tests array:', tests)
    return { calculatedTests: [], conclusion: 'insatisfatório' }
  }

  tests.forEach(containerTest => {
    if (!containerTest.measures || !Array.isArray(containerTest.measures) || containerTest.measures.length === 0) {
      console.warn('Skipping container test due to invalid measures:', containerTest)
      overallConclusion = 'insatisfatório' // Mark as bad if data is missing
      return // Skip this container
    }

    let sum = 0
    let validMeasures = 0
    containerTest.measures.forEach(measure => {
      const activity = parseFloat(measure.activity)
      if (!isNaN(activity)) {
        sum += activity
        validMeasures++
      }
    })

    if (validMeasures === 0) {
      console.warn('Skipping container test calculation as no valid activities found:', containerTest)
      overallConclusion = 'insatisfatório'
      // Assign 'N/A' or defaults to factors/variations
      containerTest.measures.forEach(measure => {
        measure.correctionFactor = 'N/A'
        measure.variation = 'N/A'
      })
      return // Skip calculation for this container
    }

    const average = sum / validMeasures

    containerTest.measures.forEach(measure => {
      const activity = parseFloat(measure.activity)
      if (isNaN(activity) || average === 0) {
        measure.correctionFactor = 'N/A'
        measure.variation = 'N/A'
      } else {
        measure.correctionFactor = (average / activity).toFixed(3)
        measure.variation = (100 * activity / average - 100).toFixed(2)

        const variationNum = parseFloat(measure.variation)
        if (!isNaN(variationNum)) {
          if (Math.abs(variationNum) > 10) {
            overallConclusion = 'insatisfatório'
          } else if (Math.abs(variationNum) > 5 && overallConclusion !== 'insatisfatório') {
            overallConclusion = 'satisfatório - adotar fatores de correção'
          }
        }
      }
    })
  })

  // Return the mutated tests array and the final conclusion
  return { calculatedTests: tests, conclusion: overallConclusion }
}
