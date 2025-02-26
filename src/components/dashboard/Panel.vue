<template>
  <div class="w-full h-full">
    <Layout :title="'Início'">
      <div class="w-full mb-4">
        <h4>O sistema Trevo possui diversas funções</h4>
      </div>
      <div class="w-full flex gap-2 px-4">
        <PanelCard text="Upload de documentos e assinatura digital">
          <img src="./panel/img/contract.png" alt="" />
        </PanelCard>

        <PanelCard text="Gestão de instalações e pessoas">
          <img src="./panel/img/teamwork.svg" />
        </PanelCard>
        <PanelCard text="Níveis de acesso específicos para cada usuário">
          <img src="./panel/img/folder.svg" />
        </PanelCard>
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
      
        <div
          v-if="permission.canSeeStorage(currentUser)"
        >
          <chart></chart>
        </div>

      <br />
    </Layout>
  </div>
</template>

<script setup>
import Chart from "../dashboard/panel/storageChart.vue";
import permission from "@/services/permissions";
import authentication from "@/services/authentication";
import PanelCard from "./panel/panelCard.vue";
import Layout from "../common/Layout.vue";

const { currentUser } = authentication
</script>