<template>
  <Layout :title="`Registrar ${testName || 'Teste'}`" :loading="loading">
    <template #breadcrumb>
      <router-link
        :to="`/facility/${facility._id}`"
        class="px-2 text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name || "Instalação" }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/equipments/${equipment.typeId}/${equipment._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ equipmentTitleShort }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/equipments/${equipment.typeId}/${equipment._id}/${test._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ testName }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800 select-none">Registrar</span>
    </template>
    <template #header>
      <div class="flex gap-2 items-center mb-6">
        <router-link
          class="flex items-center gap-2 px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
          :to="`/equipments/${equipment.typeId}/${equipment._id}/${testTypeId.value}`"
        >
          <FontAwesomeIcon :icon="['fas', 'arrow-left']" />
          <span class="hidden md:inline">Voltar</span>
        </router-link>
        <!-- Submit button will be at the bottom -->
      </div>
    </template>
    <div class="max-w-4xl mx-auto p-4">
      <!-- Form Content -->
      <h1 class="text-2xl font-semibold mb-6">Registrar Novo Teste</h1>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Erro!</strong>
        <span class="block sm:inline"> {{ error }}</span>
      </div>

      <!-- File Upload -->
      <div class="mb-6 p-6 bg-white rounded-lg shadow-md">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          <FontAwesomeIcon :icon="['fas', 'file-pdf']" class="mr-2" />
          Arquivo do Teste (.pdf)
        </label>
        <div
          class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
          :class="{ 'border-red-500 bg-red-50': invalidFile }"
          @dragover.prevent @dragenter="dragging = true" @dragleave="dragging = false" @drop.prevent="handleDrop"
        >
          <div class="space-y-1 text-center">
            <FontAwesomeIcon :icon="['fas', 'cloud-upload-alt']" class="mx-auto h-12 w-12 text-gray-400" />
            <div class="flex text-sm text-gray-600">
              <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Selecione o arquivo</span>
                <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileChange" accept=".pdf">
              </label>
              <p class="pl-1">ou arraste e solte</p>
            </div>
            <p class="text-xs text-gray-500">PDF até 10MB</p>
            <p v-if="selectedFile" class="text-sm text-green-600 font-semibold mt-2">
              <FontAwesomeIcon :icon="['fas', 'check-circle']" class="mr-1"/>
              {{ selectedFile.name }} selecionado
            </p>
             <p v-if="invalidFile" class="text-xs text-red-500">Por favor, selecione um arquivo PDF.</p>
          </div>
        </div>
      </div>

      <!-- Test Details -->
      <div class="mb-6 p-6 bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
         <Input
            id="test-name"
            v-model="test.name"
            label="Nome do Documento"
            type="text"
            placeholder="Ex: Teste Semanal - 01/01/2024"
            :icon="['far', 'file']"
          />
         <Input
            id="test-date"
            v-model="test.date"
            label="Data de Realização"
            type="date"
            :icon="['far', 'calendar-alt']"
             :error="invalidDate"
          />
         <Input
            id="test-validity"
            v-model="test.validity"
            label="Validade (Opcional)"
            type="date"
            :icon="['far', 'calendar-alt']"
             :error="invalidValidity"
          />
        <div>
           <label for="test-status" class="block text-gray-700 text-sm font-bold mb-2">
             <FontAwesomeIcon :icon="['far', 'check-square']" class="mr-2"/>Status
           </label>
            <select
                id="test-status"
                v-model="test.status"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                :class="{ 'border-red-500': invalidStatus }"
             >
                 <option value="" disabled>Selecione o status</option>
                 <option v-for="option in statusOptions" :key="option" :value="option">
                     {{ option }}
                 </option>
            </select>
           <p v-if="invalidStatus" class="text-xs text-red-500 mt-1">Selecione um status.</p>
        </div>
         <div v-if="conclusionOptions.length > 0">
           <label for="test-conclusion" class="block text-gray-700 text-sm font-bold mb-2">
             <FontAwesomeIcon :icon="['far', 'check-circle']" class="mr-2"/>Conclusão
           </label>
            <select
                id="test-conclusion"
                v-model="test.conclusion"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                :class="{ 'border-red-500': invalidConclusion }"
            >
                 <option value="" disabled>Selecione a conclusão</option>
                 <option v-for="option in conclusionOptions" :key="option" :value="option">
                     {{ option }}
                 </option>
             </select>
            <p v-if="invalidConclusion" class="text-xs text-red-500 mt-1">Selecione uma conclusão.</p>
         </div>
      </div>

      <!-- Fixed Info -->
       <div class="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center text-gray-700">
             <FontAwesomeIcon :icon="['far', 'building']" class="mr-2 text-gray-500"/>
             <strong>Instalação:</strong>&nbsp;{{ facility.name }}
           </div>
           <div class="flex items-center text-gray-700">
             <FontAwesomeIcon :icon="['fas', 'cubes']" class="mr-2 text-gray-500"/>
             <strong>Equipamento:</strong>&nbsp;{{ equipmentTitleShort }}
           </div>
       </div>


      <!-- Signature Section -->
      <div class="mb-6 p-6 bg-white rounded-lg shadow-md" v-if="permission.canSign(currentUser)">
        <div class="flex items-center mb-4">
          <input id="add-signature" type="checkbox" v-model="addSignature" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
          <label for="add-signature" class="ml-2 block text-sm text-gray-900">
            <FontAwesomeIcon :icon="['fas', 'qrcode']" class="mr-1" />
            Adicionar assinatura e código QR
          </label>
        </div>
         <small v-if="test.hash" class="block text-sm text-gray-500 mb-4">Código: {{ test.hash }}</small>

        <div v-if="addSignature" class="space-y-4">
           <div>
             <strong class="block text-sm font-medium text-gray-700 mb-2">Posição da Assinatura:</strong>
             <div class="flex justify-around items-center">
               <button v-for="pos in signaturePositions" :key="pos.value"
                       @click="test.position = pos.value"
                       :class="['p-2 border rounded-md hover:bg-gray-100', test.position === pos.value ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-gray-300']"
                       :title="pos.label">
                 <img class="h-16 w-16 object-contain" :src="pos.imgSrc" :alt="pos.label">
               </button>
             </div>
           </div>
            <div>
             <strong class="block text-sm font-medium text-gray-700 mb-2">Páginas Assinadas:</strong>
             <div class="flex flex-col sm:flex-row gap-2">
                <button v-for="mode in signatureModes" :key="mode.value"
                        @click="test.mode = mode.value"
                        :class="['flex-1 px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500', test.mode === mode.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50']">
                  {{ mode.label }}
                </button>
              </div>
            </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="mb-6 p-6 bg-white rounded-lg shadow-md">
         <h3 class="text-lg font-medium mb-4">Comentários</h3>
          <div v-if="test.comments.length > 0" class="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
            <div v-for="(comment, index) in test.comments" :key="index" class="bg-gray-50 p-3 rounded-md border border-gray-200">
               <div class="flex justify-between items-center text-xs text-gray-500 mb-1">
                 <span><FontAwesomeIcon :icon="['far', 'user']"/> {{ comment.commentedBy.name }}</span>
                 <span><FontAwesomeIcon :icon="['far', 'calendar']"/> {{ formatDisplayDate(comment.commentedAt) }}</span>
               </div>
               <p class="text-sm text-gray-800">{{ comment.text }}</p>
            </div>
          </div>
           <div v-if="test.comments.length === 0" class="text-sm text-gray-500 italic mb-4">
             Nenhum comentário adicionado ainda.
           </div>

           <div v-if="openCommentaryBox">
             <label for="comment-text" class="block text-sm font-medium text-gray-700">Adicionar Novo Comentário:</label>
             <textarea id="comment-text" v-model="commentaryText" rows="3" class="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
              <div class="mt-2 flex justify-end gap-2">
                 <button @click="openCommentaryBox = false" type="button" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                   Cancelar
                 </button>
                 <button @click="addComment" type="button" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                   Adicionar Comentário
                 </button>
               </div>
            </div>
           <button v-else @click="openCommentaryBox = true" type="button" class="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
             <FontAwesomeIcon :icon="['far', 'comment']" class="-ml-1 mr-2 h-5 w-5 text-gray-500"/>
             Adicionar Comentário
           </button>
      </div>


      <!-- Submit Button -->
      <div class="mt-8 flex justify-end">
        <button
          @click="register"
          :disabled="loading"
          class="flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          <FontAwesomeIcon v-if="loading" :icon="['fas', 'spinner']" class="animate-spin mr-2" />
          {{ loading ? 'Enviando...' : 'Enviar Documento' }}
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Hashids from 'hashids';

