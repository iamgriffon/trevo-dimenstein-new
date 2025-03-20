<template>
  <Layout :title="facility.name">
    <template #breadcrumb v-if="facility.name">
      <p class="flex items-center gap-2 pl-2 text-teal-800">
        <span>/</span>
        <span class="text-gray-500 font-semibold">{{ facility.name }}</span>
      </p>
    </template>
    <template #header>
      <div class="flex items-center justify-end gap-2">
        <Button
          className="flex items-center gap-2 rounded-lg bg-gray-100 border-none text-gray-700 hover:bg-gray-200 transition-all duration-300"
          @click="downloadFacilityDocument"
        >
          <FontAwesomeIcon icon="fa-solid fa-download" />
          <span class="hidden sm:inline">Exportar</span>
        </Button>
        <Button
          class="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
        >
          <RouterLink :to="`/facility/${route.params.id}/edit`" class="flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-pencil" class="mr-2" /> Editar
          </RouterLink>
        </Button>
        <Button
          class="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-4 py-2 rounded-md"
        >
          <RouterLink :to="`/facility/${route.params.id}`" class="flex items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" class="mr-2" />
            Voltar
          </RouterLink>
        </Button>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div class="flex flex-col gap-4">
        <div
          class="bg-white rounded-lg shadow hover:shadow-theme transition-all duration-300 p-6"
        >
          <h2 class="text-lg font-medium mb-4">Informações</h2>
          <div class="space-y-3">
            <div v-if="facility.companyName" class="flex items-center">
              <FontAwesomeIcon
                icon="fa-solid fa-building"
                class="text-gray-600 mr-3"
              />
              <span
                ><span class="font-medium">Nome:</span>
                {{ facility.companyName }}</span
              >
            </div>
            <div class="flex items-center">
              <FontAwesomeIcon
                icon="fa-solid fa-id-card"
                class="text-gray-600 mr-3"
              />
              <span
                ><span class="font-medium">CNPJ:</span>
                {{ facility.cnpj }}</span
              >
            </div>
            <div v-if="facility.telephone" class="flex items-center">
              <FontAwesomeIcon
                icon="fa-solid fa-phone"
                class="text-gray-600 mr-3"
              />
              <span
                ><span class="font-medium">Telefone:</span>
                {{ facility.telephone }}</span
              >
            </div>
            <div v-if="facility.contactName" class="flex items-center">
              <FontAwesomeIcon
                icon="fa-solid fa-user"
                class="text-gray-600 mr-3"
              />
              <span
                ><span class="font-medium">Contato:</span>
                {{ facility.contactName }}</span
              >
            </div>
            <div v-if="facility.CNENregistry" class="flex items-center">
              <FontAwesomeIcon
                icon="fa-solid fa-info"
                class="text-gray-600 mr-3"
              />
              <span
                ><span class="font-medium">Registro CNEN:</span>
                {{ facility.CNENregistry }}</span
              >
            </div>
          </div>
        </div>

        <div
          v-if="activeRadioisotopes.length > 0"
          class="bg-white rounded-lg shadow hover:shadow-theme transition-all duration-300 p-6"
        >
          <h2 class="text-lg font-medium mb-4">
            Quantidade de radionuclídeos autorizados por semana
          </h2>
          <div class="space-y-2">
            <div
              v-for="(isotope, index) in activeRadioisotopes"
              :key="index"
              class="flex items-center"
            >
              <span class="font-medium mr-2">{{ isotope.name }}:</span>
              <span>{{ isotope.quantity }} mCi</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div
          v-if="facility.address && facility.address.length > 0"
          class="bg-white rounded-lg shadow hover:shadow-theme transition-all duration-300 p-6"
        >
          <h2 class="text-lg font-medium mb-4">Endereço</h2>
          <div class="flex items-start">
            <FontAwesomeIcon
              icon="fa-solid fa-map-marker"
              class="text-gray-600 mr-3 mt-1"
            />
            <span>{{ facility.address[0].street }}</span>
          </div>
        </div>

        <div
          v-if="
            facility.doDiagnosis ||
            facility.doInpatientTherapy ||
            facility.doOutpatientTherapy
          "
          class="bg-white rounded-lg shadow hover:shadow-theme transition-all duration-300 p-6"
        >
          <h2 class="text-lg font-medium mb-4">Práticas autorizadas</h2>
          <div class="space-y-2">
            <div v-if="facility.doDiagnosis" class="flex items-center">
              <FontAwesomeIcon
                icon="fa-solid fa-check"
                class="text-green-600 mr-3"
              />
              <span>Diagnóstico</span>
            </div>
            <div v-if="facility.doInpatientTherapy" class="flex items-center">
              <FontAwesomeIcon
                icon="fa-solid fa-check"
                class="text-green-600 mr-3"
              />
              <span>Terapia com Internação</span>
            </div>
            <div v-if="facility.doOutpatientTherapy" class="flex items-center">
              <FontAwesomeIcon
                icon="fa-solid fa-check"
                class="text-green-600 mr-3"
              />
              <span>Terapia Ambulatorial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import "jspdf/dist/polyfills.es.js";
import { useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { jsPDF } from "jspdf";

import Layout from "@/components/common/Layout.vue";
import Button from "@/components/ui/Button.vue";
import { api } from "@/services/api";
import { toRaw } from "vue";
const route = useRoute();
const facility = ref({
  users: [],
  equipments: [],
  radioisotopes: [],
});

const activeRadioisotopes = computed(() => {
  if (!facility.value.radioisotopes) return [];
  return facility.value.radioisotopes.filter(
    (r) => r && r.quantity && r.quantity > 0
  );
});

const loadFacility = async () => {
  try {
    const response = await api.get(`facility/${route.params.id}`);
    facility.value = response.data;
    console.log(toRaw(facility.value));
  } catch (error) {
    console.error("Error loading facility:", error);
  }
};

const addLabelAndInformation = (doc, x, y, label, info) => {
  doc.setFont(undefined, "bold");
  doc.text(label, x, y);
  doc.setFont(undefined, "normal");

  // Calculate starting position after label
  const startX =
    x +
    (doc.getStringUnitWidth(label) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor +
    2;

  // Check if we need to handle long text
  const maxWidth = 190 - startX; // Rectangle width (190) minus starting position, with 10px margin
  const textWidth =
    (doc.getStringUnitWidth(info) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;

  if (textWidth > maxWidth) {
    // Split text into lines
    const lines = doc.splitTextToSize(info, maxWidth);
    doc.text(lines, startX, y);
    // Return the number of extra lines added (for potential vertical position adjustments)
    return lines.length - 1;
  } else {
    doc.text(info, startX, y);
    return 0;
  }
};

const downloadFacilityDocument = () => {
  try {
    const doc = new jsPDF();

    // Document title
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text(facility?.value?.name || "Facility", 105, 20, { align: "center" });

    // Facility information section
    const beginFirstRoundedRect = 30;
    doc.roundedRect(10, beginFirstRoundedRect, 190, 40, 2, 2, "S");
    doc.setFontSize(12);
    doc.text("Informações Gerais", 105, beginFirstRoundedRect + 8, {
      align: "center",
    });

    const beginFirstTextHeight = beginFirstRoundedRect + 18;
    const lineHeight = 6;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");

    // Track vertical position for dynamic positioning
    let currentY = beginFirstTextHeight;

    // Add information with line break handling
    addLabelAndInformation(
      doc,
      15,
      currentY,
      "Nome:",
      facility.value.companyName || ""
    );
    currentY += lineHeight;
    addLabelAndInformation(
      doc,
      15,
      currentY,
      "CNPJ:",
      facility.value.cnpj || ""
    );
    currentY += lineHeight;
    addLabelAndInformation(
      doc,
      15,
      currentY,
      "Registro CNEN:",
      facility.value.CNENregistry || ""
    );

    // Reset current Y for the second column of the first section
    currentY = beginFirstTextHeight;

    if (facility.value.address && facility.value.address.length > 0) {
      // Add address with potential line break handling
      const extraLines = addLabelAndInformation(
        doc,
        100,
        currentY,
        "Endereço:",
        facility.value.address[0].street || ""
      );
      currentY += lineHeight * (1 + extraLines);

      if (facility.value.address[0].complement) {
        const compExtraLines = addLabelAndInformation(
          doc,
          100,
          currentY,
          "Complemento:",
          facility.value.address[0].complement
        );
        currentY += lineHeight * (1 + compExtraLines);
      }

      addLabelAndInformation(
        doc,
        100,
        currentY,
        "Cidade:",
        `${facility.value.address[0].city || ""} - ${
          facility.value.address[0].state || ""
        }`
      );
    }

    // Staff section
    const beginSecondRoundedRect = 80;
    doc.roundedRect(10, beginSecondRoundedRect, 190, 60, 2, 2, "S");
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Equipe", 105, beginSecondRoundedRect + 8, { align: "center" });

    const beginSecondTextHeight = beginSecondRoundedRect + 18;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");

    currentY = beginSecondTextHeight;

    // Add staff information with line break handling
    if (
      facility?.value?.users?.filter(
        (user) => user.responsabilities?.indexOf("Responsável técnico") >= 0
      ).length > 0
    ) {
      const rtName = facility?.value?.users?.filter(
        (user) => user.responsabilities?.indexOf("Responsável técnico") >= 0
      )[0].name;
      const extraLines = addLabelAndInformation(
        doc,
        15,
        currentY,
        "Responsável Técnico:",
        rtName
      );
      addLabelAndInformation(
        doc,
        150,
        currentY,
        "Licença AN:",
        facility?.value?.users?.filter(
          (user) => user.responsabilities?.indexOf("Responsável técnico") >= 0
        )[0].ANLicenseNumber || ""
      );
      currentY += lineHeight * (1 + extraLines);
    } else {
      addLabelAndInformation(doc, 15, currentY, "Responsável Técnico:", "");
      addLabelAndInformation(doc, 150, currentY, "Licença AN:", "");
      currentY += lineHeight;
    }

    if (
      facility.value.users.filter(
        (user) =>
          user.responsabilities?.indexOf("Substituto do responsável técnico") >=
          0
      ).length > 0
    ) {
      const subName = facility?.value?.users?.filter(
        (user) =>
          user.responsabilities?.indexOf("Substituto do responsável técnico") >=
          0
      )[0].name;
      const subExtraLines = addLabelAndInformation(
        doc,
        15,
        currentY,
        "Substituto do Responsável Técnico:",
        subName
      );
      addLabelAndInformation(
        doc,
        150,
        currentY,
        "Licença AN:",
        facility?.value?.users?.filter(
          (user) =>
            user.responsabilities?.indexOf(
              "Substituto do responsável técnico"
            ) >= 0
        )[0].ANLicenseNumber || ""
      );
      currentY += lineHeight * (1 + subExtraLines);
    } else {
      addLabelAndInformation(
        doc,
        15,
        currentY,
        "Substituto do Responsável Técnico:",
        ""
      );
      addLabelAndInformation(doc, 150, currentY, "Licença AN:", "");
      currentY += lineHeight;
    }

    if (
      facility.value.users.filter(
        (user) =>
          user.responsabilities?.indexOf("Supervisor de radioproteção") >= 0
      ).length > 0
    ) {
      const supName = facility?.value?.users?.filter(
        (user) =>
          user.responsabilities?.indexOf("Supervisor de radioproteção") >= 0
      )[0].name;
      const supExtraLines = addLabelAndInformation(
        doc,
        15,
        currentY,
        "Supervisor de Radioproteção:",
        supName
      );
      addLabelAndInformation(
        doc,
        150,
        currentY,
        "Licença FM:",
        facility?.value?.users?.filter(
          (user) =>
            user.responsabilities?.indexOf("Supervisor de radioproteção") >= 0
        )[0].FMLicenseNumber || ""
      );
      currentY += lineHeight * (1 + supExtraLines);
    } else {
      addLabelAndInformation(
        doc,
        15,
        currentY,
        "Supervisor de Radioproteção:",
        ""
      );
      addLabelAndInformation(doc, 150, currentY, "Licença FM:", "");
      currentY += lineHeight;
    }

    if (
      facility?.value?.users?.filter(
        (user) =>
          user.responsabilities?.indexOf(
            "Substituto do supervisor de radioproteção"
          ) >= 0
      ).length > 0
    ) {
      const subSupName = facility?.value?.users?.filter(
        (user) =>
          user.responsabilities?.indexOf(
            "Substituto do supervisor de radioproteção"
          ) >= 0
      )[0].name;
      const subSupExtraLines = addLabelAndInformation(
        doc,
        15,
        currentY,
        "Substituto do Supervisor de Radioproteção:",
        subSupName
      );
      addLabelAndInformation(
        doc,
        150,
        currentY,
        "Licença FM:",
        facility?.value?.users?.filter(
          (user) =>
            user.responsabilities?.indexOf(
              "Substituto do supervisor de radioproteção"
            ) >= 0
        )[0].FMLicenseNumber || ""
      );
      currentY += lineHeight * (1 + subSupExtraLines);
    } else {
      addLabelAndInformation(
        doc,
        15,
        currentY,
        "Substituto do Supervisor de Radioproteção:",
        ""
      );
      addLabelAndInformation(doc, 150, currentY, "Licença FM:", "");
      currentY += lineHeight;
    }

    // Practices and radioisotopes section
    const beginThirdRoundedRect = 150;
    const beginThirdTextHeight = beginThirdRoundedRect + 18;

    doc.roundedRect(10, beginThirdRoundedRect, 190, 75, 2, 2, "S");
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(
      "Práticas e Radioisótopos Autorizados",
      105,
      beginThirdRoundedRect + 8,
      { align: "center" }
    );

    let authorizedPractices = "";
    if (facility.value.doInpatientTherapy) {
      authorizedPractices += "Terapia com internação; ";
    }
    if (facility.value.doOutpatientTherapy) {
      authorizedPractices += "Terapia ambulatorial; ";
    }
    if (facility.value.doDiagnosis) {
      authorizedPractices += "Diagnóstico; ";
    }

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    addLabelAndInformation(
      doc,
      15,
      beginThirdTextHeight,
      "Práticas autorizadas:",
      authorizedPractices
    );

    // Add radioisotopes information
    let columnIndex = 1;
    let lineIndex = 1;
    if (facility.value.radioisotopes) {
      for (let i = 0; i < facility.value.radioisotopes.length; i++) {
        if (facility.value.radioisotopes[i]?.quantity > 0) {
          if (Math.floor(i / 4) === i / 4) {
            columnIndex = columnIndex + 1;
            lineIndex = 1;
          }
          lineIndex = lineIndex + 1;

          addLabelAndInformation(
            doc,
            columnIndex * 30 - 15,
            beginThirdTextHeight + (lineIndex - 1) * lineHeight,
            facility.value.radioisotopes[i].name + ": ",
            facility.value.radioisotopes[i].quantity + " mCi"
          );
        }
      }
    }

    // Save the PDF with a fallback name if facility name is undefined
    const fileName = `Informações ${facility?.value?.name || "Facility"}.pdf`;

    // Force download approach
    doc.output("datauri", { filename: fileName });
    // Alternatively, try this direct download approach:
    // doc.save(fileName);

    console.log("PDF saved successfully:", doc);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Ocorreu um erro ao gerar o PDF: " + error.message);
  }
};

onMounted(() => {
  loadFacility();
});
</script>
