<template>
  <Layout title="Documentos da Instalação">
    <template #breadcrumb>
      <span class="mx-2 text-teal-800 select-none">/</span>
      <router-link
        :to="`/facility/${route.params.id}`"
        class="text-gray-500 hover:text-teal-800 hover:underline font-semibold"
      >
        {{ facility.name }}
      </router-link>
    </template>
    <template #header>
      <div class="flex gap-2">
        <Button
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
        >
          <RouterLink
            :to="`/facility/${route.params.id}`"
            class="flex items-center gap-2"
          >
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" />
            Voltar
          </RouterLink>
        </Button>

        <router-link
          v-if="permission.canCreateDocuments(currentUser)"
          class="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          :to="{ path: '/document/register/' }"
        >
          <FontAwesomeIcon icon="fa-solid fa-upload" />
          <span class="hidden sm:inline text-nowrap">Fazer Upload</span>
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
      <template v-else-if="!!filteredDocuments.length">
        <section class="overflow-x-auto bg-white rounded-lg shadow">
          <Table
            :key="tableKey"
            :columns="columns"
            v-model:data="filteredDocuments"
            :totalItems="documents.length"
            v-model:currentPage="currentPage"
            v-model:perPage="perPage"
            @liberateAll="liberateAll"
            @clearSelected="toggleAllSelected(false)"
          />
        </section>
      </template>
      <template v-else>
        <div class="bg-white p-6 rounded-lg shadow text-center">
          <p class="text-gray-500">Nenhum documento encontrado</p>
        </div>
      </template>
    </div>

    <Modal
      :visible="commentModal"
      title="Solicitar Correção"
      @update:visible="commentModal = false"
    >
      <div class="p-4">
        <label class="block mb-2">Comentário:</label>
        <textarea
          v-model="comment"
          class="w-full p-2 border rounded-md"
          rows="4"
          placeholder="Descreva o problema ou a correção necessária..."
        ></textarea>

        <div class="flex justify-end mt-4">
          <Button
            @click="commentModal = false"
            className="mr-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </Button>
          <Button
            @click="submitComment"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Enviar
          </Button>
        </div>
      </div>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, h, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { RouterLink, useRoute } from "vue-router";
import axios from "axios";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Table from "@/components/dashboard/Table.vue";
import Layout from "@/components/common/Layout.vue";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/common/Modal.vue";
import { twMerge } from "tailwind-merge";
import { cn } from "@/utils/cn";
import { createDateCell, createRelationCell, createTextCell, createActionButtonsCell, createStatusCell, createCheckboxCell } from "@/utils/tableCells";

const route = useRoute();
const documents = ref([]);
const facility = ref({ name: "" });
const filter = ref("");
const loading = ref(true);
const currentUser = ref(auth.currentUser());
const currentPage = ref(1);
const perPage = ref(10);
const tableKey = ref(0);
const commentModal = ref(false);
const commentId = ref(null);
const comment = ref("");

const tableButtonStyle =
  "rounded-full w-10 h-10 bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors";

const selectIconType = ref("fa-check");
const selectIconClass = ref("bg-green-500 hover:bg-green-700");

const filteredDocuments = computed(() => {
  if (filter.value.length > 2) {
    const exp = new RegExp(filter.value.trim(), "i");
    return documents.value
      .filter(
        (item) =>
          exp.test(item.name) ||
          exp.test(item.validity) ||
          exp.test(item.facility[0]?.name) ||
          exp.test(item.hash) ||
          exp.test(item.uploadedBy[0]?.name) ||
          exp.test(item.uploadedAt)
      )
  }
  
  return documents.value
});

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

const liberateSelected = (row) => {
  if (confirm("Tem certeza que deseja liberar este teste?")) {
    row.status = "Liberado";
    row.liberatedBy = {
      _id: currentUser?.value?.id,
      name: currentUser?.value?.name,
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

const onOpenRequestModal = (id) => {
  commentId.value = id;
  commentModal.value = true;
};

const submitComment = async () => {
  if (!comment.value.trim()) {
    alert("Por favor, informe um comentário");
    return;
  }

  try {
    loading.value = true;
    await axios.post(
      `${auth.apiUrl()}document/${commentId.value}/comment`,
      {
        comment: comment.value,
        commentBy: {
          _id: currentUser.value.id,
          name: currentUser.value.name,
        },
      },
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );
    commentModal.value = false;
    comment.value = "";
    loadDocuments();
  } catch (error) {
    console.error("Error submitting comment:", error);
    alert("Erro ao enviar comentário");
  } finally {
    loading.value = false;
  }
};


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
    cell: (info) => createTextCell(info, "text-left"),
    meta: {
      cellClass: "px-8 truncate text-center",
      headerClass: "px-8 text-center",
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: (info) => createTextCell(info, "text-left"),
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8 text-center",
    },
  },
  {
    accessorKey: "uploadedBy",
    header: "Upload por",
    cell: (info) =>
      h("p", { class: "text-left" }, info.row.original.uploadedBy[0]?.name),
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8 text-center",
    },
  },
  {
    accessorKey: "signedBy",
    header: "Assinado por",
    cell: (info) =>
      h("p", { class: "text-left" }, info.row.original.uploadedBy[0]?.name),
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8 text-center",
    },
  },
  {
    accessorKey: "liberatedBy",
    header: "Liberado por",
    cell: (info) =>
      createRelationCell(
        info?.row?.original?.liberatedBy,
        "name",
        "text-center"
      ),
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8 text-center",
    },
  },
  {
    accessorKey: "uploadedAt",
    header: "Upload",
    sortable: true,
    cell: (info) => createDateCell(info, "text-left"),
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8 text-center",
    },
  },
  {
    accessorKey: "validity",
    header: "Validade",
    sortable: true,
    cell: (info) => createDateCell(info, "text-left"),
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8 text-center",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      headerClass: "px-8 text-center",
      cellClass: "px-8 text-center",
    },
    cell: (info) => createStatusCell(info),
  },
];

const initialFilter = {
  pageSize: perPage.value,
  limit: perPage.value,
  pageNum: currentPage.value,
};


const loadDocuments = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `${auth.apiUrl()}document/facility/${route.params.id}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
        params: initialFilter
      }
    );

    if (response.data.length === 0) {
      documents.value = [];
      return;
    }

    const docs = response.data.map((doc) => {
      return {
        ...doc,
        equipment: [{ _id: "", typeId: "" }],
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

watch(filter, () => {
  currentPage.value = 1;
  tableKey.value++;
});
</script>
