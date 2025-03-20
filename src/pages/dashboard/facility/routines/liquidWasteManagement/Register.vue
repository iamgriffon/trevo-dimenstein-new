<!-- src/components/Login.vue -->
<template>
  <Layout title="Adicionar Rejeito Líquido">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}/routines`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        Rotinas
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}/routines/liquidwastemanagement/${year}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        Gerenciamento de Rejeitos Líquidos
      </router-link>
    </template>
    
    <template #header>
      <button
        class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
      >
        <RouterLink :to="`/facility/${facility._id}/routines/liquidwastemanagement/${year}`">
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
              <FontAwesomeIcon icon="fa-solid fa-calendar-alt" class="mr-2" /> Data
            </label>
            <Input type="date" v-model:modelValue="date" class="w-full" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-map-marker" class="mr-2" /> Local
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input v-model="localization" placeholder="Local" class="w-full" />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-brands fa-react" class="mr-2" /> Radioisótopo
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-dot-circle" class="mr-2" /> Volume do Rejeito (ml)
            </label>
            <Input type="number" v-model="volume" class="w-full" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-asterisk" class="mr-2" /> Atividade (mCi)
            </label>
            <Input v-model="activity" class="w-full" />
          </div>
        </div>
      </div>

      <button 
        @click="register()"
        class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
      >
        Adicionar Movimentação
      </button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment-timezone';
import Layout from '@/components/common/Layout.vue';
import Input from '@/components/ui/Input.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '@/services/authentication';
import permission from '@/services/permissions';

const route = useRoute();
const router = useRouter();

const now = new Date();
const thisYear = now.getFullYear();

const date = ref(moment().format('DD/MM/YYYY'));
const year = ref(thisYear);
const facility = ref({});
const radioisotope = ref('');
const localization = ref('');
const volume = ref('');
const activity = ref('');
const responsible = ref({ name: auth.currentUser().name, _id: auth.currentUser().id });
const error = ref(false);
const errors = ref('');

const radioisotopes = ref([
  {label: 'Cr(51)', value: 'Cr(51)', halfLife: 667.2, liberationPlanLiberationPrevision: 630, CNENLimit: 9.3},
  {label: 'F(18)', value: 'F(18)', halfLife: 1.83, liberationPlanLiberationPrevision: 3, CNENLimit: 13},
  {label: 'Ga(67)', value: 'Ga(67)', halfLife: 78, liberationPlanLiberationPrevision: 120, CNENLimit: 1.9},
  {label: 'Ga(68)', value: 'Ga(68)', halfLife: 1.13, liberationPlanLiberationPrevision: 3, CNENLimit: 3.7},
  {label: 'I(123)', value: 'I(123)', halfLife: 13.2, liberationPlanLiberationPrevision: 20, CNENLimit: 1.9},
  {label: 'I(131)', value: 'I(131)', halfLife: 193, liberationPlanLiberationPrevision: 310, CNENLimit: 0.019},
  {label: 'In(111)', value: 'In(111)', halfLife: 67.2, liberationPlanLiberationPrevision: 120, CNENLimit: 1.1},
  {label: 'Lu(177)', value: 'Lu(177)', halfLife: 162, liberationPlanLiberationPrevision: 270, CNENLimit: 0.74},
  {label: 'Ra(233)', value: 'Ra(233)', halfLife: 274, liberationPlanLiberationPrevision: 380, CNENLimit: 0.0019},
  {label: 'Sm(153)', value: 'Sm(153)', halfLife: 46.3, liberationPlanLiberationPrevision: 120, CNENLimit: 0.56},
  {label: 'Tc(99m)', value: 'Tc(99m)', halfLife: 6.02, liberationPlanLiberationPrevision: 20, CNENLimit: 1900},
  {label: 'Tl(201)', value: 'Tl(201)', halfLife: 72.91, liberationPlanLiberationPrevision: 120, CNENLimit: 3.7}
]);

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
  } catch (err) {
    errors.value = err.data;
    facility.value = '';
  }
});

const addDays = (date, days) => {
  const dat = new Date(moment.tz(date, 'America/Sao_Paulo'));
  dat.setDate(dat.getDate() + days);
  return dat;
};

const sumString = (string) => {
  const array = string.toString().split('+');
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += parseFloat(array[i]);
  }
  return sum.toString();
};

const getRadiationPlanLiberationPrevision = () => {
  return addDays(date.value, radioisotope.value.liberationPlanLiberationPrevision);
};

const getCalculatedLiberationPrevision = () => {
  return addDays(
    date.value, 
    -Math.log(
      (radioisotope.value.CNENLimit * volume.value * 0.000001) / 
      (parseFloat(sumString(activity.value)) * 37)
    ) * (radioisotope.value.halfLife / (24 * 0.6931471806))
  );
};

const register = async () => {
  error.value = false;
  
  try {
    const credentials = {
      date: date.value,
      radioisotope: radioisotope.value.value,
      activity: sumString(activity.value),
      localization: localization.value,
      volume: volume.value,
      radiationPlanLiberationPrevision: getRadiationPlanLiberationPrevision(),
      calculatedLiberationPrevision: getCalculatedLiberationPrevision(),
      responsibleForClosing: responsible.value,
      facility: { _id: facility.value._id }
    };
    
    await auth.registerFacilityRoutineLiquidWasteManagement(
      { error, errors, router },
      credentials,
      `/facility/${facility.value._id}/routines/liquidwastemanagement/${year.value}`
    );
  } catch (err) {
    error.value = true;
    errors.value = err.response?.data || 'Erro ao registrar rejeito líquido';
  }
};
</script>
