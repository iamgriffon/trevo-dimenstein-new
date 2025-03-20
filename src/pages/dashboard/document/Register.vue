<template>
  <Layout title="Enviar documento">
    <template #header>
      <button
        class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
      >
        <RouterLink to="/document">
          <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
        </RouterLink>
      </button>
    </template>

    <div class="flex flex-col gap-6 w-full mb-10">
      <!-- Document Information -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div
          v-if="error"
          class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        >
          <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" class="mr-2" />
          {{ error }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-file" class="mr-2" /> Nome
            </label>
            <Input v-model="doc.name" placeholder="Nome" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-calendar-alt" class="mr-2" /> Validade
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input type="date" v-model="doc.validity" class="w-full" />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-file-archive" class="mr-2" /> Arquivo
            <span class="text-sm text-gray-500 ml-1">arquivo deve estar no formato .pdf</span>
          </label>
          <input
            type="file"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            @change="onFileChange"
            accept="application/pdf"
          />
        </div>
      </div>

      <!-- QR Code Options -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center mb-4">
          <input
            type="checkbox"
            :checked="doc.hash !== ''"
            @click="generateCode()"
            class="w-4 h-4 text-green-600 bg-gray-100 rounded border-gray-300 focus:ring-green-500"
          />
          <label class="ml-2 text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon="fa-solid fa-qrcode" class="mr-2" /> Adicionar assinatura e código
            <span v-if="doc.hash" class="text-sm text-gray-500 ml-1">{{ 'id: ' + doc.hash }}</span>
          </label>
        </div>

        <div v-if="doc.hash" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            @click="doc.mode = 'first'"
            :className="
              doc.mode === 'first'
                ? 'bg-green-600 text-white'
                : 'border border-green-600 text-green-600 hover:bg-green-50'
            "
          >
            primeira página
          </Button>
          <Button
            @click="doc.mode = 'all'"
            :className="
              doc.mode === 'all'
                ? 'bg-green-600 text-white'
                : 'border border-green-600 text-green-600 hover:bg-green-50'
            "
          >
            todas as páginas
          </Button>
          <Button
            @click="doc.mode = 'last'"
            :className="
              doc.mode === 'last'
                ? 'bg-green-600 text-white'
                : 'border border-green-600 text-green-600 hover:bg-green-50'
            "
          >
            última página
          </Button>
        </div>
      </div>

      <!-- Facility Selection -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-medium mb-2">
          <FontAwesomeIcon icon="fa-regular fa-building" class="mr-2" /> Instalação
        </h3>
        <p class="mb-4 text-gray-600">Selecione a instalação deste arquivo</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="facility in facilities"
            :key="facility._id"
            class="bg-white rounded-lg shadow overflow-hidden transition-all duration-300"
            :class="{ 'ring-2 ring-green-600': doc.facility._id === facility._id }"
          >
            <div
              class="w-full h-36 bg-cover bg-center opacity-60"
              :style="{ backgroundImage: `url(${facility.backgroundImg})` }"
            ></div>
            <div class="relative -mt-16 flex justify-center">
              <img
                :src="facility.logoImg"
                class="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
                alt="Logo da instalação"
              />
            </div>
            <div class="p-4 text-center">
              <h4 class="font-medium text-lg mb-3">{{ facility.name }}</h4>
              <Button
                v-if="doc.facility._id !== facility._id"
                @click="selectFacility(facility)"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                <FontAwesomeIcon icon="fa-solid fa-check" class="mr-2" /> selecionar
              </Button>
              <Button
                v-else
                @click="removeFacility"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                <FontAwesomeIcon icon="fa-solid fa-times" class="mr-2" /> remover
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <Button
        className="py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
        @click="register"
      >
        Enviar documento
      </Button>
    </div>

    <!-- Loading Modal -->
    <Modal :visible="loading" title="Upload em andamento" @update:visible="loading = false">
      <div class="flex flex-col items-center justify-center py-4">
        <p class="mb-4 text-center">Fazendo upload do documento...</p>
        <img src="/static/img/loading.gif" alt="Loading" class="max-w-xs" />
      </div>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment-timezone';
import axios from 'axios';
import Hashids from 'hashids';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '@/services/authentication';
import Layout from '@/components/common/Layout.vue';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/common/Modal.vue';

const router = useRouter();
const loading = ref(false);
const filter = ref('');
const currentUser = ref(auth.currentUser());
const facilities = ref([]);
const error = ref('');

// Document data
const doc = ref({
  facility: {},
  hash: '',
  mode: '',
  name: '',
  data: null,
  validity: null
});

// Watch for loading state to display modal
watch(loading, (newVal) => {
  if (newVal) {
    // Modal is handled by the Modal component in the template
  }
});

// Methods
const register = () => {
  if (!doc.value.name) {
    error.value = 'O campo nome é obrigatório';
    return;
  }

  if (!doc.value.data) {
    error.value = 'É necessário fazer upload de um arquivo';
    return;
  }

  if (!doc.value.facility._id) {
    error.value = 'Selecione uma instalação';
    return;
  }

  const credentials = {
    name: doc.value.name,
    data: doc.value.data,
    mode: doc.value.mode,
    uploadedAt: new Date(),
    uploadedBy: { _id: currentUser.value.id, name: currentUser.value.name },
    hash: doc.value.hash,
    facility: { _id: doc.value.facility._id, name: doc.value.facility.name }
  };

  if (doc.value.validity) {
    credentials.validity = moment(doc.value.validity);
  }

  loading.value = true;
  auth.registerDocument(null, credentials, '/document')
    .catch(err => {
      loading.value = false;
      error.value = err.response?.data || 'Erro ao enviar documento';
    });
};

const selectFacility = (facility) => {
  doc.value.facility = facility;
};

const removeFacility = () => {
  doc.value.facility = {};
};

const generateCode = () => {
  if (doc.value.hash === '') {
    const hashids = new Hashids('AKJSBDalsdabskJASd', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
    doc.value.hash = hashids.encode(
      Math.floor((Math.random() * 100) + 1),
      Math.floor((Math.random() * 100) + 1),
      Math.floor((Math.random() * 100) + 1)
    );
    doc.value.mode = 'last';
  } else {
    doc.value.hash = '';
  }
};

const onFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  createFile(files[0]);
};

const createFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    doc.value.data = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Load facilities on component mount
const loadFacilities = async () => {
  try {
    const response = await axios.get(`${auth.apiUrl()}facilities/`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
      params: {
        pageSize: 10,
        pageNum: 1,
        limit: 10
      }
    });

    if (response.data.length === 0) {
      error.value = 'Nenhuma instalação encontrada';
      return;
    }

    facilities.value = response.data.map(facility => ({
      _id: facility._id,
      name: facility.name,
      backgroundImg: facility.backgroundImg,
      logoImg: facility.logoImg
    }));
  } catch (err) {
    error.value = err.response?.data || 'Erro ao carregar instalações';
  }
};

