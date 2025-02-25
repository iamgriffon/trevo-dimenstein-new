import { createRouter, createWebHistory } from "vue-router";

// import Home from '@/components/Home.vue'
// import LoginPage from '@/components/LoginPage.vue'

import BaseDashboard from "@/pages/dashboard/Base.vue";
import Panel from "@/pages/dashboard/Panel.vue";

// import Users from '@/components/dashboard/user/List.vue'
// import User from '@/components/dashboard/user/User.vue'
// import EditUser from '@/components/dashboard/user/Edit.vue'
// import EditUsersFacilities from '@/components/dashboard/user/EditUsersFacilities.vue'
// import ChangePassword from '@/components/dashboard/user/ChangePassword.vue'
import PasswordRecovery from "@/components/user/PasswordRecovery.vue";
// import RegisterUser from '@/components/dashboard/user/Register.vue'

import Facilities from "@/components/dashboard/facility/List.vue";
// import Facility from '@/components/dashboard/facility/Facility.vue'
// import FacilityInfo from '@/components/dashboard/facility/Info.vue'
// import FacilityDocuments from '@/components/dashboard/facility/Document.vue'
// import RegisterFacility from '@/components/dashboard/facility/Register.vue'
// import EditFacility from '@/components/dashboard/facility/Edit.vue'

// import FacilityRoutines from '@/components/dashboard/facility/routines/List.vue'
// import FacilityRoutinesRadioactiveMaterialMovement from '@/components/dashboard/facility/routines/radioactiveMaterialMovement/List.vue'
// import FacilityRoutinesRadioactiveMaterialMovementRegister from '@/components/dashboard/facility/routines/radioactiveMaterialMovement/Register.vue'
// import FacilityRoutinesRadioactiveMaterialMovementEdit from '@/components/dashboard/facility/routines/radioactiveMaterialMovement/Edit.vue'
// import FacilityRoutinesSolidWasteManagement from '@/components/dashboard/facility/routines/solidWasteManagement/List.vue'
// import FacilityRoutinesSolidWasteManagementRegister from '@/components/dashboard/facility/routines/solidWasteManagement/Register.vue'
// import FacilityRoutinesLiquidWasteManagement from '@/components/dashboard/facility/routines/liquidWasteManagement/List.vue'
// import FacilityRoutinesLiquidWasteManagementRegister from '@/components/dashboard/facility/routines/liquidWasteManagement/Register.vue'

// import FacilityEquipments from '@/components/dashboard/facility/equipments/List.vue'
// import FacilityEquipmentsByType from '@/components/dashboard/facility/equipments/ListByType.vue'
// import FacilityEquipmentsRegister from '@/components/dashboard/facility/equipments/Register.vue'
// import FacilityEquipmentsEdit from '@/components/dashboard/facility/equipments/Edit.vue'

// import EPIEquipmentAssessmentTestList from '@/components/dashboard/facility/equipments/epiEquipment/tests/assessment/List.vue'
// import EPIEquipmentAssessmentTestRegister from '@/components/dashboard/facility/equipments/epiEquipment/tests/assessment/Register.vue'
// import EPIEquipmentAssessmentTestEdit from '@/components/dashboard/facility/equipments/epiEquipment/tests/assessment/Edit.vue'

// import DoseCalibrator from '@/components/dashboard/facility/equipments/doseCalibrator/Equipment.vue'
// import DoseCalibratorSourceRegister from '@/components/dashboard/facility/equipments/doseCalibrator/source/Register.vue'
// import DoseCalibratorSourceEdit from '@/components/dashboard/facility/equipments/doseCalibrator/source/Edit.vue'

// import DoseCalibratorLinearityTestList from '@/components/dashboard/facility/equipments/doseCalibrator/tests/linearity/List.vue'
// import DoseCalibratorLinearityTest from '@/components/dashboard/facility/equipments/doseCalibrator/tests/linearity/Linearity.vue'
// import DoseCalibratorLinearityTestRegister from '@/components/dashboard/facility/equipments/doseCalibrator/tests/linearity/Register.vue'
// import DoseCalibratorLinearityTestEdit from '@/components/dashboard/facility/equipments/doseCalibrator/tests/linearity/Edit.vue'

// import DoseCalibratorAccuracyAndPrecisionTestList from '@/components/dashboard/facility/equipments/doseCalibrator/tests/accuracyAndPrecision/List.vue'
// import DoseCalibratorAccuracyAndPrecisionTest from '@/components/dashboard/facility/equipments/doseCalibrator/tests/accuracyAndPrecision/AccuracyAndPrecision.vue'
// import DoseCalibratorAccuracyAndPrecisionTestRegister from '@/components/dashboard/facility/equipments/doseCalibrator/tests/accuracyAndPrecision/Register.vue'

