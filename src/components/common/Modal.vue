<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center px-10"
    >
      <Dialog
        :header="title"
        :visible="visible"
        :modal="true"
        :closable="true"
        :style="{
          background: 'white',
          borderRadius: '8px',
          padding: '16px',
          width: 'fit-content',
          maxWidth: '100%',
        }"
        @update:visible="$emit('update:visible')"
        :contentClass="cn(props.class)"
      >
        <section
          :class="
            cn(
              props.class,
              'flex flex-col items-center w-full bg-white rounded-lg'
            )
          "
        >
          <slot />
        </section>
      </Dialog>
    </div>
  </teleport>
</template>

<script setup>
import { cn } from "@/utils/cn";
import Dialog from "primevue/dialog";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:visible"]);
</script>

<style scoped>
/* Add any custom styles here */
</style>
