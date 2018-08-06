/**
 * # reducers
 *
 * This class combines all the reducers into one
 *
 */
'use strict'

import auth from './login/loginReducer'
import global from './global/globalReducer'
import preloader from './pre-loader/preloaderReducer'
import home from './home/homeReducer'
import listing from './listing/listingReducer'
import jobDetails from './job-details/jobDetailsReducer'
import multipleOptionsAttribute from './multipleOptionsAttribute/multipleOptionsAttributeReducer'
import skuListing from './skulisting/skuListingReducer'
import payment from './payment/paymentReducer'
import upiPayment from './cardTypePaymentModules/upiPayment/upiPaymentReducer'
import payByLinkPayment from './cardTypePaymentModules/payByLinkPayment/payByLinkPaymentReducer'
import fixedSKU from './fixedSKU/fixedSKUReducer'
import signature from './signature/signatureReducer'
import formLayout from './form-layout/formLayoutReducer'
import array from './array/arrayReducer'
import sequence from './sequence/sequenceReducer'
import cashTenderingReducer from './cashTendering/cashTenderingReducer'
import dataStore from './dataStore/dataStoreReducer'
import transientStatus from './transientStatus/transientReducer'
import saveActivated from './saveActivated/saveActivatedReducer'
import statistics from './statistics/statisticsReducer'
import bulk from './bulk/bulkReducer'
import profileReducer from './profile/profileReducer'
import sorting from './sorting/sortingReducer'
import taskList from './taskList/taskListReducer'
import liveJobList from './liveJobListing/liveJobListingReducer'
import liveJob from './liveJob/liveJobReducer'

import { combineReducers } from 'redux'
import summary from './summary/summaryReducer'
import customApp from './customApp/customAppReducers'
import postAssignment from './postAssignment/postAssignmentReducer'
import qrCodeReducer from './qrCodeGenerator/qrCodeReducer'
import offlineDS from './offlineDS/offlineDSReducer'
import cameraReducer from './camera/cameraReducer'
import dataStoreFilterReducer from './dataStoreFilter/dataStoreFilterReducer'
import backup from './backup/backupReducer'
import mosambeeWalletPayment from './cardTypePaymentModules/mosambeeWalletPayment/mosambeeWalletReducer'
import bluetooth from './bluetooth/bluetoothReducer'
import messageReducer from './message/messageReducer'
import qc from './qc/qcReducer'

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const rootReducer = combineReducers({
  auth,
  global,
  home,
  jobDetails,
  skuListing,
  listing,
  payment,
  preloader,
  upiPayment,
  payByLinkPayment,
  fixedSKU,
  signature,
  formLayout,
  array,
  sequence,
  cashTenderingReducer,
  dataStore,
  transientStatus,
  saveActivated,
  statistics,
  bulk,
  profileReducer,
  sorting,
  taskList,
  liveJobList,
  liveJob,
  summary,
  customApp,
  postAssignment,
  qrCodeReducer,
  offlineDS,
  cameraReducer,
  dataStoreFilterReducer,
  backup,
  multipleOptionsAttribute,
  mosambeeWalletPayment,
  bluetooth,
  messageReducer,
  qc
})

export default rootReducer