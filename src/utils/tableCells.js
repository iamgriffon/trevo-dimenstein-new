import { h } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { twMerge } from "tailwind-merge";
import { cn } from "@/utils/cn";

export const createTextCell = (info, className = "text-center") => {
  return h(
    "span", 
    { 
      class: className, 
      title: info.getValue() 
    }, 
    info.getValue()?.trim() ? info.getValue() : "—"
  );
};

export const createDateCell = (info, className = "text-center") => {
  const value = info.getValue();
  if (!value) {
    return h(
      "span", 
      { 
        class: className, 
        title: "—" 
      }, 
      "—"
    );
  }
  
  const formatted = new Date(value).toLocaleDateString("pt-BR");
  return h(
    "span", 
    { 
      class: className, 
      title: formatted 
    }, 
    formatted
  );
};

export const createRelationCell = (info, fieldName, className = "text-center") => {
  const value = info?.row?.original?.[fieldName];
  if (!value) {
    return h(
      "span", 
      { 
        class: className, 
        title: "—" 
      }, 
      "—"
    );
  }
  
  const displayValue = value[0][fieldName];
  return h(
    "span", 
    { 
      class: className, 
      title: displayValue 
    }, 
    displayValue
  );
};

export const createStatusCell = (info, styleMap = {}) => {
  const status = info.getValue() || info.row.original.status;

  if (!status) {
    return h("span", "—");
  }
  
  const defaultStyleMap = {
    Liberado: "bg-transparent text-black",
    Assinado: "bg-gray-600 hover:bg-gray-700 text-white",
    "Falta assinar": "bg-red-600 hover:bg-red-700 text-white",
    Corrigir: "bg-yellow-600 hover:bg-yellow-700 text-white",
  };

  const combinedStyleMap = { ...defaultStyleMap, ...styleMap };
  
  return h(
    "span",
    {
      class: twMerge(
        combinedStyleMap[status] || "bg-gray-200 text-gray-800",
        "transition-colors duration-300 rounded-2xl p-2 select-none cursor-default"
      ),
    },
    status
  );
};

export const createCheckboxCell = (info) => {
  return h("input", {
    type: "checkbox",
    checked: !!info.row.original.selected,
    onChange: () => {
      info.row.original.selected = !info.row.original.selected;
    },
  });
};

export const createActionButton = (type, icon, props = {}, children = []) => {
  return {
    type,
    icon,
    props
  };
};

export const createActionButtonsCell = (info, actionButtons, containerClass = "flex gap-2 items-center justify-center h-14 mx-4") => {
  return h(
    "div",
    { class: containerClass },
    actionButtons.map((btn) => {
      if (btn.type === "RouterLink" || btn.type.name === "RouterLink") {
        return h(
          btn.type,
          { ...btn.props },
          {
            default: () => [
              h(FontAwesomeIcon, { icon: btn.icon, class: btn.iconClass || "w-4 h-4", title: btn.title }),
              btn.text && h("span", { class: "text-sm" }, btn.text),
            ],
          }
        );
      }
      
      return h(btn.type, btn.props, [
        h(FontAwesomeIcon, { icon: btn.icon, class: btn.iconClass || "w-4 h-4", title: btn.title }),
      ]);
    })
  );
};

export function filterDocuments(documents, filter, currentPage, perPage) {
  if (!filter?.trim()) {
    return documents;
  }
  
  return documents.filter(doc => 
    doc.name.toLowerCase().includes(filter.toLowerCase())
  );
} 