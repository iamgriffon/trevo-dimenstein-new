<template>
  <Layout :title="pageTitle" :loading="loading">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}`"
        class="px-2 text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name || "Instalação" }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/equipments/${equipment.typeId}/${equipment._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ pageTitle }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800 select-none">Reprodutibilidade</span>
    </template>
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex space-x-2">
          <router-link
            class="flex items-center gap-2 px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
            :to="`/equipments/${equipment.typeId}/${equipmentId}`"
          >
            <FontAwesomeIcon :icon="['fas', 'arrow-left']" />
            <span class="hidden md:inline">Voltar</span>
          </router-link>
          <Button
            @click="generateDocument"
            class="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg"
            :disabled="!filteredReproductibilityTestList.length"
          >
            <FontAwesomeIcon :icon="['fas', 'download']" class="md:mr-2" />
            <span class="hidden md:inline text-nowrap">Gerar Relatório</span>
          </Button>
          <router-link
            v-if="permission.canCreateDocuments(currentUser)"
            class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300"
            :to="`/equipments/geigerCounter/${equipmentId}/reproductibility/register`"
          >
            <FontAwesomeIcon icon="fa-solid fa-plus" class="md:mr-2" />
            <span class="hidden md:inline text-nowrap">Adicionar</span>
          </router-link>
        </div>
      </div>
    </template>

    <div class="mb-6 p-6 bg-white rounded-lg shadow-md">
      <h3 class="text-lg font-semibold mb-4">Filtros</h3>
      <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <Select
          label="Filtrar por Ano"
          v-model="filterYear"
          :options="yearOptions"
          placeholder="Selecione o Ano"
          class="w-full md:w-1/3"
          :icon="['fas', 'calendar-alt']"
        />
        <Select
          label="Filtrar por Sonda"
          v-model="filterProbe"
          :options="probeOptions"
          placeholder="Selecione a Sonda"
          class="w-full md:w-1/3"
          :icon="['fas', 'wave-square']"
        />
      </div>
    </div>

    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <div v-else>
      <Table
        v-if="filteredReproductibilityTestList.length > 0"
        :data="filteredReproductibilityTestList"
        :columns="columns"
        :refreshData="loadInitialData"
        v-model:perPage="perPage"
        v-model:currentPage="page"
        :totalItems="filteredReproductibilityTestList.length"
        :show-header="true"
        :show-footer="true"
        @row-click="handleRowClick"
      />
      <div
        v-else
        class="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md"
      >
        <p>
          Nenhum teste de reprodutibilidade encontrado para os filtros
          selecionados.
        </p>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import axios from "axios";
import moment from "moment";
import JsPDF from "jspdf";
import "jspdf-autotable"; // Import autoTable plugin
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import logoRad from "@/assets/logo_rad.png";

import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Table from "@/components/dashboard/Table.vue";
import Select from "@/components/ui/Select.vue";
import Button from "@/components/ui/Button.vue";
import {
  createActionButtonsCell,
  createDateCell,
  createStatusCell,
  createTextCell,
} from "@/utils/tableCells"; // Import table cell utilities

const route = useRoute();
const router = useRouter();

// State
const facility = ref({});
const equipment = ref({});
const tests = ref([]);
const loading = ref(true);
const error = ref("");
const currentUser = ref(auth.currentUser() || {});
const perPage = ref(10);
const page = ref(1);

// Filters
const filterYear = ref(new Date().getFullYear().toString());
const filterProbe = ref("");
const yearOptions = ref([]);
const probeOptions = ref([]);

// Computed Properties
const equipmentId = computed(() => route.params.id);

const pageTitle = computed(() => {
  if (!equipment.value.type) return "Equipamento";
  const patrimonial = equipment.value.patrimonialNumber || "";
  const serial = equipment.value.serialNumber || "";
  const separator = patrimonial && serial ? " - " : "";
  return `${equipment.value.type} ${patrimonial}${separator}${serial}`.trim();
});

const filteredReproductibilityTestList = computed(() => {
  if (!tests.value) return [];
  return tests.value
    .filter((test) => {
      const yearMatch =
        !filterYear.value ||
        moment(test.date).format("YYYY") === filterYear.value;
      const probeMatch = !filterProbe.value || test.probe === filterProbe.value;
      return yearMatch && probeMatch;
    })
    .sort((a, b) => moment(b.date).diff(moment(a.date))); // Sort descending by date
});

// Table Definition - Refactored
const columns = [
  {
    accessorKey: "date",
    header: "Data",
    cell: (info) => createDateCell(info),
    meta: { sortable: true },
  },
  {
    accessorKey: "month",
    header: "Mês",
    cell: (info) => createTextCell(info),
  },
  {
    accessorKey: "probe",
    header: "Sonda",
    cell: (info) => createTextCell(info),
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
            to: `/equipments/geigerCounter/${equipmentId.value}/reproductibility/${info.row.original._id}`,
            title: "Informações",
          },
        },
        // Add other actions like Edit/Delete if needed, conditionally
      ];
      return createActionButtonsCell(info, actions);
    },
  },
];

// Methods
const loadInitialData = async () => {
  loading.value = true;
  error.value = "";
  try {
    // Fetch Equipment
    const equipResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    equipment.value = equipResponse.data;

    if (!equipment.value?.facility?._id) {
      throw new Error("ID da instalação não encontrado no equipamento.");
    }

    // Fetch Facility
    const facResponse = await axios.get(
      auth.apiUrl() + `facility/${equipment.value.facility._id}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    facility.value = facResponse.data;

    // Fetch Tests
    const testsResponse = await axios.get(
      auth.apiUrl() +
        `equipment/${equipmentId.value}/geigerCounterReproductibilityTests/`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    tests.value = testsResponse.data || [];

    // Populate Filter Options
    const years = new Set();
    const probes = new Set();
    tests.value.forEach((test) => {
      years.add(moment(test.date).format("YYYY"));
      if (test.probe) probes.add(test.probe);
    });
    yearOptions.value = Array.from(years)
      .sort()
      .reverse()
      .map((year) => ({ value: year, label: year }));
    probeOptions.value = Array.from(probes)
      .sort()
      .map((probe) => ({ value: probe, label: probe }));

    // Set default probe filter if not already set and options are available
    if (!filterProbe.value && probeOptions.value.length > 0) {
      filterProbe.value = probeOptions.value[0].value;
    }
    // Ensure default year filter is valid
    if (!yearOptions.value.some((opt) => opt.value === filterYear.value)) {
      filterYear.value = yearOptions.value[0]?.value || "";
    }
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    error.value = err.message || "Falha ao carregar dados.";
    tests.value = [];
    equipment.value = {};
    facility.value = {};
  } finally {
    loading.value = false;
  }
};

