<template>
  <div v-if="currentUser.type === 'administrador'">
    <div class="flex w-full justify-between items-center mb-6">
      <h4 class="text-xl font-medium">Logs do Sistema</h4>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">
          <FontAwesomeIcon icon="fa-solid fa-calendar" class="mr-2" />
          Período:
        </label>
        <select
          v-model="selectedMonth"
          @change="loadLogs(selectedMonth)"
          class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option
            v-for="(month, index) in yearOptions"
            :key="index"
            :value="month"
          >
            {{ formatYearMonth(month) }}
          </option>
        </select>
      </div>
    </div>

    <div class="relative mb-6">
      <!-- Loading overlay -->
      <div 
        v-if="loading" 
        class="inset-0 bg-white bg-opacity-70 z-10 mt-20 flex justify-center items-center h-80"
      >
        <div class="text-center">
          <img src="/static/img/loading.gif" class="w-full h-full mx-auto" />
        </div>
      </div>

      <Table
        v-if="logs.length > 0"
        :columns="columnsLogsTableFormatted"
        :data="filteredLogs"
        :totalItems="logs.length"
        v-model:currentPage="currentPage"
        v-model:perPage="perPage"
        class="max-h-[600px] overflow-y-auto"
        footer-class="relative border-0 justify-center z-auto"
      />
      
      <div v-else-if="!loadingLogs" class="bg-white p-6 rounded-lg shadow text-center">
        <p class="text-gray-500">Nenhum log encontrado para o período selecionado.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Table from "@/components/dashboard/Table.vue";
import auth from "@/services/authentication";
import { api } from "@/services/api";

const emit = defineEmits(['update:loading']);

const currentUser = ref(auth.currentUser());
const loading = ref(false);
const loadingLogs = ref(false);

// Logs data
const logs = ref([]);
const currentPage = ref(1);
const perPage = ref(10);
const yearOptions = ref([]);
const selectedMonth = ref("");

// Computed properties
const filteredLogs = computed(() => {
  return logs.value.slice(
    (currentPage.value - 1) * perPage.value,
    currentPage.value * perPage.value
  );
});

// Table columns definition
const columnsLogsTableFormatted = computed(() => [
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: (info) => {
      const date = info.getValue();
      return date ? new Date(date).toLocaleString('pt-BR') : '';
    },
    meta: {
      headerClass: "text-left pl-4",
      cellClass: "text-left pl-4 whitespace-nowrap",
      width: "20%"
    }
  },
  {
    accessorKey: "content",
    header: "Log",
    meta: {
      headerClass: "text-left pl-4",
      cellClass: "text-left pl-4",
      width: "80%"
    }
  }
]);

// Initialize year options for log filtering
const initializeYearOptions = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  yearOptions.value = [];
  
  // Add current month and previous 11 months
  for (let i = 0; i < 12; i++) {
    let month = currentMonth - i;
    let year = currentYear;
    
    if (month <= 0) {
      month += 12;
      year -= 1;
    }
    
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    yearOptions.value.push(`${year}-${monthStr}`);
  }
  
  // Set default selected month to current month
  selectedMonth.value = yearOptions.value[0];
};

// Format year-month for display
const formatYearMonth = (yearMonth) => {
  const [year, month] = yearMonth.split('-');
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return `${months[parseInt(month) - 1]} de ${year}`;
};

// Load logs for selected month
const loadLogs = async (value) => {
  if (currentUser.value.type !== 'administrador') return;
  
  loadingLogs.value = true;
  logs.value = [];
  
  let query;
  if (!value) {
    const now = new Date();
    query = now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0');
  } else {
    query = value;
  }
  
  try {
    const response = await api.get(`logs/${query}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });
    
    if (!response.data.length) {
      loadingLogs.value = false;
      return;
    }
    
    logs.value = response.data.map(log => ({
      content: log.content,
      createdAt: new Date(log.createdAt)
    }));
  } catch (error) {
    console.error("Error loading logs:", error);
  } finally {
    loadingLogs.value = false;
  }
};

// Initialize component
onMounted(() => {
  initializeYearOptions();
  loadLogs(selectedMonth.value);
});
</script> 