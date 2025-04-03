<template>
  <div class="p-4 md:p-8">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Novo Teste Diário</h2>

      <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" /> {{ error }}
      </div>
      <div v-if="sourceWarning" class="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" class="mr-2" /> {{ sourceWarning }}
      </div>

      <form @submit.prevent="register">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="testDate">
                <FontAwesomeIcon :icon="['fas', 'calendar-alt']" class="mr-1" /> Data
              </label>
              <input type="date" id="testDate" v-model="formData.date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="responsible">
                  <FontAwesomeIcon :icon="['fas', 'user']" class="mr-1" /> Responsável
                </label>
                <select id="responsible" v-model="formData.responsible" required class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white">
                  <option disabled :value="{ _id: '', name: '' }">Selecione o responsável</option>
                  <option v-for="option in responsibleOptions" :key="option._id" :value="option">{{ option.label }}</option>
                </select>
              </div>
        </div>

        <!-- Status Checks -->
        <fieldset class="mb-4 border p-4 rounded">
             <legend class="text-sm font-medium text-gray-700 px-1">Verificações de Status</legend>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                 <!-- Auto-zero -->
                 <div class="flex items-center justify-between border-b pb-2">
                    <label class="text-sm text-gray-600 flex items-center">
                        <FontAwesomeIcon :icon="['fas', 'sliders-h']" class="mr-2 w-4"/> Auto-zero (mV)
                        <input type="number" step="any" v-model.number="formData.autoZero" class="ml-2 shadow-sm border rounded py-1 px-2 text-sm w-24">
                        <span class="text-xs text-gray-400 ml-1">(opcional)</span>
                    </label>
                    <div class="flex space-x-4">
                        <label class="flex items-center text-sm"><input type="radio" name="autoZeroStatus" value="OK" v-model="formData.autoZeroStatus" class="mr-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"> OK</label>
                        <label class="flex items-center text-sm"><input type="radio" name="autoZeroStatus" value="ERRO" v-model="formData.autoZeroStatus" class="mr-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"> ERRO</label>
                    </div>
                 </div>
                <!-- BG -->
                 <div class="flex items-center justify-between border-b pb-2">
                    <label class="text-sm text-gray-600 flex items-center">
                        <FontAwesomeIcon :icon="['fas', 'asterisk']" class="mr-2 w-4"/> BG (µCi)
                        <input type="number" step="any" v-model.number="formData.bG" class="ml-2 shadow-sm border rounded py-1 px-2 text-sm w-24">
                         <span class="text-xs text-gray-400 ml-1">(opcional)</span>
                    </label>
                    <div class="flex space-x-4">
                        <label class="flex items-center text-sm"><input type="radio" name="bGStatus" value="OK" v-model="formData.bGStatus" class="mr-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"> OK</label>
                        <label class="flex items-center text-sm"><input type="radio" name="bGStatus" value="High" v-model="formData.bGStatus" class="mr-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"> High</label>
                    </div>
                 </div>
                  <!-- System Test -->
                 <div class="flex items-center justify-between border-b pb-2">
                    <label class="text-sm text-gray-600 flex items-center">
                        <FontAwesomeIcon :icon="['fas', 'sliders-h']" class="mr-2 w-4"/> System Test (V)
                        <input type="number" step="any" v-model.number="formData.systemTest" class="ml-2 shadow-sm border rounded py-1 px-2 text-sm w-24">
                        <span class="text-xs text-gray-400 ml-1">(opcional)</span>
                    </label>
                    <div class="flex space-x-4">
                        <label class="flex items-center text-sm"><input type="radio" name="systemTestStatus" value="OK" v-model="formData.systemTestStatus" class="mr-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"> OK</label>
                        <label class="flex items-center text-sm"><input type="radio" name="systemTestStatus" value="ERRO" v-model="formData.systemTestStatus" class="mr-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"> ERRO</label>
                    </div>
                 </div>
                 <!-- Data Check -->
                 <div class="flex items-center justify-between border-b pb-2">
                    <label class="text-sm text-gray-600 flex items-center">
                         <FontAwesomeIcon :icon="['fas', 'sliders-h']" class="mr-2 w-4"/> Data Check
                    </label>
                    <div class="flex space-x-4">
                        <label class="flex items-center text-sm"><input type="radio" name="dataCheckStatus" value="OK" v-model="formData.dataCheckStatus" class="mr-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"> OK</label>
                        <label class="flex items-center text-sm"><input type="radio" name="dataCheckStatus" value="ERRO" v-model="formData.dataCheckStatus" class="mr-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"> ERRO</label>
                    </div>
                 </div>
            </div>
        </fieldset>

        <!-- Source Activity Checks -->
         <fieldset class="mb-6 border p-4 rounded">
             <legend class="text-sm font-medium text-gray-700 px-1">Verificação das Fontes <span class="text-xs text-gray-400">(opcional)</span></legend>
             <!-- Co(57) -->
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-center border-b pb-3">
                 <label class="text-sm text-gray-600 flex items-center md:col-span-1"><FontAwesomeIcon :icon="['fab', 'react']" class="mr-2 w-4"/> Co(57)</label>
                 <select v-model="formData.sourceCo" class="shadow border rounded w-full py-1 px-2 text-sm leading-tight focus:outline-none focus:shadow-outline bg-white md:col-span-1">
                     <option :value="null">Selecione S/N</option>
                     <option v-for="option in sourcesCoOptions" :key="option._id" :value="option">{{ option.label }}</option>
                 </select>
                 <input type="number" step="any" v-model.number="formData.sourceCoActivity" placeholder="Atividade (µCi)" class="shadow-sm border rounded w-full py-1 px-2 text-sm md:col-span-1">
             </div>
             <!-- Ba(133) -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-center border-b pb-3">
                  <label class="text-sm text-gray-600 flex items-center md:col-span-1"><FontAwesomeIcon :icon="['fab', 'react']" class="mr-2 w-4"/> Ba(133)</label>
                  <select v-model="formData.sourceBa" class="shadow border rounded w-full py-1 px-2 text-sm leading-tight focus:outline-none focus:shadow-outline bg-white md:col-span-1">
                       <option :value="null">Selecione S/N</option>
                       <option v-for="option in sourcesBaOptions" :key="option._id" :value="option">{{ option.label }}</option>
                  </select>
                  <input type="number" step="any" v-model.number="formData.sourceBaActivity" placeholder="Atividade (µCi)" class="shadow-sm border rounded w-full py-1 px-2 text-sm md:col-span-1">
              </div>
             <!-- Cs(137) -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-center border-b pb-3">
                   <label class="text-sm text-gray-600 flex items-center md:col-span-1"><FontAwesomeIcon :icon="['fab', 'react']" class="mr-2 w-4"/> Cs(137)</label>
                   <select v-model="formData.sourceCs" class="shadow border rounded w-full py-1 px-2 text-sm leading-tight focus:outline-none focus:shadow-outline bg-white md:col-span-1">
                        <option :value="null">Selecione S/N</option>
                        <option v-for="option in sourcesCsOptions" :key="option._id" :value="option">{{ option.label }}</option>
                   </select>
                   <input type="number" step="any" v-model.number="formData.sourceCsActivity" placeholder="Atividade (µCi)" class="shadow-sm border rounded w-full py-1 px-2 text-sm md:col-span-1">
               </div>
             <!-- Cs(137) Measured -->
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label class="text-sm text-gray-600 flex items-center md:col-span-1"><FontAwesomeIcon :icon="['fab', 'react']" class="mr-2 w-4"/> Cs(137) na fonte {{ equipment.mostUsedRadioisotope || '?' }}</label>
                  <select v-model="formData.sourceCsOnMostUsedRadioisotope" class="shadow border rounded w-full py-1 px-2 text-sm leading-tight focus:outline-none focus:shadow-outline bg-white md:col-span-1">
                       <option :value="null">Selecione S/N</option>
                       <option v-for="option in sourcesCsOnMostUsedRadioisotopeOptions" :key="option._id" :value="option">{{ option.label }}</option>
                  </select>
                  <input type="number" step="any" v-model.number="formData.sourceCsOnMostUsedRadioisotopeActivity" placeholder="Atividade (µCi)" class="shadow-sm border rounded w-full py-1 px-2 text-sm md:col-span-1">
              </div>
        </fieldset>

        <div class="text-center mt-6">
          <button type="submit" class="btn btn-success btn-block w-full md:w-auto" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar Teste Diário' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '@/services/authentication';
