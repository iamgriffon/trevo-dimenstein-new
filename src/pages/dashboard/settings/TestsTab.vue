<template>
  <div>
    <!-- Tests Section -->
    <div class="mb-10">
      <div class="flex justify-between items-center mb-6">
        <h4 class="text-xl font-medium">Testes</h4>
        <Button
          @click="openModal('registerTestModal')"
          className="bg-green-600 max-w-64 rounded-md text-white font-medium hover:bg-green-700 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="mr-2" />
          Adicionar
        </Button>
      </div>

      <div class="relative">
        <!-- Loading overlay -->
        <div
          v-if="loading && loadingTypes"
          class="inset-0 bg-white bg-opacity-70 z-10 mt-20 flex justify-center items-center h-80"
        >
          <div class="text-center">
            <img src="/static/img/loading.gif" class="w-full h-full mx-auto" />
          </div>
        </div>

        <Table
          v-if="listOfTests.length > 0"
          :columns="columnsTestsTableFormatted"
          :data="filteredListOfTests"
          :totalItems="listOfTests.length"
          v-model:currentPage="currentPage"
          v-model:perPage="perPage"
          class="max-h-[500px] overflow-y-auto"
          footer-class="relative border-0 justify-center z-auto"
        />

        <div
          v-else-if="!loading"
          class="bg-white p-6 rounded-lg shadow text-center"
        >
          <p class="text-gray-500">Nenhum teste encontrado.</p>
        </div>
      </div>

      <!-- Register Test Modal -->
      <Modal
        :visible="modals.registerTestModal"
        title="Adicionar Teste"
        @update:visible="modals.registerTestModal = false"
        @ok="registerTest"
      >
        <div class="mb-3">
          <div class="form-group mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" />
              Nome
            </label>
            <Input v-model="testName" placeholder="Nome do teste" />
          </div>
          <div class="form-group mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-cubes" class="mr-2" />
              Tipo de Equipamento
            </label>
            <select
              v-model="registerTestTypeOfEquipment"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option
                v-for="option in typesOfEquipmentOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-cubes" class="mr-2" />
              Tipo de Teste
            </label>
            <select
              v-model="registerTestTypeOfTest"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option
                v-for="option in typesOfTestOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
      </Modal>

      <!-- Edit Test Modal -->
      <Modal
        :visible="modals.editTestModal"
        title="Editar Teste"
        @update:visible="modals.editTestModal = false"
        @ok="editTest"
      >
        <div class="mb-3">
          <div class="form-group mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" />
              Nome
            </label>
            <Input v-model="editedTest.name" placeholder="Nome do teste" />
          </div>
          <div class="form-group mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-cubes" class="mr-2" />
              Tipo de Equipamento
            </label>
            <select
              v-model="editedTest.typeOfEquipment"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option
                v-for="option in typesOfEquipmentOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-cubes" class="mr-2" />
              Tipo de Teste
            </label>
            <select
              v-model="editedTest.typeOfTest"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option
                v-for="option in typesOfTestOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
      </Modal>
    </div>

    <!-- Test Types Section -->
    <div>
      <div class="flex justify-between items-center mb-6">
        <h4 class="text-xl font-medium">Tipos de Testes</h4>
        <Button
          @click="openModal('registerTypeOfTestModal')"
          className="bg-gray-600 max-w-64 rounded-md text-white font-medium hover:bg-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="mr-2" />
          Adicionar
        </Button>
      </div>  

      <div class="relative">
        <Table
          v-if="listOfTypesOfTest.length > 0"
          :columns="columnsTypeOfTestsTableFormatted"
          :data="filteredListOfTypesOfTest"
          :totalItems="listOfTypesOfTest.length"
          v-model:currentPage="currentPageTypes"
          v-model:perPage="perPageTypes"
          class="max-h-[500px] overflow-y-auto"
          footer-class="relative border-0 justify-center z-auto"
        />

        <div
          v-else-if="!loadingTypes"
          class="bg-white p-6 rounded-lg shadow text-center"
        >
          <p class="text-gray-500">Nenhum tipo de teste encontrado.</p>
        </div>
      </div>

      <!-- Register Type of Test Modal -->
      <Modal
        :visible="modals.registerTypeOfTestModal"
        title="Adicionar Tipo de Teste"
        @update:visible="modals.registerTypeOfTestModal = false"
        @ok="registerTypeOfTest"
      >
        <div class="mb-3">
          <div class="form-group mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" />
              Tipo de Teste
            </label>
            <Input v-model="typeOfTest" placeholder="Nome do tipo de teste" />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" />
              Tempo de Validade (dias)
            </label>
            <Input
              type="number"
              v-model="typeOfTestExpirationInDays"
              placeholder="Dias de validade"
            />
          </div>
        </div>
      </Modal>

      <!-- Edit Type of Test Modal -->
      <Modal
        :visible="modals.editTypeOfTestModal"
        title="Editar Tipo de Teste"
        @update:visible="modals.editTypeOfTestModal = false"
        @ok="editTypeOfTest"
        class="max-w-2xl"
      >
        <div class="mb-3">
          <div class="form-group mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" />
              Tipo de Teste
            </label>
            <Input
              v-model="editedTypeOfTest.name"
              placeholder="Nome do tipo de teste"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" />
              Tempo de Validade (dias)
            </label>
            <Input
              type="number"
              v-model="editedTypeOfTest.expirationInDays"
              placeholder="Dias de validade"
            />
          </div>
        </div>
      </Modal>
    </div>
  </div>
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
import { createActionButtonsCell, createTextCell } from "@/utils/tableCells";
import permission from "@/services/permissions";

