<!-- src/components/Login.vue -->
<template>
  <div class="w-full max-w-3xl mx-auto">
    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
      <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" class="mr-2" /> {{ errors }}
    </div>
    
    <!-- User Basic Information -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="name">
            <FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" /> Nome
          </label>
          <Input
            id="name"
            v-model="user.name"
            type="text"
            placeholder="Nome Completo"
            :class="{ 'border-red-500': errors.has('name') }"
            name="name"
            required
          />
          <div v-if="errors.has('name')" class="mt-1 text-sm text-red-600">
            Este é um campo obrigatório. Adicione nome e sobrenome.
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="email">
            <FontAwesomeIcon icon="fa-solid fa-envelope" class="mr-2" /> Email
          </label>
          <Input
            id="email"
            v-model="user.email"
            type="email"
            placeholder="Email"
            required
            @input="user.email = $event.target.value.toLowerCase().replace(' ','').trim()"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="cpf">
            <FontAwesomeIcon icon="fa-solid fa-id-card" class="mr-2" /> CPF
            <span class="text-xs text-gray-500 ml-2">opcional</span>
          </label>
          <Input
            id="cpf"
            v-model="user.cpf"
            type="text"
            placeholder="000.000.000-00"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="telephone">
            <FontAwesomeIcon icon="fa-solid fa-phone" class="mr-2" /> Telefone
            <span class="text-xs text-gray-500 ml-2">opcional</span>
          </label>
          <Input
            id="telephone"
            v-model="user.telephone"
            type="text"
            placeholder="Telefone"
          />
        </div>
        
        <div v-if="currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin'">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="userType">
            <FontAwesomeIcon icon="fa-solid fa-id-badge" class="mr-2" /> Tipo de Usuário
            <span class="text-xs text-gray-500 ml-2">
              <a href="#" class="text-blue-500 hover:underline">como funciona?</a>
            </span>
          </label>
          <div>
            <select
              v-if="currentUser.type === 'administrador'"
              v-model="user.type"
              id="userType"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="type in ['administrador', 'rad laudos', 'rad fisico', 'rad admin', 'cliente', 'cliente MN']" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <select
              v-else-if="currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin'"
              v-model="user.type"
              id="userType"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="type in ['cliente', 'cliente MN']" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- CNEN Certificates -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Certificados CNEN</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="anLicense">
            <FontAwesomeIcon icon="fa-solid fa-file-pdf" class="mr-2" /> Licença AN
            <span class="text-xs text-gray-500 ml-2">opcional</span>
          </label>
          <input
            id="anLicense"
            type="file"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            @change="onANLicenseFileChange"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="anLicenseNumber">
            <FontAwesomeIcon icon="fa-solid fa-id-card" class="mr-2" /> Número da Licença AN
            <span class="text-xs text-gray-500 ml-2">opcional</span>
          </label>
          <Input
            id="anLicenseNumber"
            v-model="user.ANLicenseNumber"
            type="text"
            placeholder="AA-0000"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="anLicenseValidity">
            <FontAwesomeIcon icon="fa-solid fa-calendar-alt" class="mr-2" /> Validade da Licença AN
            <span class="text-xs text-gray-500 ml-2">opcional</span>
          </label>
          <Input
            id="anLicenseValidity"
            v-model="user.ANLicenseValidity"
            type="date"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="fmLicense">
            <FontAwesomeIcon icon="fa-solid fa-file-pdf" class="mr-2" /> Licença FM
            <span class="text-xs text-gray-500 ml-2">opcional</span>
          </label>
          <input
            id="fmLicense"
            type="file"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            @change="onFMLicenseFileChange"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="fmLicenseNumber">
            <FontAwesomeIcon icon="fa-solid fa-id-card" class="mr-2" /> Número da Licença FM
            <span class="text-xs text-gray-500 ml-2">opcional</span>
          </label>
          <Input
            id="fmLicenseNumber"
            v-model="user.FMLicenseNumber"
            type="text"
            placeholder="AA-0000"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="fmLicenseValidity">
            <FontAwesomeIcon icon="fa-solid fa-calendar-alt" class="mr-2" /> Validade da Licença FM
            <span class="text-xs text-gray-500 ml-2">opcional</span>
          </label>
          <Input
            id="fmLicenseValidity"
            v-model="user.FMLicenseValidity"
            type="date"
          />
        </div>
      </div>
    </div>
    
    <!-- Facilities Selection -->
    <div v-if="user.type === 'cliente' || user.type === 'cliente MN'" class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Selecione as instalações que esse usuário terá acesso</h3>
      <p class="text-sm text-gray-500 mb-4">
        opcional. Usuários rad dimenstein possuem acesso a todas as instalações por padrão.
      </p>
      
      <div class="mb-4">
        <div class="relative">
          <Input
            v-model="filter"
            type="text"
            placeholder="Buscar instalações..."
            class="pl-10 w-full"
          >
            <FontAwesomeIcon icon="fa-solid fa-search" class="text-gray-400 absolute left-3 top-3" />
          </Input>
        </div>
      </div>
      
      <div v-if="!filteredFacilities.length" class="py-8 text-center text-gray-500">
        Nenhuma instalação encontrada.
      </div>
      
      <div v-else>
        <Table
          :columns="columns"
          :data="filteredFacilities"
          :totalItems="facilities.length"
          v-model:currentPage="currentPage"
          v-model:perPage="perPage"
        >
          <template #cell-action="{ row }">
            <button 
              class="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              @click="addToSelectedFacilities(row._id)"
            >
              <FontAwesomeIcon icon="fa-solid fa-plus" />
            </button>
          </template>
        </Table>
      </div>
      
      <div v-if="selectedFacilities.length > 0" class="mt-6">
        <h4 class="text-md font-semibold text-gray-700 mb-4">Instalações selecionadas</h4>
        
        <Table
          :columns="columnsSelected"
          :data="selectedFacilities"
          :totalItems="selectedFacilities.length"
          v-model:currentPage="currentPageSelected"
          v-model:perPage="perPage"
        >
          <template #cell-action="{ row }">
            <button 
              class="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              @click="removeFromSelectedFacilities(row._id)"
            >
              <FontAwesomeIcon icon="fa-solid fa-times" />
            </button>
          </template>
        </Table>
      </div>
    </div>
    
    <div class="flex justify-end">
      <button 
        @click="edit"
        class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        <FontAwesomeIcon icon="fa-solid fa-save" class="mr-2" /> Salvar Alterações
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Input from '@/components/ui/Input.vue';
import Table from '@/components/dashboard/Table.vue';
import auth from '@/services/authentication';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// Data
const user = ref({
  email: '',
  name: '',
  facilities: [],
  ANLicenseValidity: '',
  FMLicenseValidity: '',
});
const error = ref(false);
const errors = ref({
  has: (field) => false, // Simple validator stub
});
const currentUser = ref({});
const facilities = ref([]);
const selectedFacilities = ref([]);
const filter = ref('');
const perPage = ref(10);
const currentPage = ref(1);
const currentPageSelected = ref(1);

