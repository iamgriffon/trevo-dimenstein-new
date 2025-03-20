<template>
  <section class="flex items-center">
    <router-link to="/" :active-class="'border-none bg-transparent'">
      <FontAwesomeIcon icon="fa-solid fa-home" class="text-teal-800" />
    </router-link>
    <span
      v-if="route.fullPath !== '/info' && route.fullPath !== '/panel'"
      class="mx-2 text-teal-800 select-none"
      >/</span
    >

    <template v-if="route.fullPath.includes('facility')">
      <router-link to="/facility" :active-class="'border-none bg-transparent'">
        <FontAwesomeIcon icon="fa-solid fa-building" class="text-teal-800" />
      </router-link>
    </template>

    <template
      v-if="
        route.fullPath.includes('document') &&
        !route.fullPath.includes('facility')
      "
    >
      <span
        v-if="route.fullPath.includes('/facility')"
        class="mx-2 text-teal-800 select-none"
        >/</span
      >
      <FontAwesomeIcon icon="fa-solid fa-inbox" class="text-teal-800" />
    </template>
    <template
      v-if="
        route.fullPath.includes('user') ||
        route.fullPath.includes('users') && !route.fullPath.includes('facility')
      "
    >
      <router-link to="/users" :active-class="'border-none bg-transparent'">
        <FontAwesomeIcon icon="fa-solid fa-users" class="text-teal-800" />
      </router-link>
    </template>
    <template
      v-if="
        route.fullPath.includes('equipment') &&
        !route.fullPath.includes('facility')
      "
    >
      <FontAwesomeIcon icon="fa-solid fa-shield" class="text-teal-800" />
    </template>
    <template v-if="route.fullPath.includes('terms')">
      <FontAwesomeIcon icon="fa-solid fa-book" class="text-teal-800" />
    </template>
    <slot></slot>
  </section>
</template>
<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRoute } from "vue-router";

const route = useRoute();
</script>
