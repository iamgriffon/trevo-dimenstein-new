<template>
  <Layout title="Criar Nova Instalação">
    <template #breadcrumb>
      <router-link :to="'/facility'" class="mx-2 text-teal-800">
        <FontAwesomeIcon icon="fa-solid fa-building" class="text-teal-800" />
        <span class="ml-1">adicionar instalação</span>
      </router-link>
    </template>

    <div class="flex flex-col gap-6 w-full">
      <section class="bg-white p-6 rounded-lg shadow">
        <div class="mb-4">
          <h4 class="font-medium mb-2">
            <span class="text-red-500">*</span>Departamento:
          </h4>
          <select
            v-model="facility.department"
            class="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="both">Ambos</option>
            <option value="nuclearmedicine">Medicina Nuclear</option>
            <option value="radiodiagnosis">Radiodiagnóstico</option>
          </select>
        </div>
      </section>

      <section class="bg-white p-6 rounded-lg shadow">
        <div class="mb-4">
          <h4 class="font-medium mb-2">Grupo:</h4>
          <select
            v-model="facility.group"
            class="w-full p-2 border border-gray-300 rounded-md"
          >
            <option
              v-for="option in groupOptions"
              :key="option.name._id"
              :value="option.name"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </section>

      <section class="bg-white p-6 rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2" for="logoFile">
              <FontAwesomeIcon icon="fa-solid fa-image" /> Logo
              <small class="text-gray-500 block"
                >escolha uma imagem quadrada</small
              >
            </label>
            <input
              type="file"
              id="logoFile"
              class="w-full p-2 border border-gray-300 rounded-md"
              @change="onLogoFileChange"
            />
          </div>
          <div>
            <label class="block mb-2" for="backgroundFile">
              <FontAwesomeIcon icon="fa-solid fa-image" /> Imagem de Fundo
              <small class="text-gray-500 block"
                >escolha uma imagem quadrada</small
              >
            </label>
            <input
              type="file"
              id="backgroundFile"
              class="w-full p-2 border border-gray-300 rounded-md"
              @change="onBackgroundFileChange"
            />
          </div>
        </div>
      </section>

      <section class="bg-white p-6 rounded-lg shadow">
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4"
        >
          <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" /> {{ errors }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block mb-2" for="facilityName">
              <FontAwesomeIcon icon="fa-solid fa-building" /> Nome<span
                class="text-red-500"
                >*</span
              >
            </label>
            <input
              type="text"
              id="facilityName"
              class="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nome"
              v-model="facility.name"
            />
          </div>
          <div>
            <label class="block mb-2" for="companyName">
              <FontAwesomeIcon icon="fa-solid fa-building" /> Razão Social<span
                class="text-red-500"
                >*</span
              >
            </label>
            <input
              type="text"
              id="companyName"
              class="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Razão Social"
              v-model="facility.companyName"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block mb-2" for="cnpj">
              <FontAwesomeIcon icon="fa-solid fa-list-alt" /> CNPJ
            </label>
            <input
              type="text"
              id="cnpj"
              class="w-full p-2 border border-gray-300 rounded-md"
              placeholder="00.000.000/0000-00"
              v-model="facility.cnpj"
            />
          </div>
          <div>
            <label class="block mb-2" for="telephone">
              <FontAwesomeIcon icon="fa-solid fa-phone" /> Telefone
            </label>
            <input
              type="text"
              id="telephone"
              class="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Telefone"
              v-model="facility.telephone"
            />
          </div>
          <div>
            <label class="block mb-2" for="contactName">
              <FontAwesomeIcon icon="fa-solid fa-user" /> Contato
            </label>
            <input
              type="text"
              id="contactName"
              class="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Contato"
              v-model="facility.contactName"
            />
          </div>
        </div>

        <div class="mt-4">
          <label class="block mb-2" for="address">
            <FontAwesomeIcon icon="fa-solid fa-map-marker" /> Endereço<span
              class="text-red-500"
              >*</span
            >
            <small class="text-gray-500 block"
              >formato: Logradouro, número - Bairro - Cidade - UF CEP</small
            >
          </label>
          <input
            type="text"
            id="address"
            class="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Endereço"
            v-model="facility.address.street"
          />
        </div>
      </section>

      <section class="bg-white p-6 rounded-lg shadow">
        <h4 class="text-xl font-medium mb-4">
          <FontAwesomeIcon icon="fa-solid fa-users" /> Pessoas
        </h4>

        <h5 class="text-lg font-medium mb-4">
          Selecione as pessoas responsáveis por essa instalação
          <small class="text-gray-500">opcional</small>
        </h5>

        <div class="flex flex-col gap-4 mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <label class="block mb-2 sm:mb-0 sm:min-w-[180px]"
              >Titular da Instalação:</label
            >
            <button
              v-if="facilityTitular"
              class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"
            >
              <FontAwesomeIcon icon="fa-solid fa-user" /> {{ facilityTitular }}
            </button>
            <button
              v-else
              class="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
              @click="openModal('chooseTitular')"
            >
              Selecionar pessoa
            </button>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <label class="block mb-2 sm:mb-0 sm:min-w-[180px]"
              >Responsável técnico:</label
            >
            <button
              v-if="tecnicalReponsible"
              class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"
            >
              <FontAwesomeIcon icon="fa-solid fa-user" />
              {{ tecnicalReponsible }}
            </button>
            <button
              v-else
              class="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
              @click="openModal('chooseTecnicalReponsible')"
            >
              Selecionar pessoa
            </button>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <label class="block mb-2 sm:mb-0 sm:min-w-[180px]"
              >Substituto do responsável técnico:</label
            >
            <button
              v-if="tecnicalReponsibleSubs"
              class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"
            >
              <FontAwesomeIcon icon="fa-solid fa-user" />
              {{ tecnicalReponsibleSubs }}
            </button>
            <button
              v-else
              class="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
              @click="openModal('chooseTecnicalReponsibleSubs')"
            >
              Selecionar pessoa
            </button>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <label class="block mb-2 sm:mb-0 sm:min-w-[180px]"
              >Supervisor de radioproteção:</label
            >
            <button
              v-if="radioprotectionSupervisor"
              class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"
            >
              <FontAwesomeIcon icon="fa-solid fa-user" />
              {{ radioprotectionSupervisor }}
            </button>
            <button
              v-else
              class="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
              @click="openModal('chooseRadioprotectionSupervisor')"
            >
              Selecionar pessoa
            </button>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <label class="block mb-2 sm:mb-0 sm:min-w-[180px]"
              >Substituto do supervisor de radioproteção:</label
            >
            <button
              v-if="radioprotectionSupervisorSub"
              class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              title="Para alterar o usuário, remova-o da lista de pessoas selecionadas abaixo"
            >
              <FontAwesomeIcon icon="fa-solid fa-user" />
              {{ radioprotectionSupervisorSub }}
            </button>
            <button
              v-else
              class="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
              @click="openModal('chooseRadioprotectionSupervisorSubs')"
            >
              Selecionar pessoa
            </button>
          </div>
        </div>

        <h5 class="text-lg font-medium mb-4">
          Selecione as outras pessoas que terão acesso a essa instalação
          <small class="text-gray-500 block">
            É opcional. Usuários do tipo <em>'rad dimenstein'</em> possuem
            acesso a todas as instalações por padrão.
          </small>
        </h5>

        <div class="mb-4">
          <Input
            v-model="secondFilter"
            placeholder="Buscar..."
            class="w-full px-3 border mb-4 rounded-md border-gray-300"
          >
            <FontAwesomeIcon icon="fa-solid fa-search" />
          </Input>
        </div>

        <div
          v-if="!secondFilteredUsers.length"
          class="bg-white p-6 rounded-lg text-center"
        >
          <h4 class="text-lg font-medium">Nenhum resultado</h4>
        </div>

        <div v-else class="mb-8">
          <Table
            :columns="mainTableColumns"
            :data="filteredUsers"
            :totalItems="filteredUsers.length"
            v-model:currentPage="currentPage"
            v-model:perPage="perPage"
            footer-class="relative border-none w-full justify-center z-auto"
          />
        </div>

        <h5 class="text-lg font-medium mb-4">Pessoas selecionadas</h5>

        <div v-if="!facility.users.length" class="bg-white p-6 rounded-lg mb-4">
          Nenhuma pessoa selecionada...
        </div>

        <div v-else class="mb-8">
          <Table
            :columns="columnsWithResponsability"
            :data="facility.users"
            :totalItems="facility.users.length"
            v-model:currentPage="currentPage"
            v-model:perPage="perPage"
            footer-class="relative border-none w-full justify-center z-auto"
          />
        </div>
      </section>

      <section class="bg-white p-6 rounded-lg shadow">
        <div class="mb-4">
          <label class="block mb-2" for="CNENregistry">
            <FontAwesomeIcon icon="fa-solid fa-file" /> Matrícula CNEN
            <small class="text-gray-500 block">opcional</small>
          </label>
          <input
            type="text"
            id="CNENregistry"
            class="w-full p-2 border border-gray-300 rounded-md"
            placeholder="00000"
            v-model="facility.CNENregistry"
          />
        </div>

        <div class="mb-6">
          <h4 class="font-medium mb-2">
            Práticas Autorizadas: <small class="text-gray-500">opcional</small>
          </h4>
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                class="w-5 h-5"
                v-model="facility.doInpatientTherapy"
              />
              Terapia com Internação
            </label>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                class="w-5 h-5"
                v-model="facility.doOutpatientTherapy"
              />
              Terapia Ambulatorial
            </label>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                class="w-5 h-5"
                v-model="facility.doDiagnosis"
              />
              Diagnóstico
            </label>
          </div>
        </div>

        <div>
          <h4 class="font-medium mb-4">
            Quantidade de radionuclídeos autorizados por semana:
            <small class="text-gray-500">opcional</small>
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="radioisotope in facility.radioisotopes"
              :key="radioisotope.name"
              class="flex items-center gap-2"
            >
              <input
                type="checkbox"
                class="w-5 h-5"
                :checked="radioisotope.quantity > 0"
                @click="
                  radioisotope.quantity =
                    radioisotope.quantity == null ? 0 : null
                "
              />
              <span class="min-w-[60px]">{{ radioisotope.name }}</span>
              <input
                type="text"
                class="w-20 p-2 border border-gray-300 rounded-md"
                placeholder="00.00"
                v-model="radioisotope.quantity"
              />
              <span>mCi</span>
            </div>
          </div>
        </div>
      </section>

      <button
        class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mb-8"
        @click="register()"
      >
        Criar instalação
      </button>
    </div>

    <!-- Modals for selecting users -->
    <Modal
      v-model:visible="modals.chooseTitular"
      title="Selecionar titular da instalação"
      :class="'justify-between p-8'"
    >
      <div class="flex flex-col gap-4">
        <Input
          v-model="filter"
          placeholder="Buscar..."
          class="w-full px-3 border mb-4 rounded-md border-gray-300"
        >
          <FontAwesomeIcon icon="fa-solid fa-search" />
        </Input>

        <div
          v-if="!filteredUsers.length"
          class="bg-white p-6 rounded-lg text-center"
        >
          <h4 class="text-lg font-medium">Nenhum resultado</h4>
        </div>

        <Table
          v-else
          :columns="facilityTitularModalColumns"
          :data="filteredUsers"
          :totalItems="filteredUsers.length"
          v-model:currentPage="currentPage"
          v-model:perPage="modalPerPage"
          footer-class="relative border-none w-full justify-center z-auto"
        />

        <div class="flex justify-end gap-4 mt-4">
          <button
            class="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            @click="modals.chooseTitular = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            @click="modals.chooseTitular = false"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>

    <!-- Similar modals for other roles -->
    <Modal
      v-model:visible="modals.chooseTecnicalReponsible"
      title="Selecionar responsável técnico"
      :class="'justify-between p-8'"
    >
      <div class="flex flex-col gap-4">
        <Input
          v-model="filter"
          placeholder="Buscar..."
          class="w-full px-3 border mb-4 rounded-md border-gray-300"
        >
          <FontAwesomeIcon icon="fa-solid fa-search" />
        </Input>

        <div
          v-if="!filteredUsers.length"
          class="bg-white p-6 rounded-lg text-center"
        >
          <h4 class="text-lg font-medium">Nenhum resultado</h4>
        </div>

        <Table
          v-else
          :columns="tecnicalReponsibleModalColumns"
          :data="filteredUsers"
          :totalItems="filteredUsers.length"
          v-model:currentPage="currentPage"
          v-model:perPage="modalPerPage"
          footer-class="relative border-none w-full justify-center z-auto"
        />

        <div class="flex justify-end gap-4 mt-4">
          <button
            class="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            @click="modals.chooseTecnicalReponsible = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            @click="modals.chooseTecnicalReponsible = false"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>

    <!-- Modal for chooseTecnicalReponsibleSubs -->
    <Modal
      v-model:visible="modals.chooseTecnicalReponsibleSubs"
      title="Selecionar substituto do responsável técnico"
      :class="'justify-between p-8'"
    >
      <div class="flex flex-col gap-4">
        <Input
          v-model="filter"
          placeholder="Buscar..."
          class="w-full px-3 border mb-4 rounded-md border-gray-300"
        >
          <FontAwesomeIcon icon="fa-solid fa-search" />
        </Input>

        <div
          v-if="!filteredUsers.length"
          class="bg-white p-6 rounded-lg text-center"
        >
          <h4 class="text-lg font-medium">Nenhum resultado</h4>
        </div>

        <Table
          v-else
          :columns="tecnicalReponsibleSubsModalColumns"
          :data="filteredUsers"
          :totalItems="filteredUsers.length"
          v-model:currentPage="currentPage"
          v-model:perPage="modalPerPage"
          footer-class="relative border-none w-full justify-center z-auto"
        />

        <div class="flex justify-end gap-4 mt-4">
          <button
            class="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            @click="modals.chooseTecnicalReponsibleSubs = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            @click="modals.chooseTecnicalReponsibleSubs = false"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>

    <!-- Modal for chooseRadioprotectionSupervisor -->
    <Modal
      v-model:visible="modals.chooseRadioprotectionSupervisor"
      title="Selecionar supervisor de radioproteção"
      :class="'justify-between p-8'"
    >
      <div class="flex flex-col gap-4">
        <Input
          v-model="filter"
          placeholder="Buscar..."
          class="w-full px-3 border mb-4 rounded-md border-gray-300"
        >
          <FontAwesomeIcon icon="fa-solid fa-search" />
        </Input>

        <div
          v-if="!filteredUsers.length"
          class="bg-white p-6 rounded-lg text-center"
        >
          <h4 class="text-lg font-medium">Nenhum resultado</h4>
        </div>

        <Table
          v-else
          :columns="radioprotectionSupervisorModalColumns"
          :data="filteredUsers"
          :totalItems="filteredUsers.length"
          v-model:currentPage="currentPage"
          v-model:perPage="modalPerPage"
          footer-class="relative border-none w-full justify-center z-auto"
        />

        <div class="flex justify-end gap-4 mt-4">
          <button
            class="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            @click="modals.chooseRadioprotectionSupervisor = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            @click="modals.chooseRadioprotectionSupervisor = false"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>

    <!-- Modal for chooseRadioprotectionSupervisorSubs -->
    <Modal
      v-model:visible="modals.chooseRadioprotectionSupervisorSubs"
      title="Selecionar substituto do supervisor de radioproteção"
      :class="'justify-between p-8'"
    >
      <div class="flex flex-col gap-4 max-h-[75%] overflow-y-auto">
        <Input
          v-model="filter"
          placeholder="Buscar..."
          class="w-full px-3 border mb-4 rounded-md border-gray-300"
        >
          <FontAwesomeIcon icon="fa-solid fa-search" />
        </Input>

        <div
          v-if="!filteredUsers.length"
          class="bg-white p-6 rounded-lg text-center"
        >
          <h4 class="text-lg font-medium">Nenhum resultado</h4>
        </div>

        <section v-else class="h-[75%] overflow-y-auto">
          <Table
            :columns="radioprotectionSupervisorSubsModalColumns"
            :data="filteredUsers"
            :totalItems="filteredUsers.length"
            v-model:currentPage="currentPage"
            v-model:perPage="modalPerPage"
            footer-class="relative border-none w-full justify-center z-auto"
          />
        </section>

        <div class="flex justify-end gap-4 mt-4">
          <button
            class="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            @click="modals.chooseRadioprotectionSupervisorSubs = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            @click="modals.chooseRadioprotectionSupervisorSubs = false"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Modal from "@/components/common/Modal.vue";
