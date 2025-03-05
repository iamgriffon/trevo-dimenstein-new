<template>
  <Layout title="Avaliação de EPIs">
    <template #header>
      <div class="flex gap-2 items-center">
        <span class="text-lg font-medium">Tipo de busca: </span>
        <button
          type="button"
          class="p-2 rounded-lg flex gap-2 items-center"
          :class="
            !advancedSearch
              ? 'bg-green-200 text-green-600 hover:bg-green-200'
              : 'bg-gray-100 hover:bg-gray-300',
            'transition-all duration-300'
          "
          @click="toggleSearch(false)"
        >
          Simples <FontAwesomeIcon icon="fa-solid fa-search" />
        </button>
        <button
          type="button"
          class="p-2 rounded-lg flex gap-2 items-center"
          :class="
            !!advancedSearch
              ? 'bg-green-200 text-green-600 hover:bg-green-200'
              : 'bg-gray-100 hover:bg-gray-300',
            'transition-all duration-300'
          "
          @click="toggleSearch(true)"
        >
          Avançada <FontAwesomeIcon icon="fa-solid fa-filter" />
        </button>
      </div>
      <router-link
        id="add-button"
        v-if="permission.canCreateDocuments(currentUser)"
        class="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300"
        :to="{ path: '/equipments/epi/register/' }"
      >
        <FontAwesomeIcon icon="fa-solid fa-plus" />
        <span class="hidden sm:inline">Adicionar</span>
      </router-link>
    </template>

    <div class="flex flex-col gap-4">
      <template v-if="!advancedSearch">
        <Input
          v-model="filter"
          placeholder="Buscar..."
          class="w-full px-3 border mb-4 rounded-md border-gray-300 max-md:w-96"
        >
          <FontAwesomeIcon icon="fa-solid fa-search" />
        </Input>
      </template>
      <template v-else>
        <form @submit.prevent="onAdvancedSearch" class="flex gap-2">
          <Input
            v-model="advancedFilter"
            placeholder="Buscar..."
            class="w-[80%] px-3 border mb-4 rounded-md border-gray-300 max-md:w-96"
          >
            <FontAwesomeIcon icon="fa-solid fa-search" />
          </Input>
          <button
            :type="submit"
            :class="'w-[20%] h-10 rounded-md bg-green-600 hover:bg-green-700 transition-all duration-300 text-white'"
          >
            Buscar
          </button>
        </form>
      </template>
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
        <section v-if="filteredDocuments.length > 0">
          <Table
            :columns="columns"
            :data="filteredDocuments"
            :total-items="documents.length"
            v-model:perPage="perPage"
            v-model:currentPage="currentPage"
            @liberateAll="liberateAll"
            @clearSelected="toggleAllSelected(false)"
          />
        </section>
      </template>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Input from "@/components/ui/Input.vue";
import Layout from "@/components/common/Layout.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Table from "@/components/dashboard/Table.vue";
import { cn } from "@/utils/cn";

const filter = ref("");
const advancedFilter = ref("");
const documents = ref([]);
const currentUser = ref(auth.currentUser());
const facilities = ref([]);
const ready = ref(false);
const loading = ref(false);
const allSelected = ref(false);
const error = ref("");
const currentPage = ref(1);
const totalItems = ref(0);
const perPage = ref(10);
const advancedSearch = ref(false);
const selectIconType = ref("fa-check");
const selectIconClass = ref("bg-green-500 hover:bg-green-700");

function toggleAllSelected(newValue) {
  const isSomeSelected = filteredDocuments.value?.some(
    (item) => !!item.selected
  );
  let newValues = [];

  const shouldSelectAll =
    typeof newValue === "undefined"
      ? !isSomeSelected
      : !!newValue;

  selectIconType.value = isSomeSelected ? 'fa-check' : 'fa-times-circle';
  selectIconClass.value = isSomeSelected ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'

  newValues = documents.value?.map((item) => ({
    ...item,
    selected: shouldSelectAll,
  }));
  documents.value = newValues;
}

function toggleSearch(value) {
  advancedSearch.value = value;
  if (!value) {
    loadDocuments();
  }
}

