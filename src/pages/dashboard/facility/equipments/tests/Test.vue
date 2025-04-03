<template>
  <Layout :title="`${test?.name} - Histórico`" :loading="loading">
    <template #breadcrumb>
      <!-- Consistent breadcrumbs -->
      <router-link
        :to="`/facility/${facility._id}`"
        class="px-2 text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name || "Instalação" }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/equipments/${equipment.typeId}/${equipmentId}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ equipmentTitleShort }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800 select-none">{{ test.name }}</span>
    </template>
    <template #header>
      <!-- Consistent header buttons -->
      <div class="flex gap-2 items-center mb-6">
        <router-link
          class="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          :to="`/equipments/${equipment.typeId}/${equipmentId}`"
        >
          <FontAwesomeIcon :icon="['fas', 'arrow-left']" />
          <span class="hidden md:inline">Voltar</span>
        </router-link>
        <router-link
          v-if="permission?.canCreateFacility(currentUser)"
          class="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          :to="addTestLink"
        >
          <FontAwesomeIcon :icon="['fas', 'plus']" />
          <span class="hidden md:inline">Adicionar</span>
        </router-link>
      </div>
    </template>
    <div>
      <!-- Consistent main content structure -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-semibold">{{ equipmentTitle }}</h1>
          <h2 class="text-lg text-gray-600">{{ test.name }} - Histórico</h2>
        </div>
      </div>

      <div v-if="loading" class="text-center mt-8">Carregando testes...</div>
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>

      <Table
        v-if="!loading && tests.length > 0"
        :columns="columns"
        :data="tests"
        :refreshData="loadDocuments"
        v-model:perPage="perPage"
        v-model:currentPage="page"
        :totalItems="tests.length"
        footer-class="relative border-none w-full justify-center z-auto"
      />

      <div
        v-if="!loading && tests.length === 0 && !error"
        class="text-center text-gray-500 mt-8"
      >
        Nenhum teste de {{ test.name }} registrado para este equipamento.
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router"; // Added RouterLink, useRouter
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Table from "@/components/dashboard/Table.vue";
import Layout from "@/components/common/Layout.vue"; // Added Layout import
import {
  createActionButtonsCell,
  createDateCell,
  createStatusCell,
  createCheckboxCell,
createTextCell,
createRelationCell,
} from "@/utils/tableCells"; // Added table cell utilities
import { cn } from "@/utils/cn";
import { h } from "vue";

const route = useRoute();
const router = useRouter(); // Added useRouter

const loading = ref(true);
const error = ref(null);
const facility = ref({});
const equipment = ref({});
const test = ref({ name: "" });
const tests = ref([]);
const currentUser = ref({});
const perPage = ref(10); // Added pagination refs
const page = ref(1);

const equipmentId = computed(() => route.params.equipmentId);
const testTypeId = computed(() => route.params.id);

const equipmentTitle = computed(() => {
  if (!equipment.value.type) return "Equipamento";
  const patrimonial = equipment.value.patrimonialNumber || "";
  const serial = equipment.value.serialNumber || "";
  const separator = patrimonial && serial ? " - " : "";
  return `${equipment.value.type} ${patrimonial}${separator}${serial}`.trim();
});

// Added for shorter breadcrumb title
const equipmentTitleShort = computed(() => {
  if (!equipment.value.type) return "ID";
  const patrimonial = equipment.value.patrimonialNumber || "";
  const serial = equipment.value.serialNumber || "";
  const separator = patrimonial && serial ? "-" : "";
  return `${patrimonial}${separator}${serial}`.trim() || equipment.value.type || "Detalhes";
});

const addTestLink = computed(() => {
  if (!equipment.value.typeId) return "#"; // Or handle appropriately
  return `/equipments/${equipment.value.typeId}/${equipmentId.value}/${testTypeId.value}/register`;
});

const tableButtonStyle =
  "rounded-full w-10 h-10 bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors";