import Table from "@/components/dashboard/Table.vue";
import { createActionButtonsCell } from "@/utils/tableCells";
// State variables
const filter = ref("");
const secondFilter = ref("");
const users = ref([]);
const error = ref("");
const errors = ref("");
const currentPage = ref(1);
const perPage = ref(10);
const modalPerPage = ref(5);
const modals = ref({
  chooseTitular: false,
  chooseTecnicalReponsible: false,
  chooseTecnicalReponsibleSubs: false,
  chooseRadioprotectionSupervisor: false,
  chooseRadioprotectionSupervisorSubs: false,
});

// Person role state
const facilityTitular = ref("");
const tecnicalReponsible = ref("");
const tecnicalReponsibleSubs = ref("");
const radioprotectionSupervisor = ref("");
const radioprotectionSupervisorSub = ref("");

// Facility data
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
  department: "",
  group: "",
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
});

const groupOptions = ref([]);

const addButton = (data, userResponsability) => [
  {
    type: "button",
    icon: "fa-solid fa-plus",
    props: {
      class:
        "bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white p-2 w-10 h-10 rounded-full",
      onClick: () => addToSelectedUsers(data, userResponsability),
    },
    text: "Adicionar",
  },
];

const actionButtonColumn = (userResponsability) => {
  return [
    {
      accessorKey: "action",
      header: "",
      cell: (info) => {
        console.log(info.row?.original?._id);
        return createActionButtonsCell(
          info,
          addButton(info.row?.original?._id, userResponsability)
        );
      },
      meta: {
        cellClass: "m-0",
        headerClass: "m-0",
      },
    },
  ];
};

