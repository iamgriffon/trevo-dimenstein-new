import router from '@/routes'
import env from '@/env.js'
import axios from 'axios'
import * as utf8 from 'utf-8'

const API_URL = env.API_URL // 'http://localhost:3000/api/'
const LOGIN_URL = API_URL + 'login/'
const GENERATE_TOKEN_URL = API_URL + 'generateLoginToken/'
const REGISTER_URL = API_URL + 'register/'
const EDIT_URL = API_URL + 'edit/'
const EXCLUDE_URL = API_URL + 'exclude/'
const CHANGE_PASSWORD_URL = API_URL + 'change_password/'
const PASSWORD_RECOVER_URL = API_URL + 'password_recover/'

const REGISTER_GROUP_URL = API_URL + 'group/register'
const EDIT_GROUP_URL = API_URL + 'group/edit'
const EXCLUDE_GROUP_URL = API_URL + 'group/exclude'

const REGISTER_FACILITY_URL = API_URL + 'facility/register/'
const EDIT_FACILITY_URL = API_URL + 'facility/edit/'
const EXCLUDE_FACILITY_URL = API_URL + 'facility/exclude/'
const REMOVE_FACILITY_BACKGROUND_IMAGE_URL = API_URL + 'facility/removeBackgroundImage'
const REMOVE_FACILITY_LOGO_URL = API_URL + 'facility/removeLogo'

const REGISTER_DOCUMENT_URL = API_URL + 'document/register/'
const EDIT_DOCUMENT_URL = API_URL + 'document/edit/'
const SIGN_DOCUMENT_URL = API_URL + 'document/sign/'
const LIBERATE_DOCUMENT_URL = API_URL + 'document/liberate/'
const EXCLUDE_DOCUMENT_URL = API_URL + 'document/exclude/'
const SCHEDULE_EMAIL_DOCUMENT_URL = API_URL + 'document/scheduleEmail/'

const REGISTER_FACILITY_ROUTINE_RADMATMOV_URL = API_URL + 'facility/routines/radioactiveMaterialMovement/register/'
const EDIT_FACILITY_ROUTINE_RADMATMOV_URL = API_URL + 'facility/routines/radioactiveMaterialMovement/edit/'
const EXCLUDE_FACILITY_ROUTINE_RADMATMOV_URL = API_URL + 'facility/routines/radioactiveMaterialMovement/exclude/'

const REGISTER_FACILITY_ROUTINE_SOLIDWASTEMANAGEMENT_URL = API_URL + 'facility/routines/solidWasteManagement/register/'
const UPDATE_FACILITY_ROUTINE_SOLIDWASTEMANAGEMENT_URL = API_URL + 'facility/routines/solidWasteManagement/update/'
const EXCLUDE_FACILITY_ROUTINE_SOLIDWASTEMANAGEMENT_URL = API_URL + 'facility/routines/solidWasteManagement/exclude/'

const REGISTER_FACILITY_ROUTINE_LIQUIDWASTEMANAGEMENT_URL = API_URL + 'facility/routines/liquidWasteManagement/register/'
const UPDATE_FACILITY_ROUTINE_LIQUIDWASTEMANAGEMENT_URL = API_URL + 'facility/routines/liquidWasteManagement/update/'
const EXCLUDE_FACILITY_ROUTINE_LIQUIDWASTEMANAGEMENT_URL = API_URL + 'facility/routines/liquidWasteManagement/exclude/'

const REGISTER_TYPE_OF_EQUIPMENT_URL = API_URL + 'typeOfEquipment/register'
const EDIT_TYPE_OF_EQUIPMENT_URL = API_URL + 'typeOfEquipment/edit'
const EXCLUDE_TYPE_OF_EQUIPMENT_URL = API_URL + 'typeOfEquipment/exclude'

const REGISTER_TYPE_OF_TEST_URL = API_URL + 'typeOfTest/register'
const EDIT_TYPE_OF_TEST_URL = API_URL + 'typeOfTest/edit'
const EXCLUDE_TYPE_OF_TEST_URL = API_URL + 'typeOfTest/exclude'

const REGISTER_TEST_URL = API_URL + 'test/register'
const EDIT_TEST_URL = API_URL + 'test/edit'
const EXCLUDE_TEST_URL = API_URL + 'test/exclude'

