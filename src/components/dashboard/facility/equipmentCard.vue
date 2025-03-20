<template>
  <router-link :to="`/facility/${facility}/equipments/${equipment._id}`">
    <div
      class="relative h-56 w-64 max-md:w-screen overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <img
        class="w-full h-full object-cover"
        :src="equipment.image"
        :alt="equipment.name"
      />

      <h5 class="absolute bottom-5 px-10 left-0 right-0 text-center text-teal-800 hover:underline text-lg font-semibold truncate">
        {{ equipment.name }}
      </h5>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  facility: {
    type: String,
    required: true,
  },
  equipment: {
    type: Object,
    required: true,
  },
});
</script>