const deleteDocument = (documentId) => {
  if (confirm("Tem certeza que deseja excluir este documento?")) {
    auth.excludeDocument(null, documentId, () =>
      setTimeout(() => {
        loading.value = false;
        loadDocuments();
      }, 1000)
    );
  }
};

function clearSelected() {
  allSelected.value = !allSelected.value;
  documents.value.forEach((doc) => {
    doc.selected = false;
  });
}

const tableButtonStyle =
  "rounded-full w-10 h-10 bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors";

const columns = [
  {
    accessorKey: "type",
    header: {
      component: () =>
        h(
          "button",
          {
            class: cn(
              "w-10 h-10 rounded-md text-xs transition-all duration-300 cursor-pointer text-white",
              selectIconClass.value
            ),
            onClick: () => toggleAllSelected(),
          },
          h(FontAwesomeIcon, {
            icon: cn("fa-solid", selectIconType.value),
          })
        ),
    },
    cell: (info) => {
      return h("input", {
        type: "checkbox",
        checked: !!info.row.original.selected,
        onChange: () => {
          info.row.original.selected = !info.row.original.selected;
        },
      });
    },
    meta: {
      headerClass: "px-8",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: (info) => {
      const actionButtons = [
        {
          type: "a",
          icon: "fa-solid fa-eye",
          props: {
            class: tableButtonStyle,
            href: info.row.original.path,
            target: "_blank",
            title: "Visualizar",
          },
        },
        {
          type: "button",
          icon: "fa-solid fa-trash",
          props: {
            class: cn(
              tableButtonStyle,
              !permission.canExcludeDocuments(currentUser.value) && "hidden"
            ),
            onClick: () => deleteDocument(info.row.original._id),
            title: "Excluir",
          },
        },
      ];
      return h(
        "div",
        { class: "flex gap-2 items-center justify-center h-14 mx-4" },
        actionButtons.map((btn) =>
          h(btn.type, btn.props, [
            h(FontAwesomeIcon, { icon: btn.icon, class: "w-4 h-4" }),
          ])
        )
      );
    },
    meta: {
      headerClass: "px-8",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    sortable: true,
    meta: {
      headerClass: "px-8 text-center",
      cellClass: " text-center px-8",
    },
  },
  {
    accessorKey: "conclusion",
    header: "Conclusão",
    cell: (info) => info.row.original.conclusion,
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "facility",
    header: "Instalação",
    cell: (info) => info.row.original.facility[0]?.name,
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8",
    },
  },

  {
    accessorKey: "uploadedBy",
    header: "Upload por",
    cell: (info) => info.row.original.uploadedBy[0]?.name,
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "uploadedAt",
    header: "Upload",
    sortable: true,
    cell: (info) =>
      info.row.original?.uploadedAt
        ? new Date(info.row.original?.uploadedAt).toLocaleDateString()
        : "-",
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "validity",
    header: "Validade",
    sortable: true,
    cell: (info) =>
      info.row.original?.validity
        ? new Date(info.row.original.validity).toLocaleDateString()
        : "-",
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      headerClass: "px-8",
      cellClass: "px-8",
    },
    cell: (info) => {
      const styleMap = {
        Liberado: "bg-transparent text-black",
        Assinado: "bg-gray-600 hover:bg-gray-700 text-white",
        "Falta assinar": "bg-red-600 hover:bg-red-700 text-white",
        Corrigir: "bg-yellow-600 hover:bg-yellow-700 text-white",
      };
      const { status } = info.row.original;
      return h(
        "span",
        {
          class: cn(
            styleMap[status],
            "transition-colors duration-300 rounded-2xl p-2 select-none cursor-default"
          ),
        },
        info.row.original.status
      );
    },
  },
];

const filteredDocuments = computed(() => {
  if (filter.value.length > 0) {
    currentPage.value = 1;
    const exp = new RegExp(filter.value.trim(), "i");
    return documents.value
      .filter(
        (item) =>
          exp.test(item.name) ||
          exp.test(item.validity) ||
          exp.test(item.facility[0].name) ||
          exp.test(item.hash) ||
          exp.test(item.uploadedBy[0].name) ||
          exp.test(item.uploadedAt)
      )
      .slice(
        (currentPage.value - 1) * perPage.value,
        currentPage.value * perPage.value
      );
  } else {
    return documents.value.slice(
      (currentPage.value - 1) * perPage.value,
      currentPage.value * perPage.value
    );
  }
});

