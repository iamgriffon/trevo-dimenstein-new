<template>
  <Layout title="Editar Instalações do Usuário">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/user/${user._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
        active-class="border-none bg-transparent"
      >
        {{ user.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800">Editar Instalações</span>
    </template>

    <template #header>
      <router-link
        :to="`/user/${user._id}`"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
      </router-link>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else>
      <div
        v-if="error"
        class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
        role="alert"
      >
        <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" class="mr-2" />
        {{ errors }}
      </div>

      <div class="bg-white rounded-lg shadow px-6 mb-6">
        <div class="my-4 flex items-center gap-4">
          <h4 class="text-lg font-semibold text-gray-700">
            Instalações disponíveis:
          </h4>
          <Input
            v-model="filter"
            type="text"
            placeholder="Buscar instalações..."
            class="pl-10 w-full h-10 md:w-72 rounded-xl"
          >
            <FontAwesomeIcon icon="fa-solid fa-search" class="text-green-600" />
          </Input>
        </div>

        <Table
          v-if="!!filteredFacilities.length"
          :columns="selectedFacilitiesColumns"
          :data="filteredFacilities"
          :totalItems="filteredFacilities.length"
          v-model:currentPage="currentPage"
          v-model:perPage="perPage"
          :footer-class="'relative w-full justify-center border-none'"
        />
        <div v-else class="flex justify-center py-8">
          <p class="text-gray-500">Nenhuma instalação encontrada</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h4 class="text-lg font-semibold text-gray-700 my-4">
          Instalações selecionadas
        </h4>
        <Table
          :columns="userFacilitiesColumns"
          :data="userFacilities"
          :totalItems="userFacilities.length"
          v-model:currentPage="currentUserFacilitiesPage"
          v-model:perPage="currentUserFacilitiesPerPage"
          :footer-class="'relative w-full justify-center border-none'"
        />
      </div>

      <div
        class="bg-white rounded-lg shadow p-6"
        v-if="!!changedFacilities.length"
      >
        <h4 class="text-lg font-semibold text-gray-700 mb-4">
          Instalações a adicionar/remover
        </h4>
        <Table
          :columns="changedFacilitiesColumns"
          :data="changedFacilities"
          :totalItems="changedFacilities.length"
          v-model:currentPage="currentChangedFacilitiesPage"
          v-model:perPage="currentChangedFacilitiesPerPage"
          :footer-class="'relative w-full justify-center border-none'"
        />
        <div class="mt-6">
          <button
            class="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            @click="edit"
          >
            <FontAwesomeIcon icon="fa-solid fa-save" class="mr-2" /> Salvar
            alterações
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Table from "@/components/dashboard/Table.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import axios from "axios";
import { createActionButtonsCell, createTextCell } from "@/utils/tableCells";
import { twMerge } from "tailwind-merge";
import { cn } from "@/utils/cn";
import { h } from "vue";

const route = useRoute();
const router = useRouter();
const currentUser = ref(auth.currentUser());

const filter = ref("");
const user = ref({ name: "" });
const facilities = ref([]);
const userFacilities = ref([]);
const changedFacilities = ref([]);
const loading = ref(true);
const error = ref(false);
const errors = ref("");
const currentPage = ref(1);
const perPage = ref(10);
const currentUserFacilitiesPage = ref(1);
const currentUserFacilitiesPerPage = ref(10);
const currentChangedFacilitiesPage = ref(1);
const currentChangedFacilitiesPerPage = ref(10);

const tableButtonStyle =
  "rounded-full w-10 h-10 bg-red-200 text-red-600 flex items-center justify-center hover:bg-red-300 transition-colors";

const selectedFacilitiesColumns = [
  {
    accessorKey: "action",
    header: "Ação",
    cell: (info) => {
      const actionButtons = [
        {
          type: "button",
          icon: "fa-solid fa-plus",
          props: {
            class: twMerge(
              tableButtonStyle,
              "bg-green-600 hover:bg-green-700 text-white"
            ),
            title: "Adicionar",
            onClick: () => {
              addToSelectedFacilities(info.row.original._id);
            },
          },
        },
      ];
      return createActionButtonsCell(info, actionButtons);
    },
    meta: {
      headerClass: "w-24",
      cellClass: "w-24",
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
    accessorKey: "companyName",
    header: "Empresa",
    sortable: true,
    meta: {
      headerClass: "text-left px-4",
      cellClass: "text-left px-4 truncate",
    },
  },
];
const userFacilitiesColumns = [
  {
    accessorKey: "action",
    header: "Ação",
    cell: (info) => {
      const actionButtons = [
        {
          type: "button",
          icon: "fa-solid fa-times-circle",
          props: {
            class: twMerge(tableButtonStyle),
            title: "Corrigir",
            onClick: () => removeFromSelectedFacilities(info.row.original._id),
          },
        },
      ];
      return createActionButtonsCell(info, actionButtons);
    },
    meta: {
      headerClass: "w-24",
      cellClass: "w-24",
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
    accessorKey: "companyName",
    header: "Empresa",
    sortable: true,
    meta: {
      headerClass: "text-left px-4",
      cellClass: "text-left px-4",
    },
  },
];

const changedFacilitiesColumns = [
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      headerClass: "text-left px-4",
      cellClass: "text-left px-4 truncate",
    },
    cell: (info) => {
      return h(
        "span",
        {
          class: cn("text-left text-white rounded-full px-4 truncate", {
            "bg-green-600": info.row.original.status === "added",
            "bg-red-600": info.row.original.status === "removed",
          }),
        },
        facilityStatusMap[info.row.original.status]
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    meta: {
      headerClass: "text-left px-4",
      cellClass: "text-left px-4 truncate",
    },
  },
  {
    accessorKey: "companyName",
    header: "Empresa",
    meta: {
      headerClass: "text-left px-4",
      cellClass: "text-left px-4 truncate",
    },
  },
];

const facilityStatusMap = {
  added: "Adicionado",
  removed: "Removido",
};

const filteredFacilities = computed(() => {
  if (filter.value.length > 2) {
    currentPage.value = 1;
    const exp = new RegExp(filter.value.trim(), "i");
    return facilities.value.filter(
      (facility) => exp.test(facility.name) || exp.test(facility.companyName)
    );
  }

  return facilities.value.slice(
    (currentPage.value - 1) * perPage.value,
    currentPage.value * perPage.value
  );
});

const addToSelectedFacilities = (id) => {
  const facility = facilities.value.find((f) => f._id === id);
  if (!facility) return;

  facilities.value = facilities.value.filter((f) => f._id !== id);
  userFacilities.value.push(facility);

  const existingIndex = changedFacilities.value.findIndex(
    (f) => f._id === facility._id
  );
  if (
    existingIndex !== -1 &&
    changedFacilities.value[existingIndex].status === "removed"
  ) {
    changedFacilities.value.splice(existingIndex, 1);
    return;
  }

  if (!changedFacilities.value.find((f) => f._id === facility._id)) {
    changedFacilities.value.push({
      ...facility,
      status: "added",
    });
  }
  console.log({ x: toRaw(changedFacilities.value) });
};

const removeFromSelectedFacilities = (id) => {
  const facility = userFacilities.value.find((f) => f._id === id);
  if (!facility) return;

  // Remove from user facilities
  userFacilities.value = userFacilities.value.filter((f) => f._id !== id);

  // Add back to available facilities
  facilities.value.push(facility);

  // Check if this facility was previously added (to handle toggling)
  const existingIndex = changedFacilities.value.findIndex(
    (f) => f._id === facility._id
  );
  if (
    existingIndex !== -1 &&
    changedFacilities.value[existingIndex].status === "added"
  ) {
    changedFacilities.value.splice(existingIndex, 1);
    return;
  }

  // Otherwise, mark as removed if not already in changed facilities
  if (!changedFacilities.value.some((f) => f._id === facility._id)) {
    changedFacilities.value.push({
      ...facility,
      status: "removed",
    });
  }
};

const edit = async () => {
  try {
    loading.value = true;
    const userData = { user: user.value, facilities: userFacilities.value };

    await axios.put(
      `${auth.apiUrl()}user/${user.value._id}/facilities`,
      userData,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );

    router.push(`/users/${user.value._id}`);
  } catch (err) {
    error.value = true;
    errors.value = err.response?.data || "Erro ao atualizar instalações";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    // Get user data
    const userResponse = await axios.get(
      `${auth.apiUrl()}user/${route.params.id}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );

    if (userResponse.data) {
      user.value = userResponse.data;
    }

    // Get user facilities
    const userFacilitiesResponse = await axios.get(
      `${auth.apiUrl()}user/${route.params.id}/facilities`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );

    if (userFacilitiesResponse.data.list) {
      userFacilities.value = userFacilitiesResponse.data.list;
    }

    // Get all facilities
    const allFacilitiesResponse = await axios.get(
      `${auth.apiUrl()}facilities`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );

    if (allFacilitiesResponse.data.list) {
      // Filter out facilities already assigned to user
      facilities.value = allFacilitiesResponse.data.list.filter((facility) =>
        userFacilities.value.some((uf) => uf._id !== facility._id)
      );
    }
  } catch (err) {
    error.value = true;
    errors.value = err.response?.data || "Erro ao carregar dados";
  } finally {
    loading.value = false;
  }
});
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
.background-img {
  opacity: 0.6;
  z-index: 0;
  min-height: 150px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: center no-repeat;
  background-size: cover;
}

.logo-img {
  z-index: 1;
  position: relative;
  background: center no-repeat;
  -webkit-box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
}

.hyper-card.card:hover {
  cursor: pointer;
  transition: 0.2s;
  -webkit-box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
}

.good-table {
  width: 100%;
  overflow-x: hidden;
}
/*
#search-input-form {
  margin-left: 0px;
} */

div.vgt-wrap__footer.vgt-clearfix {
  margin-left: 0;
  width: 100%;
}

.logo-circle {
  z-index: 1;
  top: -45px;
}

.up-25 {
  position: relative;
  top: -30px;
}
</style>
