<template>
  <slot name="title">
    <RouterLink :to="href" class="w-fit">
      <div
        :class="
          cn('bg-white border-l-4 border-y border-r p-6 py-8 text-3xl leading-[1.2] mb-2 font-medium hover:shadow-theme transition-all duration-300', className)
        "
      >
        <h1>{{ title }}</h1>
      </div>
    </RouterLink>
  </slot>
</template>
<script setup>

import { cn } from "@/utils/cn";
import { RouterLink } from "vue-router";
defineProps({
  title: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  className: {
    type: [Array, String, Object],
  }
});
</script>
