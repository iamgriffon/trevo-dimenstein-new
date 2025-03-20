<template>
  <Layout title="Configurações">
    <template #breadcrumb>
      <FontAwesomeIcon icon="fa-solid fa-gear" class="w-4 h-4 text-teal-800" />
    </template>
    <!-- Loading Modal -->
    <Modal
      :visible="loading"
      :title="'Carregando...'"
      :hideHeader="true"
      :hideFooter="true"
      :noDismiss="true"
    >
      <div class="flex flex-col items-center">
        <p class="mb-4">Carregando...</p>
        <img class="img img-fluid" src="/static/img/loading.gif" />
      </div>
    </Modal>

    <!-- Tabs Navigation -->
    <div class="bg-white p-6 rounded-lg shadow">
      <ul class="flex border-b">
        <li class="mr-1">
          <button
            @click="changeActive('Equipamentos')"
            :class="[
              'px-4 py-2 font-medium rounded-t',
              active === 'Equipamentos'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-100',
            ]"
          >
            Equipamentos
          </button>
        </li>
        <li class="mr-1">
          <button
            @click="changeActive('Testes')"
            :class="[
              'px-4 py-2 font-medium rounded-t',
              active === 'Testes'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-100',
            ]"
          >
            Testes
          </button>
        </li>
        <li class="mr-1">
          <button
            @click="changeActive('Grupos')"
            :class="[
              'px-4 py-2 font-medium rounded-t',
              active === 'Grupos'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-100',
            ]"
          >
            Instalações
          </button>
        </li>
        <li v-if="currentUser.type === 'administrador'" class="mr-1">
          <button
            @click="changeActive('Logs')"
            :class="[
              'px-4 py-2 font-medium rounded-t',
              active === 'Logs'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-100',
            ]"
          >
            Logs
          </button>
        </li>
      </ul>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <!-- Equipments Tab -->
      <div
        v-if="active === 'Equipamentos'"
        class="bg-white p-6 rounded-lg shadow"
      >
        <EquipmentsTab :active="active" v-model:loading="loading" />
      </div>

      <!-- Tests Tab -->
      <div v-if="active === 'Testes'" class="bg-white p-6 rounded-lg shadow">
        <TestsTab v-model:loading="loading" />
      </div>

      <!-- Groups Tab -->
      <div v-if="active === 'Grupos'" class="bg-white p-6 rounded-lg shadow">
        <GroupsTab v-model:loading="loading" />
      </div>

      <!-- Logs Tab -->
      <div v-if="active === 'Logs'" class="bg-white p-6 rounded-lg shadow">
        <LogsTab v-model:loading="loading" />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Layout from "@/components/common/Layout.vue";
import Modal from "@/components/common/Modal.vue";
import auth from "@/services/authentication";
import EquipmentsTab from "@/pages/dashboard/settings/EquipmentsTab.vue";
import TestsTab from "@/pages/dashboard/settings/TestsTab.vue";
import GroupsTab from "@/pages/dashboard/settings/GroupsTab.vue";
import LogsTab from "@/pages/dashboard/settings/LogsTab.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const active = ref("Equipamentos");
const loading = ref(false);
const currentUser = ref(auth.currentUser());

// Change active tab
const changeActive = (newActive) => {
  active.value = newActive;
};

// Initialize component
onMounted(() => {
  // Any additional initialization if needed
});
</script>
