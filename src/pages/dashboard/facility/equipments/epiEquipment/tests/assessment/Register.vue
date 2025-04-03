<template>
  <Layout>
    <template #header>
      <h1 class="text-xl font-semibold">Nova Avaliação de EPIs</h1>
    </template>

    <!-- Upload Progress Modal -->
    <Modal :show="uploadProgressModalVisible" @close="uploadProgressModalVisible = false">
        <template #title>Upload das Avaliações</template>
        <p class="text-center">Fazendo upload das avaliações...</p>
        <div v-if="uploadErrors.length > 0" class="mt-4 space-y-2">
            <div v-for="(err, index) in uploadErrors" :key="index" class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" /> {{ err }}
            </div>
        </div>
         <template #footer>
             <Button @click="uploadProgressModalVisible = false" :disabled="uploadProgress + uploadErrorProgress < 1" variant="success">
                 <FontAwesomeIcon v-if="uploadProgress + uploadErrorProgress < 1" :icon="['fas', 'circle-notch']" spin />
                 <span v-else>Fechar</span>
            </Button>
         </template>
    </Modal>

    <!-- Generic Loading Modal -->
     <Modal :show="showLoadingModal" :closable="false">
        <template #title>Aguarde</template>
        <div class="text-center">
            <FontAwesomeIcon :icon="['fas', 'spinner']" spin size="3x" class="text-gray-400 mb-4" />
            <p>{{ loadingMessage || 'Processando...' }}</p>
        </div>
     </Modal>

    <form @submit.prevent="finishTest">

      <!-- Facility Information Card -->
      <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">Informações da Instituição</h3>
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" /> {{ error }}
        </div>

        <div class="mb-4 relative">
            <Input
                label="Instituição"
                id="facility-search"
                v-model="searchFacilityQuery"
                placeholder="Buscar instituição..."
                :icon="['fas', 'building']"
                :disabled="!!selectedFacility._id"
                @input="debouncedSearchFacility"
             />
             <div v-if="selectedFacility._id" class="mt-1 flex items-center">
                 <input type="text" :value="selectedFacility.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100" disabled>
                 <Button @click="removeSelectedFacility" variant="danger-outline" size="sm" class="ml-2 flex-shrink-0">
                     <FontAwesomeIcon :icon="['fas', 'times']" />
                 </Button>
             </div>

             <!-- Search Results -->
             <div v-if="!selectedFacility._id && (loadingFacility || facilityResults.length > 0)" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                <div v-if="loadingFacility" class="p-3 text-center text-gray-500">
                   <FontAwesomeIcon :icon="['fas', 'circle-notch']" spin class="mr-2"/> buscando...
                </div>
                 <ul v-else>
                     <li v-for="facility in facilityResults" :key="facility._id" @click="selectFacility(facility)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                        <FontAwesomeIcon :icon="['fas', 'building']" class="mr-2 text-gray-500" /> {{ facility.name }}
                     </li>
                 </ul>
             </div>
        </div>
         <div class="mb-4">
             <Input
                 label="Endereço"
                 id="facility-address"
                 v-model="facilityAddress"
                 :icon="['fas', 'map-marker-alt']"
                 :disabled="!!selectedFacility._id"
             />
         </div>
      </div>

      <!-- Equipment Information Card -->
      <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">Informações do Equipamento Utilizado</h3>
         <div v-if="errorEquipment" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
             <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" /> {{ errorEquipment }}
         </div>

         <!-- Equipment Search/Selection -->
         <div v-if="!createEquipment" class="mb-4 relative">
             <Input
                 label="Equipamento"
                 id="equipment-search"
                 v-model="searchEquipmentQuery"
                 placeholder="Buscar equipamento..."
                 :icon="['fas', 'screwdriver-wrench']"
                 :disabled="!!selectedEquipment._id"
                 @input="debouncedSearchEquipment"
             />
              <div v-if="selectedEquipment._id" class="mt-1 flex items-center">
                 <input type="text" :value="equipmentDisplayName(selectedEquipment)" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100" disabled>
                 <Button @click="removeSelectedEquipment" variant="danger-outline" size="sm" class="ml-2 flex-shrink-0">
                     <FontAwesomeIcon :icon="['fas', 'times']" />
                 </Button>
             </div>

             <!-- Search Results -->
            <div v-if="!selectedEquipment._id && (loadingEquipment || equipmentResults.length > 0)" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                <div v-if="loadingEquipment" class="p-3 text-center text-gray-500">
                   <FontAwesomeIcon :icon="['fas', 'circle-notch']" spin class="mr-2"/> buscando...
                </div>
                 <ul v-else>
                     <li v-for="equip in equipmentResults" :key="equip._id" @click="selectEquipment(equip)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                        <FontAwesomeIcon :icon="['fas', 'screwdriver-wrench']" class="mr-2 text-gray-500" /> {{ equipmentDisplayName(equip) }}
                     </li>
                 </ul>
             </div>
         </div>

         <!-- Create New Equipment Section Toggle -->
         <div v-if="!selectedEquipment._id && !createEquipment" class="text-center border-t pt-4 mt-4">
              <Button @click="openCreateEquipment" variant="success-outline">Criar Novo Equipamento</Button>
         </div>

         <!-- Create New Equipment Form -->
         <div v-if="createEquipment">
             <h4 class="text-md font-semibold mb-3 text-gray-700">Novo Equipamento</h4>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <Select
                     label="Tipo"
                     id="equipment-type"
                     v-model="newEquipment.type"
                     :options="equipmentTypesOptions"
                     required
                     :icon="['fas', 'cubes']"
                 />
                 <Input
                     label="Localização"
                     id="equipment-location"
                     v-model="newEquipment.localization"
                     placeholder="Ex.: Laboratório"
                     :icon="['fas', 'map-marker-alt']"
                 />
                 <Input
                     label="Fabricante"
                     id="equipment-manufacturer"
                     v-model="newEquipment.manufacturer"
                     :icon="['fas', 'building']"
                 />
                 <Input
                     label="Modelo"
                     id="equipment-model"
                     v-model="newEquipment.model"
                     :icon="['fas', 'square']"
                 />
                 <Input
                     label="Número de Série"
                     id="equipment-serial"
                     v-model="newEquipment.serialNumber"
                     required
                     :icon="['fas', 'hashtag']"
                 />
                 <Input
                     label="Número Patrimonial"
                     id="equipment-patrimonial"
                     v-model="newEquipment.patrimonialNumber"
                     optional
                     :icon="['fas', 'hashtag']"
                 />
             </div>
             <div class="flex justify-center space-x-4 border-t pt-4">
                 <Button @click="registerEquipment" variant="success">Adicionar Equipamento</Button>
                 <Button @click="closeCreateEquipment" variant="secondary-outline">Buscar Equipamento</Button>
             </div>
         </div>

         <!-- Avaliation Mode -->
        <div class="mt-4 border-t pt-4">
             <Select
                 label="Modo de Avaliação"
                 id="avaliation-mode"
                 v-model="avaliationMode"
                 :options="avaliationModesOptions"
                 required
                 :icon="['fas', 'tasks']" >
                </Select>
         </div>
      </div>

      <!-- Tests Card -->
      <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <!-- List Added Tests -->
        <div v-if="!addingTest">
            <h3 class="text-lg font-semibold mb-4 border-b pb-2">Testes de Avaliação</h3>
             <div v-if="tests.length > 0" class="mb-4 space-y-3">
                 <div v-for="(test, index) in tests" :key="index" class="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                    <span class="text-gray-700">{{ test.title }}</span>
                    <Button @click="removeTest(index)" variant="danger-outline" size="sm">
                       <FontAwesomeIcon :icon="['fas', 'times']" />
                    </Button>
                 </div>
            </div>
            <div v-else class="text-center text-gray-500 mb-4">
                Nenhuma avaliação adicionada ainda.
            </div>
            <div class="text-center border-t pt-4">
               <Button @click="insertTest" variant="success-outline" :disabled="!selectedFacility._id || !selectedEquipment._id">
                   <FontAwesomeIcon :icon="['fas', 'plus']" class="mr-2"/> Adicionar Avaliação
               </Button>
           </div>
        </div>

        <!-- Add/Edit Test Form -->
        <div v-else>
            <h3 class="text-lg font-semibold mb-4 border-b pb-2">Informações do EPI Avaliado</h3>
             <div v-if="errorAddingTest" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                 <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" /> {{ errorAddingTest }}
             </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <Input
                    label="Ordem de Serviço"
                    id="service-order"
                    v-model="currentTest.serviceOrder"
                    :icon="['fas', 'list-alt']"
                />
                 <Select
                     label="Equipamento (Tipo de EPI)"
                     id="epi-type"
                     v-model="currentTest.epiType"
                     :options="epiTypesOptions"
                     required
                     :icon="['fas', 'hard-hat']" /> 
                 <Select
                     label="Tamanho"
                     id="size"
                     v-model="currentTest.size"
                     :options="sizesOptions"
                     required
                     :icon="['fas', 'text-height']" /> 
                 <Input
                     label="Cor"
                     id="color"
                     v-model="currentTest.color"
                     :icon="['fas', 'palette']" /> // Adjusted icon
                 <Input
                     label="Identificação (Nº Série/Patrimônio)"
                     id="identification"
                     v-model="currentTest.identification"
                     required
                     :icon="['fas', 'tag']" /> 
                 <Input
                     label="CA"
                     id="ca"
                     v-model="currentTest.ca"
                     optional
                     :icon="['fas', 'certificate']" /> 
                 <Input
                     label="Setor"
                     id="sector"
                     v-model="currentTest.sector"
                     :icon="['fas', 'map-pin']" /> 
                 <Select
                     label="Finalidade de Uso"
                     id="use-goal"
                     v-model="currentTest.useGoal"
                     :options="useGoalsOptions"
                     required
                     :icon="['fas', 'bullseye']" /> 
                 <Select
                     label="Avaliação"
                     id="avaliation"
                     v-model="currentTest.avaliation"
                     :options="avaliationsOptions"
                     required
                     :icon="['fas', 'check-circle']" /> 
                 <Input
                     type="date"
                     label="Data da Avaliação"
                     id="date"
                     v-model="currentTest.date"
                     required
                     :invalid="invalidDate"
                     :icon="['fas', 'calendar-alt']"
                 />
                 <Input
                     type="date"
                     label="Validade"
                     id="validity"
                     v-model="currentTest.validity"
                     optional
                     :invalid="invalidValidity"
                     :icon="['fas', 'calendar-times']"
                 />
                 <Input
                    label="Nome do Arquivo (Certificado)"
                    id="title"
                    v-model="currentTest.title"
                    required
                    :icon="['fas', 'file-alt']"
                    class="md:col-span-2"
                />
            </div>
             <div class="flex justify-center space-x-4 mt-6 border-t pt-4">
                <Button @click="saveTest" variant="success-outline">Salvar Avaliação</Button>
                <Button @click="cancelAddTest" variant="danger-outline">Cancelar</Button>
             </div>
        </div>
      </div>

      <!-- Final Submit Button -->
       <div v-if="!addingTest" class="flex justify-center mt-8">
           <Button type="submit" variant="success" size="lg" :disabled="tests.length === 0 || loading">
               <FontAwesomeIcon v-if="loading" :icon="['fas', 'spinner']" spin class="mr-2"/>
               Finalizar e Gerar Certificados
           </Button>
       </div>

    </form>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment-timezone';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'; // Import necessary pdf-lib items
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import debounce from 'lodash/debounce';

