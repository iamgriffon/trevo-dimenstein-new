<template>
  <Layout :title="`Teste Diário`" :loading="loading">
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
        :to="`/equipments/doseCalibrator/${equipmentId}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ equipmentTitleShort }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800 select-none">Teste Diário</span>
    </template>

    <template #header>
      <div class="flex gap-2">
        <router-link
          class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300"
          :to="registerLink"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" />
          <span class="hidden md:inline">Adicionar</span>
        </router-link>

        <button
          v-if="tests.length > 0"
          @click="reportModal = true"
          class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
        >
          <FontAwesomeIcon icon="fa-solid fa-download" />
          <span class="hidden md:inline">Relatório Mensal</span>
        </button>
      </div>
    </template>

    <div class="p-4 md:p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <div>
          <h1 class="text-xl font-semibold">{{ equipmentTitle }}</h1>
          <h2 class="text-lg text-gray-600">Teste Diário</h2>
        </div>
      </div>

      <!-- Filters -->
      <div
        class="flex flex-wrap items-center space-x-2 md:space-x-4 mb-6 bg-white p-4 rounded shadow-md"
      >
        <label class="flex items-center text-sm font-medium text-gray-700">
          <FontAwesomeIcon :icon="['fas', 'filter']" class="mr-2" /> Filtrar
          por:
        </label>
        <div class="flex items-center space-x-2">
          <label for="filterYear" class="text-sm">Ano:</label>
          <select
            id="filterYear"
            v-model="filterYear"
            class="shadow-sm border border-gray-300 rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option v-for="year in filterYearOptions" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div class="flex items-center space-x-2">
          <label for="filterMonth" class="text-sm">Mês:</label>
          <select
            id="filterMonth"
            v-model="filterMonth"
            class="shadow-sm border border-gray-300 rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option
              v-for="month in filterMonthOptions"
              :key="month.value"
              :value="month.value"
            >
              {{ month.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading / Error / No Data -->

      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
      <div
        v-if="!loading && filteredTestsList.length === 0 && !error"
        class="text-center text-gray-500 mt-8"
      >
        Nenhum teste diário encontrado para o período selecionado.
      </div>

      <!-- Table -->
      <section class="mb-8">
        <Table
          v-if="!loading && filteredTestsList.length > 0"
          :data="filteredTestsList"
          :columns="tableColumns"
          :totalItems="filteredTestsList.length"
          v-model:currentPage="currentPage"
          v-model:perPage="perPage"
          footer-class="relative border-none w-full justify-center z-auto"
        />
      </section>

      <!-- Plots -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div
          class="bg-white p-4 rounded shadow-md h-96"
          v-if="plotPointsCo.length > 0"
        >
          <plotco
            class="w-full h-full"
            id="plot-co"
            :plot-points-co="plotPointsCo"
            :calculated-plot-co="calculatedPlotPointsCo"
            :calculated-plot-points-co-plus="calculatedPlotPointsCoPlus5"
            :calculated-plot-points-co-minus="calculatedPlotPointsCoMinus5"
          ></plotco>
        </div>
        <div
          class="bg-white p-4 rounded shadow-md h-96"
          v-if="plotPointsBa.length > 0"
        >
          <plotba
            class="w-full h-full"
            id="plot-ba"
            :plot-points-ba="plotPointsBa"
            :calculated-plot-ba="calculatedPlotPointsBa"
            :calculated-plot-points-ba-plus="calculatedPlotPointsBaPlus5"
            :calculated-plot-points-ba-minus="calculatedPlotPointsBaMinus5"
          ></plotba>
        </div>
        <div
          class="bg-white p-4 rounded shadow-md h-96"
          v-if="plotPointsCs.length > 0"
        >
          <plotcs
            class="w-full h-full"
            id="plot-cs"
            :plot-points-cs="plotPointsCs"
            :calculated-plot-cs="calculatedPlotPointsCs"
            :calculated-plot-points-cs-plus="calculatedPlotPointsCsPlus5"
            :calculated-plot-points-cs-minus="calculatedPlotPointsCsMinus5"
          ></plotcs>
        </div>
        <div
          class="bg-white p-4 rounded shadow-md h-96"
          v-if="plotPointsCsOnMostUsedRadioisotope.length > 0"
        >
          <plotcsomur
            class="w-full h-full"
            id="plot-csomur"
            :plot-points-cs-omur="plotPointsCsOnMostUsedRadioisotope"
            :calculated-plot-cs-omur="
              calculatedPlotPointsCsOnMostUsedRadioisotope
            "
            :calculated-plot-points-cs-omur-plus="
              calculatedPlotPointsCsOnMostUsedRadioisotopePlus5
            "
            :calculated-plot-points-cs-omur-minus="
              calculatedPlotPointsCsOnMostUsedRadioisotopeMinus5
            "
          ></plotcsomur>
        </div>
      </div>
    </div>

    <!-- Report Generation Modal -->
    <Modal
      v-model:visible="reportModal"
      title="Gerar Relatório Mensal"
      @update:visible="reportModal = false"
      @ok="downloadReport"
    >
      <section class="flex flex-col gap-4 justify-start mt-4">
        <div class="mb-4">
          <label
            for="reportMonth"
            class="text-sm font-medium text-gray-700 mb-1 min-w-full flex items-center"
          >
            <FontAwesomeIcon :icon="['fas', 'calendar-alt']" class="mr-2" />
            Mês:
          </label>
          <select
            id="reportMonth"
            v-model="reportMonth"
            class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
          >
            <option
              v-for="month in filterMonthOptions"
              :key="month.value"
              :value="month"
            >
              {{ month.label }}
            </option>
          </select>
        </div>

        <div class="justify-start mb-4" v-if="responsibleOptions.length > 0">
          <label
            for="reportResponsible"
            class="text-sm font-medium text-gray-700 mb-1 w-full flex items-center"
          >
            <FontAwesomeIcon :icon="['fas', 'user']" class="mr-2" />
            Responsável (Opcional):
          </label>
          <select
            id="reportResponsible"
            v-model="reportResponsible"
            class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
          >
            <option :value="{ name: '', _id: '' }">Selecione (opcional)</option>
            <option
              v-for="option in responsibleOptions"
              :key="option._id"
              :value="option"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <Button
          @click="downloadReport"
          class="bg-green-600 hover:bg-green-700 text-white font-bold w-full flex items-center justify-center px-4 py-2 -mt-4 rounded"
        >
          <FontAwesomeIcon icon="fa-solid fa-download" class="mr-2" />
          Gerar
        </Button>
      </section>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import moment from "moment-timezone";
import JsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Table from "@/components/dashboard/Table.vue";
import Layout from "@/components/common/Layout.vue";
import Modal from "@/components/common/Modal.vue";
import plotco from "./PlotCo.vue"; // Assuming .vue extension
import plotba from "./PlotBa.vue";
import plotcs from "./PlotCs.vue";
import plotcsomur from "./PlotCsOMUR.vue";
import { createActionButtonsCell } from "@/utils/tableCells";
import { cn } from "@/utils/cn";
import logoTrevo from "@/utils/logoTrevo";
const route = useRoute();
const router = useRouter();

const perPage = ref(10);
const currentPage = ref(1);

// Data refs
const facility = ref({});
const equipment = ref({});
const currentUser = ref({});
const tests = ref([]);
const loading = ref(true);
const error = ref(null);

// Filter refs
const filterYear = ref(route.params.year || new Date().getFullYear());
const filterMonth = ref(new Date().getMonth()); // 0-indexed month
const filterYearOptions = ref([]);
const filterMonthOptions = ref([
  { label: "Janeiro", value: 0 },
  { label: "Fevereiro", value: 1 },
  { label: "Março", value: 2 },
  { label: "Abril", value: 3 },
  { label: "Maio", value: 4 },
  { label: "Junho", value: 5 },
  { label: "Julho", value: 6 },
  { label: "Agosto", value: 7 },
  { label: "Setembro", value: 8 },
  { label: "Outubro", value: 9 },
  { label: "Novembro", value: 10 },
  { label: "Dezembro", value: 11 },
]);

// Report refs
const reportMonth = ref(filterMonthOptions.value[new Date().getMonth()]); // Default to current month object
const responsibleOptions = ref([]);
const reportResponsible = ref({ name: "", _id: "" });

// Plotting refs
const plotPointsCo = ref([]);
const calculatedPlotPointsCo = ref([]);
const calculatedPlotPointsCoPlus5 = ref([]);
const calculatedPlotPointsCoMinus5 = ref([]);
const plotPointsBa = ref([]);
const calculatedPlotPointsBa = ref([]);
const calculatedPlotPointsBaPlus5 = ref([]);
const calculatedPlotPointsBaMinus5 = ref([]);
const plotPointsCs = ref([]);
const calculatedPlotPointsCs = ref([]);
const calculatedPlotPointsCsPlus5 = ref([]);
const calculatedPlotPointsCsMinus5 = ref([]);
const plotPointsCsOnMostUsedRadioisotope = ref([]);
const calculatedPlotPointsCsOnMostUsedRadioisotope = ref([]);
const calculatedPlotPointsCsOnMostUsedRadioisotopePlus5 = ref([]);
const calculatedPlotPointsCsOnMostUsedRadioisotopeMinus5 = ref([]);

// Add this new ref for the modal
const reportModal = ref(false);

// Computed properties
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
  () => `/equipments/doseCalibrator/${equipmentId.value}/daily/register`
);

const filteredTestsList = computed(() => {
  return tests.value.filter((test) => {
    const testDate = moment(test.date);
    return (
      testDate.year() === Number(filterYear.value) &&
      testDate.month() === Number(filterMonth.value)
    );
  });
});

// Table Columns Definition
const formatDeviation = (deviation) => {
  const num = parseFloat(deviation);
  if (isNaN(num)) return "N/A";
  const formatted = num.toFixed(2) + "%";
  const isOutsideLimit = Math.abs(num) > 10; // Assuming 10% limit
  return {
    text: formatted,
    class: isOutsideLimit ? "text-red-600 font-bold" : "",
  };
};

const formatStatus = (value, status) =>
  `${value ?? "N/A"} (${status ?? "N/A"})`;

const tableColumns = [
  {
    header: "Data",
    accessorKey: "date",
    cell: (info) => moment(info.getValue()).format("DD/MM/YY"),
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: "Auto-zero (mV)",
    accessorKey: "autoZero",
    cell: (info) =>
      formatStatus(info.getValue(), info.row.original.autoZeroStatus),
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: "BG (µCi)",
    accessorKey: "bG",
    cell: (info) => formatStatus(info.getValue(), info.row.original.bGStatus),
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: "System Test (V)",
    accessorKey: "systemTest",
    cell: (info) =>
      formatStatus(info.getValue(), info.row.original.systemTestStatus),
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  { header: "Data Check", accessorKey: "dataCheckStatus" },
  {
    header: "Ativ. Co(57)",
    accessorKey: "sourceCoActivity",
    cell: (info) => info.getValue() ?? "N/A",
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: "Desvio Co(57)",
    accessorKey: "sourceCoActivityDeviation",
    cell: (info) => formatDeviation(info.getValue()).text,
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: "Ativ. Ba(133)",
    accessorKey: "sourceBaActivity",
    cell: (info) => info.getValue() ?? "N/A",
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: "Desvio Ba(133)",
    accessorKey: "sourceBaActivityDeviation",
    cell: (info) => formatDeviation(info.getValue()).text,
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: "Ativ. Cs(137)",
    accessorKey: "sourceCsActivity",
    cell: (info) => info.getValue() ?? "N/A",
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: "Desvio Cs(137)",
    accessorKey: "sourceCsActivityDeviation",
    cell: (info) => formatDeviation(info.getValue()).text,
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: `Ativ. Cs(137) em ${equipment?.value?.mostUsedRadioisotope || "?"}`,
    accessorKey: "sourceCsOnMostUsedRadioisotopeActivity",
    cell: (info) => info.getValue() ?? "N/A",
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: `Desvio Cs(137) em ${
      equipment?.value?.mostUsedRadioisotope || "?"
    }`,
    accessorKey: "sourceCsOnMostUsedRadioisotopeActivityDeviation",
    cell: (info) => formatDeviation(info.getValue()).text,
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: "Responsável",
    accessorKey: "responsible.name",
    cell: (info) => info.getValue() || "N/A",
    meta: {
      headerClass: "text-center px-4",
      cellClass: "text-center px-4",
    },
  },
  {
    header: "Remover",
    accessorKey: "actions",
    meta: {
      headerClass: "text-center px-4",
      cellClass: "flex items-center justify-center px-4",
    },
    cell: (info) => {
      const buttons = [
        {
          icon: "fa-solid fa-trash-alt",
          type: "button",
          iconClass: cn(
            !permission.canExcludeDocuments(currentUser.value) && "hidden"
          ),
          props: {
            onClick: () => exclude(info.row.original._id),
          },
        },
      ];
      return createActionButtonsCell(
        info,
        buttons,
        "flex items-center justify-center text-white hover:bg-red-800/80 bg-red-600 transition-all duration-300 rounded-full w-10 h-10"
      );
    },
  },
];

// Methods
const loadDailyTests = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Fetch Equipment & Facility first for context
    const equipResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    if (!equipResponse.data) throw new Error("Equipamento não encontrado.");
    equipment.value = equipResponse.data;

    if (!equipment.value.facility?._id)
      throw new Error("ID da Instalação não encontrado.");
    const facResponse = await axios.get(
      auth.apiUrl() + `facility/${equipment.value.facility._id}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    if (!facResponse.data) throw new Error("Instalação não encontrada.");
    facility.value = facResponse.data;

    const testsResponse = await axios.get(
      auth.apiUrl() +
        `equipment/${equipmentId.value}/doseCalibratorDailyTests/`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    const rawTests = testsResponse.data || [];
    tests.value = rawTests.sort(
      (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
    );

    const years = new Set();
    plotPointsCo.value = [];
    calculatedPlotPointsCo.value = [];
    calculatedPlotPointsCoPlus5.value = [];
    calculatedPlotPointsCoMinus5.value = [];
    plotPointsBa.value = [];
    calculatedPlotPointsBa.value = [];
    calculatedPlotPointsBaPlus5.value = [];
    calculatedPlotPointsBaMinus5.value = [];
    plotPointsCs.value = [];
    calculatedPlotPointsCs.value = [];
    calculatedPlotPointsCsPlus5.value = [];
    calculatedPlotPointsCsMinus5.value = [];
    plotPointsCsOnMostUsedRadioisotope.value = [];
    calculatedPlotPointsCsOnMostUsedRadioisotope.value = [];
    calculatedPlotPointsCsOnMostUsedRadioisotopePlus5.value = [];
    calculatedPlotPointsCsOnMostUsedRadioisotopeMinus5.value = [];

    tests.value.forEach((test) => {
      const testMoment = moment(test.date);
      years.add(testMoment.year());
      const testDate = testMoment.toDate(); // Use JS Date for plots

      // Helper to calculate activity
      const calculateActivity = (source, date) => {
        if (!source || !source.initialActivity || !source.initialActivityDate)
          return 0;
        const t = moment(date).diff(moment(source.initialActivityDate)); // Difference in milliseconds
        const halfLifeHours =
          source.radioisotope === "Co(57)"
            ? 6522.96
            : source.radioisotope === "Ba(133)"
            ? 92067.6
            : source.radioisotope === "Cs(137)" ||
              source.radioisotope?.includes("Cs(137) medido em")
            ? 264289.2
            : 0;
        if (halfLifeHours === 0) return 0;
        return (
          source.initialActivity *
          Math.exp(-((0.6931471806 * t) / (1000 * 60 * 60)) / halfLifeHours)
        );
      };

      // Co Plot Data
      if (test.sourceCoActivity != null)
        plotPointsCo.value.push({
          x: testDate,
          y: parseFloat(test.sourceCoActivity),
        });
      if (test.sourceCo) {
        const calculatedCo = calculateActivity(test.sourceCo, test.date);
        if (calculatedCo > 0) {
          calculatedPlotPointsCo.value.push({ x: testDate, y: calculatedCo });
          calculatedPlotPointsCoPlus5.value.push({
            x: testDate,
            y: calculatedCo * 1.05,
          });
          calculatedPlotPointsCoMinus5.value.push({
            x: testDate,
            y: calculatedCo * 0.95,
          });
        }
      }

      // Ba Plot Data
      if (test.sourceBaActivity != null)
        plotPointsBa.value.push({
          x: testDate,
          y: parseFloat(test.sourceBaActivity),
        });
      if (test.sourceBa) {
        const calculatedBa = calculateActivity(test.sourceBa, test.date);
        if (calculatedBa > 0) {
          calculatedPlotPointsBa.value.push({ x: testDate, y: calculatedBa });
          calculatedPlotPointsBaPlus5.value.push({
            x: testDate,
            y: calculatedBa * 1.05,
          });
          calculatedPlotPointsBaMinus5.value.push({
            x: testDate,
            y: calculatedBa * 0.95,
          });
        }
      }

      // Cs Plot Data
      if (test.sourceCsActivity != null)
        plotPointsCs.value.push({
          x: testDate,
          y: parseFloat(test.sourceCsActivity),
        });
      if (test.sourceCs) {
        const calculatedCs = calculateActivity(test.sourceCs, test.date);
        if (calculatedCs > 0) {
          calculatedPlotPointsCs.value.push({ x: testDate, y: calculatedCs });
          calculatedPlotPointsCsPlus5.value.push({
            x: testDate,
            y: calculatedCs * 1.05,
          });
          calculatedPlotPointsCsMinus5.value.push({
            x: testDate,
            y: calculatedCs * 0.95,
          });
        }
      }

      // Cs Measured Plot Data
      if (test.sourceCsOnMostUsedRadioisotopeActivity != null)
        plotPointsCsOnMostUsedRadioisotope.value.push({
          x: testDate,
          y: parseFloat(test.sourceCsOnMostUsedRadioisotopeActivity),
        });
      if (test.sourceCsOnMostUsedRadioisotope) {
        const calculatedCsMeas = calculateActivity(
          test.sourceCsOnMostUsedRadioisotope,
          test.date
        );
        if (calculatedCsMeas > 0) {
          calculatedPlotPointsCsOnMostUsedRadioisotope.value.push({
            x: testDate,
            y: calculatedCsMeas,
          });
          calculatedPlotPointsCsOnMostUsedRadioisotopePlus5.value.push({
            x: testDate,
            y: calculatedCsMeas * 1.05,
          });
          calculatedPlotPointsCsOnMostUsedRadioisotopeMinus5.value.push({
            x: testDate,
            y: calculatedCsMeas * 0.95,
          });
        }
      }
    });
    filterYearOptions.value = Array.from(years).sort((a, b) => b - a); // Sort years descending
    // Ensure filterYear is valid
    if (!filterYearOptions.value.includes(Number(filterYear.value))) {
      filterYear.value = filterYearOptions.value[0] || new Date().getFullYear();
    }

    // Fetch Responsible Users for Report
    if (permission.canSeeWhoSigned(currentUser.value)) {
      const usersResponse = await axios.get(auth.apiUrl() + "users/", {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });
      const allUsers = usersResponse.data || [];
      responsibleOptions.value = allUsers
        .filter((user) => user.type === "rad fisico")
        .map((user) => ({ label: user.name, name: user.name, _id: user._id }));
    }
  } catch (err) {
    console.error("Erro ao carregar testes diários:", err);
    error.value = err.message || "Falha ao carregar dados.";
  } finally {
    loading.value = false;
  }
};

const exclude = async (id) => {
  if (confirm("Tem certeza que deseja excluir este teste?")) {
    try {
      await auth.excludeDoseCalibratorDailyTest({ _id: id });
      await loadDailyTests(); // Reload list after exclusion
    } catch (err) {
      console.error("Erro ao excluir teste diário:", err);
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Falha ao excluir o teste.";
    }
  }
};

const addLabelAndInformation = (doc, x, y, label, information) => {
  var spaceBetweenInformationAndLabel = 5;
  doc.setFontSize(8);
  doc.setFont(undefined, "bold");
  doc.text(label, x, y);
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(information || "", x, y + spaceBetweenInformationAndLabel);
};

const truncate = (str, n) =>
  str && str.length > n ? str.substr(0, n - 3) + "..." : str;

const downloadReport = () => {
  if (!reportMonth.value) {
    alert("Por favor, selecione um mês para gerar o relatório.");
    return;
  }

  const doc = new JsPDF();
  const radLogo = logoTrevo(); // Assuming a helper in auth service

  const lineHeight = 12;
  const beginRoundedRect = 35;
  const tableLineHeight = 6;
  const beginTextHeight = beginRoundedRect + 9;
  const beginSecondRoundedRect = beginRoundedRect + 41;
  const beginSecondTextHeight = beginSecondRoundedRect + 15;
  const beginThirdRoundedRect = beginSecondRoundedRect + 45;
  const beginThirdTextHeight = beginThirdRoundedRect + 5;
  doc.setFillColor(240, 240, 240); // Light grey fill
  doc.roundedRect(10, 10, 190, 22, 2, 2, "F");
  if (radLogo) doc.addImage(radLogo, "PNG", 15, 12, 74, 20);
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(10, beginRoundedRect, 190, 38, 2, 2, "S");
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Controle de Qualidade", 105, beginRoundedRect + 6, {
    align: "center",
  });

  addLabelAndInformation(
    doc,
    15,
    beginTextHeight,
    "Instalação:",
    truncate(facility.value.companyName, 43)
  );
  addLabelAndInformation(
    doc,
    90,
    beginTextHeight,
    "Local:",
    equipment.value.localization
  );
  addLabelAndInformation(
    doc,
    150,
    beginTextHeight,
    "Responsável:",
    reportResponsible.value?.name || "N/A"
  );
  addLabelAndInformation(
    doc,
    15,
    beginTextHeight + lineHeight - 2,
    "Equipamento:",
    equipment.value.type
  );
  addLabelAndInformation(
    doc,
    90,
    beginTextHeight + lineHeight - 2,
    "Modelo:",
    `${equipment.value.manufacturer}/${equipment.value.model}-${equipment.value.serialNumber}`
  );
  addLabelAndInformation(
    doc,
    150,
    beginTextHeight + lineHeight - 2,
    "Número Patrimonial:",
    equipment.value.patrimonialNumber
  );
  addLabelAndInformation(
    doc,
    15,
    beginTextHeight + 2 * lineHeight - 4,
    "Teste:",
    "Reprodutibilidade"
  );
  addLabelAndInformation(
    doc,
    90,
    beginTextHeight + 2 * lineHeight - 4,
    "Periodicidade:",
    "Diário"
  );
  addLabelAndInformation(
    doc,
    150,
    beginTextHeight + 2 * lineHeight - 4,
    "Mês:",
    reportMonth.value.label
  );

  // Source Info Box
  doc.roundedRect(10, beginSecondRoundedRect, 190, 42, 2, 2, "S");
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(
    "Informações das Fontes Utilizadas",
    105,
    beginSecondRoundedRect + 8,
    { align: "center" }
  );
  doc.setFontSize(10);
  doc.text("Radioisótopo", 15, beginSecondTextHeight);
  doc.text("Co(57)", 90, beginSecondTextHeight);
  doc.text("Ba(133)", 112, beginSecondTextHeight);
  doc.text("Cs(137)", 139, beginSecondTextHeight);
  doc.text(
    `Cs(137) em ${equipment.value.mostUsedRadioisotope || "?"}`,
    160,
    beginSecondTextHeight
  );
  doc.text("Número de Série:", 15, beginSecondTextHeight + tableLineHeight);
  doc.text(
    "Atividade Inicial (µCi):",
    15,
    beginSecondTextHeight + 2 * tableLineHeight
  );
  doc.text(
    "Data da Atividade Inicial:",
    15,
    beginSecondTextHeight + 3 * tableLineHeight
  );
  doc.text(
    "Atividade Calculada (Mês Referência) (µCi):",
    15,
    beginSecondTextHeight + 4 * tableLineHeight
  );
  doc.setFont(undefined, "normal");

  // Find a representative test from the selected month to get source info
  const reportTests = tests.value.filter(
    (t) =>
      moment(t.date).month() === reportMonth.value.value &&
      moment(t.date).year() === Number(filterYear.value)
  );
  const representativeTest =
    reportTests.length > 0 ? reportTests[reportTests.length - 1] : null;
  const reportRefDate = moment()
    .year(filterYear.value)
    .month(reportMonth.value.value)
    .startOf("month")
    .toDate(); // Use start of month for calculation

  const calculateActivityForReport = (source, date) => {
    if (!source || !source.initialActivity || !source.initialActivityDate)
      return "-";
    const t = moment(date).diff(moment(source.initialActivityDate));
    const halfLifeHours =
      source.radioisotope === "Co(57)"
        ? 6522.96
        : source.radioisotope === "Ba(133)"
        ? 92067.6
        : source.radioisotope === "Cs(137)" ||
          source.radioisotope?.includes("Cs(137) medido em")
        ? 264289.2
        : 0;
    if (halfLifeHours === 0) return "-";
    const activity =
      source.initialActivity *
      Math.exp(-((0.6931471806 * t) / (1000 * 60 * 60)) / halfLifeHours);
    return activity.toFixed(2).replace(".", ",");
  };

  if (representativeTest) {
    doc.text(
      representativeTest.sourceCo?.serialNumber || "-",
      90,
      beginSecondTextHeight + tableLineHeight
    );
    doc.text(
      representativeTest.sourceCo?.initialActivity?.toString() || "-",
      90,
      beginSecondTextHeight + 2 * tableLineHeight
    );
    doc.text(
      moment(representativeTest.sourceCo?.initialActivityDate).format(
        "DD/MM/YYYY"
      ) || "-",
      90,
      beginSecondTextHeight + 3 * tableLineHeight
    );
    doc.text(
      calculateActivityForReport(representativeTest.sourceCo, reportRefDate),
      90,
      beginSecondTextHeight + 4 * tableLineHeight
    );

    doc.text(
      representativeTest.sourceBa?.serialNumber || "-",
      112,
      beginSecondTextHeight + tableLineHeight
    );
    doc.text(
      representativeTest.sourceBa?.initialActivity?.toString() || "-",
      112,
      beginSecondTextHeight + 2 * tableLineHeight
    );
    doc.text(
      moment(representativeTest.sourceBa?.initialActivityDate).format(
        "DD/MM/YYYY"
      ) || "-",
      112,
      beginSecondTextHeight + 3 * tableLineHeight
    );
    doc.text(
      calculateActivityForReport(representativeTest.sourceBa, reportRefDate),
      112,
      beginSecondTextHeight + 4 * tableLineHeight
    );

    doc.text(
      representativeTest.sourceCs?.serialNumber || "-",
      139,
      beginSecondTextHeight + tableLineHeight
    );
    doc.text(
      representativeTest.sourceCs?.initialActivity?.toString() || "-",
      139,
      beginSecondTextHeight + 2 * tableLineHeight
    );
    doc.text(
      moment(representativeTest.sourceCs?.initialActivityDate).format(
        "DD/MM/YYYY"
      ) || "-",
      139,
      beginSecondTextHeight + 3 * tableLineHeight
    );
    doc.text(
      calculateActivityForReport(representativeTest.sourceCs, reportRefDate),
      139,
      beginSecondTextHeight + 4 * tableLineHeight
    );

    doc.text(
      representativeTest.sourceCsOnMostUsedRadioisotope?.serialNumber || "-",
      166,
      beginSecondTextHeight + tableLineHeight
    );
    doc.text(
      representativeTest.sourceCsOnMostUsedRadioisotope?.initialActivity?.toString() ||
        "-",
      166,
      beginSecondTextHeight + 2 * tableLineHeight
    );
    doc.text(
      moment(
        representativeTest.sourceCsOnMostUsedRadioisotope?.initialActivityDate
      ).format("DD/MM/YYYY") || "-",
      166,
      beginSecondTextHeight + 3 * tableLineHeight
    );
    doc.text(
      calculateActivityForReport(
        representativeTest.sourceCsOnMostUsedRadioisotope,
        reportRefDate
      ),
      166,
      beginSecondTextHeight + 4 * tableLineHeight
    );
  }

  // Daily Results Table
  doc.setFontSize(8);
  doc.setFont(undefined, "bold");
  let tableStartY = beginThirdRoundedRect + 5 + 8;
  doc.text("Data", 15, tableStartY);
  doc.text("Auto-zero (mV)", 30, tableStartY);
  doc.text("BG (µCi)", 50, tableStartY);
  doc.text("System Test (V)", 66, tableStartY);
  doc.text("Data Check", 92, tableStartY);
  doc.text("Ativ. (Desvio %)", 136, tableStartY - 4); // Centered title
  doc.text("Co(57)", 108, tableStartY);
  doc.text("Ba(133)", 130, tableStartY);
  doc.text("Cs(137)", 150, tableStartY);
  doc.text(
    `Cs(137) em ${equipment.value.mostUsedRadioisotope || "?"}`,
    170,
    tableStartY
  );

  let currentY = beginThirdTextHeight + 14;
  doc.setFont(undefined, "normal");
  reportTests.forEach((test) => {
    doc.text(moment(test.date).format("DD/MM/YY"), 15, currentY);
    doc.text(formatStatus(test.autoZero, test.autoZeroStatus), 30, currentY);
    doc.text(formatStatus(test.bG, test.bGStatus), 48, currentY);
    doc.text(
      formatStatus(test.systemTest, test.systemTestStatus),
      68,
      currentY
    );
    doc.text(test.dataCheckStatus || "N/A", 92, currentY);

    const devCo = formatDeviation(test.sourceCoActivityDeviation);
    doc.setTextColor(devCo.class.includes("red") ? 255 : 0, 0, 0);
    doc.text(`${test.sourceCoActivity ?? "-"} (${devCo.text})`, 108, currentY);
    doc.setTextColor(0, 0, 0); // Reset color

    const devBa = formatDeviation(test.sourceBaActivityDeviation);
    doc.setTextColor(devBa.class.includes("red") ? 255 : 0, 0, 0);
    doc.text(`${test.sourceBaActivity ?? "-"} (${devBa.text})`, 130, currentY);
    doc.setTextColor(0, 0, 0);

    const devCs = formatDeviation(test.sourceCsActivityDeviation);
    doc.setTextColor(devCs.class.includes("red") ? 255 : 0, 0, 0);
    doc.text(`${test.sourceCsActivity ?? "-"} (${devCs.text})`, 150, currentY);
    doc.setTextColor(0, 0, 0);

    const devCsMeas = formatDeviation(
      test.sourceCsOnMostUsedRadioisotopeActivityDeviation
    );
    doc.setTextColor(devCsMeas.class.includes("red") ? 255 : 0, 0, 0);
    doc.text(
      `${test.sourceCsOnMostUsedRadioisotopeActivity ?? "-"} (${
        devCsMeas.text
      })`,
      170,
      currentY
    );
    doc.setTextColor(0, 0, 0);

    currentY += 6;
  });

  doc.roundedRect(
    10,
    beginThirdRoundedRect,
    190,
    currentY - beginThirdRoundedRect - 4,
    2,
    2,
    "S"
  );
  currentY += 6;
  doc.text("1/1", 190, currentY, { align: "right" });

  doc.save(
    `Relatorio_Diario_${facility.value.name}_${equipment.value.serialNumber}_${reportMonth.value.label}_${filterYear.value}.pdf`
  );
};

// Lifecycle Hook
onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadDailyTests();
});
</script>
