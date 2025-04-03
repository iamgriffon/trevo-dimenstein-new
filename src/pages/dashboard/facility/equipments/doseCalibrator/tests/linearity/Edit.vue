<template>
  <Layout :title="`Editar Teste de Linearidade`">
    <template #breadcrumb>
        <router-link :to="`/facility/${facility._id}`" class="text-gray-500 hover:text-teal-800 hover:underline font-semibold">
            {{ facility.name || 'Instalação' }}
        </router-link>
        <span class="mx-2 text-teal-800 select-none">/</span>
        <router-link :to="`/equipments/doseCalibrator/${equipmentId}`" class="text-gray-500 hover:text-teal-800 hover:underline font-semibold">
            {{ equipmentTitleShort }}
        </router-link>
         <span class="mx-2 text-teal-800 select-none">/</span>
        <router-link :to="`/equipments/doseCalibrator/${equipmentId}/linearity`" class="text-gray-500 hover:text-teal-800 hover:underline font-semibold">
             Linearidade
        </router-link>
        <span class="mx-2 text-teal-800 select-none">/</span>
        <span class="text-teal-800 select-none">Editar {{ testId ? `#${testId.slice(-5)}` : '' }}</span>
    </template>
    <div class="p-4 md:p-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-semibold mb-6 text-center">Editar Teste de Linearidade</h2>

        <div v-if="loadingInitial" class="text-center text-gray-500">Carregando dados do teste...</div>

        <!-- General Info Section -->
        <div v-if="!loadingInitial" class="bg-white p-6 rounded shadow-md mb-6">
          <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" /> {{ error }}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="radioisotope">
                 <FontAwesomeIcon :icon="['fab', 'react']" class="mr-1"/> Radioisótopo
              </label>
              <select id="radioisotope" v-model="formData.radioisotope" required class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white">
                 <option disabled :value="null">Selecione</option>
                 <option v-for="iso in radioisotopeOptions" :key="iso.value" :value="iso">{{ iso.label }}</option>
              </select>
            </div>
            <div>
               <label class="block text-gray-700 text-sm font-bold mb-2" for="testDate">
                 <FontAwesomeIcon :icon="['fas', 'calendar-alt']" class="mr-1"/> Data Base
               </label>
               <input type="date" id="testDate" v-model="formData.date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
             <div>
               <label class="block text-gray-700 text-sm font-bold mb-2" for="responsible">
                  <FontAwesomeIcon :icon="['fas', 'user']" class="mr-1"/> Responsável
               </label>
                <select id="responsible" v-model="formData.responsible" required class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white">
                   <option disabled :value="{ _id: '', name: '' }">Selecione</option>
                   <option v-for="option in responsibleOptions" :key="option._id" :value="option">{{ option.label }}</option>
                </select>
             </div>
          </div>
        </div>

        <!-- Measurement List -->
         <div v-if="!loadingInitial" class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Medições Adicionadas</h3>
            <div v-if="measurements.length === 0" class="text-center text-gray-500 italic bg-white p-4 rounded shadow-md">
                Nenhuma medição adicionada ainda.
            </div>
            <div v-else class="overflow-x-auto bg-white rounded shadow-md">
                <table class="min-w-full divide-y divide-gray-200 text-sm">
                     <thead class="bg-gray-50">
                         <tr>
                             <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data e Hora</th>
                             <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tempo (h)</th>
                             <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Atividade Medida (µCi)</th>
                             <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Atividade Calculada (µCi)</th>
                             <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Desvio (%)</th>
                             <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                         </tr>
                     </thead>
                     <tbody class="bg-white divide-y divide-gray-200">
                         <tr v-for="(measurement, index) in measurements" :key="index">
                             <td class="px-3 py-2 whitespace-nowrap">{{ formatDateTime(measurement.date) }}</td>
                             <td class="px-3 py-2 whitespace-nowrap">{{ measurement.time != null ? measurement.time.toFixed(2) : 'N/A' }}</td>
                             <td class="px-3 py-2 whitespace-nowrap">{{ measurement.activity }}</td>
                             <td class="px-3 py-2 whitespace-nowrap">{{ measurement.calculatedActivity != null ? measurement.calculatedActivity.toFixed(2) : 'N/A' }}</td>
                             <td class="px-3 py-2 whitespace-nowrap" :class="{'text-red-600 font-bold': measurement.deviation > 10}">
                                 {{ measurement.deviation != null ? measurement.deviation.toFixed(2) + ' %' : 'N/A' }}
                                <FontAwesomeIcon v-if="measurement.deviation > 10" :icon="['fas', 'exclamation-circle']" class="ml-1"/>
                            </td>
                             <td class="px-3 py-2 whitespace-nowrap">
                                <button @click="removeMeasurement(index)" class="btn btn-outline-danger btn-sm p-1">
                                    <FontAwesomeIcon :icon="['fas', 'times']"/>
                                </button>
                             </td>
                         </tr>
                     </tbody>
                </table>
            </div>
         </div>

        <!-- Add New Measurement Section -->
         <div v-if="!loadingInitial" class="bg-white p-6 rounded shadow-md mb-6">
             <h5 class="text-lg font-semibold mb-4">Adicionar Nova Medição</h5>
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                 <div>
                     <label class="block text-gray-700 text-sm font-bold mb-2" for="newMeasurementDateTime">
                         <FontAwesomeIcon :icon="['fas', 'calendar-alt']" class="mr-1"/> Data e Hora
                     </label>
                      <input type="datetime-local" id="newMeasurementDateTime" v-model="newMeasurement.date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                 </div>
                 <div>
                     <label class="block text-gray-700 text-sm font-bold mb-2" for="newMeasurementActivity">
                         <FontAwesomeIcon :icon="['fab', 'react']" class="mr-1"/> Atividade (µCi)
                     </label>
                     <input type="number" step="any" id="newMeasurementActivity" v-model.number="newMeasurement.activity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="0.00">
                 </div>
                 <button @click="addMeasurement" class="btn btn-outline-metalic-seaweed" :disabled="!newMeasurement.date || newMeasurement.activity == null">
                     <FontAwesomeIcon :icon="['fas', 'plus']"/> Adicionar
                 </button>
             </div>
         </div>

        <!-- Finish Button -->
        <div v-if="!loadingInitial" class="text-center mt-8">
             <button class="btn btn-success btn-lg" @click="updateTest" :disabled="loading || measurements.length < 2">
                  <FontAwesomeIcon :icon="['fas', 'save']" class="mr-2"/>
                  {{ measurements.length < 2 ? 'Adicione pelo menos 2 medições' : 'Salvar Alterações' }}
             </button>
        </div>

      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '@/services/authentication';
