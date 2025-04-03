<template>
  <Layout :loading="loading">
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-semibold">Avaliação de EPIs</h1>
        <router-link
          v-if="permission.canCreateDocuments(currentUser)"
          class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300"
          :to="{ name: 'EpiAssessmentRegister' }"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="md:mr-2" />
          <span class="hidden md:inline">Adicionar</span>
        </router-link>
      </div>
    </template>

    <div class="mb-4">
      <Input
        v-model="filter"
        placeholder="Buscar por nome, validade, instalação, hash, uploader..."
        :icon="['fas', 'search']"
      />
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-else>
      <Table
        v-if="filteredDocuments.length > 0"
        :data="filteredDocuments"
        :columns="tableColumns"
        :show-edit-button="false"
        @refresh="loadDocuments"
      />
      <div v-else class="text-center py-10 text-gray-500">
        <p>Nenhum documento encontrado.</p>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Table from "@/components/dashboard/Table.vue";
import Input from "@/components/ui/Input.vue";

const filter = ref("");
const documents = ref([]);
const currentUser = ref({});
const loading = ref(true);
const error = ref("");
const today = ref(new Date());

const tableColumns = ref([
  { key: "actions", label: "Ações" },
  { key: "conclusion", label: "Conclusão" },
  { key: "name", label: "Nome", sortable: true },
  {
    key: "facility[0].name",
    label: "Instalação",
    formatter: (value, key, item) => item.facility?.[0]?.name || "-",
  },
  {
    key: "uploadedBy[0].name",
    label: "Upload por",
    formatter: (value, key, item) => item.uploadedBy?.[0]?.name || "-",
  },
  { key: "uploadedAt", label: "Upload", sortable: true, type: "date" }, // Assuming Table handles date formatting
  { key: "validity", label: "Validade", sortable: true, type: "date" },
  { key: "status", label: "Status" },
]);

const filteredDocuments = computed(() => {
  if (!filter.value) {
    return documents.value;
  }
  const searchTerm = filter.value.trim().toLowerCase();
  return documents.value.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm) ||
      item.validity?.toLowerCase().includes(searchTerm) || // Adjust if validity is date object
      item.facility?.[0]?.name?.toLowerCase().includes(searchTerm) ||
      item.hash?.toLowerCase().includes(searchTerm) ||
      item.uploadedBy?.[0]?.name?.toLowerCase().includes(searchTerm) ||
      item.uploadedAt?.toLowerCase().includes(searchTerm) // Adjust if uploadedAt is date object
  );
});

const clearState = () => {
  loading.value = true;
  documents.value = [];
  error.value = "";
};

const fetchDocumentsPage = async (testId, pageNum = 1, pageSize = 50) => {
  // Increased page size
  const params = {
    filters: { pageSize, pageNum },
    testId: testId,
  };
  try {
    const response = await axios.get(auth.apiUrl() + "documents/byTestId", {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
      params: params,
    });
    return response.data; // Expecting { list: [], paging: { total: number } }
  } catch (err) {
    console.error(`Error fetching page ${pageNum} for test ${testId}:`, err);
    throw new Error("Falha ao buscar documentos.");
  }
};

const loadDocuments = async (testId = "5cb5d3865e719264dd704b67") => {
  // Default EPI test ID
  clearState();
  try {
    // Initial fetch to get total count
    const initialData = await fetchDocumentsPage(testId, 1, 1); // Fetch 1 just to get total
    if (!initialData || !initialData.paging || initialData.paging.total === 0) {
      if (initialData?.list?.length === 0) {
        // No documents found is not necessarily an error state for the user
        console.log("Nenhum documento encontrado para o teste:", testId);
      } else {
        error.value = "Nenhum documento encontrado ou falha na paginação.";
      }
      documents.value = [];
      loading.value = false;
      return;
    }

    const totalDocuments = initialData.paging.total;
    const pageSize = 50; // Fetch in chunks of 50
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const promises = [];
    for (let i = 1; i <= totalPages; i++) {
      promises.push(fetchDocumentsPage(testId, i, pageSize));
    }

    const results = await Promise.all(promises);
    const allDocuments = results.flatMap((result) => result.list || []);

    // Optional: Filter again if backend doesn't strictly enforce testId
    // documents.value = allDocuments.filter(doc => doc.test?.[0]?._id === testId);
    documents.value = allDocuments;

    if (documents.value.length === 0) {
      console.log(
        "Nenhum documento correspondente ao teste encontrado após busca:",
        testId
      );
      // Optionally set a message like: error.value = 'Nenhum documento encontrado para este teste específico.'
    }
  } catch (err) {
    console.error("Erro ao carregar documentos:", err);
    error.value = err.message || "Falha ao carregar documentos.";
    documents.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  // Initial load based on potential route params or default
  // const status = route.params.status; // If you need status-based loading
  loadDocuments(); // Load default EPI documents
});
</script>
