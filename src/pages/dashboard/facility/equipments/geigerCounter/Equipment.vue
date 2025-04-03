<template>
  <Layout title="Testes" :loading="loading">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}`"
        class="px-2 text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name || "Instalação" }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/equipments/${equipment.typeId}/${equipment._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ pageTitle }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <span class="text-teal-800 select-none">Equipamento</span>
    </template>
    <template #header>
      <router-link
        v-if="permission.canCreateDocuments(currentUser)"
        class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300"
        :to="`/equipments/geigerCounter/${equipmentId}/edit`"
      >
        <FontAwesomeIcon icon="fa-solid fa-pen-to-square" class="md:mr-2" />
        <span class="hidden md:inline">Editar</span>
      </router-link>
    </template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <CardLink
        :href="testRoute('reproductibility')"
        title="Reprodutibilidade"
        className="border-l-green-500"
      >
      </CardLink>
    </div>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <InfoCard :data="infoCardData" title="Informações" />
      <InfoCard
        v-if="!!equipment.probe?.length"
        :data="probeCardData"
        title="Sondas"
      />
    </section>

    <div v-if="error" class="text-red-500 mt-4">
      {{ error }}
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Layout from "@/components/common/Layout.vue";
import auth from "@/services/authentication";
import CardLink from "@/components/common/CardLink.vue";
import InfoCard from "@/components/dashboard/facility/InfoCard.vue";
import permission from "@/services/permissions";
import { api } from "@/services/api";
const route = useRoute();

const equipmentId = computed(() => route.params.id);
const facility = ref({});
const equipment = ref({});
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
  return `${equipment.value.type} ${patrimonial}${separator}${serial}`.trim();
});

const editLink = computed(
  () =>
    `/dashboard/facility/${facility.value._id}/equipment/${equipmentId.value}/edit`
);

const testRoute = (testType) => {
  return `/equipments/geigerCounter/${equipmentId.value}/${testType}`;
};

const loadEquipmentAndFacilityData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const equipmentResponse = await api.get(`equipment/${equipmentId.value}`);

    if (!equipmentResponse.data) {
      error.value = "Equipamento não encontrado.";
      loading.value = false;
      return;
    }
    equipment.value = equipmentResponse.data;

    if (!equipment.value.facility?._id) {
      error.value = "ID da instalação associada ao equipamento não encontrado.";
      loading.value = false;
      return;
    }

    const facilityResponse = await api.get(
      `facility/${equipment.value.facility._id}`
    );

    if (!facilityResponse.data) {
      error.value = "Instalação não encontrada.";
      loading.value = false;
      return;
    }
    facility.value = facilityResponse.data;
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    error.value = "Falha ao carregar dados do equipamento ou instalação.";
    equipment.value = {};
    facility.value = {};
  } finally {
    loading.value = false;
  }
};

const infoCardData = computed(() => [
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
    label: "Patrimônio",
    value: equipment.value.patrimonialNumber,
  },
  {
    icon: "fa-map-marker-alt",
    label: "Localização",
    value: equipment.value.localization,
  },
  {
    icon: "fa-hashtag",
    label: "Certificado de calibração",
    value: equipment.value.calibrationCertificateNumber,
  },
]);

const probeCardData = computed(() => [
  {
    icon: "fa-wave-square",
    label: "Tipo",
    value: equipment.value.probe,
  },
  {
    icon: "fa-hashtag",
    label: "Sonda Exposição",
    value: equipment.value.exposureProbeSerialNumber,
  },
  {
    icon: "fa-hashtag",
    label: "Sonda Contaminação",
    value: equipment.value.contaminationProbeSerialNumber,
  },
]);

const fetchUser = async () => {
  const response = await api.get(`user/${auth.currentUser().id}`);
  currentUser.value = response.data;
};

onMounted(() => {
  fetchUser();
  loadEquipmentAndFacilityData();
});
</script>
