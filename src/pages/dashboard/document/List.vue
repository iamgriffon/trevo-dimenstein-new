<template>
  <Layout title="Documentos">
    <template #header>
      <router-link
        v-if="permission.canCreateDocuments(currentUser)"
        class="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        :to="{ path: '/document/register/' }"
      >
        <FontAwesomeIcon icon="fa-solid fa-upload" />
        <span class="hidden sm:inline">Fazer upload</span>
      </router-link>
    </template>

    <Modal
      title="Adicionar comentário"
      v-model:visible="commentModal"
      class="w-96 bg-white"
    >
      <form
        @submit.prevent="console.log(commentId)"
        class="w-full flex flex-col gap-2"
      >
        <section class="flex flex-col gap-1">
          <textarea
            :value="comment"
            @input="(event) => (comment = event.target.value)"
            class="min-h-20 w-96 mt-4 border border-gray-200 focus:outline-none"
            name="comment-textarea"
          >
          </textarea>
          <label
            for="comment-textarea"
            class="text-right text-sm text-gray-600"
          >
            {{ currentUser.name }} - {{ today }}
          </label>
        </section>
        <button
          type="submit"
          class="flex items-center justify-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Comentar e solicitar correção
        </button>
      </form>
    </Modal>

    <div class="flex flex-col gap-4">
      <Input
        v-model="filter"
        placeholder="Buscar..."
        @update:modelValue="currentPage = 1"
      >
        <FontAwesomeIcon icon="fa-solid fa-search" class="mr-2" />
      </Input>

      <template v-if="loading">
        <figure
          class="w-full h-full translate-y-[25%] flex items-center justify-center"
        >
          <img
            src="/static/img/loading.gif"
            class="scale-75"
            alt="Carregando documentos..."
          />
        </figure>
      </template>

      <template v-else>
        <section
          v-if="documents.length > 0"
          class="overflow-x-auto bg-white rounded-lg shadow"
        >
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

        <div v-if="error" class="p-4 text-red-600 bg-red-100 rounded-lg">
          <FontAwesomeIcon
            icon="fa-solid fa-exclamation-triangle"
            class="mr-2"
          />
          {{ error }}
        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch, toRaw } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { RouterLink, useRoute } from "vue-router";

import axios from "axios";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Table from "@/components/dashboard/Table.vue";
import { format, parseISO } from "date-fns";
import { h } from "vue";
import { twMerge } from "tailwind-merge";
// import "pdfjs-dist";
import Hashids from "hashids";
import Modal from "@/components/common/Modal.vue";
import { cn } from "@/utils/cn";
import {
  createTextCell,
  createDateCell,
  createRelationCell,
  createStatusCell,
  createCheckboxCell,
  createActionButtonsCell,
  filterDocuments,
} from "@/utils/tableCells";

const filter = ref("");
const documents = ref([]);
const currentPage = ref(1);
const perPage = ref(10);
const loading = ref(false);
const error = ref("");
const selectedDocs = ref([]);
const totalItems = ref(0);
const today = ref(format(new Date(), "dd/MM/yyyy"));
const pdfUrl = ref("");
const url = ref("");
const comment = ref("");
const commentModal = ref(false);
const commentId = ref("");

const selectIconType = ref("fa-check");
const selectIconClass = ref("bg-green-500 hover:bg-green-700");

function toggleAllSelected(newValue) {
  const isSomeSelected = filteredDocuments.value?.some(
    (item) => !!item.selected
  );
  let newValues = [];

  const shouldSelectAll =
    typeof newValue === "undefined" ? !isSomeSelected : !!newValue;

  selectIconType.value = isSomeSelected ? "fa-check" : "fa-times-circle";
  selectIconClass.value = isSomeSelected
    ? "bg-green-500 hover:bg-green-700"
    : "bg-red-500 hover:bg-red-700";

  newValues = documents.value?.map((item) => ({
    ...item,
    selected: shouldSelectAll,
  }));
  documents.value = newValues;
}

function onOpenRequestModal(id) {
  commentId.value = id;
  commentModal.value = true;
}

const currentUser = ref(auth.currentUser());
const route = useRoute();

const tableButtonStyle =
  "rounded-full w-10 h-10 bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors";

