<template>
  <Layout :loading="loadingInitialData">
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-semibold">Editar Teste de Reprodutibilidade</h1>
        <Button
          @click="handleDelete"
          variant="danger-outline"
          :disabled="loading || deleting"
          size="sm"
        >
          <FontAwesomeIcon
            v-if="deleting"
            :icon="['fas', 'spinner']"
            spin
            class="mr-2"
          />
          <FontAwesomeIcon v-else :icon="['fas', 'trash-alt']" class="mr-2" />
          Excluir
        </Button>
      </div>
      <!-- Breadcrumbs can be added here if needed -->
    </template>

    <div
      v-if="initialLoadingError"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
      role="alert"
    >
      <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
      <span>Falha ao carregar dados do teste: {{ initialLoadingError }}</span>
    </div>

    <form v-else @submit.prevent="handleUpdate">
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
        role="alert"
      >
        <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
        <span>{{ error }}</span>
      </div>

      <!-- Test Setup Card -->
      <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Configuração do Teste
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Sonda do Teste"
            v-model="formData.probe"
            :options="probeOptions"
            required
            :icon="['fas', 'wave-square']"
          />
          <Select
            label="Escala"
            v-model="formData.scale"
            :options="scaleOptions"
            :disabled="!formData.probe"
            required
            :icon="['fas', 'ruler-combined']"
          />
          <Input
            type="date"
            label="Data"
            v-model="formData.date"
            required
            :icon="['fas', 'calendar-alt']"
          />
          <Select
            label="Mês"
            v-model="formData.month"
            :options="monthOptions"
            required
            :icon="['fas', 'calendar-alt']"
          />
          <Select
            label="Responsável"
            v-model="formData.responsible"
            :options="responsibleOptions"
            required
            :icon="['fas', 'user']"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 border-t pt-4">
          <Input
            label="Fonte de Material Radioativo"
            v-model="formData.radioactiveSource"
            placeholder="Ex: Cs-137"
            optional
            :icon="['fab', 'react']"
          />
          <Input
            label="Nº Série da Fonte"
            v-model="formData.radioactiveSourceSerialNumber"
            placeholder="Número de série da fonte"
            optional
            :icon="['fas', 'hashtag']"
          />
        </div>
      </div>

      <!-- Observation Type Card -->
      <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Tipo de Observação
        </h3>
        <RadioGroup
          v-model="formData.observationType"
          :options="observationTypeOptions"
          name="observationType"
          required
        />
        <div
          v-if="formData.observationType && formData.observationType !== 'ok'"
          class="mt-4"
        >
          <Input
            type="textarea"
            label="Observação Adicional (Calibração/Manutenção)"
            v-model="formData.observationText"
            :maxlength="40"
            placeholder="Descreva brevemente o motivo (max 40 caracteres)"
          />
        </div>
      </div>

      <!-- Measurements Card (Conditional) -->
      <div
        v-if="formData.observationType === 'ok'"
        class="bg-white shadow rounded-lg p-4 md:p-6 mb-6"
      >
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Medidas ({{ formData.scale || "" }})
        </h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          <div v-for="i in 10" :key="i">
            <Input
              :label="`Leitura ${i}`"
              type="number"
              step="any"
              v-model.number="formData.measures[i]"
              required
            />
          </div>
        </div>
        <!-- Calculated Results -->
        <div
          class="mt-6 border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
        >
          <div>
            <span class="font-semibold text-gray-600 block">Média:</span>
            <span class="text-gray-800">{{ averageVal.toFixed(4) }}</span>
          </div>
          <div>
            <span class="font-semibold text-gray-600 block"
              >Desvio Padrão:</span
            >
            <span class="text-gray-800">{{
              standardDeviationVal.toFixed(4)
            }}</span>
          </div>
          <div>
            <span class="font-semibold text-gray-600 block"
              >Coef. Variação (%):</span
            >
            <span class="text-gray-800"
              >{{ variationPercentage.toFixed(2) }} %</span
            >
          </div>
          <div>
            <span class="font-semibold text-gray-600 block">Resultado:</span>
            <span
              :class="[
                'font-bold',
                conclusion === 'satisfatório'
                  ? 'text-green-600'
                  : 'text-red-600',
              ]"
              >{{ conclusion }}</span
            >
          </div>
        </div>
      </div>

      <!-- Final Observations Card -->
      <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Observações Finais
        </h3>
        <Checkbox
          v-model="formData.observationBug"
          label="Equipamento apresentou algum defeito durante o teste?"
        />
        <div v-if="formData.observationBug" class="mt-4">
          <Input
            type="textarea"
            label="Descrição do Defeito"
            v-model="formData.observations"
            :maxlength="75"
            placeholder="Descreva o defeito apresentado (max 75 caracteres)"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-8">
        <Button
          type="submit"
          variant="success"
          size="lg"
          :disabled="loading || loadingInitialData"
        >
          <FontAwesomeIcon
            v-if="loading"
            :icon="['fas', 'spinner']"
            spin
            class="mr-2"
          />
          Salvar Alterações
        </Button>
      </div>
    </form>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";

