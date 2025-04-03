<template>
  <Layout :loading="loading">
    <template #header>
      <h1 class="text-xl font-semibold">Editar Avaliação de EPIs</h1>
    </template>

    <!-- Upload/Update Progress Modal -->
    <Modal
      :show="uploadProgressModalVisible"
      @close="uploadProgressModalVisible = false"
    >
      <template #title>Atualizando Avaliação</template>
      <p class="text-center">Processando e atualizando avaliação...</p>
      <div class="w-full mt-2">
        <!-- Simplified progress for single edit -->
        <div v-if="loading" class="flex items-center justify-center">
          <FontAwesomeIcon :icon="['fas', 'spinner']" spin class="mr-2" />
          Processando...
        </div>
        <div
          v-else-if="uploadErrors.length > 0"
          class="text-red-500 text-center"
        >
          Falha na atualização.
        </div>
        <div v-else class="text-green-500 text-center">
          Atualização concluída.
        </div>
      </div>
      <div v-if="uploadErrors.length > 0" class="mt-4 space-y-2">
        <div
          v-for="(err, index) in uploadErrors"
          :key="index"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm"
        >
          <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" />
          {{ err }}
        </div>
      </div>
      <template #footer>
        <Button @click="closeUpdateModal" :disabled="loading" variant="success">
          <FontAwesomeIcon
            v-if="loading"
            :icon="['fas', 'circle-notch']"
            spin
          />
          <span v-else>Fechar</span>
        </Button>
      </template>
    </Modal>

    <!-- Generic Loading Modal -->
    <Modal :show="showLoadingModal" :closable="false">
      <template #title>Aguarde</template>
      <div class="text-center">
        <FontAwesomeIcon
          :icon="['fas', 'spinner']"
          spin
          size="3x"
          class="text-gray-400 mb-4"
        />
        <p>{{ loadingMessage || "Carregando Dados..." }}</p>
      </div>
    </Modal>

    <form @submit.prevent="handleUpdate">
      <div
        v-if="initialLoadingError"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
        role="alert"
      >
        <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
        <span
          >Falha ao carregar dados da avaliação: {{ initialLoadingError }}</span
        >
      </div>

      <!-- Facility Information Card -->
      <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Informações da Instituição
        </h3>
        <div class="mb-4">
          <Input
            label="Instituição"
            v-model="selectedFacility.name"
            :icon="['fas', 'building']"
            disabled
          />
        </div>
        <div class="mb-4">
          <Input
            label="Endereço"
            v-model="facilityAddress"
            :icon="['fas', 'map-marker-alt']"
            disabled
          />
        </div>
      </div>

      <!-- Equipment Information Card -->
      <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Informações do Equipamento Utilizado
        </h3>
        <div class="mb-4">
          <Input
            label="Equipamento"
            :modelValue="equipmentDisplayName(selectedEquipment)"
            :icon="['fas', 'screwdriver-wrench']"
            disabled
          />
        </div>

        <!-- Avaliation Mode -->
        <div class="mt-4 border-t pt-4">
          <Select
            label="Modo de Avaliação"
            id="avaliation-mode"
            v-model="editableTestData.metadata.avaliationMode"
            :options="avaliationModesOptions"
            required
            :icon="['fas', 'tasks']"
          />
        </div>
      </div>

      <!-- EPI Evaluation Details Card -->
      <div class="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4 border-b pb-2">
          Detalhes da Avaliação do EPI
        </h3>
        <div
          v-if="errorUpdatingTest"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" class="mr-2" />
          {{ errorUpdatingTest }}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Input
            label="Ordem de Serviço"
            id="service-order"
            v-model="editableTestData.metadata.serviceOrder"
            :icon="['fas', 'list-alt']"
          />
          <Select
            label="Equipamento (Tipo de EPI)"
            id="epi-type"
            v-model="editableTestData.metadata.epiType"
            :options="epiTypesOptions"
            required
            :icon="['fas', 'hard-hat']"
          />
          <Select
            label="Tamanho"
            id="size"
            v-model="editableTestData.metadata.size"
            :options="sizesOptions"
            required
            :icon="['fas', 'text-height']"
          />
          <Input
            label="Cor"
            id="color"
            v-model="editableTestData.metadata.color"
            :icon="['fas', 'palette']"
          />
          <Input
            label="Identificação (Nº Série/Patrimônio)"
            id="identification"
            v-model="editableTestData.metadata.identification"
            required
            :icon="['fas', 'tag']"
          />
          <Input
            label="CA"
            id="ca"
            v-model="editableTestData.metadata.ca"
            optional
            :icon="['fas', 'certificate']"
          />
          <Input
            label="Setor"
            id="sector"
            v-model="editableTestData.metadata.sector"
            :icon="['fas', 'map-pin']"
          />
          <Select
            label="Finalidade de Uso"
            id="use-goal"
            v-model="editableTestData.metadata.useGoal"
            :options="useGoalsOptions"
            required
            :icon="['fas', 'bullseye']"
          />
          <Select
            label="Avaliação (Resultado)"
            id="avaliation"
            v-model="editableTestData.conclusion"
            :options="avaliationsOptions"
            required
            :icon="['fas', 'check-circle']"
          />
          <Input
            type="date"
            label="Data da Avaliação"
            id="date"
            v-model="editableTestData.date"
            required
            :invalid="invalidDate"
            :icon="['fas', 'calendar-alt']"
          />
          <Input
            type="date"
            label="Validade"
            id="validity"
            v-model="editableTestData.validity"
            optional
            :invalid="invalidValidity"
            :icon="['fas', 'calendar-times']"
          />
          <Input
            label="Nome do Arquivo (Certificado)"
            id="title"
            v-model="editableTestData.name"
            required
            :icon="['fas', 'file-alt']"
            class="md:col-span-2"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-8">
        <Button
          type="submit"
          variant="success"
          size="lg"
          :disabled="loading || initialLoadingError"
        >
          <FontAwesomeIcon
            v-if="loading"
            :icon="['fas', 'spinner']"
            spin
            class="mr-2"
          />
          Salvar Alterações e Regenerar Certificado
        </Button>
      </div>
    </form>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import moment from "moment-timezone";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/common/Modal.vue";