const emit = defineEmits(["update:loading"]);

const currentUser = ref(auth.currentUser());
const loading = ref(true);
const loadingTypes = ref(true);

// Tests data
const listOfTests = ref([]);
const currentPage = ref(1);
const perPage = ref(10);

// Test Types data
const listOfTypesOfTest = ref([]);
const currentPageTypes = ref(1);
const perPageTypes = ref(10);

// Options for select dropdowns
const typesOfEquipmentOptions = ref([]);
const typesOfTestOptions = ref([]);

// Form fields
const testName = ref("");
const registerTestTypeOfEquipment = ref("");
const registerTestTypeOfEquipmentId = ref("");
const registerTestTypeOfTest = ref("");
const registerTestTypeOfTestId = ref("");
const typeOfTest = ref("");
const typeOfTestExpirationInDays = ref("");

// Edited entities
const editedTest = ref({
  _id: "",
  name: "",
  typeOfEquipment: "",
  typeOfTest: "",
  typeOfEquipmentId: "",
  typeOfTestId: "",
});

const editedTypeOfTest = ref({
  _id: "",
  name: "",
  expirationInDays: "",
});

// Modals state
const modals = ref({
  registerTestModal: false,
  editTestModal: false,
  registerTypeOfTestModal: false,
  editTypeOfTestModal: false,
});

// Computed properties
const filteredListOfTests = computed(() => {
  return listOfTests.value.slice(
    (currentPage.value - 1) * perPage.value,
    currentPage.value * perPage.value
  );
});

const filteredListOfTypesOfTest = computed(() => {
  return listOfTypesOfTest.value.slice(
    (currentPageTypes.value - 1) * perPageTypes.value,
    currentPageTypes.value * perPageTypes.value
  );
});

