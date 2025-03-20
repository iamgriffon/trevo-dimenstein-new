<template>
  <div>
    <div
      v-show="isDragging"
      class="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
    >
      <h3 class="text-white text-3xl font-bold">
        Solte o arquivo para fazer o upload!
      </h3>
    </div>
    <div v-if="firstStep">
      <div class="w-full" enctype="multipart/form-data">
        <div
          class="mx-3 p-6 rounded-lg"
          :class="{ 'border-red-500 bg-red-50': invalidFile }"
        >
          <div
            class="border-dashed border-3 border-gray-300 rounded-lg text-center px-12 py-6 border-2 transition-all hover:border-gray-500"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
          >
            <label class="w-full h-full flex flex-col gap-2 cursor-pointer">
              <p class="flex items-center justify-center gap-2 mb-0">
                <FontAwesomeIcon
                  icon="fa-solid fa-archive"
                  aria-hidden="true"
                ></FontAwesomeIcon>
                Arquivo
              </p>
              <small class="text-gray-500"
                >Clique para fazer o upload do arquivo. Precisa estar no formato
                .pdf</small
              >
              <Input
                type="file"
                accept=".pdf"
                className="hidden"
                @change="handleFileInputChange"
              />
              <hr class="my-4" />
              <section class="text-gray-500 text-left text-sm font-medium">
                Nomeie o arquivo da forma correta para realizar os
                preenchimentos automáticos:
                <ul class="list-disc pl-5 mt-2">
                  <li>Data de realização (formato: YYYY-mm-DD)</li>
                  <li>
                    Tipo do Teste (ex.: CQ Semestral), separado por hífens
                  </li>
                  <li>Tipo do Equipamento (ex.: Mamografia)</li>
                  <li>Marca (ex.: Siemens)</li>
                  <li>Modelo (ex.: Mammomat 3000)</li>
                  <li>Número de Série (ex.: 12345)</li>
                </ul>
                Exemplo de nome padrão completo: 25-08-2020-CQ
                Semestral-Mamografia Siemens Mammomat 3000 12345
              </section>
            </label>
          </div>
        </div>
      </div>
    </div>

    <Modal
      :visible="secondStep"
      title="Enviar Documento"
      @update:visible="closeModal"
    >
      <div v-if="!loading && !success">
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          v-if="error"
        >
          <FontAwesomeIcon
            icon="fa-solid fa-exclamation-circle"
            aria-hidden="true"
          ></FontAwesomeIcon>
          {{ errors }}
        </div>
        <div class="flex flex-col gap-4">
          <div class="w-full">
            <label class="block mb-2 font-medium"
              ><FontAwesomeIcon
                icon="fa-solid fa-file"
                aria-hidden="true"
              ></FontAwesomeIcon>
              Nome</label
            >
            <Input type="text" placeholder="Nome" v-model="test.fileName" />
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-4 mt-4">
          <div class="w-full md:w-1/2">
            <label class="block mb-2 font-medium"
              ><FontAwesomeIcon
                icon="fa-solid fa-calendar-alt"
                aria-hidden="true"
              ></FontAwesomeIcon>
              Data</label
            >
            <Input type="date" v-model="test.date" :error="invalidDate" />
          </div>
          <div class="w-full md:w-1/2">
            <label class="block mb-2 font-medium">
              <FontAwesomeIcon
                icon="fa-solid fa-calendar-alt"
                aria-hidden="true"
              ></FontAwesomeIcon>
              Validade
              <small class="text-gray-500 ml-2">opcional</small>
            </label>
            <Input
              type="date"
              v-model="test.validity"
              :error="invalidValidity"
            />
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full p-3">
            <span class="flex items-center gap-2 font-medium mb-2"
              ><FontAwesomeIcon icon="fa-solid fa-building" /> Instalação:</span
            >
            <div class="relative">
              <select
                v-model="facility"
                class="appearance-none w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option
                  v-for="option in facilityOptions"
                  :key="option._id"
                  :value="option"
                >
                  {{ option.name }}
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
              >
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full p-3">
            <span class="flex items-center gap-2 font-medium mb-2"
              ><i class="fas fa-cubes"></i> Equipamento:</span
            >
            <div class="relative">
              <select
                v-model="equipment.fullName"
                @change="handleEquipmentChange"
                class="appearance-none w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option
                  v-for="option in equipmentOptions"
                  :key="option._id"
                  :value="option.fullName"
                >
                  {{ option.name }}
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
              >
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full p-3">
            <span class="flex items-center gap-2 font-medium mb-2"
              ><i class="fas fa-cubes"></i> Teste:</span
            >
            <div class="relative">
              <select
                v-model="test.name"
                @change="handleTestChange"
                class="appearance-none w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option
                  v-for="option in typesOfTestOptions"
                  :key="option._id"
                  :value="option.testName"
                >
                  {{ option.name }}
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
              >
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
        <hr class="my-6" />
        <div class="mb-6" v-if="canSign">
          <div class="p-3">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                :checked="test.hash !== ''"
                @click="generateCode()"
              />
              <label class="flex items-center gap-2">
                <i class="fa fa-qrcode" aria-hidden="true"></i> Adicionar
                assinatura e código
                <small v-if="test.hash" class="text-gray-500 ml-2">{{
                  "código: " + test.hash
                }}</small>
              </label>
            </div>
            <div v-if="test.hash" class="mt-4">
              <strong class="block mb-2">Posição da Assinatura:</strong>
              <div class="grid grid-cols-4 gap-4">
                <button
                  class="bg-white border border-green-600 p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  :class="{ 'ring-2 ring-green-600': test.position == 'tl' }"
                  @click="test.position = 'tl'"
                >
                  <img class="w-full" src="/static/top_left.png" />
                </button>
                <button
                  class="bg-white border border-green-600 p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  :class="{ 'ring-2 ring-green-600': test.position == 'tr' }"
                  @click="test.position = 'tr'"
                >
                  <img class="w-full" src="/static/top_right.png" />
                </button>
                <button
                  class="bg-white border border-green-600 p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  :class="{ 'ring-2 ring-green-600': test.position == 'bl' }"
                  @click="test.position = 'bl'"
                >
                  <img class="w-full" src="/static/bottom_left.png" />
                </button>
                <button
                  class="bg-white border border-green-600 p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  :class="{ 'ring-2 ring-green-600': test.position == 'br' }"
                  @click="test.position = 'br'"
                >
                  <img class="w-full" src="/static/bottom_right.png" />
                </button>
              </div>
            </div>
            <div v-if="test.hash" class="mt-4">
              <strong class="block mb-2">Páginas Assinadas:</strong>
              <div class="flex justify-center">
                <div class="inline-flex">
                  <button
                    @click="test.mode = 'first'"
                    class="px-4 py-2 border border-green-600 hover:bg-green-100 transition-colors"
                    :class="{ 'bg-green-600 text-white': test.mode == 'first' }"
                  >
                    primeira
                  </button>
                  <button
                    @click="test.mode = 'second'"
                    class="px-4 py-2 border border-green-600 hover:bg-green-100 transition-colors"
                    :class="{
                      'bg-green-600 text-white': test.mode == 'second',
                    }"
                  >
                    segunda
                  </button>
                  <button
                    @click="test.mode = 'all'"
                    class="px-4 py-2 border border-green-600 hover:bg-green-100 transition-colors"
                    :class="{ 'bg-green-600 text-white': test.mode == 'all' }"
                  >
                    todas
                  </button>
                  <button
                    @click="test.mode = 'last'"
                    class="px-4 py-2 border border-green-600 hover:bg-green-100 transition-colors"
                    :class="{ 'bg-green-600 text-white': test.mode == 'last' }"
                  >
                    última
                  </button>
                  <button
                    @click="
                      showModeNumber = !showModeNumber;
                      test.mode = 1;
                    "
                    class="px-4 py-2 border border-green-600 hover:bg-green-100 transition-colors"
                    :class="{
                      'bg-green-600 text-white': Number.isInteger(test.mode),
                    }"
                  >
                    outro
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-4 mt-3" v-if="showModeNumber">
                <label class="w-1/2">número da página:</label>
                <div class="w-1/2">
                  <Input type="number" min="1" v-model="test.mode" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mt-4"
          :class="{
            'border border-red-500 bg-red-50 rounded-lg': invalidStatus,
          }"
        >
          <div class="w-full p-3">
            <span class="flex items-center gap-2 font-medium mb-2"
              ><FontAwesomeIcon icon="fa-solid fa-check-square" /> Status:</span
            >
            <div class="relative">
              <select
                v-model="test.status"
                class="appearance-none w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                :class="{ 'border-red-500': invalidStatus }"
              >
                <option
                  v-for="option in statusOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
              >
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mt-4"
          :class="{
            'border border-red-500 bg-red-50 rounded-lg': invalidConclusion,
          }"
          v-if="conclusionOptions.length > 0"
        >
          <div class="w-full p-3">
            <span class="flex items-center gap-2 font-medium mb-2"
              ><FontAwesomeIcon icon="fa-solid fa-check-circle" />
              Conclusão:</span
            >
            <div class="relative">
              <select
                v-model="test.conclusion"
                class="appearance-none w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                :class="{ 'border-red-500': invalidConclusion }"
              >
                <option
                  v-for="option in conclusionOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
              >
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <div v-if="test.comments.length > 0" class="mt-6">
          <div
            v-for="commentary in test.comments"
            :key="commentary.commentedAt"
          >
            <div class="border rounded-lg p-4 mb-3 shadow-sm">
              <div class="px-3">
                <span class="flex items-center gap-2"
                  ><FontAwesomeIcon icon="fa-solid fa-comment" />
                  {{ commentary.commentedBy.name }} -
                  {{ formatDate(commentary.commentedAt) }}</span
                >
              </div>
              <div class="px-3 mt-2">
                <p>{{ commentary.text }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="openCommentaryBox" class="mt-6">
          <div class="border rounded-lg p-4 mb-3 shadow-sm">
            <div class="px-3">
              <div class="flex justify-between items-center w-full">
                <div>
                  <span class="font-medium">Comentário:</span>
                </div>
                <div class="text-right">
                  <small class="text-gray-500"
                    >{{ currentUser.name }} - {{ formatDate(today) }}</small
                  >
                </div>
              </div>
              <div class="mt-3">
                <textarea
                  class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  rows="4"
                  v-model="commentaryText"
                ></textarea>
              </div>
              <button
                class="mt-3 px-4 py-2 border border-green-600 text-green-800 hover:bg-green-600 hover:text-white transition-colors mx-auto block"
                @click="addComment"
              >
                Comentar
              </button>
            </div>
          </div>
        </div>

        <div class="flex py-6 gap-3">
          <button
            class="px-4 py-2 border border-green-600 text-green-800 hover:bg-green-600 hover:text-white transition-colors"
            @click="openCommentaryBox = true"
          >
            Adicionar comentário
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors flex-grow"
            @click="register()"
          >
            Enviar documento
          </button>
        </div>
      </div>
      <div v-if="loading" class="flex flex-col items-center justify-center p-8">
        <p class="text-center mb-4">Fazendo upload do documento...</p>
        <img class="max-w-xs" src="/static/img/loading.gif" />
      </div>
      <div v-if="success" class="flex flex-col items-center justify-center p-8">
        <p class="text-center mb-4">Upload realizado com sucesso!</p>
        <img class="max-w-xs mx-auto" src="/static/img/check-circle.gif" />
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import moment from "moment-timezone";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Hashids from "hashids";
import { useRouter } from "vue-router";
import Input from "@/components/ui/Input.vue";
import Modal from "@/components/common/Modal.vue";
import { cn } from "@/utils/cn";

const props = defineProps({
  show: Boolean,
  facilityOptions: Array,
  equipmentOptions: Array,
  typesOfTestOptions: Array,
  redirect: String,
});

const router = useRouter();

// State variables
const today = ref(new Date());
const loading = ref(false);
const firstStep = ref(true);
const secondStep = ref(false);
const success = ref(false);
const showModeNumber = ref(false);
const files = ref([]);
const currentUser = ref(auth.currentUser());
const facility = ref({});
const equipment = reactive({
  _id: "",
  name: "",
});
const test = reactive({
  name: "",
  date: "",
  validity: "",
  uploadedAt: "",
  _id: "",
  facility: {},
  equipment: {},
  hash: "",
  mode: "",
  position: "",
  conclusion: "",
  status: "",
  comments: [],
  fileName: "",
  data: null,
  testName: "",
});

const statusOptions = ref(["Em andamento", "Corrigir", "Falta assinar"]);
const conclusionOptions = ref([
  "Satisfatório",
  "Satisfatório com observações",
  "Insatisfatório",
]);
const error = ref("");
const errors = ref("");
const invalidDate = ref(false);
const invalidFile = ref(false);
const invalidStatus = ref(false);
const invalidConclusion = ref(false);
const invalidValidity = ref(false);
const openCommentaryBox = ref(false);
const commentaryText = ref("");
const isDragging = ref(false);

// Computed properties
const canSign = computed(() => permission.canSign(currentUser.value));

// Watch for hash changes to update statusOptions
watch(
  () => test.hash,
  (newVal) => {
    if (newVal) {
      statusOptions.value = ["Assinado", "Liberado"];
    } else if (permission.canSign(currentUser.value)) {
      statusOptions.value = [
        "Em andamento",
        "Corrigir",
        "Falta assinar",
        "Assinado",
        "Liberado",
      ];
    } else {
      statusOptions.value = ["Em andamento", "Corrigir", "Falta assinar"];
    }
  }
);

// Watch for show prop changes
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      secondStep.value = true;
    }
  }
);

