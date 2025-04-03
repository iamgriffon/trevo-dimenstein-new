<template>
  <Layout :title="`Exatidão e Precisão`" :loading="loading">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${route.params.id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="mx-2 text-teal-800 select-none">Exatidão e Precisão</span>
    </template>
    <div class="p-4 md:p-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-semibold mb-6 text-center">
          Novo Teste de Exatidão e de Precisão
        </h2>

        <div class="bg-white p-6 rounded shadow-md mb-6">
          <div
            v-if="error"
            class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
          >
            <FontAwesomeIcon
              :icon="['fas', 'exclamation-circle']"
              class="mr-2"
            />
            {{ error }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="testDate"
              >
                <FontAwesomeIcon :icon="['fas', 'calendar-alt']" class="mr-1" />
                Data de Execução
              </label>
              <input
                type="date"
                id="testDate"
                v-model="formData.date"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="responsible"
              >
                <FontAwesomeIcon :icon="['fas', 'user']" class="mr-1" />
                Responsável
              </label>
              <select
                id="responsible"
                v-model="formData.responsible"
                required
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              >
                <option disabled :value="{ _id: '', name: '' }">
                  Selecione o responsável
                </option>
                <option
                  v-for="option in responsibleOptions"
                  :key="option._id"
                  :value="option"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <hr class="my-6" />

          <!-- Source Selection -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
            <div class="text-right font-medium text-gray-700">
              Fonte (nº série):
            </div>
            <div>
              <label class="block text-gray-500 text-xs font-bold mb-1"
                >Co(57)</label
              >
              <select
                v-model="formData.sourceCo"
                required
                class="shadow border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline bg-white"
              >
                <option disabled :value="null">Selecione</option>
                <option
                  v-for="option in sourcesCoOptions"
                  :key="option._id"
                  :value="option"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-gray-500 text-xs font-bold mb-1"
                >Ba(133)</label
              >
              <select
                v-model="formData.sourceBa"
                required
                class="shadow border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline bg-white"
              >
                <option disabled :value="null">Selecione</option>
                <option
                  v-for="option in sourcesBaOptions"
                  :key="option._id"
                  :value="option"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-gray-500 text-xs font-bold mb-1"
                >Cs(137)</label
              >
              <select
                v-model="formData.sourceCs"
                required
                class="shadow border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline bg-white"
              >
                <option disabled :value="null">Selecione</option>
                <option
                  v-for="option in sourcesCsOptions"
                  :key="option._id"
                  :value="option"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Measurement Inputs -->
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                  >
                    #
                  </th>
                  <th
                    colspan="2"
                    class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Co(57)
                  </th>
                  <th
                    colspan="2"
                    class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ba(133)
                  </th>
                  <th
                    colspan="2"
                    class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cs(137)
                  </th>
                </tr>
                <tr>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  ></th>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Atividade (µCi)
                  </th>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Precisão (%)
                  </th>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Atividade (µCi)
                  </th>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Precisão (%)
                  </th>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Atividade (µCi)
                  </th>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Precisão (%)
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="i in numbers" :key="i">
                  <td
                    class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ i }}:
                  </td>
                  <td class="px-1 py-1">
                    <input
                      type="number"
                      v-model.number="formData.measureCo[i]"
                      @input="runCalculations"
                      class="shadow-sm border border-gray-300 rounded w-full py-1 px-2 text-sm text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td
                    class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    {{ formatPrecision(formData.precisionCo[i]) }}
                  </td>
                  <td class="px-1 py-1">
                    <input
                      type="number"
                      v-model.number="formData.measureBa[i]"
                      @input="runCalculations"
                      class="shadow-sm border border-gray-300 rounded w-full py-1 px-2 text-sm text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td
                    class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    {{ formatPrecision(formData.precisionBa[i]) }}
                  </td>
                  <td class="px-1 py-1">
                    <input
                      type="number"
                      v-model.number="formData.measureCs[i]"
                      @input="runCalculations"
                      class="shadow-sm border border-gray-300 rounded w-full py-1 px-2 text-sm text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td
                    class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    {{ formatPrecision(formData.precisionCs[i]) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td class="px-3 py-2 text-sm font-medium text-gray-900">
                    Exatidão:
                  </td>
                  <td class="px-3 py-2 text-sm text-gray-500 text-center">
                    {{
                      formData.accuracyCo != null
                        ? formData.accuracyCo + "%"
                        : ""
                    }}
                  </td>
                  <td></td>
                  <td class="px-3 py-2 text-sm text-gray-500 text-center">
                    {{
                      formData.accuracyBa != null
                        ? formData.accuracyBa + "%"
                        : ""
                    }}
                  </td>
                  <td></td>
                  <td class="px-3 py-2 text-sm text-gray-500 text-center">
                    {{
                      formData.accuracyCs != null
                        ? formData.accuracyCs + "%"
                        : ""
                    }}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="text-center">
          <button
            type="button"
            class="btn btn-success btn-block w-full md:w-auto"
            @click="finishTest"
            :disabled="loading"
          >
            {{ loading ? "Finalizando..." : "Finalizar Teste" }}
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions"; // Assuming needed for potential checks
import { testPoints, generateDocument } from "./TestAlgorithm"; // Assuming path
import Layout from "@/components/common/Layout.vue";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const error = ref("");
const equipment = ref({});
const facility = ref({});
const currentUser = ref({}); // Keep if needed

const numbers = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const responsibleOptions = ref([]);

// Source options
const sourcesCoOptions = ref([]);
const sourcesBaOptions = ref([]);
const sourcesCsOptions = ref([]);

// Use reactive for the form data
const formData = reactive({
  date: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD"),
  responsible: { _id: "", name: "" },
  sourceCo: null,
  sourceBa: null,
  sourceCs: null,
  measureCo: Array(11).fill(null), // Index 0 unused, match template loop from 1
  measureBa: Array(11).fill(null),
  measureCs: Array(11).fill(null),
  precisionCo: Array(11).fill(null),
  precisionBa: Array(11).fill(null),
  precisionCs: Array(11).fill(null),
  accuracyCo: null,
  accuracyBa: null,
  accuracyCs: null,
  conclusion: "satisfatório", // Default value
});

const equipmentId = computed(() => route.params.id);

const formatPrecision = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) ? num.toFixed(2) + "%" : "";
};