const clearAllDocuments = () => {
  return new Promise((resolve) => {
    ready.value = false;
    loading.value = true;
    documents.value = [];
    error.value = "";
    resolve();
  });
};

const canFetchTests =
  currentUser.value.type === "administrador" ||
  currentUser.value.type === "rad laudos" ||
  currentUser.value.type === "rad fisico" ||
  currentUser.value.type === "rad admin";

const fetchDocuments = async (filter) => {
  const endpoint = "documents/byTestId";
  const response = await axios.get(`${auth.apiUrl()}${endpoint}`, {
    headers: { Authorization: `Bearer ${auth.getToken()}` },
    params: {
      filters: JSON.stringify(filter),
      testId: "5cb5d3865e719264dd704b67",
    },
  });
  if (!response.data.list.length) {
    console.warn("No documents found");
    error.value = "Nenhum documento encontrado";
    documents.value = [];
    return;
  }

  documents.value = response.data.list;
  totalItems.value = response.data.paging.total;

  if (!response.data.list.length) return;

  for (
    let i = 2;
    i <= Math.ceil(totalItems.value / perPage.value) && i <= 50;
    i++
  ) {
    const reqFilterNext = {
      pageSize: 10,
      pageNum: i,
      limit: 10,
      status: "",
    };
    const resp = await axios.get(`${auth.apiUrl()}documents/byTestId`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
      params: {
        filters: JSON.stringify(reqFilterNext),
        testId: "5cb5d3865e719264dd704b67",
      },
    });

    if (!!resp.data.list.length) {
      documents.value.push(...resp.data.list);
    }
    if (documents.value.length >= 10) {
      loading.value = false;
    }
  }
};

const fetchFacilityDocs = async (filter) => {
  try {
    const response = await axios.get(auth.apiUrl() + "facilities/", {
      headers: { Authorization: "Bearer " + auth.getToken() },
      params: { filters: reqFilter },
    });

    if (response.data.list.length === 0) {
      error.value = "Nenhum documento encontrado";
      facilities.value = [];
      ready.value = true;
    } else {
      facilities.value.push(...response.data.list);
      ready.value = true;
      error.value = "";

      for (const facility of response.data.list) {
        await requestFacilityEPIDocs(facility._id);
      }
    }
  } catch (err) {
    error.value = err.data;
    documents.value = [];
  }
};

const requestFacilityEPIDocs = async (facilityId) => {
  try {
    const response = await axios.get(
      auth.apiUrl() + "document/facility/" + facilityId,
      {
        headers: { Authorization: "Bearer " + auth.getToken() },
      }
    );

    if (response.data.length === 0) {
      error.value = "Nenhum resultado encontrado";
      documents.value = [];
    } else {
      let docs = response.data.filter((doc) => {
        return doc.test[0]._id === "5cb5d3865e719264dd704b67";
      });
      documents.value.push(...docs);
      documents.value.sort((a, b) => {
        return (
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      });
    }
  } catch (error) {
    error.value = error.data;
    documents.value = [];
  }
};

const loadDocuments = async () => {
  loading.value = true;
  await clearAllDocuments();
  try {
    const initialFilter = { pageSize: 10, pageNum: 1, limit: 10, status: "" };
    if (canFetchTests) {
      return await fetchDocuments(initialFilter);
    }
    return await fetchFacilityDocs(initialFilter);
  } catch (err) {
  } finally {
    loading.value = false;
  }
};

const onAdvancedSearch = async () => {
  advancedFilter.value = "";
  axios
    .get(auth.apiUrl() + "searchEPIDocs/" + advancedFilter.value, {
      headers: { Authorization: "Bearer " + auth.getToken() },
    })
    .then((response) => {
      if (response.data.length === 0) {
        error.value = "Nenhum resultado encontrado";
        documents.value = [];
      } else {
        let docs = response.data;
        documents.value.push(...docs);
        documents.value.sort((a, b) => {
          return (
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          );
        });
      }
    })
    .catch((err) => {
      error.value = err.data;
      documents.value = [];
    });
};

onMounted(() => {
  loadDocuments();
});
</script>