import auth from '@/services/authentication';
import permission from '@/services/permissions';
import Layout from '@/components/common/Layout.vue';
import Input from '@/components/ui/Input.vue'; // Assuming Input component exists

// --- Composables ---
const route = useRoute();
const router = useRouter();

// --- State ---
const loading = ref(false);
const error = ref('');
const currentUser = ref({});
const facility = ref({});
const equipment = ref({});
const testName = ref(''); // Original test type name
const test = ref({
  name: '',
  date: '',
  validity: '',
  uploadedAt: '',
  _id: '', // Test Type ID
  facility: {}, // Only need ID? Check registerDocument logic
  equipment: {}, // Only need ID? Check registerDocument logic
  hash: '',
  mode: 'last', // Default signature mode
  position: 'bl', // Default signature position
  conclusion: '',
  status: '',
  comments: [],
  data: null, // To store base64 file data
});
const files = ref([]); // For potential vue-upload-component use if kept
const selectedFile = ref(null); // Store the File object
const dragging = ref(false); // For drag-n-drop UI

const invalidDate = ref(false);
const invalidFile = ref(false);
const invalidStatus = ref(false);
const invalidConclusion = ref(false);
const invalidValidity = ref(false);
const openCommentaryBox = ref(false);
const commentaryText = ref('');
const addSignature = ref(false); // Checkbox state for signature

