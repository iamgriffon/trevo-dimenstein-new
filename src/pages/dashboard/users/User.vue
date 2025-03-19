<template>
  <Layout :title="user?.name || 'Usuário'">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/user/${route.params.id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline italic font-semibold select-none"
        :active-class="'border-none bg-transparent'"
      >
        {{ user?.name }}
      </router-link>
    </template>

    <template #header>
      <div class="flex space-x-2">
        <router-link
          :to="`/users`"
          class="px-4 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" /> Voltar
        </router-link>
        <router-link
          v-if="permission.canEdit(currentUser, user)"
          :to="`${user._id}/edit`"
          class="px-4 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-edit" class="mr-2" /> Editar
        </router-link>

        <router-link
          v-if="permission.canEdit(currentUser, user)"
          :to="`${user._id}/edit/password`"
          class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-key" class="mr-2" /> Alterar Senha
        </router-link>

        <button
          v-if="permission.canExclude(currentUser, user)"
          @click="confirmDelete = true"
          class="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          <FontAwesomeIcon icon="fa-solid fa-trash-alt" class="mr-2" /> Excluir
        </button>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else class="space-y-6">
      <!-- User Info -->
      <div class="flex flex-col gap-4 w-fit">
        <div :class="baseInfoClass">
          <p class="flex items-center text-gray-700 cursor-default select-none">
            <FontAwesomeIcon
              icon="fa-solid fa-envelope"
              class="mr-3 text-teal-600"
            />
            {{ user.email }}
          </p>
        </div>

        <div
          v-if="permission.canSeeCPF(currentUser) && !!user.cpf.trim().length"
          :class="baseInfoClass"
        >
          <p class="flex items-center text-gray-700">
            <FontAwesomeIcon
              icon="fa-solid fa-id-card"
              class="mr-3 text-teal-600"
            />
            {{ user.cpf }}
          </p>
        </div>

        <div
          v-if="!!user.telephone.trim().length"
          :class="baseInfoClass"
        >
          <p class="flex items-center text-gray-700">
            <FontAwesomeIcon
              icon="fa-solid fa-phone"
              class="mr-3 text-teal-600"
            />
            {{ user.telephone }}
          </p>
        </div>

        <div
          v-if="
            user.type &&
            permission.canSeeCPF(currentUser) &&
            !!user.type.trim().length
          "
          :class="baseInfoClass"
        >
          <p class="flex items-center text-gray-700">
            <FontAwesomeIcon
              icon="fa-solid fa-id-badge"
              class="mr-3 text-teal-600"
            />
            {{ user.type.charAt(0).toUpperCase() + user.type.slice(1) }}
          </p>
        </div>
      </div>

      <!-- Facilities -->
      <div
        v-if="permission.canSeeCPF(currentUser)"
        :class="baseInfoClass"
      >
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-xl font-semibold text-gray-800">Instalações</h4>
          <router-link
            v-if="permission.canEdit(currentUser, user)"
            :to="`${user._id}/facilities`"
            class="px-4 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors"
          >
            <FontAwesomeIcon icon="fa-solid fa-edit" class="mr-2" /> Editar
          </router-link>
        </div>

        <div v-if="!facilities.length" class="py-4 text-center text-gray-500">
          Nenhuma instalação associada.
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="facility in facilities"
            :key="facility._id"
            class="bg-white rounded-lg shadow border hover:shadow-md transition-shadow"
          >
            <div
              class="h-32 bg-center bg-no-repeat bg-cover rounded-t-lg opacity-60"
              :style="{ backgroundImage: `url(${facility.pathBackgroundImg})` }"
            ></div>

            <div class="relative -mt-12 flex justify-center">
              <img
                :src="facility.pathLogoImg"
                alt="Logo"
                class="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
            </div>

            <div class="p-4 text-center">
              <h5 class="font-semibold text-gray-800 mb-3">
                {{ facility.name }}
              </h5>
              <router-link
                :to="`/facility/${facility._id}`"
                class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center"
              >
                <FontAwesomeIcon icon="fa-solid fa-info" class="mr-2" />
                Informações
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div
        v-if="user.FMLicenseNumber || user.ANLicenseNumber"
        class="bg-white rounded-lg shadow p-6"
      >
        <h4 class="text-xl font-semibold text-gray-800 mb-4">Documentos</h4>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-if="user.FMLicenseNumber"
            class="bg-white rounded-lg shadow border p-4 text-center"
          >
            <p class="mb-1 flex items-center justify-center">
              <FontAwesomeIcon
                icon="fa-solid fa-file-pdf"
                class="mr-2 text-red-500"
              />
              Licença FM
            </p>
            <p class="mb-1 flex items-center justify-center">
              <FontAwesomeIcon
                icon="fa-solid fa-id-card"
                class="mr-2 text-gray-600"
              />
              {{ user.FMLicenseNumber }}
            </p>
            <p class="mb-3 flex items-center justify-center">
              <FontAwesomeIcon
                icon="fa-solid fa-calendar-alt"
                class="mr-2 text-gray-600"
              />
              {{ formatDate(user.FMLicenseValidity) }}
            </p>
            <a
              v-if="user.FMLicense"
              href="#"
              @click.prevent="downloadFMLicense"
              class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center"
            >
              <FontAwesomeIcon icon="fa-solid fa-download" class="mr-2" />
              Download
            </a>
            <a
              id="fmlicense"
              :download="`LicencaFM ${user.name}.pdf`"
              style="display: none"
            />
          </div>

          <div
            v-if="user.ANLicenseNumber"
            class="bg-white rounded-lg shadow border p-4 text-center"
          >
            <p class="mb-1 flex items-center justify-center">
              <FontAwesomeIcon
                icon="fa-solid fa-file-pdf"
                class="mr-2 text-red-500"
              />
              Licença AN
            </p>
            <p class="mb-1 flex items-center justify-center">
              <FontAwesomeIcon
                icon="fa-solid fa-id-card"
                class="mr-2 text-gray-600"
              />
              {{ user.ANLicenseNumber }}
            </p>
            <p class="mb-3 flex items-center justify-center">
              <FontAwesomeIcon
                icon="fa-solid fa-calendar-alt"
                class="mr-2 text-gray-600"
              />
              {{ formatDate(user.ANLicenseValidity) }}
            </p>
            <a
              v-if="user.ANLicense"
              href="#"
              @click.prevent="downloadANLicense"
              class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center"
            >
              <FontAwesomeIcon icon="fa-solid fa-download" class="mr-2" />
              Download
            </a>
            <a
              id="anlicense"
              :download="`LicencaAN ${user.name}.pdf`"
              style="display: none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal v-model:visible="confirmDelete" title="Confirmar Exclusão">
      <div class="p-4">
        <p class="mb-4">
          Tem certeza que deseja excluir o usuário
          <strong>{{ user.name }}</strong
          >?
        </p>
        <div class="flex justify-end space-x-2">
          <button
            @click="confirmDelete = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="exclude"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, onMounted, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import Layout from "@/components/common/Layout.vue";
import Modal from "@/components/common/Modal.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const user = ref({});
const facilities = ref([]);
const loading = ref(true);
const errors = ref("");
const currentUser = ref({});
const confirmDelete = ref(false);

const baseInfoClass = "bg-white rounded-lg shadow p-4 hover:shadow-theme transition-shadow cursor-default select-none";

const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear().toString().substr(-2)}`;
};

const downloadFMLicense = () => {
  const fmlicense = document.getElementById("fmlicense");
  fmlicense.href = user.value.FMLicense;
  fmlicense.click();
};

const downloadANLicense = () => {
  const anlicense = document.getElementById("anlicense");
  anlicense.href = user.value.ANLicense;
  anlicense.click();
};

const exclude = async () => {
  try {
    await auth.exclude(user.value, "/users");
    router.push("/users");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

onMounted(async () => {
  try {
    // Get user data
    const userResponse = await axios.get(
      `${auth.apiUrl()}user/${route.params.id}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );

    if (userResponse.data) {
      user.value = userResponse.data;
    }

    // Get user facilities
    const facilitiesResponse = await axios.get(
      `${auth.apiUrl()}user/${route.params.id}/facilities/`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );

    if (facilitiesResponse.data.list) {
      facilities.value = facilitiesResponse.data.list;
    }

    currentUser.value = auth.currentUser();
  } catch (err) {
    errors.value = err.data;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
div.main {
  z-index: 0;
  padding-top: 82px;
  padding-left: 28px;
}
.background-img {
  opacity: 0.6;
  z-index: 0;
  min-height: 150px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: center no-repeat;
  background-size: cover;
}

.logo-img {
  z-index: 1;
  position: relative;
  background: center no-repeat;
  -webkit-box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
}

.logo-circle {
  z-index: 1;
  top: -45px;
}

.up-25 {
  position: relative;
  top: -30px;
}
</style>