import auth from '@/services/authentication';
import permission from '@/services/permissions'; // Assuming permission helper exists
import Layout from '@/components/common/Layout.vue';
import Input from '@/components/ui/Input.vue';

import Select from '@/components/ui/Select.vue'; // Assuming Select component
import Button from '@/components/ui/Button.vue'; // Assuming Button component
import Modal from '@/components/common/Modal.vue'; // Assuming Modal component

// --- State ---
const router = useRouter();
const currentUser = ref(auth.currentUser() || {});

// Modals and Loading
const uploadProgressModalVisible = ref(false);
const showLoadingModal = ref(false);
const loadingMessage = ref('');
const loading = ref(false); // General loading state for final submission
const error = ref(''); // General errors
const errorEquipment = ref(''); // Errors related to equipment selection/creation
const errorAddingTest = ref(''); // Errors specific to adding a single test/EPI

// Facility State
const searchFacilityQuery = ref('');
const loadingFacility = ref(false);
const facilityResults = ref([]);
const selectedFacility = ref({});
const facilityAddress = computed({ // Make address computed based on selected facility
    get: () => selectedFacility.value?.address || '',
    set: (val) => { /* Usually address comes from selected facility, disable direct editing if needed */ }
});

// Equipment State
const searchEquipmentQuery = ref('');
const loadingEquipment = ref(false);
const equipmentResults = ref([]);
const selectedEquipment = ref({});
const createEquipment = ref(false);
const newEquipment = reactive({
    type: '',
    localization: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    patrimonialNumber: '',
    facility: null, // Will be set when registering
});
const equipmentTypesOptions = ref([ // TODO: Fetch these from API or define constants
    { value: 'Monitor de Contaminação', label: 'Monitor de Contaminação' },
    { value: 'Monitor de Taxa de Exposição', label: 'Monitor de Taxa de Exposição' },
    // Add other equipment types
]);


