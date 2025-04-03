<template>
  <Layout :title="pageTitle || 'Equipamento'" :loading="loading">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility?._id}/equipments`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility?._id}/equipments/${route.params.typeId}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ equipment.type }} - {{ equipment.serialNumber }}
      </router-link>
    </template>
    <template #header>
      <div class="flex gap-2">
        <router-link
          :to="`/facility/${facility?._id}/equipments/${route.params.typeId}`"
          class="px-4 py-2 h-10 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-1" />
          Voltar para Lista
        </router-link>
        <button
          v-if="!isEditing"
          @click="isEditing = !isEditing"
          class="px-4 py-2 border h-10 bg-green-500 text-white border-gray-300 rounded-md hover:bg-green-700 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-pencil" class="mr-1" />
          Editar
        </button>
      </div>
    </template>

    <div class="bg-white flex flex-col gap-6 rounded-lg shadow p-6">
      <template v-for="group in listOfTests" :key="group.typeOfTest">
        <section class="flex flex-col gap-6">
          <h1 class="text-3xl font-medium">{{ group.typeOfTest }}</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <template v-for="test in group.tests" :key="test._id">
              <CardLink
                :title="`${test.name}`"
                :href="`/equipments/${route.params.typeId}/${equipment._id}/${test._id}`"
                :className="CardLinkClass"
              />
              <CardLink
                v-if="equipment.type === 'Contador Geiger'"
                :title="`Reprodutibilidade`"
                :href="`/equipments/geigerCounter/${equipment._id}/reproductibility`"
                :className="CardLinkClass"
              />
            </template>
          </div>
        </section>
      </template>

      <form v-if="isEditing" @submit.prevent="saveEquipment" class="space-y-6">
        <h1 class="text-3xl font-medium my-6">Informações</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Type -->
          <div>
            <label
              for="type"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Instalação</label
            >
            <Input
              id="facility"
              v-model="facility.name"
              className="cursor-default"
              type="text"
              readonly
              required
            />
          </div>
          <div>
            <label
              for="type"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Tipo</label
            >
            <select
              v-if="isEditing"
              id="type"
              v-model="equipment.type"
              class="w-full border border-gray-300 bg-white rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Selecione o Tipo"
            >
              <option
                v-for="type in typeOptions"
                :key="type._id"
                :value="type.name"
              >
                {{ type.name }}
              </option>
            </select>
            <Input
              v-else
              id="type"
              v-model="equipment.type"
              type="text"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>

          <!-- Manufacturer -->
          <div>
            <label
              for="manufacturer"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Fabricante</label
            >
            <Input
              id="manufacturer"
              v-model="equipment.manufacturer"
              type="text"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>

          <!-- Model -->
          <div>
            <label
              for="model"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Modelo</label
            >
            <Input
              id="model"
              v-model="equipment.model"
              type="text"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>

          <!-- Serial Number -->
          <div>
            <label
              for="serialNumber"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Número de Série</label
            >
            <Input
              id="serialNumber"
              v-model="equipment.serialNumber"
              type="text"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
          </div>
          <!-- Warranty End -->
          <div>
            <label
              for="warrantyEnd"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Fim da Garantia</label
            >
            <Input
              v-if="!!equipment.certificateValidity"
              id="warrantyEnd"
              v-model="equipment.certificateValidity"
              type="date"
              :readonly="!isEditing"
              :class-name="readOnlyClass"
            />
            <p v-else class="text-gray-500 pt-4 text-lg italic">
              Não há garantia para este equipamento.
            </p>
          </div>

          <!-- Location -->
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelEditing"
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Salvar Equipamento
          </button>
        </div>
      </form>
      <div
        class="flex flex-col gap-2"
        v-if="equipment.type === 'Contador Geiger' && equipment.probe?.length"
      >
        <h1 class="text-3xl font-medium my-6">Sondas</h1>
        <section class="flex flex-col gap-2 text-lg">
          <p class="pl-3 text-gray-700">
            <FontAwesomeIcon icon="fa-solid fa-cubes" class="mr-1" />
            {{ equipment?.probe }}
          </p>
          <p
            class="pl-3 text-gray-700 cursor-default"
            v-if="
              equipment.probe === 'Exposição' ||
              equipment.probe === 'Exposição e Contaminação'
            "
            title="Número de Série da Sonda de Exposição"
          >
            <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-1" />
            {{ equipment.exposureProbeSerialNumber }} (Sonda de Exposição)
          </p>
          <p
            class="pl-3 text-gray-700 cursor-default"
            v-if="
              equipment.probe === 'Contaminação' ||
              equipment.probe === 'Exposição e Contaminação'
            "
            title="Número de Série da Sonda de Contaminação"
          >
            <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-1" />
            {{ equipment.contaminationProbeSerialNumber }} (Sonda de
            Contaminação)
          </p>
        </section>
      </div>
      <div v-if="equipment.type === 'Calibrador de Doses'"></div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { api } from "@/services/api";
import { cn } from "@/utils/cn";
import CardLink from "@/components/common/CardLink.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref(null);

const equipment = ref({
  name: "",
  type: "",
  status: "",
  manufacturer: "",
  model: "",
  serialNumber: "",
  purchaseDate: "",
  warrantyEnd: "",
  location: "",
  description: "",
  maintenanceSchedule: [],
  facility: null,
  probe: [],
});

const probe = ref({
  exposureProbeSerialNumber: "",
  contaminationProbeSerialNumber: "",
});

const CardLinkClass = cn(
  "border-l-4 border-l-teal-500 border-y border-r  max-w-full border-y-gray-100 border-r-gray-100"
);

const facility = ref({
  equipments: [],
  professionCNEN: "",
});
const typeOfEquipment = ref({});
const typeOptions = ref([]);

const listOfTests = ref([]);
const typesOfTest = ref([]);
const testErrors = ref(null);
const isNewEquipment = computed(() => !route.params.id);
const isEditing = ref(false);
const readOnlyClass = cn(
  "select-none",
  !!isEditing.value ? "cursor-text" : "cursor-default"
);

const pageTitle = computed(() => {
  if (isNewEquipment.value) {
    return "Adicionar Novo Equipamento";
  }
  if (equipment.value.type && equipment.value.serialNumber) {
    return `Equipamento: ${equipment.value.type} - ${equipment.value.serialNumber}`;
  }
  return "Equipamento"; // Fallback title
});

// --- Fetching Functions ---

const fetchEquipmentAndFacility = async () => {
  if (isNewEquipment.value) {
    loading.value = false;
    return;
  }

  error.value = null; // Reset error
  try {
    // Fetch Equipment
    const { data: equipmentData } = await api.get(
      `/equipment/${route.params.id}`
    );
    if (!equipmentData) {
      error.value = "Equipamento não encontrado.";
      loading.value = false;
      return;
    }
    equipment.value = equipmentData;

    // Fetch Facility using ID from equipment data
    if (!equipmentData.facility?._id) {
      console.warn("Equipment data does not contain facility ID.");
      loading.value = false;
      return;
    }

    const facilityId = equipmentData.facility._id;
    const { data: facilityData } = await api.get(`/facility/${facilityId}`);
    if (!facilityData) {
      error.value = "Instalação associada não encontrada.";
      loading.value = false;
      return;
    }
    facility.value = facilityData;
  } catch (err) {
    console.error("Error fetching equipment or facility:", err);
    error.value = "Erro ao carregar dados do equipamento ou instalação.";
    loading.value = false;
  }
};

const fetchTypeOfEquipment = async () => {
  if (!route.params.typeId) {
    console.warn("typeId not found in route params for fetchTypeOfEquipment");
    return;
  }
  try {
    const { data } = await api.get(`/typeOfEquipment/${route.params.typeId}`);
    typeOfEquipment.value = data;
  } catch (err) {
    console.error("Error fetching type of equipment:", err);
    // Handle error appropriately
  }
};

const fetchTypeOptions = async () => {
  try {
    const { data } = await api.get(`/typeOfEquipment`);
    typeOptions.value = data;
  } catch (err) {
    console.error("Error fetching type options:", err);
    // Handle error appropriately
  }
};

const loadTests = async () => {
  if (!route.params.typeId) {
    console.warn("typeId not found in route params for loadTests");
    listOfTests.value = [];
    typesOfTest.value = [];
    return;
  }

  listOfTests.value = [];
  typesOfTest.value = [];
  testErrors.value = null;

  try {
    const { data: testsData } = await api.get(
      `/test/typeOfEquipment/${route.params.typeId}`
    );

    if (!testsData || testsData.length === 0) {
      testErrors.value = "Nenhum teste encontrado para este tipo.";
      return;
    }

    const typesOfTestOrder = [
      "Anual",
      "Quadrianual",
      "Semestral",
      "Mensal",
      "Semanal",
    ];

    // Group tests by typeOfTest
    const groupedTests = {};
    testsData.forEach((test) => {
      if (!groupedTests[test.typeOfTest]) {
        groupedTests[test.typeOfTest] = [];
      }
      groupedTests[test.typeOfTest].push(test);
    });

    // Sort the types according to the defined order
    typesOfTest.value = Object.keys(groupedTests).sort((a, b) => {
      const indexA = typesOfTestOrder.indexOf(a);
      const indexB = typesOfTestOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    // Create the grouped structure for listOfTests
    listOfTests.value = typesOfTest.value.map((type) => ({
      typeOfTest: type,
      tests: groupedTests[type],
    }));
  } catch (err) {
    console.error("Error loading tests:", err);
    testErrors.value =
      err.response?.data?.message || err.message || "Erro ao carregar testes.";
  }
};

// --- Action Functions ---

const saveEquipment = async () => {
  error.value = null; // Reset error
  try {
    let response;
    const payload = toRaw(equipment.value); // Send clean data

    if (isNewEquipment.value) {
      response = await api.post("/equipment", payload);
    } else {
      response = await api.put(`/equipment/${route.params.id}`, payload);
    }

    equipment.value = response.data;
    isEditing.value = false;
    router.push(
      `/facility/${facility.value?._id}/equipments/${route.params.typeId}`
    );
  } catch (err) {
    console.error("Error saving equipment:", err);
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Erro ao salvar equipamento.";
    // Show error message to user
  }
};

const cancelEditing = () => {
  if (!isNewEquipment.value) {
    // Refetch original data if editing existing equipment
    fetchEquipmentAndFacility(); // Refetch both
  } else {
    // Optionally reset the form for new equipment
    // Or navigate back
    router.go(-1); // Go back if it was a new equipment form
  }
  isEditing.value = false;
};

// --- Functions adapted from Vue 2 methods ---

// Note: The original exclude function seemed to target the facility, not the equipment.
// Renaming to reflect this. If it should delete the *equipment*, adjust the endpoint.

// Requires a way to fetch sources first (e.g., fetchSources function)
// and the 'sources' ref needs to be populated.

onMounted(async () => {
  loading.value = true;
  await fetchEquipmentAndFacility();
  await fetchTypeOfEquipment();
  await fetchTypeOptions();
  await loadTests();

  // Set editing mode for new equipment
  if (isNewEquipment.value) {
    isEditing.value = true;
    // Pre-fill type based on route param if available and logical
    if (typeOfEquipment.value?.name) {
      equipment.value.type = typeOfEquipment.value.name;
    }
  }

  loading.value = false; // Ensure loading is set to false after all fetches
});
</script>
