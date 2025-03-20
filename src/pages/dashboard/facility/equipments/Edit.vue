<!-- src/components/Login.vue -->
<template>
  <Layout :title="`Editar Equipamento: ${equipment.patrimonialNumber || ''}`">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${route.params.id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="mx-2 text-teal-800 select-none">Equipamentos</span>
    </template>
    <template #header>
      <button
        class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
      >
        <RouterLink
          :to="`/facility/${facility._id}/equipments/${translateTypeParam(
            equipment.type
          )}`"
        >
          <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
        </RouterLink>
      </button>
    </template>

    <div class="flex flex-col gap-6 w-full mb-10">
      <!-- Error Alert -->
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      >
        <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" class="mr-2" />
        {{ errors }}
      </div>

      <!-- Basic Equipment Information -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-cubes" class="mr-2" /> Tipo
            </label>
            <select
              v-model="type"
              class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option v-for="type in types" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-map-marker" class="mr-2" />
              Localização
            </label>
            <Input
              v-model="localization"
              placeholder="ex.: laboratório"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-building" class="mr-2" />
              Fabricante
            </label>
            <Input
              v-model="manufacturer"
              placeholder="Fabricante"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-square" class="mr-2" />
              Modelo
            </label>
            <Input v-model="model" placeholder="Modelo" class="w-full" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" /> Número
              de Série
            </label>
            <Input
              v-model="serialNumber"
              placeholder="Número de Série"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" /> Número
              de Série Tubo
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input
              v-model="serialNumberTube"
              placeholder="Número de Série Tubo"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" /> Número
              Patrimonial
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input
              v-model="patrimonialNumber"
              placeholder="Número Patrimonial"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Equipment Type Specific Information -->
      <div v-if="type" class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-medium mb-4">
          Informações específicas - {{ type }}
        </h3>

        <!-- Calibrador de Doses -->
        <div v-if="type === 'Calibrador de Doses'">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-brands fa-react" class="mr-2" /> Isótopo
              mais utilizado neste calibrador
            </label>
            <select
              v-model="mostUsedRadioisotope"
              class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option
                v-for="isotope in mostUsedRadioisotopes"
                :key="isotope"
                :value="isotope"
              >
                {{ isotope }}
              </option>
            </select>
          </div>
        </div>

        <!-- Contador Geiger -->
        <div
          v-if="type === 'Contador Geiger'"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" /> Número
              do Certificado de Calibração
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input
              v-model="calibrationCertificateNumber"
              placeholder="Número do Certificado"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-regular fa-calendar" class="mr-2" />
              Validade do Certificado
              <span class="text-sm text-gray-500 ml-1">opcional</span>
            </label>
            <Input type="date" v-model="certificateValidity" class="w-full" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-brands fa-react" class="mr-2" /> Sondas
            </label>
            <select
              v-model="probe"
              class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option
                v-for="probeOption in probes"
                :key="probeOption"
                :value="probeOption"
              >
                {{ probeOption }}
              </option>
            </select>
          </div>

          <div
            v-if="probe === 'Exposição' || probe === 'Exposição e Contaminação'"
          >
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" /> Número
              de Série da Sonda de Exposição
            </label>
            <Input
              v-model="exposureProbeSerialNumber"
              placeholder="Número de Série"
              class="w-full"
            />
          </div>

          <div
            v-if="
              probe === 'Contaminação' || probe === 'Exposição e Contaminação'
            "
          >
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-hashtag" class="mr-2" /> Número
              de Série da Sonda de Contaminação
            </label>
            <Input
              v-model="contaminationProbeSerialNumber"
              placeholder="Número de Série"
              class="w-full"
            />
          </div>
        </div>

        <!-- Gama Camara -->
        <div v-if="type === 'Gama Camara'">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                <FontAwesomeIcon icon="fa-brands fa-react" class="mr-2" />
                Número de Detectores
              </label>
              <select
                v-model="numberOfDetectors"
                class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                <FontAwesomeIcon icon="fa-brands fa-react" class="mr-2" />
                Número de Pares de Colimadores
              </label>
              <select
                v-model="numberOfPairsOfCollimators"
                class="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>

          <div v-if="numberOfPairsOfCollimators > 0" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon="fa-brands fa-react" class="mr-2" /> Nome
              dos Colimadores
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="i in parseFloat(numberOfPairsOfCollimators)" :key="i">
                <Input
                  v-model="nameOfCollimators[i]"
                  :placeholder="`Colimador ${i}`"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="font-medium text-lg mb-4">
              Testes aplicáveis ao equipamento:
            </h4>

            <div class="bg-gray-50 p-4 rounded-md mb-4">
              <h5 class="font-medium mb-3">Mensais</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="hightCountageIntrinsicUniformity"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Uniformidade intrínseca de alta taxa de contagem</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="intrinsicSpatialResolutionAndLinearity"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Resolução e linearidade espacial intrínseca</span>
                </label>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-md mb-4">
              <h5 class="font-medium mb-3">Semestrais</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="angulation"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Angulação</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="planeSensibility"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Sensibilidade plana</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="overallPerformance"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Desempenho geral</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="tableVelocity"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Velocidade de mesa</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="maximumCountingRate"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Taxa máxima de contagem</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="energeticResolution"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Resolução energética</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="spatialCoRegistrationForMultienergeticSources"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Co-registro espacial para fontes multienergéticas</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="extrinsicUniformityOfHighCountingRate"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Uniformidade extrínseca de alta taxa de contagem</span>
                </label>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-md mb-4">
              <h5 class="font-medium mb-3">Anual</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="asymmetricWindows"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Janelas assimétricas</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="uniformityForDifferentRadioisotopes"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Uniformidade para diferentes radioisótopos</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="linearityAndExtrinsicSpatialResolution"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Linearidade e resolução espacial extrínseca</span>
                </label>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-md">
              <h5 class="font-medium mb-3">Aceite</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="pixelSize"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Tamanho de pixel</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="shieldingSystem"
                    class="h-4 w-4 text-green-600"
                  />
                  <span>Blindagem do sistema</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        class="py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
        @click="edit"
      >
        Editar Equipamento
      </button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";

const route = useRoute();
const router = useRouter();

// Data
const facility = ref({});
const equipment = ref({ serialNumber: "", type: "" });
const types = ref([]);
const type = ref("");
const typeId = ref("");
const listOfTypesOfEquipment = ref([]);
const mostUsedRadioisotopes = ref(["F(18)", "Ga(68)", "I(131)", "Tc(99m)"]);
const mostUsedRadioisotope = ref("");
const probes = ref(["Exposição", "Contaminação", "Exposição e Contaminação"]);
const probe = ref("");
const numberOfDetectors = ref(0);
const numberOfPairsOfCollimators = ref(0);
const nameOfCollimators = ref([]);
const visualInspect = ref(false);
const hightCountageIntrinsicUniformity = ref(false);
const intrinsicSpatialResolutionAndLinearity = ref(false);
const angulation = ref(false);
const planeSensibility = ref(false);
const overallPerformance = ref(false);
const tableVelocity = ref(false);
const maximumCountingRate = ref(false);
const energeticResolution = ref(false);
const spatialCoRegistrationForMultienergeticSources = ref(false);
const extrinsicUniformityOfHighCountingRate = ref(false);
const asymmetricWindows = ref(false);
const uniformityForDifferentRadioisotopes = ref(false);
const linearityAndExtrinsicSpatialResolution = ref(false);
const pixelSize = ref(false);
const shieldingSystem = ref(false);
const exposureProbeSerialNumber = ref("");
const contaminationProbeSerialNumber = ref("");
const manufacturer = ref("");
const model = ref("");
const serialNumber = ref("");
const serialNumberTube = ref("");
const patrimonialNumber = ref("");
const localization = ref("");
const calibrationCertificateNumber = ref("");
const certificateValidity = ref("");
const error = ref(false);
const errors = ref("");
const currentUser = ref(auth.currentUser());

// Watch for type changes to update typeId
watch(type, (newVal) => {
  for (let i = 0; i < listOfTypesOfEquipment.value.length; i++) {
    if (newVal === listOfTypesOfEquipment.value[i].name) {
      typeId.value = listOfTypesOfEquipment.value[i]._id;
      return;
    }
  }
});

// Load data on component mount
onMounted(async () => {
  try {
    const response = await axios.get(
      `${auth.apiUrl()}equipment/${route.params.equipmentId}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );

    if (response.data.length === 0) {
      errors.value = "Nenhum resultado encontrado";
      equipment.value = "";
      return;
    }

    // Set equipment data
    equipment.value = response.data;
    type.value = response.data.type;
    typeId.value = response.data.typeId;
    manufacturer.value = response.data.manufacturer;
    model.value = response.data.model;
    serialNumber.value = response.data.serialNumber;
    serialNumberTube.value = response.data.serialNumberTube;
    patrimonialNumber.value = response.data.patrimonialNumber;
    localization.value = response.data.localization;
    calibrationCertificateNumber.value =
      response.data.calibrationCertificateNumber;
    certificateValidity.value = response.data.certificateValidity;
    probe.value = response.data.probe;
    exposureProbeSerialNumber.value = response.data.exposureProbeSerialNumber;
    contaminationProbeSerialNumber.value =
      response.data.contaminationProbeSerialNumber;
    numberOfDetectors.value = response.data.numberOfDetectors;
    numberOfPairsOfCollimators.value = response.data.numberOfPairsOfCollimators;
    nameOfCollimators.value = response.data.nameOfCollimators;
    hightCountageIntrinsicUniformity.value =
      response.data.hightCountageIntrinsicUniformity;
    intrinsicSpatialResolutionAndLinearity.value =
      response.data.intrinsicSpatialResolutionAndLinearity;
    angulation.value = response.data.angulation;
    planeSensibility.value = response.data.planeSensibility;
    overallPerformance.value = response.data.overallPerformance;
    tableVelocity.value = response.data.tableVelocity;
    maximumCountingRate.value = response.data.maximumCountingRate;
    energeticResolution.value = response.data.energeticResolution;
    spatialCoRegistrationForMultienergeticSources.value =
      response.data.spatialCoRegistrationForMultienergeticSources;
    extrinsicUniformityOfHighCountingRate.value =
      response.data.extrinsicUniformityOfHighCountingRate;
    asymmetricWindows.value = response.data.asymmetricWindows;
    uniformityForDifferentRadioisotopes.value =
      response.data.uniformityForDifferentRadioisotopes;
    linearityAndExtrinsicSpatialResolution.value =
      response.data.linearityAndExtrinsicSpatialResolution;
    pixelSize.value = response.data.pixelSize;
    shieldingSystem.value = response.data.shieldingSystem;
    mostUsedRadioisotope.value = response.data.mostUsedRadioisotope;

    // Get facility data
    try {
      const facilityResponse = await axios.get(
        `${auth.apiUrl()}facility/${response.data.facility._id}`,
        { headers: { Authorization: `Bearer ${auth.getToken()}` } }
      );

      if (facilityResponse.data.length === 0) {
        errors.value = "Nenhum resultado encontrado";
        facility.value = "";
        return;
      }

      facility.value = facilityResponse.data;
    } catch (err) {
      errors.value =
        err.response?.data || "Erro ao carregar dados da instalação";
      facility.value = "";
    }

    // Get equipment types
    try {
      const typesResponse = await axios.get(`${auth.apiUrl()}typeOfEquipment`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });

      if (typesResponse.data.length === 0) {
        errors.value = "Nenhum resultado encontrado";
        listOfTypesOfEquipment.value = "";
        return;
      }

      listOfTypesOfEquipment.value = typesResponse.data;
      types.value = typesResponse.data.map((item) => item.name).sort();
    } catch (err) {
      errors.value =
        err.response?.data || "Erro ao carregar tipos de equipamento";
      listOfTypesOfEquipment.value = "";
    }
  } catch (err) {
    errors.value =
      err.response?.data || "Erro ao carregar dados do equipamento";
    equipment.value = "";
  }
});