// Lifecycle hooks
onMounted(() => {
  if (permission.canSign(currentUser.value)) {
    statusOptions.value = [
      "Em andamento",
      "Corrigir",
      "Falta assinar",
      "Assinado",
      "Liberado",
    ];
  } else {
    statusOptions.value = ["Em andamento", "Corrigir", "Falta assinar"];
  }
});

// Methods
const closeModal = () => {
  secondStep.value = false;
};

const register = () => {
  const credentials = {
    name: test.fileName.split(" ").join("_").split("/").join("-"),
    data: test.data,
    fileName: test.fileName,
    testName: test.testName,
    equipment: {
      _id: equipment._id,
      serialNumber: equipment.serialNumber,
    },
    test: {
      _id: test._id,
      name: test.name,
    },
    facility: {
      _id: facility.value._id,
      name: facility.value.name,
    },
    date: test.date,
    uploadedAt: new Date(),
    uploadedBy: {
      _id: currentUser.value.id,
      name: currentUser.value.name,
    },
    comments: test.comments,
  };

  if (test.hash && test.hash !== "") {
    credentials.hash = test.hash;
    credentials.position = test.position;
    credentials.mode = test.mode;
  }

  if (!test.fileName) {
    alert("É necessário inserir um nome para o arquivo!");
    return;
  }

  if (!test.date) {
    alert("É necessário inserir uma data para o teste!");
    invalidDate.value = true;
  } else {
    invalidDate.value = false;
  }

  if (test.validity) {
    if (test.validity <= test.date) {
      alert("A data de validade precisa ser superior à data do teste!");
      invalidValidity.value = true;
    } else {
      invalidValidity.value = false;
      credentials.validity = moment(test.validity);
    }
  }

  if (!test.conclusion) {
    alert("É necessário selecionar uma conclusão!");
    invalidConclusion.value = true;
  } else {
    invalidConclusion.value = false;
  }

  if (!test.status) {
    alert("É necessário selecionar um status!");
    invalidStatus.value = true;
  } else {
    invalidStatus.value = false;
  }

  if (
    !invalidFile.value &&
    !invalidConclusion.value &&
    !invalidDate.value &&
    !invalidStatus.value &&
    !invalidValidity.value
  ) {
    loading.value = true;
    auth.registerDocument(this, credentials, () => {
      loading.value = false;
      success.value = true;
      if (props.redirect) {
        setTimeout(() => {
          router.push({ path: props.redirect });
        }, 2000);
      }
    });
  }
};

