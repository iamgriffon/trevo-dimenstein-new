<template>
  <Layout title="Documentos">
    <template #header>
      <div class="flex gap-2">
        <router-link
          :to="{ path: '/facility/' + $route.params.id }"
          class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
          <span class="hidden sm:inline">Voltar</span>
        </router-link>
        
        <router-link 
          v-if="permission.canCreateDocuments(currentUser)" 
          class="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700" 
          :to="{ path: '/document/register/'}"
        >
          <FontAwesomeIcon icon="fa-solid fa-upload" />
          <span class="hidden sm:inline">Fazer Upload</span>
        </router-link>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h3 class="text-xl font-medium">{{ facility.name }}</h3>
        <div class="w-full border-b border-gray-200 mb-4"></div>
      </div>

      <Input
        v-model="filter"
        placeholder="Buscar..."
        class="w-full px-3 border mb-4 rounded-md border-gray-300 max-md:w-96"
      >
        <FontAwesomeIcon icon="fa-solid fa-search" />
      </Input>

      <template v-if="loading">
        <figure class="w-full h-full translate-y-[25%] flex items-center justify-center">
          <img src="/static/img/loading.gif" class="scale-75" alt="Carregando lista..." />
        </figure>
      </template>
      <template v-else-if="filteredDocuments.length > 0">
        <section class="overflow-x-auto bg-white rounded-lg shadow">
          <Table
            :columns="columns"
            :data="filteredDocuments"
            :totalItems="documents.length"
            :currentPage="currentPage"
            :perPage="perPage"
          />
        </section>
      </template>
      <template v-else>
        <div class="bg-white p-6 rounded-lg shadow text-center">
          <p class="text-gray-500">Nenhum documento encontrado</p>
        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { RouterLink, useRoute } from "vue-router";
import axios from "axios";
import auth from "../../../authentication/authentication";
import permission from "../../../../../services/permissions";
import Table from "../../../../components/dashboard/Table.vue";
import Layout from "../../../../components/dashboard/Layout.vue";
import Input from "../../../../components/dashboard/Input.vue";

const route = useRoute();
const documents = ref([]);
const facility = ref({ name: "" });
const filter = ref("");
const loading = ref(true);
const currentUser = auth.currentUser();
const currentPage = ref(1);
const perPage = ref(10);

const filteredDocuments = computed(() => {
  if (filter.value.length > 2) {
    const exp = new RegExp(filter.value.trim(), "i");
    return documents.value.filter(
      (item) =>
        exp.test(item.name) ||
        exp.test(item.validity) ||
        exp.test(item.facility[0]?.name) ||
        exp.test(item.hash) ||
        exp.test(item.uploadedBy[0]?.name) ||
        exp.test(item.uploadedAt)
    );
  }
  return documents.value;
});

const columns = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "validity",
    header: "Validade",
  },
  {
    accessorKey: "uploadedBy",
    header: "Enviado Por",
    cell: (info) => info.getValue()?.[0]?.name || "—"
  },
  {
    accessorKey: "uploadedAt",
    header: "Data de Envio",
    cell: (info) => {
      const date = new Date(info.getValue());
      return date.toLocaleDateString("pt-BR");
    }
  },
  {
    accessorKey: "actions",
    header: "Ações",
    meta: {
      cellClass: "flex w-full items-center justify-end pr-4",
      headerClass: "text-right pr-16",
    },
    cell: (info) =>
      h(
        RouterLink,
        {
          to: {
            path: `/document/${info.row.original._id}`,
          },
          class:
            "flex items-center justify-center p-2 rounded-md gap-2 bg-gray-100 cursor-pointer hover:shadow-inner hover:bg-gray-200 transition-all duration-300",
        },
        [
          h(FontAwesomeIcon, { icon: "fa-solid fa-info" }),
          h("span", "detalhes"),
        ]
      ),
  },
];

const loadDocuments = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `${auth.apiUrl()}document/facility/${route.params.id}`, 
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    
    if (response.data.length === 0) {
      documents.value = [];
      return;
    }
    
    // Process documents
    const docs = response.data.map(doc => {
      return {
        ...doc,
        equipment: [{ _id: '', typeId: '' }]
      };
    });
    
    documents.value = docs;
  } catch (error) {
    console.error("Error loading documents:", error.response);
    documents.value = [];
  } finally {
    loading.value = false;
  }
};

const loadFacility = async () => {
  try {
    const response = await axios.get(
      `${auth.apiUrl()}facility/${route.params.id}`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    
    if (response.data) {
      facility.value = response.data;
    }
  } catch (error) {
    console.error("Error loading facility:", error.response);
  }
};

onMounted(() => {
  loadDocuments();
  loadFacility();
});
</script>

<style scoped>
.good-table {
  width: 100%;
  overflow-x: hidden;
}

div.main {
  z-index: 0;
  padding-top: 82px;
  padding-left: 28px;
}

.round-button {
  width: 14px;
  height: 24px;
  line-height: 24px;
}
</style>