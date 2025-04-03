<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
      <!-- Add edit/delete buttons here if needed, similar to doseCalibrator -->
    </div>

    <h2 class="text-lg font-semibold mb-3">Testes</h2>

    <section class="mb-6">
      <h3 class="text-md font-semibold mb-2">Mensais</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link v-if="equipment.linearityAndIntrinsicSpatialResolution" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Linearidade e Resolução Espacial Intrínseca</h4>
        </router-link>
        <router-link v-if="equipment.hightCountageIntrinsicUniformity" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Uniformidade Intrínseca de Alta Taxa de Contagem</h4>
        </router-link>
      </div>
    </section>

    <section class="mb-6">
      <h3 class="text-md font-semibold mb-2">Semestrais</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link v-if="equipment.angulation" :to="testRoute('angulation')" class="test-card border-eagle-green">
          <h4>Angulação dos Furos dos Colimadores</h4>
        </router-link>
        <router-link v-if="equipment.planeSensibility" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Sensibilidade Plana</h4>
        </router-link>
        <router-link v-if="equipment.overallPerformance" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Desempenho Geral</h4>
        </router-link>
        <router-link v-if="equipment.tableVelocity" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Velocidade de Mesa</h4>
        </router-link>
        <router-link v-if="equipment.maximumCountingRate" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Taxa Máxima de Contagem</h4>
        </router-link>
        <router-link v-if="equipment.energeticResolution" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Resolução Energética</h4>
        </router-link>
        <router-link v-if="equipment.spatialCoRegistrationForMultienergeticSources" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Co-registro Espacial para Fontes Multienergéticas</h4>
        </router-link>
        <router-link v-if="equipment.extrinsicUniformityOfHighCountingRate" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Uniformidade Extrínseca de Alta Taxa de Contagem</h4>
        </router-link>
      </div>
    </section>

    <section class="mb-6">
      <h3 class="text-md font-semibold mb-2">Anuais</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link v-if="equipment.asymmetricWindows" :to="testRoute('asymmetricWindow')" class="test-card border-eagle-green">
          <h4>Janelas Assimétricas</h4>
          <span v-if="asymmetricWindowTests.length === 0" class="text-yellow-600 text-xs flex items-center mt-1">
            <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" class="mr-1" /> Necessário realizar teste de aceite
          </span>
        </router-link>
        <router-link v-if="equipment.uniformityForDifferentRadioisotopes" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Uniformidade para Diferentes Radioisótopos</h4>
        </router-link>
        <router-link v-if="equipment.overallPerformance" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Desempenho Geral</h4>
        </router-link>
        <router-link v-if="equipment.linearityAndExtrinsicSpatialResolution" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Linearidade e Resolução Espacial Extrínseca</h4>
        </router-link>
      </div>
    </section>

    <section class="mb-8">
      <h3 class="text-md font-semibold mb-2">Aceite</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link v-if="equipment.pixelSize" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Tamanho de Pixel</h4>
        </router-link>
        <router-link v-if="equipment.shieldingSystem" :to="testRoute('reproductibility')" class="test-card border-eagle-green">
          <h4>Blindagem do Sistema</h4>
        </router-link>
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
       <div class="md:col-span-1 bg-white p-4 rounded shadow-md">
         <h5 class="mb-3 font-medium">Informações:</h5>
         <p class="pl-3 mb-2 flex items-center text-sm"><FontAwesomeIcon :icon="['fas', 'building']" class="mr-2 text-gray-600" aria-hidden="true" /> {{ facility.name }}</p>
         <p class="pl-3 mb-2 flex items-center text-sm"><FontAwesomeIcon :icon="['fas', 'cubes']" class="mr-2 text-gray-600" aria-hidden="true" /> {{ equipment.type }}</p>
         <p class="pl-3 mb-2 flex items-center text-sm"><FontAwesomeIcon :icon="['fas', 'hashtag']" class="mr-2 text-gray-600" /> {{ equipment.patrimonialNumber }} ({{ equipment.manufacturer }}/{{ equipment.model }}-{{ equipment.serialNumber }})</p>
         <p class="pl-3 mb-2 flex items-center text-sm"><FontAwesomeIcon :icon="['fas', 'map-marker-alt']" class="mr-2 text-gray-600" aria-hidden="true" /> {{ equipment.localization }}</p>
         <p class="pl-3 mb-2 flex items-center text-sm" v-if="equipment.calibrationCertificateNumber"><FontAwesomeIcon :icon="['fas', 'hashtag']" class="mr-2 text-gray-600" aria-hidden="true" /> {{ equipment.calibrationCertificateNumber }} - {{ equipment.certificateValidity }}</p>
         <p class="pl-3 flex items-center text-sm" v-if="equipment.mostUsedRadioisotope"><FontAwesomeIcon :icon="['fab', 'react']" class="mr-2 text-gray-600" aria-hidden="true" /> {{ equipment.mostUsedRadioisotope }}</p>
       </div>
     </div>

     <div v-if="loading" class="text-center mt-4">
        Carregando...
      </div>
      <div v-if="error" class="text-red-500 mt-4">
        {{ error }}
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '../../../../authentication/authentication';
// import permission from '../../../../authentication/permissions'; // Uncomment if needed for actions

const route = useRoute();
const router = useRouter(); // Use if navigation/actions are added

const equipmentId = computed(() => route.params.id);
const facility = ref({});
const equipment = ref({});
const asymmetricWindowTests = ref([]);
const currentUser = ref({}); // Keep if needed for permissions
const loading = ref(true);
const error = ref(null);

const pageTitle = computed(() => {
  if (!equipment.value.type) return 'Equipamento';
  const patrimonial = equipment.value.patrimonialNumber ? equipment.value.patrimonialNumber : '';
  const serial = equipment.value.serialNumber ? equipment.value.serialNumber : '';
  const separator = patrimonial && serial ? ' - ' : '';
  return `${equipment.value.type} ${patrimonial}${separator}${serial}`.trim();
});

const testRoute = (testType) => {
  // Example: '/equipments/gamaCamara/EQ_ID/testType'
  return `/equipments/gamaCamara/${equipmentId.value}/${testType}/`;
};

const loadAsymmetricWindowTests = async () => {
  try {
    const response = await axios.get(auth.apiUrl() + `equipment/${equipmentId.value}/gamaCamaraAsymmetricWindowTests/`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    asymmetricWindowTests.value = response.data || [];
  } catch (err) {
    console.error("Erro ao carregar testes de janela assimétrica:", err);
    // Set error state or keep it null, depending on desired behavior
    asymmetricWindowTests.value = [];
  }
};

const loadEquipmentAndFacilityData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const equipmentResponse = await axios.get(auth.apiUrl() + `equipment/${equipmentId.value}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });

    if (!equipmentResponse.data) {
      error.value = 'Equipamento não encontrado.';
      loading.value = false;
      return;
    }
    equipment.value = equipmentResponse.data;

    if (!equipment.value.facility?._id) {
      error.value = 'ID da instalação associada ao equipamento não encontrado.';
      loading.value = false;
      return;
    }

    const facilityResponse = await axios.get(auth.apiUrl() + `facility/${equipment.value.facility._id}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });

    if (!facilityResponse.data) {
      error.value = 'Instalação não encontrada.';
      loading.value = false;
      return;
    }
    facility.value = facilityResponse.data;

    await loadAsymmetricWindowTests();

  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    error.value = 'Falha ao carregar dados do equipamento ou instalação.';
    equipment.value = {};
    facility.value = {};
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  currentUser.value = auth.currentUser() || {}; // Keep if needed
  loadEquipmentAndFacilityData();
});

</script>