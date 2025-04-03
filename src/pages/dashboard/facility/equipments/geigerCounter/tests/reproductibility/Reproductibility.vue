<template>
  <Layout :title="pageTitle" :loading="loading">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}`"
        class="px-2 text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name || "Instalação" }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/equipments/geigerCounter/${equipmentId}`"
        class="px-2 text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ pageTitle }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800 select-none">Reprodutibilidade</span>
    </template>
    <template #header>
      <div class="flex space-x-2">
        <router-link
          :to="`/equipments/geigerCounter/${equipmentId}/reproductibility/${testId}/edit`"
          class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
          v-if="permission.canEdit(currentUser, auth.currentUser())"
        >
          <FontAwesomeIcon icon="fa-solid fa-edit" class="md:mr-2" />
          <span class="hidden md:inline">Editar</span>
        </router-link>
        <Button
          @click="handleDelete"
          variant="danger-outline"
          :disabled="deleting"
          v-if="permission.canExcludeDocuments(currentUser)"
        >
          <FontAwesomeIcon
            v-if="deleting"
            :icon="['fas', 'spinner']"
            spin
            class="md:mr-2"
          />
          <FontAwesomeIcon
            v-else
            :icon="['fas', 'trash-alt']"
            class="md:mr-2"
          />
          <span class="hidden md:inline">Excluir</span>
        </Button>
      </div>
    </template>

    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
      role="alert"
    >
      <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
      <span>{{ error }}</span>
    </div>

    <div v-else class="space-y-6">
      <div class="bg-white shadow rounded-lg p-4 md:p-6">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Informações do Teste
        </h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm"
        >
          <InfoItem icon="calendar-alt" label="Data">{{
            formattedTestDate
          }}</InfoItem>
          <InfoItem icon="calendar-alt" label="Mês">{{
            testData.month
          }}</InfoItem>
          <InfoItem icon="wave-square" label="Sonda">{{
            testData.probe
          }}</InfoItem>
          <InfoItem icon="ruler-combined" label="Escala">{{
            testData.scale
          }}</InfoItem>
          <InfoItem v-if="testData.radioactiveSource" icon="atom" label="Fonte">
            {{ testData.radioactiveSource }}
            {{
              testData.radioactiveSourceSerialNumber
                ? `(S/N: ${testData.radioactiveSourceSerialNumber})`
                : ""
            }}
          </InfoItem>
          <InfoItem icon="user" label="Responsável">{{
            testData.responsible?.name || "-"
          }}</InfoItem>
        </div>
      </div>

      <!-- Measurements Table -->
      <div
        v-if="
          testData.observationType === 'ok' && testData.measures?.length > 1
        "
        class="bg-white shadow rounded-lg p-4 md:p-6"
      >
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Medidas Registradas
        </h3>
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3">Leitura #</th>
              <th scope="col" class="px-6 py-3">
                Valor ({{ testData.scale }})
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="i in 10"
              :key="i"
              class="bg-white border-b hover:bg-gray-50"
            >
              <td class="px-6 py-4 font-medium text-gray-900">{{ i }}</td>
              <td class="px-6 py-4">{{ testData.measures[i] ?? "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-else-if="testData.observationType !== 'ok'"
        class="bg-white shadow rounded-lg p-4 md:p-6"
      >
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Observação Registrada
        </h3>
        <p class="text-gray-700">Tipo: {{ observationTypeLabel }}</p>
        <p v-if="testData.observationText" class="mt-2 text-gray-600 italic">
          "{{ testData.observationText }}"
        </p>
      </div>

      <!-- Results Card -->
      <div class="bg-white shadow rounded-lg p-4 md:p-6">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Resultados e Conclusão
        </h3>
        <div
          v-if="testData.observationType === 'ok'"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm"
        >
          <InfoItem icon="calculator" label="Média">{{
            calculatedAverage.toFixed(4)
          }}</InfoItem>
          <InfoItem icon="chart-line" label="Desvio Padrão">{{
            calculatedStdDev.toFixed(4)
          }}</InfoItem>
          <InfoItem icon="percent" label="Coef. Variação"
            >{{ calculatedVariation.toFixed(2) }} %</InfoItem
          >
        </div>
        <div class="mt-4 pt-4 border-t">
          <p class="text-sm font-semibold mb-1">Conclusão:</p>
          <p
            class="text-lg font-bold mb-2"
            :class="
              testData.conclusion === 'satisfatório'
                ? 'text-green-600'
                : 'text-red-600'
            "
          >
            {{ testData.conclusion || "N/A" }}
          </p>
          <p class="text-xs text-gray-600">{{ conclusionText }}</p>
        </div>
      </div>

      <!-- Final Observations Card -->
      <div
        v-if="testData.observations"
        class="bg-white shadow rounded-lg p-4 md:p-6"
      >
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Observações Adicionais
        </h3>
        <p class="text-gray-700 italic">"{{ testData.observations }}"</p>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Button from "@/components/ui/Button.vue";
import InfoItem from "@/components/InfoItem.vue";

const route = useRoute();
const router = useRouter();

// --- State ---
const equipment = ref({});
const facility = ref({});
const testData = ref({});
const loading = ref(true);
const deleting = ref(false);
const error = ref("");
const currentUser = ref(auth.currentUser() || {});

// --- Computed Properties ---
const equipmentId = computed(() => route.params.id || route.params.equipmentId);
const testId = computed(() => route.params.testId);

const pageTitle = computed(() => {
  if (!equipment.value.type) return "Equipamento";
  const patrimonial = equipment.value.patrimonialNumber || "";
  const serial = equipment.value.serialNumber || "";
  const separator = patrimonial && serial ? " - " : "";
  return `${equipment.value.type} ${patrimonial}${separator}${serial}`.trim();
});

const formattedTestDate = computed(() => {
  return testData.value.date
    ? moment(testData.value.date).format("DD/MM/YYYY")
    : "-";
});

const calculatedAverage = computed(() => {
  if (testData.value.observationType !== "ok" || !testData.value.measures)
    return 0;
  const validMeasures = testData.value.measures
    .slice(1)
    .filter((m) => m !== null && !isNaN(m));
  if (validMeasures.length === 0) return 0;
  const sum = validMeasures.reduce((acc, val) => acc + Number(val), 0);
  return sum / validMeasures.length;
});

const calculatedStdDev = computed(() => {
  if (testData.value.observationType !== "ok" || !testData.value.measures)
    return 0;
  const validMeasures = testData.value.measures
    .slice(1)
    .filter((m) => m !== null && !isNaN(m));
  const n = validMeasures.length;
  if (n < 2) return 0;
  const mean = calculatedAverage.value;
  const variance =
    validMeasures.reduce(
      (acc, val) => acc + Math.pow(Number(val) - mean, 2),
      0
    ) /
    (n - 1);
  return Math.sqrt(variance);
});

const calculatedVariation = computed(() => {
  if (testData.value.observationType !== "ok" || calculatedAverage.value === 0)
    return 0;
  return (calculatedStdDev.value / calculatedAverage.value) * 100;
});

const conclusionText = computed(() => {
  if (!testData.value.conclusion) return "";
  if (testData.value.conclusion === "satisfatório") {
    return "Todos os resultados apresentaram desvio menor ou igual a 20%, conforme estabelecido em norma.";
  } else if (testData.value.conclusion === "insatisfatório") {
    return "Os resultados apresentaram desvio maior que 20%. O equipamento deverá ser enviado para manutenção e/ou calibração.";
  } else {
    return `Status: ${testData.value.conclusion}`;
  }
});

const observationTypeLabel = computed(() => {
  if (testData.value.observationType === "calibration")
    return "Equipamento enviado para calibração";
  if (testData.value.observationType === "maintenance")
    return "Equipamento enviado para manutenção";
  return testData.value.observationType;
});

// --- Methods ---
const loadAllData = async () => {
  if (!equipmentId.value || !testId.value) {
    error.value = "ID do Equipamento ou Teste não encontrado na URL.";
    loading.value = false;
    return;
  }
  loading.value = true;
  error.value = "";
  try {
    const testPromise = axios.get(
      auth.apiUrl() +
        `equipment/geigerCounterReproductibilityTests/${testId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    const equipmentPromise = axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );

    const [testResponse, equipmentResponse] = await Promise.all([
      testPromise,
      equipmentPromise,
    ]);

    testData.value = testResponse.data;
    equipment.value = equipmentResponse.data;

    if (equipment.value.facility?._id) {
      const facilityResponse = await axios.get(
        auth.apiUrl() + `facility/${equipment.value?.facility?._id}`,
        {
          headers: { Authorization: `Bearer ${auth.getToken()}` },
        }
      );
      facility.value = facilityResponse.data;
    }
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    error.value =
      err.response?.data?.message || "Falha ao carregar os dados necessários.";
    testData.value = {};
    equipment.value = {};
    facility.value = {};
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  if (
    !confirm(
      "Tem certeza que deseja excluir este teste? Esta ação não pode ser desfeita."
    )
  ) {
    return;
  }
  deleting.value = true;
  error.value = "";
  try {
    await axios.delete(
      auth.apiUrl() +
        `equipment/geigerCounterReproductibilityTests/${testId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    router.push(
      `/equipments/geigerCounter/${equipmentId.value}/reproductibility`
    );
  } catch (err) {
    console.error("Erro ao excluir teste:", err);
    error.value = err.response?.data?.message || "Falha ao excluir o teste.";
    deleting.value = false;
  }
};

// --- Lifecycle Hook ---
onMounted(() => {
  loadAllData();
});
</script>

<style scoped>
[data-letters-list]:before {
  content: attr(data-letters-list);
  display: inline-block;
  font-size: 1em;
  width: 3em;
  height: 3em;
  line-height: 3em;
  text-align: center;
  border-radius: 50%;
  background: #00a767;
  vertical-align: middle;
  margin-right: 1em;
  color: white;
}

.fa {
  width: 14px;
  height: 14px;
}
</style>