// import DoseCalibratorGeometryTestList from '@/components/dashboard/facility/equipments/doseCalibrator/tests/geometry/List.vue'
// import DoseCalibratorGeometryTest from '@/components/dashboard/facility/equipments/doseCalibrator/tests/geometry/Geometry.vue'
// import DoseCalibratorGeometryTestRegister from '@/components/dashboard/facility/equipments/doseCalibrator/tests/geometry/Register.vue'

// import DoseCalibratorDailyTestList from '@/components/dashboard/facility/equipments/doseCalibrator/tests/daily/List.vue'
// import DoseCalibratorDailyTestRegister from '@/components/dashboard/facility/equipments/doseCalibrator/tests/daily/Register.vue'

// import GeigerCounter from '@/components/dashboard/facility/equipments/geigerCounter/Equipment.vue'
// import GeigerCounterReproductibilityTestList from '@/components/dashboard/facility/equipments/geigerCounter/tests/reproductibility/List.vue'
// import GeigerCounterReproductibilityTestRegister from '@/components/dashboard/facility/equipments/geigerCounter/tests/reproductibility/Register.vue'
// import GeigerCounterReproductibilityTest from '@/components/dashboard/facility/equipments/geigerCounter/tests/reproductibility/Reproductibility.vue'

// import GamaCamara from '@/components/dashboard/facility/equipments/gamaCamara/Equipment.vue'
// import GamaCamaraAsymmetricWindowList from '@/components/dashboard/facility/equipments/gamaCamara/tests/asymmetricWindow/List.vue'
// import GamaCamaraAsymmetricWindowRegister from '@/components/dashboard/facility/equipments/gamaCamara/tests/asymmetricWindow/Register.vue'
// import GamaCamaraAsymmetricWindow from '@/components/dashboard/facility/equipments/gamaCamara/tests/asymmetricWindow/AsymmetricWindow.vue'
// import GamaCamaraAngulationList from '@/components/dashboard/facility/equipments/gamaCamara/tests/angulation/List.vue'
// import GamaCamaraAngulationRegister from '@/components/dashboard/facility/equipments/gamaCamara/tests/angulation/Register.vue'
// import GamaCamaraAngulation from '@/components/dashboard/facility/equipments/gamaCamara/tests/angulation/Angulation.vue'

// import Equipment from '@/components/dashboard/facility/equipments/Equipment.vue'
// import Test from '@/components/dashboard/facility/equipments/tests/Test.vue'
// import TestRegister from '@/components/dashboard/facility/equipments/tests/Register.vue'
// import TestRegisterOld from '@/components/dashboard/facility/equipments/tests/Register_old.vue'
// import TestEdit from '@/components/dashboard/facility/equipments/tests/Edit.vue'

// import Doc from '@/components/dashboard/document/List.vue'
// import RegisterDoc from '@/components/dashboard/document/Register.vue'

// import Information from '@/components/dashboard/information/Information.vue'
// import TermsOfUse from '@/components/dashboard/information/TermsOfUse.vue'

// import Settings from '@/components/dashboard/settings/Settings.vue'

import auth from "@/services/authentication";
import App from "./App.vue";
import Home from "./pages/Home.vue";

