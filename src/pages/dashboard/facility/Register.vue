<template>
  <Layout title="Criar nova instalação">
    <template #header>
      <button
        class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
      >
        <RouterLink to="/facility">
          <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
        </RouterLink>
      </button>
    </template>
    <div class="flex flex-col gap-6 w-full mb-10">
      <!-- Department Selection -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="form-group">
          <h4 class="font-medium text-lg mb-2">
            <span class="text-red-500">*</span>Departamento:
          </h4>
          <select
            v-model="facility.department"
            class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Selecione um departamento"
          >
            <option value="both">Ambos</option>
            <option value="nuclearmedicine">Medicina Nuclear</option>
            <option value="radiodiagnosis">Radiodiagnóstico</option>
          </select>
        </div>
      </div>

      <!-- Group Selection -->
      <div class="bg-white p-6 rounded-lg shadow">
          <div class="form-group">
          <h4 class="font-medium text-lg mb-2">Grupo:</h4>
          <select
            v-model="facility.group"
            class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Selecione um grupo"
          >
            <option
              v-for="group in groupOptions"
              :key="group.name._id"
              :value="group"
            >
              {{ group.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Logo and Background Image -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-regular fa-image" class="mr-2" /> Logo
          </label>
          <p class="text-sm text-gray-500 mb-2">escolha uma imagem quadrada</p>
          <input
            type="file"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            @change="onLogoFileChange"
          />
          </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-regular fa-image" class="mr-2" /> Imagem
            de Fundo
          </label>
          <p class="text-sm text-gray-500 mb-2">escolha uma imagem quadrada</p>
          <input
            type="file"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            @change="onBackgroundFileChange"
          />
        </div>
          </div>

      <!-- Facility Information -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div
          v-if="error"
          class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        >
          <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" class="mr-2" />
          {{ errors }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-building" class="mr-2" />
              Nome<span class="text-red-500">*</span>
            </label>
            <Input v-model="facility.name" placeholder="Nome" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-building" class="mr-2" />
              Razão Social<span class="text-red-500">*</span>
            </label>
            <Input
              v-model="facility.companyName"
              placeholder="Razão Social"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-list-alt" class="mr-2" /> CNPJ
            </label>
            <Input
              v-model="facility.cnpj"
              placeholder="00.000.000/0000-00"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-phone" class="mr-2" /> Telefone
            </label>
            <Input
              v-model="facility.telephone"
              placeholder="Telefone"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" /> Contato
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input
              v-model="facility.contactName"
              placeholder="Contato"
              class="w-full"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-map-marker" class="mr-2" />
            Endereço<span class="text-red-500">*</span>
          </label>
          <p class="text-sm text-gray-500 mb-2">
            formato: Logradouro, número - Bairro - Cidade - UF CEP
          </p>
          <Input
            v-model="facility.address.street"
            placeholder="Endereço"
            class="w-full"
          />
                </div>
              </div>

      <!-- Personnel Section -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-medium mb-4">
          <FontAwesomeIcon icon="fa-solid fa-users" class="mr-2" /> Pessoas
        </h3>
        <p class="mb-4">
          Selecione as pessoas responsáveis por essa instalação
          <span class="text-sm text-gray-500 ml-1">opcional</span>
        </p>

        <!-- Facility Titular -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Titular da Instalação:
          </label>
          <div v-if="facilityTitular" class="flex items-center">
            <Button
              className="flex items-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              :title="'Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo'"
            >
              <FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" />
              {{ facilityTitular }}
            </Button>
          </div>
          <Button
            v-else
            className="flex items-center gap-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
            @click="showTitularModal = true"
          >
            Selecionar pessoa
          </Button>
            </div>

        <!-- Technical Responsible -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Responsável técnico:
          </label>
          <div v-if="tecnicalReponsible" class="flex items-center">
            <Button
              className="flex items-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              :title="'Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo'"
            >
              <FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" />
              {{ tecnicalReponsible }}
            </Button>
          </div>
          <Button
            v-else
            className="flex items-center gap-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
            @click="showTechnicalResponsibleModal = true"
          >
            Selecionar pessoa
          </Button>
            </div>

        <!-- Selected People List -->
        <div v-if="facility.users.length > 0" class="mt-6">
          <h4 class="font-medium mb-3">Pessoas selecionadas:</h4>
          <div class="overflow-x-auto">
            <Table
              :columns="columns"
              :data="facility.users"
              :totalItems="facility.users.length"
              :currentPage="1"
              :perPage="10"
              :footerClass="'w-screen'"
              class="max-h-[500px] overflow-y-auto"
            />
          </div>
                </div>
          </div>

      <!-- Submit Button -->
      <Button
        className="py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
        @click="register"
      >
        Criar nova instalação
      </Button>
            </div>

    <!-- Modals -->
    <Modal
      :visible="showTitularModal"
      title="Selecionar titular da instalação"
      @update:visible="showTitularModal = false"
      :style="{
        height: 'fit-content',
        minWidth: '1024px',
        maxHeight: '65vh',
        paddingBottom: '45px',
      }"
    >
      <div class="w-full px-4">
        <div class="mb-4">
          <div class="flex">
            <Input v-model="filter" placeholder="buscar..." class="w-full">
              <FontAwesomeIcon icon="fa-solid fa-search" />
            </Input>
          </div>
            </div>

        <div v-if="!filteredUsers.length" class="text-center p-6">
          <h4 class="text-gray-500">
            <FontAwesomeIcon icon="fa-regular fa-square" />
          </h4>
        </div>
        <Table
          v-else
          :columns="userColumns"
          :data="
            filteredUsers.slice(
              perPage * (currentPage - 1),
              perPage * currentPage
            )
          "
          :totalItems="filteredUsers.length"
          v-model:currentPage="currentPage"
          v-model:perPage="perPage"
          :footerClass="'left-0'"
          :class="'max-h-[45vh] overflow-y-auto'"
        />
          </div>
    </Modal>

    <Modal
      :visible="showTechnicalResponsibleModal"
      title="Selecionar responsável técnico"
      @update:visible="showTechnicalResponsibleModal = false"
      :style="{
        height: 'fit-content',
        minWidth: '1024px',
        maxHeight: '65vh',
        paddingBottom: '45px',
      }"
    >
      <div class="w-full px-4">
        <div class="mb-4">
          <div class="flex">
            <Input v-model="filter" placeholder="buscar..." class="w-full">
              <FontAwesomeIcon icon="fa-solid fa-search" />
            </Input>
          </div>
        </div>

        <div v-if="!filteredUsers.length" class="text-center p-6">
          <h4 class="text-gray-500">
            <FontAwesomeIcon icon="fa-regular fa-square" />
          </h4>
        </div>
        <Table
          v-else
          :columns="userColumns"
          :data="filteredUsers"
          :totalItems="filteredUsers.length"
          :currentPage="currentPage"
          :perPage="perPage"
          :footerClass="'left-0'"
          :class="'max-h-[45vh] overflow-y-auto'"
        />
      </div>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
import auth from "@/services/authentication";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import Table from "@/components/dashboard/Table.vue";
import Modal from "@/components/common/Modal.vue";
import DataLetters from "@/components/common/DataLetters.vue";
import { createActionButtonsCell } from "@/utils/tableCells";

// Modal visibility states
const showTitularModal = ref(false);
const showTechnicalResponsibleModal = ref(false);

// Pagination
const perPage = ref(10);
const currentPage = ref(1);

// Form data
const filter = ref("");
const users = ref([]);
const error = ref(false);
const errors = ref("");
const currentUser = ref(auth.currentUser());
const loading = ref(false);

// Role holders
const facilityTitular = ref("");
const tecnicalReponsible = ref("");
const groupOptions = ref([]);

// Main facility data
const facility = ref({
  name: "",
  companyName: "",
  cnpj: "",
  telephone: "",
  contactName: "",
      users: [],
  address: {
    street: "",
  },
  department: "both",
  group: null,
  logoImg: "",
  backgroundImg: "",
});

// Table columns
const columns = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: (info) =>
      h("div", { class: "flex items-center" }, [
        h(DataLetters, {
          fullName: info.getValue(),
        }),
        h("span", {}, info.getValue()),
      ]),
    meta: {
      cellClass: "min-w-8",
      headerClass: "text-left pl-4",
    },
  },
  {
    accessorKey: "responsabilities",
    header: "Responsabilidade",
    cell: (info) => info.getValue().join(", ") || "-",
  },
  {
    accessorKey: "actions",
    header: "Ações",
    meta: {
      cellClass: "flex items-center justify-end pr-4",
      headerClass: "text-right pr-4",
    },
    cell: (info) =>
      h(
        "button",
        {
          class: "p-2 bg-red-600 hover:bg-red-700 text-white rounded-md",
          onClick: () => removeUser(info.row.original._id),
        },
        [h(FontAwesomeIcon, { icon: "fa-solid fa-trash" })]
      ),
  },
];

