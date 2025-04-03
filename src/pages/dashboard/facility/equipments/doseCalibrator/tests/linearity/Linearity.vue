<template>
  <Layout
    :title="`Linearidade - ${formattedTestDate}`"
    :loading="loading"
  >
    <template #breadcrumb>
      <!-- Breadcrumbs matching AccuracyAndPrecision -->
      <router-link
        :to="`/facility/${facility._id}`"
        class="px-2 text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name || "Instalação" }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/equipments/doseCalibrator/${equipmentId}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ equipmentTitleShort }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/equipments/doseCalibrator/${equipmentId}/linearity`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        Linearidade
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800 select-none">{{ formattedTestDate }}</span>
    </template>
    <template #header>
      <!-- Header Back button matching AccuracyAndPrecision -->
      <router-link
        :to="`/equipments/doseCalibrator/${equipmentId}`"
        class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
      >
        <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
        Voltar
      </router-link>
    </template>

    <article>
      <!-- Header section inside article matching AccuracyAndPrecision -->
      <div class="flex justify-between items-center mb-4">
        <div>
          <h1 class="text-xl font-semibold">{{ equipmentTitle }}</h1>
          <h2 class="text-lg text-gray-600">
            Linearidade - {{ formattedTestDate }}
          </h2>
        </div>
        <div class="space-x-2 flex items-center">
          <button
            @click="generateDocumentHandler"
            class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon="fa-solid fa-file-pdf" class="md:mr-2" />
            <span class="hidden md:inline">Gerar PDF</span>
          </button>
          <button
            @click="excludeTest"
            v-if="permission?.canExcludeFacility(currentUser)"
            class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon="fa-solid fa-trash-can" class="md:mr-2" />
            <span class="hidden md:inline">Excluir</span>
          </button>
        </div>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-center mt-8">Carregando dados do teste...</div>
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>

      <div v-if="!loading && test._id" class="space-y-6">
        <!-- Test Info using InfoCard -->
        <div class="w-fit">
          <InfoCard
            :data="testInfo"
            title="Informações do Teste"
            iconSize="h-4 w-4"
            labelSize="text-base"
            valueSize="text-base"
            titleSize="text-lg"
          />
        </div>

        <!-- Measurement Table -->
        <h3 class="text-lg font-semibold mb-3">Medições</h3>
        <div class="overflow-x-auto bg-white rounded shadow-md">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Data e Hora
                </th>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Tempo (h)
                </th>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Atividade Medida (µCi)
                </th>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Atividade Calculada (µCi)
                </th>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Desvio (%)
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(measurement, index) in test.tests" :key="index">
                <td class="px-3 py-2 whitespace-nowrap">
                  {{ formatDateTime(measurement.date) }}
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  {{ measurement.time != null ? measurement.time.toFixed(2) : "N/A" }}
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  {{ twoDigits(measurement.activity) }}
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  {{ !isNaN(measurement.calculatedActivity) ? twoDigits(measurement.calculatedActivity) : "-" }}
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap"
                  :class="{ 'text-red-600 font-bold': measurement.deviation > 10 }"
                >
                  {{ !isNaN(measurement.deviation) ? measurement.deviation.toFixed(2) + "%" : "-" }}
                  <FontAwesomeIcon
                    v-if="measurement.deviation > 10"
                    :icon="['fas', 'exclamation-circle']"
                    class="ml-1"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Result section matching AccuracyAndPrecision -->
        <div class="bg-white p-6 rounded shadow-md">
          <h5 class="mb-3 font-medium">Resultado:</h5>
          <p class="text-sm mb-2" :class="conclusionClass">
            {{ conclusionText }}
          </p>
          <p class="text-sm font-semibold">
            Conclusão:
            <span class="capitalize">{{ test.conclusion || "N/A" }}</span>
          </p>
        </div>

        <!-- Plot section -->
        <div class="bg-white p-4 rounded shadow-md">
          <h5 class="text-lg font-semibold mb-3 text-center">
            Gráfico de Linearidade
          </h5>
          <PlotComponent
            v-if="plotPoints.length > 0 && calculatedPlotPoints.length > 0"
            id="scatter-chart"
            :plot-tests="plotPoints"
            :calculated-plot-tests="calculatedPlotPoints"
          />
          <div v-else class="text-center text-gray-500 italic">
            Dados insuficientes para gerar o gráfico.
          </div>
        </div>
      </div>
    </article>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router"; // Import RouterLink