import permission from '@/services/permissions'; // Assuming path

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const error = ref('');
const sourceWarning = ref('');
const equipment = ref({});
const facility = ref({});
const currentUser = ref({});
const responsibleOptions = ref([]);

// Source options
const sourcesCoOptions = ref([]);
const sourcesBaOptions = ref([]);
const sourcesCsOptions = ref([]);
const sourcesCsOnMostUsedRadioisotopeOptions = ref([]);

// Reactive form data object
const formData = reactive({
    date: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
    responsible: { _id: '', name: '' },
    autoZero: null,
    autoZeroStatus: 'OK',
    bG: null,
    bGStatus: 'OK',
    systemTest: null,
    systemTestStatus: 'OK',
    dataCheckStatus: 'OK',
    sourceCo: null,
    sourceCoActivity: null,
    sourceCoActivityDeviation: null,
    sourceBa: null,
    sourceBaActivity: null,
    sourceBaActivityDeviation: null,
    sourceCs: null,
    sourceCsActivity: null,
    sourceCsActivityDeviation: null,
    sourceCsOnMostUsedRadioisotope: null,
    sourceCsOnMostUsedRadioisotopeActivity: null,
    sourceCsOnMostUsedRadioisotopeActivityDeviation: null,
});

const equipmentId = computed(() => route.params.id);