// Table columns
const columns = (userResponsability) => [
  {
    accessorKey: "action",
    header: "",
    cell: (info) => {
      return createActionButtonsCell(info, addButton(userResponsability));
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "type",
    header: "Tipo de Usuário",
  },
];

const columnsWithResponsability = [
  {
    accessorKey: "action",
    header: "",
    cell: (info) => {
      const actionButtons = [
        {
          type: "button",
          icon: "fa-solid fa-times",
          text: "Remover",
          props: {
            class: "bg-red-600 text-white p-2 rounded-lg",
            onClick: () => removeFromSelectedUsers(info.row.original._id),
          },
        },
      ];
      return createActionButtonsCell(
        info,
        actionButtons,
        "flex items-center justify-end"
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "type",
    header: "Tipo de Usuário",
  },
  {
    accessorKey: "responsability",
    header: "Responsabilidade",
    cell: (info) => info.row.original.responsability || "Nenhuma",
  },
];

const modalColumns = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "type",
    header: "Tipo de Usuário",
  },
];

const facilityTitularModalColumns = [
  ...modalColumns,
  ...actionButtonColumn("Titular da instalação"),
];

const tecnicalReponsibleModalColumns = [
  ...modalColumns,
  ...actionButtonColumn("Responsável técnico"),
];

const tecnicalReponsibleSubsModalColumns = [
  ...modalColumns,
  ...actionButtonColumn("Substituto do responsável técnico"),
];

const radioprotectionSupervisorModalColumns = [
  ...modalColumns,
  ...actionButtonColumn("Supervisor de radioproteção"),
];

const radioprotectionSupervisorSubsModalColumns = [
  ...modalColumns,
  ...actionButtonColumn("Substituto do supervisor de radioproteção"),
];

const mainTableColumns = [...modalColumns, ...actionButtonColumn("")];

const secondFilteredUsers = computed(() => {
  if (secondFilter.value.length > 0) {
    const exp = new RegExp(secondFilter.value.trim(), "i");
    let filtered = users.value.filter((user) => exp.test(user.name));
    return filtered
      .filter((user) => !facility.value.users.some((u) => u._id === user._id))
    
  }
  return users.value
    .filter((user) => !facility.value.users.some((u) => u._id === user._id))
});

const filteredUsers = computed(() => {
  if (filter.value.length > 0) {
    const exp = new RegExp(filter.value.trim(), "i");
    return users.value
      .filter((user) => exp.test(user.name))
      .filter((user) => !facility.value.users.some((u) => u._id === user._id))
    
  }
  return users.value
    .filter((user) => !facility.value.users.some((u) => u._id === user._id))
});

// Methods
function openModal(modalType) {
  modals.value[modalType] = true;
}

function resetFilters() {
  filter.value = "";
  secondFilter.value = "";
}

function addToSelectedUsers(userId, userResponsability) {
  resetFilters();
  const user = users.value.find((user) => user._id === userId);
  if (!user) return;

  if (!facility.value.users.some((u) => u._id === user._id)) {
    facility.value.users.push({
      _id: user._id,
      name: user.name,
      type: user.type,
      responsability: userResponsability,
    });
    facility.value.usersId.push(user._id);
  }
}

function removeFromSelectedUsers(userId) {
  resetFilters();
  const userIndex = facility.value.users.findIndex(
    (user) => user._id === userId
  );
  if (userIndex === -1) return;

  const user = facility.value.users[userIndex];
  facility.value.users.splice(userIndex, 1);

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

function onLogoFileChange(e) {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

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
  reader.readAsDataURL(files[0]);
}

function onBackgroundFileChange(e) {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

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
  reader.readAsDataURL(files[0]);
}

function register() {
  const credentials = {
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
    department: facility.value.department?.name || facility.value.department,
    group: facility.value.group?.name?._id || facility.value.group,
    backgroundImg: facility.value.backgroundImg,
    logoImg: facility.value.logoImg,
    users: facility.value.users,
  };

  auth.registerFacility(this, credentials, "/facility");
}

// Load data on mount
onMounted(async () => {
  try {
    // Load users
    const usersResponse = await axios.get(`${auth.apiUrl()}users/`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });

    if (usersResponse.data.length > 0) {
      users.value = usersResponse.data.map((user) => ({
        _id: user._id,
        name: user.name,
        type: user.type,
        responsabilities: [],
        ANLicenseNumber: user.ANLicenseNumber,
        FMLicenseNumber: user.FMLicenseNumber,
      }));
    }

    // Load groups
    const groupsResponse = await axios.get(`${auth.apiUrl()}group`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });

    if (groupsResponse.data.length > 0) {
      groupOptions.value = groupsResponse.data
        .map((group) => ({
          name: { name: group.name, _id: group._id },
          label: group.name,
        }))
        .sort((a, b) => {
          if (a.label > b.label) return 1;
          if (a.label < b.label) return -1;
          return 0;
        });
    }
  } catch (error) {
    errors.value = error.response?.data || "Erro ao carregar dados";
  }
});
</script>