const REGISTER_EQUIPMENT_URL = API_URL + 'facility/equipment/register'
const EDIT_EQUIPMENT_URL = API_URL + 'facility/equipment/edit'
const EXCLUDE_EQUIPMENT_URL = API_URL + 'facility/equipment/exclude'
const REGISTER_DOSE_CALIBRATOR_SOURCE_URL = API_URL + 'equipment/doseCalibratorSources/register'
const EDIT_DOSE_CALIBRATOR_SOURCE_URL = API_URL + 'equipment/doseCalibratorSources/edit'
const EXCLUDE_DOSE_CALIBRATOR_SOURCE_URL = API_URL + 'equipment/doseCalibratorSources/exclude'

const REGISTER_DOSE_CALIBRATOR_DAILY_TEST_URL = API_URL + 'equipment/doseCalibratorDailyTests/register'
const EXCLUDE_DOSE_CALIBRATOR_DAILY_TEST_URL = API_URL + 'equipment/doseCalibratorDailyTests/exclude'

const REGISTER_DOSE_CALIBRATOR_LINEARITY_TEST_URL = API_URL + 'equipment/doseCalibratorLinearityTests/register'
const EDIT_DOSE_CALIBRATOR_LINEARITY_TEST_URL = API_URL + 'equipment/doseCalibratorLinearityTests/edit'
const UPDATE_DOSE_CALIBRATOR_LINEARITY_TEST_URL = API_URL + 'equipment/doseCalibratorLinearityTests/update'
const EXCLUDE_DOSE_CALIBRATOR_LINEARITY_TEST_URL = API_URL + 'equipment/doseCalibratorLinearityTests/exclude'

const REGISTER_DOSE_CALIBRATOR_ACCURACY_AND_PRECISION_TEST_URL = API_URL + 'equipment/doseCalibratorAccuracyAndPrecisionTests/register'
const EXCLUDE_DOSE_CALIBRATOR_ACCURACY_AND_PRECISION_TEST_URL = API_URL + 'equipment/doseCalibratorAccuracyAndPrecisionTests/exclude'

const REGISTER_DOSE_CALIBRATOR_GEOMETRY_TEST_URL = API_URL + 'equipment/doseCalibratorGeometryTests/register'
const EXCLUDE_DOSE_CALIBRATOR_GEOMETRY_TEST_URL = API_URL + 'equipment/doseCalibratorGeometryTests/exclude'

const REGISTER_GEIGER_COUNTER_REPRODUCTIBILITY_TEST_URL = API_URL + 'equipment/geigerCounterReproductibilityTests/register'
const EXCLUDE_GEIGER_COUNTER_REPRODUCTIBILITY_TEST_URL = API_URL + 'equipment/geigerCounterReproductibilityTests/exclude'

const REGISTER_GAMA_CAMARA_ASYMMETRIC_WINDOW_TEST_URL = API_URL + 'equipment/GamaCamaraAsymmetricWindowTests/register'
const EXCLUDE_GAMA_CAMARA_ASYMMETRIC_WINDOW_TEST_URL = API_URL + 'equipment/GamaCamaraAsymmetricWindowTests/exclude'
const UPDATE_GAMA_CAMARA_ASYMMETRIC_WINDOW_TEST_URL = API_URL + 'equipment/GamaCamaraAsymmetricWindowTests/update'

const REGISTER_GAMA_CAMARA_ANGULATION_TEST_URL = API_URL + 'equipment/GamaCamaraAngulationTests/register'
const EXCLUDE_GAMA_CAMARA_ANGULATION_TEST_URL = API_URL + 'equipment/GamaCamaraAngulationTests/exclude'
const UPDATE_GAMA_CAMARA_ANGULATION_TEST_URL = API_URL + 'equipment/GamaCamaraAngulationTests/update'

const REGISTER_EPI_EQUIPMENT_ASSESSMENT_TEST_URL = API_URL + 'equipment/epiEquipmentAssessmentTests/register'
const EXCLUDE_EPI_EQUIPMENT_ASSESSMENT_TEST_URL = API_URL + 'equipment/epiEquipmentAssessmentTests/exclude'
const UPDATE_EPI_EQUIPMENT_ASSESSMENT_TEST_URL = API_URL + 'equipment/epiEquipmentAssessmentTests/update'

const REPORT_URL = API_URL + 'reportproblem/'

