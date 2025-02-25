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
        class="w-full px-3 border mb-4 rounded-md border-gray-300 max-md:w-96"
      >
        <FontAwesomeIcon icon="fa-solid fa-search" />
      </Input>
      <template v-if="loading">
        <img src="../../../assets/loading.gif" />
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
          v-if="viewMode === 'list' && table"
          class="overflow-x-auto bg-white rounded-lg shadow"
        >
          <table class="w-full">
            <thead>
              <tr
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
              >
                <th v-for="header in headerGroup.headers" :key="header.id">
                  {{
                    header.isPlaceholder ? null : header.column.columnDef.header
                  }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in table.getRowModel().rows" :key="row.id">
                <td v-for="cell in row.getVisibleCells()" :key="cell.id">
                  {{ cell.renderValue() }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <footer class="flex justify-center text-2xl mt-16">
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
import { useRoute } from "vue-router";

import axios from "axios";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Card from "@/components/dashboard/facility/list/Card.vue";

const filter = ref("");
const facilities = ref([]);
const currentPage = ref(1);
const perPage = ref(12);
const viewMode = ref("card");
const loading = ref(false);

const currentUser = ref(auth.currentUser());
const route = useRoute();

const defaultStyle =
  "p-2 rounded-xl w-12 h-12 hover:bg-gray-100 hover:text-green-500 transition-colors duration-300";

const filteredFacilities = computed(() => {
  if (filter.value.length > 2) {
    currentPage.value = 1;
    const exp = new RegExp(filter.value.trim(), "i");
    return facilities.value
      .filter((item) => exp.test(item.name))
      .slice(
        (currentPage.value - 1) * perPage.value,
        currentPage.value * perPage.value
      );
  }
  return facilities.value.slice(
    (currentPage.value - 1) * perPage.value,
    currentPage.value * perPage.value
  );
});

const loadFacilities = async () => {
  loading.value = true;
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
    const total = response.data.paging.total;

    for (let i = 2; i <= Math.ceil(total / initialFilter.limit); i++) {
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
      if (facilities.value.length >= 12) {
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
    data: filteredFacilities,
    columns: [
      {
        accessorKey: "name",
        header: "Nome",
      },
      {
        accessorKey: "telephone",
        header: "Telefone",
      },
      {
        accessorKey: "action",
        header: "Ações",
        cell: (info) =>
          h(
            "router-link",
            {
              to: `/facility/${info.row.original._id}`,
              class:
                "flex items-center gap-1 px-3 py-2 text-sm text-green-600 hover:bg-gray-100",
            },
            () => [
              h(FontAwesomeIcon, { icon: "fa-solid fa-info-circle" }),
              "Informações",
            ]
          ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
});

watch(filter, (newVal) => {
  if (newVal.length > 2) {
    currentPage.value = 1;
  }
});
</script>
