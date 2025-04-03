<template>
  <Layout>
    <template #header>
        <div class="flex justify-between items-center">
            <h1 class="text-xl font-semibold">Novo Teste de Reprodutibilidade</h1>
            <router-link :to="`/equipments/geigerCounter/${equipmentId}/reproductibility`" class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
            </router-link>
        </div>
    </template>

    <form @submit.prevent="register">
         <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
             <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
             <span>{{ error }}</span>
         </div>

        <!-- Test Setup Card -->
        <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4 border-b pb-2">Configuração do Teste</h3>
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
             <h3 class="text-lg font-semibold mb-4 border-b pb-2">Tipo de Observação</h3>
              <RadioGroup
                 v-model="formData.observationType"
                 :options="observationTypeOptions"
                 name="observationType"
                 required
             />
             <div v-if="formData.observationType && formData.observationType !== 'ok'" class="mt-4">
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
        <div v-if="formData.observationType === 'ok'" class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
             <h3 class="text-lg font-semibold mb-4 border-b pb-2">Medidas ({{ formData.scale || '' }})</h3>
             <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
             <div class="mt-6 border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span class="font-semibold text-gray-600 block">Média:</span>
                    <span class="text-gray-800">{{ averageVal.toFixed(4) }}</span>
                </div>
                 <div>
                     <span class="font-semibold text-gray-600 block">Desvio Padrão:</span>
                     <span class="text-gray-800">{{ standardDeviationVal.toFixed(4) }}</span>
                 </div>
                 <div>
                     <span class="font-semibold text-gray-600 block">Coef. Variação (%):</span>
                     <span class="text-gray-800">{{ variationPercentage.toFixed(2) }} %</span>
                 </div>
                 <div>
                     <span class="font-semibold text-gray-600 block">Resultado:</span>
                     <span :class="['font-bold', conclusion === 'satisfatório' ? 'text-green-600' : 'text-red-600']">{{ conclusion }}</span>
                 </div>
             </div>
        </div>

        <!-- Final Observations Card -->
        <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4 border-b pb-2">Observações Finais</h3>
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
            <Button type="submit" variant="success" size="lg" :disabled="loading">
                <FontAwesomeIcon v-if="loading" :icon="['fas', 'spinner']" spin class="mr-2"/>
                Salvar Teste
            </Button>
        </div>

    </form>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import auth from '@/services/authentication';
import permission from '@/services/permissions';
import Layout from '@/components/common/Layout.vue';
import Input from '@/components/ui/Input.vue';

import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import RadioGroup from '@/components/ui/RadioGroup.vue'; // Assuming component exists
import Checkbox from '@/components/ui/Checkbox.vue';

const route = useRoute();
const router = useRouter();

// --- State ---
const equipment = ref({});
const facility = ref({});
const users = ref([]); // For responsible options
const loading = ref(false);
const error = ref('');
const currentUser = ref(auth.currentUser() || {});

const equipmentId = computed(() => route.params.id);

const formData = reactive({
    date: moment().format('YYYY-MM-DD'),
    month: moment().format('MMMM').toLowerCase(), // Get month name in lowercase Portuguese
    probe: '',
    scale: '',
    responsible: null, // Store responsible user object { value: id, label: name }
    radioactiveSource: '',
    radioactiveSourceSerialNumber: '',
    observationType: 'ok', // Default to performing test
    observationText: '',
    measures: reactive(Array(11).fill(null)), // Index 0 unused, 1-10 for measures
    observationBug: false,
    observations: '',
});

// --- Options ---
const monthOptions = moment.months().map(m => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }));
const probeOptions = ref([]); // Populated based on equipment
const scaleOptions = ref([]); // Populated based on selected probe
const responsibleOptions = ref([]); // Populated from fetched users
const observationTypeOptions = ref([
    { value: 'ok', label: 'Realizar teste' },
    { value: 'calibration', label: 'Equipamento enviado para calibração' },
    { value: 'maintenance', label: 'Equipamento enviado para manutenção' },
]);

// --- Computed Properties ---
const averageVal = computed(() => {
    if (formData.observationType !== 'ok') return 0;
    const validMeasures = formData.measures.slice(1).filter(m => m !== null && !isNaN(m));
    if (validMeasures.length === 0) return 0;
    const sum = validMeasures.reduce((acc, val) => acc + Number(val), 0);
    return sum / validMeasures.length;
});

const standardDeviationVal = computed(() => {
    if (formData.observationType !== 'ok') return 0;
    const validMeasures = formData.measures.slice(1).filter(m => m !== null && !isNaN(m));
    const n = validMeasures.length;
    if (n < 2) return 0; // Cannot calculate SD with less than 2 points
    const mean = averageVal.value;
    const variance = validMeasures.reduce((acc, val) => acc + Math.pow(Number(val) - mean, 2), 0) / (n - 1);
    return Math.sqrt(variance);
});

const variationPercentage = computed(() => {
    if (formData.observationType !== 'ok' || averageVal.value === 0) return 0;
    return (standardDeviationVal.value / averageVal.value) * 100;
});

