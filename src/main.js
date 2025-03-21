import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "@/routes";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faChevronDown,
  faChevronUp,
  faBars,
  faBug,
  faSpinner,
  faQrcode,
  faFile,
  faUser,
  faSearch,
  faCircleNotch,
  faCubes,
  faKey,
  faLock,
  faCog,
  faExclamationCircle,
  faChevronRight,
  faSignOutAlt,
  faShield,
  faScrewdriverWrench,
  faBuilding,
  faVials,
  faDiagnoses,
  faRotate,
  faInfoCircle,
  faUsers,
  faShareSquare,
  faSignature,
  faTimesCircle,
  faInbox,
  faThLarge,
  faList,
  faPlus,
  faInfo,
  faUpload,
  faExclamationTriangle,
  faEye,
  faPenToSquare,
  faTrash,
  faClock,
  faCheck,
  faChevronLeft,
  faFilter,
  faBook,
  faArchive,
  faDownload,
  faPrint,
  faIdCard,
  faMapMarker,
  faPhone,
  faEnvelope,
  faTrashAlt,
  faCheckCircle,
  faComment,
  faCheckSquare,
  faArrowLeft,
  faPencil,
  faIdBadge,
  faSave,
  faMapMarked,
  faSquare,
  faHashtag,
  faTag,
  faImage,
  faProjectDiagram,
  faCalendar,
  faAsterisk,
  faDotCircle,
  faCalendarAlt,
  faEyeSlash,
  faFilePdf,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

import VueGoodTablePlugin from "vue-good-table-next";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import "vue-good-table-next/dist/vue-good-table-next.css";
import PrimeVue from "primevue/config";
import { faReact } from "@fortawesome/free-brands-svg-icons";

library.add(
  faUser,
  faBug,
  faKey,
  faCog,
  faLock,
  faExclamationCircle,
  faChevronRight,
  faQrcode,
  faSpinner,
  faRotate,
  faSearch,
  faCircleNotch,
  faBuilding,
  faCubes,
  faFile,
  faChevronDown,
  faChevronUp,
  faBars,
  faSignOutAlt,
  faShield,
  faScrewdriverWrench,
  faVials,
  faDiagnoses,
  faHome,
  faInfoCircle,
  faUsers,
  faShareSquare,
  faSignature,
  faTimesCircle,
  faInbox,
  faThLarge,
  faList,
  faPlus,
  faInfo,
  faUpload,
  faExclamationCircle,
  faExclamationTriangle,
  faEye,
  faPenToSquare,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faShareSquare,
  faCheck,
  faClock,
  faFilter,
  faBook,
  faArchive,
  faPrint,
  faDownload,
  faIdCard,
  faMapMarker,
  faPhone,
  faEnvelope,
  faTrashAlt,
  faCheckCircle,
  faComment,
  faCheckSquare,
  faArrowLeft,
  faPencil,
  faIdBadge,
  faSave,
  faCubes,
  faMapMarked,
  faSquare,
  faHashtag,
  faTag,
  faImage,
  faProjectDiagram,
  faCalendar,
  faReact,
  faAsterisk,
  faDotCircle,
  faCalendarAlt,
  faEyeSlash,
  faEye,
  faFilePdf,
  faTimes
);

createApp(App)
  .use(router)
  .use(PrimeVue)
  .use(VueGoodTablePlugin)
  .use(VueDatePicker)
  .mount("#app");
