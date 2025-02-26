<template>
  <router-link :to="`/facility/${facility._id}`">
    <div class="relative h-56 w-64 max-md:w-screen overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div
        class="h-32 bg-gray-100 bg-center bg-cover"
        :style="{ backgroundImage: `url(${facility.pathBackgroundImg})` }"
      />
      <div class="absolute left-1/2 bottom-[64px] -translate-x-1/2">
        <img
          class="w-24 h-24 rounded-full shadow-lg border-4 border-white"
          :src="facility.pathLogoImg"
          alt="Logo"
        />
      </div>
      <h5 class="pt-10 px-4 text-center text-lg font-semibold truncate">
        {{ facility.name }}
      </h5>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  facility: {
    type: Object,
    required: true
  }
});
</script>