// Avaliation Mode State
const avaliationMode = ref(''); // e.g., 'Avaliação de Rotina', 'Avaliação Inicial'
const avaliationModesOptions = ref([ // TODO: Fetch or define constants
    { value: 'Avaliação de Rotina', label: 'Avaliação de Rotina' },
    { value: 'Avaliação Inicial', label: 'Avaliação Inicial' },
    // Add other modes
]);

// Test/EPI State
const addingTest = ref(false); // Flag to show the add/edit EPI form
const tests = ref([]); // Array to hold saved EPI evaluation objects
const currentTest = reactive({ // Holds data for the EPI being added/edited
    serviceOrder: '',
    epiType: '',
    size: '',
    color: '',
    identification: '',
    ca: '',
    sector: '',
    useGoal: '',
    avaliation: '',
    date: moment().format('YYYY-MM-DD'), // Default to today
    validity: '',
    title: '', // Default filename suggestion
});

// Select Options (Define or fetch these)
const epiTypesOptions = ref([{ value: 'Avental Plumbífero', label: 'Avental Plumbífero' }, { value: 'Protetor de Tireóide', label: 'Protetor de Tireóide' } /*...*/]);
const sizesOptions = ref([{ value: 'P', label: 'P' }, { value: 'M', label: 'M' }, { value: 'G', label: 'G' } /*...*/]);
const useGoalsOptions = ref([{ value: 'Hemodinâmica', label: 'Hemodinâmica' }, { value: 'Centro Cirúrgico', label: 'Centro Cirúrgico' } /*...*/]);
const avaliationsOptions = ref([{ value: 'Aprovado', label: 'Aprovado' }, { value: 'Reprovado', label: 'Reprovado' } /*...*/]);

