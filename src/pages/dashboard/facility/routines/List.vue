<template>
  <Layout title="Rotinas">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${facility._id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline italic font-semibold"
      >
        {{ facility.name }}
      </router-link>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CardLink
        :href="`/facility/${facility._id}/routines/radioactivematerialmov`"
        title="Movimentação de Material Radioativo"
        className="border-l-green-600 h-36 w-64 flex items-center justify-start"
      >
      </CardLink>

      <CardLink
        :href="`/facility/${facility._id}/routines/solidwastemanagement/${year}`"
        title="Gerenciamento de Rejeitos Sólidos"
        className="border-l-blue-600 h-36 w-64 flex items-center justify-start"
      >
      </CardLink>

      <CardLink
        :href="`/facility/${facility._id}/routines/liquidwastemanagement/${year}`"
        title="Gerenciamento de Rejeitos Líquidos"
        className="border-l-purple-600 h-36 w-64 flex items-center justify-start"
      >
      </CardLink>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Layout from "@/components/common/Layout.vue";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import CardLink from "@/components/common/CardLink.vue";

const route = useRoute();
const errors = ref("");
const facility = ref({});
const year = ref(new Date().getFullYear());
const currentUser = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get(
      `${auth.apiUrl()}facility/${route.params.id}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );

    if (response.data.length === 0) {
      errors.value = "Nenhum resultado encontrado";
      facility.value = "";
      return;
    }

    facility.value = response.data;
    currentUser.value = auth.currentUser();
  } catch (error) {
    errors.value = error.data;
    facility.value = "";
  }
});
</script>

<style></style>
