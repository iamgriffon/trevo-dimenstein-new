<template>
  <div
    class="w-screen h-full flex flex-col items-center justify-center gap-20 wave-bg bg-cover"
  >
    <div
      class="flex items-center justify-center relative top-0 translate-y-[50%] left-0 h-48 w-48"
    >
    <h1 class="flex text-white translate-y-[50%]">
      Sistema Trevo Radimenstein
    </h1>
      <img src="../assets/logo_trevo.svg" alt="" srcset="" />
    </div>
    <Login />
  </div>
  <footer
    class="w-full text-center p-4 bg-black rounded-e-xl rounded-s-xl text-white absolute bottom-0"
  >
    &copy; 2025 Trevo Radimenstein. Todos os direitos reservados.
  </footer>
</template>

<script setup>
import Login from "@/components/auth/Login.vue";
import Navbar from "@/components/common/Navbar.vue";

defineOptions({
  name: "Home",
});
</script>
<style scoped>
.wave-bg {
  position: absolute;
  background-image: url("../assets/background-wave-effect.png");
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
