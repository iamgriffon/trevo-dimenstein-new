<template>
  <div
    class="flex flex-col gap-2 bg-white p-6 rounded shadow-md hover:shadow-theme transition-all duration-300"
  >
    <h5 :class="cn(titleSize, 'font-medium mb-4')" class="">{{ title }}:</h5>
    <div v-for="item in data" :key="item.value" class="flex items-center gap-2">
      <span>
        <FontAwesomeIcon :icon="['fa-solid', item.icon]" :class="iconSize" />
      </span>
      <span :class="labelSize" class="capitalize">{{
        item.label || "N/D"
      }}:</span>
      <span :class="valueSize" class="capitalize font-medium">{{
        item.value || "N/D"
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { cn } from "@/utils/cn";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  iconSize: {
    type: String,
    default: "h-5 w-5",
  },
  labelSize: {
    type: String,
    default: "text-lg",
  },
  valueSize: {
    type: String,
    default: "text-lg",
  },
  titleSize: {
    type: String,
    default: "text-2xl",
  },
});
</script>
