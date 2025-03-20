<!-- src/components/Login.vue -->
<template>
  <Layout title="Editar Movimentação">
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
        :to="`/facility/${facility._id}/routines/radioactivematerialmov`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        Movimentação de Material Radioativo
      </router-link>
    </template>
    
    <template #header>
      <div class="flex gap-2">
        <button
          class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
        >
          <RouterLink :to="`/facility/${facility._id}/routines/radioactivematerialmov`">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
          </RouterLink>
        </button>
        
        <button 
          v-if="permission.canExcludeFacility(currentUser)"
          @click="exclude()"
          class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-300 px-4 py-2 rounded-md transition-colors duration-300"
        >
          <FontAwesomeIcon icon="fa-regular fa-trash-alt" class="mr-2" /> Excluir
        </button>
      </div>
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
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-regular fa-calendar-alt" class="mr-2" /> Data de Entrega
          </label>
          <Input type="date" v-model="date" class="w-full" />
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
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-brands fa-react" class="mr-2" /> Unidade da Atividade Inicial/Eluição
          </label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input type="radio" name="activitiesUnit" value="mCi" v-model="activitiesUnit" class="mr-2">
              mCi
            </label>
            <label class="flex items-center">
              <input type="radio" name="activitiesUnit" value="MBq" v-model="activitiesUnit" class="mr-2">
              MBq
            </label>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-dot-circle" class="mr-2" />
              <span v-if="radioisotope === 'Tc(99m)' || radioisotope === 'Ga(68)'">
                Atividade da Eluição ({{ activitiesUnit }})
              </span>
              <span v-else>
                Atividade Inicial ({{ activitiesUnit }})
              </span>
            </label>
            <Input v-model="initialActivity" class="w-full" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-circle" class="mr-2" />
              <span v-if="radioisotope === 'Tc(99m)' || radioisotope === 'Ga(68)'">
                Atividade de Marcação (mCi)
              </span>
              <span v-else>
                Atividade de Uso (mCi)
              </span>
            </label>
            <Input v-model="usageActivity" class="w-full" />
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-th-large" class="mr-2" /> Número de Pacientes
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input type="number" v-model="numberOfDoses" class="w-full" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" /> Lote
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input v-model="lot" class="w-full" />
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-calendar-alt" class="mr-2" /> Validade
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input type="date" v-model="validity" class="w-full" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-clock" class="mr-2" /> Período de uso (horas)
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input type="number" v-model="usagePeriod" class="w-full" />
          </div>
        </div>
        
        <div class="mb-4 mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-trash" class="mr-2" /> Tipo de Rejeito
            <span class="text-sm text-gray-500 ml-1">opcional</span>
          </label>
          <Input v-model="wasteType" class="w-full" />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-hospital" class="mr-2" /> Uso
            <span class="text-sm text-gray-500 ml-1">opcional</span>
          </label>
          <Input v-model="usage" class="w-full" />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Observações
            <span class="text-sm text-gray-500 ml-1">opcional</span>
          </label>
          <textarea
            v-model="observations"
            rows="5"
            class="w-full p-2 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
          ></textarea>
        </div>
      </div>

      <button 
        @click="edit()"
        class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
      >
        Salvar Alterações
      </button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { format, parseISO, addDays as fnAddDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Layout from '@/components/common/Layout.vue';
import Input from '@/components/ui/Input.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '@/services/authentication';
import permission from '@/services/permissions';
import { radioisotopes as radioisotopesData } from '../isotopes';
const route = useRoute();
const router = useRouter();

// State variables
const date = ref('');
const facility = ref({});
const equipment = ref({});
const radioisotope = ref('');
const activitiesUnit = ref('mCi');
const initialActivity = ref('');
const usageActivity = ref('');
const usagePeriod = ref('');
const wasteType = ref('');
const usage = ref('');
const numberOfDoses = ref('');
const lot = ref('');
const validity = ref('');
const observations = ref('');
const responsible = ref('');
const currentUser = ref(auth.currentUser());
const error = ref(false);
const errors = ref('');

const radioisotopes = ref(radioisotopesData);

// Helper methods
const addDays = (date, days) => {
  return fnAddDays(parseISO(date), days);
};

const sumString = (string) => {
  if (!string) return "0";
  
  string = (string.toString()).replace(',', '.');
  const array = string.toString().split('+');
  let sum = 0;
  
  for (let i = 0; i < array.length; i++) {
    const value = parseFloat(array[i]);
    if (!isNaN(value)) {
      sum += value;
    }
  }
  
  return sum.toFixed(2).toString();
};

// Load initial data when component is mounted
onMounted(async () => {
  try {
    // Load facility data
    const facilityResponse = await axios.get(
      `${auth.apiUrl()}facility/${route.params.id}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    
    if (facilityResponse.data.length === 0) {
      errors.value = 'Nenhum resultado encontrado';
      facility.value = '';
      return;
    }
    
    facility.value = facilityResponse.data;
    
    // Load movement data
    const movementResponse = await axios.get(
      `${auth.apiUrl()}facility/routines/radioactiveMaterialMovement/${route.params.radioactiveMaterialMovementId}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    
    if (!movementResponse.data) {
      error.value = true;
      errors.value = 'Registro não encontrado';
      return;
    }

    const movement = movementResponse.data;
    
    date.value = format(parseISO(movement.date), 'yyyy-MM-dd');
    
    // Find radioisotope in the list or set as string if not found
    const foundRadioisotope = radioisotopes.value.find(r => r.value === movement.radioisotope);
    radioisotope.value = foundRadioisotope || movement.radioisotope;
    
    initialActivity.value = movement.initialActivity;
    usageActivity.value = movement.usageActivity;
    usagePeriod.value = movement.usagePeriod;
    wasteType.value = movement.wasteType;
    usage.value = movement.usage;
    numberOfDoses.value = movement.numberOfDoses;
    lot.value = movement.lot;
    validity.value = movement.validity ? format(parseISO(movement.validity), 'yyyy-MM-dd') : '';
    responsible.value = movement.responsible;
    observations.value = movement.observations;
    
  } catch (err) {
    error.value = true;
    errors.value = err.response?.data || 'Erro ao carregar dados';
  }
});

// Update radioisotope related fields when selection changes
watch(() => radioisotope.value, (newVal) => {
  if (!newVal) {
    return;
  }
  
  if (typeof newVal === 'object') {
    usagePeriod.value = newVal.usagePeriod;
    wasteType.value = newVal.wasteType;
    usage.value = newVal.usage;
  }
});

// Edit movement
const edit = async () => {
  error.value = false;
  
  try {
    // Prepare radioisotope value
    let rad = '';
    if (radioisotope.value) {
      rad = typeof radioisotope.value === 'object' ? radioisotope.value.value : radioisotope.value;
    }
    
    // Convert MBq to mCi if needed
    let convertedInitialActivity = initialActivity.value;
    if (activitiesUnit.value === 'MBq') {
      convertedInitialActivity = parseFloat(sumString(initialActivity.value)) / 37.0;
    }
    
    const credentials = {
      _id: route.params.radioactiveMaterialMovementId,
      date: date.value,
      radioisotope: rad,
      initialActivity: sumString(convertedInitialActivity),
      usagePeriod: usagePeriod.value,
      usageActivity: sumString(usageActivity.value),
      wasteType: wasteType.value,
      usage: usage.value,
      numberOfDoses: numberOfDoses.value,
      lot: lot.value,
      validity: validity.value,
      responsible: responsible.value,
      observations: observations.value,
      facility: { _id: facility.value._id }
    };
    
    await auth.editFacilityRoutineRadioactiveMaterialMovement(
      { error, errors, router },
      credentials,
      `/facility/${facility.value._id}/routines/radioactivematerialmov`
    );
    return;
  } catch (err) {
    error.value = true;
    errors.value = err.response?.data || 'Erro ao atualizar movimentação';
  }
};

// Delete movement
const exclude = () => {
  if (!confirm('Tem certeza que deseja excluir esta movimentação?')) {
    return;
  }
  
  auth.excludeRoutineRadioactiveMaterialMovement(
    { error, errors, router },
    { _id: route.params.radioactiveMaterialMovementId },
    `/facility/${facility.value._id}/routines/radioactivematerialmov`
  );
};
</script>