// Upload Progress State
const uploadProgress = ref(0);
const uploadErrorProgress = ref(0);
const uploadErrors = ref([]);


// --- Computed Properties ---

const invalidDate = computed(() => {
  // Basic validation: check if date is empty or potentially invalid format
  return !currentTest.date;
});

const invalidValidity = computed(() => {
  // Optional validation: Check if validity is before the test date
  if (currentTest.validity && currentTest.date) {
    return moment(currentTest.validity).isBefore(moment(currentTest.date));
  }
  return false;
});

const equipmentDisplayName = (equip) => {
    if (!equip || !equip.type) return '';
    const parts = [
        equip.type,
        equip.patrimonialNumber ? `Pat: ${equip.patrimonialNumber}` : '',
        equip.serialNumber ? `S/N: ${equip.serialNumber}` : '',
    ];
    return parts.filter(Boolean).join(' - ');
};

// --- Methods ---

// Facility Search & Selection
const searchFacility = async () => {
    if (searchFacilityQuery.value.trim().length < 2) {
        facilityResults.value = [];
        return;
    }
    loadingFacility.value = true;
    error.value = '';
    try {
        const response = await axios.get(auth.apiUrl() + 'facilities', {
            headers: { Authorization: `Bearer ${auth.getToken()}` },
            params: { 'filters[name]': searchFacilityQuery.value, 'filters[limit]': 10 } // Adjust filter param as needed
        });
        facilityResults.value = response.data.list || [];
    } catch (err) {
        console.error("Erro ao buscar instalação:", err);
        error.value = 'Falha ao buscar instalação.';
        facilityResults.value = [];
    } finally {
        loadingFacility.value = false;
    }
};
const debouncedSearchFacility = debounce(searchFacility, 300);