import axios from "axios";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import JsPDF from "jspdf"; // For PDF generation
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import InfoCard from "@/components/dashboard/facility/InfoCard.vue"; // Import InfoCard
import PlotComponent from "./Plot.vue"; // Import the plot component

const route = useRoute();
const router = useRouter();

// --- State --- //
const loading = ref(true);
const error = ref(null);
const facility = ref({});
const equipment = ref({});
const test = ref({ radioisotope: {}, responsible: {}, tests: [] }); // Initialize structure
const currentUser = ref({});
const plotPoints = ref([]);
const calculatedPlotPoints = ref([]);

const equipmentId = computed(() => route.params.id);
const testId = computed(() => route.params.testId);

// --- Computed Properties --- //
// Match equipmentTitle from AccuracyAndPrecision
const equipmentTitle = computed(() => {
  if (!equipment.value.type) return "Equipamento";
  return `${equipment.value.type}`;
});

const equipmentTitleShort = computed(() => {
  if (!equipment.value.type) return "ID";
  const patrimonial = equipment.value.patrimonialNumber || "";
  const serial = equipment.value.serialNumber || "";
  const separator = patrimonial && serial ? "-" : "";
  return `${patrimonial}${separator}${serial}`.trim() || "Detalhes";
});

// Use base date with DD/MM/YYYY format for consistency if needed, or keep MM-YYYY
const formattedTestDate = computed(() => {
  return test.value.date ? moment(test.value.date).format("DD/MM/YYYY") : "N/A";
});

// InfoCard data structure
const testInfo = computed(() => {
  return [
    {
      icon: "fa-atom", // Icon for radioisotope
      label: "Radioisótopo",
      value: test.value.radioisotope?.name || "N/A",
    },
    {
      icon: "fa-calendar-days",
      label: "Data Base",
      value: formatDisplayDate(test.value.date),
    },
    {
      icon: "fa-user",
      label: "Responsável",
      value: test.value.responsible?.name || "N/A",
    },
  ];
});

const isSatisfactory = computed(() => {
  return test.value.conclusion?.toLowerCase() === "satisfatório";
});

// Match conclusion text/class from AccuracyAndPrecision
const conclusionText = computed(() => {
  return isSatisfactory.value
    ? "Todos os resultados apresentaram desvio menor que o estabelecido em norma."
    : "Os resultados apresentaram desvio maior que o estabelecido em norma. O teste deverá ser realizado novamente ou o equipamento deverá ser enviado para manutenção.";
});

const conclusionClass = computed(() => {
  return isSatisfactory.value ? "" : "text-red-600 font-semibold";
});

// --- Formatting Functions --- //
const formatDisplayDate = (date) => {
  return date ? moment(date).format("DD/MM/YYYY") : "N/A";
};

const formatDateTime = (isoString) => {
  return isoString ? moment(isoString).format("DD/MM/YYYY HH:mm") : "N/A";
};

const twoDigits = (val) => {
  const num = parseFloat(val);
  return !isNaN(num) ? num.toFixed(2) : "-";
};

// --- Calculation Logic (keep existing, seems specific to Linearity) --- //
const expCurveFit = (d) => {
  let sumX2Y = 0,
    sumYLnY = 0,
    sumXY = 0,
    sumXYLnY = 0,
    sumY = 0;
  for (let i = 0; i < d.length; i++) {
    let x = d[i][0]; // time
    let y = d[i][1]; // activity
    if (y <= 0) continue; // Skip non-positive activities for log
    sumX2Y += x ** 2 * y;
    sumYLnY += y * Math.log(y);
    sumXY += x * y;
    sumXYLnY += x * y * Math.log(y);
    sumY += y;
  }
  const denominator = sumY * sumX2Y - sumXY ** 2;
  if (Math.abs(denominator) < 1e-10) {
    // Avoid division by zero or near-zero
    console.warn(
      "Exponential curve fit calculation failed due to denominator near zero."
    );
    return { equation: [NaN, NaN] };
  }
  let a = (sumX2Y * sumYLnY - sumXY * sumXYLnY) / denominator;
  let b = (sumY * sumXYLnY - sumXY * sumYLnY) / denominator;
  return { equation: [Math.exp(a), b] }; // Returns [A0, -lambda] potentially
};

