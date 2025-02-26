<template>
  <article class="flex">
    <transition
      name="slide"
      enter-active-class="transition duration-300 transform"
      leave-active-class="transition duration-300 transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <Sidebar
        :hide-menu="hideMenu"
        :current-user="currentUser"
        :permission="permission"
      />
    </transition>
    <div
      class="flex-1 p-4"
      :class="{ 'w-full': hideMenu, 'md:w-[calc(100%-16rem)]': !hideMenu }"
    >
      <Navbar @toggle-menu="toggleMenu" />
      <section :class="['mt-16', hideMenu && 'ml-8']">
        <router-view />
      </section>
    </div>
  </article>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "@/routes";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Navbar from "../common/Navbar.vue";
import Sidebar from "../common/Sidebar.vue";

const currentUser = ref(auth.currentUser());
const dataLetters = ref("");
const hideMenu = ref(false);
const user = ref({});

onMounted(() => {
  dataLetters.value =
    currentUser.value.name.split(" ")[0].charAt(0) +
    currentUser.value.name.split(" ")[1].charAt(0);

  // check if accepted terms of use
  axios
    .get(auth.apiUrl() + "user/" + currentUser.value.id, {
      headers: { Authorization: "Bearer " + auth.getToken() },
    })
    .then((response) => {
      if (response.data.length === 0) {
        this.errors = "Nenhum resultado encontrado";
        user.value = "";
      } else {
        user.value = response.data;
        if (
          !user.value.acceptedTermsAt ||
          new Date().getTime() -
            new Date(user.value.acceptedTermsAt).getTime() >
            365 * 24 * 60 * 60 * 1000
        ) {
          router.push({ path: "/terms" });
        }
      }
    });
});

const toggleMenu = () => {
  hideMenu.value = !hideMenu.value;
};
</script>

<style scoped>
[data-letters]:before {
  content: attr(data-letters);
  display: inline-block;
  font-size: 1em;
  width: 2.5em;
  height: 2.5em;
  line-height: 2.5em;
  text-align: center;
  border-radius: 50%;
  background: #00a767;
  vertical-align: middle;
  margin-right: 1em;
  color: white;
}
</style>