const handleRowClick = (item) => {
  // Check if the click was on an action button within the row
  // This might require the Table component or createActionButtonsCell to emit an event or stop propagation
  // For now, assume clicking anywhere on the row navigates
  router.push({
    name: "GeigerReproductibilityView", // Adjust route name if needed
    params: { id: equipmentId.value, testId: item._id },
  });
};

// PDF Generation Helpers (Adapted from original)
const addLabelAndInformation = (
  doc,
  x,
  y,
  label,
  information,
  fontSizeLabel = 8,
  fontSizeInfo = 10
) => {
  const spaceBetweenInformationAndLabel = 5;
  doc.setFontSize(fontSizeLabel);
  doc.setFont("helvetica", "bold");
  doc.text(label, x, y);
  doc.setFontSize(fontSizeInfo);
  doc.setFont("helvetica", "normal");
  doc.text(information || "", x, y + spaceBetweenInformationAndLabel);
};

const truncate = (str, n) => {
  if (!str) return "";
  return str.length > n ? str.substr(0, n - 3) + "..." : str;
};

// PDF Generation Main Function
const generateDocument = () => {
  if (filteredReproductibilityTestList.value.length === 0) {
    alert(
      "Nenhum teste encontrado para gerar o relatório com os filtros atuais."
    );
    return;
  }

  const doc = new JsPDF("l", "pt", "a4"); // Use points for better control
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // Header
  doc.setFillColor(230, 230, 230); // Light gray background
  doc.rect(margin, margin, pageWidth - 2 * margin, 50, "F");
  doc.addImage(logoRad, "PNG", margin + 10, margin + 5, 150, 40); // Adjust size/position
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Relatório de Reprodutibilidade", pageWidth / 2, margin + 30, {
    align: "center",
  });

  // Information Section
  let currentY = margin + 60;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Informações Gerais", margin, currentY + 15);
  currentY += 30;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const colWidth = (pageWidth - 2 * margin) / 3;
  addLabelAndInformation(
    doc,
    margin,
    currentY,
    "Instalação:",
    facility.value.name,
    8,
    9
  );
  addLabelAndInformation(
    doc,
    margin + colWidth,
    currentY,
    "Equipamento:",
    equipment.value.type,
    8,
    9
  );
  addLabelAndInformation(
    doc,
    margin + 2 * colWidth,
    currentY,
    "Marca/Modelo:",
    `${equipment.value.manufacturer || ""}/${equipment.value.model || ""}`,
    8,
    9
  );
  currentY += 25;
  addLabelAndInformation(
    doc,
    margin,
    currentY,
    "Localização:",
    equipment.value.localization,
    8,
    9
  );
  addLabelAndInformation(
    doc,
    margin + colWidth,
    currentY,
    "Nº Série:",
    equipment.value.serialNumber,
    8,
    9
  );
  addLabelAndInformation(
    doc,
    margin + 2 * colWidth,
    currentY,
    "Nº Patrimonial:",
    equipment.value.patrimonialNumber,
    8,
    9
  );
  currentY += 25;
  addLabelAndInformation(
    doc,
    margin,
    currentY,
    "Sonda Selecionada:",
    filterProbe.value,
    8,
    9
  );
  const selectedProbeSerial =
    filterProbe.value === "Exposição"
      ? equipment.value.exposureProbeSerialNumber
      : filterProbe.value === "Contaminação"
      ? equipment.value.contaminationProbeSerialNumber
      : "";
  addLabelAndInformation(
    doc,
    margin + colWidth,
    currentY,
    "Nº Série Sonda:",
    selectedProbeSerial,
    8,
    9
  );

  // Table
  currentY += 40;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Testes de Reprodutibilidade (${filterYear.value} - Sonda: ${filterProbe.value})`,
    margin,
    currentY
  );
  currentY += 15;

  const tableData = filteredReproductibilityTestList.value.map((test) => [
    moment(test.date).format("DD/MM/YYYY"),
    test.month,
    test.tests?.length || 0,
    test.media?.toFixed(2) ?? "N/A",
    test.desvioPadrao?.toFixed(2) ?? "N/A",
    test.coeficienteVariacao?.toFixed(2) ?? "N/A",
    test.fatorNormalizacao?.toFixed(2) ?? "N/A",
    test.conclusion,
    test.responsible?.name || "-",
  ]);

  doc.autoTable({
    startY: currentY,
    head: [
      [
        "Data",
        "Mês",
        "Nº Leituras",
        "Média",
        "DP",
        "CV (%)",
        "FN",
        "Conclusão",
        "Responsável",
      ],
    ],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      // Adjust column widths if needed
    },
    margin: { left: margin, right: margin },
  });

  // Footer or signature section can be added here

  // Save
  doc.save(
    `Relatorio_Reprodutibilidade_${equipment.value.type || "Equip"}_${
      filterProbe.value
    }_${filterYear.value}.pdf`
  );
};

// Lifecycle Hook
onMounted(() => {
  loadInitialData();
});
</script>

<style scoped>
/* Remove the old style block as it's likely no longer needed with Tailwind */
</style>
