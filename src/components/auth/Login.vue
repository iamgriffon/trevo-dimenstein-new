<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import auth from "@/services/authentication";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const emit = defineEmits(["login"]);
defineOptions({ name: "Login" });

const router = useRouter();
const step = ref(1);
const credentials = ref({
  email: "",
  password: "",
  loginToken: "",
});
const code = ref("");
const doc = ref("");
const authStep1Error = ref("");
const authStep2Error = ref("");
const codeError = ref("");

const loading = ref(false);

function getContext() {
  return {
    error: authStep1Error.value,
    router,
  };
}

async function toNextStep() {
  authStep1Error.value = "";
  const creds = {
    email: credentials.value.email.trim().toLowerCase(),
    password: credentials.value.password,
  };

  loading.value = true;
  const ctx = await auth.generateToken(
    { ...getContext(), error: authStep1Error },
    creds
  );

  if (ctx.error) {
    authStep1Error.value = ctx.error.message;
  } else {
    step.value = 2;
  }

  loading.value = false;
}

async function login() {
  authStep1Error.value = "";
  authStep2Error.value = "";
  loading.value = true;

  if (!credentials.value.loginToken?.length) {
    authStep2Error.value = "Campo obrigatório";
    loading.value = false;
    return;
  }

  const creds = {
    email: credentials.value.email.trim().toLowerCase(),
    password: credentials.value.password,
    loginToken: credentials.value.loginToken,
  };

  const context = {
    ...getContext(),
    get error() {
      return authStep2Error.value;
    },
    set error(value) {
      authStep2Error.value = value;
    },
  };

  try {
    await auth.login(context, creds, "/panel");
  } finally {
    loading.value = false;
  }
}

function verifyCode() {
  if (!code.value) {
    return (codeError.value = "Código inválido, tente novamente");
  }

  axios
    .get(auth.apiUrl() + "document/code/" + code.value)
    .then((response) => {
      if (response.data.length === 0) {
        authStep2Error.value = "Documento não encontrado, tente novamente";
        doc.value = "";
      } else {
        var docButton = document.getElementById("document-id");
        docButton.href = response.data;
        docButton.click();
      }
    })
    .catch((error) => {
      console.log(error);
      authStep2Error.value = "Documento não encontrado, tente novamente";
      doc.value = "";
    });
}
</script>
<template>
  <div
    class="flex flex-col h-auto items-center justify-center mx-auto w-full max-w-4xl"
  >
    <div
      v-if="step == 1"
      class="w-full flex max-lg:flex-col py-4 bg-white shadow-md rounded-3xl"
    >
      <form
        class="w-full px-8 py-4 flex flex-col gap-4 border-r my-4 border-gray-300"
        @submit.prevent="toNextStep()"
      >
        <h2 class="text-2xl font-bold text-center">Acessar</h2>
        <Input
          type="text"
          class="w-full rounded-lg px-3 py-2 focus:outline-none"
          autocapitalize="off"
          v-model="credentials.email"
          placeholder="Email"
          :error="!!authStep1Error.length && !credentials.email"
        >
          <FontAwesomeIcon icon="fa-solid fa-user" />
        </Input>
        <Input
          type="password"
          class="w-full rounded-lg px-3 py-2 focus:outline-none"
          v-model="credentials.password"
          placeholder="Senha"
          :error="!!authStep1Error.length && !credentials.password"
        >
          <FontAwesomeIcon icon="fa-solid fa-lock" />
        </Input>
        <Button
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          :type="submit"
          :loading="loading"
        >
          Continuar
        </Button>
        <router-link
          to="/passwordrecover"
          class="text-green-600 hover:text-green-800 transition-colors duration-300 text-base text-center"
        >
          Esqueceu a senha?
        </router-link>
        <p v-if="!!authStep1Error.length">
          <span
            class="absolute left-[20%] -translate-x-1/4 text-center text-red-500 font-bold"
            >* {{ authStep1Error }}</span
          >
        </p>
      </form>
      <article class="w-full px-8 py-4 flex flex-col gap-4">
        <h2 class="text-2xl font-bold text-center mb-4">
          Autenticidade de Documentos
        </h2>
        <p>
          Para verificar se o documento que você possui em mãos foi emitido pela
          Rad Dimenstein, digite o código presente na assinatura no formulário
          abaixo:
        </p>
        <Input
          type="text"
          class="w-full rounded-lg px-3 py-2 focus:outline-none"
          autocapitalize="off"
          v-model="credentials.documentCode"
          placeholder="Código do Documento"
          :error="!!codeError.length"
        >
          <FontAwesomeIcon icon="fa-solid fa-qrcode" />
        </Input>
        <button
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          @click="verifyCode()"
        >
          Verificar
        </button>
        <p v-if="!!codeError.length">
          <span
            class="absolute left-[65%] -translate-x-1/4 text-center text-red-500 font-bold"
            >* {{ codeError }}</span
          >
        </p>
        <a id="document-id" :download="code + '.pdf'" class="hidden" />
      </article>
    </div>

    <div
      v-if="step == 2"
      class="w-2/3 flex py-4 bg-white shadow-md rounded-3xl"
    >
      <form
        class="w-full px-8 py-4 flex flex-col items-center gap-4 border-r my-4 border-gray-300"
        @submit.prevent="login"
      >
        <section class="flex flex-col gap-2">
          <h2 class="text-2xl font-bold text-center">Verifique o seu email</h2>
          <p class="black text-center mb-4">
            Te mandamos um email com o código de verificação para a realização
            do acesso.
          </p>
        </section>
        <Input
          type="text"
          class="px-4 w-full gap-2"
          v-model="credentials.loginToken"
          placeholder="Código de verificação"
          :error="!!authStep2Error.length && !credentials.loginToken.length"
        >
          <FontAwesomeIcon icon="fa-solid fa-lock" />
        </Input>
        <Button
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          type="submit"
        >
          Entrar
        </Button>
        <p v-if="!!authStep2Error.length">
          <span
            class="absolute left-[40%] -translate-x-1/4 text-center text-red-500 font-bold"
            >* {{ authStep2Error }}</span
          >
        </p>
      </form>
    </div>
  </div>
</template>
