<!-- src/components/Login.vue -->
<template>
  <div class="p-4 md:p-8">
    <div class="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Adicionar Fonte</h2>

      <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" /> {{ error }}
      </div>

      <form @submit.prevent="register">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="radioisotope">
            <FontAwesomeIcon :icon="['fab', 'react']" class="mr-1" /> Radioisótopo
          </label>
          <select id="radioisotope" v-model="sourceData.radioisotope" required class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option disabled value="">Selecione o radioisótopo</option>
            <option v-for="option in radioisotopes" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="serialNumber">
            <FontAwesomeIcon :icon="['fas', 'hashtag']" class="mr-1" /> Número de Série
          </label>
          <input type="text" id="serialNumber" v-model="sourceData.serialNumber" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Número de Série">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="initialActivity">
            <FontAwesomeIcon :icon="['fas', 'asterisk']" class="mr-1" /> Atividade Inicial (µCi)
          </label>
          <input type="number" id="initialActivity" v-model.number="sourceData.initialActivity" required step="any" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Atividade Inicial">
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="initialActivityDate">
            <FontAwesomeIcon :icon="['fas', 'calendar']" class="mr-1" /> Data de Medição da Atividade Inicial
          </label>
          <input type="date" id="initialActivityDate" v-model="sourceData.initialActivityDate" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-success btn-block w-full" :disabled="loading">
            {{ loading ? 'Adicionando...' : 'Adicionar Fonte' }}
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '@/services/authentication'; // Assuming path based on previous edits
// import permission from '@/services/permissions'; // Uncomment if needed

const route = useRoute();
const router = useRouter();

const facility = ref({});
const equipment = ref({ mostUsedRadioisotope: '' });
const radioisotopes = ref([]);
const sourceData = reactive({
  radioisotope: '',
  serialNumber: '',
  initialActivity: null,
  initialActivityDate: '',
});
const loading = ref(false);
const error = ref('');
const currentUser = ref({}); // Keep if needed

const equipmentId = computed(() => route.params.id);

const loadInitialData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const equipmentResponse = await axios.get(auth.apiUrl() + `equipment/${equipmentId.value}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    if (!equipmentResponse.data) throw new Error('Equipamento não encontrado.');
    equipment.value = equipmentResponse.data;

    // Set radioisotope options based on equipment data
    const baseIsotopes = ['Ba(133)', 'Co(57)', 'Cs(137)'];
    if (equipment.value.mostUsedRadioisotope) {
      radioisotopes.value = [...baseIsotopes, `Cs(137) medido em ${equipment.value.mostUsedRadioisotope}`];
    } else {
      radioisotopes.value = baseIsotopes;
    }

    // Fetch facility data
    if (!equipment.value.facility?._id) throw new Error('ID da Instalação não encontrado no equipamento.');
    const facilityResponse = await axios.get(auth.apiUrl() + `facility/${equipment.value.facility._id}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    if (!facilityResponse.data) throw new Error('Instalação não encontrada.');
    facility.value = facilityResponse.data;

  } catch (err) {
    console.error("Erro ao carregar dados iniciais:", err);
    error.value = err.message || 'Falha ao carregar dados.';
    equipment.value = { mostUsedRadioisotope: '' };
    facility.value = {};
  } finally {
    loading.value = false;
  }
};

const register = async () => {
  if (!sourceData.radioisotope || !sourceData.serialNumber || sourceData.initialActivity == null || !sourceData.initialActivityDate) {
      error.value = 'Por favor, preencha todos os campos obrigatórios.';
      return;
  }

  loading.value = true;
  error.value = '';

  const credentials = {
    radioisotope: sourceData.radioisotope,
    serialNumber: sourceData.serialNumber,
    initialActivity: sourceData.initialActivity,
    initialActivityDate: sourceData.initialActivityDate,
    equipment: { _id: equipmentId.value },
  };

  try {
    // Assuming auth.registerDoseCalibratorSource exists and handles the API call
    await auth.registerDoseCalibratorSource(credentials);
    router.push(`/equipments/doseCalibrator/${equipmentId.value}`); // Navigate on success
  } catch (err) {
    console.error("Erro ao registrar fonte:", err);
    error.value = err.response?.data?.message || err.message || 'Falha ao adicionar a fonte.';
    loading.value = false; // Stop loading only on error
  }
  // No finally block to reset loading, as successful navigation occurs
};

onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadInitialData();
});

</script>
