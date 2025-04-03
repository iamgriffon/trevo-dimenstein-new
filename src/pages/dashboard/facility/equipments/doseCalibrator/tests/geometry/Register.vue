<template>
  <Layout :title="`Novo Teste de Geometria`">
    <div
      v-if="loading"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white p-5 rounded shadow-lg text-center">
        <!-- Replace with your preferred loading indicator -->
        <p>Carregando...</p>
      </div>
    </div>

    <div class="p-4 md:p-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-semibold mb-6 text-center">Novo Teste de Geometria</h2>

        <!-- General Info Section -->
        <div class="bg-white p-6 rounded shadow-md mb-6">
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
                 <FontAwesomeIcon :icon="['fas', 'calendar-alt']" class="mr-1"/> Data
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

        <!-- Display Saved Container Tests -->
        <div v-for="(savedTest, index) in tests" :key="`saved-${index}`" class="bg-white p-4 rounded shadow-md mb-4">
           <div class="flex justify-between items-center mb-3">
             <h4 class="text-lg font-semibold">{{ savedTest.container }} (Salvo)</h4>
             <button @click="eraseLine(index)" class="btn btn-outline-danger btn-sm">
                 <FontAwesomeIcon :icon="['fas', 'times']"/>
             </button>
           </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 text-sm">
                  <thead class="bg-gray-50">
                      <tr>
                          <th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase">Volume (mL)</th>
                          <th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase">Atividade Medida (µCi)</th>
                          <th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase">Fator Correção</th>
                          <th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase">Variação (%)</th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(measure, mIndex) in savedTest.measures" :key="`saved-m-${mIndex}`">
                          <td class="px-3 py-1">{{ measure.volume }}</td>
                          <td class="px-3 py-1">{{ measure.activity }}</td>
                          <td class="px-3 py-1">{{ measure.correctionFactor }}</td>
                          <td class="px-3 py-1">{{ measure.variation }}</td>
                      </tr>
                  </tbody>
              </table>
            </div>
        </div>

        <!-- Display Editable Container Tests -->
         <div v-for="(editableTest, index) in editableTests" :key="`edit-${index}`" class="bg-blue-50 p-4 rounded shadow-md mb-4 border border-blue-200">
           <div class="flex justify-between items-center mb-3">
             <h4 class="text-lg font-semibold text-blue-800">{{ editableTest.container }} (Editando)</h4>
             <button @click="eraseEditableLine(index)" class="btn btn-outline-danger btn-sm">
                  <FontAwesomeIcon :icon="['fas', 'times']"/>
             </button>
           </div>
            <div class="overflow-x-auto mb-3">
              <table class="min-w-full divide-y divide-gray-200 text-sm">
                   <thead class="bg-blue-100">
                      <tr>
                          <th class="px-3 py-1 text-left text-xs font-medium text-blue-700 uppercase">Volume (mL)</th>
                          <th class="px-3 py-1 text-left text-xs font-medium text-blue-700 uppercase">Atividade Medida (µCi)</th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(measure, mIndex) in editableTest.measures" :key="`edit-m-${mIndex}`">
                          <td class="px-3 py-1">{{ measure.volume }}</td>
                          <td class="px-1 py-1">
                              <input
                                type="number"
                                step="any"
                                v-model.number="measure.activity"
                                placeholder="0.00"
                                class="shadow-sm border border-gray-300 rounded w-full py-1 px-2 text-sm text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                          </td>
                      </tr>
                  </tbody>
              </table>
            </div>
            <div class="text-right">
                 <button @click="saveContainer(index)" class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300">
                    <FontAwesomeIcon icon="fa-solid fa-save" class="mr-1"/> Salvar Recipiente
                 </button>
            </div>
        </div>

        <!-- Add New Container Section -->
        <div class="bg-white p-6 rounded shadow-md mb-6">
           <h5 class="text-lg font-semibold mb-4">Adicionar Novo Recipiente</h5>
            <div class="flex items-end space-x-4">
                <div class="flex-grow">
                   <label class="block text-gray-700 text-sm font-bold mb-2" for="newContainerType">
                       <FontAwesomeIcon :icon="['fas', 'prescription-bottle']" class="mr-1"/> Tipo de Recipiente
                   </label>
                    <select id="newContainerType" v-model="newContainerType" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white">
                        <option disabled value="">Selecione um recipiente</option>
                        <option v-for="container in containerOptions" :key="container" :value="container">{{ container }}</option>
                    </select>
                </div>
                <button @click="addContainer" :disabled="!newContainerType" class="btn btn-outline-metalic-seaweed">
                     <FontAwesomeIcon :icon="['fas', 'plus']"/>
                </button>
            </div>
        </div>

        <!-- Finish Button -->
        <div class="text-center mt-8">
             <button class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300 text-lg" @click="registerTest" :disabled="loading || editableTests.length > 0">
                  <FontAwesomeIcon icon="fa-solid fa-check-circle" class="mr-2"/>
                  {{ editableTests.length > 0 ? 'Salve todos os recipientes para finalizar' : 'Finalizar Teste e Gerar PDF' }}
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
import { testPoints, generateDocument } from './TestAlgorithm.js';
import Layout from '@/components/common/Layout.vue';

