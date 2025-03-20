<template>
  <Layout title="Gerenciamento de Rejeitos Sólidos">
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
      <span
        class="text-gray-500 hover:text-teal-800 hover:underline italic font-semibold"
      >
        Gerenciamento de Rejeitos Sólidos
      </span>
    </template>

    <template #header>
      <div class="flex gap-2 items-center">
        <a
          href="/static/img/como-preencher-etiqueta.png"
          target="_blank"
          @click="downloadHowToFill"
          class="text-teal-700 flex items-center gap-2 hover:text-teal-900 hover:underline mr-3"
        >
          <FontAwesomeIcon icon="fa-solid fa-tag" />Como preencher a etiqueta?
        </a>

        <button
          @click="exportAllData"
          class="bg-gray-200 hover:bg-gray-300 transition-colors duration-300 text-gray-700 px-4 py-2 rounded-md"
          title="exportar"
        >
          <FontAwesomeIcon icon="fa-solid fa-download" />
        </button>

        <router-link
          v-if="permission.canCreateSolidWasteManagement(currentUser)"
          :to="`/facility/${
            facility._id
          }/routines/solidwastemanagement/register/${
            parseFloat(tagNumber) + 1
          }`"
          class="bg-green-600 text-nowrap text-white hover:bg-green-700 transition-colors duration-300 px-4 py-2 rounded-md"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="mr-2" /> Adicionar
        </router-link>
      </div>
    </template>

    <div class="flex flex-col gap-6 w-full mb-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <label
              class="block text-sm font-medium text-nowrap text-gray-700 mb-1"
            >
              Status:
            </label>
            <select
              v-model="filterStatus"
              class="p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option
                v-for="option in filterStatusOptions"
                :key="option.value"
                :value="option"
              >
                {{ option.label }}
              </option>
            </select>
            <div
              v-if="
                !!responsibleOptions.length &&
                filteredSolidWasteManagementList.length
              "
              class="flex items-center gap-2"
            >
              <label
                class="block text-sm font-medium text-nowrap text-gray-700 mb-1"
              >
                Responsável:
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
          v-if="!!filteredSolidWasteManagementList.length"
          :columns="columns"
          :data="filteredSolidWasteManagementList"
          :total-items="filteredSolidWasteManagementList.length"
          v-model:loading="loading"
          v-model:per-page="perPage"
          v-model:current-page="currentPage"
        >
          <template #cell-closingDate="{ row }">
            {{ formatDate(row.closingDate) }}
          </template>
          <template #cell-tagNumber="{ row }">
            <span class="font-medium">{{ row.tagNumber }}</span>
          </template>
          <template #cell-exposure="{ row }">
            {{
              row.exposure === "Saturação"
                ? "Saturação"
                : parseFloat(row.exposure).toFixed(3)
            }}
          </template>
          <template #cell-weight="{ row }">
            {{ parseFloat(row.weight).toFixed(2) }}
          </template>
          <template #cell-activity="{ row }">
            {{
              row.activity === "< 0.001"
                ? "< 0.001"
                : parseFloat(row.activity).toFixed(3)
            }}
          </template>
          <template #cell-radiationPlanLiberationPrevision="{ row }">
            {{ formatDate(row.radiationPlanLiberationPrevision) }}
          </template>
          <template #cell-calculatedLiberationPrevision="{ row }">
            {{ formatDate(row.calculatedLiberationPrevision) }}
          </template>
          <template #cell-actions="{ row }">
            <div class="flex gap-2 justify-end">
              <router-link
                :to="`/facility/${facility._id}/routines/solidwastemanagement/edit/${row._id}`"
                class="text-blue-600 hover:text-blue-800"
              >
                <FontAwesomeIcon icon="fa-solid fa-edit" />
              </router-link>
            </div>
          </template>
        </Table>
        <div v-else class="p-4 text-center text-gray-500">
          Nenhum resultado encontrado
        </div>
      </div>

      <div
        v-if="!!filteredSolidWasteManagementList.length"
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
import { ref, computed, watch, onMounted } from "vue";
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
import JsPDF from "jspdf";
import Layout from "@/components/common/Layout.vue";
import Table from "@/components/dashboard/Table.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import { api } from "@/services/api";
import Input from "@/components/ui/Input.vue";
import { truncate, addLabelAndInformation, addReportLogo } from "../common.js";

// Router setup
const route = useRoute();
const router = useRouter();

// State variables
const facility = ref({});
const solidWasteManagementList = ref([]);
const filterDate = ref(format(new Date(), "MM/yyyy"));
const filterStatus = ref({ label: "Todos", value: "all" });
const filterLocalization = ref({ label: "Todos locais", value: "all" });
const filterMonth = ref(null);
const currentUser = ref(auth.currentUser());
const loading = ref(true);
const errors = ref("");
const tagNumber = ref("0");
const perPage = ref(10);
const currentPage = ref(1);
const showResponsibleModal = ref(false);
const selectedResponsible = ref(null);
const responsibleOptions = ref([]);

// Filter options
const filterStatusOptions = ref([
  { label: "Todos", value: "all" },
  { label: "Liberados", value: "open" },
  { label: "Armazenamento", value: "closed" },
]);

const filterLocalizationOptions = ref([
  { label: "Todos locais", value: "all" },
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

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  return format(parseISO(dateString), "dd/MM/yy");
};

// Table columns
const columns = ref([
  { id: "tagNumber", header: "Etiqueta", accessorKey: "tagNumber" },
  { id: "localization", header: "Local", accessorKey: "localization" },
  { id: "radioisotope", header: "Isótopo", accessorKey: "radioisotope" },
  { id: "weight", header: "Peso (kg)", accessorKey: "weight" },
  { id: "exposure", header: "Exposição (μSv/h/m)", accessorKey: "exposure" },
  { id: "activity", header: "Atividade (μCi)", accessorKey: "activity" },
  {
    id: "radiationPlanLiberationPrevision",
    header: "Previsão (RPR)",
    accessorKey: "radiationPlanLiberationPrevision",
  },
  {
    id: "calculatedLiberationPrevision",
    header: "Previsão",
    accessorKey: "calculatedLiberationPrevision",
  },
  { id: "actions", header: "Ações", accessorKey: "actions" },
]);

// Computed properties
const filteredSolidWasteManagementList = computed(() => {
  if (!Array.isArray(solidWasteManagementList.value)) {
    return [];
  }

  // Parse the filter date
  const yearFilter = parse(filterDate.value, "MM/yyyy", new Date());

  let filtered = solidWasteManagementList.value.filter((item) => {
    const itemDate = parseISO(item.date);
    const matchesDate =
      getYear(itemDate) === getYear(yearFilter) &&
      getMonth(itemDate) === getMonth(yearFilter);

    // Filter by status
    if (filterStatus.value.value !== "all") {
      if (filterStatus.value.value === "open" && item.liberationDate)
        return false;
      if (filterStatus.value.value === "closed" && !item.liberationDate)
        return false;
    }

    // Filter by localization
    if (
      filterLocalization.value.value !== "all" &&
      item.localization !== filterLocalization.value.value
    ) {
      return false;
    }

    return matchesDate;
  });

  return filtered;
});

// Methods
const loadData = async () => {
  loading.value = true;

  try {
    // Extract year and month for filtering
    const yearFilter = parse(filterDate.value, "MM/yyyy", new Date());

    // Create filters consistent with other components
    const filters = {
      status: filterStatus.value.value,
      localization: filterLocalization.value.value,
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

    // Load solid waste management data
    const wasteResponse = await api.get(
      `/facility/${route.params.id}/routines/solidWasteManagement/`,
      {
        params: { filters: JSON.stringify(filters) },
      }
    );

    if (wasteResponse.data.length === 0) {
      solidWasteManagementList.value = [];
      tagNumber.value = "0";
    } else {
      solidWasteManagementList.value = wasteResponse.data;

      // Get last tag number and update localizations filter
      let max = 0;
      const locations = new Set();

      wasteResponse.data.forEach((item) => {
        if (parseInt(item.tagNumber) > max) {
          max = parseInt(item.tagNumber);
        }

        if (item.localization) {
          locations.add(item.localization);
        }
      });

      tagNumber.value = max.toString();

      // Update localization options
      filterLocalizationOptions.value = [
        { label: "Todos locais", value: "all" },
        ...Array.from(locations).map((loc) => ({ label: loc, value: loc })),
      ];
    }
  } catch (error) {
    errors.value = error.data || error.message;
    solidWasteManagementList.value = [];
  } finally {
    loading.value = false;
  }
};

const loadFacility = async () => {
  try {
    const response = await api.get(`/facility/${route.params.id}`);
    facility.value = response.data;
    currentUser.value = auth.currentUser();
  } catch (error) {
    errors.value = error.data || error.message;
    facility.value = "";
  }
};

const downloadHowToFill = () => {
  document.getElementById("como-preencher").click();
};

const loadResponsibles = async () => {
  try {
    const response = await api.get(`/users/`);

    if (!response.data || response.data.length === 0) {
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

const downloadReport = async () => {
  // Create PDF document (landscape mode)
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
  const filteredData = filteredSolidWasteManagementList.value.filter((item) => {
    const itemDate = parseISO(item.date);
    const itemMonth = getMonth(itemDate);
    return (
      getYear(itemDate) === yearFilter &&
      itemMonth === parseInt(filterMonth.value?.value) - 1
    );
  });

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

    // Use the common logo method
    addReportLogo(doc, 182, 12, 74, 20);

    // Title section
    doc.roundedRect(10, beginRoundedRect, 160, 22, 2, 2, "S");
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(
      "Relatório de Gerenciamento de Rejeitos Sólidos",
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
      truncate(facility.value.companyName, 43)
    );
    addLabelAndInformation(
      doc,
      75,
      beginTextHeight,
      "Mês:",
      filterMonth.value?.label
    );
    addLabelAndInformation(
      doc,
      125,
      beginTextHeight,
      "Responsável:",
      selectedResponsible.value?.name
    );

    // Table headers
    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.text("Etiqueta", 15, beginTextHeight + 28);
    doc.text("Local", 35, beginTextHeight + 28);
    doc.text("Isótopo", 65, beginTextHeight + 28);
    doc.text("Peso (kg)", 95, beginTextHeight + 28);
    doc.text("Exposição", 125, beginTextHeight + 25);
    doc.text("(μSv/h/m)", 125, beginTextHeight + 28);
    doc.text("Atividade", 155, beginTextHeight + 25);
    doc.text("(μCi)", 155, beginTextHeight + 28);
    doc.text("Previsão (RPR)", 185, beginTextHeight + 28);
    doc.text("Previsão (Est.)", 225, beginTextHeight + 28);
    doc.text("Data Liberação", 260, beginTextHeight + 28);

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

      const rprDate = item.radiationPlanLiberationPrevision
        ? format(parseISO(item.radiationPlanLiberationPrevision), "dd/MM/yy")
        : "";

      const estDate = item.calculatedLiberationPrevision
        ? format(parseISO(item.calculatedLiberationPrevision), "dd/MM/yy")
        : "";

      // Format values
      const exposureDisplay =
        item.exposure === "Saturação"
          ? "Saturação"
          : parseFloat(item.exposure).toFixed(3);

      const activityDisplay =
        item.activity === "< 0.001"
          ? "< 0.001"
          : parseFloat(item.activity).toFixed(3);

      // Render row data
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.text(
        item.tagNumber || "",
        15,
        beginTextHeight + 33 + rowPosition * 4
      );
      doc.text(
        item.localization || "",
        35,
        beginTextHeight + 33 + rowPosition * 4
      );
      doc.text(
        item.radioisotope || "",
        65,
        beginTextHeight + 33 + rowPosition * 4
      );
      doc.text(
        parseFloat(item.weight || 0).toFixed(2),
        95,
        beginTextHeight + 33 + rowPosition * 4
      );
      doc.text(exposureDisplay, 125, beginTextHeight + 33 + rowPosition * 4);
      doc.text(activityDisplay, 155, beginTextHeight + 33 + rowPosition * 4);
      doc.text(rprDate, 185, beginTextHeight + 33 + rowPosition * 4);
      doc.text(estDate, 225, beginTextHeight + 33 + rowPosition * 4);
      doc.text(liberationDate, 260, beginTextHeight + 33 + rowPosition * 4);
    }

    // Observations section (on every page)
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Observações", 154, 172 + 6, { align: "center" });
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      "Os rejeitos são monitorados diariamente e, após atingirem o valor de exposição ambiente, têm sua etiqueta de identificação conferida, são monitorados novamente",
      15,
      172 + 12
    );
    doc.text(
      "e liberados. Os resíduos sólidos contaminados são descartados conforme determina a norma CNEN NN 8.01.",
      15,
      172 + 16
    );
    doc.roundedRect(10, 172, 278, 20, 2, 2, "S");

    // Page numbers
    doc.text(`${pageNum}/${totalPages}`, 280, 196);
  }

  // Generate filename and save
  const currentMonth =
    filterMonth.value?.label || format(new Date(), "MMMM", { locale: ptBR });
  doc.save(
    `${facility.value.name} - Gerenciamento de Rejeito Sólido - ${currentMonth}.pdf`
  );
};

const confirmDownloadFacilityDocument = async () => {
  await loadResponsibles();
  await downloadReport();
  showResponsibleModal.value = false;
};

const exportAllData = () => {
  // Create CSV export
  const rows = [
    [
      "Etiqueta",
      "Data",
      "Local",
      "Isótopo",
      "Peso (kg)",
      "Exposição (μSv/h/m)",
      "Atividade (μCi)",
      "Previsão (RPR)",
      "Previsão (Calculada)",
      "Data Liberação",
      "Responsável",
    ],
  ];

  // Extract parts from the filter date
  const yearFilter = parse(filterDate.value, "MM/yyyy", new Date());
  const filterYear = getYear(yearFilter);
  const filterMonth = getMonth(yearFilter);

  filteredSolidWasteManagementList.value.forEach((item) => {
    const itemDate = parseISO(item.date);

    // Only include items from the filtered year and month
    if (
      getYear(itemDate) !== filterYear ||
      getMonth(itemDate) !== filterMonth
    ) {
      return;
    }

    const formattedDate = format(itemDate, "dd/MM/yy");

    const rprDate = item.radiationPlanLiberationPrevision
      ? format(parseISO(item.radiationPlanLiberationPrevision), "dd/MM/yy")
      : "";

    const estDate = item.calculatedLiberationPrevision
      ? format(parseISO(item.calculatedLiberationPrevision), "dd/MM/yy")
      : "";

    const liberationDate = item.liberationDate
      ? format(parseISO(item.liberationDate), "dd/MM/yy")
      : "";

    const exposureDisplay =
      item.exposure === "Saturação"
        ? "Saturação"
        : parseFloat(item.exposure).toFixed(3);

    const activityDisplay =
      item.activity === "< 0.001"
        ? "< 0.001"
        : parseFloat(item.activity).toFixed(3);

    rows.push([
      item.tagNumber || "",
      formattedDate,
      item.localization || "",
      item.radioisotope || "",
      item.weight ? parseFloat(item.weight).toFixed(2) : "",
      exposureDisplay,
      activityDisplay,
      rprDate,
      estDate,
      liberationDate,
      item.responsibleForClosing?.name || "",
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

  const monthName = format(
    parse(filterDate.value, "MM/yyyy", new Date()),
    "MMMM yyyy",
    { locale: ptBR }
  );
  link.setAttribute(
    "download",
    `${facility.value.name} - Gerenciamento de Rejeito Sólido - ${monthName}.csv`
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  },
  { deep: true }
);

// Watch for status filter changes
watch(
  filterStatus,
  async () => {
    await loadData();
  },
  { deep: true }
);

// Watch for localization filter changes
watch(
  filterLocalization,
  async () => {
    await loadData();
  },
  { deep: true }
);
</script>

<style>
.date-picker {
  width: 100%;
}
</style>