import Select from "@/components/ui/Select.vue";
import Button from "@/components/ui/Button.vue";
import RadioGroup from "@/components/ui/RadioGroup.vue"; // Assuming component exists
import Checkbox from "@/components/ui/Checkbox.vue";
import { api } from "@/services/api";

const route = useRoute();
const router = useRouter();

// --- State ---
const equipment = ref({});
const facility = ref({});
const users = ref([]); // For responsible options
const loading = ref(false); // For update/delete actions
const deleting = ref(false);
const loadingInitialData = ref(true);
const initialLoadingError = ref("");
const error = ref(""); // For update/delete errors
const currentUser = ref(auth.currentUser() || {});

const equipmentId = computed(() => route.params.id);
const testId = computed(() => route.params.testId);

const formData = reactive({
  _id: null, // Store test ID
  date: "",
  month: "",
  probe: "",
  scale: "",
  responsible: null, // Store responsible user object { value: id, label: name }
  radioactiveSource: "",
  radioactiveSourceSerialNumber: "",
  observationType: "ok",
  observationText: "",
  measures: reactive(Array(11).fill(null)),
  observationBug: false,
  observations: "",
});

// --- Options ---
const monthOptions = moment
  .months()
  .map((m) => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }));
const probeOptions = ref([]);
const scaleOptions = ref([]);
const responsibleOptions = ref([]);
const observationTypeOptions = ref([
  { value: "ok", label: "Teste Realizado" },
  { value: "calibration", label: "Equipamento enviado para calibração" },
  { value: "maintenance", label: "Equipamento enviado para manutenção" },
]);

// --- Computed Properties (Same as Register.vue) ---
const averageVal = computed(() => {
  if (formData.observationType !== "ok") return 0;
  const validMeasures = formData.measures
    .slice(1)
    .filter((m) => m !== null && !isNaN(m));
  if (validMeasures.length === 0) return 0;
  const sum = validMeasures.reduce((acc, val) => acc + Number(val), 0);
  return sum / validMeasures.length;
});

const standardDeviationVal = computed(() => {
  if (formData.observationType !== "ok") return 0;
  const validMeasures = formData.measures
    .slice(1)
    .filter((m) => m !== null && !isNaN(m));
  const n = validMeasures.length;
  if (n < 2) return 0;
  const mean = averageVal.value;
  const variance =
    validMeasures.reduce(
      (acc, val) => acc + Math.pow(Number(val) - mean, 2),
      0
    ) /
    (n - 1);
  return Math.sqrt(variance);
});

const variationPercentage = computed(() => {
  if (formData.observationType !== "ok" || averageVal.value === 0) return 0;
  return (standardDeviationVal.value / averageVal.value) * 100;
});

const conclusion = computed(() => {
  if (formData.observationType !== "ok") {
    // Map observation type to a conclusion string if needed
    if (formData.observationType === "calibration")
      return "Calibração Pendente";
    if (formData.observationType === "maintenance")
      return "Manutenção Pendente";
    return "N/A";
  }
  return variationPercentage.value <= 20 ? "satisfatório" : "insatisfatório";
});