export const hideMenu = false;

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  linkActiveClass: "text-green-700 bg-gray-200 border-r-4 border-r-green-500",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      beforeEnter: (to, from, next) => {
        if (auth.isLoggedIn()) {
          next({ path: "/panel", component: Panel });
        } else {
          next();
        }
      },
    },
    {
      path: "/passwordrecover",
      name: "PasswordRecover",
      component: PasswordRecovery,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: BaseDashboard,
      beforeEnter: (to, from, next) => {
        if (!auth.isLoggedIn()) {
          next({ path: "/" });
        } else {
          next();
        }
      },
      children: [
        // { path: '/settings', component: Settings },
        { path: "/panel", component: Panel },
        //   ]
        // }
        //       { path: '/user', component: Users },
        //       { path: '/user/:id', component: User },
        //       { path: '/user/:id/edit',
        //         component: EditUser,
        //         beforeEnter: (to, from, next) => {
        //           var currentUser = auth.currentUser()

        //           if (auth.currentUser().type === 'administrador' || auth.currentUser().type === 'rad laudos' || auth.currentUser().type === 'rad fisico' || auth.currentUser().type === 'rad admin' || currentUser.id === to.params.id) {
        //             next()
        //           } else {
        //             alert('Você não possui autorização para editar este usuário.')
        //             next({ path: '/user/', component: User })
        //           }
        //         }
        //       },
        //       { path: '/user/:id/facilities',
        //         component: EditUsersFacilities,
        //         beforeEnter: (to, from, next) => {
        //           if (auth.currentUser().type === 'administrador' || auth.currentUser().type === 'rad laudos' || auth.currentUser().type === 'rad fisico' || auth.currentUser().type === 'rad admin') {
        //             next()
        //           } else {
        //             alert('Você não possui autorização para editar este usuário.')
        //             next({ path: '/user/', component: User })
        //           }
        //         }
        //       },
        //       { path: '/user/:id/edit/password',
        //         component: ChangePassword,
        //         beforeEnter: (to, from, next) => {
        //           if (auth.currentUser().type === 'administrador' || auth.currentUser().type === 'rad laudos' || auth.currentUser().type === 'rad fisico' || auth.currentUser().type === 'rad admin' || auth.currentUser().id === to.params.id) {
        //             next()
        //           } else {
        //             alert('Você não possui autorização para editar este usuário.')
        //             next({ path: '/user/', component: User })
        //           }
        //         }
        //       },
        //       { path: '/users/register',
        //         component: RegisterUser,
        //         beforeEnter: (to, from, next) => {
        //           if (auth.currentUser().type === 'administrador' || auth.currentUser().type === 'rad laudos' || auth.currentUser().type === 'rad fisico' || auth.currentUser().type === 'rad admin') {
        //             next()
        //           } else {
        //             alert('Você não possui autorização para criar usuários.')
        //             next({ path: '/user/', component: User })
        //           }
        //         }
        //       },
        { path: "/facility", component: Facilities },
        { path: "/facility/nuclearmedicine", component: Facilities },
        { path: "/facility/radiodiagnosis", component: Facilities },
      ],
      //       { path: '/facilities/register',
      //         component: RegisterFacility,
      //         beforeEnter: (to, from, next) => {
      //           if (auth.currentUser().type === 'administrador' || auth.currentUser().type === 'rad laudos' || auth.currentUser().type === 'rad fisico' || auth.currentUser().type === 'rad admin') {
      //             next()
      //           } else {
      //             alert('Você não possui autorização para criar instalações.')
      //             next({ path: '/facility/', component: Facilities })
      //           }
      //         }
      //       },
      //       { path: '/facility/:id/edit',
      //         component: EditFacility,
      //         beforeEnter: (to, from, next) => {
      //           if (auth.currentUser().type === 'administrador' || auth.currentUser().type === 'rad laudos' || auth.currentUser().type === 'rad fisico' || auth.currentUser().type === 'rad admin') {
      //             next()
      //           } else {
      //             alert('Você não possui permissão para editar para instalações.')
      //             next({ path: '/facility/', component: Facilities })
      //           }
      //         }
      //       },
      //       { path: '/facility/:id', component: Facility },
      //       { path: '/facility/:id/info', component: FacilityInfo },
      //       { path: '/facility/:id/documents', component: FacilityDocuments },
      //       { path: '/facility/:id/equipments', component: FacilityEquipments },
      //       { path: '/facility/:id/equipments/:typeId', component: FacilityEquipmentsByType },
      //       { path: '/facility/:id/equipment/register', component: FacilityEquipmentsRegister },
      //       { path: '/facility/:facilityId/equipment/:equipmentId/edit', component: FacilityEquipmentsEdit },

      //       // this will have to change in case of creating EPI Equipment routes
      //       { path: '/equipments/epi', component: EPIEquipmentAssessmentTestList },
      //       { path: '/equipments/epi/register', component: EPIEquipmentAssessmentTestRegister },
      //       { path: '/equipments/epi/:equipmentId/:testId/:id/edit', component: EPIEquipmentAssessmentTestEdit },

      //       { path: '/equipments/doseCalibrator/:id', component: DoseCalibrator },

      //       { path: '/equipments/doseCalibrator/:equipmentId/source/:sourceId/edit', component: DoseCalibratorSourceEdit },
      //       { path: '/equipments/doseCalibrator/:id/source/register', component: DoseCalibratorSourceRegister },

      //       { path: '/equipments/doseCalibrator/:id/linearity', component: DoseCalibratorLinearityTestList },
      //       { path: '/equipments/doseCalibrator/:id/linearity/register/', component: DoseCalibratorLinearityTestRegister },
      //       { path: '/equipments/doseCalibrator/:equipmentId/linearity/:testId', component: DoseCalibratorLinearityTest },
      //       { path: '/equipments/doseCalibrator/:equipmentId/linearity/:testId/edit', component: DoseCalibratorLinearityTestEdit },

      //       { path: '/equipments/doseCalibrator/:id/accuracyandprecision', component: DoseCalibratorAccuracyAndPrecisionTestList },
      //       { path: '/equipments/doseCalibrator/:id/accuracyandprecision/register/', component: DoseCalibratorAccuracyAndPrecisionTestRegister },
      //       { path: '/equipments/doseCalibrator/:equipmentId/accuracyandprecision/:testId', component: DoseCalibratorAccuracyAndPrecisionTest },

      //       { path: '/equipments/doseCalibrator/:id/geometry', component: DoseCalibratorGeometryTestList },
      //       { path: '/equipments/doseCalibrator/:id/geometry/register/', component: DoseCalibratorGeometryTestRegister },
      //       { path: '/equipments/doseCalibrator/:equipmentId/geometry/:testId', component: DoseCalibratorGeometryTest },

      //       { path: '/equipments/doseCalibrator/:id/daily/register/', component: DoseCalibratorDailyTestRegister },
      //       { path: '/equipments/doseCalibrator/:id/daily/:year', component: DoseCalibratorDailyTestList },

      //       { path: '/equipments/geigerCounter/:id', component: GeigerCounter },
      //       { path: '/equipments/geigerCounter/:id/reproductibility', component: GeigerCounterReproductibilityTestList },
      //       { path: '/equipments/geigerCounter/:id/reproductibility/register/', component: GeigerCounterReproductibilityTestRegister },
      //       { path: '/equipments/geigerCounter/:equipmentId/reproductibility/:testId', component: GeigerCounterReproductibilityTest },

      //       { path: '/equipments/gamaCamara/:id', component: GamaCamara },
      //       { path: '/equipments/gamaCamara/:id/asymmetricWindow', component: GamaCamaraAsymmetricWindowList },
      //       { path: '/equipments/gamaCamara/:id/asymmetricWindow/register', component: GamaCamaraAsymmetricWindowRegister },
      //       { path: '/equipments/gamaCamara/:equipmentId/asymmetricWindow/:testId', component: GamaCamaraAsymmetricWindow },
      //       { path: '/equipments/gamaCamara/:id/angulation', component: GamaCamaraAngulationList },
      //       { path: '/equipments/gamaCamara/:id/angulation/register', component: GamaCamaraAngulationRegister },
      //       { path: '/equipments/gamaCamara/:equipmentId/angulation/:testId', component: GamaCamaraAngulation },

      //       { path: '/equipments/:typeId/:id', component: Equipment },
      //       { path: '/equipments/:typeId/:equipmentId/:id', component: Test },
      //       { path: '/equipments/:typeId/:equipmentId/:id/register', component: TestRegister },
      //       { path: '/equipments/:typeId/:equipmentId/:id/register-old', component: TestRegisterOld },
      //       { path: '/equipments/:typeId/:equipmentId/:testId/:id/edit', component: TestEdit },

      //       { path: '/facility/:id/routines', component: FacilityRoutines },
      //       { path: '/facility/:id/routines/radioactivematerialmov', component: FacilityRoutinesRadioactiveMaterialMovement },
      //       { path: '/facility/:id/routines/radioactivematerialmov/register', component: FacilityRoutinesRadioactiveMaterialMovementRegister },
      //       { path: '/facility/:facilityId/routines/radioactivematerialmov/:radioactiveMaterialMovementId/edit', component: FacilityRoutinesRadioactiveMaterialMovementEdit },
      //       { path: '/facility/:id/routines/solidwastemanagement/:year', component: FacilityRoutinesSolidWasteManagement },
      //       { path: '/facility/:id/routines/solidwastemanagement/register/:tagnumber', component: FacilityRoutinesSolidWasteManagementRegister },
      //       { path: '/facility/:id/routines/liquidwastemanagement/register/', component: FacilityRoutinesLiquidWasteManagementRegister },
      //       { path: '/facility/:id/routines/liquidwastemanagement/:year', component: FacilityRoutinesLiquidWasteManagement },
      //       { path: '/document', component: Doc },
      //       { path: '/document/register',
      //         component: RegisterDoc,
      //         beforeEnter: (to, from, next) => {
      //           if (auth.currentUser().type === 'administrador' || auth.currentUser().type === 'rad laudos' || auth.currentUser().type === 'rad fisico' || auth.currentUser().type === 'rad admin') {
      //             next()
      //           } else {
      //             alert('Você não possui autorização para criar documentos.')
      //             next({ path: '/document/', component: Doc })
      //           }
      //         }
      //       },
      //       { path: '/document/:status', component: Doc },
      //       { path: '/info', component: Information },
      //       { path: '/terms', component: TermsOfUse }
      //     ]
      //   }
    },
  ],
});

export default router;
