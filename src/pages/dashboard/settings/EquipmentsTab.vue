<template>
  <div>
    <div class="flex w-full justify-between items-center mb-6">
      <h4 class="text-xl font-medium">Tipos de Equipamentos</h4>
      <Button
        @click="openModal('registerTypeOfEquipmentModal')"
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
        v-if="!!listOfTypesOfEquipment.length"
        :columns="columnsFormatted"
        :data="filteredListOfTypesOfEquipment"
        :totalItems="listOfTypesOfEquipment.length"
        v-model:currentPage="currentPage"
        v-model:perPage="perPage"
        class="max-h-[500px] overflow-y-auto"
        footer-class="relative border-0 justify-center z-auto"
      />

      <div
        v-else-if="!loading"
        class="bg-white p-6 rounded-lg shadow text-center"
      >
        <p class="text-gray-500">Nenhum tipo de equipamento encontrado.</p>
      </div>
    </div>
  </div>

  <!-- Register Type of Equipment Modal -->
  <Modal
    :visible="modals.registerTypeOfEquipmentModal"
    title="Adicionar Tipo de Equipamento"
    @update:visible="modals.registerTypeOfEquipmentModal = false"
    @ok="registerTypeOfEquipment"
  >
    <div class="mb-3">
      <div class="form-group mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" />
          Tipo de Equipamento
        </label>
        <Input
          v-model="typeOfEquipment"
          placeholder="Nome do tipo de equipamento"
        />
      </div>
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <FontAwesomeIcon icon="fa-regular fa-image" class="mr-2" />
          Imagem de Fundo
        </label>
        <p class="text-sm text-gray-500 mb-2">escolha uma imagem quadrada</p>
        <div v-if="typeOfEquipmentBackgroundImg" class="my-2">
          <img
            :src="typeOfEquipmentBackgroundImg"
            class="max-h-20 rounded-md"
          />
        </div>
        <input
          type="file"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          @change="onBackgroundFileChange"
        />
      </div>
    </div>
  </Modal>

  <!-- Edit Type of Equipment Modal -->
  <Modal
    :visible="modals.editTypeOfEquipmentModal"
    title="Editar Tipo de Equipamento"
    @update:visible="modals.editTypeOfEquipmentModal = false"
    @ok="editTypeOfEquipment"
  >
    <div class="mb-3">
      <div class="form-group mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" />
          Tipo de Equipamento
        </label>
        <Input
          v-model="editedTypeOfEquipment.name"
          placeholder="Nome do tipo de equipamento"
        />
      </div>
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <FontAwesomeIcon icon="fa-solid fa-image" class="mr-2" />
          Imagem de Fundo
        </label>
        <p class="text-sm text-gray-500 mb-2">escolha uma imagem quadrada</p>
        <div v-if="editedTypeOfEquipment.backgroundImg" class="my-2">
          <img
            :src="editedTypeOfEquipment.backgroundImg"
            class="max-h-20 rounded-md"
          />
        </div>
        <input
          type="file"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          @change="onEditedBackgroundFileChange"
        />
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/common/Modal.vue";
import Input from "@/components/ui/Input.vue";
import Table from "@/components/dashboard/Table.vue";
import auth from "@/services/authentication";
import { api } from "@/services/api";
import { createActionButtonsCell } from "@/utils/tableCells";
import permission from "@/services/permissions";

const props = defineProps({
  active: {
    type: String,
    required: true,
  },
});

const listOfTypesOfEquipment = ref([]);
const currentPage = ref(1);
const perPage = ref(10);
const registerTestTypeOfEquipment = ref("");
const registerTestTypeOfEquipmentId = ref("");
const modals = ref({
  registerTypeOfEquipmentModal: false,
  editTypeOfEquipmentModal: false,
});

const currentUser = ref(auth.currentUser());
const loading = ref(true);

const editedGroup = ref({
  _id: "",
  name: "",
});

const editedTypeOfEquipment = ref({
  _id: "",
  name: "",
  backgroundImg: "",
});

const typeOfEquipment = ref("");
const typeOfEquipmentBackgroundImg = ref("");