// --- Watchers ---
watch(
  () => formData.probe,
  (newProbe) => {
    if (scaleOptions.value.length > 0) {
      formData.scale = "";
    }
    updateScaleOptions(newProbe);
  }
);

watch(
  () => formData.date,
  (newDate) => {
    if (newDate) {
      formData.month = moment(newDate).format("MMMM").toLowerCase();
    }
  }
);

// --- Methods ---

const updateScaleOptions = (probe) => {
  if (probe === "Exposição") {
    scaleOptions.value = ["mR/h", "µR/h", "mSv/h", "µSv/h"].map((s) => ({
      value: s,
      label: s,
    }));
  } else if (probe === "Contaminação") {
    scaleOptions.value = ["CPM", "KCPM"].map((s) => ({ value: s, label: s }));
  } else {
    scaleOptions.value = [];
  }
};

const loadResponsibleOptions = async () => {
  try {
    const usersResponse = await api.get("users/", {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
      params: {
        "filters[type][$in][]": ["administrador", "rad fiscal", "rad fisico"],
      },
    });
    users.value = usersResponse.data.list || usersResponse.data || [];
    responsibleOptions.value = users.value.map((user) => ({
      value: user._id,
      label: user.name,
    }));
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
    initialLoadingError.value =
      (initialLoadingError.value ? initialLoadingError.value + "; " : "") +
      "Falha ao carregar usuários.";
  }
};