const conclusion = computed(() => {
    if (formData.observationType !== 'ok') return 'N/A'; // Or based on observation type
    // CNEN NN 3.05 allows up to 20% variation for reproducibility
    return variationPercentage.value <= 20 ? 'satisfatório' : 'insatisfatório';
});

// --- Watchers ---
watch(() => formData.probe, (newProbe) => {
    formData.scale = ''; // Reset scale when probe changes
    if (newProbe === 'Exposição') {
        scaleOptions.value = [ 'mR/h', 'µR/h', 'mSv/h', 'µSv/h' ].map(s => ({ value: s, label: s }));
    } else if (newProbe === 'Contaminação') {
        scaleOptions.value = [ 'CPM', 'KCPM' ].map(s => ({ value: s, label: s }));
    } else {
        scaleOptions.value = [];
    }
});

// Watch date to potentially update month automatically
watch(() => formData.date, (newDate) => {
    if (newDate) {
        formData.month = moment(newDate).format('MMMM').toLowerCase();
    }
});

// --- Methods ---
const loadInitialData = async () => {
    loading.value = true;
    error.value = '';
    try {
        // Fetch Equipment & Facility
        const equipResponse = await axios.get(auth.apiUrl() + `equipment/${equipmentId.value}`, {
            headers: { Authorization: `Bearer ${auth.getToken()}` }
        });
        equipment.value = equipResponse.data;

        if (equipment.value.probe === 'Exposição e Contaminação') {
            probeOptions.value = ['Exposição', 'Contaminação'].map(p => ({ value: p, label: p }));
        } else if (equipment.value.probe) {
             probeOptions.value = [{ value: equipment.value.probe, label: equipment.value.probe }];
             formData.probe = equipment.value.probe; // Pre-select if only one option
        }

        if (equipment.value?.facility?._id) {
            const facResponse = await axios.get(auth.apiUrl() + `facility/${equipment.value.facility._id}`, {
                headers: { Authorization: `Bearer ${auth.getToken()}` }
            });
            facility.value = facResponse.data;
        }

        // Fetch Users for Responsible field
        const usersResponse = await axios.get(auth.apiUrl() + 'users/', {
             headers: { Authorization: `Bearer ${auth.getToken()}` },
             params: { 'filters[type][$in][]': ['administrador', 'rad fiscal', 'rad fisico'] } // Example filter for relevant user types
        });
        users.value = usersResponse.data.list || usersResponse.data || []; // Adjust based on API response
        responsibleOptions.value = users.value.map(user => ({ value: user._id, label: user.name }));

        // Pre-select current user as responsible if possible
        const currentUserId = currentUser.value?.id;
        if (currentUserId && responsibleOptions.value.some(opt => opt.value === currentUserId)) {
             formData.responsible = { value: currentUserId, label: currentUser.value.name };
        }

    } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
        error.value = 'Falha ao carregar dados do equipamento ou usuários.';
    } finally {
        loading.value = false;
    }
};

const register = async () => {
    loading.value = true;
    error.value = '';

    // Basic Validations
    if (!formData.probe || !formData.scale || !formData.date || !formData.month || !formData.responsible) {
        error.value = "Preencha todos os campos obrigatórios da configuração do teste.";
        loading.value = false;
        return;
    }
    if (formData.observationType === 'ok') {
        const hasAllMeasures = formData.measures.slice(1).every(m => m !== null && !isNaN(m));
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
        responsible: { _id: formData.responsible.value, name: formData.responsible.label }, // Send ID and name
        radioactiveSource: formData.radioactiveSource,
        radioactiveSourceSerialNumber: formData.radioactiveSourceSerialNumber,
        observationType: formData.observationType,
        observationText: formData.observationType !== 'ok' ? formData.observationText : '',
        measures: formData.observationType === 'ok' ? formData.measures : [],
        media: formData.observationType === 'ok' ? averageVal.value : null,
        desvioPadrao: formData.observationType === 'ok' ? standardDeviationVal.value : null,
        coeficienteVariacao: formData.observationType === 'ok' ? variationPercentage.value : null,
        conclusion: formData.observationType === 'ok' ? conclusion.value : 'N/A', // Or map observationType to conclusion
        observationBug: formData.observationBug,
        observations: formData.observationBug ? formData.observations : '',
        equipment: equipmentId.value, // Send only the ID
    };

    try {
        await axios.post(auth.apiUrl() + `equipment/${equipmentId.value}/geigerCounterReproductibilityTest`, payload, {
            headers: { Authorization: `Bearer ${auth.getToken()}` },
        });
        // Redirect on success
        router.push({ 
             name: 'GeigerReproductibilityList', // Adjust route name
             params: { id: equipmentId.value } 
         });
    } catch (err) {
        console.error("Erro ao registrar teste:", err);
        error.value = err.response?.data?.message || 'Falha ao salvar o teste.';
    } finally {
        loading.value = false;
    }
};

// --- Lifecycle Hook ---
onMounted(() => {
    loadInitialData();
});

</script>
