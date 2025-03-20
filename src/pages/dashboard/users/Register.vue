<template>
  <Layout title="Adicionar Nova Pessoa">
    <template #breadcrumb>
      <p class="flex pl-2 gap-2 text-teal-800">
        <span>/</span>
        <span class="font-medium">Adicionar pessoa</span>
      </p>
    </template>

    <div class="flex flex-col gap-6 w-full">
      <section class="bg-white p-6 rounded-lg shadow">
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4"
        >
          <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" /> {{ errors }}
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="userName">
            <FontAwesomeIcon icon="fa-solid fa-user" /> Nome Completo<span
              class="text-red-500"
              >*</span
            >
          </label>
          <input
            type="text"
            id="userName"
            class="w-full p-2 border border-gray-300 rounded-md"
            :class="{ 'border-red-500': errors.includes('name') }"
            placeholder="Nome Completo"
            v-model="user.name"
            v-validate="{ required: true, regex: /^(.*\s+.*)+$/ }"
            name="name"
            required
          />
          <div v-if="errors.includes('name')" class="text-red-500 text-sm mt-1">
            Este é um campo obrigatório. Adicione nome e sobrenome.
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="userCpf">
            <FontAwesomeIcon icon="fa-solid fa-id-card" /> CPF
            <small class="text-gray-500 ml-1">opcional</small>
          </label>
          <input
            type="text"
            id="userCpf"
            class="w-full p-2 border border-gray-300 rounded-md"
            placeholder="000.000.000-00"
            v-model="user.cpf"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="userTelephone">
            <FontAwesomeIcon icon="fa-solid fa-phone" /> Telefone
            <small class="text-gray-500 ml-1">opcional</small>
          </label>
          <input
            type="text"
            id="userTelephone"
            class="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Telefone"
            v-model="user.telephone"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="userType">
            <FontAwesomeIcon icon="fa-solid fa-id-badge" /> Tipo de Usuário
            <small class="text-gray-500 ml-1">
              <a href="#" class="text-teal-800 hover:underline"
                >como funciona?</a
              >
            </small>
          </label>
          <select
            id="userType"
            v-model="user.type"
            class="w-full p-2 border border-gray-300 rounded-md"
          >
            <option
              v-if="currentUser.type === 'administrador'"
              value="administrador"
            >
              administrador
            </option>
            <option
              v-if="currentUser.type === 'administrador'"
              value="rad laudos"
            >
              rad laudos
            </option>
            <option
              v-if="currentUser.type === 'administrador'"
              value="rad fisico"
            >
              rad fisico
            </option>
            <option
              v-if="currentUser.type === 'administrador'"
              value="rad admin"
            >
              rad admin
            </option>
            <option value="cliente">cliente</option>
            <option value="cliente MN">cliente MN</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="userEmail">
            <FontAwesomeIcon icon="fa-solid fa-envelope" /> Email<span
              class="text-red-500"
              >*</span
            >
          </label>
          <input
            type="email"
            id="userEmail"
            class="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Email"
            v-model.trim="user.email"
            @input="
              user.email = $event.target.value
                .toLowerCase()
                .replace(' ', '')
                .trim()
            "
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="userPassword">
            <FontAwesomeIcon icon="fa-solid fa-key" /> Senha<span
              class="text-red-500"
              >*</span
            >
          </label>
          <div class="flex">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="userPassword"
              class="flex-1 p-2 border border-gray-300 rounded-l-md"
              placeholder="Senha"
              v-model="user.password"
            />
            <button
              type="button"
              class="px-3 py-2 bg-gray-200 border border-gray-300 border-l-0"
              @click="showPassword = !showPassword"
            >
              <FontAwesomeIcon
                :icon="
                  showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                "
              />
            </button>
            <button
              type="button"
              class="px-3 py-2 text-teal-800 border border-teal-800 border-l-0 rounded-r-md hover:bg-teal-800 hover:text-white transition-colors"
              @click="generatePassword()"
            >
              Gerar Senha
            </button>
          </div>
          <div class="mt-2">
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                class="w-5 h-5"
                v-model="willSendPassword"
              />
              Enviar email de boas vindas com senha
            </label>
          </div>
        </div>
      </section>

      <section class="bg-white p-6 rounded-lg shadow">
        <h4 class="text-xl font-medium mb-4">Certificados CNEN</h4>

        <div class="mb-4">
          <label class="block mb-2" for="anLicense">
            <FontAwesomeIcon icon="fa-solid fa-file-pdf" /> Licença AN
            <small class="text-gray-500 ml-1">opcional</small>
          </label>
          <input
            type="file"
            id="anLicense"
            class="w-full p-2 border border-gray-300 rounded-md"
            @change="onANLicenseFileChange"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="anLicenseNumber">
            <FontAwesomeIcon icon="fa-solid fa-id-card" /> Número da Licença AN
            <small class="text-gray-500 ml-1">opcional</small>
          </label>
          <input
            type="text"
            id="anLicenseNumber"
            class="w-full p-2 border border-gray-300 rounded-md"
            placeholder="AA-0000"
            v-model="user.ANLicenseNumber"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="anLicenseValidity">
            <FontAwesomeIcon icon="fa-solid fa-calendar-alt" /> Validade da
            Licença AN
            <small class="text-gray-500 ml-1">opcional</small>
          </label>
          <input
            type="date"
            id="anLicenseValidity"
            class="w-full p-2 border border-gray-300 rounded-md"
            v-model="user.ANLicenseValidity"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="fmLicense">
            <FontAwesomeIcon icon="fa-solid fa-file-pdf" /> Licença FM
            <small class="text-gray-500 ml-1">opcional</small>
          </label>
          <input
            type="file"
            id="fmLicense"
            class="w-full p-2 border border-gray-300 rounded-md"
            @change="onFMLicenseFileChange"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="fmLicenseNumber">
            <FontAwesomeIcon icon="fa-solid fa-id-card" /> Número da Licença FM
            <small class="text-gray-500 ml-1">opcional</small>
          </label>
          <input
            type="text"
            id="fmLicenseNumber"
            class="w-full p-2 border border-gray-300 rounded-md"
            placeholder="AA-0000"
            v-model="user.FMLicenseNumber"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2" for="fmLicenseValidity">
            <FontAwesomeIcon icon="fa-solid fa-calendar-alt" /> Validade da
            Licença FM
            <small class="text-gray-500 ml-1">opcional</small>
          </label>
          <input
            type="date"
            id="fmLicenseValidity"
            class="w-full p-2 border border-gray-300 rounded-md"
            v-model="user.FMLicenseValidity"
          />
        </div>
      </section>

      <section
        v-if="user.type === 'cliente' || user.type === 'cliente MN'"
        class="bg-white p-6 rounded-lg shadow"
      >
        <h4 class="text-xl font-medium mb-4">
          Selecione as instalações que esse usuário terá acesso
          <small class="text-gray-500 block text-sm mt-1"
            >opcional. Usuários rad dimenstein possuem acesso a todas as
            instalações por padrão.</small
          >
        </h4>

        <div class="mb-4">
          <Input
            v-model="filter"
            placeholder="Buscar..."
            class="w-full px-3 border mb-4 rounded-md border-gray-300"
          >
            <FontAwesomeIcon icon="fa-solid fa-search" />
          </Input>
        </div>

        <div
          v-if="!filteredFacilities.length"
          class="bg-white p-6 rounded-lg text-center mb-6"
        >
          <h4 class="text-lg font-medium">Nenhum resultado</h4>
        </div>

        <div v-else class="mb-8">
          <Table
            :columns="facilitiesColumns"
            :data="filteredFacilities"
            :totalItems="filteredFacilities.length"
            v-model:currentPage="currentPage"
            v-model:perPage="perPage"
            footer-class="relative border-0 justify-center z-auto"
          />
        </div>

        <h4 class="text-xl font-medium mb-4">Instalações selecionadas</h4>

        <div
          v-if="selectedFacilities.length === 0"
          class="bg-white p-6 rounded-lg text-center mb-6"
        >
          Nenhuma instalação selecionada...
        </div>

        <div v-else class="mb-8">
          <Table
            :columns="selectedFacilitiesColumns"
            :data="selectedFacilities"
            :totalItems="selectedFacilities.length"
            v-model:currentPage="currentPage"
            v-model:perPage="perPage"
            footer-class="relative border-0 justify-center z-auto"
          />
        </div>
      </section>

      <button
        class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mb-8"
        @click="register()"
      >
        Criar pessoa
      </button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
