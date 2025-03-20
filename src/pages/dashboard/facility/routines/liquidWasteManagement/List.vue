<template>
  <Layout title="Gerenciamento de Rejeitos Líquidos">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility?.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}/routines`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        Rotinas
      </router-link>
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
          :to="`/facility/${facility._id}/routines/liquidwastemanagement/register`"
          class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="mr-2" /> Adicionar
        </router-link>
      </div>
    </template>

    <div class="flex flex-col gap-6 w-full mb-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <select
            v-model="filterStatus"
            class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option
              v-for="option in filterStatusOptions"
              :key="option.value"
              :value="option"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="flex justify-end">
          <div class="w-full md:w-auto">
            <Input
              id="filterDate"
              v-model="filterDate"
              type="date"
              format="MM/yyyy"
              :monthOnly="true"
              @update:modelValue="handleDateChange"
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <Table
          v-if="!!filteredLiquidWasteManagementList.length"
          :columns="columnsFormatted"
          :data="filteredLiquidWasteManagementList"
          :total-items="filteredLiquidWasteManagementList.length"
          v-model:loading="loading"
          v-model:per-page="perPage"
          v-model:current-page="currentPage"
        />
        <div v-else class="p-4 text-center text-gray-500">
          Nenhum resultado encontrado
        </div>
      </div>

      <div
        v-if="!!filteredLiquidWasteManagementList.length"
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

          <div v-if="!!responsibleOptions.length">
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  format,
  parseISO,
  getYear,
  eachMonthOfInterval,
  startOfMonth,
  parse,
  getMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/common/Layout.vue";
import Table from "@/components/dashboard/Table.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import { api } from "@/services/api";
import Input from "@/components/ui/Input.vue";
import { createTextCell } from "@/utils/tableCells";
import { toRaw } from "vue";
import JsPDF from "jspdf";
import logoRad from "@/assets/logo_rad.png";
import { addLabelAndInformation, capitalize, truncate } from "../common";

const route = useRoute();
const router = useRouter();

// State variables
const facility = ref({});
const liquidWasteManagementList = ref([]);
const filterDate = ref(format(new Date(), "MM/yyyy"));
const filterStatus = ref({ label: "Todos", value: "all" });
const filterMonth = ref(null);
const responsibleOptions = ref([]);
const selectedResponsible = ref("");
const currentUser = ref(auth.currentUser());
const errors = ref("");
const loading = ref(false);
const perPage = ref(10);
const currentPage = ref(1);
const showResponsibleModal = ref(false);

// Options for filters
const filterStatusOptions = ref([
  { label: "Todos", value: "all" },
  { label: "Liberados", value: "open" },
  { label: "Armazenamento", value: "closed" },
]);

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

const formatDate = (dateString) => {
  if (!dateString) return "";
  return format(dateString, "dd/MM/yyyy", { locale: ptBR });
};

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
      accessorKey: "activity",
      header: "Atividade (mCi)",
      cell: (info) => createTextCell(info, "text-center"),
    },
    {
      accessorKey: "volume",
      header: "Volume (ml)",
      cell: (info) => createTextCell(info, "text-center"),
    },
    {
      accessorKey: "radiationPlanLiberationPrevision",
      header: "Previsão de Liberação PPR",
      cell: (info) =>
        formatDate(info.row.original.radiationPlanLiberationPrevision),
    },
    {
      accessorKey: "responsibleForClosing",
      header: "Responsável",
      cell: (info) => createTextCell(info, "text-center"),
    },
    {
      accessorKey: "calculatedLiberationPrevision",
      header: "Estimativa de Liberação",
      cell: (info) =>
        formatDate(info.row.original.calculatedLiberationPrevision),
    },
    {
      accessorKey: "liberationDate",
      header: "Data de Liberação",
      cell: (info) => formatDate(info.row.original.liberationDate),
    },
    {
      accessorKey: "liberationExposure",
      header: "Exposição de Liberação (mR/h)",
      cell: (info) => createTextCell(info, "text-center"),
    },
    {
      accessorKey: "responsibleForLiberating",
      header: "Responsável pela Liberação",
      cell: (info) => createTextCell(info, "text-center"),
    },
  ];
});

const filteredLiquidWasteManagementList = computed(() => {
  const yearFilter = parse(
    toRaw(filterDate.value),
    "MM/yyyy",
    new Date()
  ).getFullYear();
  if (!Array.isArray(liquidWasteManagementList.value)) {
    return [];
  }

  return liquidWasteManagementList.value.filter((item) => {
    const itemDate = parseISO(item.date);
    return getYear(itemDate) === yearFilter;
  });
});

const loadData = async () => {
  loading.value = true;

  try {
    const yearFilter = startOfMonth(
      parse(filterDate.value, "MM/yyyy", new Date())
    );
    const filters = {
      status: filterStatus.value || "all",
      pageSize: perPage.value,
      pageNum: currentPage.value,
      facilityId: route.params.id,
      dateGte: format(yearFilter, "yyyy-MM-dd"),
      dateLt: format(
        startOfMonth(new Date(getYear(yearFilter) + 1, 0, 1)),
        "yyyy-MM-dd"
      ),
      limit: perPage.value,
    };

    const liquidWasteResponse = await api.get(
      `/facility/${route.params.id}/routines/liquidWasteManagement/`,
      {
        params: { filters: JSON.stringify(filters) },
      }
    );

    if (!liquidWasteResponse.data) {
      liquidWasteManagementList.value = [];
      return;
    }

    if (Array.isArray(liquidWasteResponse.data)) {
      liquidWasteManagementList.value = liquidWasteResponse.data;
    } else if (
      liquidWasteResponse.data.data &&
      Array.isArray(liquidWasteResponse.data.data)
    ) {
      liquidWasteManagementList.value = liquidWasteResponse.data.data;
    } else {
      liquidWasteManagementList.value = [];
    }
  } catch (error) {
    errors.value = error.data;
    liquidWasteManagementList.value = [];
  } finally {
    loading.value = false;
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
    console.log({ responseUsers });
    responsibleOptions.value = responseUsers.map((user) => ({
      label: user.name,
      name: user.name,
      _id: user._id,
    }));
  } catch (error) {
    errors.value = error.data;
    responsibleOptions.value = [];
  }
};

const loadFacility = async () => {
  try {
    const response = await api.get(`/facility/${route.params.id}`);
    facility.value = response.data;
    currentUser.value = auth.currentUser();
  } catch (error) {
    errors.value = error.data;
    facility.value = "";
  }
};

const downloadReport = async () => {
  const doc = new JsPDF("landscape");

  // Basic configuration
  const beginRoundedRect = 10;
  const beginTextHeight = beginRoundedRect + 13;

  // Pagination variables
  const itemsPerPage = 24;

  // Filter by selected year and month
  const yearFilter = parse(
    filterDate.value,
    "MM/yyyy",
    new Date()
  ).getFullYear();
  const filteredData = filteredLiquidWasteManagementList.value.filter(
    (item) => {
      const itemDate = parseISO(item.date);
      const itemMonth = getMonth(itemDate);
      return (
        getYear(itemDate) === yearFilter &&
        itemMonth === parseInt(filterMonth.value?.value) - 1
      );
    }
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1; // Ensure at least 1 page

  // Create pages
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    // Add a new page (except for the first one which is already there)
    if (pageNum > 1) {
      doc.addPage();
    }

    // Header and layout
    doc.roundedRect(10, beginTextHeight + 15, 278, 150, 2, 2, "S");

    // Logo section
    doc.roundedRect(177, 10, 111, 22, 2, 2, "F");

    // Use the imported PNG logo
    try {
      doc.addImage(logoRad, "PNG", 182, 12, 74, 20);
    } catch (error) {
      console.error("Failed to load logo:", error);
      // Fallback for missing logo
      doc.setFontSize(12);
      doc.text("RAD DIMENSTEIN", 230, 24, { align: "center" });
    }

    // Title section
    doc.roundedRect(10, beginRoundedRect, 160, 22, 2, 2, "S");
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(
      "Relatório de Gerenciamento de Rejeitos Líquidos",
      90,
      beginRoundedRect + 6,
      { align: "center" }
    );

    // Facility info
    addLabelAndInformation(
      doc,
      15,
      beginTextHeight,
      "Razão Social:",
      truncate(facility.value.companyName, 32)
    );
    addLabelAndInformation(
      doc,
      75,
      beginTextHeight,
      "Mês:",
      capitalize(filterMonth.value?.label)
    );
    addLabelAndInformation(
      doc,
      140,
      beginTextHeight,
      "Responsável:",
      selectedResponsible?.value?.name || "Teste"
    );

    // Table headers
    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.text("Data", 15, beginTextHeight + 28);
    doc.text("Isótopo", 36, beginTextHeight + 28);
    doc.text("Atividade", 56, beginTextHeight + 25);
    doc.text("(mCi)", 56, beginTextHeight + 28);
    doc.text("Volume", 82, beginTextHeight + 25);
    doc.text("(ml)", 82, beginTextHeight + 28);
    doc.text("Previsão de", 106, beginTextHeight + 22);
    doc.text("Liberação", 106, beginTextHeight + 25);
    doc.text("PPR", 106, beginTextHeight + 28);
    doc.text("Responsável", 132, beginTextHeight + 28);
    doc.text("Estimativa", 162, beginTextHeight + 25);
    doc.text("de Liberação", 162, beginTextHeight + 28);
    doc.text("Data de", 192, beginTextHeight + 25);
    doc.text("Liberação", 192, beginTextHeight + 28);
    doc.text("Exposição", 216, beginTextHeight + 22);
    doc.text("de Liberação", 216, beginTextHeight + 25);
    doc.text("(mR/h)", 216, beginTextHeight + 28);
    doc.text("Responsável", 246, beginTextHeight + 22);
    doc.text("pela", 246, beginTextHeight + 25);
    doc.text("Liberação", 246, beginTextHeight + 28);

    // Calculate items for this page
    const startItem = (pageNum - 1) * itemsPerPage;
    const endItem = Math.min(startItem + itemsPerPage, filteredData.length);

    // Process items for this page
    for (let i = startItem; i < endItem; i++) {
      const item = filteredData[i];
      const rowPosition = i - startItem + 1; // Position relative to current page

      // Format display data
      const liberationDate = item.liberationDate
        ? format(parseISO(item.liberationDate), "dd/MM/yy")
        : "";

      const liberationExposure = item.liberationDate ? "<0.02" : "";

      let responsibleForLiberating = "";
      if (item.responsibleForLiberating?.name) {
        responsibleForLiberating =
          item.responsibleForLiberating.name.length > 14
            ? item.responsibleForLiberating.name.substring(0, 14) + "."
            : item.responsibleForLiberating.name;
      }

      const responsibleName = item.responsibleForClosing?.name || "";
      const responsibleForClosing =
        responsibleName.length > 14
          ? responsibleName.substring(0, 14) + "."
          : responsibleName;

      // Render row data
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.text(
        format(parseISO(item.date), "dd/MM/yy"),
        15,
        beginTextHeight + 33 + rowPosition * 4
      );
      doc.text(
        item.radioisotope || "",
        36,
        beginTextHeight + 33 + rowPosition * 4
      );
      doc.text(
        parseFloat(item.activity || 0).toFixed(2),
        56,
        beginTextHeight + 33 + rowPosition * 4
      );
      doc.text(
        parseFloat(item.volume || 0).toFixed(1),
        82,
        beginTextHeight + 33 + rowPosition * 4
      );

      if (item.radiationPlanLiberationPrevision) {
        doc.text(
          format(parseISO(item.radiationPlanLiberationPrevision), "dd/MM/yy"),
          106,
          beginTextHeight + 33 + rowPosition * 4
        );
      }

      doc.text(
        responsibleForClosing,
        132,
        beginTextHeight + 33 + rowPosition * 4
      );

      if (item.calculatedLiberationPrevision) {
        doc.text(
          format(parseISO(item.calculatedLiberationPrevision), "dd/MM/yy"),
          162,
          beginTextHeight + 33 + rowPosition * 4
        );
      }

      doc.text(liberationDate, 192, beginTextHeight + 33 + rowPosition * 4);
      doc.text(liberationExposure, 216, beginTextHeight + 33 + rowPosition * 4);
      doc.text(
        responsibleForLiberating,
        246,
        beginTextHeight + 33 + rowPosition * 4
      );
    }

    // Observations section (on every page)
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Observações", 154, 172 + 6, { align: "center" });
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      "Para liberação dos rejeitos líquidos é realizada a medida da taxa de exposição com o detector de radiação Geiger-Muller. O valor da taxa de exposição para liberação do",
      15,
      172 + 12
    );
    doc.text(
      "rejeito deve ser igual ao valor da taxa de exposição ambiente (0,02mR/h). Todos os rejeitos líquidos são monitorados antes de serem desprezados, como descrito no",
      15,
      172 + 16
    );
    doc.text(
      "Plano de Proteção Radiológica (PPR), seguindo as Normas da CNEN.",
      15,
      172 + 20
    );
    doc.roundedRect(10, 172, 278, 26, 2, 2, "S");

    // Page numbers
    doc.text(`${pageNum}/${totalPages}`, 280, 196);
  }

  // Generate filename and save
  const currentMonth =
    filterMonth.value?.label || format(new Date(), "MMMM", { locale: ptBR });
  doc.save(
    `${facility.value.name} - Gerenciamento de Rejeito Líquido - ${currentMonth}.pdf`
  );
};

const confirmDownloadFacilityDocument = async () => {
  showResponsibleModal.value = true;
  await downloadReport();
};

const exportAllData = () => {
  const rows = [
    [
      "Data",
      "Isótopo",
      "Local",
      "Atividade do Rejeito (mCi)",
      "Volume (ml)",
      "Responsável",
      "Previsão de Liberação PPR",
      "Estimativa de Liberação",
      "Data de Liberação",
      "Exposição na Liberação(mR/h)",
      "Responsável pela Liberação",
    ],
  ];

  const filterYear = parse(
    filterDate.value,
    "MM/yyyy",
    new Date()
  ).getFullYear();

  filteredLiquidWasteManagementList.value.forEach((item) => {
    const itemDate = parseISO(item.date);
    if (getYear(itemDate) !== filterYear) {
      return;
    }

    const formattedDate = format(itemDate, "dd/MM/yy");

    let liberationDate = "";
    let responsibleForLiberating = "";
    if (item.responsibleForLiberating) {
      liberationDate = item.liberationDate
        ? format(parseISO(item.liberationDate), "dd/MM/yy")
        : "";
      responsibleForLiberating = item.responsibleForLiberating.name || "";
    }

    const localization = item.localization || "";

    let liberationExposure = "";
    if (liberationDate) {
      liberationExposure = "<0.02";
    }

    rows.push([
      formattedDate,
      localization,
      item.radioisotope || "",
      item.activity || "",
      item.volume || "",
      item.responsibleForClosing?.name || "",
      item.radiationPlanLiberationPrevision
        ? format(parseISO(item.radiationPlanLiberationPrevision), "dd/MM/yy")
        : "",
      item.calculatedLiberationPrevision
        ? format(parseISO(item.calculatedLiberationPrevision), "dd/MM/yy")
        : "",
      liberationDate,
      liberationExposure,
      responsibleForLiberating,
    ]);
  });

  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  rows.forEach((rowArray) => {
    const row = rowArray.join(";");
    csvContent += row + "\r\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);

  const currentMonth =
    filterMonth.value?.label || format(new Date(), "MMMM", { locale: ptBR });

  link.setAttribute(
    "download",
    `${facility.value.name} - Gerenciamento de Rejeito Líquido - ${currentMonth}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(async () => {
  loadData();
  loadFacility();
  loadResponsibles();
  const currentMonth = format(new Date(), "MM");
  filterMonth.value = filterMonthOptions.value.find(
    (m) => m.value === currentMonth
  );
});

watch(
  () => route.params,
  () => {
    loadData();
  },
  { deep: true }
);

watch(
  () => filterDate.value,
  async () => {
    await loadData();
  },
  { deep: true }
);

watch(
  filterStatus,
  async () => {
    await loadData();
  },
  { deep: true }
);

const handleDateChange = (newDate) => {
  // Make sure filterDate.value is updated before calling loadData
  filterDate.value = newDate;
  loadData();
};
</script>

<style>
.date-picker {
  width: 100%;
}
</style>