const mapSourceToOption = (source) => ({
    label: source.serialNumber,
    value: source.serialNumber, // Keep for compatibility if needed
    _id: source._id,
    equipment: source.equipment,
    initialActivity: source.initialActivity,
    initialActivityDate: source.initialActivityDate,
    radioisotope: source.radioisotope,
    serialNumber: source.serialNumber
});

const loadInitialData = async () => {
    loading.value = true;
    error.value = '';
    sourceWarning.value = '';
    try {
        // Fetch Equipment
        const equipResponse = await axios.get(auth.apiUrl() + `equipment/${equipmentId.value}`, {
            headers: { Authorization: `Bearer ${auth.getToken()}` }
        });
        if (!equipResponse.data) throw new Error('Equipamento não encontrado.');
        equipment.value = equipResponse.data;

        // Fetch Facility
        if (!equipment.value.facility?._id) throw new Error('ID da Instalação não encontrado.');
        const facResponse = await axios.get(auth.apiUrl() + `facility/${equipment.value.facility._id}`, {
            headers: { Authorization: `Bearer ${auth.getToken()}` }
        });
        if (!facResponse.data) throw new Error('Instalação não encontrada.');
        facility.value = facResponse.data;

        // Fetch Sources
        const sourcesResponse = await axios.get(auth.apiUrl() + `equipment/${equipmentId.value}/doseCalibratorSources/`, {
             headers: { Authorization: `Bearer ${auth.getToken()}` }
        });
        const allSources = sourcesResponse.data || [];

        sourcesCoOptions.value = allSources.filter(s => s.radioisotope === 'Co(57)').map(mapSourceToOption);
        sourcesBaOptions.value = allSources.filter(s => s.radioisotope === 'Ba(133)').map(mapSourceToOption);
        sourcesCsOptions.value = allSources.filter(s => s.radioisotope === 'Cs(137)').map(mapSourceToOption);
        sourcesCsOnMostUsedRadioisotopeOptions.value = allSources.filter(s => s.radioisotope.includes('Cs(137) medido em')).map(mapSourceToOption);

        // Set default selections if available
        if (sourcesCoOptions.value.length > 0) formData.sourceCo = sourcesCoOptions.value[0];
        if (sourcesBaOptions.value.length > 0) formData.sourceBa = sourcesBaOptions.value[0];
        if (sourcesCsOptions.value.length > 0) formData.sourceCs = sourcesCsOptions.value[0];
        if (sourcesCsOnMostUsedRadioisotopeOptions.value.length > 0) formData.sourceCsOnMostUsedRadioisotope = sourcesCsOnMostUsedRadioisotopeOptions.value[0];

        // Check if all required sources are available
        if (!formData.sourceCo || !formData.sourceBa || !formData.sourceCs || !formData.sourceCsOnMostUsedRadioisotope) {
             sourceWarning.value = 'É necessário cadastrar as quatro fontes padrão (Co-57, Ba-133, Cs-137, Cs-137 medido em...) para realizar o teste diário completo.';
        }

        // Fetch Responsible Users
        const localCurrentUser = auth.currentUser() || {};
        currentUser.value = localCurrentUser;
        const usersResponse = await axios.get(auth.apiUrl() + 'users/', {
            headers: { Authorization: `Bearer ${auth.getToken()}` }
        });
        const allUsers = usersResponse.data || [];
        responsibleOptions.value = allUsers
            .filter(user => user.type === 'rad fisico')
            .map(user => ({ label: user.name, name: user.name, _id: user._id }));
        // Add current user to the top and select by default
        const currentUserOption = { label: localCurrentUser.name, name: localCurrentUser.name, _id: localCurrentUser.id };
        if (!responsibleOptions.value.some(opt => opt._id === localCurrentUser.id)) {
             responsibleOptions.value.unshift(currentUserOption);
        }
        formData.responsible = currentUserOption;


    } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
        error.value = err.message || 'Falha ao carregar dados.';
    } finally {
        loading.value = false;
    }
};