const loadTestData = async () => {
  if (!testId.value || !equipmentId.value) {
    initialLoadingError.value =
      "IDs do equipamento ou teste não encontrados na rota.";
    loadingInitialData.value = false;
    return;
  }
  loadingInitialData.value = true;
  initialLoadingError.value = "";
  try {
    // Fetch Test Data
    const testResponse = await axios.get(
      auth.apiUrl() +
        `equipment/${equipmentId.value}/geigerCounterReproductibilityTest/${testId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    const testData = testResponse.data;

    // Populate formData
    formData._id = testData._id;
    formData.date = moment(testData.date).format("YYYY-MM-DD");
    formData.month = testData.month;
    formData.probe = testData.probe;
    formData.scale = testData.scale;
    formData.radioactiveSource = testData.radioactiveSource || "";
    formData.radioactiveSourceSerialNumber =
      testData.radioactiveSourceSerialNumber || "";
    formData.observationType = testData.observationType || "ok";
    formData.observationText = testData.observationText || "";
    formData.observationBug = testData.observationBug || false;
    formData.observations = testData.observations || "";

    // Ensure measures array has correct length and populate
    const fetchedMeasures = testData.measures || [];
    for (let i = 1; i <= 10; i++) {
      formData.measures[i] = fetchedMeasures[i] ?? null;
    }

    // Set responsible person object
    if (testData.responsible?._id && responsibleOptions.value.length > 0) {
      const respOption = responsibleOptions.value.find(
        (opt) => opt.value === testData.responsible._id
      );
      formData.responsible = respOption || null;
    } else if (testData.responsible?._id) {
      // If options weren't loaded yet, store temporary data
      formData.responsible = {
        value: testData.responsible._id,
        label: testData.responsible.name || testData.responsible._id,
      };
    }

    // Fetch Equipment & Facility (can run in parallel maybe)
    const equipResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    equipment.value = equipResponse.data;

    if (equipment.value.probe === "Exposição e Contaminação") {
      probeOptions.value = ["Exposição", "Contaminação"].map((p) => ({
        value: p,
        label: p,
      }));
    } else if (equipment.value.probe) {
      probeOptions.value = [
        { value: equipment.value.probe, label: equipment.value.probe },
      ];
    }
    // Update scale options based on loaded probe
    updateScaleOptions(formData.probe);
    // Re-ensure scale value is valid if options changed
    if (!scaleOptions.value.some((opt) => opt.value === formData.scale)) {
      // Keep the loaded scale even if not in default options, or clear it:
      // formData.scale = '';
    }

    if (equipment.value?.facility?._id) {
      const facResponse = await axios.get(
        auth.apiUrl() + `facility/${equipment.value.facility._id}`,
        {
          headers: { Authorization: `Bearer ${auth.getToken()}` },
        }
      );
      facility.value = facResponse.data;
    }

    // Re-check responsible if options loaded after test data
    if (
      formData.responsible?.value &&
      !responsibleOptions.value.some(
        (opt) => opt.value === formData.responsible.value
      )
    ) {
      const respOption = responsibleOptions.value.find(
        (opt) => opt.value === formData.responsible.value
      );
      formData.responsible = respOption || null; // Assign if found, otherwise clear/handle
    }
  } catch (err) {
    console.error("Erro ao carregar dados do teste:", err);
    initialLoadingError.value =
      err.response?.data?.message || "Falha ao buscar dados do teste.";
  } finally {
    loadingInitialData.value = false;
  }
};

const handleUpdate = async () => {
  loading.value = true;
  error.value = "";

  // Basic Validations (similar to register)
  if (
    !formData.probe ||
    !formData.scale ||
    !formData.date ||
    !formData.month ||
    !formData.responsible
  ) {
    error.value =
      "Preencha todos os campos obrigatórios da configuração do teste.";
    loading.value = false;
    return;
  }
  if (formData.observationType === "ok") {
    const hasAllMeasures = formData.measures
      .slice(1)
      .every((m) => m !== null && !isNaN(m));
    if (!hasAllMeasures) {
      error.value = "Preencha todas as 10 medidas para realizar o teste.";
      loading.value = false;
      return;
    }
  }

  const payload = {
    date: moment(formData.date).toISOString(),
    month: formData.month,
    probe: formData.probe,
    scale: formData.scale,
    responsible: {
      _id: formData.responsible.value,
      name: formData.responsible.label,
    },
    radioactiveSource: formData.radioactiveSource,
    radioactiveSourceSerialNumber: formData.radioactiveSourceSerialNumber,
    observationType: formData.observationType,
    observationText:
      formData.observationType !== "ok" ? formData.observationText : "",
    measures: formData.observationType === "ok" ? formData.measures : [],
    media: formData.observationType === "ok" ? averageVal.value : null,
    desvioPadrao:
      formData.observationType === "ok" ? standardDeviationVal.value : null,
    coeficienteVariacao:
      formData.observationType === "ok" ? variationPercentage.value : null,
    conclusion: conclusion.value, // Use computed conclusion
    observationBug: formData.observationBug,
    observations: formData.observationBug ? formData.observations : "",
    equipment: equipmentId.value, // Keep equipment ID
  };

  try {
    await axios.put(
      auth.apiUrl() +
        `equipment/${equipmentId.value}/geigerCounterReproductibilityTest/${testId.value}`,
      payload,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    // Redirect on success
    router.push({
      name: "GeigerReproductibilityList",
      params: { id: equipmentId.value },
    });
  } catch (err) {
    console.error("Erro ao atualizar teste:", err);
    error.value =
      err.response?.data?.message || "Falha ao salvar as alterações.";
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  if (
    !confirm(
      "Tem certeza que deseja excluir este teste de reprodutibilidade? Esta ação não pode ser desfeita."
    )
  ) {
    return;
  }
  deleting.value = true;
  error.value = "";
  try {
    await axios.delete(
      auth.apiUrl() +
        `equipment/${equipmentId.value}/geigerCounterReproductibilityTest/${testId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    // Redirect after successful deletion
    router.push({
      name: "GeigerReproductibilityList",
      params: { id: equipmentId.value },
    });
  } catch (err) {
    console.error("Erro ao excluir teste:", err);
    error.value = err.response?.data?.message || "Falha ao excluir o teste.";
    deleting.value = false;
  }
  // No finally block needed for deleting state if redirecting on success
};

// --- Lifecycle Hook ---
onMounted(async () => {
  // Load responsible options first as they are needed to correctly populate the form later
  await loadResponsibleOptions();
  await loadTestData();
});
</script>