// Table columns
const columns = ref([
  {
    label: 'Nome',
    field: 'name',
  },
  {
    label: 'Ações',
    field: 'action',
  },
]);

const columnsSelected = ref([
  {
    label: 'Nome',
    field: 'name',
  },
  {
    label: 'Ações',
    field: 'action',
  },
]);

// Computed
const filteredFacilities = computed(() => {
  if (!filter.value || !facilities.value.length) {
    return facilities.value.filter(facility => 
      !selectedFacilities.value.some(f => f._id === facility._id)
    );
  }
  
  return facilities.value.filter(facility => 
    facility.name.toLowerCase().includes(filter.value.toLowerCase()) &&
    !selectedFacilities.value.some(f => f._id === facility._id)
  );
});

// Methods
const formatDate = (date) => {
  if (!date) return '';
  
  date = new Date(date);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${year}-${month}-${day}`;
};

const edit = async () => {
  try {
    user.value.facilities = selectedFacilities.value;
    await auth.edit(user.value, `/users/${route.params.id}`);
    router.push(`/users/${route.params.id}`);
  } catch (err) {
    error.value = true;
    errors.value = err.response?.data || 'Erro ao atualizar usuário';
  }
};

const onANLicenseFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  
  createANLicense(files[0]);
};

const createANLicense = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    user.value.ANLicense = e.target.result;
  };
  reader.readAsDataURL(file);
};

const onFMLicenseFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  
  createFMLicense(files[0]);
};

const createFMLicense = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    user.value.FMLicense = e.target.result;
  };
  reader.readAsDataURL(file);
};

const loadFacilities = async () => {
  try {
    const response = await axios.get(
      `${auth.apiUrl()}facilities/`, 
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    
    if (response.data.length === 0) {
      errors.value = 'Nenhum resultado encontrado';
      facilities.value = [];
    } else {
      facilities.value = response.data.list;
    }
  } catch (err) {
    errors.value = err.response?.data || 'Erro ao carregar instalações';
    facilities.value = [];
  }
};

const addToSelectedFacilities = (facilityId) => {
  const tempFilter = filter.value;
  filter.value = '';
  
  const facility = facilities.value.find(f => f._id === facilityId);
  if (facility && !selectedFacilities.value.some(f => f._id === facilityId)) {
    selectedFacilities.value.push(facility);
  }
  
  filter.value = tempFilter;
};

const removeFromSelectedFacilities = (facilityId) => {
  const tempFilter = filter.value;
  filter.value = '';
  
  const index = selectedFacilities.value.findIndex(f => f._id === facilityId);
  if (index !== -1) {
    selectedFacilities.value.splice(index, 1);
  }
  
  filter.value = tempFilter;
};

// Lifecycle hooks
onMounted(async () => {
  currentUser.value = auth.currentUser();
  loadFacilities();
  
  try {
    const response = await axios.get(
      `${auth.apiUrl()}user/${route.params.id}`, 
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    
    if (response.data.length === 0) {
      errors.value = 'Nenhum resultado encontrado';
      user.value = {};
    } else {
      user.value = {
        ...response.data,
        FMLicenseValidity: formatDate(response.data.FMLicenseValidity),
        ANLicenseValidity: formatDate(response.data.ANLicenseValidity)
      };
      
      if (response.data.facilities) {
        selectedFacilities.value = response.data.facilities;
      }
    }
  } catch (err) {
    errors.value = err.data || 'Erro ao carregar dados do usuário';
    user.value = {};
  }
});
</script>
