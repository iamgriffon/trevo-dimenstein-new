<template>
  <Layout title="Lista de Equipamentos">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${route.params.id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline italic font-semibold"
      >
        {{ facility }}
      </router-link>
    </template>
    <template #header>
      <router-link
        :to="`/facility/${route.params.id}/equipment/register`"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <FontAwesomeIcon icon="fa-solid fa-plus" class="mr-2" /> Adicionar
        Equipamento
      </router-link>
    </template>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4 flex justify-between items-center">
        <div class="relative w-full">
          <Input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar equipamento..."
            class="pl-10 w-full"
          >
            <FontAwesomeIcon
              icon="fa-solid fa-search"
              class="text-gray-400 absolute left-3 top-3"
            />
          </Input>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"
        ></div>
      </div>

      <div
        v-else-if="!listOfEquipments.length"
        class="py-8 text-center text-gray-500"
      >
        Nenhum equipamento encontrado.
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <EquipmentCard
          v-for="equipment in listOfEquipments"
          :key="equipment.id"
          :equipment="equipment"
          :facility="route.params.id"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { api } from "@/services/api";
import { toRaw } from "vue";
import EquipmentCard from "@/components/dashboard/facility/equipmentCard.vue";
const route = useRoute();
const equipments = ref([]);
const typeOfEquipment = ref([]);
const loading = ref(true);
const searchTerm = ref("");
const showDeleteModal = ref(false);
const equipmentToDelete = ref(null);
const facility = ref("");
const fetchEquipments = async () => {
  loading.value = true;
  try {
    const { data: facilityEquipments } = await api.get(
      `facility/${route.params.id}/equipments`
    );
    const { data: equipmentsInfo } = await api.get("/typeOfEquipment");
    equipments.value = facilityEquipments;
    typeOfEquipment.value = equipmentsInfo;
  } catch (error) {
    console.error("Error fetching equipments:", error);
  } finally {
    loading.value = false;
  }
};

const loadFacility = async () => {
  try {
    const { data } = await api.get(`facility/${route.params.id}`);
    console.log(data);

    if (data) {
      facility.value = data.name;
    }
  } catch (error) {
    console.error("Error loading facility:", error.response);
  }
};

const listOfEquipments = computed(() => {
  if (!equipments.value || !typeOfEquipment.value) {
    return [];
  }
  const foundEquipment = typeOfEquipment.value.filter((type) => {
    return equipments.value.find((equipment) => equipment.typeId === type._id);
  });

  const listType = foundEquipment.map((type) => {
    return {
      ...type,
      image: type.pathBackgroundImg,
    };
  });

  return listType.filter((equipment) => {
    return equipment.name
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
  });
});

const deleteEquipment = async () => {
  try {
    // Replace with actual API call
    await fetch(`/api/equipments/${equipmentToDelete.value.id}`, {
      method: "DELETE",
    });

    // Remove from local state
    equipments.value = equipments.value.filter(
      (item) => item.id !== equipmentToDelete.value.id
    );
    showDeleteModal.value = false;
    equipmentToDelete.value = null;
  } catch (error) {
    console.error("Error deleting equipment:", error);
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchEquipments();
  loadFacility();
});
</script>
