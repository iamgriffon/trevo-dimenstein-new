<template>
  <div class="flex items-start text-sm" :class="className">
    <FontAwesomeIcon
      v-if="icon"
      :icon="icon"
      class="mr-2 mt-0.5 text-gray-500 w-4 h-4 flex-shrink-0"
      aria-hidden="true"
    />
    <div class="flex-1">
      <span v-if="label" class="font-medium text-gray-700">{{ label }}:</span>
      <span :class="{'ml-1': label}" class="text-gray-800">
        <slot></slot> <!-- Value goes here -->
      </span>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps({
  icon: [String, Array], // FontAwesome icon definition
  label: String,
  className: String, // Optional additional classes
});
</script>