const selectFacility = (facility) => {
    selectedFacility.value = facility;
    searchFacilityQuery.value = facility.name; // Update input display
    facilityResults.value = []; // Clear results
    searchEquipmentQuery.value = ''; // Clear equipment search
    selectedEquipment.value = {};
    equipmentResults.value = [];
};

const removeSelectedFacility = () => {
    selectedFacility.value = {};
    searchFacilityQuery.value = '';
    // Also clear dependent selections like equipment
    removeSelectedEquipment();
};

// Equipment Search & Selection
const searchEquipment = async () => {
     if (searchEquipmentQuery.value.trim().length < 2 || !selectedFacility.value._id) {
         equipmentResults.value = [];
         return;
     }
     loadingEquipment.value = true;
     errorEquipment.value = '';
     try {
         const response = await axios.get(auth.apiUrl() + `facility/${selectedFacility.value._id}/equipments`, { // Assuming endpoint exists
             headers: { Authorization: `Bearer ${auth.getToken()}` },
             params: { search: searchEquipmentQuery.value, limit: 10 } // Adjust params as needed
         });
          // Filter for EPI-related equipment if necessary, or adjust API
          // For now, assuming API returns relevant equipment or all equipment for the facility
         equipmentResults.value = response.data || []; // Adjust based on actual API response structure
     } catch (err) {
         console.error("Erro ao buscar equipamento:", err);
         errorEquipment.value = 'Falha ao buscar equipamento.';
         equipmentResults.value = [];
     } finally {
         loadingEquipment.value = false;
     }
 };
const debouncedSearchEquipment = debounce(searchEquipment, 300);

const selectEquipment = (equipment) => {
    selectedEquipment.value = equipment;
    searchEquipmentQuery.value = equipmentDisplayName(equipment);
    equipmentResults.value = []; // Clear results
};

const removeSelectedEquipment = () => {
    selectedEquipment.value = {};
    searchEquipmentQuery.value = '';
    equipmentResults.value = [];
};

// Create New Equipment
const openCreateEquipment = () => {
    createEquipment.value = true;
    errorEquipment.value = ''; // Clear previous errors
    // Reset new equipment form
    Object.assign(newEquipment, {
        type: '', localization: '', manufacturer: '', model: '', serialNumber: '', patrimonialNumber: '', facility: null,
    });
};

const closeCreateEquipment = () => {
    createEquipment.value = false;
};

