<template>
  <Layout title="Movimentação de Material Radioativo">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline italic font-semibold"
      >
        {{ facility.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}/routines`"
        class="text-gray-500 hover:text-teal-800 hover:underline italic font-semibold"
      >
        Rotinas
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-gray-500 italic font-semibold">
        Movimentação de Material Radioativo
      </span>
    </template>

    <template #header>
      <div class="flex gap-2">
        <button
          @click="exportAllData"
          class="bg-gray-200 hover:bg-gray-300 transition-colors duration-300 text-gray-700 px-4 py-2 rounded-md"
          title="exportar"
        >
          <FontAwesomeIcon icon="fa-solid fa-download" />
        </button>

        <router-link
          v-if="permission.canCreateFacility(currentUser)"
          :to="`/facility/${facility._id}/routines/radioactivematerialmov/register`"
          class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="mr-2" /> Adicionar
        </router-link>
      </div>
    </template>

    <div class="flex flex-col gap-6 w-full mb-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="w-full md:w-fit">
          <Input
            id="filterDate"
            v-model="filterDate"
            className="border border-gray-100"
            type="date"
            format="yyyy-MM"
            :clearable="false"
            monthOnly
            @update:modelValue="handleDateChange"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <Table
          v-if="!!filteredRadioactiveMaterialMovementList.length"
          :columns="columnsFormatted"
          :data="filteredRadioactiveMaterialMovementList"
          :total-items="filteredRadioactiveMaterialMovementList.length"
          v-model:loading="loading"
          v-model:per-page="perPage"
          v-model:current-page="currentPage"
        />
        <div v-else class="p-4 text-center text-gray-500">
          Nenhum resultado encontrado
        </div>
      </div>

      <!-- Monthly Summary Section -->
      <div
        v-if="!!filteredRadioactiveMaterialMovementList.length"
        class="bg-white rounded-lg shadow p-6"
      >
        <h5 class="text-lg font-medium mb-4">
          Soma Mensal - {{ filterMonth?.label || "" }}
        </h5>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Isótopo
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Atividade Inicial (mCi)
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Atividade de Uso (mCi)
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in selectedRadioisotopeList.list"
                :key="item.label"
                v-if="item.initialActivity > 0"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ item.label }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ parseFloat(item.initialActivity).toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ parseFloat(item.usageActivity).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end mt-4">
          <button
            @click="confirmDownloadFacilityDocument"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
          >
            <FontAwesomeIcon icon="fa-solid fa-file-alt" class="mr-2" /> Gerar
            Relatório
          </button>
        </div>
      </div>

      <!-- Report Options Section - For selecting responsible person -->
      <div
        v-if="
          !!filteredRadioactiveMaterialMovementList.length && !showSummaryOnly
        "
        class="bg-white p-6 rounded-lg shadow"
      >
        <h5 class="text-lg font-medium mb-4">Gerar Relatórios</h5>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Escolher mês:
            </label>
            <select
              v-model="filterMonth"
              class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option
                v-for="option in filterMonthOptions"
                :key="option.value"
                :value="option"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div v-if="responsibleOptions.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Responsável pelo relatório:
            </label>
            <select
              v-model="selectedResponsible"
              class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option
                v-for="option in responsibleOptions"
                :key="option._id"
                :value="option"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <button
          @click="confirmDownloadFacilityDocument"
          class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
        >
          Gerar Relatório
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  format,
  parseISO,
  startOfMonth,
  getMonth,
  getYear,
  eachMonthOfInterval,
  parse,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/common/Layout.vue";
import Table from "@/components/dashboard/Table.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import { api } from "@/services/api";
import Input from "@/components/ui/Input.vue";
import JsPDF from "jspdf";
import logoRad from "@/assets/logo_rad.png";
import {
  truncate,
  capitalize,
  addLabelAndInformation,
  addReportLogo,
} from "../common.js";
import { createTextCell } from "@/utils/tableCells";
import { toRaw } from "vue";

const route = useRoute();
const router = useRouter();

// State variables
const facility = ref({});
const radioactiveMaterialMovementList = ref([]);
const filterDate = ref(format(new Date(), "yyyy-MM"));
const filterStatus = ref({ label: "Todas", value: "all" });
const filterMonth = ref(null);
const selectedRadioisotopeList = ref({ month: "", list: [] });
const responsibleOptions = ref([]);
const selectedResponsible = ref(null);
const currentUser = ref(auth.currentUser());
const errors = ref("");
const loading = ref(false);
const perPage = ref(10);
const currentPage = ref(1);
const showResponsibleModal = ref(false);
const showSummaryOnly = ref(true); // Option to only show summary table

// Filter status options for consistency
const filterStatusOptions = ref([
  { label: "Todas", value: "all" },
  { label: "Liberados", value: "liberated" },
  { label: "Não liberados", value: "not-liberated" },
]);

// Computed properties for filter month options
const filterMonthOptions = computed(() => {
  const currentYear = getYear(new Date());
  const months = eachMonthOfInterval({
    start: new Date(currentYear, 0, 1),
    end: new Date(currentYear, 11, 31),
  });

  return months.map((monthDate) => ({
    label: format(monthDate, "MMMM", { locale: ptBR }),
    value: format(monthDate, "MM"),
    monthDate: monthDate,
  }));
});

// Helper functions for formatting
const formatDate = (dateString) => {
  if (!dateString) return "";
  return format(parseISO(dateString), "dd/MM/yy", { locale: ptBR });
};

const formatResponsible = (responsible) => {
  if (!responsible) return "";
  return responsible.name || "";
};

// Formatted columns for table
const columnsFormatted = computed(() => {
  return [
    {
      accessorKey: "date",
      header: "Data",
      cell: (info) => formatDate(info.row.original.date),
    },
    {
      accessorKey: "radioisotope",
      header: "Radioisótopo",
      cell: (info) => createTextCell(info, "text-center"),
    },
    {
      accessorKey: "initialActivity",
      header: "Atividade Inicial (mCi)",
      cell: (info) =>
        createTextCell(
          info.row.original.initialActivity
            ? parseFloat(info.row.original.initialActivity).toFixed(2)
            : "",
          "text-center"
        ),
    },
    {
      accessorKey: "usageActivity",
      header: "Atividade de Uso (mCi)",
      cell: (info) =>
        createTextCell(
          info.row.original.usageActivity
            ? parseFloat(info.row.original.usageActivity).toFixed(2)
            : "",
          "text-center"
        ),
    },
    {
      accessorKey: "lot",
      header: "Lote",
      cell: (info) =>
        createTextCell(info.row.original.lot || "", "text-center"),
    },
    {
      accessorKey: "validity",
      header: "Validade",
      cell: (info) => formatDate(info.row.original.validity),
    },
    {
      accessorKey: "responsible",
      header: "Responsável",
      cell: (info) =>
        createTextCell(
          formatResponsible(info.row.original.responsible),
          "text-center"
        ),
    },
    {
      accessorKey: "actions",
      header: "Ações",
      cell: (info) =>
        h("div", { class: "flex gap-1" }, [
          info.row.original.observations
            ? h(
                "button",
                {
                  class: "text-teal-600 hover:text-teal-800",
                  title: `Observações: ${info.row.original.observations}`,
                },
                [h(FontAwesomeIcon, { icon: "fa-solid fa-info-circle" })]
              )
            : null,
          h(
            "router-link",
            {
              to: `/facility/${facility.value._id}/routines/radioactivematerialmov/${info.row.original._id}/edit`,
              class: "text-blue-600 hover:text-blue-800",
            },
            [h(FontAwesomeIcon, { icon: "fa-solid fa-edit" })]
          ),
        ]),
    },
  ];
});

// Computed property for filtered data
const filteredRadioactiveMaterialMovementList = computed(() => {
  if (!radioactiveMaterialMovementList.value) return [];

  // Extract parts from the filter date
  const filterParts = filterDate.value.split("-");
  const filterYear = parseInt(filterParts[0]);
  const filterMonth = parseInt(filterParts[1]) - 1;

  return radioactiveMaterialMovementList.value.filter((item) => {
    const itemDate = parseISO(item.date);
    return (
      getYear(itemDate) === filterYear && getMonth(itemDate) === filterMonth
    );
  });
});

// Methods
const loadData = async () => {
  loading.value = true;

  try {
    const yearFilter = new Date(filterDate.value);

    const filters = {
      status:
        filterStatus.value.value === "liberated"
          ? "liberados"
          : "nao-liberados",
      pageSize: perPage.value,
      pageNum: currentPage.value,
      facilityId: route.params.id,
      dateGte: format(yearFilter, "yyyy-MM-dd"),
      dateLt: format(
        new Date(getYear(yearFilter), getMonth(yearFilter) + 1, 1),
        "yyyy-MM-dd"
      ),
      limit: perPage.value,
    };

    // Load radioactive material movement data
    const response = await api.get(
      `facility/routines/radioactiveMaterialMovement/year/${getYear(
        yearFilter
      )}/${route.params.id}`
    );

    if (response.data.length === 0) {
      radioactiveMaterialMovementList.value = [];
      return;
    }

    radioactiveMaterialMovementList.value = response.data;

    // Prepare radioisotope list for monthly summary
    prepareRadioisotopeList();
  } catch (error) {
    errors.value = error.data || error.message;
    radioactiveMaterialMovementList.value = [];
  } finally {
    loading.value = false;
  }
};

const loadFacility = async () => {
  try {
    const response = await api.get(`facility/${route.params.id}`);

    if (response.data.length === 0) {
      errors.value = "Nenhum resultado encontrado";
      facility.value = {};
      return;
    }

    facility.value = response.data;
  } catch (error) {
    errors.value = error.data || error.message;
    facility.value = {};
  }
};

const loadResponsibles = async () => {
  try {
    const response = await api.get(`users/`);

    if (response.data.length === 0) {
      errors.value = "Nenhum resultado encontrado";
      responsibleOptions.value = [];
      return;
    }

    const responseUsers = response.data.filter(
      (user) => user.type === "rad fisico"
    );
    responsibleOptions.value = responseUsers.map((user) => ({
      label: user.name,
      name: user.name,
      _id: user._id,
    }));
  } catch (error) {
    errors.value = error.data || error.message;
    responsibleOptions.value = [];
  }
};

const prepareRadioisotopeList = () => {
  // Group data by radioisotope for report generation
  const filteredList = filteredRadioactiveMaterialMovementList.value;

  // Get unique radioisotopes
  const radioisotopes = [
    ...new Set(filteredList.map((item) => item.radioisotope)),
  ];

  // Calculate totals for each radioisotope
  const result = radioisotopes.map((isotope) => {
    const items = filteredList.filter((item) => item.radioisotope === isotope);
    const initialActivity = items.reduce(
      (sum, item) => sum + parseFloat(item.initialActivity || 0),
      0
    );
    const usageActivity = items.reduce(
      (sum, item) => sum + parseFloat(item.usageActivity || 0),
      0
    );

    return {
      label: isotope,
      initialActivity,
      usageActivity,
    };
  });

  selectedRadioisotopeList.value = {
    month: format(parseISO(`${filterDate.value}-01`), "MMMM yyyy", {
      locale: ptBR,
    }),
    list: result,
  };
};

const downloadReport = async () => {
  // Create PDF document (portrait mode)
  const doc = new JsPDF();

  // Basic configuration
  const beginRoundedRect = 45;
  const beginTextHeight = beginRoundedRect + 15;

  // Header section with logo
  doc.roundedRect(10, 10, 190, 22, 2, 2, "F");

  try {
    doc.addImage(logoRad, "PNG", 15, 12, 74, 20);
  } catch (error) {
    console.error("Failed to load logo:", error);
    // Fallback for missing logo
    doc.setFontSize(12);
    doc.text("RAD DIMENSTEIN", 60, 24);
  }

  // Title section
  doc.roundedRect(10, beginRoundedRect, 190, 25, 2, 2, "S");
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(
    "Relatório de Movimentação de Material Radioativo",
    105,
    beginRoundedRect - 4,
    { align: "center" }
  );

  // Get selected month name
  const monthName = selectedRadioisotopeList.value.month;
  doc.text(monthName, 105, beginRoundedRect + 8, { align: "center" });

  // Facility info
  addLabelAndInformation(
    doc,
    15,
    beginTextHeight,
    "Razão Social:",
    truncate(facility.value.companyName, 50)
  );
  addLabelAndInformation(
    doc,
    135,
    beginTextHeight,
    "Responsável:",
    selectedResponsible.value?.name || ""
  );

  // Table headers
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.text("Isótopo", 15, beginTextHeight + 22);
  doc.text("Atividade Inicial (mCi)", 105, beginTextHeight + 22, {
    align: "center",
  });
  doc.text("Atividade de Uso (mCi)", 195, beginTextHeight + 22, {
    align: "right",
  });

  // Table data
  let rowCount = 0;
  for (let i = 0; i < selectedRadioisotopeList.value.list.length; i++) {
    const item = selectedRadioisotopeList.value.list[i];

    // Only include items with positive activity values
    if (item.initialActivity > 0 && item.usageActivity > 0) {
      doc.setFont(undefined, "normal");
      doc.text(item.label, 15, beginTextHeight + 32 + rowCount * 8);
      doc.text(
        parseFloat(item.initialActivity).toFixed(2).toString(),
        105,
        beginTextHeight + 32 + rowCount * 8,
        { align: "center" }
      );
      doc.text(
        parseFloat(item.usageActivity).toFixed(2).toString(),
        195,
        beginTextHeight + 32 + rowCount * 8,
        { align: "right" }
      );
      rowCount++;
    }
  }

  // Draw table border
  doc.roundedRect(10, beginTextHeight + 15, 190, 15 + rowCount * 8, 2, 2, "S");

  // Generate filename and save
  doc.save(
    `${facility.value.name} - Movimentação de Material Radioativo - ${monthName}.pdf`
  );
};

const confirmDownloadFacilityDocument = async () => {
  await loadResponsibles();
  prepareRadioisotopeList();

  // If responsible is already selected, generate report directly
  if (selectedResponsible.value) {
    await downloadReport();
  } else {
    // Otherwise, show modal to select responsible
    showResponsibleModal.value = true;
  }
};

const exportAllData = () => {
  // Create CSV export
  const rows = [
    [
      "Data",
      "Isótopo",
      "Atividade Inicial (mCi)",
      "Atividade de Uso (mCi)",
      "Lote",
      "Validade",
      "Responsável",
      "Observações",
    ],
  ];

  // Extract parts from the filter date
  const filterParts = filterDate.value.split("-");
  const filterYear = parseInt(filterParts[0]);
  const filterMonth = parseInt(filterParts[1]) - 1;

  filteredRadioactiveMaterialMovementList.value.forEach((item) => {
    const itemDate = parseISO(item.date);

    // Only include items from the filtered year and month
    if (
      getYear(itemDate) !== filterYear ||
      getMonth(itemDate) !== filterMonth
    ) {
      return;
    }

    const formattedDate = format(itemDate, "dd/MM/yy");
    const formattedValidity = item.validity
      ? format(parseISO(item.validity), "dd/MM/yy")
      : "";

    rows.push([
      formattedDate,
      item.radioisotope || "",
      item.initialActivity ? parseFloat(item.initialActivity).toFixed(2) : "",
      item.usageActivity ? parseFloat(item.usageActivity).toFixed(2) : "",
      item.lot || "",
      formattedValidity,
      item.responsible?.name || "",
      item.observations || "",
    ]);
  });

  // Generate CSV
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  rows.forEach((rowArray) => {
    const row = rowArray.join(";");
    csvContent += row + "\r\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);

  const monthName = format(parseISO(`${filterDate.value}-01`), "MMMM yyyy", {
    locale: ptBR,
  });
  link.setAttribute(
    "download",
    `${facility.value.name} - Movimentação de Material Radioativo - ${monthName}.csv`
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadHowToFill = () => {
  // We don't have this for radioactive material movement, but keeping the function for consistency
};

const handleDateChange = (newDate) => {
  // Make sure filterDate.value is updated before calling loadData
  filterDate.value = newDate;
  loadData();
};

// Lifecycle hooks
onMounted(async () => {
  await loadData();
  await loadFacility();
  await loadResponsibles();

  // Set default month to current month
  const currentMonth = format(new Date(), "MM");
  filterMonth.value = filterMonthOptions.value.find(
    (m) => m.value === currentMonth
  );

  // Prepare isotope summary on initial load
  prepareRadioisotopeList();
});

// Watch for changes in route params to reload data
watch(
  () => route.params,
  () => {
    loadData();
  },
  { deep: true }
);

// Watch for changes in filter date
watch(
  () => filterDate.value,
  async () => {
    await loadData();
    prepareRadioisotopeList(); // Update monthly summary when date changes
  },
  { deep: true }
);

// Watch for status filter changes
watch(
  filterStatus,
  async () => {
    await loadData();
    prepareRadioisotopeList(); // Update monthly summary when filter changes
  },
  { deep: true }
);

// Watch for month filter changes (for report generation)
watch(
  () => filterMonth.value,
  () => {
    prepareRadioisotopeList();
  }
);
</script>

<style>
.date-picker {
  width: 100%;
}
</style>