const handleEquipmentChange = (event) => {
  const selectedFullName = event.target.value;
  const selectedEquipment = props.equipmentOptions.find(
    (e) => e.fullName === selectedFullName
  );

  if (selectedEquipment) {
    equipment._id = selectedEquipment._id;
    equipment.serialNumber = selectedEquipment.serialNumber;
  }
};

const handleTestChange = (event) => {
  const selectedName = event.target.value;
  const selectedTest = props.typesOfTestOptions.find(
    (t) => t.testName === selectedName
  );

  if (selectedTest) {
    test.name = selectedTest.testName;
    test.testName = selectedTest.testName;
    test._id = selectedTest._id;
  }
};

const generateCode = () => {
  if (test.hash === "") {
    const hashids = new Hashids(
      "AKJSBDalsdabskJASd",
      8,
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    );
    test.hash = hashids.encode(
      Math.floor(Math.random() * 100 + 1),
      Math.floor(Math.random() * 100 + 1),
      Math.floor(Math.random() * 100 + 1)
    );
    test.mode = "last";
    test.position = "bl";
  } else {
    test.hash = "";
  }
};

const handleFileInputChange = (event) => {
  const files = event.target.files;
  if (!files.length) return;

  const file = files[0];

  // File validation
  if (!/\.(pdf)$/i.test(file.name)) {
    alert("Formato inválido. Só é possível realizar upload de arquivos .pdf.");
    return;
  }

  createFile(file, file.name);
};