const selectIconClass = ref("bg-green-500 hover:bg-green-700");
const selectIconType = ref("fa-check");
const columns = [
  {
    accessorKey: "type",
    header: {
      component: () =>
        h(
          "button",
          {
            class: cn(
              "w-10 h-10 rounded-md text-xs transition-all duration-300 cursor-pointer text-white",
              selectIconClass.value
            ),
            onClick: () => toggleAllSelected(),
          },
          h(FontAwesomeIcon, {
            icon: cn("fa-solid", selectIconType.value),
          })
        ),
    },
    cell: (info) => createCheckboxCell(info),
    meta: {
      headerClass: "px-8",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: (info) => createDateCell(info),
  },
  {
    accessorKey: "facility",
    header: "Instalação",
    cell: (info) =>
      h("p", { class: "text-left" }, info.row.original.facility[0]?.name),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "uploadedBy",
    header: "Upload por",
    cell: (info) =>
      h("p", { class: "text-left" }, info.row.original.uploadedBy[0]?.name),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "signedBy",
    header: "Assinado por",
    cell: (info) =>
      h("p", { class: "text-left" }, info.row.original.uploadedBy[0]?.name),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "liberatedBy",
    header: "Liberado por",
    cell: (info) =>
      createRelationCell(info?.row?.original?.liberatedBy, "name", "text-left"),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "uploadedAt",
    header: "Upload",
    sortable: true,
    cell: (info) => createDateCell(info, "text-center"),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-4",
    },
  },
  {
    accessorKey: "validity",
    header: "Validade",
    sortable: true,
    cell: (info) => createDateCell(info, "text-center"),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) =>
      createStatusCell(info, {
        Liberado: "bg-green-100 text-green-800",
        "Não Liberado": "bg-yellow-100 text-yellow-800",
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
      }),
    meta: {
      headerClass: "px-8",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: (info) => {
      const actions = [
        {
          type: "a",
          icon: "fa-solid fa-eye",
          props: {
            class: tableButtonStyle,
            href: info.row.original.path,
            target: "_blank",
            title: "Visualizar",
          },
        },
        {
          icon: "fa-solid fa-pen-to-square",
          type: RouterLink,
          props: {
            class: cn(
              tableButtonStyle,
              !permission.canEdit(currentUser.value, auth.currentUser()) &&
                "hidden"
            ),
            to: `/equipments/${equipment.value.typeId}/${equipmentId.value}/${testTypeId.value}/${info.row.original._id}/edit`,
            title: "Editar",
          },
        },
        {
          icon: "fa-solid fa-trash",
          type: "button",
          props: {
            class: cn(
              tableButtonStyle,
             !permission.canExcludeDocuments(auth.currentUser()) && "hidden"
            ),
            title: "Deletar",
            onClick: () => deleteTest(info.row.original._id),
          },
        },
      ];
      return createActionButtonsCell(info, actions);
    },
  },
];

const loadDocuments = async () => {
  loading.value = true;
  error.value = null;
  // tests.value = []; // Don't reset here if called by refreshData in Table
  try {
    const response = await axios.get(
      auth.apiUrl() + `test/${equipmentId.value}/${testTypeId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );

    if (permission.canSeeNotLiberatedTests(currentUser.value)) {
      tests.value = response.data || [];
    } else {
      tests.value = (response.data || []).filter(
        (t) => t.status === "Liberado"
      );
    }
  } catch (err) {
    console.error("Erro ao carregar documentos:", err);
    error.value = "Falha ao carregar a lista de testes.";
    tests.value = [];
  } finally {
    loading.value = false;
  }
};

function toggleAllSelected(newValue) {
  const isSomeSelected = tests.value?.some((item) => !!item.selected);
  let newValues = [];

  const shouldSelectAll =
    typeof newValue === "undefined" ? !isSomeSelected : !!newValue;

  selectIconType.value = isSomeSelected ? "fa-check" : "fa-times-circle";
  selectIconClass.value = isSomeSelected
    ? "bg-green-500 hover:bg-green-700"
    : "bg-red-500 hover:bg-red-700";

  newValues = tests.value?.map((item) => ({
    ...item,
    selected: shouldSelectAll,
  }));
  tests.value = newValues;
}

const deleteTest = (testId) => {
  if (confirm("Tem certeza que deseja excluir este teste?")) {
    auth.excludeDocument(null, testId, () =>
      setTimeout(() => {
        loading.value = false;
        loadDocuments();
      }, 1000)
    );
  }
};

const loadInitialData = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Fetch Equipment
    const equipmentResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!equipmentResponse.data) throw new Error("Equipamento não encontrado.");
    equipment.value = equipmentResponse.data;

    // Fetch Facility (using equipment data)
    if (!equipment.value.facility?._id)
      throw new Error("ID da Instalação não encontrado no equipamento.");
    const facilityResponse = await axios.get(
      auth.apiUrl() + `facility/${equipment.value.facility._id}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!facilityResponse.data) throw new Error("Instalação não encontrada.");
    facility.value = facilityResponse.data;

    // Fetch Test Type Info
    const testTypeResponse = await axios.get(
      auth.apiUrl() + `test/${testTypeId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!testTypeResponse.data)
      throw new Error("Tipo de teste não encontrado.");
    test.value = testTypeResponse.data;

    // Load the actual test documents
    await loadDocuments();
  } catch (err) {
    console.error("Erro ao carregar dados iniciais:", err);
    error.value = err.message || "Falha ao carregar dados iniciais.";
    equipment.value = {};
    facility.value = {};
    test.value = { name: "" };
    tests.value = [];
    loading.value = false;
  }
};

onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadInitialData();
});
</script>
