<template>
  <div :class="style">
    <span>{{ initials }}</span>
  </div>
</template>

<script setup>
import { cn } from "@/utils/cn";
import { ref, watchEffect } from "vue";

const props = defineProps({
  fullName: {
    type: String,
    required: true,
  },
  class: {
    type: String,
  },
});

const style = cn(
  props?.class ? "" : "h-12 w-12",
  "flex items-center justify-center font-bold text-lg letter-spacing-wider py-2 bg-green-500 hover:bg-green-700 transform-all duration-300 cursor-pointer text-white rounded-full text-center truncate"
);

const initials = ref("");

watchEffect(() => {
  const nameParts = props.fullName.split(" ");
  initials.value = nameParts
    .map((part) => part.charAt(0))
    .join("");
});
</script>
