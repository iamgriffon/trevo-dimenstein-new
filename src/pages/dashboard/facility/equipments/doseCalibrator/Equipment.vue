<template>
  <Layout :title="pageTitle" :loading="loading">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${route.params.id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${route.params.id}/equipments/${equipment.typeId}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ equipment.type }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="mx-2 text-teal-800 select-none">Dose Calibrator</span>
    </template>
    <template #header>
      <router-link
        :to="editLink"
        class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300"
      >
        <FontAwesomeIcon icon="fa-solid fa-edit" class="md:mr-2" />
        <span class="hidden md:inline">Editar</span>
      </router-link>
    </template>
    <div>
      <h2 class="font-semibold mb-3 text-3xl py-4">Testes</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <CardLink
          v-for="card in cards"
          :key="card.title"
          :title="card.title"
          :href="card.href"
          :className="cn('min-w-64', card.className)"
        />
      </div>
      <div class="w-fit my-4">
        <InfoCard :data="infos" title="Informações" />
      </div>

      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">Dados para Teste Diário</h3>
        <router-link
          v-if="permission?.canCreateFacility(currentUser)"
          class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300"
          :to="addSourceLink"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="md:mr-2" />
          <span class="hidden md:inline">Adicionar</span>
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          class="bg-white p-4 rounded shadow-md hover:shadow-theme transition-all duration-300 cursor-pointer"
          v-for="source in sources"
          :key="source._id"
        >
          <div class="flex justify-between items-start mb-3">
            <h5 class="font-medium">{{ source.radioisotope }}</h5>
            <div class="flex space-x-2">
              <router-link
                :to="editSourceLink(source._id)"
                v-if="permission?.canEditFacility(currentUser)"
              >
                <FontAwesomeIcon :icon="['fas', 'edit']" />
              </router-link>
              <button
                @click="excludeSource(source._id)"
                v-if="permission?.canExcludeFacility(currentUser)"
              >
                <FontAwesomeIcon :icon="['fas', 'trash-alt']" />
              </button>
            </div>
          </div>
          <p class="pl-3 mb-2 flex items-center text-sm">
            <FontAwesomeIcon
              :icon="['fas', 'hashtag']"
              class="mr-2 text-gray-500"
              aria-hidden="true"
            />
            Número de Série: {{ source.serialNumber }}
          </p>
          <p class="pl-3 mb-2 flex items-center text-sm">
            <FontAwesomeIcon
              :icon="['fas', 'asterisk']"
              class="mr-2 text-gray-500"
              aria-hidden="true"
            />
            Atividade Inicial: {{ source.initialActivity }} (µCi)
          </p>
          <p class="pl-3 flex items-center text-sm">
            <FontAwesomeIcon
              :icon="['fas', 'calendar']"
              class="mr-2 text-gray-500"
              aria-hidden="true"
            />
            Data da Atividade Inicial:
            {{ formatDate(source.initialActivityDate) }}
          </p>
        </div>
        <div v-if="sources.length === 0 && !loading" class="text-gray-500">
          Nenhuma fonte cadastrada.
        </div>
      </div>
      <div v-if="loading" class="text-center mt-4">Carregando...</div>
      <div v-if="error" class="text-red-500 mt-4">
        {{ error }}
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import CardLink from "@/components/common/CardLink.vue";
import { cn } from "@/utils/cn";
import InfoCard from "@/components/dashboard/facility/InfoCard.vue";
import Layout from "@/components/common/Layout.vue";

const route = useRoute();
const router = useRouter();

const equipmentId = computed(() => route.params.id);
const dateYear = ref(new Date().getFullYear());
const facility = ref({});
const equipment = ref({});
const sources = ref([]);
const currentUser = ref({});
const loading = ref(true);
const error = ref(null);

const pageTitle = computed(() => {
  if (!equipment.value.type) return "Equipamento";
  const patrimonial = equipment.value.patrimonialNumber
    ? equipment.value.patrimonialNumber
    : "";
  const serial = equipment.value.serialNumber
    ? equipment.value.serialNumber
    : "";
  const separator = patrimonial && serial ? " - " : "";
  return `${equipment.value.type} ${patrimonial}${separator}${serial}`;
});

