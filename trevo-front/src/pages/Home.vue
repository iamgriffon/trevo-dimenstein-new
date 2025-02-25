<template>
  <div
    class="w-screen h-screen flex flex-col items-center justify-center wave-bg bg-cover"
  >
    <!-- <Navbar /> -->
    <Login />
  </div>
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
