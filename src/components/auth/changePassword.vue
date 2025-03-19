<!-- src/components/Login.vue -->

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
      <p>{{ error }}</p>
    </div>
    
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="password">
          <FontAwesomeIcon icon="fa-solid fa-key" class="mr-2" /> Senha
        </label>
        <Input
          id="password"
          v-model="user.password"
          type="password"
          placeholder="Senha"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="confirmPassword">
          <FontAwesomeIcon icon="fa-solid fa-key" class="mr-2" /> Confirmar Senha
        </label>
        <Input
          id="confirmPassword"
          v-model="user.confirmPassword"
          type="password"
          placeholder="Confirmar Senha"
        />
      </div>
      
      <button 
        class="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        @click="changePassword"
      >
        <FontAwesomeIcon icon="fa-solid fa-save" class="mr-2" /> Salvar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Input from '@/components/ui/Input.vue';
import auth from '@/services/authentication';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const user = ref({
  email: '',
  name: '',
  password: '',
  confirmPassword: ''
});

const error = ref('');
const currentUser = ref({});

// Get user data
onMounted(async () => {
  currentUser.value = auth.currentUser();
  
  try {
    const response = await axios.get(
      `${auth.apiUrl()}user/${route.params.id}`, 
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    
    if (response.data.length === 0) {
      error.value = 'Nenhum resultado encontrado';
      return;
    }
    
    user.value = {
      ...response.data,
      password: '',
      confirmPassword: ''
    };
  } catch (err) {
    error.value = err.data || 'Erro ao carregar dados do usuário';
  }
});

const changePassword = async () => {
  if (user.value.password !== user.value.confirmPassword) {
    alert('"Senha" e "confirmar senha" são diferentes. Insira novamente para alterar a senha.');
    return;
  }
  
  try {
    auth.changePassword(user.value, `/user/${route.params.id}`);
    router.push(`/user/${route.params.id}`);
  } catch (err) {
    error.value = err.response?.data || 'Erro ao alterar senha';
  }
};
</script>
