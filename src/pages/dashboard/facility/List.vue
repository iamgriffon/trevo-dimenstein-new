<template>
  <Layout title="Instalações">
    <template #header>
      <div class="flex gap-2">
        <button
          type="button"
          class="p-2 rounded-lg"
          :class="
            viewMode === 'card' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
          "
          @click="viewMode = 'card'"
        >
          <FontAwesomeIcon icon="fa-solid fa-th-large" />
        </button>
        <button
          type="button"
          class="p-2 rounded-lg"
          :class="
            viewMode === 'list' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
          "
          @click="viewMode = 'list'"
        >
          <FontAwesomeIcon icon="fa-solid fa-list" />
        </button>
      </div>

      <router-link
        v-if="permission.canCreateFacility(currentUser)"
        class="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        :to="{ path: '/facilities/register/' }"
      >
        <FontAwesomeIcon icon="fa-solid fa-plus" />
        <span class="hidden sm:inline">Adicionar</span>
      </router-link>
    </template>

    <div class="flex flex-col gap-4">
      <Input
        v-model="filter"
        placeholder="Buscar..."
        className="w-96 px-3 border mb-4 rounded-md border-gray-300"
      >
        <FontAwesomeIcon icon="fa-solid fa-search" />
      </Input>
      <template v-if="loading">
        <figure
          class="w-full h-full translate-y-[25%] flex items-center justify-center"
        >
          <img
            src="/static/img/loading.gif"
            class="scale-75"
            alt="Carregando lista..."
          />
        </figure>
      </template>
      <template v-else>
        <section
          v-if="viewMode === 'card'"
          class="sm:grid sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <Card
            v-for="facility in filteredFacilities"
            :key="facility._id"
            :facility="facility"
          />
        </section>
        <section
          v-else-if="viewMode === 'list' && table"
          class="overflow-x-auto bg-white rounded-lg shadow"
        >
          <Table
            :columns="columns"
            :data="filteredFacilities"
            :totalItems="facilities.length"
            v-model:currentPage="currentPage"
            v-model:perPage="perPage"
          />
        </section>
        <footer
          v-if="viewMode === 'card'"
          class="flex justify-center text-2xl mt-16"
        >
          <nav class="flex gap-1">
            <button
              v-if="currentPage > 1"
              class="p-2 rounded-sm hover:bg-gray-100"
              @click="currentPage--"
              :class="defaultStyle"
            >
              &laquo;
            </button>
            <button
              v-if="currentPage > 1"
              @click="currentPage--"
              :class="defaultStyle"
            >
              {{ currentPage - 1 }}
            </button>
            <span
              class="p-2 font-medium text-white rounded-xl w-12 h-12 text-center bg-green-600"
              >{{ currentPage }}</span
            >
            <button
              v-if="currentPage * perPage < facilities.length"
              @click="currentPage++"
              :class="defaultStyle"
            >
              {{ currentPage + 1 }}
            </button>
            <button
              v-if="currentPage * perPage < facilities.length"
              @click="currentPage++"
              :class="defaultStyle"
            >
              &raquo;
            </button>
          </nav>
        </footer>
      </template>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/vue-table";
import { RouterLink, useRoute } from "vue-router";

import axios from "axios";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Card from "@/components/dashboard/Card.vue";
import Table from "@/components/dashboard/Table.vue";
import { createTextCell, createActionButtonsCell } from "@/utils/tableCells";

const filter = ref("");
const facilities = ref([]);
const currentPage = ref(1);
const perPage = ref(10);
const totalItems = ref(0);
const viewMode = ref("card");
const loading = ref(false);

const currentUser = ref(auth.currentUser());
const route = useRoute();

const defaultStyle =
  "p-2 rounded-xl w-12 h-12 hover:bg-gray-100 hover:text-green-500 transition-colors duration-300";

const columns = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: (info) => createTextCell(info, "text-left"),
    meta: {
      headerClass: "text-left pl-4",
      cellClass: "text-left pl-4",
    },
  },
  {
    accessorKey: "telephone",
    header: "Telefone",
    cell: (info) => createTextCell(info, "text-left"),
    meta: {
      headerClass: "text-left",
      cellClass: "text-left",
    },
  },
  {
    accessorKey: "action",
    header: "Ações",
    meta: {
      cellClass: "flex w-full items-center justify-center pr-4",
      headerClass: "text-center",
    },
    cell: (info) => {
      const actionButtons = [
        {
          type: RouterLink,
          icon: "fa-solid fa-info",
          props: {
            to: {
              path: `/facility/${info.row.original._id}`,
            },
            class:
              "flex items-center w-full justify-center p-2 rounded-md gap-2 bg-gray-100 cursor-pointer hover:shadow-inner hover:bg-gray-200 transition-all duration-300",
            title: "Informações",
          },
          text: "Informações",
        },
      ];
      return createActionButtonsCell(
        info,
        actionButtons,
        "flex items-center justify-end"
      );
    },
  },
];

const filteredFacilities = computed(() => {
  if (filter.value.length > 2) {
    currentPage.value = 1;
    const exp = new RegExp(filter.value.trim(), "i");
    return facilities.value.filter((item) => exp.test(item.name));
  }

  return facilities.value;
});

const loadFacilities = async () => {
  loading.value = true;
  const lastPage = Math.ceil(facilities?.value.length / perPage.value);
  if (currentPage.value > lastPage && lastPage > 0) {
    currentPage.value = lastPage;
  }
  try {
    let endpoint = "facilities/";

    if (route.path === "/facility/nuclearmedicine") {
      endpoint = "nuclearmedicinefacilities/";
    } else if (route.path === "/facility/radiodiagnosis") {
      endpoint = "radiodiagnosisfacilities/";
    }

    const initialFilter = { pageSize: 10, pageNum: 1, limit: 10 };
    const response = await axios.get(`${auth.apiUrl()}${endpoint}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
      params: {
        filters: JSON.stringify(initialFilter),
      },
    });

    if (response.data.list.length === 0) {
      console.warn("No facilities found");
      facilities.value = [];
      return;
    }

    facilities.value = response.data.list;
    totalItems.value = response.data.paging.total;

    for (
      let i = 2;
      i <= Math.ceil(totalItems?.value / initialFilter.limit);
      i++
    ) {
      const pageFilter = { pageSize: 10, pageNum: i, limit: 10 };
      const resp = await axios.get(`${auth.apiUrl()}${endpoint}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
        params: {
          filters: JSON.stringify(pageFilter),
        },
      });

      if (resp.data.list.length > 0) {
        facilities.value.push(...resp.data.list);
      }
      if (facilities.value.length >= perPage.value) {
        loading.value = false;
      }
    }
  } catch (error) {
    console.error("Error loading facilities:", error.response);
    facilities.value = [];
  }
};

onMounted(() => {
  loadFacilities();
});

const table = computed(() => {
  if (!filteredFacilities.value || filteredFacilities.value.length === 0) {
    return null;
  }

  return useVueTable({
    data: filteredFacilities.value,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
});

watch([perPage, currentPage], () => {
  const maxPage = Math.ceil(facilities.value.length / perPage.value) || 1;
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage;
  }
});
</script>