const columnsFormatted = computed(() => [
  {
    accessorKey: "name",
    header: "Nome",
    meta: {
      headerClass: "text-left pl-4",
      cellClass: "text-left pl-4",
    },
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
            class:
              "p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md mr-2",
            onClick: () => {
              if (props.active === "Equipamentos") {
                editSelectedTypeOfEquipment({
                  _id: info.row.original._id,
                  name: info.row.original.name,
                  backgroundImg: info.row.original.backgroundImg,
                });
                openModal("editTypeOfEquipmentModal");
              } else if (props.active === "Grupos") {
                editSelectedGroup({
                  _id: info.row.original._id,
                  name: info.row.original.name,
                });
                openModal("editGroupModal");
              }
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
              if (
                props.active === "Equipamentos" &&
                permission.canExcludeTypeOfEquipment(currentUser.value)
              ) {
                excludeTypeOfEquipment(info.row.original._id);
              } else if (
                props.active === "Grupos" &&
                permission.canExcludeGroup(currentUser.value)
              ) {
                excludeGroup(info.row.original._id);
              }
            },
          },
        },
      ];

      return createActionButtonsCell(
        info,
        actionButtons,
        "flex items-center justify-center"
      );
    },
  },
]);

const openModal = (modalName) => {
  modals.value[modalName] = true;
};

const editSelectedTypeOfEquipment = (editedItem) => {
  editedTypeOfEquipment.value = { ...editedItem };
};

const editSelectedGroup = (editedItem) => {
  editedGroup.value = { ...editedItem };
};

const loadTypesOfEquipment = async () => {
  loading.value = true;
  try {
    const response = await api.get("typeOfEquipment");
    listOfTypesOfEquipment.value = response.data;
  } catch (error) {
    console.error("Error loading equipment types:", error);
  } finally {
    loading.value = false;
  }
};

const createEditedBackground = (file) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement("canvas");
      const maxSize = 300;
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);

      editedTypeOfEquipment.value.backgroundImg = canvas.toDataURL("image/png");
    };
    image.src = e.target.result;
  };

  reader.readAsDataURL(file);
};

const onEditedBackgroundFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

  createEditedBackground(files[0]);
};

const registerTypeOfEquipment = async () => {
  const credentials = {
    name: typeOfEquipment.value,
    backgroundImg: typeOfEquipmentBackgroundImg.value,
  };

  loading.value = true;

  try {
    await auth.registerTypeOfEquipment({ credentials });
    await loadTypesOfEquipment();
    typeOfEquipment.value = "";
    typeOfEquipmentBackgroundImg.value = "";
    modals.value.registerTypeOfEquipmentModal = false;
  } catch (error) {
    console.error("Error registering type of equipment:", error);
  } finally {
    loading.value = false;
  }
};

const editTypeOfEquipment = async () => {
  loading.value = true;

  try {
    await auth.editTypeOfEquipment({
      editedTypeOfEquipment: editedTypeOfEquipment.value,
    });
    await loadTypesOfEquipment();
    modals.value.editTypeOfEquipmentModal = false;
  } catch (error) {
    console.error("Error editing type of equipment:", error);
  } finally {
    loading.value = false;
  }
};

const excludeTypeOfEquipment = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este tipo de equipamento?"))
    return;

  loading.value = true;

  const credentials = { _id: id };

  try {
    await auth.excludeTypeOfEquipment({ credentials });
    await loadTypesOfEquipment();
  } catch (error) {
    console.error("Error excluding type of equipment:", error);
  } finally {
    loading.value = false;
  }
};

const onBackgroundFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

  createBackground(files[0]);
};

const filteredListOfTypesOfEquipment = computed(() => {
  return listOfTypesOfEquipment.value.slice(
    (currentPage.value - 1) * perPage.value,
    currentPage.value * perPage.value
  );
});

const watchTypeOfEquipment = (newVal) => {
  if (!newVal) return;

  const found = listOfTypesOfEquipment.value.find((x) => x.name === newVal);
  if (found) {
    registerTestTypeOfEquipmentId.value = found._id;
  }
};

const createBackground = (file) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement("canvas");
      const maxSize = 300;
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);

      typeOfEquipmentBackgroundImg.value = canvas.toDataURL("image/png");
    };
    image.src = e.target.result;
  };

  reader.readAsDataURL(file);
};

watch(registerTestTypeOfEquipment, watchTypeOfEquipment);

onMounted(async () => {
  loading.value = true;
  try {
    await loadTypesOfEquipment();
  } finally {
    loading.value = false;
  }
});
</script>