const statusOptions = ref(['Em andamento', 'Corrigir', 'Falta assinar']); // Initial state
const conclusionOptions = ref(['Satisfatório', 'Satisfatório com observações', 'Insatisfatório']);

const signaturePositions = [
  { value: 'tl', label: 'Superior Esquerdo', imgSrc: '/static/top_left.png' },
  { value: 'tr', label: 'Superior Direito', imgSrc: '/static/top_right.png' },
  { value: 'bl', label: 'Inferior Esquerdo', imgSrc: '/static/bottom_left.png' },
  { value: 'br', label: 'Inferior Direito', imgSrc: '/static/bottom_right.png' },
];

const signatureModes = [
   { value: 'first', label: 'Primeira Página' },
   { value: 'all', label: 'Todas as Páginas' },
   { value: 'last', label: 'Última Página' },
];


// --- Computed Properties ---
const equipmentId = computed(() => route.params.equipmentId);
const testTypeId = computed(() => route.params.id);

const equipmentTitle = computed(() => {
  if (!equipment.value.type) return 'Equipamento';
  const patrimonial = equipment.value.patrimonialNumber || '';
  const serial = equipment.value.serialNumber || '';
  const separator = patrimonial && serial ? ' - ' : '';
  return `${equipment.value.type} ${patrimonial}${separator}${serial}`.trim();
});

const equipmentTitleShort = computed(() => {
    if (!equipment.value.type) return 'ID';
    const patrimonial = equipment.value.patrimonialNumber || '';
    const serial = equipment.value.serialNumber || '';
    const separator = patrimonial && serial ? '-' : '';
    return `${patrimonial}${separator}${serial}`.trim() || equipment.value.type || 'Detalhes';
});

// --- Watchers ---
watch(addSignature, (newVal) => {
  if (!newVal) {
    test.value.hash = '';
    test.value.mode = 'last';
    test.value.position = 'bl';
  } else {
    generateCode(); // Generate code when checkbox is checked
  }
  updateStatusOptions(); // Update status options based on signature requirement
});

