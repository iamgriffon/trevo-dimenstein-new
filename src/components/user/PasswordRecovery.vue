<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import auth from '@/services/authentication'
import Hashids from 'hashids'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineOptions({
  name: 'PasswordRecovery'
})

const router = useRouter()
const email = ref('')
const error = ref('')
const response = ref('')
const loading = ref(false)

async function handleSubmit(event) {
  event.preventDefault()
  error.value = ''
  response.value = ''
  loading.value = true

  try {
    const hashids = new Hashids('this is my salt', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
    const password = hashids.encode(
      Math.floor(Math.random() * 100 + 1),
      Math.floor(Math.random() * 100 + 1),
      Math.floor(Math.random() * 100 + 1)
    )

    await auth.passwordRecover({ email: email.value.trim().toLowerCase(), password })
    response.value = `Se houver uma conta associada a ${email.value} você receberá um email com um link para reconfigurar a sua senha.`
    setTimeout(() => router.push('/'), 3000)
  } catch (err) {
    error.value = err.message || 'Ocorreu um erro ao processar sua solicitação'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col h-auto items-center justify-center mx-auto w-full max-w-4xl">
    <div class="w-full flex py-4 translate-y-[25%] bg-white shadow-md rounded-3xl">
      <form 
        class="w-full px-8 py-4 flex flex-col gap-4 border-r my-4 border-gray-300"
        @submit.prevent="handleSubmit"
      >
        <h2 class="text-2xl font-bold text-center">Recuperação de Senha</h2>

        <div class="alert alert-danger" v-if="error">
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{ error }}
        </div>

        <div class="alert alert-success" v-if="response">
          <i class="fa fa-check" aria-hidden="true"></i> {{ response }}
        </div>

        <Input
          type="email"
          class="w-full rounded-lg px-3 py-2 focus:outline-none"
          autocapitalize="off"
          v-model="email"
          placeholder="Email"
          :error="!!error"
        >
          <FontAwesomeIcon :icon="['far', 'envelope']" />
        </Input>

        <Button
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          type="submit"
          :loading="loading"
        >
          Gerar nova senha
        </Button>

        <router-link
          to="/"
          class="text-green-600 hover:text-green-800 transition-colors duration-300 text-base text-center"
        >
          Voltar para login
        </router-link>
      </form>
    </div>
  </div>
</template>
