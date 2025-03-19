<template>
  <Layout title="Alterar Senha">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/user/${route.params.id}`"
        :active-class="'border-none bg-transparent'"
        class="text-gray-500 hover:text-teal-800 hover:underline italic font-semibold select-none"
      >
        {{ user.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/ Alterar Senha</span>
    </template>
    <template #header>
      <router-link
        :to="`/user/${route.params.id}`"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
      </router-link>
    </template>

    <div class="bg-white rounded-lg shadow p-6">
      <change-password></change-password>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Layout from "@/components/common/Layout.vue";
import ChangePassword from "@/components/auth/changePassword.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { api } from "@/services/api";

const route = useRoute();
const user = ref({});

onMounted(async () => {
  const { data } = await api.get(`/user/${route.params.id}`);
  user.value = data;
});
</script>

<style scoped>
div.main {
  z-index: 0;
  padding-top: 82px;
  padding-left: 28px;
}
</style>