// Table columns definitions
const columnsTestsTableFormatted = computed(() => [
  {
    accessorKey: "name",
    header: "Nome",
    meta: {
      headerClass: "text-left pl-4",
      cellClass: "text-left pl-4",
    },
  },
  {
    accessorKey: "typeOfEquipment",
    header: "Tipo de Equipamento",
  },
  {
    accessorKey: "typeOfTest",
    header: "Tipo de Teste",
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
              editSelectedTest({
                _id: info.row.original._id,
                name: info.row.original.name,
                typeOfEquipment: info.row.original.typeOfEquipment,
                typeOfTest: info.row.original.typeOfTest,
              });
              openModal("editTestModal");
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
              if (permission.canExcludeTypeOfEquipment(currentUser.value)) {
                excludeTest(info.row.original._id);
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

const columnsTypeOfTestsTableFormatted = computed(() => [
  {
    accessorKey: "name",
    header: "Nome",
    meta: {
      headerClass: "text-left pl-4",
      cellClass: "text-left pl-4",
    },
    cell: (info) => {
      return createTextCell(info, "text-left pl-4");
    },
  },
  {
    accessorKey: "expirationInDays",
    header: "Validade (dias)",
    cell: (info) => {
      return info.row.original.expirationInDays
        ? `${info.row.original.expirationInDays} dias`
        : "—";
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
              editSelectedTypeOfTest({
                _id: info.row.original._id,
                name: info.row.original.name,
                expirationInDays: info.row.original.expirationInDays,
              });
              openModal("editTypeOfTestModal");
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
              if (permission.canExcludeTypeOfEquipment(currentUser.value)) {
                excludeTypeOfTest(info.row.original._id);
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

// Methods
const openModal = (modalName) => {
  modals.value[modalName] = true;
};

// Load data functions
const loadTypesOfEquipment = async () => {
  loading.value = true;
  try {
    const response = await api.get("typeOfEquipment");

    if (!response.data.length) return;

    typesOfEquipmentOptions.value = [];
    for (const item of response.data) {
      typesOfEquipmentOptions.value.push(item.name);
    }
    typesOfEquipmentOptions.value.sort();
  } catch (error) {
    console.error("Error loading equipment types:", error);
  } finally {
    loading.value = false;
  }
};

const loadTypesOfTest = async () => {
  loadingTypes.value = true;
  listOfTypesOfTest.value = [];
  typesOfTestOptions.value = [];

  try {
    const response = await api.get("typeOfTest");

    if (!response.data.length) return;

    listOfTypesOfTest.value = response.data;
    for (const item of response.data) {
      typesOfTestOptions.value.push(item.name);
    }
    typesOfTestOptions.value.sort();
  } catch (error) {
    console.error("Error loading test types:", error);
  } finally {
    loadingTypes.value = false;
  }
};

const loadTests = async () => {
  loading.value = true;
  listOfTests.value = [];

  try {
    const response = await api.get("test");

    if (!response.data.length) return;

    listOfTests.value = response.data;
  } catch (error) {
    console.error("Error loading tests:", error);
  } finally {
    loading.value = false;
  }
};

// Test type functions
const registerTypeOfTest = async () => {
  if (!typeOfTest.value || !typeOfTestExpirationInDays.value) {
    alert("Por favor preencha todos os campos");
    return;
  }

  const credentials = {
    name: typeOfTest.value,
    expirationInDays: typeOfTestExpirationInDays.value,
  };

  loading.value = true;
  emit("update:loading", true);

  try {
    await auth.registerTypeOfTest({ credentials });
    await loadTypesOfTest();
    typeOfTest.value = "";
    typeOfTestExpirationInDays.value = "";
    modals.value.registerTypeOfTestModal = false;
  } catch (error) {
    console.error("Error registering type of test:", error);
  } finally {
    loading.value = false;
    emit("update:loading", false);
  }
};

const editSelectedTypeOfTest = (editedItem) => {
  editedTypeOfTest.value = { ...editedItem };
};

const editTypeOfTest = async () => {
  loading.value = true;
  emit("update:loading", true);

  try {
    await auth.editTypeOfTest({ editedTypeOfTest: editedTypeOfTest.value });
    await loadTypesOfTest();
    modals.value.editTypeOfTestModal = false;
  } catch (error) {
    console.error("Error editing type of test:", error);
  } finally {
    loading.value = false;
    emit("update:loading", false);
  }
};

const excludeTypeOfTest = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este tipo de teste?")) return;

  loading.value = true;
  emit("update:loading", true);

  const credentials = { _id: id };

  try {
    await auth.excludeTypeOfTest({ credentials });
    await loadTypesOfTest();
  } catch (error) {
    console.error("Error excluding type of test:", error);
  } finally {
    loading.value = false;
    emit("update:loading", false);
  }
};

// Test functions
const registerTest = async () => {
  if (
    !testName.value ||
    !registerTestTypeOfEquipment.value ||
    !registerTestTypeOfTest.value
  ) {
    alert("Por favor preencha todos os campos");
    return;
  }

  const credentials = {
    name: testName.value,
    typeOfEquipment: registerTestTypeOfEquipment.value,
    typeOfEquipmentId: registerTestTypeOfEquipmentId.value,
    typeOfTest: registerTestTypeOfTest.value,
    typeOfTestId: registerTestTypeOfTestId.value,
  };

  loading.value = true;
  emit("update:loading", true);

  try {
    await auth.registerTest({ credentials });
    await loadTests();
    testName.value = "";
    registerTestTypeOfEquipment.value = "";
    registerTestTypeOfTest.value = "";
    modals.value.registerTestModal = false;
  } catch (error) {
    console.error("Error registering test:", error);
  } finally {
    loading.value = false;
    emit("update:loading", false);
  }
};

const editSelectedTest = (editedItem) => {
  editedTest.value = { ...editedItem };
};

const editTest = async () => {
  loading.value = true;
  emit("update:loading", true);

  try {
    await auth.editTest({ editedTest: editedTest.value });
    await loadTests();
    modals.value.editTestModal = false;
  } catch (error) {
    console.error("Error editing test:", error);
  } finally {
    loading.value = false;
    emit("update:loading", false);
  }
};

const excludeTest = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este teste?")) return;

  loading.value = true;
  emit("update:loading", true);

  const credentials = { _id: id };

  try {
    await auth.excludeTest({ credentials });
    await loadTests();
  } catch (error) {
    console.error("Error excluding test:", error);
  } finally {
    loading.value = false;
    emit("update:loading", false);
  }
};

// Watchers for select dropdowns
const watchTypeOfEquipment = (newVal) => {
  if (!newVal) return;

  // Get the ID for the selected equipment type
  const response = api.get("typeOfEquipment").then((response) => {
    const found = response.data.find((x) => x.name === newVal);
    if (found) {
      registerTestTypeOfEquipmentId.value = found._id;
    }
  });
};

const watchTypeOfTest = (newVal) => {
  if (!newVal) return;

  // Get the ID for the selected test type
  const response = api.get("typeOfTest").then((response) => {
    const found = response.data.find((x) => x.name === newVal);
    if (found) {
      registerTestTypeOfTestId.value = found._id;
    }
  });
};

const setupWatchers = () => {
  // Watch for equipment/test type selection changes
  watch(registerTestTypeOfEquipment, watchTypeOfEquipment);
  watch(registerTestTypeOfTest, watchTypeOfTest);

  // Watch for edit test equipment/test changes
  watch(
    () => editedTest.value.typeOfEquipment,
    (newVal) => {
      if (!newVal) return;

      api.get("typeOfEquipment").then((response) => {
        const found = response.data.find((x) => x.name === newVal);
        if (found) {
          editedTest.value.typeOfEquipmentId = found._id;
        }
      });
    }
  );

  watch(
    () => editedTest.value.typeOfTest,
    (newVal) => {
      if (!newVal) return;

      api.get("typeOfTest").then((response) => {
        const found = response.data.find((x) => x.name === newVal);
        if (found) {
          editedTest.value.typeOfTestId = found._id;
        }
      });
    }
  );
};

// Initialize component
onMounted(async () => {
  try {
    loading.value = true;
    loadingTypes.value = true;

    await Promise.all([loadTypesOfEquipment(), loadTypesOfTest(), loadTests()]);

    setupWatchers();
  } finally {
    loading.value = false;
    loadingTypes.value = false;
  }
});
</script>