watch(() => test.value.hash, (newVal) => {
    // If signature is added externally (less likely), sync checkbox
    if (newVal && !addSignature.value) {
        addSignature.value = true;
    }
    // If hash is removed externally, uncheck
    if (!newVal && addSignature.value) {
         addSignature.value = false;
    }
    updateStatusOptions(); // Also update options if hash changes directly
});

// --- Methods ---
const formatDisplayDate = (date) => {
    return date ? moment(date).format('DD/MM/YYYY') : 'N/A';
};

const updateStatusOptions = () => {
  const canSign = permission.canSign(currentUser.value);
  if (addSignature.value && canSign) {
    statusOptions.value = ['Assinado', 'Liberado'];
     // Default to 'Assinado' if adding signature
     if (!test.value.status || !statusOptions.value.includes(test.value.status)) {
         test.value.status = 'Assinado';
     }
  } else if (canSign) {
    statusOptions.value = ['Em andamento', 'Corrigir', 'Falta assinar', 'Assinado', 'Liberado'];
  } else {
    statusOptions.value = ['Em andamento', 'Corrigir', 'Falta assinar'];
     // Reset status if 'Assinado'/'Liberado' are no longer options
     if (test.value.status === 'Assinado' || test.value.status === 'Liberado') {
         test.value.status = 'Falta assinar'; // Or another appropriate default
     }
  }
   // If current status is no longer valid, reset it (optional, depends on desired UX)
   if (test.value.status && !statusOptions.value.includes(test.value.status)) {
      test.value.status = '';
   }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    processFile(file);
  } else {
    selectedFile.value = null;
    test.value.data = null;
    invalidFile.value = true;
    error.value = 'Por favor, selecione um arquivo PDF válido.';
  }
};

const handleDrop = (event) => {
  dragging.value = false;
  const file = event.dataTransfer.files[0];
   if (file && file.type === 'application/pdf') {
    processFile(file);
  } else {
    selectedFile.value = null;
    test.value.data = null;
    invalidFile.value = true;
     error.value = 'Por favor, solte um arquivo PDF válido.';
  }
};

const processFile = (file) => {
    invalidFile.value = false;
    error.value = ''; // Clear previous file errors
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        test.value.data = e.target.result; // Base64 data
        // Optionally set default name based on file, keeping user override possible
        if (!test.value.name) {
             test.value.name = file.name.replace('.pdf', '');
        }
    };
    reader.onerror = (e) => {
        console.error("FileReader error:", e);
        error.value = "Erro ao ler o arquivo.";
        selectedFile.value = null;
        test.value.data = null;
    };
    reader.readAsDataURL(file);
};


const validateForm = () => {
    invalidFile.value = !test.value.data;
    invalidDate.value = !test.value.date;
    invalidStatus.value = !test.value.status;
    invalidConclusion.value = conclusionOptions.value.length > 0 && !test.value.conclusion;
    invalidValidity.value = false; // Reset validity error

    let isValid = !invalidFile.value && !invalidDate.value && !invalidStatus.value && !invalidConclusion.value;

    if (test.value.validity && test.value.date && moment(test.value.validity).isSameOrBefore(test.value.date)) {
        error.value = 'A data de validade precisa ser posterior à data de realização.';
        invalidValidity.value = true;
        isValid = false;
    } else {
         // Clear specific validity error if condition is met or validity is empty
         if (error.value === 'A data de validade precisa ser posterior à data de realização.') {
             error.value = '';
         }
    }


    if (!isValid && !error.value) { // General error if specific ones aren't set
         error.value = 'Por favor, preencha todos os campos obrigatórios corretamente.';
    } else if (isValid) {
        error.value = ''; // Clear error if valid
    }

    return isValid;
};

