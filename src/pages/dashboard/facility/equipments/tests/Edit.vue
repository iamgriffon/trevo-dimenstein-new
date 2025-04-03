<template>
  <Layout title="Editar Teste" :loading="loading">
    <template #breadcrumb>
      <router-link
        :to="`/facility/${facility._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}/equipments/${equipment._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ equipment.type }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}/equipments/${equipment._id}/tests/${test._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ test.name }}
      </router-link>
    </template>
    <template #header>
      <router-link
        :to="`/facility/${facilityId}/equipments/${equipmentId}/tests/${testTypeId}`"
        class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300"
      >
        <FontAwesomeIcon :icon="['fas', 'arrow-left']" class="mr-2" /> Voltar
      </router-link>
    </template>
    <div>
      <h2 class="text-2xl font-semibold mb-6">Editar Documento</h2>

      <div class="max-w-4xl mx-auto">
        <form @submit.prevent="register" enctype="multipart/form-data">
          <div class="bg-white p-6 rounded shadow-md mb-6">
            <div
              v-if="error"
              class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
            >
              <FontAwesomeIcon
                :icon="['fas', 'exclamation-circle']"
                class="mr-2"
              />
              {{ error }}
            </div>

            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="formName"
              >
                <FontAwesomeIcon :icon="['fas', 'file']" class="mr-1" /> Nome
              </label>
              <input
                type="text"
                id="formName"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nome"
                v-model="test.name"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="formDate"
                >
                  <FontAwesomeIcon
                    :icon="['fas', 'calendar-alt']"
                    class="mr-1"
                  />
                  Data
                </label>
                <input
                  type="date"
                  id="formDate"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  :class="{ 'border-red-500': invalidDate }"
                  v-model="test.date"
                />
              </div>
              <div>
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="formValidity"
                >
                  <FontAwesomeIcon
                    :icon="['fas', 'calendar-alt']"
                    class="mr-1"
                  />
                  Validade <span class="text-gray-500 text-xs">(opcional)</span>
                </label>
                <input
                  type="date"
                  id="formValidity"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  :class="{ 'border-red-500': invalidValidity }"
                  v-model="test.validity"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div
              class="bg-white p-6 rounded shadow-md"
              :class="{ 'border border-red-500': invalidFile }"
            >
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="formFile"
              >
                <FontAwesomeIcon :icon="['fas', 'archive']" class="mr-1" />
                Arquivo
              </label>
              <p class="text-gray-600 text-xs mb-2">
                arquivo deve estar no formato .pdf
              </p>
              <input
                type="file"
                id="formFile"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                @change="onFileChange"
                accept="application/pdf"
              />
            </div>
            <div class="bg-white p-6 rounded shadow-md space-y-2">
              <p class="text-gray-700 flex items-center">
                <FontAwesomeIcon
                  :icon="['fas', 'building']"
                  class="mr-2 text-gray-500"
                />
                Instalação: {{ test.facility?.name || "N/A" }}
              </p>
              <p class="text-gray-700 flex items-center">
                <FontAwesomeIcon
                  :icon="['fas', 'cubes']"
                  class="mr-2 text-gray-500"
                />
                Equipamento: {{ equipment?.serialNumber || "N/A" }}
              </p>
            </div>
          </div>

          <div class="bg-white p-6 rounded shadow-md mb-6">
            <div class="flex items-center mb-4">
              <input
                type="checkbox"
                id="addSignature"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                :checked="!!test.hash"
                @change="generateCode"
              />
              <label class="text-gray-700" for="addSignature">
                <FontAwesomeIcon :icon="['fas', 'qrcode']" class="mr-1" />
                Adicionar assinatura e código
              </label>
            </div>
            <p v-if="test.hash" class="text-sm text-gray-600 mb-4">
              Código: {{ test.hash }}
            </p>

            <div v-if="test.hash">
              <div class="mb-4">
                <strong class="block text-gray-700 text-sm font-bold mb-2"
                  >Posição da Assinatura:</strong
                >
                <div class="flex space-x-2 justify-around">
                  <button
                    type="button"
                    class="border p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                    :class="{
                      'ring-2 ring-blue-500 bg-gray-100':
                        test.position === 'tl',
                    }"
                    @click="test.position = 'tl'"
                  >
                    <img
                      class="h-16 w-16 object-contain"
                      src="/static/top_left.png"
                      alt="Top Left"
                    />
                  </button>
                  <button
                    type="button"
                    class="border p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                    :class="{
                      'ring-2 ring-blue-500 bg-gray-100':
                        test.position === 'tr',
                    }"
                    @click="test.position = 'tr'"
                  >
                    <img
                      class="h-16 w-16 object-contain"
                      src="/static/top_right.png"
                      alt="Top Right"
                    />
                  </button>
                  <button
                    type="button"
                    class="border p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                    :class="{
                      'ring-2 ring-blue-500 bg-gray-100':
                        test.position === 'bl',
                    }"
                    @click="test.position = 'bl'"
                  >
                    <img
                      class="h-16 w-16 object-contain"
                      src="/static/bottom_left.png"
                      alt="Bottom Left"
                    />
                  </button>
                  <button
                    type="button"
                    class="border p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                    :class="{
                      'ring-2 ring-blue-500 bg-gray-100':
                        test.position === 'br',
                    }"
                    @click="test.position = 'br'"
                  >
                    <img
                      class="h-16 w-16 object-contain"
                      src="/static/bottom_right.png"
                      alt="Bottom Right"
                    />
                  </button>
                </div>
              </div>

              <div>
                <strong class="block text-gray-700 text-sm font-bold mb-2"
                  >Páginas Assinadas:</strong
                >
                <div
                  class="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 justify-center"
                >
                  <button
                    type="button"
                    @click="test.mode = 'first'"
                    class="btn btn-outline-success w-full md:w-auto"
                    :class="{ active: test.mode === 'first' }"
                  >
                    Primeira Página
                  </button>
                  <button
                    type="button"
                    @click="test.mode = 'all'"
                    class="btn btn-outline-success w-full md:w-auto"
                    :class="{ active: test.mode === 'all' }"
                  >
                    Todas as Páginas
                  </button>
                  <button
                    type="button"
                    @click="test.mode = 'last'"
                    class="btn btn-outline-success w-full md:w-auto"
                    :class="{ active: test.mode === 'last' }"
                  >
                    Última Página
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div
              class="bg-white p-6 rounded shadow-md"
              :class="{ 'border border-red-500': invalidStatus }"
            >
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="formStatus"
              >
                <FontAwesomeIcon :icon="['fas', 'check-square']" class="mr-1" />
                Status:
              </label>
              <select
                id="formStatus"
                v-model="test.status"
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option disabled value="">Selecione um status</option>
                <option
                  v-for="option in statusOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
            <div
              class="bg-white p-6 rounded shadow-md"
              :class="{ 'border border-red-500': invalidConclusion }"
              v-if="conclusionOptions.length > 0"
            >
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="formConclusion"
              >
                <FontAwesomeIcon :icon="['fas', 'check-circle']" class="mr-1" />
                Conclusão:
              </label>
              <select
                id="formConclusion"
                v-model="test.conclusion"
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option disabled value="">Selecione uma conclusão</option>
                <option
                  v-for="option in conclusionOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Comentários</h3>
            <div v-if="test.comments?.length > 0" class="space-y-4 mb-4">
              <div
                v-for="(commentary, index) in test.comments"
                :key="index"
                class="bg-white p-4 rounded shadow-md"
              >
                <div
                  class="flex justify-between items-center mb-1 text-sm text-gray-600"
                >
                  <span
                    ><FontAwesomeIcon :icon="['fas', 'comment']" class="mr-1" />
                    {{
                      commentary.commentedBy?.name || "Usuário Desconhecido"
                    }}</span
                  >
                  <span>{{ formatCommentDate(commentary.commentedAt) }}</span>
                </div>
                <p class="text-gray-800">{{ commentary.text }}</p>
              </div>
            </div>
            <div v-else class="text-gray-500 italic mb-4">
              Nenhum comentário adicionado ainda.
            </div>

            <div
              v-if="openCommentaryBox"
              class="bg-white p-4 rounded shadow-md mb-4"
            >
              <div class="flex justify-between items-center mb-2">
                <label
                  for="commentaryText"
                  class="block text-gray-700 text-sm font-bold"
                  >Adicionar Comentário:</label
                >
                <span class="text-sm text-gray-500"
                  >{{ currentUser.name }} - {{ formatCommentDate(today) }}</span
                >
              </div>
              <textarea
                id="commentaryText"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                rows="3"
                v-model="commentaryText"
              ></textarea>
              <div class="text-right">
                <button
                  type="button"
                  class="btn btn-outline-metalic-seaweed"
                  @click="addComment"
                >
                  Comentar
                </button>
              </div>
            </div>

            <button
              v-if="!openCommentaryBox"
              type="button"
              class="btn btn-outline-metalic-seaweed"
              @click="openCommentaryBox = true"
            >
              Adicionar comentário
            </button>
          </div>

          <div class="text-center mt-8">
            <button
              type="submit"
              class="btn btn-success btn-block w-full md:w-auto"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment-timezone";