// User selection columns for modals
const userColumns = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: (info) =>
      h("div", { class: "flex items-center gap-4 mx-2" }, [
        h(DataLetters, {
          fullName: info.getValue(),
        }),
        h("span", {}, info.getValue()),
      ]),
    meta: {
      headerClass: "text-left pl-4",
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    meta: {
      cellClass: "flex items-center justify-end pr-4",
      headerClass: "text-right pr-4",
    },
    cell: (info) => {
      const actionButtons = [
        {
          type: "button",
          icon: "fa-solid fa-plus",
          props: {
            class: "p-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-md",
            onClick: () => {
              addToSelectedUsers(info.row.original._id);

              // Check which modal is open and assign the proper role
              if (showTitularModal.value) {
                selectResponsability(
                  info.row.original._id,
                  "Titular da instalação"
                );
                showTitularModal.value = false;
              } else if (showTechnicalResponsibleModal.value) {
                selectResponsability(
                  info.row.original._id,
                  "Responsável técnico"
                );
                showTechnicalResponsibleModal.value = false;
              }
            },
          },
          title: "Adicionar",
        }
      ];
      return createActionButtonsCell(info, actionButtons, "flex items-center justify-end");
    },
  },
];

// Computed properties
const filteredUsers = computed(() => {
  if (!filter.value) {
    return users.value;
  }

  const searchTerm = filter.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      (user.email && user.email.toLowerCase().includes(searchTerm)) ||
      (user.ANLicenseNumber &&
        user.ANLicenseNumber.toLowerCase().includes(searchTerm)) ||
      (user.FMLicenseNumber &&
        user.FMLicenseNumber.toLowerCase().includes(searchTerm))
  );
});

