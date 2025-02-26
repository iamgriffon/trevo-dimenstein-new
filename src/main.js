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
  faPlus
} from "@fortawesome/free-solid-svg-icons";

import VueGoodTablePlugin from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";

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
  faPlus
);

createApp(App).use(router).use(VueGoodTablePlugin).mount("#app");
