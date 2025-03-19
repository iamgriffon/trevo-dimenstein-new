<!-- src/components/Login.vue -->
<template>
  <Layout title="Adicionar Novo Equipamento">
    <template #header>
      <router-link 
        :to="`/facility/${route.params.id}/equipments`" 
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
        <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar para Lista
      </router-link>
    </template>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" class="mr-2" /> {{ errors }}
      </div>
      
      <form @submit.prevent="register" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Type -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-cubes" class="mr-1" /> Tipo
            </label>
            <select
              id="type"
              v-model="type"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione o Tipo</option>
              <option value="Mechanical">Mecânico</option>
              <option value="Electrical">Elétrico</option>
              <option value="Filtration">Filtração</option>
              <option value="HVAC">HVAC</option>
              <option value="Monitoring">Monitoramento</option>
            </select>
          </div>
          
          <!-- Localization -->
          <div>
            <label for="localization" class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-map-marked" class="mr-1" /> Localização
            </label>
            <Input
              id="localization"
              v-model="localization"
              type="text"
              placeholder="ex.: laboratório"
            />
          </div>
          
          <!-- Manufacturer -->
          <div>
            <label for="manufacturer" class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-building" class="mr-1" /> Fabricante
            </label>
            <Input
              id="manufacturer"
              v-model="manufacturer"
              type="text"
            />
          </div>
          
          <!-- Model -->
          <div>
            <label for="model" class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-square" class="mr-1" /> Modelo
            </label>
            <Input
              id="model"
              v-model="model"
              type="text"
            />
          </div>
          
          <!-- Serial Number -->
          <div>
            <label for="serialNumber" class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-1" /> Número de Série
            </label>
            <Input
              id="serialNumber"
              v-model="serialNumber"
              type="text"
            />
          </div>
          
          <!-- Serial Number Tube -->
          <div>
            <label for="serialNumberTube" class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-1" /> Número de Série Tubo
              <span class="text-xs text-gray-500">(opcional)</span>
            </label>
            <Input
              id="serialNumberTube"
              v-model="serialNumberTube"
              type="text"
            />
          </div>
          
          <!-- Patrimonial Number -->
          <div>
            <label for="patrimonialNumber" class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-tag" class="mr-1" /> Número Patrimonial
            </label>
            <Input
              id="patrimonialNumber"
              v-model="patrimonialNumber"
              type="text"
            />
          </div>
        </div>
        
        <div class="flex justify-end pt-4">
          <button
            type="submit"
            class="px-4 py-2 w-full bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FontAwesomeIcon icon="fa-solid fa-save" class="mr-2" /> Salvar
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Layout from '@/components/common/Layout.vue';
import Input from '@/components/ui/Input.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '@/services/authentication';

const router = useRouter();
const route = useRoute();

// State variables
const type = ref('');
const localization = ref('');
const manufacturer = ref('');
const model = ref('');
const serialNumber = ref('');
const serialNumberTube = ref('');
const patrimonialNumber = ref('');
const facility = ref({});
const error = ref(false);
const errors = ref('');
const currentUser = ref(null);

// Methods
const register = async () => {
  try {
    const credentials = {
      type: type.value,
      manufacturer: manufacturer.value,
      model: model.value,
      serialNumber: serialNumber.value,
      serialNumberTube: serialNumberTube.value,
      patrimonialNumber: patrimonialNumber.value,
      localization: localization.value,
      facility: { _id: facility.value._id }
    };
    
    await auth.registerEquipment(credentials);
    router.push(`/dashboard/facility/${facility.value._id}/equipments`);
  } catch (err) {
    console.error(err);
    error.value = true;
    errors.value = err.response?.data || 'Erro ao registrar equipamento';
  }
};

// Lifecycle hooks
onMounted(async () => {
  try {
    // Get facility info if facility ID is in route
    if (route.params.facilityId) {
      const response = await auth.getFacility(route.params.facilityId);
      facility.value = response.data;
    }
    
    currentUser.value = auth.currentUser();
  } catch (err) {
    console.error(err);
    error.value = true;
    errors.value = err.response?.data || 'Erro ao carregar dados';
  }
});
</script>