import permission from '@/services/permissions'; // Assuming path
import Layout from '@/components/common/Layout.vue';

const route = useRoute();
const router = useRouter();

// --- State --- //
const loading = ref(false); // For save/update operation
const loadingInitial = ref(true); // For initial data load
const error = ref('');
const equipment = ref({});
const facility = ref({});
const responsibleOptions = ref([]);
const radioisotopeOptions = ref([
    { label: 'F(18)', value: 'F(18)', halfLife: 6586.26 },
    { label: 'Ga(68)', value: 'Ga(68)', halfLife: 4062.6 },
    { label: 'I(131)', value: 'I(131)', halfLife: 692902.08 },
    { label: 'Tc(99m)', value: 'Tc(99m)', halfLife: 21624.12 },
]);

const formData = reactive({
    radioisotope: null,
    date: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
    responsible: { _id: '', name: '' },
});

const measurements = ref([]);
const newMeasurement = ref({ date: '', activity: null });
const finalConclusion = ref('satisfatório');

const equipmentId = computed(() => route.params.id);
const testId = computed(() => route.params.testId);

const equipmentTitleShort = computed(() => {
    if (!equipment.value.type) return 'ID';
    const patrimonial = equipment.value.patrimonialNumber || '';
    const serial = equipment.value.serialNumber || '';
    const separator = patrimonial && serial ? '-' : '';
    return `${patrimonial}${separator}${serial}`.trim() || 'Detalhes';
});

