<template>
  <Layout title="Editar Usuário">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/user/${route.params.id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ user.name }}
      </router-link>
      <span class="mx-2 text-teal-800 select-none">/ Editar</span>
    </template>
    <template #header>
      <router-link 
        :to="`/user/${route.params.id}`" 
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
        <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
      </router-link>
    </template>
    
    <div class="bg-white rounded-lg shadow p-6">
      <edit></edit>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Layout from '@/components/common/Layout.vue';
import Edit from '@/components/auth/Edit.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import auth from '@/services/authentication';
import axios from 'axios';

const route = useRoute();
const user = ref({});
const errors = ref('');
const currentUser = ref({});

onMounted(async () => {
  try {
    const response = await axios.get(
      `${auth.apiUrl()}user/${route.params.id}`, 
      {headers: {Authorization: `Bearer ${auth.getToken()}`}}
    );
    
    if (response.data.length === 0) {
      errors.value = 'Nenhum resultado encontrado';
      user.value = {};
    } else {
      user.value = response.data;
    }
  } catch (error) {
    errors.value = error.data;
    user.value = {};
  }

  currentUser.value = auth.currentUser();
});
</script>