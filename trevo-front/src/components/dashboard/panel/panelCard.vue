<template>
  <div
    class="bg-white border border-gray-200 rounded-lg p-4 w-full md:w-1/3 hover:[box-shadow:0_10px_40px_0_rgba(62,57,107,.07),0_2px_9px_0_rgba(62,57,107,.06)] shadow-gray-600"
  >
    <div class="flex">
      <div class="w-1/2">
        <p>{{ text }}</p>
      </div>
      <div class="w-1/2">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "PanelCard",
});
defineProps({
  text: String,
  imageUrl: String,
});
</script>