const mapSourceToOption = (source) => ({
  label: source.serialNumber,
  value: source.serialNumber, // Keep for compatibility if needed, but use object below
  _id: source._id,
  equipment: source.equipment, // Keep if needed by algorithm
  initialActivity: source.initialActivity,
  initialActivityDate: source.initialActivityDate,
  radioisotope: source.radioisotope,
  serialNumber: source.serialNumber,
});

const loadInitialData = async () => {
  loading.value = true;
  error.value = "";
  try {
    // Fetch Equipment
    const equipResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!equipResponse.data) throw new Error("Equipamento não encontrado.");
    equipment.value = equipResponse.data;

    // Fetch Facility
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

    // Fetch Sources
    const sourcesResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}/doseCalibratorSources/`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    const allSources = sourcesResponse.data || [];
    sourcesCoOptions.value = allSources
      .filter((s) => s.radioisotope === "Co(57)")
      .map(mapSourceToOption);
    sourcesBaOptions.value = allSources
      .filter((s) => s.radioisotope === "Ba(133)")
      .map(mapSourceToOption);
    sourcesCsOptions.value = allSources
      .filter((s) => s.radioisotope === "Cs(137)")
      .map(mapSourceToOption);
    // Set default source selection if options exist
    if (sourcesCoOptions.value.length > 0)
      formData.sourceCo = sourcesCoOptions.value[0];
    if (sourcesBaOptions.value.length > 0)
      formData.sourceBa = sourcesBaOptions.value[0];
    if (sourcesCsOptions.value.length > 0)
      formData.sourceCs = sourcesCsOptions.value[0];

    // Fetch Responsible Users
    const usersResponse = await axios.get(auth.apiUrl() + "users/", {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    const allUsers = usersResponse.data || [];
    responsibleOptions.value = allUsers
      .filter((user) => user.type === "rad fisico")
      .map((user) => ({ label: user.name, name: user.name, _id: user._id }));
  } catch (err) {
    console.error("Erro ao carregar dados iniciais:", err);
    error.value = err.message || "Falha ao carregar dados.";
  } finally {
    loading.value = false;
  }
};

// Function to run calculations (replaces watchers)
const runCalculations = async () => {
  // Ensure sources are selected before calculating
  if (!formData.sourceCo || !formData.sourceBa || !formData.sourceCs) {
    // Maybe show a message or just wait
    return;
  }

  try {
    const result = await testPoints({
      date: formData.date,
      sourceCo: formData.sourceCo,
      measureCo: formData.measureCo,
      accuracyCo: formData.accuracyCo, // Pass current values
      precisionCo: formData.precisionCo,
      sourceBa: formData.sourceBa,
      measureBa: formData.measureBa,
      accuracyBa: formData.accuracyBa,
      precisionBa: formData.precisionBa,
      sourceCs: formData.sourceCs,
      measureCs: formData.measureCs,
      accuracyCs: formData.accuracyCs,
      precisionCs: formData.precisionCs,
      conclusion: formData.conclusion,
      equipment: { _id: equipmentId.value },
      responsible: formData.responsible,
    });

    // Update reactive state with results
    formData.accuracyCo = result.accuracyCo;
    formData.accuracyBa = result.accuracyBa;
    formData.accuracyCs = result.accuracyCs;
    // Update precision arrays if the algorithm calculates them
    // Assuming testPoints might modify precision arrays directly or return them
    formData.precisionCo = result.precisionCo || formData.precisionCo;
    formData.precisionBa = result.precisionBa || formData.precisionBa;
    formData.precisionCs = result.precisionCs || formData.precisionCs;
    formData.conclusion = result.conclusion || formData.conclusion; // Update conclusion if calculated
  } catch (calcError) {
    console.error("Erro ao calcular pontos do teste:", calcError);
    error.value = "Erro nos cálculos do teste.";
  }
};

const finishTest = async () => {
  error.value = "";
  // Basic validation
  if (
    !formData.date ||
    !formData.responsible._id ||
    !formData.sourceCo?._id ||
    !formData.sourceBa?._id ||
    !formData.sourceCs?._id
  ) {
    error.value =
      "Por favor, preencha a data, responsável e selecione todas as fontes.";
    return;
  }
  // Check if at least one measurement was made (simple check)
  const hasMeasurements =
    formData.measureCo.slice(1).some((m) => m != null) ||
    formData.measureBa.slice(1).some((m) => m != null) ||
    formData.measureCs.slice(1).some((m) => m != null);
  if (!hasMeasurements) {
    error.value = "Por favor, insira pelo menos uma medição.";
    return;
  }

  if (!confirm("Tem certeza que deseja finalizar este teste?")) return;

  loading.value = true;

  // Ensure calculations are up-to-date before saving
  await runCalculations();
  if (error.value) {
    // Check if calculation failed
    loading.value = false;
    return;
  }

  const testPayload = {
    date: moment(formData.date).toISOString(),
    sourceCo: {
      _id: formData.sourceCo._id,
      /* include other fields if needed */ serialNumber:
        formData.sourceCo.serialNumber,
    },
    measureCo: formData.measureCo.slice(1), // Remove index 0
    accuracyCo: formData.accuracyCo,
    precisionCo: formData.precisionCo.slice(1),
    sourceBa: {
      _id: formData.sourceBa._id,
      serialNumber: formData.sourceBa.serialNumber,
    },
    measureBa: formData.measureBa.slice(1),
    accuracyBa: formData.accuracyBa,
    precisionBa: formData.precisionBa.slice(1),
    sourceCs: {
      _id: formData.sourceCs._id,
      serialNumber: formData.sourceCs.serialNumber,
    },
    measureCs: formData.measureCs.slice(1),
    accuracyCs: formData.accuracyCs,
    precisionCs: formData.precisionCs.slice(1),
    conclusion: formData.conclusion,
    equipment: { _id: equipmentId.value },
    responsible: {
      _id: formData.responsible._id,
      name: formData.responsible.name,
    },
  };

  try {
    // Generate PDF first (optional, decide flow)
    // await generateDocument(testPayload, facility.value, equipment.value);

    // Register the test data via API
    await auth.registerDoseCalibratorAccuracyAndPrecisionTest(testPayload);

    // Generate PDF after successful registration
    await generateDocument(testPayload, facility.value, equipment.value); // Call PDF generation

    router.push(
      `/equipments/doseCalibrator/${equipmentId.value}/accuracyandprecision`
    );
  } catch (err) {
    console.error("Erro ao finalizar teste:", err);
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Falha ao salvar ou gerar PDF do teste.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadInitialData();
});
</script>
