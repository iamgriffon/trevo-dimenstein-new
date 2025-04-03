<template>
  <Layout
    :title="`Exatidão e Precisão - ${formattedTestDate}`"
    :loading="loading"
  >
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
        :to="`/equipments/doseCalibrator/${equipmentId}/accuracyandprecision`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        Exatidão e Precisão
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
            Exatidão e Precisão - {{ formattedTestDate }}
          </h2>
        </div>
        <div class="space-x-2 flex items-center">
          <button
            @click="genDocument"
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
      <div v-if="!loading && test._id">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <InfoCard
            :data="testInfo"
            title="Informações do Teste"
            iconSize="h-4 w-4"
            labelSize="text-base"
            valueSize="text-base"
            titleSize="text-lg"
          />
        </div>

        <h3 class="text-lg font-semibold mb-3">Fontes Utilizadas</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <InfoCard
            v-if="sources.length > 0"
            v-for="source in sources"
            :key="source._id"
            :data="sourceInfo(source)"
            :title="source.radioisotope"
            iconSize="h-4 w-4"
            labelSize="text-base"
            valueSize="text-base"
            titleSize="text-lg"
          />
          <div
            v-if="sources.length === 0 && !loading"
            class="text-gray-500 md:col-span-3"
          >
            Nenhuma fonte associada a este teste.
          </div>
        </div>

        <h3 class="text-lg font-semibold mb-3">Medições</h3>
        <div class="overflow-x-auto bg-white rounded shadow-md mb-6">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  colspan="2"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Co(57)
                </th>
                <th
                  scope="col"
                  colspan="2"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ba(133)
                </th>
                <th
                  scope="col"
                  colspan="2"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cs(137)
                </th>
              </tr>
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                ></th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Atividade (µCi)
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Precisão (%)
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Medida (µCi)
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Precisão (%)
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Medida (µCi)
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Precisão (%)
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-sm">
              <tr v-for="i in numbers" :key="i">
                <td class="px-6 py-4 whitespace-nowrap font-medium">{{ i }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ getMeasurement(test.measureCo, i) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatPrecision(getMeasurement(test.precisionCo, i)) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ getMeasurement(test.measureBa, i) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatPrecision(getMeasurement(test.precisionBa, i)) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ getMeasurement(test.measureCs, i) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatPrecision(getMeasurement(test.precisionCs, i)) }}
                </td>
              </tr>
              <tr class="bg-gray-50 font-medium">
                <td class="px-6 py-4 whitespace-nowrap">Exatidão:</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ test.accuracyCo != null ? test.accuracyCo + "%" : "N/A" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap"></td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ test.accuracyBa != null ? test.accuracyBa + "%" : "N/A" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap"></td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ test.accuracyCs != null ? test.accuracyCs + "%" : "N/A" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white p-6 rounded shadow-md">
          <h5 class="mb-3 font-medium">Resultado:</h5>
          <p class="text-sm mb-2" v-if="isSatisfactory">
            Todos os resultados apresentaram desvio menor que o estabelecido em
            norma.
          </p>
          <p class="text-sm mb-2 text-red-600" v-else>
            Os resultados apresentaram desvio maior que o estabelecido em norma.
            O teste deverá ser realizado novamente ou o equipamento deverá ser
            enviado para manutenção.
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
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import { generateDocument } from "./TestAlgorithm"; // Assuming path is correct
import Layout from "@/components/common/Layout.vue";
import InfoCard from "@/components/dashboard/facility/InfoCard.vue";

const route = useRoute();
const router = useRouter();

const numbers = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const facility = ref({});
const equipment = ref({});
const test = ref({ responsible: {} });
const sources = ref([]);
const currentUser = ref({});
const loading = ref(true);
const error = ref(null);

const equipmentId = computed(() => route.params.equipmentId);
const testId = computed(() => route.params.testId);

const equipmentTitle = computed(() => {
  if (!equipment.value.type) return "Equipamento";
  return `${equipment.value.type}`;
});

// Added for shorter breadcrumb title
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

const testInfo = computed(() => {
  return [
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

const sourceInfo = (source) => {
  return [
    {
      icon: "fa-hashtag",
      label: "Número de Série",
      value: source.serialNumber,
    },
    {
      icon: "fa-asterisk",
      label: "Atividade Inicial",
      value: source.initialActivity,
    },
    {
      icon: "fa-calendar",
      label: "Data Atividade Inicial",
      value: formatDisplayDate(source.initialActivityDate),
    },
  ];
};
const formatDisplayDate = (date) => {
  return date ? moment(date).format("DD/MM/YYYY") : "N/A";
};

const getMeasurement = (measureArray, index) => {
  const zeroBasedIndex = index - 1; // Adjust for 0-based index
  if (!measureArray) return "N/A";
  // Handle both array and comma-separated string for flexibility
  if (Array.isArray(measureArray)) {
    return measureArray[zeroBasedIndex] != null
      ? measureArray[zeroBasedIndex]
      : "N/A";
  }
  if (typeof measureArray === "string") {
    const parts = measureArray.split(",");
    return parts[zeroBasedIndex] != null ? parts[zeroBasedIndex].trim() : "N/A";
  }
  return "N/A";
};

const formatPrecision = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) ? num.toFixed(2) : "N/A";
};

const isSatisfactory = computed(() => {
  return test.value.conclusion?.toLowerCase() === "satisfatório";
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
      auth.apiUrl() +
        `equipment/doseCalibratorAccuracyAndPrecisionTests/${testId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!testResponse.data)
      throw new Error("Teste de Exatidão e Precisão não encontrado.");
    test.value = testResponse.data;

    // Populate sources
    sources.value = [];
    if (testResponse.data.sourceBa)
      sources.value.push(testResponse.data.sourceBa);
    if (testResponse.data.sourceCo)
      sources.value.push(testResponse.data.sourceCo);
    if (testResponse.data.sourceCs)
      sources.value.push(testResponse.data.sourceCs);
  } catch (err) {
    console.error("Erro ao carregar dados do teste:", err);
    error.value = err.message || "Falha ao carregar dados.";
    // Reset states
    equipment.value = {};
    facility.value = {};
    test.value = { responsible: {} };
    sources.value = [];
  } finally {
    loading.value = false;
  }
};

const excludeTest = async () => {
  if (confirm("Tem certeza que deseja excluir este teste?")) {
    try {
      // Assuming auth method exists and handles API call
      await auth.excludeDoseCalibratorAccuracyAndPrecisionTest(test.value);
      router.push(
        `/equipments/doseCalibrator/${equipmentId.value}/accuracyandprecision`
      );
    } catch (err) {
      console.error("Erro ao excluir teste:", err);
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Falha ao excluir o teste.";
    }
  }
};

const genDocument = () => {
  if (!test.value._id || !facility.value._id || !equipment.value._id) {
    error.value = "Dados incompletos para gerar o documento.";
    return;
  }
  try {
    generateDocument(test.value, facility.value, equipment.value);
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

<style>
/* Remove scoped styles as they are now handled globally or by Tailwind */
.text-red-600 {
  color: #dc2626;
} /* Tailwind red-600 */
</style>
