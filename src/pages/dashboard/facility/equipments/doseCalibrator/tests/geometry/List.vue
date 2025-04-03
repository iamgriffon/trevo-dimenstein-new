<template>
  <Layout :title="`Geometria - Histórico`" :loading="loading">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/equipments/doseCalibrator/${equipmentId}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ equipmentTitleShort }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800 select-none">Geometria</span>
    </template>
    <template #header>
      <div class="flex gap-2 items-center mb-6">
        <router-link
          class="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          :to="`/equipments/doseCalibrator/${equipmentId}`"
        >
          <FontAwesomeIcon :icon="['fas', 'arrow-left']" />
          <span class="hidden md:inline">Voltar</span>
        </router-link>
        <router-link
          class="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          :to="registerLink"
        >
          <FontAwesomeIcon :icon="['fas', 'plus']" />
          <span class="hidden md:inline">Adicionar</span>
        </router-link>
      </div>
    </template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-semibold">{{ equipmentTitle }}</h1>
          <h2 class="text-lg text-gray-600">Geometria - Histórico</h2>
        </div>
      </div>
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>

      <Table
        v-if="!loading && tests.length > 0"
        :columns="columns"
        :data="tests"
        :refreshData="loadTests"
        v-model:perPage="perPage"
        v-model:currentPage="page"
        :totalItems="tests.length"
      />

      <div
        v-if="!loading && tests.length === 0 && !error"
        class="text-center text-gray-500 mt-8"
      >
        Nenhum teste de Geometria registrado para este equipamento.
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication"; // Assuming path
import permission from "@/services/permissions"; // Assuming path
import Table from "@/components/dashboard/Table.vue"; // Adjusted path
import Layout from "@/components/common/Layout.vue"; // Adjusted path
import {
  createActionButtonsCell,
  createDateCell,
  createStatusCell,
  createTextCell,
} from "@/utils/tableCells";

const route = useRoute();
const router = useRouter();

const facility = ref({});
const equipment = ref({});
const tests = ref([]);
const currentUser = ref({});
const loading = ref(true);
const error = ref(null);
const perPage = ref(10);
const page = ref(1);

const equipmentId = computed(() => route.params.id);

const equipmentTitle = computed(() => {
  if (!equipment.value.type) return "Equipamento";
  const patrimonial = equipment.value.patrimonialNumber || "";
  const serial = equipment.value.serialNumber || "";
  const separator = patrimonial && serial ? " - " : "";
  return `${equipment.value.type} ${patrimonial}${separator}${serial}`.trim();
});

const equipmentTitleShort = computed(() => {
  if (!equipment.value.type) return "ID";
  const patrimonial = equipment.value.patrimonialNumber || "";
  const serial = equipment.value.serialNumber || "";
  const separator = patrimonial && serial ? "-" : "";
  return `${patrimonial}${separator}${serial}`.trim() || "Detalhes";
});

const registerLink = computed(
  () => `/equipments/doseCalibrator/${equipmentId.value}/geometry/register`
);

const formatDisplayDate = (date) => {
  return date ? moment(date).format('DD/MM/YYYY') : 'N/A';
};

const addYear = (date) => {
  if (!date) return "N/A";
  return moment(date).add(1, "year").format("DD/MM/YYYY");
};

// Define columns for the Table component
const columns = [
  {
    accessorKey: "date",
    header: "Data",
    cell: (info) => createDateCell(info),
  },
  {
    accessorKey: "date",
    header: "Vencimento",
    cell: (info) => addYear(info.row.original.date),
  },
  {
    accessorKey: "conclusion",
    header: "Conclusão",
    cell: (info) =>
      createStatusCell(info, {
        Satisfatório: "bg-green-100 text-green-800",
        satisfatório: "bg-green-100 text-green-800",
        Insatisfatório: "bg-red-100 text-red-800",
        insatisfatório: "bg-red-100 text-red-800",
      }),
  },
  {
    accessorKey: "responsible.name",
    header: "Realizado por",
    cell: (info) => createTextCell(info),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: (info) => {
      const actions = [
        {
          icon: "fa-info-circle",
          type: RouterLink,
          iconClass:
            "h-8 rounded-full text-green-600 flex gap-2 bg-white hover:bg-green-600 hover:text-white transition-all duration-300",
          props: {
            to: `/equipments/doseCalibrator/${equipmentId.value}/geometry/${info.row.original._id}`,
            title: "Informações",
          },
        },
        // Example of conditional edit action (if needed based on original logic)
        // {
        //   icon: 'fa-edit',
        //   type: RouterLink,
        //   iconClass: 'h-8 rounded-full text-blue-600 flex gap-2 bg-white hover:bg-blue-600 hover:text-white transition-all duration-300',
        //   props: {
        //     to: `/equipments/doseCalibrator/${equipmentId.value}/geometry/${info.row.original._id}/edit`,
        //     title: 'Editar'
        //   },
        //   condition: (row) => row.status === 'em andamento' // Example condition
        // }
      ];
      return createActionButtonsCell(info, actions);
    },
  },
];

const loadTests = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Fetch Equipment Info (needed for title and context)
    const equipResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!equipResponse.data) throw new Error("Equipamento não encontrado.");
    equipment.value = equipResponse.data;

    // Fetch Facility Info (needed for breadcrumb context in Layout)
    if (!equipment.value.facility?._id)
      throw new Error("ID da Instalação não encontrado.");
    const facResponse = await axios.get(
      auth.apiUrl() + `facility/${equipment.value.facility._id}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!facResponse.data) throw new Error("Instalação não encontrada.");
    facility.value = facResponse.data; // Needed for Layout's breadcrumbs

    // Fetch Tests List
    const testsResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}/DoseCalibratorGeometryTests/`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    tests.value = testsResponse.data || [];
  } catch (err) {
    console.error("Erro ao carregar lista de testes de geometria:", err);
    error.value = err.message || "Falha ao carregar histórico de testes.";
    tests.value = []; // Clear tests on error
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadTests();
});
</script>

<style>
/* Remove styles if they are handled globally or within Table component */
/* .text-red-600 {
    color: #dc2626; /* Tailwind red-600 */
/* } */
/* .font-bold {
    font-weight: 700;
} */
/* .bg-green-100 { background-color: #d1fae5; } /* Tailwind green-100 */
/* .text-green-800 { color: #065f46; } /* Tailwind green-800 */
/* .bg-red-100 { background-color: #fee2e2; } /* Tailwind red-100 */
/* .text-red-800 { color: #991b1b; } /* Tailwind red-800 */
</style>
