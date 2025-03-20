<template>
  <div class="flex items-center relative">
    <Input
      className="bg-gray-900 text-white rounded-none border-0 border-b"
      type="text"
      placeholder="Buscar..."
      v-model="searchQuery"
    >
      <FontAwesomeIcon icon="fa-solid fa-search" />
    </Input>
    <div
      v-if="loading"
      class="absolute top-[53px] left-0 bg-white max-w-[391px] w-[calc(100vw-50px)] border border-gray-100 p-6 text-gray-800"
    >
      <span
        ><FontAwesomeIcon :icon="['fas', 'circle-notch']" spin />
        Buscando...</span
      >
    </div>

    <div
      v-if="hasResults"
      class="absolute top-[53px] left-0 bg-white max-w-[391px] w-[calc(100vw-50px)] border border-gray-100 p-6 text-gray-800"
    >
      <router-link
        v-for="facility in list.facilities"
        :key="facility._id"
        :to="`/facility/${facility._id}`"
        replace
        class="block hover:text-green-600"
      >
        <span class="flex items-center gap-2"
          ><FontAwesomeIcon icon="fa-solid fa-building" />
          {{ formatName(facility.name) }}</span
        >
      </router-link>
      <router-link
        v-for="user in list.users"
        :key="user._id"
        :to="`/user/${user._id}`"
        replace
        class="block hover:text-green-600"
      >
        <span class="flex items-center gap-2"
          ><FontAwesomeIcon icon="fa-solid fa-user" />
          {{ formatName(user.name) }}</span
        >
      </router-link>
      <router-link
        v-for="equipment in list.equipments"
        :key="equipment._id"
        :to="equipmentPath(equipment)"
        replace
        class="block hover:text-green-600"
      >
        <span class="flex items-center gap-2"
          ><FontAwesomeIcon icon="fa-solid fa-cubes" />
          {{ formatEquipmentText(equipment) }}</span
        >
      </router-link>
      <a
        v-for="document in list.documents"
        :key="document._id"
        :href="document.path"
        target="_blank"
        class="block hover:text-green-600"
      >
        <span class="flex items-center gap-2"
          ><FontAwesomeIcon icon="fa-solid fa-file" />
          {{ formatName(document.name) }}</span
        >
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import auth from "@/services/authentication";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Input from "@/components/ui/Input.vue";

const searchQuery = ref("");
const loading = ref(false);
const list = ref({ users: [], equipments: [], facilities: [], documents: [] });
const route = useRoute();

const hasResults = computed(() => {
  return Object.values(list.value).some((array) => array.length > 0);
});

watch(searchQuery, (value) => {
  console.log(value);
  if (value.length > 3) {
    performSearch(value);
  } else {
    list.value = { users: [], equipments: [], facilities: [], documents: [] };
  }
});

watch(
  () => route.path,
  () => {
    list.value = { users: [], equipments: [], facilities: [], documents: [] };
  }
);

async function performSearch(value) {
  try {
    loading.value = true;
    const response = await axios.get(`${auth.apiUrl()}search/${value}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    list.value = response.data || {
      users: [],
      equipments: [],
      facilities: [],
      documents: [],
    };
  } catch (error) {
    console.error("Search error:", error);
    list.value = { users: [], equipments: [], facilities: [], documents: [] };
  } finally {
    loading.value = false;
  }
}

function formatName(name) {
  return name?.length > 35 ? `${name.substring(0, 32)}...` : name;
}

function formatEquipmentText(equipment) {
  const parts = [
    equipment.type,
    equipment.manufacturer,
    equipment.model,
    equipment.serialNumber,
  ];
  return formatName(parts.filter(Boolean).join(" - "));
}

function equipmentPath(equipment) {
  const base = "/equipments";
  return equipment.type === "Contador Geiger"
    ? `${base}/geigerCounter/${equipment._id}`
    : equipment.type === "Calibrador de Doses"
    ? `${base}/doseCalibrator/${equipment._id}`
    : `${base}/${equipment.typeId}/${equipment._id}`;
}
</script>