const route = useRoute();
const router = useRouter();

// --- State --- //
const loading = ref(false);
const error = ref('');
const equipment = ref({});
const facility = ref({});
const currentUser = ref({});
const responsibleOptions = ref([]);

const formData = reactive({
    radioisotope: null, // Store the selected object { label, value, name, halfLife }
    date: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
    responsible: { _id: '', name: '' },
});

const tests = ref([]); // Array to hold finalized container tests
const editableTests = ref([]); // Array to hold containers being edited
const newContainerType = ref(''); // Holds the selection for the next container to add

const radioisotopeOptions = ref([
    { label: 'F(18)', value: 'F(18)', name: 'F(18)', halfLife: 6586.26 * 1000 }, // Store half-life in ms
    { label: 'Ga(68)', value: 'Ga(68)', name: 'Ga(68)', halfLife: 4062.6 * 1000 },
    { label: 'I(131)', value: 'I(131)', name: 'I(131)', halfLife: 692902.08 * 1000 },
    { label: 'Tc(99m)', value: 'Tc(99m)', name: 'Tc(99m)', halfLife: 21624.12 * 1000 },
]);

const containerOptions = ref([
    'Seringa 1ml',
    'Seringa 3ml',
    'Seringa 5ml',
    'Seringa 10ml',
    'Seringa 20ml',
    'Frasco 20ml',
    'Frasco 45ml',
    'Transferência Frasco-Seringa',
]);

const equipmentId = computed(() => route.params.id);

// --- Helper Functions for Measures --- //

// Generates the predefined measures structure for a given container type
const getMeasuresForContainer = (containerType) => {
    const volumeMap = {
        'Seringa 1ml': ['0,2', '0,4', '0,6', '0,8', '1,0'],
        'Seringa 3ml': ['1,0', '1,5', '2,0', '2,5', '3,0'],
        'Seringa 5ml': ['1,0', '2,0', '3,0', '4,0', '5,0'],
        'Seringa 10ml': ['1,0', '2,0', '3,0', '4,0', '5,0', '6,0', '7,0', '8,0', '9,0', '10,0'],
        'Seringa 20ml': ['1,0', '2,0', '4,0', '6,0', '8,0', '10,0', '12,0', '14,0', '16,0', '18,0', '20,0'],
        'Frasco 20ml': ['4,0', '6,0', '8,0', '10,0', '20,0'],
        'Frasco 45ml': ['5,0', '10,0', '15,0', '20,0', '25,0', '30,0', '35,0', '40,0', '45,0'],
        'Transferência Frasco-Seringa': ['Atividade - Rejeito na Seringa', 'Atividade no Frasco'] // Special case
    };

    const volumes = volumeMap[containerType] || [];
    return volumes.map(vol => ({
        volume: containerType.includes('Transferência') ? vol : `${vol} ml`, // Adjust label for transfer
        activity: null, // Initialize activity as null or empty string
        correctionFactor: null,
        variation: null,
    }));
};

// --- Component Logic --- //

