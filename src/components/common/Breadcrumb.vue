<template>
  <section class="flex items-center">
    <FontAwesomeIcon
      v-if="!route.fullPath.includes('info')"
      icon="fa-solid fa-home"
      class="text-teal-800"
    />
    <span
      v-if="
        !route.fullPath.includes('info') &&
        !route.fullPath.includes('panel') >= 1
      "
      class="mx-2 text-gray-800 select-none"
      >/</span
    >

    <template v-if="route.fullPath.includes('facility')">
      <FontAwesomeIcon icon="fa-solid fa-building" />

    </template>

    <template v-if="route.fullPath.includes('document')">
      <FontAwesomeIcon icon="fa-solid fa-inbox" class="text-teal-800" />
    </template>

    <template v-if="route.fullPath.includes('user')">
      <FontAwesomeIcon icon="fa-solid fa-users" />
    </template>
  </section>
</template>
<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRoute } from "vue-router";

const route = useRoute();
</script>
