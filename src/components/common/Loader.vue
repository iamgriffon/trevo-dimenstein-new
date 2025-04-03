<template>
  <figure
    class="w-full h-full translate-y-[25%] flex items-center justify-center"
  >
    <img
      src="/static/img/loading.gif"
      class="scale-75"
      alt="Carregando lista..."
    />
  </figure>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: "Carregando...",
  },
  className: {
    type: String,
    default: "",
  },
});
</script>
