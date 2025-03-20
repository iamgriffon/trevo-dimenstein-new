<template>
  <Layout title="Editar instalação">
    <template #header>
      <button
        class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
      >
        <RouterLink
          :to="`/facility/${route.params.id}`"
          class="text-green-600 hover:text-green-700 transition-colors"
        >
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
            <FontAwesomeIcon icon="fa-solid fa-image" class="mr-2" /> Logo
          </label>
          <p class="text-sm text-gray-500 mb-2">escolha uma imagem quadrada</p>
          <input
            type="file"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            @change="onLogoFileChange"
          />
          <button
            class="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            @click="removeLogo"
          >
            remover logo
          </button>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-image" class="mr-2" /> Imagem de
            Fundo
          </label>
          <p class="text-sm text-gray-500 mb-2">escolha uma imagem quadrada</p>
          <input
            type="file"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            @change="onBackgroundFileChange"
          />
          <button
            class="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            @click="removeBackgroundImage"
          >
            remover imagem de fundo
          </button>
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
              <FontAwesomeIcon icon="fa-solid fa-building" class="mr-2" />
              Nome<span class="text-red-500">*</span>
            </label>
            <Input v-model="facility.name" placeholder="Nome" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-building" class="mr-2" />
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
            <span class="text-sm text-gray-500 ml-1"
              >formato: Logradouro, número - Bairro - Cidade - UF CEP</span
            >
          </label>
          <Input
            v-model="facility.address.street"
            placeholder="Endereço"
            class="w-full"
          />
        </div>
      </div>

      <!-- People Management Section -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h4 class="text-xl font-medium mb-4">
          <FontAwesomeIcon icon="fa-solid fa-users" class="mr-2" /> Pessoas
        </h4>

        <h5 class="text-lg font-medium mb-4">
          Selecione as pessoas responsáveis por essa instalação
          <span class="text-sm text-gray-500">opcional</span>
        </h5>

        <!-- Facility Titular -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Titular da Instalação:</label
          >
          <button
            v-if="facilityTitular"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"
          >
            <FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" />
            {{ facilityTitular }}
          </button>
          <button
            v-else
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
            @click="showTitularModal = true"
          >
            Selecionar pessoa
          </button>
        </div>

        <Modal
          title="Selecionar titular da instalação"
          v-model:visible="showTitularModal"
          class="min-w-full max-w-5xl p-4"
        >
          <div class="w-full mb-4">
            <Input v-model="filter" placeholder="buscar..." class="w-full">
              <FontAwesomeIcon icon="fa-solid fa-search" />
            </Input>
          </div>

          <div
            v-if="!filteredUsers.length"
            class="text-center py-6 bg-gray-50 rounded-md"
          >
            <h4 class="text-gray-500">
              <FontAwesomeIcon icon="fa-solid fa-square" />
            </h4>
          </div>

          <Table
            v-else
            :columns="columns"
            :data="filteredUsers"
            :total-items="filteredUsers.length"
            v-model:perPage="perPage"
            v-model:currentPage="currentPage"
            footerClass="hidden"
            @row-click="
              (row) => addToSelectedUsers(row._id, 'Titular da instalação')
            "
          />

          <template #footer>
            <div class="flex justify-end gap-2 mt-4">
              <button
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                @click="showTitularModal = false"
              >
                Cancelar
              </button>
              <button
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                @click="showTitularModal = false"
              >
                Confirmar
              </button>
            </div>
          </template>
        </Modal>

        <!-- Technical Responsible -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Responsável técnico:</label
          >
          <button
            v-if="tecnicalReponsible"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"
          >
            <FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" />
            {{ tecnicalReponsible }}
          </button>
          <button
            v-else
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
            @click="showTechnicalResponsibleModal = true"
          >
            Selecionar pessoa
          </button>
        </div>

        <Modal
          title="Selecionar responsável técnico"
          v-model:visible="showTechnicalResponsibleModal"
          class="w-full max-w-5xl p-4"
        >
          <div class="w-full mb-4">
            <Input v-model="filter" placeholder="buscar..." class="w-full">
              <FontAwesomeIcon icon="fa-solid fa-search" />
            </Input>
          </div>

          <div
            v-if="!filteredUsers.length"
            class="text-center py-6 bg-gray-50 rounded-md"
          >
            <h4 class="text-gray-500">
              <FontAwesomeIcon icon="fa-solid fa-square" />
            </h4>
          </div>

          <Table
            v-else
            :columns="columns"
            :data="users"
            :total-items="users.length"
            v-model:perPage="perPage"
            v-model:currentPage="currentPage"
            footerClass="hidden"
            @row-click="
              (row) => addToSelectedUsers(row._id, 'Responsável técnico')
            "
          />
        </Modal>

        <!-- Technical Responsible Substitute -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Substituto do responsável técnico:</label
          >
          <button
            v-if="tecnicalReponsibleSubs"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"
          >
            <FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" />
            {{ tecnicalReponsibleSubs }}
          </button>
          <button
            v-else
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
            @click="showTechnicalResponsibleSubsModal = true"
          >
            Selecionar pessoa
          </button>
        </div>

        <Modal
          title="Selecionar substituto do responsável técnico"
          v-model:visible="showTechnicalResponsibleSubsModal"
          class="w-full max-w-5xl p-4"
        >
          <div class="w-full mb-4">
            <Input v-model="filter" placeholder="buscar..." class="w-full">
              <FontAwesomeIcon icon="fa-solid fa-search" />
            </Input>
          </div>

          <div
            v-if="!filteredUsers.length"
            class="text-center py-6 bg-gray-50 rounded-md"
          >
            <h4 class="text-gray-500">
              <FontAwesomeIcon icon="fa-solid fa-square" />
            </h4>
          </div>

          <Table
            v-else
            :columns="columns"
            :data="users"
            :total-items="users.length"
            v-model:perPage="perPage"
            v-model:currentPage="currentPage"
            footerClass="hidden"
            @row-click="
              (row) =>
                addToSelectedUsers(row._id, 'Substituto do responsável técnico')
            "
          />
        </Modal>

        <!-- Radioprotection Supervisor -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Supervisor de radioproteção:</label
          >
          <button
            v-if="radioprotectionSupervisor"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"
          >
            <FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" />
            {{ radioprotectionSupervisor }}
          </button>
          <button
            v-else
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
            @click="showRadioprotectionSupervisorModal = true"
          >
            Selecionar pessoa
          </button>
        </div>

        <Modal
          title="Selecionar supervisor de radioproteção"
          v-model:visible="showRadioprotectionSupervisorModal"
          class="w-full max-w-5xl p-4 flex justify-start items-center py-10"
          style="height: fit-content"
        >
          <div class="w-full mb-4">
            <Input v-model="filter" placeholder="buscar..." class="w-full">
              <FontAwesomeIcon icon="fa-solid fa-search" />
            </Input>
          </div>

          <div
            v-if="!filteredUsers.length"
            class="text-center py-6 bg-gray-50 rounded-md"
          >
            <h4 class="text-gray-500">
              <FontAwesomeIcon icon="fa-solid fa-square" />
            </h4>
          </div>

          <Table
            v-else
            :columns="columns"
            :data="filteredUsers"
            :total-items="filteredUsers.length"
            v-model:perPage="perPage"
            v-model:currentPage="currentPage"
            footerClass="hidden"
            @row-click="
              (row) =>
                addToSelectedUsers(row._id, 'Supervisor de radioproteção')
            "
          />
        </Modal>

        <!-- Radioprotection Supervisor Substitute -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Substituto do supervisor de radioproteção:</label
          >
          <button
            v-if="radioprotectionSupervisorSub"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"
          >
            <FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" />
            {{ radioprotectionSupervisorSub }}
          </button>
          <button
            v-else
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
            @click="showRadioprotectionSupervisorSubModal = true"
          >
            Selecionar pessoa
          </button>
        </div>

        <Modal
          title="Selecionar substituto do supervisor de radioproteção"
          v-model:visible="showRadioprotectionSupervisorSubModal"
          class="w-full max-w-5xl p-4"
        >
          <div class="w-full mb-4">
            <Input v-model="filter" placeholder="buscar..." class="w-full">
              <FontAwesomeIcon icon="fa-solid fa-search" />
            </Input>
          </div>

          <div
            v-if="!filteredUsers.length"
            class="text-center py-6 bg-gray-50 rounded-md"
          >
            <h4 class="text-gray-500">
              <FontAwesomeIcon icon="fa-solid fa-square" />
            </h4>
          </div>

          <Table
            v-else
            :columns="columns"
            :data="users"
            :total-items="users.length"
            footerClass="hidden"
            v-model:perPage="perPage"
            v-model:currentPage="currentPage"
            @row-click="
              (row) =>
                addToSelectedUsers(
                  row._id,
                  'Substituto do supervisor de radioproteção'
                )
            "
          />
        </Modal>

        <!-- Other Users Section -->
        <h5 class="text-lg font-medium mt-8 mb-4">
          Selecione as outras pessoas que terão acesso a essa instalação
          <span class="text-sm text-gray-500 block"
            >opcional. Usuários rad dimenstein possuem acesso a todas as
            instalações por padrão.</span
          >
        </h5>

        <div class="w-full mb-4">
          <Input v-model="secondFilter" placeholder="buscar..." class="w-full">
            <FontAwesomeIcon icon="fa-solid fa-search" />
          </Input>
        </div>

        <div
          v-if="!secondFilteredUsers.length"
          class="text-center py-6 bg-gray-50 rounded-md mb-6"
        >
          <h4 class="text-gray-500">
            <FontAwesomeIcon icon="fa-solid fa-square" />
          </h4>
        </div>

        <Table
          v-else
          :columns="columns"
          :data="secondFilteredUsers"
          :total-items="secondFilteredUsers.length"
          v-model:perPage="perPage"
          v-model:currentPage="secondFilteredCurrentPage"
          @row-click="(row) => addToSelectedUsers(row._id)"
          class="mb-6"
          footerClass="z-[1200] w-[100vw] right-0"
        />

        <!-- Selected Users -->
        <h5 class="text-lg font-medium mt-8 mb-4">Pessoas selecionadas</h5>

        <div
          v-if="!facility.users.length"
          class="text-center py-6 bg-gray-50 rounded-md mb-6"
        >
          <p>Nenhuma pessoa selecionada...</p>
        </div>

        <Table
          v-else
          :columns="columnsWithResponsability"
          :data="facility.users"
          :total-items="facility.users.length"
          v-model:perPage="perPage"
          v-model:currentPage="selectedUsersCurrentPage"
          class="mb-6"
        />
      </div>

      <!-- Additional Facility Information -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            <FontAwesomeIcon icon="fa-solid fa-file" class="mr-2" /> Matrícula
            CNEN
            <span class="text-sm text-gray-500 ml-1">opcional</span>
          </label>
          <Input
            v-model="facility.CNENregistry"
            placeholder="00000"
            class="w-full"
          />
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-2">
            Práticas Autorizadas:
            <span class="text-sm text-gray-500">opcional</span>
          </h4>
          <div class="flex flex-wrap gap-6">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="facility.doInpatientTherapy"
                class="rounded text-green-600 focus:ring-green-500"
              />
              <span>Terapia com Internação</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="facility.doOutpatientTherapy"
                class="rounded text-green-600 focus:ring-green-500"
              />
              <span>Terapia Ambulatorial</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="facility.doDiagnosis"
                class="rounded text-green-600 focus:ring-green-500"
              />
              <span>Diagnóstico</span>
            </label>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-medium mb-2">
            Quantidade de radionuclídeos autorizados por semana:
            <span class="text-sm text-gray-500">opcional</span>
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="radioisotope in facility.radioisotopes"
              :key="radioisotope.name"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :checked="radioisotope.quantity > 0"
                @click="
                  radioisotope.quantity =
                    radioisotope.quantity == null ? 0 : null
                "
                class="mr-2 rounded text-green-600 focus:ring-green-500"
              />
              <span class="w-24">{{ radioisotope.name }}</span>
              <Input
                v-model="radioisotope.quantity"
                placeholder="00.00"
                class="mx-2 w-24"
              />
              <span>mCi</span>
            </div>
          </div>
        </div>
      </div>

      <button
        class="w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
        @click="edit"
      >
        Salvar alterações
      </button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "../../../services/authentication";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Table from "@/components/dashboard/Table.vue";