// Methods
const register = async () => {
  error.value = false;
  errors.value = "";

  // Validation
  if (
    !facility.value.name ||
    !facility.value.companyName ||
    !facility.value.address.street
  ) {
    error.value = true;
    errors.value = "Os campos com * são obrigatórios";
    return;
  }

  loading.value = true;
  try {
    await auth.registerFacility({ facility: facility.value }, "/facility");
  } catch (err) {
    error.value = true;
    errors.value = err.response?.data || "Erro ao registrar instalação";
  } finally {
    loading.value = false;
  }
};

const loadUsers = async () => {
  try {
    const response = await axios.get(`${auth.apiUrl()}users/`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });

    if (!response.data.length) {
      errors.value = "Nenhum usuário encontrado";
      return;
    }

    users.value = response.data.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      ANLicenseNumber: user.ANLicenseNumber,
      FMLicenseNumber: user.FMLicenseNumber,
    }));
  } catch (error) {
    errors.value = error.response?.data || "Erro ao carregar usuários";
  }
};

const loadGroups = async () => {
  try {
    const response = await axios.get(`${auth.apiUrl()}group`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });

    if (!response.data.length) {
      return;
    }

    groupOptions.value = response.data.map((group) => ({
      name: { name: group.name, _id: group._id },
      label: group.name,
    }));

    groupOptions.value.sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    errors.value = error.response?.data || "Erro ao carregar grupos";
  }
};

const addToSelectedUsers = (userId) => {
  const user = users.value.find((u) => u._id === userId);
  if (!user) return;

  // Check if user is already selected
  const existingIndex = facility.value.users.findIndex((u) => u._id === userId);
  if (existingIndex >= 0) return;

  // Add to selected users
  facility.value.users.push({
    _id: user._id,
    name: user.name,
    responsabilities: [],
  });

  // Remove from available users
  const index = users.value.findIndex((u) => u._id === userId);
  if (index >= 0) {
    users.value.splice(index, 1);
  }
};

const removeUser = (userId) => {
  // Find user in facility users
  const index = facility.value.users.findIndex((u) => u._id === userId);
  if (index < 0) return;

  const user = facility.value.users[index];

  // Check if user has special role and clear it
  if (user.responsabilities.includes("Titular da instalação")) {
    facilityTitular.value = "";
  }
  if (user.responsabilities.includes("Responsável técnico")) {
    tecnicalReponsible.value = "";
  }

  // Remove from facility users
  facility.value.users.splice(index, 1);

  // Add back to available users
  const originalUser = users.value.find((u) => u._id === userId);
  if (!originalUser) {
    // Fetch user data from the API if not found locally
    axios
      .get(`${auth.apiUrl()}users/${userId}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((response) => {
        users.value.push({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          type: response.data.type,
          ANLicenseNumber: response.data.ANLicenseNumber,
          FMLicenseNumber: response.data.FMLicenseNumber,
        });
      });
  }
};

const selectResponsability = (userId, responsability) => {
  const userIndex = facility.value.users.findIndex((u) => u._id === userId);
  if (userIndex < 0) return;

  const user = facility.value.users[userIndex];

  // If user is already set as this role, do nothing
  if (user.responsabilities.includes(responsability)) return;

  // Add the responsability
  if (!user.responsabilities) {
    user.responsabilities = [];
  }
  user.responsabilities.push(responsability);

  // Set the role holder reference
  if (responsability === "Titular da instalação") {
    facilityTitular.value = user.name;
  } else if (responsability === "Responsável técnico") {
    tecnicalReponsible.value = user.name;
  }
};

// Image handling
const onLogoFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

  createLogo(files[0]);
};

const createLogo = (file) => {
  const reader = new FileReader();

      reader.onload = (e) => {
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement("canvas");
      const maxSize = 200;
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

      facility.value.logoImg = canvas.toDataURL("image/png");
    };
    image.src = e.target.result;
  };

  reader.readAsDataURL(file);
};

const onBackgroundFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

  createBackground(files[0]);
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

      facility.value.backgroundImg = canvas.toDataURL("image/png");
    };
    image.src = e.target.result;
  };

  reader.readAsDataURL(file);
};

// Load data on component mount
onMounted(() => {
  loadUsers();
  loadGroups();
});
</script>