// Calculation function (extracted from old methods/watch)
const calculateDeviations = () => {
    const calculateActivity = (source, date) => {
        if (!source || !source.initialActivity || !source.initialActivityDate) return 0;
        const t = moment(date).diff(moment(source.initialActivityDate)); // Difference in milliseconds
        const halfLifeHours = source.radioisotope === 'Co(57)' ? 6522.96 :
                             source.radioisotope === 'Ba(133)' ? 92067.6 :
                             (source.radioisotope === 'Cs(137)' || source.radioisotope.includes('Cs(137) medido em')) ? 264289.2 : 0;
        if (halfLifeHours === 0) return 0;
        return source.initialActivity * Math.exp(-(0.6931471806 * t / (1000 * 60 * 60)) / halfLifeHours);
    };

    const calculateDeviation = (measured, calculated) => {
        if (measured == null || calculated == null || calculated === 0) return null;
        return (100 * measured / calculated) - 100;
    };

    if (formData.sourceCo) {
        const calculatedCo = calculateActivity(formData.sourceCo, formData.date);
        formData.sourceCoActivityDeviation = calculateDeviation(formData.sourceCoActivity, calculatedCo);
    }
     if (formData.sourceBa) {
        const calculatedBa = calculateActivity(formData.sourceBa, formData.date);
        formData.sourceBaActivityDeviation = calculateDeviation(formData.sourceBaActivity, calculatedBa);
    }
     if (formData.sourceCs) {
        const calculatedCs = calculateActivity(formData.sourceCs, formData.date);
        formData.sourceCsActivityDeviation = calculateDeviation(formData.sourceCsActivity, calculatedCs);
    }
    if (formData.sourceCsOnMostUsedRadioisotope) {
         const calculatedCsMeasured = calculateActivity(formData.sourceCsOnMostUsedRadioisotope, formData.date);
         formData.sourceCsOnMostUsedRadioisotopeActivityDeviation = calculateDeviation(formData.sourceCsOnMostUsedRadioisotopeActivity, calculatedCsMeasured);
    }
};

const register = async () => {
    error.value = '';
    if (!formData.date || !formData.responsible?._id) {
        error.value = "Data e Responsável são obrigatórios.";
        return;
    }

    calculateDeviations(); // Calculate deviations before saving

    loading.value = true;

    // Construct payload, ensuring selected sources have _id
    const getSourcePayload = (source) => source ? { _id: source._id, serialNumber: source.serialNumber /* add other fields if needed */ } : null;

    const credentials = {
        date: moment(formData.date).toISOString(),
        autoZero: formData.autoZero,
        autoZeroStatus: formData.autoZeroStatus,
        bG: formData.bG,
        bGStatus: formData.bGStatus,
        systemTest: formData.systemTest,
        systemTestStatus: formData.systemTestStatus,
        dataCheckStatus: formData.dataCheckStatus,
        sourceCo: getSourcePayload(formData.sourceCo),
        sourceCoActivity: formData.sourceCoActivity,
        sourceCoActivityDeviation: formData.sourceCoActivityDeviation,
        sourceBa: getSourcePayload(formData.sourceBa),
        sourceBaActivity: formData.sourceBaActivity,
        sourceBaActivityDeviation: formData.sourceBaActivityDeviation,
        sourceCs: getSourcePayload(formData.sourceCs),
        sourceCsActivity: formData.sourceCsActivity,
        sourceCsActivityDeviation: formData.sourceCsActivityDeviation,
        sourceCsOnMostUsedRadioisotope: getSourcePayload(formData.sourceCsOnMostUsedRadioisotope),
        sourceCsOnMostUsedRadioisotopeActivity: formData.sourceCsOnMostUsedRadioisotopeActivity,
        sourceCsOnMostUsedRadioisotopeActivityDeviation: formData.sourceCsOnMostUsedRadioisotopeActivityDeviation,
        equipment: { _id: equipmentId.value },
        responsible: { name: formData.responsible.name, _id: formData.responsible._id }
    };

    try {
        await auth.registerDoseCalibratorDailyTest(credentials);
        const currentYear = moment(formData.date).year();
        router.push(`/equipments/doseCalibrator/${equipmentId.value}/daily/${currentYear}`);
    } catch (err) {
        console.error("Erro ao registrar teste diário:", err);
        error.value = err.response?.data?.message || err.message || 'Falha ao salvar o teste diário.';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadInitialData();
});

</script>