const registerEquipment = async () => {
    if (!selectedFacility.value._id) {
        errorEquipment.value = "Selecione uma instalação primeiro.";
        return;
    }
    if (!newEquipment.type || !newEquipment.serialNumber) {
         errorEquipment.value = "Tipo e Número de Série são obrigatórios para criar equipamento.";
         return;
    }

    loading.value = true; // Use general loading or a specific one
    loadingMessage.value = 'Registrando novo equipamento...';
    showLoadingModal.value = true;
    errorEquipment.value = '';

    try {
        newEquipment.facility = selectedFacility.value._id;
        const response = await axios.post(auth.apiUrl() + 'equipment', newEquipment, {
            headers: { Authorization: `Bearer ${auth.getToken()}` },
        });
        selectEquipment(response.data); // Select the newly created equipment
        createEquipment.value = false; // Close creation form
    } catch (err) {
        console.error("Erro ao registrar equipamento:", err);
        errorEquipment.value = err.response?.data?.message || 'Falha ao registrar equipamento.';
    } finally {
        loading.value = false;
        showLoadingModal.value = false;
        loadingMessage.value = '';
    }
};

// Add/Manage Tests (EPI Evaluations)
const insertTest = () => {
    if (!selectedFacility.value._id || !selectedEquipment.value._id) {
        error.value = "Selecione a Instalação e o Equipamento utilizado antes de adicionar uma avaliação.";
        return;
    }
    addingTest.value = true;
    errorAddingTest.value = '';
    // Reset currentTest form, potentially pre-fill title
    Object.assign(currentTest, {
         serviceOrder: '', epiType: '', size: '', color: '', identification: '', ca: '', sector: '', useGoal: '', avaliation: '',
         date: moment().format('YYYY-MM-DD'), validity: '',
         title: `AV_${selectedFacility.value.name?.replace(/\s+/g, '_') || 'FACILITY'}_${currentTest.identification || 'IDENT'}_${moment().format('YYYYMMDD')}` // Example title
     });
};

const cancelAddTest = () => {
    addingTest.value = false;
    errorAddingTest.value = '';
};

const validateCurrentTest = () => {
    if (!currentTest.epiType || !currentTest.size || !currentTest.identification || !currentTest.useGoal || !currentTest.avaliation || !currentTest.date || !currentTest.title) {
        errorAddingTest.value = 'Preencha todos os campos obrigatórios do EPI.';
        return false;
    }
     if (invalidDate.value || invalidValidity.value) {
         errorAddingTest.value = 'Verifique as datas da avaliação e validade.';
         return false;
     }
    // Add more specific validations if needed
    errorAddingTest.value = '';
    return true;
}

const saveTest = () => {
    if (!validateCurrentTest()) {
        return;
    }
    // Add a copy of currentTest to the tests array
    tests.value.push({ ...currentTest });
    addingTest.value = false; // Hide form, show list
};

const removeTest = (index) => {
    tests.value.splice(index, 1);
};

// Final Submission and PDF Generation
const generatePdf = async (testData) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]); // Adjust size as needed
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    let y = height - 50; // Starting Y position

    const drawText = (text, x, currentY, size = fontSize) => {
        page.drawText(text, { x, y: currentY, font, size });
        return currentY - (size * 1.5); // Return new Y position
    };

    // --- PDF Content ---
    y = drawText('Relatório de Avaliação de EPI', 50, y, 18);
    y -= 20; // Add space

    // Facility & Equipment Info
    y = drawText(`Instituição: ${selectedFacility.value?.name || 'N/A'}`, 50, y);
    y = drawText(`Endereço: ${facilityAddress.value || 'N/A'}`, 50, y);
    y = drawText(`Equipamento Utilizado: ${equipmentDisplayName(selectedEquipment.value)}`, 50, y);
    y = drawText(`Modo de Avaliação: ${avaliationMode.value || 'N/A'}`, 50, y);
    y -= 20;

    // EPI Details
    y = drawText('Detalhes do EPI Avaliado', 50, y, 14);
    y = drawText(`OS: ${testData.serviceOrder || '-'}`, 70, y);
    y = drawText(`Tipo EPI: ${testData.epiType}`, 70, y);
    y = drawText(`Tamanho: ${testData.size}`, 70, y);
    y = drawText(`Cor: ${testData.color || '-'}`, 70, y);
    y = drawText(`Identificação: ${testData.identification}`, 70, y);
    y = drawText(`CA: ${testData.ca || '-'}`, 70, y);
    y = drawText(`Setor: ${testData.sector || '-'}`, 70, y);
    y = drawText(`Finalidade: ${testData.useGoal}`, 70, y);
    y = drawText(`Data Avaliação: ${moment(testData.date).format('DD/MM/YYYY')}`, 70, y);
    y = drawText(`Validade: ${testData.validity ? moment(testData.validity).format('DD/MM/YYYY') : '-'}`, 70, y);
    y -= 10;
    y = drawText(`Resultado: ${testData.avaliation}`, 50, y, 14); // Highlight result?

    // Add more details, signatures, etc. as needed

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
};


