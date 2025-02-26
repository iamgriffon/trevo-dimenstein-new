<template>
  <article class="main">
    <div class="w-full">
      <h2>Início</h2>
      <nav aria-label="breadcrumb">
        <ol class="flex items-center">
          <li class="breadcrumb-item active" aria-current="page">
            <i class="fa fa-home" aria-hidden="true"></i>
          </li>
        </ol>
      </nav>
    </div>
    <div class="w-full">
      <h4>O sistema Trevo possui diversas funções</h4>
    </div>
    <div class="w-full flex flex-wrap px-0 mx-0">
      <panel-card :image-url="'../../assets/contract.png'" :text="'Upload de documentos e assinatura digital'">
      </panel-card>
      <panel-card :image-url="'../../assets/teamwork.svg'" :text="'Gestão de instalações e pessoas'">
      </panel-card>
      <panel-card :image-url="'../../assets/folder.svg'" :text="'Níveis de acesso específicos para cada usuário'">
      </panel-card>
    </div>
    <br />
    <div class="w-full">
      <h4>Novidades da versão 0.9.3</h4>
    </div>
    <div class="w-full flex flex-wrap px-0 mx-0">
      <div class="hyper-card w-full p-3">
        <ul>
          <li>Correções</li>
          <ul>
            <li>Ajuste nas páginas de Documentos</li>
            <li>Melhorias no login</li>
            <li>Melhorias na data de upload do documento</li>
            <li>Ajustes de usabilidade para usuários clientes</li>
            <li>Ajustes de usabilidade para versão mobile</li>
          </ul>
          <li>Melhoria da legibilidade no QR code</li>
          <li>Nova Feature: Email semanal para o cliente</li>
          <li>Nova Feature: Admin pode criar usuários Admin</li>
          <li>Nova Feature: Edição de emails na plataforma (6 horas)</li>
        </ul>
      </div>
    </div>
    </br>
    <h2 v-if="permission.canSeeStorage(currentUser)" class="text-2xl font-bold">
      Painel de Informações do Trevo
    </h2>
    <br />
    <div class="w-full">
      <div
        class="hyper-card w-full sm:w-full md:w-1/4"
        v-if="permission.canSeeStorage(currentUser)"
      >
        <storage-size></storage-size>
      </div>
    </div>
    <br />
  </article>
</template>

<script setup>
import { defineComponent } from "vue";
import StorageSize from "../dashboard/panel/storageChart.vue";
import PanelCard from "./panelCard.vue";
import permission from "@/services/permissions";
import authentication from "@/services/authentication";

const { currentUser } = authentication

defineComponent({
  components: {
    StorageSize,
  },
  props: {
    currentUser: {
      type: Object,
      required: true,
    },
    permission: {
      type: Object,
      required: true,
    },
  },
});
</script>