// Methods
const translateTypeParam = (type) => {
  if (type === "Calibrador de Doses") {
    return "doseCalibrator";
  }

  if (type === "Gama Camara") {
    return "gamaCamara";
  }

  if (type === "Contador Geiger") {
    return "geigerCounter";
  }

  return "";
};

const edit = async () => {
  error.value = false;
  errors.value = "";

  const credentials = {
    _id: equipment.value._id,
    type: type.value,
    typeId: typeId.value,
    manufacturer: manufacturer.value,
    model: model.value,
    serialNumber: serialNumber.value,
    serialNumberTube: serialNumberTube.value,
    patrimonialNumber: patrimonialNumber.value,
    localization: localization.value,
    calibrationCertificateNumber: calibrationCertificateNumber.value,
    certificateValidity: certificateValidity.value,
    probe: probe.value,
    exposureProbeSerialNumber: exposureProbeSerialNumber.value,
    contaminationProbeSerialNumber: contaminationProbeSerialNumber.value,
    numberOfDetectors: numberOfDetectors.value,
    numberOfPairsOfCollimators: numberOfPairsOfCollimators.value,
    nameOfCollimators: nameOfCollimators.value,
    hightCountageIntrinsicUniformity: hightCountageIntrinsicUniformity.value,
    intrinsicSpatialResolutionAndLinearity:
      intrinsicSpatialResolutionAndLinearity.value,
    angulation: angulation.value,
    planeSensibility: planeSensibility.value,
    overallPerformance: overallPerformance.value,
    tableVelocity: tableVelocity.value,
    maximumCountingRate: maximumCountingRate.value,
    energeticResolution: energeticResolution.value,
    spatialCoRegistrationForMultienergeticSources:
      spatialCoRegistrationForMultienergeticSources.value,
    extrinsicUniformityOfHighCountingRate:
      extrinsicUniformityOfHighCountingRate.value,
    asymmetricWindows: asymmetricWindows.value,
    uniformityForDifferentRadioisotopes:
      uniformityForDifferentRadioisotopes.value,
    linearityAndExtrinsicSpatialResolution:
      linearityAndExtrinsicSpatialResolution.value,
    pixelSize: pixelSize.value,
    shieldingSystem: shieldingSystem.value,
    facility: { _id: facility.value._id },

    // Dose Calibrator
    mostUsedRadioisotope: mostUsedRadioisotope.value,
  };

  try {
    await auth.editEquipment(
      { error, errors, router },
      credentials,
      `/equipments/${translateTypeParam(type.value)}/${equipment.value._id}`
    );
  } catch (err) {
    error.value = true;
    errors.value = err.response?.data || "Erro ao atualizar equipamento";
  }
};
</script>