const finishTest = async () => {
    if (tests.value.length === 0) {
        error.value = "Adicione pelo menos uma avaliação de EPI antes de finalizar.";
        return;
    }

    loading.value = true;
    uploadProgressModalVisible.value = true;
    uploadProgress.value = 0;
    uploadErrorProgress.value = 0;
    uploadErrors.value = [];
    error.value = '';

    const totalTests = tests.value.length;

    for (const test of tests.value) {
        try {
            const pdfBlob = await generatePdf(test);
            const formData = new FormData();

            formData.append('file', pdfBlob, `${test.title}.pdf`);
            formData.append('name', test.title);
            formData.append('facility', selectedFacility.value._id);
            formData.append('equipment', selectedEquipment.value._id);
            formData.append('testId', '5cb5d3865e719264dd704b67'); // Hardcoded EPI Test ID
            formData.append('status', 'ativo'); // Or determine status based on avaliation
            formData.append('date', moment(test.date).toISOString());
            if (test.validity) {
                 formData.append('validity', moment(test.validity).toISOString());
            }
            // Append other relevant data from 'test' object as needed by the backend
            formData.append('conclusion', test.avaliation); // Example
             formData.append('metadata[serviceOrder]', test.serviceOrder);
             formData.append('metadata[epiType]', test.epiType);
             formData.append('metadata[size]', test.size);
             formData.append('metadata[color]', test.color);
             formData.append('metadata[identification]', test.identification);
             formData.append('metadata[ca]', test.ca);
             formData.append('metadata[sector]', test.sector);
             formData.append('metadata[useGoal]', test.useGoal);
             formData.append('metadata[avaliationMode]', avaliationMode.value);


            await axios.post(auth.apiUrl() + 'documents', formData, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`,
                    'Content-Type': 'multipart/form-data'
                 }
            });
            uploadProgress.value += 1 / totalTests;

        } catch (err) {
            console.error(`Erro ao fazer upload do teste "${test.title}":`, err);
            const errorMessage = err.response?.data?.message || `Falha no upload: ${test.title}`;
            uploadErrors.value.push(errorMessage);
            uploadErrorProgress.value += 1 / totalTests;
        }
    }

    loading.value = false;
    // Keep modal open until user closes it if there were errors, or potentially auto-close/redirect on full success
     if (uploadErrorProgress.value === 0) {
        // Optionally add a small delay then redirect
        setTimeout(() => {
            uploadProgressModalVisible.value = false;
             // Redirect to the list view or facility page
            router.push({ name: 'EpiAssessmentList' }); // Adjust route name as needed
        }, 1500);
     }
};


// --- Lifecycle ---
onMounted(() => {
  // Fetch options for selects if needed
  // Example: fetchEquipmentTypes(); fetchAvaliationModes(); etc.
});


// --- Watchers ---
watch(searchFacilityQuery, (newQuery) => {
  // Clear results if query is cleared or becomes too short
  if (!newQuery || newQuery.trim().length < 2) {
    facilityResults.value = [];
  }
});

watch(searchEquipmentQuery, (newQuery) => {
  // Clear results if query is cleared or becomes too short
  if (!newQuery || newQuery.trim().length < 2) {
    equipmentResults.value = [];
  }
});


</script>