// --- State ---
const route = useRoute();
const router = useRouter();
const currentUser = ref(auth.currentUser() || {});
const documentId = ref(route.params.documentId); // Assuming route param name

// Modals and Loading
const uploadProgressModalVisible = ref(false);
const showLoadingModal = ref(false);
const loadingMessage = ref("");
const loading = ref(false); // General loading state for update
const initialLoadingError = ref("");
const errorUpdatingTest = ref(""); // Errors specific to updating the test
const uploadErrors = ref([]); // Capture errors during PDF upload/update

// Data State
const originalTestData = ref(null); // Store the initially loaded data
const editableTestData = reactive({
  // Data bound to the form inputs
  name: "",
  date: "",
  validity: "",
  conclusion: "",
  metadata: {
    // Assuming metadata structure based on Register.vue
    serviceOrder: "",
    epiType: "",
    size: "",
    color: "",
    identification: "",
    ca: "",
    sector: "",
    useGoal: "",
    avaliationMode: "",
  },
});

const selectedFacility = ref({});
const selectedEquipment = ref({});

// Select Options (Should be same as Register.vue)
const equipmentTypesOptions = ref([
  /* ...same as Register */ {
    value: "Monitor de Contaminação",
    label: "Monitor de Contaminação",
  },
]);
const avaliationModesOptions = ref([
  /* ...same as Register */ {
    value: "Avaliação de Rotina",
    label: "Avaliação de Rotina",
  },
]);
const epiTypesOptions = ref([
  { value: "Avental Plumbífero", label: "Avental Plumbífero" } /* ... */,
]);
const sizesOptions = ref([{ value: "P", label: "P" } /* ... */]);
const useGoalsOptions = ref([
  { value: "Hemodinâmica", label: "Hemodinâmica" } /* ... */,
]);
const avaliationsOptions = ref([
  { value: "Aprovado", label: "Aprovado" },
  { value: "Reprovado", label: "Reprovado" } /* ... */,
]);

// --- Computed Properties ---

const facilityAddress = computed(() => {
  const addr = selectedFacility.value?.address?.[0];
  if (!addr) return "";
  return `${addr.street || ""}, ${addr.number || ""}${
    addr.complement ? ", " + addr.complement : ""
  }, ${addr.city || ""} - ${addr.state || ""}`.replace(/^,|, $/g, ""); // Basic formatting
});

const invalidDate = computed(() => {
  return !editableTestData.date;
});

const invalidValidity = computed(() => {
  if (editableTestData.validity && editableTestData.date) {
    return moment(editableTestData.validity).isBefore(
      moment(editableTestData.date)
    );
  }
  return false;
});

const equipmentDisplayName = (equip) => {
  if (!equip || !equip.type) return "";
  const parts = [
    equip.type,
    equip.patrimonialNumber ? `Pat: ${equip.patrimonialNumber}` : "",
    equip.serialNumber ? `S/N: ${equip.serialNumber}` : "",
  ];
  return parts.filter(Boolean).join(" - ");
};

// --- Methods ---