const loadInitialData = async () => {
  loading.value = true;
  error.value = '';
  try {
    // Fetch Equipment
    const equipResponse = await axios.get(auth.apiUrl() + `equipment/${equipmentId.value}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    if (!equipResponse.data) throw new Error('Equipamento não encontrado.');
    equipment.value = equipResponse.data;

    // Fetch Facility
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
    const allUsers = usersResponse.data || [];
    responsibleOptions.value = allUsers
      .filter((user) => user.type === 'rad fisico')
      .map((user) => ({ label: user.name, name: user.name, _id: user._id }));

     // Set default responsible if current user is in the list
     const localCurrentUser = auth.currentUser() || {};
     currentUser.value = localCurrentUser;
     const currentUserOption = responsibleOptions.value.find(opt => opt._id === localCurrentUser.id);
      if (currentUserOption) {
          formData.responsible = currentUserOption;
      }

  } catch (err) {
    console.error('Erro ao carregar dados iniciais:', err);
    error.value = err.message || 'Falha ao carregar dados.';
  } finally {
    loading.value = false;
  }
};

// Adds a new container section to the editable list
const addContainer = () => {
    if (!newContainerType.value) return;

    const newTestContainer = {
        container: newContainerType.value,
        measures: getMeasuresForContainer(newContainerType.value),
    };
    editableTests.value.push(newTestContainer);
    newContainerType.value = ''; // Reset selection
};

// Saves a container from the editable list to the finalized list
const saveContainer = async (index) => {
    const testToSave = editableTests.value[index];
    if (!testToSave) return;

    // Validate that all activities are entered for this container
    const allActivitiesEntered = testToSave.measures.every(m => m.activity !== null && m.activity !== '');
    if (!allActivitiesEntered) {
        error.value = `Por favor, preencha todas as atividades para o recipiente: ${testToSave.container}`;
        return;
    }
    error.value = ''; // Clear error if validation passes

    loading.value = true;
    try {
        // Run calculations before saving (testPoints mutates the object)
        // We pass only the single test being saved for calculation
        const { calculatedTests: updatedContainerTest, conclusion: containerConclusion } = await testPoints([testToSave]);

        // Add the calculated container test to the main tests array
        tests.value.push(updatedContainerTest[0]); // testPoints wraps it in an array

        // Remove from editable list
        editableTests.value.splice(index, 1);
    } catch (calcError) {
         console.error('Erro ao calcular pontos do teste:', calcError);
         error.value = 'Erro nos cálculos do teste para este recipiente.';
    } finally {
        loading.value = false;
    }
};

// Removes a container from the editable list
const eraseEditableLine = (index) => {
    editableTests.value.splice(index, 1);
};

// Removes a container from the finalized list
const eraseLine = (index) => {
    tests.value.splice(index, 1);
};

// Finalizes the entire test, generates PDF, and saves to backend
const registerTest = async () => {
  error.value = '';
  if (!formData.radioisotope || !formData.date || !formData.responsible._id) {
    error.value = 'Radioisótopo, Data e Responsável são obrigatórios.';
    return;
  }
  if (tests.value.length === 0) {
      error.value = 'Adicione e salve pelo menos um recipiente.';
      return;
  }
  if (editableTests.value.length > 0) {
       error.value = 'Salve ou remova todos os recipientes em edição antes de finalizar.';
       return;
  }

  if (!confirm('Tem certeza que deseja finalizar este teste e gerar o PDF?')) return;

  loading.value = true;

  try {
    // Recalculate all points together to get the final overall conclusion
    // testPoints might need adjustment if it wasn't designed for this (it seems to calculate per container)
    // Let's assume the conclusion is determined locally based on all saved tests
    let finalConclusion = 'satisfatório';
    for (const testContainer of tests.value) {
         for (const measure of testContainer.measures) {
            const variationNum = parseFloat(measure.variation);
             if (!isNaN(variationNum)) {
                 if (Math.abs(variationNum) > 10) {
                     finalConclusion = 'insatisfatório';
                     break; // Stop checking if already insatisfatório
                 } else if (Math.abs(variationNum) > 5) {
                     finalConclusion = 'satisfatório - adotar fatores de correção';
                 }
             }
         }
          if (finalConclusion === 'insatisfatório') break;
    }

    const credentials = {
      radioisotope: {
        name: formData.radioisotope.name,
        halfLife: formData.radioisotope.halfLife / 1000, // Convert back to seconds if API expects that
      },
      tests: tests.value, // Use the finalized tests array
      equipment: { _id: equipmentId.value },
      date: moment(formData.date).toISOString(),
      conclusion: finalConclusion,
      responsible: { name: formData.responsible.name, _id: formData.responsible._id },
    };

    // 1. Generate PDF
    await generateDocument(credentials, facility.value, equipment.value, formData.responsible);

    // 2. Register Test Data via API
    await auth.registerDoseCalibratorGeometryTest(credentials);

    // 3. Redirect on success
    router.push(`/equipments/doseCalibrator/${equipmentId.value}/geometry`);

  } catch (err) {
    console.error('Erro ao finalizar teste de geometria:', err);
    error.value = err.response?.data?.message || err.message || 'Falha ao salvar ou gerar PDF do teste.';
  } finally {
    loading.value = false;
  }
};

// --- Lifecycle Hook --- //
onMounted(() => {
  loadInitialData();
});

</script>

<style>
/* Minimal global styles if needed */
</style>