import Modal from "@/components/common/Modal.vue";
import { cn } from "@/utils/cn";

const route = useRoute();
const router = useRouter();

// Modal visibility states
const showTitularModal = ref(false);
const showTechnicalResponsibleModal = ref(false);
const showTechnicalResponsibleSubsModal = ref(false);
const showRadioprotectionSupervisorModal = ref(false);
const showRadioprotectionSupervisorSubModal = ref(false);

// Pagination
const perPage = ref(10);
const currentPage = ref(1);
const secondFilteredCurrentPage = ref(1);
const selectedUsersCurrentPage = ref(1);

// Form data
const filter = ref("");
const secondFilter = ref("");
const users = ref([]);
const error = ref("");
const errors = ref("");
const currentUser = ref(auth.currentUser());

// Role holders
const facilityTitular = ref("");
const tecnicalReponsible = ref("");
const tecnicalReponsibleSubs = ref("");
const radioprotectionSupervisor = ref("");
const radioprotectionSupervisorSub = ref("");
const groupOptions = ref([]);

// Main facility data
const facility = ref({
  name: "",
  companyName: "",
  cnpj: "",
  address: {},
  telephone: "",
  contactName: "",
  CNENregistry: "",
  professionCNEN: "",
  professionNumberCNEN: "",
  validityOfOperationAuthorization: "",
  logoImg: "",
  backgroundImg: "",
  doInpatientTherapy: false,
  doOutpatientTherapy: false,
  doDiagnosis: false,
  radioisotopes: [
    { name: "C(11)", quantity: null },
    { name: "Cr(51)", quantity: null },
    { name: "F(18)", quantity: null },
    { name: "Ga(67)", quantity: null },
    { name: "Ga(68)", quantity: null },
    { name: "I(123)", quantity: null },
    { name: "I(125)", quantity: null },
    { name: "I(131)", quantity: null },
    { name: "In(111)", quantity: null },
    { name: "Lu(177)", quantity: null },
    { name: "Ra(233)", quantity: null },
    { name: "Sm(153)", quantity: null },
    { name: "Tc(99m)", quantity: null },
    { name: "Tl(201)", quantity: null },
    { name: "Y(90)", quantity: null },
  ],
  usersId: [],
  users: [],
  group: "",
  department: "",
});

