<template>
  <router-link :to="`/users/${user._id}`">
    <div
      class="flex flex-col items-center justify-center p-6 gap-4 relative h-56 w-64 max-md:w-screen overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <DataLetters :fullName="props.user.name" />

      <p class="px-4 text-center text-lg font-semibold line-clamp-2 text-teal-600">
        {{ user.name }}
      </p>

      <p class="flex gap-2 items-center capitalize">
        <FontAwesomeIcon icon="fa-solid fa-user" />
        <span>
          {{ user.type }}
        </span>
      </p>
    </div>
  </router-link>
</template>

<script setup>
import DataLetters from "@/components/common/DataLetters.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const dataLetters = ref("");

dataLetters.value =
  props?.user?.name.split(" ")[0].charAt(0) +
  props?.user?.name.split(" ")[1].charAt(0);
</script>
<style scoped>
</style>
