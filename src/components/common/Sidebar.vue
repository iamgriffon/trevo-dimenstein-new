<template>
  <transition
    name="slide"
    enter-active-class="transition duration-300 transform"
    leave-active-class="transition duration-300 transform"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <aside
      class="hidden md:block w-64 mt-20 border-r border-l-gray-200"
      v-if="!hideMenu"
    >
      <ul class="flex justify-center flex-col">
        <li :class="linkStyle">
          <router-link class="w-full p-2" to="/panel"
            ><FontAwesomeIcon icon="fa-solid fa-home" /> Início</router-link
          >
        </li>
        <li :class="linkStyle">
          <router-link
            class="w-full p-2"
            :class="{
              'text-green-700 bg-gray-200 border-r-4 border-r-green-500':
                $route.path.startsWith('/facility'),
            }"
            to="/facility"
          >
            <FontAwesomeIcon icon="fa-solid fa-building" /> Instalações
          </router-link>
        </li>
        <li :class="linkStyle">
          <router-link class="w-full p-2" to="/facility/nuclearmedicine"
            ><FontAwesomeIcon icon="fa-solid fa-vials" /> Medicina
            Nuclear</router-link
          >
        </li>
        <li :class="linkStyle">
          <router-link class="w-full p-2 pl-4" to="/facility/radiodiagnosis"
            ><FontAwesomeIcon icon="fa-solid fa-diagnoses" />
            Radiodiagnóstico</router-link
          >
        </li>
        <li
          v-if="permission.canSeeAllDocuments(currentUser)"
          :class="linkStyle"
        >
          <router-link class="w-full p-2" to="/document"
            ><FontAwesomeIcon icon="fa-solid fa-inbox" />
            Documentos</router-link
          >
        </li>
        <li
          v-if="permission.canSeeAllDocuments(currentUser)"
          :class="linkStyle"
        >
          <router-link
            class="pl-4 w-full p-2 flex items-center gap-2"
            to="/document/corrigir"
            ><FontAwesomeIcon icon="fa-solid fa-times-circle" />
            Corrigir</router-link
          >
        </li>
        <li
          v-if="permission.canSeeAllDocuments(currentUser)"
          :class="linkStyle"
        >
          <router-link
            class="pl-4 w-full p-2 flex items-center gap-2"
            to="/document/assinar"
            ><FontAwesomeIcon icon="fa-solid fa-signature" /> Falta
            Assinar</router-link
          >
        </li>
        <li
          v-if="permission.canSeeAllDocuments(currentUser)"
          :class="linkStyle"
        >
          <router-link
            class="pl-4 w-full p-2 flex items-center gap-2"
            to="/document/liberar"
            ><FontAwesomeIcon icon="fa-solid fa-share-square" />
            Liberar</router-link
          >
        </li>
        <li :class="linkStyle">
          <router-link
            class="w-full p-2 flex items-center gap-2"
            :class="{
              'text-green-700 bg-gray-200 border-r-4 border-r-green-500':
                $route.path.includes('user'),
            }"
            to="/users"
            ><FontAwesomeIcon icon="fa-solid fa-users" /> Pessoas</router-link
          >
        </li>
        <li :class="linkStyle">
          <router-link
            class="w-full p-2 flex items-center gap-2"
            :class="{
              'text-green-700 bg-gray-200 border-r-4 border-r-green-500':
                $route.path.startsWith('/equipment'),
            }"
            to="/#"
            ><FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" />
            Equipamentos</router-link
          >
        </li>
        <li :class="linkStyle">
          <router-link
            class="w-full p-2 flex items-center gap-2"
            :class="{
              'text-green-700 bg-gray-200 border-r-4 border-r-green-500':
                $route.path.startsWith('/equipment'),
            }"
            to="/equipments/epi"
            ><FontAwesomeIcon icon="fa-solid fa-shield" /> Avaliação de
            EPIs</router-link
          >
        </li>
        <li :class="linkStyle">
          <router-link class="w-full p-2 flex items-center gap-2" to="/info"
            ><FontAwesomeIcon icon="fa fa-info-circle" />
            Informações</router-link
          >
        </li>
      </ul>
    </aside>
  </transition>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const linkStyle = "flex w-full text-gray-700 hover:text-green-700 pl-2";

defineProps({
  hideMenu: {
    type: Boolean,
    required: true,
  },
  currentUser: {
    type: Object,
    required: true,
  },
  permission: {
    type: Object,
    required: true,
  },
});
</script>