import axios from "axios";
import Hashids from "hashids";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";

const route = useRoute();
const router = useRouter();

const today = ref(new Date());
const loading = ref(false);
const error = ref("");
const currentUser = ref({});
const facility = ref({}); // Only storing the ID fetched with equipment
const equipment = ref({});
const test = ref({
  name: "",
  date: "",
  validity: "",
  uploadedAt: "",
  _id: "", // This is the document ID (docId)
  facility: {}, // Will be populated from fetched doc data
  equipment: {}, // Will be populated from fetched doc data
  test: {}, // Will contain test type info (_id, name)
  hash: "",
  mode: "",
  position: "",
  conclusion: "",
  status: "",
  comments: [],
  data: null, // For storing file data
});

const allStatusOptions = [
  "Em andamento",
  "Corrigir",
  "Falta assinar",
  "Assinado",
  "Liberado",
];
const signedStatusOptions = ["Assinado", "Liberado"];
const statusOptions = ref(allStatusOptions);
const conclusionOptions = ref([
  "Satisfatório",
  "Satisfatório com observações",
  "Insatisfatório",
]);

const invalidDate = ref(false);
const invalidFile = ref(false); // Maybe needed if file re-upload is mandatory on edit?
const invalidStatus = ref(false);
const invalidConclusion = ref(false);
const invalidValidity = ref(false);
const openCommentaryBox = ref(false);
const commentaryText = ref("");