const handleFileDrop = (event) => {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (!files.length) return;

  const file = files[0];

  // File validation
  if (!/\.(pdf)$/i.test(file.name)) {
    alert("Formato inválido. Só é possível realizar upload de arquivos .pdf.");
    return;
  }

  createFile(file, file.name);
};

const createFile = (fileData, fileName) => {
  const reader = new FileReader();

  reader.onload = async (e) => {
    const parsedName = await parseName(fileName);

    if (parsedName) {
      test.fileName = fileName.replace(".pdf", "");
      test.data = e.target.result;
      test.date = parsedName.date;
      test.testName = parsedName.test.testName;
      test.name = parsedName.test.name;
      test.fullName = parsedName.test.fullName;
      test._id = parsedName.test._id;
      facility.value = parsedName.facility;
      equipment._id = parsedName.equipment._id;
      equipment.serialNumber = parsedName.equipment.serialNumber;
    }
  };
  reader.readAsDataURL(fileData);
};

const parseName = (fileName) => {
  return new Promise((resolve) => {
    let error = "";
    let result = {
      date: "",
      equipment: { _id: "", serialNumber: "" },
      test: { _id: "", testName: "" },
      facility: { _id: "", name: "" },
    };

    // Parse date:
    const dateAsList = fileName.substring(0, 10).split("-");
    const date = new Date(
      dateAsList[2] + "-" + dateAsList[1] + "-" + dateAsList[0]
    );
    if (date instanceof Date && !isNaN(date)) {
      result.date = dateAsList[2] + "-" + dateAsList[1] + "-" + dateAsList[0];
    } else {
      error += "- Data inválida!\n";
    }

    // one option cases:
    if (props.facilityOptions.length === 1) {
      result.facility = {
        name: props.facilityOptions[0].name,
        _id: props.facilityOptions[0]._id,
      };
    }

    if (props.equipmentOptions.length === 1) {
      result.equipment = {
        fullName: props.equipmentOptions[0].fullName,
        serialNumber: props.equipmentOptions[0].serialNumber,
        _id: props.equipmentOptions[0]._id,
      };
    }

    if (props.typesOfTestOptions.length === 1) {
      result.test = {
        _id: props.typesOfTestOptions[0]._id,
        name: props.typesOfTestOptions[0].testName,
        testName: props.typesOfTestOptions[0].testName,
        fullName: props.typesOfTestOptions[0].name,
      };
    }

    const splittedFileName = fileName.split("-");
    if (splittedFileName.length === 5) {
      const equipmentFullName = splittedFileName[4].split(".")[0];
      const foundEquipment = props.equipmentOptions.filter(
        (e) =>
          e.type +
            " " +
            e.manufacturer +
            " " +
            e.model +
            " " +
            e.serialNumber ===
          equipmentFullName
      )[0];

      if (foundEquipment) {
        result.equipment = {
          serialNumber: foundEquipment.serialNumber,
          _id: foundEquipment._id,
          fullName: equipmentFullName,
        };
      } else {
        error += "- Nome do equipamento inválido!\n";
      }

      const typeOfTestName = splittedFileName[3];
      const foundTypeOfTest = props.typesOfTestOptions.filter(
        (e) => e.name === foundEquipment.type + " - " + typeOfTestName
      )[0];

      if (foundTypeOfTest) {
        console.log(foundTypeOfTest);
        result.test = {
          _id: foundTypeOfTest._id,
          testName: foundTypeOfTest.testName,
          fullName: foundTypeOfTest.name,
          name: foundTypeOfTest.testName,
        };
      } else {
        error += "- Nome do teste inválido!\n";
      }
    } else {
      error += "- Nome do arquivo é inválido!\n";
    }

    if (error !== "") {
      if (
        confirm(
          `Problemas ao reconhecer as variáveis no nome do arquivo!\n${error}Quer continuar mesmo assim?`
        )
      ) {
        firstStep.value = false;
        secondStep.value = true;
        resolve(result);
      }
    } else {
      result.ok = true;
      firstStep.value = false;
      secondStep.value = true;
      resolve(result);
    }
  });
};

const addComment = () => {
  test.comments.push({
    commentedBy: { name: auth.currentUser().name, _id: auth.currentUser().id },
    commentedAt: new Date(),
    text: commentaryText.value,
  });
  openCommentaryBox.value = false;
  commentaryText.value = "";
};

// Helper function to format dates
const formatDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
};
</script>