// Table columns
const columns = [
  {
    accessorKey: "action",
    header: "",
    cell: (info) => {
      return h(
        "button",
        {
          class:
            "px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700",
          onClick: () => addToSelectedUsers(info.row.original._id),
        },
        [h(FontAwesomeIcon, { icon: "fa-solid fa-plus", class: "w-4 h-4" })]
      );
    },
    meta: {
      headerClass: "w-16",
      cellClass: "w-16",
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    sortable: true,
    meta: {
      headerClass: "text-left px-4",
      cellClass: "text-left px-4",
    },
  },
  {
    accessorKey: "type",
    header: "Tipo de Usuário",
    sortable: true,
    meta: {
      headerClass: "text-left px-4",
      cellClass: "text-left px-4",
    },
  },
];

const columnsWithResponsability = [
  {
    accessorKey: "action",
    header: "",
    cell: (info) => {
      return h(
        "button",
        {
          class: "px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700",
          onClick: () => removeFromSelectedUsers(info.row.original._id),
        },
        [h(FontAwesomeIcon, { icon: "fa-solid fa-times", class: "w-4 h-4" })]
      );
    },
    meta: {
      headerClass: "w-16",
      cellClass: "w-16",
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    sortable: true,
    meta: {
      headerClass: "text-left px-4",
      cellClass: "text-left px-4",
    },
  },
  {
    accessorKey: "type",
    header: "Tipo de Usuário",
    sortable: true,
    meta: {
      headerClass: "text-left px-4",
      cellClass: "text-left px-4",
    },
  },
  {
    accessorKey: "responsability",
    header: "Responsabilidade",
    cell: (info) => {
      return info.row.original.responsabilities.join(", ");
    },
    meta: {
      headerClass: "text-left px-4",
      cellClass: "text-left px-4",
    },
  },
];

// Computed properties
const filteredUsers = computed(() => {
  if (!filter.value.length) {
    return users.value
  }

  const exp = new RegExp(filter.value.trim(), "i");
  return users.value
    .filter((user) => exp.test(user.name))
});

const secondFilteredUsers = computed(() => {
  const exp = new RegExp(secondFilter.value.trim(), "i");
  const filtered =
    secondFilter.value.length > 0
      ? users.value.filter((user) => exp.test(user.name))
      : users.value;

  return filtered
    .filter((user) => !facility.value.users.includes(user))
});

// Functions
const resetFilters = () => {
  filter.value = "";
  secondFilter.value = "";
};

const addToSelectedUsers = (userId, userResponsability) => {
  resetFilters();
  const user = users.value.find((user) => user._id === userId);

  if (!user) return;

  if (!facility.value.users.includes(user)) {
    facility.value.users.push(user);
    facility.value.usersId.push(user._id);
  }

  if (userResponsability) {
    selectResponsability(userId, userResponsability);
  }
};

const selectResponsability = (userId, userResponsability) => {
  const user = users.value.find((user) => user._id === userId);
  if (!user) return;

  user.responsabilities.push(userResponsability);
  resetFilters();

  if (userResponsability === "Titular da instalação") {
    facilityTitular.value = user.name;
    showTitularModal.value = false;
  } else if (userResponsability === "Responsável técnico") {
    tecnicalReponsible.value = user.name;
    showTechnicalResponsibleModal.value = false;
  } else if (userResponsability === "Substituto do responsável técnico") {
    tecnicalReponsibleSubs.value = user.name;
    showTechnicalResponsibleSubsModal.value = false;
  } else if (userResponsability === "Supervisor de radioproteção") {
    radioprotectionSupervisor.value = user.name;
    showRadioprotectionSupervisorModal.value = false;
  } else if (
    userResponsability === "Substituto do supervisor de radioproteção"
  ) {
    radioprotectionSupervisorSub.value = user.name;
    showRadioprotectionSupervisorSubModal.value = false;
  }
};

const removeFromSelectedUsers = (userId) => {
  resetFilters();
  const user = facility.value.users.find((user) => user._id === userId);
  if (!user) return;

  const index = facility.value.users.indexOf(user);
  if (index !== -1) {
    facility.value.users.splice(index, 1);

    const idIndex = facility.value.usersId.indexOf(user._id);
    if (idIndex !== -1) {
      facility.value.usersId.splice(idIndex, 1);
    }

    user.responsabilities = [];

    if (user.name === facilityTitular.value) {
      facilityTitular.value = "";
    }
    if (user.name === tecnicalReponsible.value) {
      tecnicalReponsible.value = "";
    }
    if (user.name === tecnicalReponsibleSubs.value) {
      tecnicalReponsibleSubs.value = "";
    }
    if (user.name === radioprotectionSupervisor.value) {
      radioprotectionSupervisor.value = "";
    }
    if (user.name === radioprotectionSupervisorSub.value) {
      radioprotectionSupervisorSub.value = "";
    }
  }

  if (!users.value.includes(user)) {
    users.value.push(user);
  }
};

const removeLogo = () => {
  if (!confirm("Tem certeza que deseja remover a logo?")) return;

  auth.removeFacilityLogo(null, facility.value._id, () => {
    setTimeout(() => {
      alert("Logo removida com sucesso!");
    }, 1000);
  });
};

const removeBackgroundImage = () => {
  if (!confirm("Tem certeza que deseja remover a imagem de fundo?")) return;

  auth.removeFacilityBackgroundImage(null, facility.value._id, () => {
    setTimeout(() => {
      alert("Imagem de fundo removida com sucesso!");
    }, 1000);
  });
};

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

const edit = () => {
  const credentials = {
    _id: facility.value._id,
    name: facility.value.name,
    companyName: facility.value.companyName,
    cnpj: facility.value.cnpj,
    telephone: facility.value.telephone,
    contactName: facility.value.contactName,
    address: facility.value.address,

    CNENregistry: facility.value.CNENregistry,
    professionCNEN: facility.value.professionCNEN,
    professionNumberCNEN: facility.value.professionNumberCNEN,
    validityOfOperationAuthorization:
      facility.value.validityOfOperationAuthorization,
    doInpatientTherapy: facility.value.doInpatientTherapy,
    doOutpatientTherapy: facility.value.doOutpatientTherapy,
    doDiagnosis: facility.value.doDiagnosis,
    radioisotopes: facility.value.radioisotopes,

    department: facility.value.department.name,
    group: facility.value.group.name,

    backgroundImg: facility.value.backgroundImg,
    logoImg: facility.value.logoImg,

    users: facility.value.users,
  };

  auth.editFacility(null, credentials, "/facility");
};

// Load facility data
onMounted(async () => {
  try {
    const response = await axios.get(
      `${auth.apiUrl()}facility/${route.params.id}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );

    if (!response.data) {
      errors.value = "Nenhum resultado encontrado";
      return;
    }

    const data = response.data;

    // Set basic facility info
    facility.value._id = data._id;
    facility.value.name = data.name;
    facility.value.companyName = data.companyName;
    facility.value.cnpj = data.cnpj;
    facility.value.telephone = data.telephone;
    facility.value.contactName = data.contactName;
    facility.value.address = data.address[0];

    // Set CNEN and operational info
    facility.value.CNENregistry = data.CNENregistry;
    facility.value.professionCNEN = data.professionCNEN;
    facility.value.professionNumberCNEN = data.professionNumberCNEN;
    facility.value.validityOfOperationAuthorization =
      data.validityOfOperationAuthorization;
    facility.value.doInpatientTherapy = data.doInpatientTherapy;
    facility.value.doOutpatientTherapy = data.doOutpatientTherapy;
    facility.value.doDiagnosis = data.doDiagnosis;
    facility.value.radioisotopes = data.radioisotopes;

    // Set group and department
    if (data.group) {
      facility.value.group = {
        name: { name: data.group.name, _id: data.group._id },
        label: data.group.name,
      };
    }

    facility.value.department = data.department || "both";

    // Set facility users and their roles
    const facilityUsers = data.users;

    for (const user of data.users) {
      if (user.responsabilities.includes("Titular da instalação")) {
        facilityTitular.value = user.name;
      }
      if (user.responsabilities.includes("Responsável técnico")) {
        tecnicalReponsible.value = user.name;
      }
      if (user.responsabilities.includes("Substituto do responsável técnico")) {
        tecnicalReponsibleSubs.value = user.name;
      }
      if (user.responsabilities.includes("Supervisor de radioproteção")) {
        radioprotectionSupervisor.value = user.name;
      }
      if (
        user.responsabilities.includes(
          "Substituto do supervisor de radioproteção"
        )
      ) {
        radioprotectionSupervisorSub.value = user.name;
      }
    }

    // Load all users
    const userResponse = await axios.get(`${auth.apiUrl()}users/`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });

    if (!userResponse.data.length) {
      errors.value = "Nenhum resultado encontrado";
      return;
    }

    // Process users and set users that are not already in the facility
    const userData = userResponse.data;

    for (const apiUser of userData) {
      const isInFacility = facilityUsers.some(
        (facUser) => facUser._id === apiUser._id
      );

      if (!isInFacility) {
        users.value.push({
          _id: apiUser._id,
          name: apiUser.name,
          type: apiUser.type,
          responsabilities: [],
          ANLicenseNumber: apiUser.ANLicenseNumber,
          FMLicenseNumber: apiUser.FMLicenseNumber,
        });
      }
    }

    // Update facility users with additional info
    for (const facUser of facilityUsers) {
      const matchedUser = userData.find(
        (apiUser) => apiUser._id === facUser._id
      );
      if (matchedUser) {
        facUser.type = matchedUser.type;
      }
    }

    facility.value.users = facilityUsers.sort();

    // Load groups
    const groupResponse = await axios.get(`${auth.apiUrl()}group`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });

    if (!groupResponse.data.length) {
      errors.value = "Nenhum resultado encontrado";
      return;
    }

    for (const group of groupResponse.data) {
      groupOptions.value.push({
        name: { name: group.name, _id: group._id },
        label: group.name,
      });
    }

    groupOptions.value.sort((a, b) => {
      if (a.label > b.label) return 1;
      if (a.label < b.label) return -1;
      return 0;
    });
  } catch (error) {
    errors.value = error.response?.data || "Erro ao carregar dados";
  }
});
</script>