import Hashids from "hashids";
import auth from "@/services/authentication";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Table from "@/components/dashboard/Table.vue";
import { createActionButtonsCell } from "@/utils/tableCells";

// Router
const router = useRouter();

// State variables
const filter = ref("");
const facilities = ref([]);
const selectedFacilities = ref([]);
const error = ref(false);
const errors = ref("");
const showPassword = ref(false);
const willSendPassword = ref(false);
const currentPage = ref(1);
const perPage = ref(10);

// User data
const user = ref({
  email: "",
  name: "",
  cpf: "",
  type: "",
  telephone: "",
  password: "",
  ANLicense: "",
  ANLicenseNumber: "",
  ANLicenseValidity: "",
  FMLicense: "",
  FMLicenseNumber: "",
  FMLicenseValidity: "",
});

// Current user information
const currentUser = auth.currentUser();

// Table columns
const facilitiesColumns = [
  {
    accessorKey: "action",
    header: "",
    cell: (info) => {
      const buttons = [
        {
          type: "button",
          icon: "fa-solid fa-plus",
          props: {
            class:
              "bg-green-600 hover:bg-green-700 transition-all duration-300 text-white rounded-full w-10 h-10",
            onClick: () => addToSelectedFacilities(info.row.original._id),
            title: "Adicionar",
          },
        },
      ];
      return createActionButtonsCell(info, buttons);
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
];

const selectedFacilitiesColumns = [
  {
    accessorKey: "action",
    header: "",
    cell: (info) => {
      const buttons = [
        {
          type: "button",
          icon: "fa-solid fa-times",
          props: {
            class:
              "bg-red-600 hover:bg-red-700 transition-all duration-300 text-white rounded-full w-10 h-10",
            onClick: () => removeFromSelectedFacilities(info.row.original._id),
            title: "Remover",
          },
        },
      ];
      return createActionButtonsCell(info, buttons);
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
];

// Computed properties
const filteredFacilities = computed(() => {
  if (filter.value.length > 0) {
    const exp = new RegExp(filter.value.trim(), "i");
    return facilities.value
      .filter((facility) => exp.test(facility.name))
      .filter(
        (facility) =>
          !selectedFacilities.value.some((f) => f._id === facility._id)
      )
      .slice(
        (currentPage.value - 1) * perPage.value,
        currentPage.value * perPage.value
      );
  }
  return facilities.value
    .filter(
      (facility) =>
        !selectedFacilities.value.some((f) => f._id === facility._id)
    )
    .slice(
      (currentPage.value - 1) * perPage.value,
      currentPage.value * perPage.value
    );
});

// Methods
function register() {
  const credentials = {
    email: user.value.email.toLowerCase().replace(" ", "").trim(),
    cpf: user.value.cpf,
    password: user.value.password,
    name: user.value.name,
    type: user.value.type,
    telephone: user.value.telephone,
    ANLicense: user.value.ANLicense,
    ANLicenseNumber: user.value.ANLicenseNumber,
    ANLicenseValidity: user.value.ANLicenseValidity,
    FMLicense: user.value.FMLicense,
    FMLicenseNumber: user.value.FMLicenseNumber,
    FMLicenseValidity: user.value.FMLicenseValidity,
    willSendPassword: willSendPassword.value,
    facilities: selectedFacilities.value,
  };

  auth.register(this, credentials, () => {
    setTimeout(() => {
      router.push({ path: "/users" });
    }, 1500);
  });
}

function generatePassword() {
  const hashids = new Hashids(
    "AKJSBDalsdabskJASd",
    8,
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
  );
  user.value.password = hashids.encode(
    Math.floor(Math.random() * 100 + 1),
    Math.floor(Math.random() * 100 + 1),
    Math.floor(Math.random() * 100 + 1)
  );
}

function onANLicenseFileChange(e) {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    user.value.ANLicense = e.target.result;
  };
  reader.readAsDataURL(files[0]);
}

function onFMLicenseFileChange(e) {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    user.value.FMLicense = e.target.result;
  };
  reader.readAsDataURL(files[0]);
}

function loadFacilities() {
  axios
    .get(`${auth.apiUrl()}facilities/`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    })
    .then((response) => {
      if (response.data.length === 0) {
        errors.value = "Nenhum resultado encontrado";
        facilities.value = [];
      } else {
        facilities.value = response.data.list;
      }
    })
    .catch((err) => {
      errors.value = err.response?.data || "Erro ao carregar instalações";
      facilities.value = [];
    });
}

function addToSelectedFacilities(facilityId) {
  const facility = facilities.value.find(
    (facility) => facility._id === facilityId
  );
  if (!facility) return;

  if (!selectedFacilities.value.some((f) => f._id === facility._id)) {
    selectedFacilities.value.push(facility);
  }
}

function removeFromSelectedFacilities(facilityId) {
  const facilityIndex = selectedFacilities.value.findIndex(
    (facility) => facility._id === facilityId
  );
  if (facilityIndex === -1) return;

  selectedFacilities.value.splice(facilityIndex, 1);
}

// Load data on mount
onMounted(() => {
  loadFacilities();
});

// Watch for type changes to reset facilities selection if needed
watch(
  () => user.value.type,
  (newType) => {
    if (newType !== "cliente" && newType !== "cliente MN") {
      selectedFacilities.value = [];
    }
  }
);
</script>

<style scoped>
div.main {
  z-index: 0;
  padding-top: 82px;
  padding-left: 28px;
}

[data-letters-list]:before {
  content: attr(data-letters-list);
  display: inline-block;
  font-size: 1em;
  width: 3em;
  height: 3em;
  line-height: 3em;
  text-align: center;
  border-radius: 50%;
  background: #00a767;
  vertical-align: middle;
  margin-right: 1em;
  color: white;
}

#search-input-form {
  margin-left: 0px;
}

div.vgt-wrap__footer.vgt-clearfix {
  margin-left: 0;
  width: 100%;
}
</style>