const equipmentId = computed(() => route.params.equipmentId);
const testTypeId = computed(() => route.params.testId); // ID of the test *type*
const docId = computed(() => route.params.id); // ID of the specific document being edited

watch(
  () => test.value.hash,
  (newHash) => {
    statusOptions.value = newHash ? signedStatusOptions : allStatusOptions;
    // If hash is removed, ensure current status is valid
    if (!newHash && !allStatusOptions.includes(test.value.status)) {
      test.value.status = ""; // Or set to a default like 'Em andamento'
    }
    // If hash is added, ensure current status is valid
    if (newHash && !signedStatusOptions.includes(test.value.status)) {
      test.value.status = ""; // Or set to a default like 'Assinado'
    }
  }
);

const formatCommentDate = (date) => {
  return date ? moment(date).format("DD/MM/YYYY") : "";
};

const loadInitialData = async () => {
  loading.value = true;
  error.value = "";
  try {
    // Fetch the document being edited
    const docResponse = await axios.get(auth.apiUrl() + `doc/${docId.value}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    if (!docResponse.data) throw new Error("Documento não encontrado.");

    // Populate test ref with fetched document data
    test.value = {
      ...docResponse.data,
      date: docResponse.data.date
        ? moment(docResponse.data.date).format("YYYY-MM-DD")
        : "",
      validity: docResponse.data.validity
        ? moment(docResponse.data.validity).format("YYYY-MM-DD")
        : "",
      comments: docResponse.data.comments || [],
      // Reset fields potentially re-managed by user
      hash: "",
      position: "",
      mode: "",
      data: null, // Clear previous file data, user must re-upload if changing
    };

    // Fetch related Equipment (using equipmentId from route, assuming doc might not have latest)
    const equipmentResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    if (!equipmentResponse.data)
      throw new Error("Equipamento associado não encontrado.");
    equipment.value = equipmentResponse.data;
    // Assign facility based on fetched equipment
    if (equipmentResponse.data.facility?._id) {
      test.value.facility = {
        _id: equipmentResponse.data.facility._id,
        name: equipmentResponse.data.facility.name,
      };
    } else {
      console.warn("Facility info missing in equipment data");
      test.value.facility = {};
    }
    // Assign equipment simple info to test object for reference
    test.value.equipment = {
      _id: equipmentResponse.data._id,
      name: equipmentResponse.data.serialNumber,
    };

    // Ensure status options are correct based on initial hash (which we reset)
    statusOptions.value = test.value.hash
      ? signedStatusOptions
      : allStatusOptions;
  } catch (err) {
    console.error("Erro ao carregar dados de edição:", err);
    error.value = err.message || "Falha ao carregar dados para edição.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadInitialData();
});

const onFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  invalidFile.value = false; // Reset file error on new selection
  if (!files.length) return;
  createFile(files[0]);
};

const createFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    test.value.data = e.target.result; // Store file as base64
  };
  reader.readAsDataURL(file);
};

const generateCode = (event) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    const hashids = new Hashids(
      "AKJSBDalsdabskJASd",
      8,
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    );
    test.value.hash = hashids.encode(
      Math.floor(Math.random() * 100 + 1),
      Math.floor(Math.random() * 100 + 1),
      Math.floor(Math.random() * 100 + 1)
    );
    test.value.mode = test.value.mode || "last"; // Default if not set
    test.value.position = test.value.position || "bl"; // Default if not set
  } else {
    test.value.hash = "";
    test.value.mode = "";
    test.value.position = "";
  }
};

const addComment = () => {
  if (!commentaryText.value.trim()) return; // Ignore empty comments
  if (!test.value.comments) {
    test.value.comments = [];
  }
  test.value.comments.push({
    commentedBy: { name: currentUser.value.name, _id: currentUser.value.id },
    commentedAt: new Date(),
    text: commentaryText.value,
  });
  commentaryText.value = "";
  openCommentaryBox.value = false;
};

const register = async () => {
  error.value = "";
  invalidDate.value = !test.value.date;
  invalidStatus.value = !test.value.status;
  invalidConclusion.value = !test.value.conclusion;
  invalidValidity.value =
    test.value.validity && test.value.validity <= test.value.date;
  // invalidFile = !test.value.data; // Should re-upload be mandatory on edit? Let's assume not for now.

  let alertMessage = "";
  if (invalidDate.value) alertMessage += "É necessário selecionar uma data!\n";
  if (invalidValidity.value)
    alertMessage +=
      "A data de validade precisa ser superior à data do teste!\n";
  if (invalidConclusion.value)
    alertMessage += "É necessário selecionar uma conclusão!\n";
  if (invalidStatus.value)
    alertMessage += "É necessário selecionar um status!\n";
  // if (invalidFile.value) alertMessage += 'É necessário selecionar um arquivo PDF!\n';

  if (alertMessage) {
    alert(alertMessage.trim());
    return;
  }

  loading.value = true;

  const credentials = {
    _id: docId.value,
    name: test.value.name, // Keep original name format or clean? test.value.name.split(' ').join('_').split('/').join('-'),
    date: moment(test.value.date).toISOString(), // Use ISO format for backend
    mode: test.value.hash ? test.value.mode : "", // Only send if hash exists
    position: test.value.hash ? test.value.position : "", // Only send if hash exists
    updatedAt: new Date().toISOString(),
    updatedBy: { _id: currentUser.value.id, name: currentUser.value.name },
    hash: test.value.hash,
    status: test.value.status,
    conclusion: test.value.conclusion,
    facility: { _id: test.value.facility._id, name: test.value.facility.name },
    equipment: { _id: equipment.value._id, name: equipment.value.serialNumber },
    test: { _id: testTypeId.value, name: test.value.name }, // Send Test Type ID
    comments: test.value.comments || [],
    ...(test.value.validity && {
      validity: moment(test.value.validity).toISOString(),
    }),
    ...(test.value.data && { data: test.value.data }), // Include file data only if a new file was selected
  };

  try {
    // Assuming auth.editDocument handles the API call
    await auth.editDocument(credentials); // Removed 'this' and callback
    // Navigate on success
    router.push({
      path: `/equipments/${equipment.value.typeId}/${equipmentId.value}/${testTypeId.value}`,
    });
  } catch (err) {
    console.error("Erro ao editar documento:", err);
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Ocorreu um erro ao salvar as alterações.";
  } finally {
    loading.value = false;
  }
};
</script>
