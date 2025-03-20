<template>
  <template v-if="!currentUser">
    <nav
      class="bg-transparent fixed top-0 w-full bg-gray-700 flex justify-between h-14 z-10"
    >
      <img src="/src/assets/logo_rad.png" class="'h-full'" alt="Background" />
    </nav>
  </template>
  <template v-else>
    <nav
      class="w-full fixed top-0 left-0 right-0 flex items-center justify-between bg-gray-900 py-1 h-16 z-10"
    >
      <div class="flex items-center px-6 gap-2 rounded-full mr-10">
        <Button
          class='min-w-10 h-10 text-white border-none bg-gray-700 hover:text-gray-700 hover:bg-gray-400/80'
          :class-name="'rounded-full'"
          @click="emit('toggleMenu')"
        >
          <FontAwesomeIcon icon="fa-solid fa-bars" class="text-sm" />
        </Button>
        <img class="h-12" src="/src/assets/logo_rad_dimenstein.png" />
      </div>
      <div v-if="permission.canSeeAllDocuments(currentUser)" class="w-64">
        <Searchbar />
      </div>
      <div class="flex items-center px-4">
        <div class="flex items-center text-sm">
          <span :data-letters="dataLetters" class="!bg-primary-500"></span>
          <span class="text-white max-w-80 text-sm text-nowrap">
            {{ currentUser.name }}
          </span>
          <Button
            :class="[
              'py-2 rounded text-white border-none',
              userMenu ? 'rotate-[360deg]' : 'rotate-180',
              ' transition-transform duration-300',
            ]"
            @click="toggleUserMenu"
          >
            <FontAwesomeIcon icon="fa-solid fa-chevron-up" />
          </Button>
          <router-link
            v-if="permission.canSeeSettingsMenu(currentUser)"
            to="/settings"
            active-class=""
          >
            <Button
              :class="'min-w-8 h-10 rounded-full text-white bg-gray-700 hover:text-gray-700 hover:bg-gray-400/80 border-none'"
            >
              <FontAwesomeIcon icon="fa-solid fa-cog" />
            </Button>
          </router-link>
          <nav
            class="absolute right-4 top-12 w-48 bg-white rounded shadow-lg py-1"
            v-if="userMenu"
          >
            <router-link
              class="block px-4 py-2 hover:bg-gray-100 hover:text-green-600"
              :to="'/user/' + currentUser.id"
              ><FontAwesomeIcon icon="fa-solid fa-user" class="mr-2" /> Meu
              perfil</router-link
            >
            <router-link
              class="block px-4 py-2 hover:bg-gray-100 hover:text-green-600"
              to="/info"
              ><FontAwesomeIcon icon="fa-solid fa-bug" class="mr-2" /> Reportar
              problema</router-link
            >
            <button
              @click="logout()"
              class="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-green-600"
            >
              <FontAwesomeIcon icon="fa-solid fa-sign-out-alt" class="mr-2" />
              Sair
            </button>
          </nav>
        </div>
      </div>
    </nav>
  </template>
</template>
<script setup>
import Button from "@/components/ui/Button.vue";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted } from "vue";
import Searchbar from "./Searchbar.vue";
import axios from "axios";
import router from "@/routes";

const currentUser = ref(auth.currentUser());

defineOptions({
  name: "Navbar",
});

const dataLetters = ref("");
const userMenu = ref(false);
const user = ref({});

function toggleUserMenu() {
  userMenu.value = !userMenu.value;
}

onMounted(() => {
  dataLetters.value =
    currentUser.value.name.split(" ")[0].charAt(0) +
    currentUser.value.name.split(" ")[1].charAt(0);

  // check if accepted terms of use
  axios
    .get(auth.apiUrl() + "user/" + currentUser.value.id, {
      headers: { Authorization: "Bearer " + auth.getToken() },
    })
    .then((response) => {
      if (response.data.length === 0) {
        this.errors = "Nenhum resultado encontrado";
        user.value = "";
      } else {
        user.value = response.data;
        if (
          !user.value.acceptedTermsAt ||
          new Date().getTime() -
            new Date(user.value.acceptedTermsAt).getTime() >
            365 * 24 * 60 * 60 * 1000
        ) {
          router.push({ path: "/terms" });
        }
      }
    });
});

const logout = () => {
  auth.logout();
};

const emit = defineEmits(['toggleMenu'])
</script>