const loadTestData = async () => {
  if (!documentId.value) {
    initialLoadingError.value = "ID do documento não encontrado na rota.";
    return;
  }
  showLoadingModal.value = true;
  loadingMessage.value = "Carregando dados da avaliação...";
  initialLoadingError.value = "";
  try {
    const response = await axios.get(
      auth.apiUrl() + `document/${documentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    originalTestData.value = response.data;

    // Populate reactive form data
    editableTestData.name = originalTestData.value.name || "";
    editableTestData.date = originalTestData.value.date
      ? moment(originalTestData.value.date).format("YYYY-MM-DD")
      : "";
    editableTestData.validity = originalTestData.value.validity
      ? moment(originalTestData.value.validity).format("YYYY-MM-DD")
      : "";
    editableTestData.conclusion = originalTestData.value.conclusion || "";

    // Populate metadata (handle potential undefined values)
    const meta = originalTestData.value.metadata || {};
    editableTestData.metadata.serviceOrder = meta.serviceOrder || "";
    editableTestData.metadata.epiType = meta.epiType || "";
    editableTestData.metadata.size = meta.size || "";
    editableTestData.metadata.color = meta.color || "";
    editableTestData.metadata.identification = meta.identification || "";
    editableTestData.metadata.ca = meta.ca || "";
    editableTestData.metadata.sector = meta.sector || "";
    editableTestData.metadata.useGoal = meta.useGoal || "";
    editableTestData.metadata.avaliationMode = meta.avaliationMode || "";

    // Load related Facility and Equipment data (assuming IDs are available)
    if (originalTestData.value.facility?._id) {
      await loadFacilityData(originalTestData.value.facility._id);
    }
    if (originalTestData.value.equipment?._id) {
      // Equipment data might be nested or need separate fetch
      // Assuming it's nested for now based on potential structure
      selectedEquipment.value = originalTestData.value.equipment;
    } else if (originalTestData.value.equipment) {
      // Handle case where equipment is just an ID string
      await loadEquipmentData(originalTestData.value.equipment);
    }
  } catch (err) {
    console.error("Erro ao carregar dados do documento:", err);
    initialLoadingError.value =
      err.response?.data?.message || "Falha ao buscar dados.";
    originalTestData.value = null;
  } finally {
    showLoadingModal.value = false;
    loadingMessage.value = "";
  }
};

const loadFacilityData = async (facilityId) => {
  try {
    const response = await axios.get(auth.apiUrl() + `facility/${facilityId}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    selectedFacility.value = response.data;
  } catch (err) {
    console.error("Erro ao buscar dados da instalação:", err);
    initialLoadingError.value += " (Erro ao buscar instalação)"; // Append error
    selectedFacility.value = {};
  }
};

const loadEquipmentData = async (equipmentId) => {
  try {
    const response = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    selectedEquipment.value = response.data;
  } catch (err) {
    console.error("Erro ao buscar dados do equipamento:", err);
    initialLoadingError.value += " (Erro ao buscar equipamento)"; // Append error
    selectedEquipment.value = {};
  }
};

const validateTestData = () => {
  errorUpdatingTest.value = ""; // Clear previous errors
  if (
    !editableTestData.metadata.epiType ||
    !editableTestData.metadata.size ||
    !editableTestData.metadata.identification ||
    !editableTestData.metadata.useGoal ||
    !editableTestData.conclusion ||
    !editableTestData.date ||
    !editableTestData.name
  ) {
    errorUpdatingTest.value = "Preencha todos os campos obrigatórios.";
    return false;
  }
  if (invalidDate.value || invalidValidity.value) {
    errorUpdatingTest.value = "Verifique as datas da avaliação e validade.";
    return false;
  }
  return true;
};

// PDF Generation (similar to Register.vue, but uses editableTestData)
const generatePdf = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  let y = height - 50;

  const drawText = (text, x, currentY, size = fontSize) => {
    page.drawText(text || "-", {
      x,
      y: currentY,
      font,
      size,
      color: rgb(0, 0, 0),
    }); // Handle null/undefined text
    return currentY - size * 1.5;
  };

  y = drawText("Relatório de Avaliação de EPI (Atualizado)", 50, y, 18);
  y -= 20;

  y = drawText(`Instituição: ${selectedFacility.value?.name || "N/A"}`, 50, y);
  y = drawText(`Endereço: ${facilityAddress.value || "N/A"}`, 50, y);
  y = drawText(
    `Equipamento Utilizado: ${equipmentDisplayName(selectedEquipment.value)}`,
    50,
    y
  );
  y = drawText(
    `Modo de Avaliação: ${editableTestData.metadata.avaliationMode || "N/A"}`,
    50,
    y
  );
  y -= 20;

  y = drawText("Detalhes do EPI Avaliado", 50, y, 14);
  y = drawText(`OS: ${editableTestData.metadata.serviceOrder || "-"}`, 70, y);
  y = drawText(`Tipo EPI: ${editableTestData.metadata.epiType}`, 70, y);
  y = drawText(`Tamanho: ${editableTestData.metadata.size}`, 70, y);
  y = drawText(`Cor: ${editableTestData.metadata.color || "-"}`, 70, y);
  y = drawText(
    `Identificação: ${editableTestData.metadata.identification}`,
    70,
    y
  );
  y = drawText(`CA: ${editableTestData.metadata.ca || "-"}`, 70, y);
  y = drawText(`Setor: ${editableTestData.metadata.sector || "-"}`, 70, y);
  y = drawText(`Finalidade: ${editableTestData.metadata.useGoal}`, 70, y);
  y = drawText(
    `Data Avaliação: ${moment(editableTestData.date).format("DD/MM/YYYY")}`,
    70,
    y
  );
  y = drawText(
    `Validade: ${
      editableTestData.validity
        ? moment(editableTestData.validity).format("DD/MM/YYYY")
        : "-"
    }`,
    70,
    y
  );
  y -= 10;
  y = drawText(`Resultado: ${editableTestData.conclusion}`, 50, y, 14);

  // Add signature placeholders or actual signature logic if needed

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};

