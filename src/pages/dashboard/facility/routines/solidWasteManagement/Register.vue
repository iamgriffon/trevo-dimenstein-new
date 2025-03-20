<!-- src/components/Login.vue -->
<template>
  <Layout title="Adicionar Rejeito">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline italic font-semibold"
      >
        {{ facility.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}/routines`"
        class="text-gray-500 hover:text-teal-800 hover:underline italic font-semibold"
      >
        rotinas
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}/routines/solidwastemanagement/${year}`"
        class="text-gray-500 hover:text-teal-800 hover:underline italic font-semibold"
      >
        gerenciamento de rejeitos sólidos
      </router-link>
    </template>
    
    <template #header>
      <button
        class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
      >
        <RouterLink :to="`/facility/${facility._id}/routines/solidwastemanagement/${year}`">
          <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
        </RouterLink>
      </button>
    </template>

    <div class="flex flex-col gap-6 w-full mb-10">
      <!-- Error Alert -->
      <div 
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      >
        <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" class="mr-2" /> {{ errors }}
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-calendar-alt" class="mr-2" /> Data
            </label>
            <Input type="date" v-model="date" class="w-full" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" /> Número da Etiqueta
            </label>
            <Input type="number" v-model="tagNumber" readonly class="w-full bg-gray-100" />
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-map-marker" class="mr-2" /> Local
          </label>
          <Input v-model="localization" class="w-full" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-trash" class="mr-2" /> Tipo de Rejeito
            </label>
            <select
              v-model="wasteType"
              class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option v-for="option in wasteTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-brands fa-react" class="mr-2" /> Radioisótopo Principal
            </label>
            <select
              v-model="radioisotope"
              class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option v-for="isotope in radioisotopes" :key="isotope.value" :value="isotope">
                {{ isotope.label }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-weight" class="mr-2" /> Peso (kg)
            </label>
            <Input type="number" step="0.1" v-model="weight" class="w-full" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-radiation" class="mr-2" /> Unidade da Exposição
            </label>
            <select
              v-model="exposureUnit"
              class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="microSvPerHour">μSv/h</option>
              <option value="miliSvPerHour">mSv/h</option>
              <option value="microRPerHour">μR/h</option>
              <option value="miliRPerHour">mR/h</option>
            </select>
          </div>
          
          <div class="relative">
            <div v-if="!geigerSaturation">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                <FontAwesomeIcon icon="fa-solid fa-radiation" class="mr-2" /> Exposição ({{ getExposureUnitLabel() }})
              </label>
              <Input type="number" step="0.1" v-model="exposure" class="w-full" />
            </div>
            <div v-else class="flex items-center justify-center h-full">
              <div class="text-center text-gray-700 font-medium">
                Saturação do Detector
              </div>
            </div>
            <div class="absolute top-0 right-0">
              <label class="flex items-center text-sm text-gray-700">
                <input type="checkbox" v-model="geigerSaturation" class="mr-2">
                Saturação
              </label>
            </div>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-info-circle" class="mr-2" /> Observações
            <span class="text-sm text-gray-500 ml-1">opcional</span>
          </label>
          <textarea
            v-model="observations"
            rows="3"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          ></textarea>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Informações Calculadas</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-radiation" class="mr-2" /> Atividade (μCi)
            </label>
            <div class="p-2 bg-gray-100 rounded-md">
              {{ getActivity() }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-calendar-alt" class="mr-2" /> Previsão de Liberação (Plano de Radioproteção)
            </label>
            <div class="p-2 bg-gray-100 rounded-md">
              {{ getFormattedDate(getRadiationPlanLiberationPrevision()) }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-calendar-alt" class="mr-2" /> Previsão de Liberação (Calculada)
            </label>
            <div class="p-2 bg-gray-100 rounded-md">
              {{ getFormattedDate(getCalculatedLiberationPrevision()) }}
            </div>
          </div>
        </div>
      </div>

      <button 
        @click="register()"
        class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
      >
        Adicionar Rejeito
      </button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment-timezone';
import Layout from '@/components/common/Layout.vue';
import Input from '@/components/ui/Input.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '@/services/authentication';
import permission from '@/services/permissions';

// Router setup
const route = useRoute();
const router = useRouter();

// State variables
const now = new Date();
const formattedNow = now.getFullYear() + '-' + 
  ('0' + (now.getMonth() + 1)).slice(-2) + '-' + 
  ('0' + now.getDate()).slice(-2);

const date = ref(formattedNow);
const tagNumber = ref(route.params.tagNumber);
const localization = ref('');
const radioisotope = ref('');
const wasteType = ref('');
const weight = ref('');
const exposureUnit = ref('microSvPerHour');
const exposure = ref('');
const geigerSaturation = ref(false);
const observations = ref('');
const facility = ref({});
const year = ref(new Date().getFullYear());
const error = ref(false);
const errors = ref('');
const currentUser = ref(null);

// Options for select inputs
const wasteTypeOptions = ref([
  { label: 'Agulha', value: 'Agulha' },
  { label: 'Algodão', value: 'Algodão' },
  { label: 'Ampola', value: 'Ampola' },
  { label: 'Avental', value: 'Avental' },
  { label: 'Compressa', value: 'Compressa' },
  { label: 'Equipo', value: 'Equipo' },
  { label: 'Escalpe', value: 'Escalpe' },
  { label: 'Frasco', value: 'Frasco' },
  { label: 'Gaze', value: 'Gaze' },
  { label: 'Gerador', value: 'Gerador' },
  { label: 'Luva', value: 'Luva' },
  { label: 'Papel', value: 'Papel' },
  { label: 'Papel-Al', value: 'Papel-Al' },
  { label: 'Propé', value: 'Propé' },
  { label: 'Seringa', value: 'Seringa' },
  { label: 'Tubo', value: 'Tubo' },
  { label: 'Vial', value: 'Vial' }
]);

const radioisotopes = ref([
  { label: 'C(11)', value: 'C(11)', halfLife: 0.34, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 0.49, liberationPrevisionDays: 2 },
  { label: 'Cr(51)', value: 'Cr(51)', halfLife: 665, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 0.097, liberationPrevisionDays: 400 },
  { label: 'F(18)', value: 'F(18)', halfLife: 1.83, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 2.07, liberationPrevisionDays: 15 },
  { label: 'Ga(67)', value: 'Ga(67)', halfLife: 78.3, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 0.8, liberationPrevisionDays: 100 },
  { label: 'Ga(68)', value: 'Ga(68)', halfLife: 1.13, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 1.58, liberationPrevisionDays: 10 },
  { label: 'I(123)', value: 'I(123)', halfLife: 13.2, wasteType: 'Sólido/Líquido', CNENLimit: 0.1, bigGamma: 1.04, liberationPrevisionDays: 30 },
  { label: 'I(131)', value: 'I(131)', halfLife: 193, wasteType: 'Sólido/Líquido', CNENLimit: 0.1, bigGamma: 0.61, liberationPrevisionDays: 200 },
  { label: 'In(111)', value: 'In(111)', halfLife: 67.4, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 1.5, liberationPrevisionDays: 100 },
  { label: 'Lu(177)', value: 'Lu(177)', halfLife: 161, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 0.1, liberationPrevisionDays: 200 },
  { label: 'Mo(99)', value: 'Mo(99)', halfLife: 66.8, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 0.85, liberationPrevisionDays: 200 },
  { label: 'P(32)', value: 'P(32)', halfLife: 342, wasteType: 'Sólido/Líquido', CNENLimit: 0.1, bigGamma: 0, liberationPrevisionDays: 250 },
  { label: 'Sm(153)', value: 'Sm(153)', halfLife: 46.7, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 0.5, liberationPrevisionDays: 100 },
  { label: 'Sr(89)', value: 'Sr(89)', halfLife: 1211, wasteType: 'Sólido/Líquido', CNENLimit: 0.1, bigGamma: 0, liberationPrevisionDays: 600 },
  { label: 'Tc(99m)', value: 'Tc(99m)', halfLife: 6.02, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 0.78, liberationPrevisionDays: 30 },
  { label: 'Tl(201)', value: 'Tl(201)', halfLife: 73.1, wasteType: 'Sólido/Líquido', CNENLimit: 1, bigGamma: 0.47, liberationPrevisionDays: 100 },
  { label: 'Y(90)', value: 'Y(90)', halfLife: 64.1, wasteType: 'Sólido/Líquido', CNENLimit: 0.1, bigGamma: 0, liberationPrevisionDays: 100 }
]);

// Methods
const getExposureUnitLabel = () => {
  switch (exposureUnit.value) {
    case 'microSvPerHour':
      return 'μSv/h';
    case 'miliSvPerHour':
      return 'mSv/h';
    case 'microRPerHour':
      return 'μR/h';
    case 'miliRPerHour':
      return 'mR/h';
    default:
      return '';
  }
};

const getFormattedDate = (date) => {
  return moment(date).format('DD/MM/YYYY');
};

const addDays = (date, days) => {
  const dat = new Date(moment.tz(date, 'America/Sao_Paulo'));
  dat.setDate(dat.getDate() + days);
  return dat;
};

const getRadiationPlanLiberationPrevision = () => {
  if (!radioisotope.value || !date.value) return '';
  return addDays(date.value, radioisotope.value.liberationPrevisionDays);
};

const getActivity = () => {
  if (!radioisotope.value || geigerSaturation.value) return 'Saturação';
  if (getExposure() / (radioisotope.value.bigGamma * 3700) < 0.001) return '< 0.001';
  return (getExposure() / (radioisotope.value.bigGamma * 3700)).toFixed(3);
};

const getCalculatedLiberationPrevision = () => {
  if (!radioisotope.value || !date.value || !weight.value) return '';
  
  if (geigerSaturation.value || getActivity() === '< 0.001') {
    return addDays(date.value, radioisotope.value.liberationPrevisionDays);
  }
  
  return addDays(
    date.value, 
    -Math.log(radioisotope.value.CNENLimit / (getActivity() * 37)) * 
    (radioisotope.value.halfLife / (24 * 0.6931471806)) / weight.value
  );
};

const getExposure = () => {
  if (geigerSaturation.value) return 'Saturação';
  
  const exposureValue = parseFloat(exposure.value);
  if (isNaN(exposureValue)) return 0;
  
  switch (exposureUnit.value) {
    case 'miliSvPerHour':
      return exposureValue * 100;
    case 'microRPerHour':
      return exposureValue * 0.001;
    case 'microSvPerHour':
      return exposureValue * 0.1;
    default:
      return exposureValue;
  }
};

const register = async () => {
  error.value = false;
  
  if (!radioisotope.value) {
    error.value = true;
    errors.value = 'Selecione um radioisótopo';
    return;
  }
  
  if (!weight.value) {
    error.value = true;
    errors.value = 'Informe o peso do rejeito';
    return;
  }
  
  if (!geigerSaturation.value && !exposure.value) {
    error.value = true;
    errors.value = 'Informe a exposição ou selecione saturação';
    return;
  }
  
  try {
    const credentials = {
      date: date.value,
      tagNumber: tagNumber.value,
      radioisotope: radioisotope.value.value,
      wasteType: wasteType.value,
      weight: weight.value,
      exposure: getExposure(),
      geigerSaturation: geigerSaturation.value,
      activity: getActivity(),
      radiationPlanLiberationPrevision: getRadiationPlanLiberationPrevision(),
      calculatedLiberationPrevision: getCalculatedLiberationPrevision(),
      localization: localization.value,
      observations: observations.value,
      facility: { _id: facility.value._id }
    };
    
    await auth.registerFacilityRoutineSolidWasteManagement(
      { error, errors, router },
      credentials,
      `/facility/${facility.value._id}/routines/solidwastemanagement/${year.value}`
    );
  } catch (err) {
    error.value = true;
    errors.value = err.response?.data || 'Erro ao registrar rejeito';
  }
};

// Load facility data when component is mounted
onMounted(async () => {
  try {
    const response = await axios.get(
      `${auth.apiUrl()}facility/${route.params.id}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    
    if (response.data.length === 0) {
      errors.value = 'Nenhum resultado encontrado';
      facility.value = '';
      return;
    }
    
    facility.value = response.data;
    currentUser.value = auth.currentUser();
    
  } catch (err) {
    error.value = true;
    errors.value = err.data || 'Erro ao carregar instalação';
    facility.value = '';
  }
});
</script>

<style>
.geiger-saturation-container {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