export default {
  apiUrl() {
    return API_URL
  },

  saveToken(token) {
    localStorage.setItem('radmenu-token', token)
  },

  getToken() {
    return localStorage.getItem('radmenu-token')
  },

  login(context, creds, redirect) {
    axios.post(LOGIN_URL, creds)
      .then((res) => {
        this.saveToken(res.data.token)
        if (redirect) {
          router.push({ path: redirect })
        }
      })
      .catch((err) => {
        if (!err.response) {
          context.error = { message: ' Erro 500: Por favor, tente novamente mais tarde.', error: err, status: 500 }
        } else if (err.response.status === 401) {
          context.error = { message: err.response.data.message, error: err, status: err.response.status }
        }
      })
  },

  async generateToken(context, creds) {
    try {
      await axios.post(GENERATE_TOKEN_URL, creds)
    } catch (err) {
      if (!err.response) {
        context.error = {
          message: ' Erro 500: Por favor, tente novamente mais tarde.',
          error: err,
          status: 500
        }
      } else if (err.response.status === 401) {
        context.error = {
          message: err.response.data.message,
          error: err,
          status: err.response.status
        }
      }
    }
  },

  register(context, user, callback) {
    axios.post(REGISTER_URL, user, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  passwordRecover(context, user, redirect) {
    axios.post(PASSWORD_RECOVER_URL, user).then((res, error) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  registerGroup(context, group, callback) {
    axios.post(REGISTER_GROUP_URL, group, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  editGroup(context, group, callback) {
    axios.post(EDIT_GROUP_URL, group, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  excludeGroup(context, group, callback) {
    axios.post(EXCLUDE_GROUP_URL, group, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  registerFacility(context, facility, redirect) {
    axios.post(REGISTER_FACILITY_URL, facility, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  editFacility(context, facility, redirect) {
    axios.post(EDIT_FACILITY_URL, facility, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  editFacilityUsers(context, facility, callback) {
    axios.post(EDIT_FACILITY_URL, facility, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (callback) {
          callback()
        }
      }
    })
  },

  removeFacilityBackgroundImage(context, facilityId, callback) {
    var onlyFacilityId = { _id: facilityId }
    axios.post(REMOVE_FACILITY_BACKGROUND_IMAGE_URL, onlyFacilityId, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  removeFacilityLogo(context, facilityId, callback) {
    var onlyFacilityId = { _id: facilityId }
    axios.post(REMOVE_FACILITY_LOGO_URL, onlyFacilityId, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  excludeFacility(context, facility, redirect) {
    var onlyFacilityId = { _id: facility._id }

    axios.post(EXCLUDE_FACILITY_URL, onlyFacilityId, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  async registerDocument(context, doc, callback) {
    try {
      const request = axios.post(REGISTER_DOCUMENT_URL, doc, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' })
      if (callback) {
        callback()
      }
      return request
    } catch (error) {
      context.error = error
    }
  },

  editDocument(context, doc, callback) {
    axios.post(EDIT_DOCUMENT_URL, doc, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (callback) {
          callback()
        }
      }
    })
  },

  liberateDocument(context, doc, callback) {
    axios.post(LIBERATE_DOCUMENT_URL, doc, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (callback) {
          callback()
        }
      }
    })
  },

  signDocument(context, doc, callback) {
    axios.post(SIGN_DOCUMENT_URL, doc, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      console.log({ res }, { error })
      if (error) {
        context.error = error
      } else {
        if (callback) {
          callback()
        }
      }
    })
  },

  async signDocumentPromise(doc) {
    const response = await axios.post(SIGN_DOCUMENT_URL, doc, {
      headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data'
    })
    if (response.status === 200) {
      return response
    }
    return null
  },

  async liberateDocumentPromise(doc) {
    const response = await axios.post(LIBERATE_DOCUMENT_URL, doc, {
      headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data'
    })

    if (response.status === 200) {
      return response
    }
    return null
  },

  excludeDocument(context, docId, callback) {
    var onlyDocId = { _id: docId }

    axios.post(EXCLUDE_DOCUMENT_URL, onlyDocId, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  scheduleEmailDocument(context, docId, callback) {
    var onlyDocId = { _id: docId }

    axios.post(SCHEDULE_EMAIL_DOCUMENT_URL, onlyDocId, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  registerFacilityRoutineRadioactiveMaterialMovement(context, radMatMov, redirect) {
    axios.post(REGISTER_FACILITY_ROUTINE_RADMATMOV_URL, radMatMov, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  editFacilityRoutineRadioactiveMaterialMovement(context, radMatMov, redirect) {
    axios.post(EDIT_FACILITY_ROUTINE_RADMATMOV_URL, radMatMov, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  excludeRoutineRadioactiveMaterialMovement(context, rmmId, redirect) {
    axios.post(EXCLUDE_FACILITY_ROUTINE_RADMATMOV_URL, rmmId, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  registerFacilityRoutineSolidWasteManagement(context, radMatMov, redirect) {
    axios.post(REGISTER_FACILITY_ROUTINE_SOLIDWASTEMANAGEMENT_URL, radMatMov, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  liberateFacilityRoutineSolidWasteManagement(context, radMatMov, callback) {
    axios.post(UPDATE_FACILITY_ROUTINE_SOLIDWASTEMANAGEMENT_URL, radMatMov, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (callback) {
          callback()
        }
      }
    })
  },

  excludeFacilityRoutineSolidWasteManagement(context, rmmId, callback) {
    axios.post(EXCLUDE_FACILITY_ROUTINE_SOLIDWASTEMANAGEMENT_URL, rmmId, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (callback) {
          callback()
        }
      }
    })
  },

  registerFacilityRoutineLiquidWasteManagement(context, radMatMov, redirect) {
    axios.post(REGISTER_FACILITY_ROUTINE_LIQUIDWASTEMANAGEMENT_URL, radMatMov, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  liberateFacilityRoutineLiquidWasteManagement(context, radMatMov, callback) {
    axios.post(UPDATE_FACILITY_ROUTINE_LIQUIDWASTEMANAGEMENT_URL, radMatMov, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (callback) {
          callback()
        }
      }
    })
  },

  excludeFacilityRoutineLiquidWasteManagement(context, rmmId, callback) {
    axios.post(EXCLUDE_FACILITY_ROUTINE_LIQUIDWASTEMANAGEMENT_URL, rmmId, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (callback) {
          callback()
        }
      }
    })
  },

  registerTypeOfEquipment(context, typeOfEquipment, callback) {
    axios.post(REGISTER_TYPE_OF_EQUIPMENT_URL, typeOfEquipment, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  editTypeOfEquipment(context, typeOfEquipment, callback) {
    axios.post(EDIT_TYPE_OF_EQUIPMENT_URL, typeOfEquipment, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  excludeTypeOfEquipment(context, typeOfEquipment, callback) {
    axios.post(EXCLUDE_TYPE_OF_EQUIPMENT_URL, typeOfEquipment, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  registerTypeOfTest(context, typeOfTest, callback) {
    axios.post(REGISTER_TYPE_OF_TEST_URL, typeOfTest, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  editTypeOfTest(context, typeOfTest, callback) {
    axios.post(EDIT_TYPE_OF_TEST_URL, typeOfTest, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  excludeTypeOfTest(context, typeOfTest, callback) {
    axios.post(EXCLUDE_TYPE_OF_TEST_URL, typeOfTest, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  registerTest(context, test, callback) {
    axios.post(REGISTER_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  editTest(context, test, callback) {
    axios.post(EDIT_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  excludeTest(context, test, callback) {
    axios.post(EXCLUDE_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  async registerEquipment(context, equipment, redirect) {
    try {
      const request = await axios.post(REGISTER_EQUIPMENT_URL, equipment, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }) // .then((res, error) => {
      if (redirect) {
        router.push({ path: redirect })
      }
      return request.data.equipment
    } catch (error) {
      context.error = error
    }
  },

  editEquipment(context, equipment, redirect) {
    axios.post(EDIT_EQUIPMENT_URL, equipment, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  excludeEquipment(context, equipment, callback) {
    axios.post(EXCLUDE_EQUIPMENT_URL, equipment, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (callback) {
        callback()
      }
    },
      (err) => {
        context.error = err
      })
  },

  registerDoseCalibratorSource(context, source, redirect) {
    axios.post(REGISTER_DOSE_CALIBRATOR_SOURCE_URL, source, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  editDoseCalibratorSource(context, source, redirect) {
    axios.post(EDIT_DOSE_CALIBRATOR_SOURCE_URL, source, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  excludeDoseCalibratorSource(context, source, callback) {
    axios.post(EXCLUDE_DOSE_CALIBRATOR_SOURCE_URL, source, { headers: { Authorization: 'Bearer ' + this.getToken() }, 'Content-Type': 'multipart/form-data' }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (callback) {
          callback()
        }
      }
    })
  },

  registerDoseCalibratorDailyTest(context, test, redirect) {
    axios.post(REGISTER_DOSE_CALIBRATOR_DAILY_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  excludeDoseCalibratorDailyTest(context, test, callback) {
    axios.post(EXCLUDE_DOSE_CALIBRATOR_DAILY_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (callback) {
          callback()
        }
      }
    })
  },

  registerDoseCalibratorAccuracyAndPrecisionTest(context, test, redirect) {
    axios.post(REGISTER_DOSE_CALIBRATOR_ACCURACY_AND_PRECISION_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  excludeDoseCalibratorAccuracyAndPrecisionTest(context, test, redirect) {
    axios.post(EXCLUDE_DOSE_CALIBRATOR_ACCURACY_AND_PRECISION_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  registerDoseCalibratorLinearityTest(context, test, redirect) {
    axios.post(REGISTER_DOSE_CALIBRATOR_LINEARITY_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  editDoseCalibratorLinearityTest(context, test, redirect) {
    axios.post(EDIT_DOSE_CALIBRATOR_LINEARITY_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  finishDoseCalibratorLinearityTest(context, test, redirect) {
    axios.post(UPDATE_DOSE_CALIBRATOR_LINEARITY_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  excludeDoseCalibratorLinearityTest(context, test, redirect) {
    axios.post(EXCLUDE_DOSE_CALIBRATOR_LINEARITY_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  registerDoseCalibratorGeometryTest(context, test, redirect) {
    axios.post(REGISTER_DOSE_CALIBRATOR_GEOMETRY_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  excludeDoseCalibratorGeometryTest(context, test, redirect) {
    axios.post(EXCLUDE_DOSE_CALIBRATOR_GEOMETRY_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  registerGeigerCounterReproductibilityTest(context, test, redirect) {
    axios.post(REGISTER_GEIGER_COUNTER_REPRODUCTIBILITY_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      console.log(res)
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  excludeGeigerCounterReproductibilityTest(context, test, redirect) {
    axios.post(EXCLUDE_GEIGER_COUNTER_REPRODUCTIBILITY_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  registerGamaCamaraAsymmetricWindowTest(context, test, redirect) {
    axios.post(REGISTER_GAMA_CAMARA_ASYMMETRIC_WINDOW_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },
  excludeGamaCamaraAsymmetricWindowTest(context, test, redirect) {
    axios.post(EXCLUDE_GAMA_CAMARA_ASYMMETRIC_WINDOW_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },
  updateGamaCamaraAsymmetricWindowTest(context, test, redirect) {
    axios.post(UPDATE_GAMA_CAMARA_ASYMMETRIC_WINDOW_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  registerGamaCamaraAngulationTest(context, test, redirect) {
    axios.post(REGISTER_GAMA_CAMARA_ANGULATION_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },
  excludeGamaCamaraAngulationTest(context, test, redirect) {
    axios.post(EXCLUDE_GAMA_CAMARA_ANGULATION_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },
  updateGamaCamaraAngulationTest(context, test, redirect) {
    axios.post(UPDATE_GAMA_CAMARA_ANGULATION_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (error) {
        context.error = error
      } else {
        if (redirect) {
          router.push({ path: redirect })
        }
      }
    })
  },

  async registerEPIEquipmentAssessmentTest(test) {
    console.log('registerEpiEquipmentAssessmentTest:', { test })
    const response = axios.post(REGISTER_EPI_EQUIPMENT_ASSESSMENT_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } })
    if (response.status === 200) {
      return response
    }
    return null
  },

  async excludeEPIEquipmentAssessmentTest(test) {
    const response = axios.post(EXCLUDE_EPI_EQUIPMENT_ASSESSMENT_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } })
    if (response.status === 200) {
      return response
    }
    return null
  },

  async updateEPIEquipmentAssessmentTest(test) {
    const response = axios.post(UPDATE_EPI_EQUIPMENT_ASSESSMENT_TEST_URL, test, { headers: { Authorization: 'Bearer ' + this.getToken() } })
    if (response.status === 200) {
      return response
    }
    return null
  },

  reportProblem(context, report, redirect) {
    axios.post(REPORT_URL, report, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  edit(context, user, redirect) {
    axios.post(EDIT_URL, user, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  changePassword(context, user, redirect) {
    axios.post(CHANGE_PASSWORD_URL, user, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res, error) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    })
  },

  exclude(context, user, redirect) {
    axios.post(EXCLUDE_URL, user, { headers: { Authorization: 'Bearer ' + this.getToken() } }).then((res) => {
      if (redirect) {
        router.push({ path: redirect })
      }
    },
      (err) => {
        context.error = err
      })
  },

  logout() {
    localStorage.removeItem('radmenu-token')
    router.push({ path: '/' })
  },

  isLoggedIn() {
    if (this.getToken()) {
      var payload = JSON.parse(window.atob(this.getToken().split('.')[1]))
      return payload.exp > Date.now() / 1000
    } else {
      return false
    }
  },

  currentUser() {
    if (this.isLoggedIn()) {
      var token = this.getToken()
      var payload = JSON.parse(window.atob(token.split('.')[1]))
      return {
        id: payload.id,
        email: payload.email,
        name: utf8.decode(payload.name),
        type: payload.type
      }
    }
  }
}