const handleUpdate = async () => {
  if (!validateTestData() || !originalTestData.value) {
    return;
  }

  loading.value = true;
  uploadProgressModalVisible.value = true;
  uploadErrors.value = [];
  errorUpdatingTest.value = "";

  try {
    const pdfBlob = await generatePdf();
    const formData = new FormData();

    // --- IMPORTANT: Backend Interaction ---
    // Option 1: PUT/PATCH to update existing document (preferred for true edit)
    // Option 2: POST a new document, potentially marking the old one as superseded (if backend follows this pattern)

    // Assuming Option 2 (POST new version) based on Register.vue pattern
    formData.append("file", pdfBlob, `${editableTestData.name}.pdf`);
    formData.append("name", editableTestData.name);
    formData.append("facility", selectedFacility.value._id); // Should not change
    formData.append("equipment", selectedEquipment.value._id); // Should not change
    formData.append(
      "testId",
      originalTestData.value.test?.[0]?._id || "5cb5d3865e719264dd704b67"
    ); // Use original test ID
    formData.append("status", "ativo"); // Or determine based on conclusion
    formData.append("date", moment(editableTestData.date).toISOString());
    if (editableTestData.validity) {
      formData.append(
        "validity",
        moment(editableTestData.validity).toISOString()
      );
    }
    formData.append("conclusion", editableTestData.conclusion);

    // Append updated metadata
    Object.keys(editableTestData.metadata).forEach((key) => {
      formData.append(`metadata[${key}]`, editableTestData.metadata[key]);
    });

    // Might need to send original document ID if replacing/superseding
    // formData.append('supersedesDocumentId', documentId.value);

    // Make the API call (Using POST for now, adjust if backend supports PUT/PATCH)
    await axios.post(auth.apiUrl() + "documents", formData, {
      // ADJUST ENDPOINT if necessary
      headers: {
        Authorization: `Bearer ${auth.getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // If using PUT/PATCH instead:
    // await axios.put(auth.apiUrl() + `document/${documentId.value}`, formData, { ... });

    // Mark old document inactive? This likely needs a separate API call if using POST approach
    // await axios.patch(auth.apiUrl() + `document/${documentId.value}/status`, { status: 'inativo' }, { ... })
  } catch (err) {
    console.error("Erro ao atualizar avaliação:", err);
    const errorMessage =
      err.response?.data?.message || "Falha ao salvar alterações.";
    uploadErrors.value.push(errorMessage);
    errorUpdatingTest.value = errorMessage; // Show error near form as well
  } finally {
    loading.value = false;
    // Keep modal open to show status
  }
};

const closeUpdateModal = () => {
  uploadProgressModalVisible.value = false;
  if (uploadErrors.value.length === 0 && !loading.value) {
    // Redirect only on success after modal close
    router.push({ name: "EpiAssessmentList" }); // Adjust route name
  }
};

// --- Lifecycle ---
onMounted(() => {
  loadTestData();
  // Fetch select options if static lists aren't sufficient
});

// --- Watchers ---
// Optional: Watch specific fields if they should trigger side-effects (like recalculating validity)
watch(
  () => editableTestData.metadata.useGoal,
  (newGoal) => {
    // Example: Auto-calculate validity based on use goal if desired
    // This logic might be complex and require careful adaptation from the original
  }
);

watch(
  () => editableTestData.date,
  (newDate) => {
    // Example: Update default filename when date changes
    // editableTestData.name = `AV_${...}_${moment(newDate).format('YYYYMMDD')}`;
  }
);
</script>