const filteredDocuments = computed(() => {
  return filterDocuments(
    documents.value,
    filter.value,
    currentPage.value,
    perPage.value
  );
});

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
    cell: (info) => createCheckboxCell(info),
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
          icon: "fa-solid fa-times-circle",
          props: {
            class: twMerge(
              tableButtonStyle,
              !(
                permission.canComment(currentUser.value) &&
                !info.row.original.signedBy.length
              ) && "hidden"
            ),
            onClick: () => {
              onOpenRequestModal(info.row.original._id);
            },
            title: "Corrigir",
          },
        },
        {
          type: "button",
          icon: "fa-solid fa-share-square",
          props: {
            class: twMerge(
              tableButtonStyle,
              !(
                info.row.original.status === "Assinado" &&
                permission.canLiberate(currentUser.value)
              ) && "hidden"
            ),
            onClick: () => liberateSelected(info.row.original),
            title: "Liberar",
          },
        },
        {
          type: "button",
          icon: "fa-solid fa-clock",
          props: {
            class: twMerge(
              tableButtonStyle,
              !(
                info.row.original.status == "Liberado" &&
                info.row.original.scheduledEmail &&
                !info.row.original.sendedEmail &&
                permission.canSign(currentUser.value)
              ) && "hidden"
            ),
            onClick: () => scheduleEmailSelected(info.row.original),
            title: "Programar email",
          },
        },
        {
          type: "button",
          icon: "fa-solid fa-check",
          props: {
            class: twMerge(
              tableButtonStyle,
              !(
                info.row.original.status == "Liberado" &&
                info.row.original.scheduledEmail &&
                info.row.original.sendedEmail &&
                permission.canSign(currentUser.value)
              ) && "hidden"
            ),
            title: "Email enviado",
          },
        },
        {
          type: RouterLink,
          icon: "fa-solid fa-pen-to-square",
          props: {
            class: twMerge(
              tableButtonStyle,
              !permission.canExcludeDocuments(currentUser.value) && "hidden"
            ),
            to: `equipments${
              route.params.id || info.row.original.equipment?.[0]?.typeId || ""
            }/${info.row.original.equipment?.[0]?._id || ""}/${
              info.row.original._id
            }/edit`,
            title: "Editar",
          },
        },
        {
          type: "button",
          icon: "fa-solid fa-trash",
          props: {
            class: twMerge(
              tableButtonStyle,
              !permission.canExcludeDocuments(currentUser.value) && "hidden"
            ),
            onClick: () => deleteDocument(info.row.original._id),
            title: "Excluir",
          },
        },
      ];
      return createActionButtonsCell(info, actionButtons);
    },
    meta: {
      headerClass: "px-8",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "conclusion",
    header: "Conclusão",
    meta: {
      cellClass: "px-8 truncate text-left",
      headerClass: "px-8 text-left",
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: (info) => createTextCell(info, "text-left"),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "facility",
    header: "Instalação",
    cell: (info) =>
      h("p", { class: "text-left" }, info.row.original.facility[0]?.name),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "uploadedBy",
    header: "Upload por",
    cell: (info) =>
      h("p", { class: "text-left" }, info.row.original.uploadedBy[0]?.name),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "signedBy",
    header: "Assinado por",
    cell: (info) =>
      h("p", { class: "text-left" }, info.row.original.uploadedBy[0]?.name),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "liberatedBy",
    header: "Liberado por",
    cell: (info) =>
      createRelationCell(
        info?.row?.original?.liberatedBy,
        "name",
        "text-left"
      ),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-8",
    },
  },
  {
    accessorKey: "uploadedAt",
    header: "Upload",
    sortable: true,
    cell: (info) => createDateCell(info, "text-left"),
    meta: {
      headerClass: "px-8 text-left",
      cellClass: "px-4",
    },
  },
  {
    accessorKey: "validity",
    header: "Validade",
    sortable: true,
    cell: (info) => createDateCell(info, "text-left"),
    meta: {
      headerClass: "px-8 text-left",
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
    cell: (info) => createStatusCell(info),
  },
];

const loadDocuments = async () => {
  loading.value = true;

  try {
    const paramMap = {
      corrigir: "Corrigir",
      assinar: "Falta assinar",
      liberar: "Assinado",
    };

    const initialFilter = {
      pageSize: perPage.value,
      limit: perPage.value,
      pageNum: currentPage.value,
      status: route.params.status || "",
    };

    const response = await axios.get(
      `${auth.apiUrl()}documents${
        route.params.status ? `/${paramMap[route.params.status]}` : ""
      }`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
        params: !route.params.status?.length
          ? {
              filters: JSON.stringify(initialFilter),
            }
          : {},
      }
    );

    totalItems.value = response.data.paging?.total || response.data.length;
    documents.value = response?.data?.list || response.data;
    error.value = "";
  } catch (err) {
    error.value = err.response?.data?.message || "Erro ao carregar documentos";
    documents.value = [];
  } finally {
    loading.value = false;
  }
};

const liberateSelected = (row) => {
  if (confirm("Tem certeza que deseja liberar este teste?")) {
    row.status = "Liberado";
    row.liberatedBy = {
      _id: currentUser.value.id,
      name: currentUser.value.name,
    };
    row.liberatedAt = new Date();

    loading.value = true;
    auth.liberateDocument(null, row, () =>
      setTimeout(() => {
        loading.value = false;
        loadDocuments();
      }, 6000)
    );
  }
};

const scheduleEmailSelected = (row) => {
  if (confirm("Tem certeza que deseja programar o email deste documento?")) {
    loading.value = true;
    auth.scheduleEmailDocument(null, row, () =>
      setTimeout(() => {
        loading.value = false;
        loadDocuments();
      }, 1000)
    );
  }
};

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

async function liberateAll() {
  loading.value = true;
  try {
    await Promise.all(
      filteredDocuments.value
        .filter((doc) => !!doc.selected)
        .map((val) => auth.liberateDocument(null, val._id))
    );
  } catch {
  } finally {
    toggleAllSelected(false);
    loadDocuments();
  }
}

const viewSelected = async (id, path) => {
  try {
    const response = await axios.get(`${auth.apiUrl()}document/${id}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });
    pdfUrl.value = response.data;
    url.value = path;
  } catch (error) {
    error.value = error.data;
  }
};

const signSelected = (test) => {
  const hashids = new Hashids(
    "AKJSBDalsdabskJASd",
    8,
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
  );
  test.hash = hashids.encode(
    Math.floor(Math.random() * 100 + 1),
    Math.floor(Math.random() * 100 + 1),
    Math.floor(Math.random() * 100 + 1)
  );
  test.mode = "last";
};

onMounted(() => {
  loadDocuments();
});

watch(
  [() => route.params.status, () => currentPage.value, () => perPage.value],
  () => {
    loadDocuments();
  }
);

watch(
  documents,
  (newVal) => {
    selectedDocs.value = newVal
      .filter((doc) => toRaw(doc).selected)
      .map((doc) => toRaw(doc));
  },
  { deep: true }
);

watch(perPage, (newVal) => {
  currentPage.value = 1;
});
</script>

<style scoped>
#pdfModal___BV_modal_body_ > iframe:nth-child(1) {
  width: -moz-available;
  height: -moz-available;
  min-height: 90vh;
}
</style>
