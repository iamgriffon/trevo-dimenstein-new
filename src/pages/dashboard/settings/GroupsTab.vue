<template>
  <div>
    <div class="flex w-full justify-between items-center mb-6">
      <h4 class="text-xl font-medium">Grupos de Instalações</h4>
      <Button
        @click="openModal('registerGroupModal')"
        className="bg-green-600 max-w-64 rounded-md text-white font-medium hover:bg-green-700 transition-colors"
      >
        <FontAwesomeIcon icon="fa-solid fa-plus" class="mr-2" />
        Adicionar
      </Button>
    </div>

    <div class="relative">
      <!-- Loading overlay -->
      <div 
        v-if="loading" 
        class="inset-0 bg-white bg-opacity-70 z-10 mt-20 flex justify-center items-center h-80"
      >
        <div class="text-center">
          <img src="/static/img/loading.gif" class="w-full h-full mx-auto" />
        </div>
      </div>

      <Table
        v-if="groups.length > 0"
        :columns="columnsFormatted"
        :data="filteredGroups"
        :totalItems="groups.length"
        v-model:currentPage="currentPage"
        v-model:perPage="perPage"
        class="max-h-[500px] overflow-y-auto"
        footer-class="relative border-0 justify-center z-auto"
      />
      
      <div v-else-if="!loading" class="bg-white p-6 rounded-lg shadow text-center">
        <p class="text-gray-500">Nenhum grupo encontrado.</p>
      </div>
    </div>

    <!-- Register Group Modal -->
    <Modal
      :visible="modals.registerGroupModal"
      title="Adicionar Grupo"
      @update:visible="modals.registerGroupModal = false"
      @ok="registerGroup"
    >
      <div class="mb-3">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-city" class="mr-2" />
            Grupo
          </label>
          <Input
            v-model="group"
            placeholder="Nome do grupo"
          />
        </div>
      </div>
    </Modal>

    <!-- Edit Group Modal -->
    <Modal
      :visible="modals.editGroupModal"
      title="Editar Grupo"
      @update:visible="modals.editGroupModal = false"
      @ok="editGroup"
    >
      <div class="mb-3">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" />
            Grupo
          </label>
          <Input
            v-model="editedGroup.name"
            placeholder="Nome do grupo"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/common/Modal.vue";
import Input from "@/components/ui/Input.vue";
import Table from "@/components/dashboard/Table.vue";
import auth from "@/services/authentication";
import { api } from "@/services/api";
import { createActionButtonsCell } from "@/utils/tableCells";
import permission from "@/services/permissions";

const emit = defineEmits(['update:loading']);

const currentUser = ref(auth.currentUser());
const loading = ref(false);

// Groups data
const groups = ref([]);
const currentPage = ref(1);
const perPage = ref(10);

// Form fields
const group = ref("");

// Edited entity
const editedGroup = ref({
  _id: "",
  name: ""
});

// Modals state
const modals = ref({
  registerGroupModal: false,
  editGroupModal: false
});

// Computed properties
const filteredGroups = computed(() => {
  return groups.value.slice(
    (currentPage.value - 1) * perPage.value,
    currentPage.value * perPage.value
  );
});

// Table columns definition
const columnsFormatted = computed(() => [
  {
    accessorKey: "name",
    header: "Nome",
    meta: {
      headerClass: "text-left pl-4",
      cellClass: "text-left pl-4",
    }
  },
  {
    accessorKey: "actions",
    header: "Ações",
    meta: {
      cellClass: "flex items-center justify-end pr-8",
      headerClass: "text-right pr-12",
    },
    cell: (info) => {
      const actionButtons = [
        {
          type: "button",
          icon: "fa-solid fa-edit",
          title: "editar",
          props: {
            class: "p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md mr-2",
            onClick: () => {
              editSelectedGroup({
                _id: info.row.original._id,
                name: info.row.original.name
              });
              openModal("editGroupModal");
            },
          },
        },
        {
          type: "button",
          icon: "fa-solid fa-trash-alt",
          title: "excluir",
          props: {
            class: "p-2 bg-red-600 hover:bg-red-700 text-white rounded-md",
            onClick: () => {
              if (permission.canExcludeGroup(currentUser.value)) {
                excludeGroup(info.row.original._id);
              }
            },
          },
        }
      ];
      
      return createActionButtonsCell(info, actionButtons, "flex items-center justify-center");
    },
  }
]);

// Methods
const openModal = (modalName) => {
  modals.value[modalName] = true;
};

// Load data function
const loadGroups = async () => {
  loading.value = true;
  groups.value = [];
  
  try {
    const response = await api.get("group");
    groups.value = response.data || [];
  } catch (error) {
    console.error("Error loading groups:", error);
  } finally {
    loading.value = false;
  }
};

// Group functions
const registerGroup = async () => {
  if (!group.value) {
    alert("Por favor preencha o nome do grupo");
    return;
  }

  const credentials = {
    name: group.value
  };
  
  loading.value = true;
  emit('update:loading', true);
  
  try {
    await auth.registerGroup({ credentials });
    await loadGroups();
    group.value = "";
    modals.value.registerGroupModal = false;
  } catch (error) {
    console.error("Error registering group:", error);
  } finally {
    loading.value = false;
    emit('update:loading', false);
  }
};

const editSelectedGroup = (editedItem) => {
  editedGroup.value = { ...editedItem };
};

const editGroup = async () => {
  loading.value = true;
  emit('update:loading', true);
  
  try {
    await auth.editGroup({ editedGroup: editedGroup.value });
    await loadGroups();
    modals.value.editGroupModal = false;
  } catch (error) {
    console.error("Error editing group:", error);
  } finally {
    loading.value = false;
    emit('update:loading', false);
  }
};

const excludeGroup = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este grupo?")) return;
  
  loading.value = true;
  emit('update:loading', true);
  
  const credentials = { _id: id };
  
  try {
    await auth.excludeGroup({ credentials });
    await loadGroups();
  } catch (error) {
    console.error("Error excluding group:", error);
  } finally {
    loading.value = false;
    emit('update:loading', false);
  }
};

// Initialize component
onMounted(async () => {
  loading.value = true;
  try {
    await loadGroups();
  } finally {
    loading.value = false;
  }
});
</script> 