const formatDateTime = (isoString) => {
    return isoString ? moment(isoString).format('DD/MM/YYYY HH:mm') : 'N/A';
};

// Function to format ISO datetime-local string for input type=datetime-local
const formatDateTimeLocal = (isoString) => {
  if (!isoString) return '';
  // moment needs the offset to format correctly for local time input
  return moment(isoString).local().format('YYYY-MM-DDTHH:mm');
};

// --- Data Loading --- //
const loadInitialData = async () => {
  loadingInitial.value = true;
  error.value = '';
  try {
    // Fetch Equipment and Facility (needed for breadcrumbs/context)
    const equipResponse = await axios.get(auth.apiUrl() + `equipment/${equipmentId.value}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    if (!equipResponse.data) throw new Error('Equipamento não encontrado.');
    equipment.value = equipResponse.data;

    if (!equipment.value.facility?._id) throw new Error('ID da Instalação não encontrado.');
    const facResponse = await axios.get(auth.apiUrl() + `facility/${equipment.value.facility._id}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    if (!facResponse.data) throw new Error('Instalação não encontrada.');
    facility.value = facResponse.data;

    // Fetch Responsible Users
    const usersResponse = await axios.get(auth.apiUrl() + 'users/', {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    responsibleOptions.value = (usersResponse.data || [])
      .filter((user) => user.type === 'rad fisico')
      .map((user) => ({ label: user.name, name: user.name, _id: user._id }));

    // Fetch Existing Test Data
    const testResponse = await axios.get(auth.apiUrl() + `doseCalibratorLinearityTests/${testId.value}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` }
    });
    if (!testResponse.data) throw new Error('Teste de Linearidade não encontrado.');
    const testData = testResponse.data;

    // Populate Form Data
    formData.date = moment(testData.date).tz('America/Sao_Paulo').format('YYYY-MM-DD');

    // Find the correct radioisotope object based on name (adjust if API stores differently)
    formData.radioisotope = radioisotopeOptions.value.find(iso => iso.value === testData.radioisotope?.name) || null;

    // Find the correct responsible object
    formData.responsible = responsibleOptions.value.find(opt => opt._id === testData.responsible?._id) || { _id: '', name: '' };

    // Populate Measurements
    measurements.value = testData.tests || [];
    // Initial calculation if needed
    recalculateMeasurements();

  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    error.value = err.message || 'Falha ao carregar dados do teste ou informações relacionadas.';
  } finally {
    loadingInitial.value = false;
  }
};

onMounted(() => {
  loadInitialData();
});

// --- Calculation Logic (Copied from Register.vue) --- //
const expCurveFit = (d) => {
    let sumX2Y = 0;
    let sumYLnY = 0;
    let sumXY = 0;
    let sumXYLnY = 0;
    let sumY = 0;
    for (let i = 0; i < d.length; i++) {
        let x = d[i][0]; // time
        let y = d[i][1]; // activity
        if (y <= 0) continue;
        sumX2Y += x ** 2 * y;
        sumYLnY += y * Math.log(y);
        sumXY += x * y;
        sumXYLnY += x * y * Math.log(y);
        sumY += y;
    }
    const denominator = (sumY * sumX2Y - sumXY ** 2);
    if (Math.abs(denominator) < 1e-10) {
         console.warn('Exponential curve fit failed due to denominator near zero.');
         return { equation: [NaN, NaN] };
    }
    let a = ((sumX2Y * sumYLnY) - (sumXY * sumXYLnY)) / denominator;
    let b = ((sumY * sumXYLnY) - (sumXY * sumYLnY)) / denominator;
    return { equation: [Math.exp(a), b] };
};

const recalculateMeasurements = () => {
    if (measurements.value.length === 0) {
        finalConclusion.value = 'satisfatório';
        return;
    }
    measurements.value.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
    const firstMeasurementDate = moment(measurements.value[0].date);
    let pointsForFit = [];
    let conclusion = 'satisfatório';

    measurements.value.forEach((m, index) => {
        if (index === 0) {
            m.time = 0;
        } else {
            m.time = moment(m.date).diff(firstMeasurementDate, 'hours', true);
        }
         if (m.activity != null && m.activity > 0) {
              pointsForFit.push([m.time, m.activity]);
         }
    });

    let fitResult = { equation: [NaN, NaN] };
    if (pointsForFit.length >= 2) {
        fitResult = expCurveFit(pointsForFit);
    } else {
         console.warn('Not enough valid data points (>=2) for exponential curve fit.');
    }

    measurements.value.forEach(m => {
        if (m.time != null && !isNaN(fitResult.equation[0]) && !isNaN(fitResult.equation[1])) {
            m.calculatedActivity = fitResult.equation[0] * Math.exp(fitResult.equation[1] * m.time);
             if (m.activity != null && m.activity > 0 && m.calculatedActivity > 0) {
                 m.deviation = Math.abs(100 - (m.activity * 100 / m.calculatedActivity));
                 if (m.deviation > 10) {
                    conclusion = 'insatisfatório';
                 }
            } else {
                 m.deviation = null;
            }
        } else {
            m.calculatedActivity = null;
            m.deviation = null;
        }
    });

    finalConclusion.value = conclusion;
};

// --- User Actions --- //
const addMeasurement = () => {
    if (!newMeasurement.value.date || newMeasurement.value.activity == null || newMeasurement.value.activity <= 0) {
        error.value = 'Data/Hora e Atividade (positiva) são obrigatórios para adicionar medição.';
        return;
    }
    error.value = '';
    measurements.value.push({
        // Ensure date is stored as ISO string or consistent format
        date: moment(newMeasurement.value.date).toISOString(),
        activity: newMeasurement.value.activity,
    });
    newMeasurement.value = { date: '', activity: null };
    recalculateMeasurements();
};

const removeMeasurement = (index) => {
    measurements.value.splice(index, 1);
    recalculateMeasurements();
};

const updateTest = async () => {
    error.value = '';
    if (!formData.radioisotope || !formData.date || !formData.responsible._id) {
        error.value = 'Radioisótopo, Data Base e Responsável são obrigatórios.';
        return;
    }
     if (measurements.value.length < 2) {
         error.value = 'É necessário adicionar pelo menos 2 medições válidas.';
         return;
     }

    recalculateMeasurements(); // Ensure calculations are final

    if (!confirm('Tem certeza que deseja salvar as alterações neste teste?')) return;

    loading.value = true;

    const payload = {
        status: 'concluído', // Or maybe keep existing status if editable? Depends on workflow
        radioisotope: {
            name: formData.radioisotope.label,
            halfLife: formData.radioisotope.halfLife
        },
        tests: measurements.value.map(m => ({ // Clean up potentially added properties if API expects specific fields
             _id: m._id, // Include ID if API needs it for updates
             date: m.date,
             time: m.time,
             activity: m.activity,
             calculatedActivity: m.calculatedActivity,
             deviation: m.deviation
        })),
        // equipment: { _id: equipmentId.value }, // Usually not needed for update if endpoint includes it
        date: moment(formData.date).toISOString(),
        responsible: { _id: formData.responsible._id, name: formData.responsible.name },
        conclusion: finalConclusion.value
    };

    try {
        // Use PUT or PATCH based on API design
        await axios.put(auth.apiUrl() + `doseCalibratorLinearityTests/${testId.value}`, payload, {
            headers: { Authorization: `Bearer ${auth.getToken()}` }
        });
        // Navigate back to the list or the details page after successful update
        router.push(`/equipments/doseCalibrator/${equipmentId.value}/linearity`);
    } catch (err) {
        console.error("Erro ao atualizar teste de linearidade:", err);
        error.value = err.response?.data?.message || err.message || 'Falha ao salvar as alterações do teste.';
    } finally {
        loading.value = false;
    }
};

</script>

<style>
/* Copied from Register.vue */
.text-red-600 { color: #dc2626; }
.font-bold { font-weight: 700; }
</style>