// Initialize data
loadFacilities();
</script>

<style scoped>
div.main {
  z-index: 0;
  padding-top: 82px;
  padding-left: 28px;
}

[data-letters-list]:before {
  content:attr(data-letters-list);
  display:inline-block;
  font-size:1em;
  width:3em;
  height:3em;
  line-height:3em;
  text-align:center;
  border-radius:50%;
  background: #00a767;
  vertical-align:middle;
  margin-right:1em;
  color:white;
}

.background-img {
  opacity: 0.6;
  z-index: 0;
  min-height: 150px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: center no-repeat;
  background-size: cover;
}

.logo-img {
  z-index: 1;
  position: relative;
  background: center no-repeat;
  -webkit-box-shadow: 0px 0px 25px 0px rgba(0,0,0,0.1);
  -moz-box-shadow: 0px 0px 25px 0px rgba(0,0,0,0.1);
  box-shadow: 0px 0px 25px 0px rgba(0,0,0,0.1);
}

.logo-circle {
  z-index: 1;
  top: -45px;
}

.up-25 {
  position: relative;
  top: -30px;
}

.facility-hyper-card {
  border: 3px solid rgba(62,57,107,0.07);
  transition: 0.2s;
}

.facility-hyper-card-selected {
  border: 3px solid #00a767;
}

.btn.btn-outline-metalic-seaweed.active {
  color: white;
  background-color: #028090;
}
</style>
