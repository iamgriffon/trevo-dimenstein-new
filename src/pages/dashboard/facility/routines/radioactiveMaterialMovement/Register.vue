<!-- src/components/Login.vue -->
<template>
  <Layout title="Adicionar Movimentação de Material Radioativo">
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
      <button
        class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
      >
        <RouterLink :to="`/facility/${facility._id}/routines/radioactivematerialmov`">
          <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
        </RouterLink>
      </button>
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
        <h4 class="font-medium text-lg mb-4">Informações Básicas</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-calendar" class="mr-2" />
              Data<span class="text-red-500">*</span>
            </label>
            <Input
              v-model="radioactiveMaterial.date"
              type="date"
              :dayOnly="true"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-radiation" class="mr-2" />
              Radioisótopo<span class="text-red-500">*</span>
            </label>
            <select
              v-model="radioactiveMaterial.radioisotope"
              class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option disabled value="">Selecione um radioisótopo</option>
              <option value="131I">131I</option>
              <option value="111In">111In</option>
              <option value="99mTc">99mTc</option>
              <option value="67Ga">67Ga</option>
              <option value="201Tl">201Tl</option>
              <option value="18F">18F</option>
              <option value="177Lu">177Lu</option>
              <option value="223Ra">223Ra</option>
              <option value="90Y">90Y</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-atom" class="mr-2" />
              Atividade Inicial (mCi)<span class="text-red-500">*</span>
            </label>
            <Input
              v-model="radioactiveMaterial.initialActivity"
              type="text"
              placeholder="0.00"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-atom" class="mr-2" />
              Atividade de Uso (mCi)<span class="text-red-500">*</span>
            </label>
            <Input
              v-model="radioactiveMaterial.usageActivity"
              type="text"
              placeholder="0.00"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" />
              Lote
            </label>
            <Input
              v-model="radioactiveMaterial.lot"
              type="text"
              placeholder="Número de lote"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-calendar-check" class="mr-2" />
              Validade
            </label>
            <Input
              v-model="radioactiveMaterial.validity"
              type="date"
              :dayOnly="true"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" />
              Responsável<span class="text-red-500">*</span>
            </label>
            <select
              v-model="radioactiveMaterial.responsible"
              class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option disabled value="">Selecione um responsável</option>
              <option
                v-for="option in responsibleOptions"
                :key="option._id"
                :value="option"
              >
                {{ option.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h4 class="font-medium text-lg mb-4">Informações Adicionais</h4>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-comment" class="mr-2" />
            Observações
          </label>
          <textarea
            v-model="radioactiveMaterial.observations"
            rows="3"
            class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Observações adicionais"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          @click="saveRadioactiveMaterial"
          class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-6 py-2 rounded-md font-medium"
          :disabled="loading"
        >
          <FontAwesomeIcon v-if="loading" icon="fa-solid fa-spinner" spin class="mr-2" />
          <FontAwesomeIcon v-else icon="fa-solid fa-save" class="mr-2" />
          Salvar
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { api } from "@/services/api";
import auth from "@/services/authentication";
import permission from "@/services/permissions";

const route = useRoute();
const router = useRouter();

// State variables
const facility = ref({});
const radioactiveMaterial = ref({
  date: format(new Date(), "dd/MM/yyyy"),
  radioisotope: "",
  initialActivity: "",
  usageActivity: "",
  lot: "",
  validity: "",
  responsible: "",
  observations: "",
});
const responsibleOptions = ref([]);
const currentUser = ref(auth.currentUser());
const errors = ref("");
const loading = ref(false);

// Load facility data
const loadFacility = async () => {
  try {
    const facilityId = route.params.id;
    const facilityResponse = await api.get(`facility/${facilityId}`);
    facility.value = facilityResponse.data;
  } catch (error) {
    console.error("Error loading facility:", error);
    errors.value = error.data || error.message;
    facility.value = {};
  }
};

// Load responsible persons (users with rad fisico type)
const loadResponsibles = async () => {
  try {
    const response = await api.get("users/");
    
    if (response.data.length === 0) {
      errors.value = "Nenhum responsável encontrado";
      responsibleOptions.value = [];
      return;
    }
    
    const responseUsers = response.data.filter(user => user.type === "rad fisico");
    responsibleOptions.value = responseUsers.map(user => ({
      name: user.name,
      _id: user._id,
    }));
  } catch (error) {
    console.error("Error loading responsibles:", error);
    errors.value = error.data || error.message;
    responsibleOptions.value = [];
  }
};

// Validate form before submitting
const validateForm = () => {
  if (!radioactiveMaterial.value.date) {
    errors.value = "Data é obrigatória";
    return false;
  }
  
  if (!radioactiveMaterial.value.radioisotope) {
    errors.value = "Radioisótopo é obrigatório";
    return false;
  }
  
  if (!radioactiveMaterial.value.initialActivity) {
    errors.value = "Atividade inicial é obrigatória";
    return false;
  }
  
  if (!radioactiveMaterial.value.usageActivity) {
    errors.value = "Atividade de uso é obrigatória";
    return false;
  }
  
  if (!radioactiveMaterial.value.responsible) {
    errors.value = "Responsável é obrigatório";
    return false;
  }
  
  return true;
};

// Save the radioactive material movement
const saveRadioactiveMaterial = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  errors.value = "";
  
  try {
    const facilityId = route.params.id;
    
    // Prepare data for API
    const dataToSubmit = {
      date: radioactiveMaterial.value.date,
      radioisotope: radioactiveMaterial.value.radioisotope,
      initialActivity: parseFloat(radioactiveMaterial.value.initialActivity),
      usageActivity: parseFloat(radioactiveMaterial.value.usageActivity),
      lot: radioactiveMaterial.value.lot,
      validity: radioactiveMaterial.value.validity,
      responsible: radioactiveMaterial.value.responsible._id,
      observations: radioactiveMaterial.value.observations,
      facility: facilityId,
    };
    
    await api.post("radioactivematerialmovement", dataToSubmit);
    
    // Navigate back to list after successful save
    router.push(`/facility/${facilityId}/routines/radioactivematerialmov`);
  } catch (error) {
    console.error("Error saving data:", error);
    errors.value = error.data || error.message || "Erro ao salvar os dados";
  } finally {
    loading.value = false;
  }
};

// Load initial data
onMounted(async () => {
  await loadFacility();
  await loadResponsibles();
});
</script>
