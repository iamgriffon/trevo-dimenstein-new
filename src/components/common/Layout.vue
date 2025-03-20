<template>
  <header class="w-full flex items-center justify-between">
    <section class="flex items-center w-full justify-between gap-4 mb-8">
      <h2 class="text-2xl font-semibold">{{ title }}</h2>
      <slot name="header"></slot>
    </section>
  </header>
  <section class='flex flex-col gap-6'>
    <Breadcrumb>
      <slot name="breadcrumb"></slot>
    </Breadcrumb>
    <slot></slot>
  </section>
</template>
<script setup>
import Breadcrumb from './Breadcrumb.vue';

defineOptions({
  name: 'Layout'
})
defineProps({
  title: String,
})
</script>