const register = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  error.value = '';

  const credentials = {
    name: test.value.name.replace(/[/\?%*:|"<> ]/g, '_'), // Sanitize name
    date: moment(test.value.date).toISOString(),
    data: test.value.data, // Base64 data
    uploadedAt: new Date().toISOString(),
    uploadedBy: { _id: currentUser.value.id, name: currentUser.value.name },
    status: test.value.status,
    conclusion: test.value.conclusion,
    facility: { _id: facility.value._id, name: facility.value.name },
    equipment: { _id: equipment.value._id, name: equipmentTitleShort.value }, // Use short title or full?
    test: { _id: testTypeId.value, name: testName.value },
    comments: test.value.comments,
  };

  if (test.value.validity) {
    credentials.validity = moment(test.value.validity).toISOString();
  }

  if (addSignature.value && test.value.hash) {
     credentials.hash = test.value.hash;
     credentials.mode = test.value.mode;
     credentials.position = test.value.position;
     credentials.signedBy = { _id: currentUser.value.id, name: currentUser.value.name };
     credentials.signedAt = new Date().toISOString();
   } else {
       // Explicitly ensure these are not sent if signature is not added
       delete credentials.hash;
       delete credentials.mode;
       delete credentials.position;
       delete credentials.signedBy;
       delete credentials.signedAt;
   }


  if (test.value.status === 'Liberado') {
    credentials.liberatedBy = { _id: currentUser.value.id, name: currentUser.value.name };
    credentials.liberatedAt = new Date().toISOString();
  }

  try {
    // Replace auth.registerDocument with a direct axios call
     await axios.post(auth.apiUrl() + 'test/', credentials, {
       headers: { Authorization: `Bearer ${auth.getToken()}` },
     });
    // Add success feedback if desired (e.g., using a toast notification library)
    router.push(`/equipments/${equipment.value.typeId}/${equipment.value._id}/${testTypeId.value}`);
  } catch (err) {
    console.error("Erro ao registrar documento:", err);
    error.value = err.response?.data?.message || err.message || 'Falha ao enviar o documento.';
  } finally {
    loading.value = false;
  }
};

const generateCode = () => {
  if (addSignature.value) { // Only generate if checkbox is checked
    const hashids = new Hashids('AKJSBDalsdabskJASd', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
    test.value.hash = hashids.encode(Date.now(), Math.floor(Math.random() * 1000)); // Use timestamp for better uniqueness
    // Defaults are set when checkbox is checked
    test.value.mode = test.value.mode || 'last';
    test.value.position = test.value.position || 'bl';
  } else {
    test.value.hash = ''; // Clear hash if checkbox is unchecked
  }
};

const addComment = () => {
  if (!commentaryText.value.trim()) return; // Prevent adding empty comments
  test.value.comments.push({
    commentedBy: { name: currentUser.value.name, _id: currentUser.value.id },
    commentedAt: new Date().toISOString(),
    text: commentaryText.value.trim(),
  });
  commentaryText.value = ''; // Clear textarea
  openCommentaryBox.value = false; // Close box after adding
};

const loadInitialData = async () => {
  loading.value = true;
  error.value = '';
  try {
    // Fetch Equipment
    const equipResponse = await axios.get(auth.apiUrl() + `equipment/${equipmentId.value}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    equipment.value = equipResponse.data;

    // Fetch Facility
    const facResponse = await axios.get(auth.apiUrl() + `facility/${equipment.value.facility._id}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    facility.value = facResponse.data;
    test.value.facility = { _id: facility.value._id, name: facility.value.name }; // Pre-fill facility


    // Fetch Test Type Info
    const testTypeResponse = await axios.get(auth.apiUrl() + `test/${testTypeId.value}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    testName.value = testTypeResponse.data.name;
    test.value._id = testTypeId.value; // Store test type ID

    // Set default test name
    test.value.name = `${testName.value} - ${moment().format('DD/MM/YYYY')}`;

    updateStatusOptions(); // Initialize status options based on permissions

  } catch (err) {
    console.error("Erro ao carregar dados iniciais:", err);
    error.value = err.message || 'Falha ao carregar dados iniciais.';
    // Redirect or show critical error?
  } finally {
    loading.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadInitialData();
});

</script>

<style>
/* Remove styles for vue-select error state if no longer needed */
/* .vs--error .vs__dropdown-toggle {
  border-color: #ef4444; /* red-500 */
/* } */
/* Keep other global styles if necessary, or remove if handled by Tailwind */
</style>
