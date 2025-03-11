<template>
  <section class="flex items-center">
    <FontAwesomeIcon
      v-if="route.fullPath !== '/info'"
      icon="fa-solid fa-home"
      class="text-teal-800"
    />
    <span
      v-if="route.fullPath !== '/info' && route.fullPath !== '/panel'"
      class="mx-2 text-teal-800 select-none"
      >/</span
    >

    <template v-if="route.fullPath.includes('facility')">
      <FontAwesomeIcon icon="fa-solid fa-building" class="text-teal-800" />
    </template>

    <template v-if="route.fullPath.includes('document')">
      <FontAwesomeIcon icon="fa-solid fa-inbox" class="text-teal-800" />
    </template>

    <template v-if="route.fullPath.includes('user')">
      <FontAwesomeIcon icon="fa-solid fa-users" class="text-teal-800" />
    </template>
    <template v-if="route.fullPath.includes('equipment')">
      <FontAwesomeIcon icon="fa-solid fa-shield" class="text-teal-800" />
    </template>
    <template v-if="route.fullPath.includes('terms')">
      <FontAwesomeIcon icon="fa-solid fa-book" class="text-teal-800" />
    </template>
  </section>
</template>
<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRoute } from "vue-router";

const route = useRoute();
</script>
