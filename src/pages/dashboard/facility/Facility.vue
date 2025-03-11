<template>
  <Layout :title="facility.name">
    <template #header>
      <div class="flex gap-2">
        <router-link
          :to="{ path: '/facility/' + facility._id + '/info' }"
          class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
        >
          <FontAwesomeIcon icon="fa-solid fa-info" />
          <span class="hidden sm:inline">Informações</span>
        </router-link>

        <router-link
          v-if="permission.canEditFacility(currentUser)"
          :to="facility._id + '/edit'"
          class="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          <FontAwesomeIcon icon="fa-solid fa-edit" />
          <span class="hidden sm:inline">Editar</span>
        </router-link>

        <button
          v-if="permission.canExcludeFacility(currentUser)"
          @click="exclude()"
          class="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300"
        >
          <FontAwesomeIcon icon="fa-solid fa-trash-alt" />
          <span class="hidden sm:inline">Excluir</span>
        </button>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardLink
          :href="'/facility/' + facility._id + '/documents'"
          className="border-l-green-600 h-36 w-64 flex items-center justify-start"
          title="Lista de Documentos"
        />

        <CardLink
          :href="'/facility/' + facility._id + '/equipments'"
          className="border-l-blue-600 h-36 w-64 flex items-center justify-start"
          title="Equipamentos"
        />

        <CardLink
          :href="'/facility/' + facility._id + '/routines'"
          className="border-l-purple-600 h-36 w-64 flex items-center justify-start"
          title="Rotinas"
        />
      </div>

      <div
        class="bg-white rounded-lg shadow p-4 mt-4"
        v-if="facility.users.length > 0"
      >
        <h3 class="text-lg font-medium mb-4">Pessoas</h3>
        <Table
          :columns="columns"
          :data="facility.users"
          :totalItems="facility.users.length"
          :currentPage="1"
          :perPage="10"
        />
      </div>

      <template v-if="permission.canCreateDocuments(currentUser)">
        <div class="bg-white rounded-lg p-4 mt-4">
          <h2 class="text-xl font-medium mb-4">Enviar Documentos</h2>
          <DocumentUploader
            :show="showUploadModal"
            :facility="facility._id"
            @close="showUploadModal = false"
          />
        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
import auth from "@/services/authentication";
import permission from "@/services/permissions";
import Layout from "@/components/common/Layout.vue";
import Table from "@/components/dashboard/Table.vue";
import DocumentUploader from "@/components/common/DocumentUploader.vue";
import { toRaw } from "vue";
import CardLink from "@/components/common/CardLink.vue";

const router = useRouter();
const facility = ref({
  name: "",
  users: [],
  equipments: [],
  _id: "",
});
const loading = ref(true);
const showUploadModal = ref(false);
const currentUser = auth.currentUser();
const typesOfTest = ref([]);
const equipments = ref([]);

const columns = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "responsabilities",
    header: "Responsabilidade",
    cell: (info) =>
      !!info.getValue().length ? info.getValue().join(", ") : "-",
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
            path: `/user/${info.row.original._id}`,
          },
          class:
            "flex items-center justify-center p-2 rounded-md gap-2 bg-gray-100 cursor-pointer hover:shadow-inner hover:bg-gray-200 transition-all duration-300",
        },
        [
          h(FontAwesomeIcon, { icon: "fa-solid fa-info" }),
          h("span", "informações"),
        ]
      ),
  },
];

const loadFacility = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `${auth.apiUrl()}facility/${router.currentRoute.value.params.id}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }
    );

    if (!response.data) {
      console.warn("No facility found");
      return;
    }

    facility.value = response.data;
  } catch (error) {
    console.error("Error loading facility:", error.response);
  } finally {
    loading.value = false;
    console.log(toRaw(facility.value));
  }
};

const loadTypesOfTest = async () => {
  try {
    const response = await axios.get(`${auth.apiUrl()}typeOfEquipment`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
    });

    if (response.data.length === 0) {
      return;
    }

    // Load equipment
    const equipmentRes = await axios.get(
      `${auth.apiUrl()}facility/${
        router.currentRoute.value.params.id
      }/equipments`,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } }
    );

    if (equipmentRes.data.length > 0) {
      for (const equipment of equipmentRes.data) {
        const typeRes = await axios.get(
          `${auth.apiUrl()}test/typeOfEquipment/${equipment.typeId}`,
          { headers: { Authorization: `Bearer ${auth.getToken()}` } }
        );

        if (typeRes.data.length > 0) {
          for (const typeOfTest of typeRes.data) {
            if (!typesOfTest.value.find((e) => e._id === typeOfTest._id)) {
              typesOfTest.value.push({
                name: `${typeOfTest.typeOfEquipment} - ${typeOfTest.name}`,
                testName: typeOfTest.name,
                _id: typeOfTest._id,
              });
            }
          }
          typesOfTest.value.sort((a, b) => a.name.localeCompare(b.name));
        }

        const formattedEquipment = {
          ...equipment,
          name: `${equipment.type} - ${equipment.manufacturer} ${equipment.model} ${equipment.serialNumber}`,
        };
        equipments.value.push(formattedEquipment);
      }
      equipments.value.sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch (error) {
    console.error("Error loading types of test:", error.response);
  }
};

const exclude = () => {
  if (confirm("Tem certeza que deseja excluir esta instalação?")) {
    auth.excludeFacility({ facility: facility.value }, "/facility");
  }
};

onMounted(() => {
  loadFacility();
  loadTypesOfTest();
});
</script>

<style scoped>
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
