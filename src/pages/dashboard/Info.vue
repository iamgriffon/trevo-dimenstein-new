<script setup>
import CardLink from "@/components/common/CardLink.vue";
import Layout from "@/components/common/Layout.vue";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import auth from "@/services/authentication";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";

const subject = ref("");
const whatIsHappening = ref("");
const whatShouldHappen = ref("");

function onSubmit() {
  const report = {
    subject: subject.value,
    whatIsHappening: whatIsHappening.value,
    whatShouldHappen: whatShouldHappen.value,
  };
  auth.reportProblem(null, report, "/panel");
}
</script>

<template>
  <Layout title="Informações">
    <CardLink
      href="/terms"
      title="Termos de Uso"
      className="border-l-green-500 w-fit py-10"
    />
    <h1 class="text-4xl font-medium mt-2">Reportar problema</h1>
    <form
      @submit.prevent="onSubmit"
      class="border border-gray-300 rounded-sm px-6 pb-6 flex flex-col gap-4"
    >
      <section class="flex flex-col gap-2 mb-2 mt-8">
        <label
          for="subject"
          class="flex gap-3 items-center font-normal text-2xl"
        >
          <FontAwesomeIcon icon="fa-solid fa-bug" />
          <span class="text-gray-600"> Assunto </span>
        </label>
        <Input
          v-model="subject"
          placeholder="Assunto"
          className="shadow-none border border-gray-300 rounded-lg h-12 text-lg focus:outline-green-700"
          required
          minlength="3"
        />
      </section>
      <section class="flex flex-col gap-2 mb-2 mt-8">
        <label for="issue" class="font-normal text-2xl">
          <span class="pr-2">O que está acontecendo?</span>
          <span class="text-gray-600 text-lg">
            Em qual página você estava quando percebeu o problema? O que você
            fez? E qual foi o resultado?
          </span>
        </label>
        <div
          class="flex items-center px-4 py-1 shadow-none border bg-white border-gray-300 rounded-lg"
        >
          <textarea
            class="block w-full px-2 py-1 bg-inherit text-lg h-32 rounded-md focus:outline-none"
            v-model="whatIsHappening"
            name="issue"
            required
            minlength="10"
          />
        </div>
      </section>
      <section class="flex flex-col gap-2 mb-2 mt-8">
        <label for="description" class="font-normal text-2xl">
          <span class="pr-2">Descreva o que deveria acontecer.</span>
        </label>
        <div
          class="flex items-center px-4 py-1 shadow-none border bg-white border-gray-300 rounded-lg"
        >
          <textarea
            class="block w-full px-2 py-1 bg-inherit text-lg h-32 rounded-md focus:outline-none"
            v-model="whatShouldHappen"
            name="description"
            required
            minlength="10"
          />
        </div>
      </section>
      <section>
        <Button
          type="submit"
          class="font-medium text-lg rounded-lg text-white bg-green-500 hover:bg-green-700 transition-all duration-300"
        >
          Enviar
        </Button>
      </section>
    </form>
  </Layout>
</template>
