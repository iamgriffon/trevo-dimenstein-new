<template>
  <div class="w-full h-full">
    <Layout :title="'Início'">
      <div class="w-full mb-4">
        <h4>O sistema Trevo possui diversas funções</h4>
      </div>
      <div class="w-full flex gap-2 px-4">
        <PanelCard text="Upload de documentos e assinatura digital">
          <img src="/public/assets/contract.png" alt="" />
        </PanelCard>

        <PanelCard text="Gestão de instalações e pessoas">
          <img src="/public/assets/teamwork.svg" />
        </PanelCard>
        <PanelCard text="Níveis de acesso específicos para cada usuário">
          <img src="/public/assets/folder.svg" />
        </PanelCard>
      </div>
      <br />
      <div class="bg-white border border-gray-200 rounded-lg p-4 w-full hover:[box-shadow:0_10px_40px_0_rgba(62,57,107,.07),0_2px_9px_0_rgba(62,57,107,.06)] shadow-gray-600">
        <h4 class='text-2xl font-bold'>Novidades da versão 1.0.0 -  {{ format(new Date(), 'dd/MM/yyyy') }}</h4>
 
      <div class="w-full flex flex-wrap text-lg px-0 mx-0">
        <div class="w-full p-3 ">
          <ul>
            <li class="list-disc">Correções</li>
            <ul>
             <li class="list-disc">Melhorias na interface gráfica</li>
             <li class="list-disc">Migração para o Vue 3</li>
             <li class="list-disc">Correção de problemas de certificado SSL</li>
            </ul>
          </ul>
        </div>
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
import Chart from "@/components/dashboard/panel/storageChart.vue";
import permission from "@/services/permissions";
import authentication from "@/services/authentication";
import PanelCard from "@/components/dashboard/panel/panelCard.vue";
import Layout from "@/components/common/Layout.vue";
import { format } from 'date-fns'

const { currentUser } = authentication
</script>