const editLink = computed(
  () => `/facility/${facility.value._id}/equipment/${equipmentId.value}/edit`
);
const addSourceLink = computed(
  () => `/equipments/doseCalibrator/${equipmentId.value}/source/register`
);
const cards = computed(() => [
  {
    title: "Linearidade",
    href: `/equipments/doseCalibrator/${equipmentId.value}/linearity/`,
    className: "border-l-green-600",
  },
  {
    title: "Exatidão e Precisão",
    href: `/equipments/doseCalibrator/${equipmentId.value}/accuracyandprecision/`,
    className: "border-l-red-600",
  },
  {
    title: "Diário",
    href: `/equipments/doseCalibrator/${equipmentId.value}/daily/${dateYear.value}`,
    className: "border-l-blue-600",
  },
  {
    title: "Geometria",
    href: `/equipments/doseCalibrator/${equipmentId.value}/geometry/`,
    className: "border-l-purple-600",
  },
]);

const infos = computed(() => [
  {
    icon: "fa-building",
    label: "Instalação",
    value: facility.value.name,
  },
  {
    icon: "fa-cubes",
    label: "Tipo",
    value: equipment.value.type,
  },
  {
    icon: "fa-hashtag",
    label: "Patrimonial",
    value: `${equipment.value.patrimonialNumber} (${equipment.value.manufacturer}/${equipment.value.model}-${equipment.value.serialNumber})`,
  },
  {
    icon: "fa-map-marker-alt",
    label: "Localização",
    value: equipment.value.localization,
  },
  {
    icon: "fa-atom",
    label: "Radioisótopo mais utilizado",
    value: equipment.value.mostUsedRadioisotope,
  },
]);

const editSourceLink = (sourceId) => {
  return `/equipments/doseCalibrator/${equipmentId.value}/source/${sourceId}/edit`;
};

const formatDate = (date) => {
  if (!date) return "";
  return moment(date).format("DD/MM/YY");
};

const loadFacilitySources = async () => {
  error.value = null;
  try {
    const response = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}/doseCalibratorSources/`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );
    sources.value = response.data || [];
  } catch (err) {
    console.error("Erro ao carregar fontes:", err);
    error.value = "Falha ao carregar dados das fontes.";
    sources.value = [];
  }
};

const loadEquipmentAndFacilityData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const equipmentResponse = await axios.get(
      auth.apiUrl() + `equipment/${equipmentId.value}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );

    if (!equipmentResponse.data) {
      error.value = "Equipamento não encontrado.";
      loading.value = false;
      return;
    }
    equipment.value = equipmentResponse.data;
    console.log(equipmentResponse.data);

    if (!equipment.value.facility?._id) {
      error.value = "ID da instalação associada ao equipamento não encontrado.";
      loading.value = false;
      return;
    }

    const facilityResponse = await axios.get(
      auth.apiUrl() + `facility/${equipment.value.facility._id}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );

    if (!facilityResponse.data) {
      error.value = "Instalação não encontrada.";
      loading.value = false;
      return;
    }
    facility.value = facilityResponse.data;

    await loadFacilitySources();
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    error.value = "Falha ao carregar dados do equipamento ou instalação.";
    equipment.value = {};
    facility.value = {};
  } finally {
    loading.value = false;
  }
};

const exclude = async () => {
  if (confirm("Tem certeza que deseja excluir esta instalação?")) {
    try {
      await auth.excludeFacility(facility.value, "/facility");
      router.push("/facility");
    } catch (err) {
      console.error("Erro ao excluir instalação:", err);
    }
  }
};

const excludeSource = async (id) => {
  if (confirm("Tem certeza que deseja excluir esta fonte?")) {
    try {
      await auth.excludeDoseCalibratorSource({ _id: id });
      await loadFacilitySources();
    } catch (err) {
      console.error("Erro ao excluir fonte:", err);
    }
  }
};

onMounted(() => {
  currentUser.value = auth.currentUser() || {};
  loadEquipmentAndFacilityData();
});
</script>
