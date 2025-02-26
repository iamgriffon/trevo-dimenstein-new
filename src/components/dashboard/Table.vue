<template>
  <section
    v-if="table && !!data.length && !!columns.length"
    class="overflow-x-auto bg-white rounded-lg shadow"
  >
    <table :class="twMerge('w-full text-center', props.class)">
      <thead>
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          :class="twMerge('bg-gray-200 text-center')"
        >
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="[header.column.columnDef.meta?.headerClass, 'h-10 mx-4']"
          >
            <component
              v-if="typeof header.column.columnDef.header === 'object'"
              :is="header.column.columnDef.header.component"
              v-bind="header.column.columnDef.header.props"
            >
              <template
                v-for="(child, index) in header.column.columnDef.header
                  .children"
                :key="index"
              >
                <component
                  v-if="child.component"
                  :is="child.component"
                  v-bind="child.props"
                />
                <span
                  v-else
                  :class="header.column.columnDef.meta?.headerClass"
                  >{{ child }}</span
                >
              </template>
            </component>
            <span v-else>
              {{ header.isPlaceholder ? null : header.column.columnDef.header }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id" class="h-8">
          <td
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            :class="[
              twMerge(
                cell.column.columnDef.meta?.cellClass,
                'h-12 w-auto truncate border-y border-gray-200 border-solid py-2'
              ),
            ]"
          >
            <component
              v-if="typeof cell.column.columnDef.cell === 'object'"
              :is="cell.column.columnDef.cell.component"
              v-bind="cell.column.columnDef.cell.props"
            >
              <template
                v-for="(child, index) in cell.column.columnDef.cell.children"
                :key="index"
              >
                <component
                  v-if="child.component"
                  :is="child.component"
                  v-bind="child.props"
                />
                <span v-else>{{ child }}</span>
              </template>
            </component>
            <FlexRender
              v-else
              :render="cell.column.columnDef.cell || defaultRenderCell"
              :props="getContextWithRow(cell)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <footer
      class="flex items-center w-full h-10 z-10 bg-white fixed bottom-0 gap-16 px-10 border-gray-500 border"
    >
      <section>
        <label> Linhas por página: </label>
        <select
          :value="perPage"
          @change="
            (event) =>
              $emit('update:perPage', (perPage = Number(event.target?.value)))
          "
          class="p-2 rounded-md cursor-pointer"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option v-if="totalItems >= 50" :value="50">50</option>
        </select>
      </section>
      <section class="flex gap-4 items-center text-lg font-medium">
        <label> Páginas: </label>
        <button
          v-if="currentPage > 1"
          @click="$emit('update:currentPage', currentPage - 1)"
        >
          &laquo;
        </button>
        <button
          v-if="currentPage > 1"
          @click="$emit('update:currentPage', currentPage - 1)"
        >
          {{ currentPage - 1 }}
        </button>
        <button class="underline">
          {{ currentPage }}
        </button>
        <button
          v-if="currentPage * perPage < totalItems"
          @click="$emit('update:currentPage', currentPage + 1)"
        >
          {{ currentPage + 1 }}
        </button>
        <button
          v-if="currentPage * perPage < totalItems"
          @click="$emit('update:currentPage', currentPage + 1)"
        >
          &raquo;
        </button>
      </section>
      <section class="text-nowrap text-center px-8 text-lg font-medium">
        Exibindo: {{ currentPage * perPage - perPage + 1 }} -
        {{
          totalItems >= currentPage * perPage
            ? currentPage * perPage
            : totalItems
        }}
        de {{ totalItems }} itens
      </section>
    </footer>
  </section>
</template>

<script setup>
import { computed, watch } from "vue";
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  FlexRender,
} from "@tanstack/vue-table";
import { twMerge } from "tailwind-merge";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  class: {
    type: [String, Array, Object],
    default: "",
  },
  perPage: {
    type: Number,
    required: true,
    default: 10,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:perPage", "update:currentPage"]);

watch(
  () => props.totalItems,
  (total) => {
    const lastPage = Math.ceil(total / props.perPage);
    if (props.currentPage > lastPage && lastPage > 0) {
      emit("update:currentPage", lastPage);
    }
  }
);

const defaultRenderCell = (props) => {
  return props.getValue();
};

const getContextWithRow = (cell) => {
  const context = cell.getContext();
  if (!context.row.original && cell.row.original) {
    context.row.original = cell.row.original;
  }
  return context;
};

const table = computed(() => {
  if (!props.data || props.data.length === 0) {
    return {
      data: [],
      columns: [],
      getCoreRowModel: null,
      getFilteredRowModel: null,
      getPaginationRowModel: null,
    };
  }

  const processedColumns = props.columns.map((column) => {
    if (!column.cell) {
      return {
        ...column,
        cell: (info) => info.getValue(),
      };
    }
    return column;
  });

  return useVueTable({
    data: props.data,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
});
</script>
