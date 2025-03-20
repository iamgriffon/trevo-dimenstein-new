<template>
  <Layout title="Pessoas">
    <template #header>
      <div class="flex gap-2">
        <button
          type="button"
          class="p-2 rounded-lg"
          :class="
            viewMode === 'card' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
          "
          @click="viewMode = 'card'"
        >
          <FontAwesomeIcon icon="fa-solid fa-th-large" />
        </button>
        <button
          type="button"
          class="p-2 rounded-lg"
          :class="
            viewMode === 'list' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
          "
          @click="viewMode = 'list'"
        >
          <FontAwesomeIcon icon="fa-solid fa-list" />
        </button>
      </div>

      <router-link
        v-if="permission.canCreateUsers(currentUser)"
        class="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        :to="{ path: '/users/register/' }"
      >
        <FontAwesomeIcon icon="fa-solid fa-plus" />
        <span class="hidden sm:inline">Adicionar</span>
      </router-link>
    </template>

    <div class="flex flex-col gap-4 w-full">
      <Input
        v-model="filter"
        placeholder="Buscar..."
        class="w-full px-3 border mb-4 rounded-md border-gray-300 max-md:w-96"
      >
        <FontAwesomeIcon icon="fa-solid fa-search" />
      </Input>
      <template v-if="loading">
        <figure
          class="w-full h-full translate-y-[25%] flex items-center justify-center"
        >
          <img
            src="/static/img/loading.gif"
            class="scale-75"
            alt="Carregando lista..."
          />
        </figure>
      </template>
      <template v-else>
        <section
          v-if="viewMode === 'card'"
          class="sm:grid sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div v-for="user in filteredUsers" :key="user._id">
            <Card :user="user" />
          </div>
        </section>
        <section
          v-else-if="viewMode === 'list' && table"
          class="overflow-x-auto bg-white rounded-lg shadow"
        >
          <Table
            :columns="columns"
            :data="filteredUsers"
            :totalItems="users.length"
            v-model:currentPage="currentPage"
            v-model:perPage="perPage"
            :class="perPage >= 20 && 'mb-20'"
          />
        </section>
        <footer
          v-if="viewMode === 'card'"
          class="flex justify-center text-2xl mt-16"
        >
          <nav class="flex gap-1">
            <button
              v-if="currentPage > 1"
              class="p-2 rounded-sm hover:bg-gray-100"
              @click="currentPage--"
              :class="defaultStyle"
            >
              &laquo;
            </button>
            <button
              v-if="currentPage > 1"
              @click="currentPage--"
              :class="defaultStyle"
            >
              {{ currentPage - 1 }}
            </button>
            <span
              class="p-2 font-medium text-white rounded-xl w-12 h-12 text-center bg-green-600"
              >{{ currentPage }}</span
            >
            <button
              v-if="currentPage * perPage < users.length"
              @click="currentPage++"
              :class="defaultStyle"
            >
              {{ currentPage + 1 }}
            </button>
            <button
              v-if="currentPage * perPage < users.length"
              @click="currentPage++"
              :class="defaultStyle"
            >
              &raquo;
            </button>
          </nav>
        </footer>
      </template>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import axios from "axios";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Card from "@/components/dashboard/users/Card.vue";
import Table from "@/components/dashboard/Table.vue";
import { h } from "vue";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import DataLetters from "@/components/common/DataLetters.vue";

const filter = ref("");
const users = ref([]);
const currentPage = ref(1);
const perPage = ref(10);
const viewMode = ref("card");
const loading = ref(false);
const router = useRouter();

const currentUser = ref(auth.currentUser());

const defaultStyle =
  "p-2 rounded-xl w-12 h-12 hover:bg-gray-100 hover:text-green-500 transition-colors duration-300";

const columns = [
{
    accessorKey: " - ",
    header: "",
    meta: {
      cellClass: "flex w-full items-center justify-center py-8",
      headerClass: "text-right pr-16",
    },
    cell: (info) =>
      h(
        DataLetters,
        {
          fullName: info.row.original.name || "Teste",
          onClick: () => {
            router.push(`/user/${info.row.original._id}`);
          },
        },
        [
          h(FontAwesomeIcon, { icon: "fa-solid fa-info" }),
          h("span", "informações"),
        ]
      ),
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "type",
    header: "Tipo de Usuário",
  },
];

const filteredUsers = computed(() => {
  if (filter.value.length > 2) {
    currentPage.value = 1;
    const exp = new RegExp(filter.value.trim(), "i");
    return users.value
      .filter((item) => exp.test(item.name))
      .slice(
        (currentPage.value - 1) * perPage.value,
        currentPage.value * perPage.value
      );
  }
  return users.value.slice(
    (currentPage.value - 1) * perPage.value,
    currentPage.value * perPage.value
  );
});

const loadUsers = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${auth.apiUrl()}users/`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });

    if (response.data.length === 0) {
      console.warn("No users found");
      users.value = [];
      return;
    }

    users.value = response.data;
  } catch (error) {
    console.error("Error loading users:", error.response);
    users.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});

watch([perPage, currentPage], () => {
  const maxPage = Math.ceil(users.value.length / perPage.value) || 1;
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage;
  }
});

const table = useVueTable({
  data: filteredUsers.value,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});
</script>

<style scoped>
[data-letters]:before {
  content: attr(data-letters);
  display: inline-block;
  font-size: 1em;
  width: 4em;
  height: 4em;
  line-height: 4em;
  text-align: center;
  border-radius: 50%;
  background: #00a767;
  vertical-align: middle;
  margin-right: 1em;
  color: white;
}

[data-letters-list]:before {
  content: attr(data-letters-list);
  display: inline-block;
  font-size: 1em;
  width: 3em;
  height: 3em;
  line-height: 3em;
  text-align: center;
  border-radius: 50%;
  background: #00a767;
  vertical-align: middle;
  margin-right: 1em;
  color: white;
}
</style>
