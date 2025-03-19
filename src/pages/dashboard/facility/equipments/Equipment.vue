<template>
  <Layout
    :title="
      isNewEquipment
        ? 'Adicionar Novo Equipamento'
        : `Equipamento: ${equipment?.type} - ${equipment?.serialNumber}`
    "
  >
    <template #header>
      <div class="flex gap-2">
        <router-link
          :to="`/facility/${facility?._id}/equipments/${route.params.typeId}`"
          class="px-4 py-2 h-10 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-1" />
          Voltar para Lista
        </router-link>
        <button
          @click="isEditing = !isEditing"
          class="px-4 py-2 border h-10 bg-green-500 text-white border-gray-300 rounded-md hover:bg-green-700 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-pencil" class="mr-1" />
          Editar
        </button>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="saveEquipment" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Type -->
          <div>
            <label
              for="type"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Instalação</label
            >
            <Input
              id="facility"
              v-model="facility.name"
              className="cursor-default"
              type="text"
              readonly
              required
            />
          </div>
          <div>
            <label
              for="type"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Tipo</label
            >
            <select
              v-if="isEditing"
              id="type"
              v-model="equipment.type"
              class="w-full border border-gray-300 bg-white rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Selecione o Tipo"
            >
              <option
                v-for="type in typeOptions"
                :key="type._id"
                :value="type.name"
              >
                {{ type.name }}
              </option>
            </select>
            <Input
              v-else
              id="type"
              v-model="equipment.type"
              type="text"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>

          <!-- Manufacturer -->
          <div>
            <label
              for="manufacturer"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Fabricante</label
            >
            <Input
              id="manufacturer"
              v-model="equipment.manufacturer"
              type="text"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>

          <!-- Model -->
          <div>
            <label
              for="model"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Modelo</label
            >
            <Input
              id="model"
              v-model="equipment.model"
              type="text"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>

          <!-- Serial Number -->
          <div>
            <label
              for="serialNumber"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Número de Série</label
            >
            <Input
              id="serialNumber"
              v-model="equipment.serialNumber"
              type="text"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>

          <!-- Purchase Date -->
          <div>
            <label
              for="purchaseDate"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Data de Compra</label
            >
            <Input
              id="purchaseDate"
              v-model="equipment.purchaseDate"
              type="date"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>

          <!-- Warranty End -->
          <div>
            <label
              for="warrantyEnd"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Fim da Garantia</label
            >
            <Input
              id="warrantyEnd"
              v-model="equipment.warrantyEnd"
              type="date"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>

          <!-- Location -->
          <div>
            <label
              for="location"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Localização</label
            >
            <Input
              id="location"
              v-model="equipment.location"
              type="text"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3" v-if="isEditing">
          <button
            @click="cancelEditing"
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Salvar Equipamento
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { api } from "@/services/api";
import { cn } from "@/utils/cn";
const route = useRoute();
const router = useRouter();
const loading = ref(true);
const equipment = ref({
  name: "",
  type: "",
  status: "",
  manufacturer: "",
  model: "",
  serialNumber: "",
  purchaseDate: "",
  warrantyEnd: "",
  location: "",
  description: "",
  maintenanceSchedule: [],
});

const facility = ref({});

const typeOfEquipment = ref({});
const typeOptions = ref([]);
const isNewEquipment = computed(() => !route.params.id);
const isEditing = ref(false);
const readOnlyClass = cn(
  "select-none",
  !!isEditing.value ? "cursor-text" : "cursor-default"
);

const fetchEquipment = async () => {
  if (isNewEquipment.value) {
    loading.value = false;
    return;
  }

  try {
    // Replace with actual API call
    const { data } = await api.get(`/equipment/${route.params.id}`);
    if (data) {
      equipment.value = data;
      const facilityId = equipment.value.facility?._id;
      const { data: response } = await api.get(`/facility/${facilityId}`);
      facility.value = response;
    }
  } catch (error) {
    console.error("Error fetching equipment:", error);
    // Fallback data for testing
  } finally {
    loading.value = false;
  }
};

const fetchTypeOfEquipment = async () => {
  const { data } = await api.get(`/typeOfEquipment/${route.params.typeId}`);
  typeOfEquipment.value = data;
};

const fetchTypeOptions = async () => {
  const { data } = await api.get(`/typeOfEquipment`);
  typeOptions.value = data;
};

const saveEquipment = async () => {
  try {
    const method = isNewEquipment.value ? "POST" : "PUT";
    const url = isNewEquipment.value
      ? "/api/equipments"
      : `/api/equipments/${route.params.id}`;

    // Replace with actual API call
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipment.value),
    });

    if (response.ok) {
      router.push("/facility/equipments");
    }
  } catch (error) {
    console.error("Error saving equipment:", error);
    // In a real app, show error message to user
  }
};

const cancelEditing = () => {
  fetchEquipment();
  isEditing.value = false;
};

// Lifecycle hooks
onMounted(() => {
  fetchEquipment();
  fetchTypeOfEquipment();
  fetchTypeOptions();
});
</script>
