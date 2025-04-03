<!-- src/components/Login.vue -->
<template>
  <div class="p-4 md:p-8">
    <div class="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Editar Fonte</h2>

      <div v-if="fetchError" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" /> {{ fetchError }}
      </div>
      <div v-if="saveError" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" /> {{ saveError }}
      </div>

      <form @submit.prevent="update">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="radioisotope">
            <FontAwesomeIcon :icon="['fab', 'react']" class="mr-1" /> Radioisótopo
          </label>
          <select id="radioisotope" v-model="sourceData.radioisotope" required :disabled="loading" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white disabled:bg-gray-100">
            <option disabled value="">Selecione o radioisótopo</option>
            <option v-for="option in radioisotopes" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="serialNumber">
            <FontAwesomeIcon :icon="['fas', 'hashtag']" class="mr-1" /> Número de Série
          </label>
          <input type="text" id="serialNumber" v-model="sourceData.serialNumber" required :disabled="loading" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100" placeholder="Número de Série">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="initialActivity">
            <FontAwesomeIcon :icon="['fas', 'asterisk']" class="mr-1" /> Atividade Inicial (µCi)
          </label>
          <input type="number" id="initialActivity" v-model.number="sourceData.initialActivity" required step="any" :disabled="loading" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100" placeholder="Atividade Inicial">
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="initialActivityDate">
            <FontAwesomeIcon :icon="['fas', 'calendar']" class="mr-1" /> Data de Medição da Atividade Inicial
          </label>
          <input type="date" id="initialActivityDate" v-model="sourceData.initialActivityDate" required :disabled="loading" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100">
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-success btn-block w-full" :disabled="loading || !!fetchError">
            {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '@/services/authentication'; // Assuming path
// import permission from '@/services/permissions'; // Uncomment if needed

const route = useRoute();
const router = useRouter();

const facility = ref({});
const equipment = ref({});
const radioisotopes = ref(['Ba(133)', 'Co(57)', 'Cs(137)']); // Base isotopes, potentially add measured one
const sourceData = reactive({
  _id: '',
  radioisotope: '',
  serialNumber: '',
  initialActivity: null,
  initialActivityDate: '',
});
const loading = ref(false);
const fetchError = ref('');
const saveError = ref('');
const currentUser = ref({}); // Keep if needed

const equipmentId = computed(() => route.params.equipmentId);
const sourceId = computed(() => route.params.sourceId);

const loadInitialData = async () => {
  loading.value = true;
  fetchError.value = '';
  try {
    // Fetch Equipment first to potentially add measured Cs(137)
    const equipmentResponse = await axios.get(auth.apiUrl() + `equipment/${equipmentId.value}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    if (!equipmentResponse.data) throw new Error('Equipamento não encontrado.');
    equipment.value = equipmentResponse.data;

     // Add Cs(137) measured option if applicable
    if (equipment.value.mostUsedRadioisotope && !radioisotopes.value.includes(`Cs(137) medido em ${equipment.value.mostUsedRadioisotope}`)) {
        radioisotopes.value.push(`Cs(137) medido em ${equipment.value.mostUsedRadioisotope}`);
    }

    // Fetch Facility data
    if (!equipment.value.facility?._id) throw new Error('ID da Instalação não encontrado no equipamento.');
    const facilityResponse = await axios.get(auth.apiUrl() + `facility/${equipment.value.facility._id}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    if (!facilityResponse.data) throw new Error('Instalação não encontrada.');
    facility.value = facilityResponse.data;

    // Fetch Source data to edit
    const sourceResponse = await axios.get(auth.apiUrl() + `doseCalibratorSource/${sourceId.value}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    if (!sourceResponse.data) throw new Error('Fonte não encontrada.');

    // Populate reactive form data
    sourceData._id = sourceResponse.data._id;
    sourceData.radioisotope = sourceResponse.data.radioisotope;
    sourceData.serialNumber = sourceResponse.data.serialNumber;
    sourceData.initialActivity = sourceResponse.data.initialActivity;
    // Format date for the input type="date"
    sourceData.initialActivityDate = sourceResponse.data.initialActivityDate ? moment(sourceResponse.data.initialActivityDate).format('YYYY-MM-DD') : '';

  } catch (err) {
    console.error("Erro ao carregar dados para edição:", err);
    fetchError.value = err.message || 'Falha ao carregar dados da fonte.';
    // Reset dependent states
    equipment.value = {};
    facility.value = {};
  } finally {
    loading.value = false;
  }
};

const update = async () => {
  if (!sourceData.radioisotope || !sourceData.serialNumber || sourceData.initialActivity == null || !sourceData.initialActivityDate) {
      saveError.value = 'Por favor, preencha todos os campos obrigatórios.';
      return;
  }

  loading.value = true;
  saveError.value = '';

  const credentials = {
    _id: sourceData._id,
    radioisotope: sourceData.radioisotope,
    serialNumber: sourceData.serialNumber,
    initialActivity: sourceData.initialActivity,
    initialActivityDate: moment(sourceData.initialActivityDate).toISOString(), // Send ISO format
    equipment: { _id: equipmentId.value }, // Associate with the current equipment
  };

  try {
    // Assuming auth.editDoseCalibratorSource exists and handles the API call
    await auth.editDoseCalibratorSource(credentials);
    router.push(`/equipments/doseCalibrator/${equipmentId.value}`); // Navigate back on success
  } catch (err) {
    console.error("Erro ao editar fonte:", err);
    saveError.value = err.response?.data?.message || err.message || 'Falha ao salvar as alterações da fonte.';
    loading.value = false; // Stop loading only on error
  }
  // No finally block to reset loading, as successful navigation occurs
};

onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadInitialData();
});

</script>
