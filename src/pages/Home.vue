<template>
  <div
    class="w-screen h-full flex flex-col items-center justify-center wave-bg bg-cover"
  >
    <div
      class="flex flex-col gap-2 items-center justify-center translate-y-[50%]"
    >
      <Login />
      <figure class="flex flex-row items-center gap-4">
        <h1 class="flex text-black w-full text-2xl font-medium">
          Sistema Trevo Radimenstein - {{ new Date().getFullYear() }}
        </h1>
        <img
          src="/src/assets/logo_trevo.svg"
          class="w-24 h-24"
          alt="Logo Trevo"
        />
      </figure>
    </div>
  </div>
  <footer
    class="w-full text-center p-4 bg-black rounded-e-xl rounded-s-xl text-white absolute bottom-0"
  >
    &copy; 2025 Trevo Radimenstein. Todos os direitos reservados.
  </footer>
</template>

<script setup>
import Login from "@/components/auth/Login.vue";

defineOptions({
  name: "Home",
});
</script>
<style scoped>
.wave-bg {
  position: absolute;
  background-image: url("/src/assets/background-wave-effect.png");
  background-color: black;
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: auto 560px;
  border-width: 0;
  border-top-width: 0px;
  border-bottom-width: 0px;
  height: 500px;
}
</style>
