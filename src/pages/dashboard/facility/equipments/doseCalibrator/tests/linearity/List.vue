<template>
  <Layout :title="`Linearidade - Histórico`" :loading="loading">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name || "Instalação" }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}/equipments/doseCalibrator`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ equipment.type || "Calibrador de Dose" }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/equipments/doseCalibrator/${equipmentId}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ equipmentTitleShort }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800 select-none">Linearidade</span>
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
          <h2 class="text-lg text-gray-600">Linearidade - Histórico</h2>
        </div>
      </div>

      <div v-if="loading" class="text-center mt-8">Carregando histórico...</div>
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
        Nenhum teste de Linearidade registrado para este equipamento.
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
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Table from "@/components/dashboard/Table.vue";
import Layout from "@/components/common/Layout.vue";
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
  () => `/equipments/doseCalibrator/${equipmentId.value}/linearity/register`
);

const formatDisplayDate = (date) => {
  return date ? moment(date).format("DD/MM/YYYY") : "N/A";
};

const addQuarter = (date) => {
  if (!date) return "N/A";
  return moment(date).add(3, "months").format("DD/MM/YYYY");
};

const columns = [
  {
    accessorKey: "date",
    header: "Data",
    cell: (info) => createDateCell(info),
  },
  {
    accessorKey: "date",
    header: "Validade",
    cell: (info) => addQuarter(info.row.original.date),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) =>
      createStatusCell(info, {
        "em andamento": "bg-yellow-100 text-yellow-800",
        concluído: "bg-green-100 text-green-800",
      }),
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
        "satisfatório - adotar fatores de correção":
          "bg-yellow-100 text-yellow-800",
      }),
  },
  {
    accessorKey: "responsible.name",
    header: "Responsável",
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
            to: `/equipments/doseCalibrator/${equipmentId.value}/linearity/${info.row.original._id}`,
            title: "Informações",
          },
        },
        {
          icon: "fa-edit",
          type: RouterLink,
          iconClass:
            "h-8 rounded-full text-blue-600 flex gap-2 bg-white hover:bg-blue-600 hover:text-white transition-all duration-300",
          props: {
            to: `/equipments/doseCalibrator/${equipmentId.value}/linearity/${info.row.original._id}/edit`,
            title: "Editar",
          },
          condition: (row) => row.status === "em andamento",
        },
      ];
      return createActionButtonsCell(info, actions);
    },
  },
];

const loadTests = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Fetch Equipment Info
    const equipResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!equipResponse.data) throw new Error("Equipamento não encontrado.");
    equipment.value = equipResponse.data;

    // Fetch Facility Info
    if (!equipment.value.facility?._id)
      throw new Error("ID da Instalação não encontrado.");
    const facResponse = await axios.get(
      auth.apiUrl() + `facility/${equipment.value.facility._id}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!facResponse.data) throw new Error("Instalação não encontrada.");
    facility.value = facResponse.data;

    // Fetch Tests List
    const testsResponse = await axios.get(
      auth.apiUrl() +
        `equipment/${equipmentId.value}/doseCalibratorLinearityTests/`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    tests.value = testsResponse.data || [];
  } catch (err) {
    console.error("Erro ao carregar lista de testes de linearidade:", err);
    error.value = err.message || "Falha ao carregar histórico de testes.";
    tests.value = [];
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
/* Add minimal global style if needed by Table statusClassMap */
.text-red-600 {
  color: #dc2626;
}
.text-yellow-600 {
  color: #ca8a04;
} /* Example yellow */
.font-bold {
  font-weight: 700;
}
.bg-green-100 {
  background-color: #d1fae5;
}
.text-green-800 {
  color: #065f46;
}
.bg-red-100 {
  background-color: #fee2e2;
}
.text-red-800 {
  color: #991b1b;
}
.bg-yellow-100 {
  background-color: #fef3c7;
}
.text-yellow-800 {
  color: #92400e;
}
</style>
