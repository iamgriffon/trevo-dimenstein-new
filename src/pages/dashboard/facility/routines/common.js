import logoRad from '@/assets/logo_rad.png';
import { parse, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const truncate = (str, n) => {
  if (!str) return '';
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const addLabelAndInformation = (doc, x, y, label, information) => {
  const spaceBetweenInformationAndLabel = 5;

  doc.setFontSize(8);
  doc.setFont(undefined, "bold");
  doc.text(label, x, y);
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

  if (!information) {
    doc.text("", x, y + spaceBetweenInformationAndLabel);
    return;
  }

  doc.text(information, x, y + spaceBetweenInformationAndLabel);
};

export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  return format(parseISO(dateString), "dd/MM/yy", { locale: ptBR });
};

export const addReportLogo = (doc, x, y, width, height) => {
  try {
    doc.addImage(logoRad, 'PNG', x, y, width, height);
  } catch (error) {
    console.error("Failed to load logo:", error);
    // Fallback for missing logo
    doc.setFontSize(12);
    doc.text("RAD DIMENSTEIN", x + width/2, y + height/2, { align: 'center' });
  }
};

export const generatePdf = (doc, x, y, label, information) => {
  const beginRoundedRect = 10;
  const beginTextHeight = beginRoundedRect + 13;

  // Pagination variables
  const itemsPerPage = 24;

  // Filter by selected year and month
  const yearFilter = parse(
    filterDate.value,
    "MM/yyyy",
    new Date()
  ).getFullYear();

};
