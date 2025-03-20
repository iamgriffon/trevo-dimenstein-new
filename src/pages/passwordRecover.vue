<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Recuperação de senha
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Digite seu email para receber instruções
        </p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div
          v-if="error"
          class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        >
          <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" class="mr-2" />
          {{ error }}
        </div>
        
        <div
          v-if="success"
          class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
        >
          <FontAwesomeIcon icon="fa-solid fa-check-circle" class="mr-2" />
          {{ success }}
        </div>
        
        <form class="space-y-6" @submit.prevent="recoverPassword">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="fa-solid fa-envelope" class="mr-2" /> Email
            </label>
            <Input 
              v-model="email" 
              type="email" 
              placeholder="seu@email.com" 
              required
              class="w-full"
            />
          </div>
          
          <div>
            <Button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
              :disabled="loading"
            >
              <span v-if="!loading">Recuperar senha</span>
              <span v-else class="flex items-center justify-center">
                <FontAwesomeIcon icon="fa-solid fa-circle-notch" class="animate-spin mr-2" />
                Enviando...
              </span>
            </Button>
          </div>
        </form>
        
        <div class="mt-4 text-center">
          <RouterLink 
            to="/login" 
            class="font-medium text-green-600 hover:text-green-500"
          >
            Voltar para o login
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import auth from '@/services/authentication';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

const router = useRouter();
const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const recoverPassword = async () => {
  if (!email.value) {
    error.value = 'Por favor, informe seu email';
    return;
  }
  
  loading.value = true;
  error.value = '';
  success.value = '';
  
  try {
    await axios.post(`${auth.apiUrl()}auth/recover-password`, { email: email.value });
    success.value = 'Instruções de recuperação de senha foram enviadas para seu email';
    
    // Redirect to login after 5 seconds
    setTimeout(() => {
      router.push('/login');
    }, 5000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao recuperar senha. Tente novamente mais tarde.';
  } finally {
    loading.value = false;
  }
};
</script>
