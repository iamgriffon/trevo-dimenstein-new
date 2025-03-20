<template>
  <Layout :title="`Equipamentos`">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${route.params.id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="mx-2 text-teal-800 select-none">Equipamentos</span>
    </template>
    <template #header>
      <div class="flex space-x-2">
        <router-link
          :to="`/facility/${route.params.id}/equipments`"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-list" class="mr-2" /> Ver Todos
        </router-link>
        <router-link
          :to="`/facility/${route.params.id}/equipments/register`"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="mr-2" /> Adicionar
          Equipamento
        </router-link>
      </div>
    </template>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4 flex justify-between items-center">
        <div class="relative w-72">
          <Input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar equipamento..."
          >
            <FontAwesomeIcon
              icon="fa-solid fa-search"
            />
          </Input>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
              <div class="text-center">
          <img src="/static/img/loading.gif" class="w-full h-full mx-auto" />
        </div>
      </div>

      <div
        v-else-if="filteredEquipments.length === 0"
        class="py-8 text-center text-gray-500"
      >
        Nenhum equipamento encontrado para este tipo.
      </div>

      <div v-else>
        <Table
          :data="listOfTypesOfEquipments"
          :columns="tableColumns"
          v-model:currentPage="currentPage"
          v-model:perPage="perPage"
          v-model:totalItems="listOfTypesOfEquipments.length"
          footer-class="relative border-none w-full justify-center"
        />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal v-model:visible="showDeleteModal" title="Confirmar Exclusão">
      <div class="p-4">
        <p class="mb-4">
          Tem certeza que deseja excluir o equipamento
          <strong>{{ equipmentToDelete?.name }}</strong
          >?
        </p>
        <div class="flex justify-end space-x-2">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="deleteEquipment"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import Layout from "@/components/common/Layout.vue";
import Table from "@/components/dashboard/Table.vue";
import Input from "@/components/ui/Input.vue";
import Modal from "@/components/common/Modal.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createTextCell, createActionButtonsCell } from "@/utils/tableCells";
import { api } from "@/services/api";

const route = useRoute();

// State variables
const equipments = ref([]);
const loading = ref(true);
const searchTerm = ref("");
const facility = ref({});
const currentPage = ref(1);
const perPage = ref(10);
const showDeleteModal = ref(false);
const equipmentToDelete = ref(null);
const typesOfEquipments = ref([]);
const equipmentType = computed(() => route.params.type || "");

// Derived values

const filteredEquipments = computed(() => {
  let filtered = [...equipments.value];
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.model.toLowerCase().includes(term) ||
        item.serialNumber.toLowerCase().includes(term)
    );
  }
  return filtered;
});

const tableColumns = [
  {
    accessorKey: "actions",
    header: "Ações",
    cell: (info) => {
      const actionButtons = [
        {
          type: RouterLink,
          icon: "fa-solid fa-info",
          props: {
            to: {
              path: `/equipments/${route.params.typeId}/${info.row.original._id}`,
            },
            class:
              "flex items-center w-10 h-10 justify-center p-2 rounded-md gap-2 bg-gray-100 cursor-pointer hover:shadow-inner hover:bg-gray-200 transition-all duration-300",
          },
          title: "Informações",
        },
        {
          type: "button",
          icon: "fa-solid fa-trash",
          props: {
            class: "flex items-center w-10 h-10 justify-center p-2 rounded-md bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700",
            onClick: () => confirmDelete(info.row.original),
          },
          title: "Excluir",
        },
      ];
      return createActionButtonsCell(info, actionButtons);
    },
  },
  {
    accessorKey: "serialNumber",
    header: "N. de Série",
    cell: (info) => createTextCell(info, "text-center"),
  },
  {
    accessorKey: "serialNumberTube",
    header: "N. de Série Tubo",
    cell: (info) => createTextCell(info, "text-center"),
  },
  {
    accessorKey: "patrimonialNumber",
    header: "N. Patrimonial",
    cell: (info) => createTextCell(info, "text-center"),
  },
  {
    accessorKey: "manufacturer",
    header: "Fabricante",
    cell: (info) => createTextCell(info, "text-center"),
  },
  {
    accessorKey: "model",
    header: "Modelo",
    cell: (info) => createTextCell(info, "text-center"),
  },
  {
    accessorKey: "localization",
    header: "Localização",
    cell: (info) => createTextCell(info, "text-center"),
  },
];

// Methods
const fetchEquipments = async () => {
  loading.value = true;

  try {
    const response = await api.get(
      `facility/${route.params.id}/equipments/${equipmentType?.value}`
    );
    equipments.value = response.data;
  } catch (error) {
    console.error("Error fetching equipments:", error);
  } finally {
    loading.value = false;
  }
};

const fetchTypesOfEquipments = async () => {
  const { data } = await api.get(`/typeOfEquipment`);
  typesOfEquipments.value = data;
};

const fetchFacility = async () => {
  const { data } = await api.get(`facility/${route.params.id}`);
  facility.value = data;
};

const listOfTypesOfEquipments = computed(() => {
  const res = filteredEquipments.value.filter(
    (equipment) => equipment.typeId === route.params.typeId
  );
  return res;
});

const confirmDelete = (equipment) => {
  equipmentToDelete.value = equipment;
  showDeleteModal.value = true;
};

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

// Watch for changes to equipment type
watch(equipmentType, () => {
  fetchEquipments();
  currentPage.value = 1;
});

// Lifecycle hooks
onMounted(() => {
  Promise.all([fetchEquipments(), fetchFacility(), fetchTypesOfEquipments()]);
});

onUnmounted(() => {});
</script>