const processTestData = (fetchedTest) => {
  const measurements = fetchedTest.tests || [];
  if (measurements.length === 0) return; // No data to process

  measurements.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  const firstMeasurementDate = moment(measurements[0].date);
  let pointsForFit = [];
  let localPlotPoints = [];
  let localCalculatedPlotPoints = [];

  // First pass: Calculate time and prepare points for fitting
  measurements.forEach((m, index) => {
    if (index === 0) {
      m.time = 0;
    } else {
      m.time = moment(m.date).diff(firstMeasurementDate, "hours", true);
    }
    if (m.activity != null && m.activity > 0) {
      pointsForFit.push([m.time, m.activity]);
    }
  });

  // Perform curve fit
  let fitResult = { equation: [NaN, NaN] };
  if (pointsForFit.length >= 2) {
    fitResult = expCurveFit(pointsForFit);
  } else {
    console.warn("Not enough valid data points (>=2) for exponential curve fit.");
  }

  // Second pass: Calculate expected activity, deviation, and prepare plot data
  measurements.forEach((m) => {
    if (
      m.time != null &&
      !isNaN(fitResult.equation[0]) &&
      !isNaN(fitResult.equation[1])
    ) {
      m.calculatedActivity =
        fitResult.equation[0] * Math.exp(fitResult.equation[1] * m.time);
      if (m.activity != null && m.activity > 0 && m.calculatedActivity > 0) {
        m.deviation = Math.abs(100 - (m.activity * 100) / m.calculatedActivity);
        // Note: The overall test.conclusion should reflect the highest deviation check
      } else {
        m.deviation = NaN; // Mark as Not a Number if calculation is impossible
      }
      localCalculatedPlotPoints.push({ x: m.time, y: m.calculatedActivity });
    } else {
      m.calculatedActivity = NaN;
      m.deviation = NaN;
      // Add calculated point as null or skip? Skipping might be better for plot.
      // localCalculatedPlotPoints.push({ x: m.time, y: NaN });
    }
    // Add measured point regardless of calculation success
    if (m.activity != null && m.time != null) {
      localPlotPoints.push({ x: m.time, y: m.activity });
    }
  });

  // Update refs for the plot
  plotPoints.value = localPlotPoints;
  calculatedPlotPoints.value = localCalculatedPlotPoints;

  // Assign the processed measurements back to the test object
  fetchedTest.tests = measurements;
};

// --- Data Loading --- //
const loadTestData = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Fetch Equipment Info
    const equipResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!equipResponse.data) throw new Error("Equipamento não encontrado.");
    equipment.value = equipResponse.data;

    // Fetch Facility Info
    if (!equipment.value.facility?._id)
      throw new Error("ID da Instalação não encontrado.");
    const facResponse = await axios.get(
      auth.apiUrl() + `facility/${equipment.value.facility._id}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!facResponse.data) throw new Error("Instalação não encontrada.");
    facility.value = facResponse.data;

    // Fetch Specific Test Data
    const testResponse = await axios.get(
      auth.apiUrl() + `doseCalibratorLinearityTests/${testId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!testResponse.data) throw new Error("Teste de Linearidade não encontrado.");

    // Process the fetched data (calculate time, deviation, etc.)
    processTestData(testResponse.data);
    test.value = testResponse.data; // Assign after processing
  } catch (err) {
    console.error("Erro ao carregar dados do teste:", err);
    error.value = err.message || "Falha ao carregar dados do teste.";
    test.value = { radioisotope: {}, responsible: {}, tests: [] }; // Reset on error
  } finally {
    loading.value = false;
  }
};

// --- PDF Generation (keep existing, seems specific to Linearity) --- //
const addLabelAndInformation = (doc, x, y, label, information) => {
  const spaceBetweenInformationAndLabel = 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold"); // Use setFont for style
  doc.text(label, x, y);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(information || "", x, y + spaceBetweenInformationAndLabel);
};

const truncate = (str, n) => {
  if (!str) return "";
  return str.length > n ? str.substr(0, n - 3) + "..." : str;
};

