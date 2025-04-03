<template>
  <Layout :title="`Geometria - ${formattedTestDate}`" :loading="loading">
    <template #breadcrumb>
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
        :to="`/equipments/doseCalibrator/${equipmentId}/geometry`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        Geometria
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800 select-none">{{ formattedTestDate }}</span>
    </template>
    <template #header>
      <router-link
        :to="`/equipments/doseCalibrator/${equipmentId}`"
        class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
      >
        <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
        Voltar
      </router-link>
    </template>

    <article>
      <div class="flex justify-between items-center mb-4">
        <div>
          <h1 class="text-xl font-semibold">{{ equipmentTitle }}</h1>
          <h2 class="text-lg text-gray-600">
            Geometria - {{ formattedTestDate }}
          </h2>
        </div>
        <div class="space-x-2 flex items-center">
          <button
            @click="genDocumentHandler"
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

      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>

      <div v-if="!loading && test._id" class="space-y-6">
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

        <h3 class="text-lg font-semibold mb-3">Medições por Recipiente</h3>
        <div
          v-for="(geometryTest, index) in test.tests"
          :key="index"
          class="bg-white p-4 rounded shadow-md mb-4"
        >
          <h4 class="text-lg font-semibold mb-3">
            {{ geometryTest.container }}
          </h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Volume (mL)
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Atividade Medida (µCi)
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fator de Correção
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Variação (%)
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 text-sm">
                <tr
                  v-for="(measure, mIndex) in geometryTest.measures"
                  :key="mIndex"
                >
                  <td class="px-4 py-2 whitespace-nowrap">
                    {{ measure.volume }}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    {{ measure.activity }}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    {{ formatFactor(measure.correctionFactor) }}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    {{ formatFactor(measure.variation) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

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
      </div>
    </article>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import { testPoints, generateDocument } from "./TestAlgorithm.js"; // Assuming path is correct
import Layout from "@/components/common/Layout.vue";
import InfoCard from "@/components/dashboard/facility/InfoCard.vue"; // Import InfoCard

const route = useRoute();
const router = useRouter();

const facility = ref({});
const equipment = ref({});
const test = ref({ radioisotope: {}, responsible: {}, tests: [] }); // Initialize structure
const currentUser = ref({});
const loading = ref(true);
const error = ref(null);

const equipmentId = computed(() => route.params.equipmentId);
const testId = computed(() => route.params.testId);

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

const formattedTestDate = computed(() => {
  return test.value.date ? moment(test.value.date).format("MM-YYYY") : "N/A";
});

const formatDisplayDate = (date) => {
  return date ? moment(date).format("DD/MM/YYYY") : "N/A";
};

const testInfo = computed(() => {
  return [
    {
      icon: "fa-atom", // Changed icon
      label: "Radioisótopo",
      value: test.value.radioisotope?.name || "N/A",
    },
    {
      icon: "fa-calendar-days",
      label: "Data de Realização",
      value: formatDisplayDate(test.value.date),
    },
    {
      icon: "fa-user",
      label: "Responsável",
      value: test.value.responsible?.name || "N/A",
    },
  ];
});

const formatFactor = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) ? num.toFixed(3) : "N/A"; // Display factors with 3 decimals
};

const isSatisfactory = computed(() => {
  return test.value.conclusion?.toLowerCase() === "satisfatório";
});

const conclusionText = computed(() => {
  return isSatisfactory.value
    ? "Todos os resultados apresentaram desvio menor que o estabelecido em norma."
    : "Os resultados apresentaram desvio maior que o estabelecido em norma. O teste deverá ser realizado novamente ou o equipamento deverá ser enviado para manutenção.";
});

const conclusionClass = computed(() => {
  return isSatisfactory.value ? "" : "text-red-600 font-semibold";
});

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
      auth.apiUrl() + `equipment/doseCalibratorGeometryTests/${testId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!testResponse.data) throw new Error("Teste de Geometria não encontrado.");

    // Assign fetched data
    const fetchedTest = testResponse.data;
    // Optional: If testPoints modifies data needed for display, call it here.
    // Assuming it's primarily for PDF generation, it's called in genDocumentHandler.
    test.value = fetchedTest;
  } catch (err) {
    console.error("Erro ao carregar dados do teste de geometria:", err);
    error.value = err.message || "Falha ao carregar dados do teste.";
    // Reset states
    equipment.value = {};
    facility.value = {};
    test.value = { radioisotope: {}, responsible: {}, tests: [] };
  } finally {
    loading.value = false;
  }
};

const excludeTest = async () => {
  if (confirm("Tem certeza que deseja excluir este teste?")) {
    try {
      // Assuming auth method exists and handles API call
      await auth.excludeDoseCalibratorGeometryTest(test.value);
      router.push(`/equipments/doseCalibrator/${equipmentId.value}/geometry`);
    } catch (err) {
      console.error("Erro ao excluir teste de geometria:", err);
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Falha ao excluir o teste.";
    }
  }
};

const genDocumentHandler = async () => {
  if (!test.value._id || !facility.value._id || !equipment.value._id) {
    error.value = "Dados incompletos para gerar o documento.";
    return;
  }
  try {
    // Ensure testPoints is run if needed by generateDocument
    // If testPoints modifies the test object for the PDF, run it here.
    if (test.value.tests && typeof testPoints === "function") {
      await testPoints(test.value.tests); // Ensure calculations are done before PDF
    }
    await generateDocument(
      test.value,
      facility.value,
      equipment.value,
      test.value.responsible
    );
  } catch (err) {
    console.error("Erro ao gerar documento PDF:", err);
    error.value = "Ocorreu um erro ao gerar o PDF.";
  }
};

onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadTestData();
});
</script>