const generateDocumentHandler = async () => {
  if (!test.value._id) {
    error.value = "Dados do teste não carregados para gerar PDF.";
    return;
  }

  const doc = new JsPDF();
  // Assuming radLogo is handled globally or imported differently in setup script
  // const radLogo = require('@/assets/radLogo.png'); // Example path, adjust as needed
  const lineHeight = 12;
  const tableLineHeight = 6;
  let beginRoundedRect = 35;
  let beginTextHeight = beginRoundedRect + 15;
  let beginSecondRoundedRect = beginRoundedRect + 60 + 3;
  let beginSecondTextHeight = beginSecondRoundedRect + 15;
  let beginThirdRoundedRect = beginSecondRoundedRect + 15 + 2 * 6 + 3;
  let beginThirdTextHeight = beginThirdRoundedRect + 15;
  let currentY;

  // Page 1
  // Header
  // doc.setFillColor(240, 240, 240);
  // doc.roundedRect(10, 10, 190, 22, 2, 2, 'F');
  // if (radLogo) doc.addImage(radLogo, 'PNG', 15, 12, 74, 20);

  // Info Box
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(10, beginRoundedRect, 190, 60, 2, 2, "S");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Controle de Qualidade", 105, beginRoundedRect + 8, {
    align: "center",
  });

  addLabelAndInformation(
    doc,
    15,
    beginTextHeight,
    "Instalação:",
    truncate(facility.value.companyName || facility.value.name || "", 43)
  );
  addLabelAndInformation(
    doc,
    90,
    beginTextHeight,
    "Local:",
    equipment.value.localization
  );
  addLabelAndInformation(
    doc,
    15,
    beginTextHeight + lineHeight,
    "Equipamento:",
    equipment.value.type
  );
  addLabelAndInformation(
    doc,
    90,
    beginTextHeight + lineHeight,
    "Modelo:",
    `${equipment.value.manufacturer}/${equipment.value.model}-${equipment.value.serialNumber}`
  );
  addLabelAndInformation(
    doc,
    150,
    beginTextHeight + lineHeight,
    "Número Patrimonial:",
    equipment.value.patrimonialNumber
  );
  addLabelAndInformation(
    doc,
    15,
    beginTextHeight + 2 * lineHeight,
    "Teste:",
    "Linearidade"
  );
  addLabelAndInformation(
    doc,
    90,
    beginTextHeight + 2 * lineHeight,
    "Periodicidade:",
    "Trimestral"
  ); // Linearity is Quarterly
  addLabelAndInformation(
    doc,
    150,
    beginTextHeight + 2 * lineHeight,
    "Data:",
    formatDisplayDate(test.value.date)
  );
  addLabelAndInformation(
    doc,
    15,
    beginTextHeight + 3 * lineHeight,
    "Responsável:",
    test.value.responsible?.name || "N/A"
  );
  addLabelAndInformation(
    doc,
    90,
    beginTextHeight + 3 * lineHeight,
    "Isótopo utilizado:",
    test.value.radioisotope?.name || "N/A"
  );
  const halfLifeHours =
    test.value.radioisotope?.halfLife
      ? (test.value.radioisotope.halfLife / 3600).toFixed(2).replace(".", ",")
      : "N/A";
  addLabelAndInformation(
    doc,
    150,
    beginTextHeight + 3 * lineHeight,
    "Meia-vida:",
    `${halfLifeHours} horas`
  );

  // Objectives Box
  doc.roundedRect(10, beginSecondRoundedRect, 190, 15 + 2 * 6, 2, 2, "S");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Objetivos", 105, beginSecondRoundedRect + 8, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Verificar a linearidade nas medidas de um calibrador de dose através da utilização de uma fonte de meia vida curta.",
    15,
    beginSecondTextHeight
  );
  doc.text(
    "As medidas devem estar dentro de um intervalo de até 10% (dez por cento) [1-2].",
    15,
    beginSecondTextHeight + 6
  );

  // Analysis Table Box
  doc.roundedRect(
    10,
    beginThirdRoundedRect,
    190,
    test.value.tests.length * tableLineHeight + 22,
    2,
    2,
    "S"
  );
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Análises", 105, beginThirdRoundedRect + 8, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  currentY = beginThirdTextHeight;
  doc.text("Data e Hora", 15, currentY + 2);
  doc.text("Tempo (h)", 69, currentY + 2);
  doc.text("Atividade Medida (µCi)", 106, currentY + 2);
  doc.text("Atividade Calculada (µCi)", 143, currentY + 2);
  doc.text("Desvio (%)", 180, currentY + 2);

  currentY += 10;
  test.value.tests.forEach((measurement, i) => {
    doc.text(formatDateTime(measurement.date), 15, currentY + i * tableLineHeight);
    doc.text(
      measurement.time != null ? measurement.time.toFixed(2) : "-",
      69,
      currentY + i * tableLineHeight
    );
    doc.text(twoDigits(measurement.activity), 106, currentY + i * tableLineHeight);
    doc.text(
      !isNaN(measurement.calculatedActivity)
        ? twoDigits(measurement.calculatedActivity)
        : "-",
      143,
      currentY + i * tableLineHeight
    );
    doc.text(
      !isNaN(measurement.deviation)
        ? measurement.deviation.toFixed(2) + "%"
        : "-",
      180,
      currentY + i * tableLineHeight
    );
  });

  doc.text("1/2", 190, 280, { align: "right" });

  // Page 2
  doc.addPage();
  // Header
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(10, 10, 190, 22, 2, 2, 'F');
  if (radLogo) doc.addImage(radLogo, 'PNG', 15, 12, 74, 20);

  // Plot Box
  beginRoundedRect = 35;
  doc.roundedRect(10, beginRoundedRect, 190, 100, 2, 2, "S");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Gráfico", 105, beginRoundedRect + 8, { align: "center" });
  // Add plot image - requires canvas element in the template or off-screen rendering
  const canvas = document.querySelector("#scatter-chart canvas"); // Adjust selector if needed
  if (canvas) {
    try {
      const canvasImg = canvas.toDataURL("image/png", 1.0);
      doc.addImage(canvasImg, "PNG", 63, beginRoundedRect + 12, 83, 83); // Adjust position/size
    } catch (e) {
      console.error("Error getting canvas image for PDF:", e);
      doc.setFont("helvetica", "italic");
      doc.text("Erro ao gerar imagem do gráfico.", 105, beginRoundedRect + 50, {
        align: "center",
      });
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.text(
      "Gráfico não disponível para inclusão no PDF.",
      105,
      beginRoundedRect + 50,
      { align: "center" }
    );
  }

  // Results Box
  beginSecondRoundedRect = beginRoundedRect + 100 + 3;
  doc.roundedRect(10, beginSecondRoundedRect, 190, 35, 2, 2, "S");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Resultados", 105, beginSecondRoundedRect + 8, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(conclusionText.value, 15, beginSecondRoundedRect + 15);
  addLabelAndInformation(
    doc,
    15,
    beginSecondRoundedRect + 15 + lineHeight,
    "Conclusão:",
    test.value.conclusion
  );

  // Bibliography Box
  beginThirdRoundedRect = beginSecondRoundedRect + 35 + 3;
  doc.roundedRect(10, beginThirdRoundedRect, 190, 45, 2, 2, "S");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bibliografia", 105, beginThirdRoundedRect + 8, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  currentY = beginThirdRoundedRect + 16;
  doc.text(
    "[1] INTERNATIONAL ATOMIC ENERGY AGENCY. IAEA-TECDOC-602: Quality control of nuclear medicine instruments 1991. Vienna. 1991",
    15,
    currentY
  );
  doc.text(
    "[2] COMISSÃO NACIONAL DE ENERGIA NUCLEAR. Norma CNEN NN 3.05: Requisitos de Segurança e Proteção Radiológica para Serviços de Medicina Nuclear. 2013.",
    15,
    currentY + 8
  );

  doc.text("2/2", 190, 280, { align: "right" });

  // Output PDF
  doc.output("dataurlnewwindow");
};

// --- Actions --- //
const excludeTest = async () => {
  if (confirm("Tem certeza que deseja excluir este teste?")) {
    try {
      // Assuming auth service method exists
      await auth.excludeDoseCalibratorLinearityTest({ _id: testId.value });
      router.push(`/equipments/doseCalibrator/${equipmentId.value}/linearity`);
    } catch (err) {
      console.error("Erro ao excluir teste:", err);
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Falha ao excluir o teste.";
    }
  }
};

// --- Lifecycle Hook --- //
onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadTestData();
});
</script>

<style>
/* Minimal global style if needed */
.text-red-600 {
  color: #dc2626; /* Tailwind red-600 */
}
.font-semibold {
  font-weight: 600;
}
</style>
